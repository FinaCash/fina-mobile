import {
  BLOCKS_PER_YEAR,
  MARKET_DENOMS,
  queryInterestModelBorrowRate,
  queryMarketBorrowerInfo,
  queryMarketEpochState,
  queryMarketState,
  queryOverseerWhitelist,
  queryTokenBalance,
} from '@anchor-protocol/anchor.js'
import { Mirror } from '@mirror-protocol/mirror.js'
import { Coin, Int } from '@terra-money/terra.js'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import last from 'lodash/last'
import keyBy from 'lodash/keyBy'
import { AssetTypes, AvailableAsset, Farm, FarmType, StakingInfo, Validator } from '../types/assets'
import {
  anchorAddressProvider,
  anchorApiUrl,
  anchorClient,
  astroApiUrl,
  astroportGeneratorContract,
  colleteralsInfo,
  mirrorGraphqlUrl,
  mirrorOptions,
  nonUstFarms,
  supportedTokens,
  terraFCDUrl,
  terraHiveUrl,
  terraLCDClient,
  terraLCDUrl,
  terraMantleUrl,
} from './terraConfig'

export const fetchAvailableMirrorAssets = async () => {
  try {
    const now = Date.now()
    const result = await fetch(mirrorGraphqlUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query: `
            query assets($prevTimestamp: Float!) {
              assets {
                name
                symbol
                prices {
                  price
                  priceAt(timestamp: $prevTimestamp)
                  oraclePrice
                  oraclePriceAt(timestamp: $prevTimestamp)
                }
              }
            }
          `,
        variables: {
          prevTimestamp: now - 24 * 3600 * 1000,
        },
      }),
    }).then((r) => r.json())
    return result.data.assets
      .filter((a: any) => a.symbol !== 'MIR')
      .map((a: any) => ({
        type: AssetTypes.Investments,
        name: a.name,
        symbol: a.symbol,
        coin: { denom: a.symbol },
        image: `https://whitelist.mirror.finance/icon/${a.symbol.replace(/^m/, '')}.png`,
        price: Number(a.prices.price || a.prices.oraclePrice),
        prevPrice: Number(a.prices.priceAt || a.prices.oraclePriceAt),
      }))
  } catch (err: any) {
    console.log(err)
  }
}

export const fetchMirrorBalance = async (address: string) => {
  try {
    const result = await fetch(mirrorGraphqlUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query: `
            query balances($address: String!) {
              balances(address: $address) {
                token
                balance
                averagePrice
              }
            }
          `,
        variables: {
          address,
        },
      }),
    }).then((r) => r.json())
    const mirror = new Mirror(mirrorOptions)
    const mAssets = result.data.balances
      .map((b: any) => {
        const asset = Object.values(mirror.assets).find((a) => a.token.contractAddress === b.token)
        return asset ? { denom: asset.symbol, amount: b.balance } : null
      })
      .filter((a: any) => a)
    return mAssets
  } catch (err: any) {
    console.log(err)
  }
}

export const fetchAnchorBalances = async (address: string) => {
  const result = []
  // const markets = Object.values(MARKET_DENOMS)
  const markets = [MARKET_DENOMS.UUSD]
  for (let i = 0; i < markets.length; i += 1) {
    const market = markets[i]
    const tokenBalance = await queryTokenBalance({
      lcd: terraLCDClient,
      address,
      token_address: anchorAddressProvider.aTerra(/* market */),
    })(anchorAddressProvider)
    const apr = await anchorClient.earn.getAPY({
      market,
    })
    result.push({
      denom: market.replace(/^u/, 'a'),
      amount: tokenBalance.balance,
      apr,
    })
  }
  const ancBalance = await anchorClient.anchorToken.getBalance(address)
  if (Number(ancBalance) > 0) {
    result.push({
      denom: 'ANC',
      amount: (Number(ancBalance) * 10 ** 6).toString(),
    })
  }
  return result
}

