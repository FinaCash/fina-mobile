export enum AssetTypes {
  Currents = 'currents',
  Savings = 'savings',
  Investments = 'investments',
  Tokens = 'tokens',
  Collaterals = 'collaterals',
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
  // Collateral
  provided?: number
  notProvided?: number
  maxLtv?: number
}

export interface AvailableAsset {
  type: AssetTypes.Investments | AssetTypes.Tokens | AssetTypes.Collaterals
  name: string
  symbol: string
  coin: { denom: string }
  image: string
  description: string
  price: number
  prevPrice: number
  priceHistories?: Array<{
    timestamp: number
    price: number
  }>
}

export interface BorrowInfo {
  collateralValue: number
  borrowLimit: number
  borrowedValue: number
  borrowRate: number
  rewardsRate: number
  pendingRewards: number
}
