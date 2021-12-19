import {
  BLOCKS_PER_YEAR,
  MARKET_DENOMS,
  queryInterestModelBorrowRate,
  queryMarketBorrowerInfo,
  queryMarketEpochState,
  queryMarketState,
  queryOverseerWhitelist,
} from '@anchor-protocol/anchor.js'
import { Mirror } from '@mirror-protocol/mirror.js'
import { Coin, Int } from '@terra-money/terra.js'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import last from 'lodash/last'
import { AssetTypes, AvailableAsset, StakingInfo, Validator } from '../types/assets'
import {
  anchorAddressProvider,
  anchorApiUrl,
  anchorClient,
  colleteralsInfo,
  mirrorGraphqlUrl,
  mirrorOptions,
  terraFCDUrl,
  terraLCDClient,
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
            query assets($interval: Float!, $from: Float!, $to: Float!) {
              assets {
                name
                symbol
                description
                prices {
                  price
                  priceAt(timestamp: $from)
                  oraclePrice
                  oraclePriceAt(timestamp: $from)
                  history(interval: $interval, from: $from, to: $to) {
                    timestamp
                    price
                  }
                }
              }
            }
          `,
        variables: {
          from: now - 24 * 3600 * 1000,
          to: now,
          interval: 60,
        },
      }),
    }).then((r) => r.json())
    return result.data.assets.map((a: any) => ({
      type: a.symbol === 'MIR' ? AssetTypes.Tokens : AssetTypes.Investments,
      name: a.name,
      symbol: a.symbol,
      coin: { denom: a.symbol },
      image: `https://whitelist.mirror.finance/icon/${a.symbol.replace(/^m/, '')}.png`,
      description: a.description,
      price: Number(a.prices.price || a.prices.oraclePrice),
      prevPrice: Number(a.prices.priceAt || a.prices.oraclePriceAt),
      priceHistories: a.prices.history.map((p: any) => ({
        ...p,
        price: Number(p.price),
      })),
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
    const userBalance = await anchorClient.earn.getTotalDeposit({
      market,
      address,
    })
    const apr = await anchorClient.earn.getAPY({
      market,
    })
    result.push({
      denom: market.replace(/^u/, 'a'),
      amount: (Number(userBalance) * 10 ** 6).toString(),
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
  const [price, prevPrice] = await fetch(`${anchorApiUrl}/v1/collaterals/1d`).then((r) => r.json())
  return elems.map((c) => ({
    type: AssetTypes.Collaterals,
    name: c.name,
    symbol: c.symbol,
    coin: { denom: c.symbol },
    image: get(colleteralsInfo, `${c.symbol}.img`, ''),
    description: '',
    price: Number(
      get(
        price.collaterals.find((cc: any) => cc.symbol.toUpperCase() === c.symbol),
        'price',
        0
      )
    ),
    prevPrice: Number(
      get(
        prevPrice.collaterals.find((cc: any) => cc.symbol.toUpperCase() === c.symbol),
        'price',
        0
      )
    ),
  }))
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
  const market_balance = get(marketBalance, '_coins.uusd.amount', new Int()).toString()

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
    collaterals: collaterals.map((c) => ({
      denom: c.collateral.symbol,
      amount: String(Number(c.balance.notProvided) + Number(c.balance.provided)),
      extra: c,
    })),
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
  return result.map((r) => ({ denom: r.denom, price: usd.amount.toNumber() / r.amount.toNumber() }))
}

export const fetchStakingInfo = async (address: string) => {
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
  const total = await terraLCDClient.market.swapRate(
    new Coin('uluna', Number(stakingResult.rewards.total)),
    'uusd'
  )
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