export const fetchAvailableCollaterals = async (): Promise<AvailableAsset[]> => {
  const { elems } = await (
    await queryOverseerWhitelist({ lcd: terraLCDClient, market: MARKET_DENOMS.UUSD })
  )(anchorAddressProvider)
  const {
    data: { oraclePrices },
  } = await fetch(`${terraMantleUrl}/?borrow--market`, {
    method: 'POST',
    body: JSON.stringify({
      query: `
        {
          oraclePrices: WasmContractsContractAddressStore(
            ContractAddress: "terra1cgg6yef7qcdm070qftghfulaxmllgmvk77nc7t"
            QueryMsg: "{\\"prices\\":{}}"
          ) {
            Result
            Height
          }
        }        
        `,
      variables: {},
    }),
  }).then((r) => r.json())
  const { prices } = JSON.parse(oraclePrices.Result)

  return elems
    .filter((c) => !!(colleteralsInfo as any)[c.symbol])
    .map((c) => {
      const symbol = get(colleteralsInfo, `${c.symbol}.symbol`, '')
      const price =
        Number(
          prices.find((p: any) => p.asset === get(colleteralsInfo, `${c.symbol}.token`, ''))?.price
        ) || 0
      return {
        type: AssetTypes.Collaterals,
        name: c.name,
        symbol: c.symbol,
        displaySymbol: symbol,
        coin: { denom: c.symbol },
        image: get(colleteralsInfo, `${c.symbol}.image`, ''),
        price,
      }
    })
}

export const fetchAnchorCollaterals = async (address: string) => {
  const collaterals = await anchorClient.borrow.getCollaterals({
    market: MARKET_DENOMS.UUSD,
    address,
  })
  const collateralValue =
    collaterals
      .map((c) => Number(c.balance.provided) * Number(c.collateral.price))
      .reduce((a, b) => a + b, 0) /
    10 ** 6
  const borrowLimit = await anchorClient.borrow.getBorrowLimit({
    market: MARKET_DENOMS.UUSD,
    address,
  })
  const borrowedValue = await anchorClient.borrow.getBorrowedValue({
    market: MARKET_DENOMS.UUSD,
    address,
  })
  const { total_liabilities, total_reserves } = (await (
    await queryMarketState({ lcd: terraLCDClient } as any)
  )(anchorAddressProvider)) as any
  const marketBalance = await terraLCDClient.bank.balance(anchorAddressProvider.market())
  const market_balance = get(marketBalance, '[0]._coins.uusd.amount', new Int()).toString()
  const interestModelBorrowRate = await (
    await queryInterestModelBorrowRate({
      lcd: terraLCDClient,
      total_liabilities,
      total_reserves,
      market_balance,
    } as any)
  )(anchorAddressProvider)

  const { distribution_apy: rewardsRate } = await fetch(`${anchorApiUrl}/v2/distribution-apy`).then(
    (r) => r.json()
  )

  const { pending_rewards: pendingRewards } = await (
    await queryMarketBorrowerInfo({
      lcd: terraLCDClient,
      market: MARKET_DENOMS.UUSD,
      borrower: address,
    } as any)
  )(anchorAddressProvider)

  return {
    collaterals: collaterals
      .map((c) => ({
        denom: c.collateral.symbol,
        amount: String(Number(c.balance.notProvided) + Number(c.balance.provided)),
        extra: c,
      }))
      .filter((c) => !!(colleteralsInfo as any)[c.denom]),
    collateralValue,
    borrowLimit: Number(borrowLimit),
    borrowedValue: Number(borrowedValue),
    borrowRate: BLOCKS_PER_YEAR * Number(interestModelBorrowRate.rate),
    rewardsRate: Number(rewardsRate),
    pendingRewards: Number(pendingRewards),
  }
}

export const fetchAassetRate = async (market: MARKET_DENOMS) => {
  const response = await queryMarketEpochState({ lcd: terraLCDClient as any, market })
  const result = await response(anchorAddressProvider)
  return Number(result.exchange_rate)
}

export const fetchAvailableCurrencies = async () => {
  const result = await terraLCDClient.oracle.exchangeRates()
  const usd = result.get('uusd')!
  const currencies = result.map((r) => ({
    denom: r.denom,
    price: usd.amount.toNumber() / r.amount.toNumber(),
  }))
  const austRate = await queryMarketEpochState({ lcd: terraLCDClient, market: MARKET_DENOMS.UUSD })(
    anchorAddressProvider
  )
  return [...currencies, { denom: 'ausd', price: Number(austRate.exchange_rate), hidden: true }]
}

