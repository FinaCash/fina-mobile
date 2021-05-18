import { Currencies } from './misc'

export enum AssetTypes {
  Currents = 'currents',
  Savings = 'savings',
  Stocks = 'stocks',
  Cryptos = 'cryptos',
}

export interface Asset {
  type: AssetTypes
  name: string
  description: string
  symbol: string
  image: string
  coin: {
    denom: Currencies
    amount: string
  }
  apy?: number
}
