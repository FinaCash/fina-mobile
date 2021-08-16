import groupBy from 'lodash/groupBy'
import { supportedTokens, terraLCDClient as terra } from './terraConfig'
import { Coin } from '@terra-money/terra.js'
import get from 'lodash/get'
import { Asset, AssetTypes, AvailableAsset } from '../types/assets'

export const getCurrencyFromDenom = (denom: string) => denom.slice(1).toUpperCase()
export const getSymbolFromDenom = (denom: string) =>
  denom === 'uluna' ? 'LUNA' : denom.replace(/^u/, '').slice(0, 2).toUpperCase() + 'T'

export const getCurrentAssetDetail = (coin: { denom: string; amount: string }) => {
  const symbol = getSymbolFromDenom(coin.denom)
  return {
    type: AssetTypes.Currents,
    coin,
    name: 'Terra ' + getCurrencyFromDenom(coin.denom),
    symbol,
    image: `https://assets.terra.money/icon/600/${symbol}.png`,
  }
}

export const getMAssetDetail = (
  coin: { denom: string; amount: string },
  availableAssets: AvailableAsset[]
) => {
  const mAsset = availableAssets.find((a) => a.symbol === coin.denom)
  return {
    type: coin.denom === 'MIR' ? AssetTypes.Tokens : AssetTypes.Investments,
    coin,
    name: get(mAsset, 'name', ''),
    symbol: get(mAsset, 'symbol', ''),
    image: get(mAsset, 'image', ''),
  }
}

export const getSavingAssetDetail = (coin: { denom: string; amount: string; apr?: number }) => {
  const symbol = `a${coin.denom.slice(1, coin.denom.length - 1).toUpperCase()}T`
  return {
    type: AssetTypes.Savings,
    coin,
    name: `Anchor ${getCurrencyFromDenom(coin.denom)}`,
    symbol,
    image: `https://whitelist.anchorprotocol.com/logo/${symbol}.png`,
    apr: coin.apr,
    autoCompound: true,
  }
}

export const getTokenAssetDetail = (coin: { denom: string; amount: string; apr?: number }) => {
  const token = (supportedTokens as any)[coin.denom]
  if (!token) {
    return null
  }
  return {
    type: AssetTypes.Tokens,
    coin,
    name: token.name,
    symbol: token.symbol,
    image: token.image,
    apr: coin.apr,
  }
}

export const transformCoinsToAssets = async (
  coins: Array<{ amount: string; denom: string; apr?: number }>,
  availableAssets: AvailableAsset[],
  baseCurrency: string
): Promise<Asset[]> => {
  const assets = coins
    .map((coin) => {
      if (coin.denom === 'uluna') {
        return getTokenAssetDetail(coin)
      }
      if (coin.denom.match(/^u/)) {
        return getCurrentAssetDetail(coin)
      }
      if (coin.denom.match(/^a/)) {
        return getSavingAssetDetail(coin)
      }
      return getMAssetDetail(coin, availableAssets)
    })
    .filter((a) => a) as Asset[]
  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i]
    if (asset.type === AssetTypes.Investments || asset.coin.denom === 'MIR') {
      // TODO: this is USD value only
      const mAsset = availableAssets.find((a) => a.symbol === asset.coin.denom)
      asset.worth = {
        denom: baseCurrency,
        amount: (((mAsset ? mAsset.price : 0) * Number(asset.coin.amount)) / 10 ** 6).toString(),
      }
    } else if (asset.coin.denom.slice(-3) === baseCurrency.slice(-3)) {
      asset.worth = asset.coin
    } else {
      const rate = await terra.market.swapRate(
        new Coin(asset.coin.denom, asset.coin.amount),
        baseCurrency
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
        (result[assetType as AssetTypes] || 0) + Number(get(asset, 'worth.amount', 0))
    }
  }
  return result
}