export const fetchLunaStakingInfo = async (address: string) => {
  const stakingResult = await fetch(`${terraFCDUrl}/v1/staking/${address}`).then((r) => r.json())
  const stakingReturn = await fetch(`${terraFCDUrl}/v1/dashboard/staking_return`).then((r) =>
    r.json()
  )
  const validators: Validator[] = stakingResult.validators.map((v: any) => ({
    address: v.operatorAddress,
    name: v.description.moniker,
    image: v.description.profileIcon,
    commission: Number(v.commissionInfo.rate),
    votingPower: Number(v.votingPower.weight),
    active: v.status === 'active',
  }))
  const delegated = stakingResult.myDelegations
    .filter((d: any) => Number(d.amountDelegated) > 0)
    .map((d: any) => ({
      validator: validators.find((v) => v.address === d.validatorAddress),
      amount: Number(d.amountDelegated),
    }))
  const redelegating = flatten(
    stakingResult.redelegations.map((r: any) =>
      r.entries.map((e: any) => ({ ...e, redelegation: r.redelegation }))
    )
  ).map((r: any) => ({
    fromValidator: validators.find((v) => v.address === r.redelegation.validator_src_address)!,
    toValidator: validators.find((v) => v.address === r.redelegation.validator_dst_address)!,
    amount: Number(r.balance),
    completion: new Date(r.redelegation_entry.completion_time).getTime(),
  }))
  const unbonding = stakingResult.undelegations.map((u: any) => ({
    validator: validators.find((v) => v.address === u.validatorAddress),
    amount: Number(u.amount),
    completion: new Date(u.releaseTime).getTime(),
  }))
  const rewards = stakingResult.rewards.denoms.map((r: any) => ({ ...r, amount: Number(r.amount) }))
  const total = Number(stakingResult.rewards.total)
    ? await terraLCDClient.market.swapRate(
        new Coin('uluna', Number(stakingResult.rewards.total)),
        'uusd'
      )
    : { amount: { toNumber: () => 0 } }
  const totalRewards = total.amount.toNumber()

  const stakingInfo: StakingInfo = {
    delegated,
    redelegating,
    unbonding,
    rewards,
    totalRewards,
    stakingApr: Number((last(stakingReturn) as any).annualizedReturn),
  }
  return { stakingInfo, validators }
}

