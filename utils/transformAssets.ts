import groupBy from 'lodash/groupBy'
import { colleteralsInfo, supportedTokens } from './terraConfig'
import get from 'lodash/get'
import { Asset, AssetTypes, AvailableAsset } from '../types/assets'
import { UserCollateral } from '@anchor-protocol/anchor.js'

export const getCurrencyFromDenom = (denom: string) => denom.slice(1).toUpperCase()
export const getSymbolFromDenom = (denom: string) =>
  (supportedTokens as any)[denom]
    ? (supportedTokens as any)[denom].symbol
    : denom.replace(/^u/, '').slice(0, 2).toUpperCase() + 'T'

export const getCurrentAssetDetail = (
  coin: {
    denom: string
    amount: string
  },
  price?: number
): Asset => {
  const symbol = getSymbolFromDenom(coin.denom)
  return {
    type: AssetTypes.Currents,
    coin,
    name: 'Terra ' + getCurrencyFromDenom(coin.denom),
    symbol,
    image: `https://assets.terra.money/icon/600/${symbol}.png`,
    price: price || 0,
  }
}

export const getMAssetDetail = (
  coin: { denom: string; amount: string },
  availableAssets: AvailableAsset[]
): Asset | null => {
  const mAsset = availableAssets.find((a) => a.symbol === coin.denom)
  if (!mAsset) {
    return null
  }
  return {
    type: coin.denom === 'MIR' ? AssetTypes.Tokens : AssetTypes.Investments,
    coin,
    name: get(mAsset, 'name', ''),
    symbol: get(mAsset, 'symbol', ''),
    image: get(mAsset, 'image', ''),
    price: mAsset.price,
  }
}

export const getSavingAssetDetail = (
  coin: {
    denom: string
    amount: string
    apr?: number
  },
  price?: number
): Asset => {
  const symbol = `a${coin.denom.slice(1, coin.denom.length - 1).toUpperCase()}T`
  return {
    type: AssetTypes.Savings,
    coin,
    name: `Anchor ${getCurrencyFromDenom(coin.denom)}`,
    symbol,
    image: `https://whitelist.anchorprotocol.com/logo/${symbol}.png`,
    apr: coin.apr,
    autoCompound: true,
    price: price || 0,
  }
}

export const getTokenAssetDetail = (
  coin: { denom: string; amount: string; apr?: number },
  availableAssets?: AvailableAsset[]
): Asset | null => {
  const token = (supportedTokens as any)[coin.denom]
  if (!token) {
    return null
  }
  const availableAsset = availableAssets
    ? availableAssets.find((a) => a.symbol === token.symbol)
    : undefined
  return {
    type: AssetTypes.Tokens,
    coin,
    name: token.name,
    symbol: token.symbol,
    image: token.image,
    apr: coin.apr,
    price: availableAsset ? availableAsset.price : 0,
  }
}

export const getCollateralAssetDetail = (coin: {
  denom: string
  amount: string
  extra: UserCollateral
}): Asset => {
  return {
    type: AssetTypes.Collaterals,
    coin: {
      denom: coin.denom,
      amount: coin.amount,
    },
    name: coin.extra.collateral.name,
    symbol: coin.extra.collateral.symbol,
    image: (colleteralsInfo as any)[coin.extra.collateral.symbol].img,
    price: Number(coin.extra.collateral.price),
    provided: Number(coin.extra.balance.provided),
    notProvided: Number(coin.extra.balance.notProvided),
    maxLtv: Number(coin.extra.collateral.max_ltv),
  }
}

export const transformCoinsToAssets = async (
  coins: Array<{
    amount: string
    denom: string
    apr?: number
    extra?: any // For collateral
  }>,
  availableAssets: AvailableAsset[],
  availableCurrencies: { denom: string; price: number }[]
): Promise<Asset[]> => {
  const assets: Asset[] = []
  for (let i = 0; i < coins.length; i += 1) {
    const coin = coins[i]
    let asset
    if (Object.keys(supportedTokens).includes(coin.denom)) {
      asset = getTokenAssetDetail(coin, availableAssets)
    } else if (coin.denom.match(/^u/)) {
      const rate = availableCurrencies.find((a) => a.denom === coin.denom)!
      asset = getCurrentAssetDetail(coin, rate.price)
    } else if (coin.denom.match(/^a/)) {
      const rate = availableCurrencies.find((a) => a.denom === coin.denom.replace(/^a/, 'u'))!
      asset = getSavingAssetDetail(coin, rate.price)
    } else if (coin.denom.match(/^B/)) {
      asset = getCollateralAssetDetail(coin as any)
    } else {
      asset = getMAssetDetail(coin, availableAssets)
    }
    if (asset) {
      assets.push(asset)
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
        (result[assetType as AssetTypes] || 0) + asset.price * Number(asset.coin.amount)
    }
  }
  return result
}
