import React from 'react'
import { mirrorGraphqlUrl } from '../utils/terraConfig'
import { AssetTypes, MirrorAsset } from '../types/assets'

interface MirrorAssetsState {
  availableMirrorAssets: MirrorAsset[]
  fetchAvailableMirrorAssets(): void
  fetchMirrorBalance(
    address: string
  ): Promise<{ token: string; balance: string; averagePrice: string }[]>
}

const initialState: MirrorAssetsState = {
  availableMirrorAssets: [],
  fetchAvailableMirrorAssets: () => null,
  fetchMirrorBalance: () => Promise.resolve([]),
}

const MirrorAssetsContext = React.createContext<MirrorAssetsState>(initialState)

const MirrorAssetsProvider: React.FC = ({ children }) => {
  const [availableMirrorAssets, setAvailableMirrorAssets] = React.useState([])

  const fetchAvailableMirrorAssets = React.useCallback(async () => {
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
      setAvailableMirrorAssets(
        result.data.assets.map((a: any) => ({
          type: AssetTypes.Investments,
          name: a.name,
          symbol: a.symbol,
          image: `https://whitelist.mirror.finance/images/${a.symbol.replace(/^m/, '')}.png`,
          description: a.description,
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
  }, [])

  const fetchMirrorBalance = React.useCallback(async (address: string) => {
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
      return result.data.balances
    } catch (err) {
      console.log(err)
    }
  }, [])

  React.useEffect(() => {
    fetchAvailableMirrorAssets()
  }, [fetchAvailableMirrorAssets])

  return (
    <MirrorAssetsContext.Provider
      value={{
        availableMirrorAssets,
        fetchAvailableMirrorAssets,
        fetchMirrorBalance,
      }}
    >
      {children}
    </MirrorAssetsContext.Provider>
  )
}

const useMirrorAssetsContext = (): MirrorAssetsState => React.useContext(MirrorAssetsContext)

export { MirrorAssetsProvider, useMirrorAssetsContext }