export const fetchFarmingInfo = async (address: string): Promise<Farm[]> => {
  const {
    data: { assets },
  } = await fetch(mirrorGraphqlUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `
          query assets {
            assets {
              symbol
              token
              pair
              lpToken
              positions {
                pool
                uusdPool
                lpShares
              }
              statistic{
                apr {
                  long
                  short
                }
                minCollateralRatio
              }
            }
          }
        `,
    }),
  }).then((r) => r.json())
  const {
    data: {
      WasmContractsContractAddressStore: { Result: rewardsResult },
    },
  } = await fetch(`${terraMantleUrl}?stakingRewardInfo`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query WasmContractsContractAddressStore($contract: String, $msg: String) {
          WasmContractsContractAddressStore(
            ContractAddress: $contract
            QueryMsg: $msg
          ) {
            Height
            Result
          }
        }
      `,
      variables: {
        contract: mirrorOptions.staking,
        msg: JSON.stringify({
          reward_info: {
            staker_addr: address,
          },
        }),
      },
    }),
  }).then((r) => r.json())
  const { data: tokenRewardsInfo } = await fetch(terraHiveUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        {
          ${[...Object.values(supportedTokens).filter((t) => !!t.addresses.lpToken), ...nonUstFarms]
            .map(
              (t) => `
            ${t.addresses.lpToken}: wasm {
              contractQuery(
                contractAddress: "${astroportGeneratorContract}"
                query: {
                  pending_token: {
                    lp_token: "${t.addresses.lpToken}"
                    user: "${address}"
                  }
                }
              )
            }
          `
            )
            .reduce((a, b) => a + b, '')}
        }
      `,
    }),
  }).then((r) => r.json())
  const { data: tokensInfo } = await fetch(terraHiveUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        {
          ${[...Object.values(supportedTokens).filter((t) => !!t.addresses.lpToken), ...nonUstFarms]
            .map(
              (t) => `
                ${t.addresses.lpToken}: wasm {
                  contractQuery(
                    contractAddress: "${astroportGeneratorContract}"
                    query: {
                      deposit: {
                        lp_token: "${t.addresses.lpToken}"
                        user: "${address}"
                      }
                    }
                  )
                }
                ${t.addresses.pair}: wasm {
                  contractQuery(
                    contractAddress: "${t.addresses.pair}"
                    query: {
                      pool: { }
                    }
                  )
                }
              `
            )
            .reduce((a, b) => a + b, '')}
        }
      `,
    }),
  }).then((r) => r.json())
  const {
    data: { pools },
  } = await fetch(astroApiUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query {
          pools {
            pool_address
            total_rewards {
              apr
            }
          }
        }
      `,
    }),
  }).then((r) => r.json())
  const astroRewardsInfo = keyBy(pools, 'pool_address')

  const rewardsInfo = keyBy(JSON.parse(rewardsResult).reward_infos, 'asset_token')

  const sortedMAssets = assets
    .filter((a: any) => a.symbol !== 'MIR')
    .sort((a: any, b: any) => (a.symbol > b.symbol ? 1 : -1))
  const farms = [
    ...[
      ...Object.values(supportedTokens).filter(
        (s) => !nonUstFarms.find((n) => n.symbol === s.symbol) && !!s.addresses.lpToken
      ),
      ...nonUstFarms,
    ].map((a: any) => ({
      type: FarmType.Long,
      symbol: a.symbol,
      dex: 'Astroport',
      addresses: a.addresses,
      rate: {
        token:
          Number(
            get(
              tokensInfo,
              [a.addresses.pair, 'contractQuery', 'assets', a.denom === 'uluna' ? 1 : 0, 'amount'],
              0
            )
          ) / Number(get(tokensInfo, [a.addresses.pair, 'contractQuery', 'total_share'], 1)),
        pairToken:
          Number(
            get(
              tokensInfo,
              [a.addresses.pair, 'contractQuery', 'assets', a.denom === 'uluna' ? 0 : 1, 'amount'],
              0
            )
          ) / Number(get(tokensInfo, [a.addresses.pair, 'contractQuery', 'total_share'], 1)),
      },
      apr: Number(get(astroRewardsInfo, [a.addresses.pair, 'total_rewards', 'apr'], 0)),
      balance: Number(get(tokensInfo, [a.addresses.lpToken, 'contractQuery'], 0)),
      rewards: [
        {
          denom: a.proxyRewardTokenDenom || a.denom,
          amount:
            Number(
              get(tokenRewardsInfo, [a.addresses.lpToken, 'contractQuery', 'pending_on_proxy'], '0')
            ) *
            10 ** (6 - (supportedTokens[a.proxyRewardTokenDenom || a.denom]?.digits || 6)),
        },
        {
          denom: 'ASTRO',
          amount: Number(
            get(tokenRewardsInfo, [a.addresses.lpToken, 'contractQuery', 'pending'], '0')
          ),
        },
      ].filter((a: any) => a.amount > 0),
      pairSymbol: a.pairSymbol || 'UST',
      pairDenom: a.pairDenom || 'uusd',
    })),
    ...sortedMAssets.map((a: any) => ({
      type: FarmType.Long,
      symbol: a.symbol,
      dex: 'Mirror',
      addresses: {
        token: a.token,
        lpToken: a.lpToken,
        pair: a.pair,
      },
      rate: {
        token: Number(a.positions.pool) / Number(a.positions.lpShares),
        pairToken: Number(a.positions.uusdPool) / Number(a.positions.lpShares),
      },
      apr: Number(a.statistic.apr.long),
      balance: Number(get(rewardsInfo, [a.token, 'bond_amount'], 0)),
      rewards: [get(rewardsInfo, [a.token, 'pending_reward'], 0)]
        .filter((a: any) => a > 0)
        .map((a) => ({ amount: Number(a), denom: 'MIR' })),
      pairSymbol: 'UST',
      pairDenom: 'uusd',
    })),
    // ...sortedMAssets.map((a: any) => ({
    //   type: FarmType.Short,
    //   symbol: a.symbol,
    //   dex: 'Mirror',
    //   addresses: {
    //     token: a.token,
    //     lpToken: a.lpToken,
    //     pair: a.pair,
    //   },
    //   rate: {
    //     token: 1,
    //     ust: 0,
    //   },
    //   apr: Number(a.statistic.apr.short),
    //   // TODO
    //   balance: 0,
    //   rewards: [],
    // })),
  ]
  return farms
}

export const fetchOtherTokensBalance = async (address: string) => {
  const otherTokens = Object.values(supportedTokens).filter(
    (t) => !['LUNA', 'ANC', 'MIR'].includes(t.symbol)
  )
  const otherTokensBalances = await Promise.all(
    otherTokens.map((t) =>
      fetch(
        `${terraLCDUrl}/wasm/contracts/${t.addresses.token}/store?query_msg={"balance":{"address":"${address}"}}`
      ).then((r) => r.json())
    )
  )
  return otherTokens
    .map((o, i) => ({
      denom: o.denom,
      amount: get(otherTokensBalances, [i, 'result', 'balance'], '0') * 10 ** (6 - (o.digits || 6)),
    }))
    .filter((o) => Number(o.amount) > 0)
}
