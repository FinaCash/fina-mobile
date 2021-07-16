import { Coin } from '@terra-money/terra.js'

export enum AssetTypes {
  Currents = 'currents',
  Savings = 'savings',
  Investments = 'investments',
  Tokens = 'tokens',
}

export interface Asset {
  type: AssetTypes
  name: string
  symbol: string
  image: string
  coin: {
    denom: string
    amount: string
  }
  worth?: {
    denom: string
    amount: string
  }
  apy?: number
}

export interface MirrorAsset {
  type: AssetTypes.Investments
  name: string
  symbol: string
  image: string
  description: string
  price: number
  prevPrice: number
  priceHistories: Array<{
    timestamp: number
    price: number
  }>
}
