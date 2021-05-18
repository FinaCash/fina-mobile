import groupBy from 'lodash/groupBy'
import terra from './terraClient'
import { Coin } from '@terra-money/terra.js'
import { Asset, AssetTypes } from '../types/assets'
import { Currencies } from '../types/misc'
import { formatCurrency } from './formatNumbers'

export const transformCoinsToAssets = (
  coins: Array<{ amount: string; denom: string }>
): Asset[] => {
  return coins
    .map((coin) => {
      switch (coin.denom) {
        case 'uusd':
          return {
            type: 'currents',
            name: 'USD',
            description: 'Terra USD (UST)',
            symbol: '$',
            image: 'https://www.worldometers.info/img/flags/small/tn_us-flag.gif',
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
  const result: { [type in AssetTypes]: number } = {
    [AssetTypes.Currents]: 0,
    [AssetTypes.Savings]: 0,
    [AssetTypes.Stocks]: 0,
    [AssetTypes.Cryptos]: 0,
  }
  for (let type in AssetTypes) {
    const assetType = (AssetTypes as any)[type]
    for (let i in groupedAssets[assetType]) {
      const asset = groupedAssets[assetType][i]
      const { denom, amount } = (asset as unknown as Asset).coin
      const rate =
        denom === currency
          ? new Coin(denom, amount)
          : await terra.market.swapRate(new Coin(denom, amount), currency)
      result[assetType as AssetTypes] += Number(rate.amount)
    }
  }
  return Object.keys(result).map((type) => ({
    type,
    value: result[type as AssetTypes],
  }))
}

export const transformAssetsToSections = (assets: Asset[]) =>
  Object.values(AssetTypes).map((type) => ({
    title: type,
    data: assets
      .filter((a) => a.type === type)
      .map((a) => ({
        title: a.name,
        subtitle: a.description,
        image: a.image,
        value: formatCurrency(a.coin.amount, a.coin.denom),
      })),
  }))
