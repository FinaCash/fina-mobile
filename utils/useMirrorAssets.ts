import React from 'react'
import { AssetTypes, MirrorAsset } from '../types/assets'
import { mirrorGraphqlUrl } from './terraConfig'

const useMirrorAssets = (variables: {
  from: number
  to: number
  interval: number
}): MirrorAsset[] => {
  const [data, setData] = React.useState<MirrorAsset[]>([])

  const fetchAssets = React.useCallback(async () => {
    try {
      const result = await fetch(mirrorGraphqlUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query assets($from: Float!, $to: Float!, $interval: Float!) {
              assets {
                token
                name
                description
                symbol
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
          variables,
        }),
      }).then((r) => r.json())
      setData(
        result.data.assets.map((a: any) => ({
          type: AssetTypes.Investments,
          name: a.name,
          symbol: a.symbol,
          description: a.description,
          contract: a.token,
          price: Number(a.prices.price || a.prices.oraclePrice) * 10 ** 6,
          prevPrice: Number(a.prices.priceAt || a.prices.oraclePriceAt) * 10 ** 6,
          priceHistories: a.prices.history.map((p: any) => ({
            ...p,
            price: Number(p.price) * 10 ** 6,
          })),
        }))
      )
    } catch (err) {
      console.log(err)
    }
  }, [variables])

  React.useEffect(() => {
    fetchAssets()
  }, [])

  return data
}

export default useMirrorAssets
