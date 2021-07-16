import groupBy from 'lodash/groupBy'
import { terraLCDClient as terra } from './terraConfig'
import { Coin } from '@terra-money/terra.js'
import get from 'lodash/get'
import { Asset, AssetTypes, MirrorAsset } from '../types/assets'
import { Currencies } from '../types/misc'

export const transformCoinsToAssets = async (
  coins: Array<{ amount: string; denom: string; apy?: number }>,
  availableMirrorAssets: MirrorAsset[],
  currency: Currencies
): Promise<Asset[]> => {
  const assets = coins
    .map((coin) => {
      switch (coin.denom) {
        case 'uusd':
        case 'ujpy':
        case 'ueur':
        case 'uhkd':
        case 'ukrw':
          const symbol = coin.denom.replace(/^u/, '').slice(0, 2).toUpperCase() + 'T'
          return {
            type: AssetTypes.Currents,
            coin,
            name: 'Terra ' + coin.denom.replace(/^u/, '').toUpperCase(),
            symbol,
            image: `https://assets.terra.money/icon/60/${symbol}.png`,
          }
        case 'ausd':
          return {
            type: AssetTypes.Savings,
            coin: {
              amount: coin.amount,
              denom: 'uusd',
            },
            name: 'Anchor USD',
            symbol: 'aUST',
            image: `https://whitelist.anchorprotocol.com/logo/aUST.png`,
            apy: coin.apy,
          }
        case 'uluna':
          // TODO
          return null
        default:
          const mAsset = availableMirrorAssets.find((a) => a.symbol === coin.denom)
          return {
            type: AssetTypes.Investments,
            coin,
            name: get(mAsset, 'name', ''),
            symbol: get(mAsset, 'symbol', ''),
            image: get(mAsset, 'image', ''),
          }
      }
    })
    .filter((a) => a) as Asset[]
  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i]
    if (asset.type === AssetTypes.Investments) {
      // TODO: this is USD value only
      const mAsset = availableMirrorAssets.find((a) => a.symbol === asset.coin.denom)
      asset.worth = {
        denom: currency,
        amount: (((mAsset ? mAsset.price : 0) * Number(asset.coin.amount)) / 10 ** 6).toString(),
      }
    } else if (asset.coin.denom === currency) {
      asset.worth = asset.coin
    } else {
      const rate = await terra.market.swapRate(
        new Coin(asset.coin.denom, asset.coin.amount),
        currency
      )
      asset.worth = {
        denom: rate.denom,
        amount: rate.amount.toString(),
      }
    }
  }
  return assets
}

export const transformAssetsToDistributions = (assets: Asset[]) => {
  const groupedAssets = groupBy(assets, 'type')
  const result: { [type: string]: number } = {}
  for (let type in AssetTypes) {
    const assetType = (AssetTypes as any)[type]
    for (let i in groupedAssets[assetType]) {
      const asset = groupedAssets[assetType][i]
      result[assetType as AssetTypes] =
        (result[assetType as AssetTypes] || 0) + Number(asset.worth.amount)
    }
  }
  return Object.keys(result).map((type) => ({
    type,
    value: result[type as AssetTypes],
  }))
}
