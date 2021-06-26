import groupBy from 'lodash/groupBy'
import terra from './terraClient'
import { Coin } from '@terra-money/terra.js'
import { Asset, AssetTypes } from '../types/assets'
import { Currencies } from '../types/misc'

export const transformCoinsToAssets = (
  coins: Array<{ amount: string; denom: string }>
): Asset[] => {
  return coins
    .map((coin) => {
      switch (coin.denom) {
        case 'uusd':
        case 'ujpy':
        case 'ueur':
        case 'uhkd':
        case 'ukrw':
          return {
            type: AssetTypes.Currents,
            coin,
          }
        default:
          return null
      }
    })
    .filter((a) => a) as Asset[]
}

export const transformAssetsToDistributions = async (assets: Asset[], currency: Currencies) => {
  const groupedAssets = groupBy(assets, 'type')
  const result: { [type: string]: number } = {}
  for (let type in AssetTypes) {
    const assetType = (AssetTypes as any)[type]
    for (let i in groupedAssets[assetType]) {
      const asset = groupedAssets[assetType][i]
      const { denom, amount } = (asset as unknown as Asset).coin
      const rate =
        denom === currency
          ? new Coin(denom, amount)
          : await terra.market.swapRate(new Coin(denom, amount), currency)
      result[assetType as AssetTypes] = (result[assetType as AssetTypes] || 0) + Number(rate.amount)
    }
  }
  return Object.keys(result).map((type) => ({
    type,
    value: result[type as AssetTypes],
  }))
}

export const transformAssetsToSections = (assets: Asset[]) =>
  Object.values(AssetTypes).map((type) => {
    const assetsForThisType = assets.filter((a) => a.type === type)
    return {
      title: type,
      data:
        type === AssetTypes.Savings && assetsForThisType.length === 0
          ? [
              {
                type: AssetTypes.Savings,
                coin: {
                  denom: Currencies.USD,
                  amount: '0',
                },
                apy: 0.2,
              },
            ]
          : assetsForThisType,
    }
  })
