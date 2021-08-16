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
  rewards?: {
    denom: string
    amount: string
  }
  apr?: number
  autoCompound?: boolean
}

export interface AvailableAsset {
  type: AssetTypes.Investments | AssetTypes.Tokens
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
