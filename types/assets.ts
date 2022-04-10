export type WalletTypes = 'ledger' | 'seed' | 'private key'

export enum AssetTypes {
  Currents = 'currents',
  Savings = 'savings',
  Investments = 'investments',
  Tokens = 'tokens',
  Collaterals = 'collaterals',
  Farms = 'farms',
}

export interface Validator {
  address: string
  name: string
  image: string
  active: boolean
  commission: number
  votingPower: number
}

export interface Asset {
  type: AssetTypes
  name: string
  symbol: string
  displaySymbol?: symbol
  image: string
  coin: {
    denom: string
    amount: string
  }
  price: number // In USD
  apr?: number
  autoCompound?: boolean
  addresses?: {
    token: string
    lpToken: string
    pair: string
  }
  // Collateral
  provided?: number
  notProvided?: number
  maxLtv?: number
}

export interface AvailableAsset {
  type: AssetTypes.Investments | AssetTypes.Tokens | AssetTypes.Collaterals
  name: string
  symbol: string
  displaySymbol?: string
  coin: { denom: string }
  image: string
  price: number // In USD
  prevPrice?: number
  addresses?: {
    token: string
    lpToken: string
    pair: string
  }
}

export interface BorrowInfo {
  collateralValue: number
  borrowLimit: number
  borrowedValue: number
  borrowRate: number
  rewardsRate: number
  pendingRewards: number
}

export interface StakingInfo {
  delegated: {
    validator: Validator
    amount: number
  }[]
  redelegating: {
    fromValidator: Validator
    toValidator: Validator
    amount: number
    completion: number // Timestamp
  }[]
  unbonding: {
    validator: Validator
    amount: number
    completion: number // Timestamp
  }[]
  rewards: {
    amount: number
    denom: string
  }[]
  totalRewards: number // In USD
  stakingApr: number
}

export enum FarmType {
  Long = 'long farm',
  Short = 'short farm',
  Gov = 'gov staking',
}

export interface Farm {
  type: FarmType
  dex: string
  symbol: string
  addresses: {
    token: string
    lpToken: string
    pair: string
  }
  rate: {
    token: number
    ust: number
  }
  apr: number
  balance: number
  rewards: { amount: number; denom: string }[]
}
