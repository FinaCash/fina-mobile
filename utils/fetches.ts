import {
  BLOCKS_PER_YEAR,
  MARKET_DENOMS,
  queryInterestModelBorrowRate,
  queryMarketEpochState,
  queryMarketState,
} from '@anchor-protocol/anchor.js'
import { Mirror } from '@mirror-protocol/mirror.js'
import { Int } from '@terra-money/terra.js'
import get from 'lodash/get'
import { AssetTypes } from '../types/assets'
import {
  anchorAddressProvider,
  anchorApiUrl,
  anchorClient,
  mirrorGraphqlUrl,
  mirrorOptions,
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
      price: Number(a.prices.price || a.prices.oraclePrice) * 10 ** 6,
      prevPrice: Number(a.prices.priceAt || a.prices.oraclePriceAt) * 10 ** 6,
      priceHistories: a.prices.history.map((p: any) => ({
        ...p,
        price: Number(p.price) * 10 ** 6,
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
  }
}

export const fetchAassetRate = async (market: MARKET_DENOMS) => {
  const response = await queryMarketEpochState({ lcd: terraLCDClient as any, market })
  const result = await response(anchorAddressProvider)
  return Number(result.exchange_rate)
}

export const fetchAvailableCurrencies = async () => {
  const result = await terraLCDClient.oracle.activeDenoms()
  return result
}
