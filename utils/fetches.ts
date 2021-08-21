import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import { Mirror } from '@mirror-protocol/mirror.js'
import { Coin } from '@terra-money/terra.js'
import { AssetTypes } from '../types/assets'
import { anchorClient, mirrorGraphqlUrl, mirrorOptions, terraLCDClient } from './terraConfig'

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
      type: AssetTypes.Investments,
      name: a.name,
      symbol: a.symbol,
      image: `https://whitelist.mirror.finance/icon/${a.symbol.replace(/^m/, '')}.png`,
      description: a.description,
      price: Number(a.prices.price || a.prices.oraclePrice) * 10 ** 6,
      prevPrice: Number(a.prices.priceAt || a.prices.oraclePriceAt) * 10 ** 6,
      priceHistories: a.prices.history.map((p: any) => ({
        ...p,
        price: Number(p.price) * 10 ** 6,
      })),
    }))
  } catch (err) {
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
  } catch (err) {
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

export const fetchAvailableCurrencies = async () => {
  const result = await terraLCDClient.oracle.activeDenoms()
  return result
}

export const fetchCoingeckoPrice = async (id: string) => {
  const result = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`
  ).then((r) => r.json())
  return result[id]
}
