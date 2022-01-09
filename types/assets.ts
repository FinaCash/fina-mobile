export type WalletTypes = 'ledger' | 'seed' | 'private key'

export enum AssetTypes {
  Currents = 'currents',
  Savings = 'savings',
  Investments = 'investments',
  Tokens = 'tokens',
  Collaterals = 'collaterals',
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
  image: string
  coin: {
    denom: string
    amount: string
  }
  price: number // In USD
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
  price: number // In USD
  prevPrice: number
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

export interface Airdrop {
  coin: {
    denom: string
    amount: string
  }
  details: {
    stage: number
    amount: string
    proof: string
  }[]
}
