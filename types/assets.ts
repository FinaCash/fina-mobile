import { Currencies } from './misc'

export enum AssetTypes {
  Currents = 'currents',
  Savings = 'savings',
  Investments = 'investments',
  // Cryptos = 'cryptos',
}

export interface Asset {
  type: AssetTypes
  coin: {
    denom: Currencies
    amount: string
  }
  apy?: number
}

export interface MirrorAsset {
  type: AssetTypes.Investments
  name: string
  symbol: string
  description: string
  price: number
  prevPrice: number
  priceHistories: Array<{
    timestamp: number
    price: number
  }>
}
