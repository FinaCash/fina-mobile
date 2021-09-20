export enum TxMsgTypes {
  Send = 'send',
  DepositSaving = 'deposit savings',
  WithdrawSaving = 'withdraw savings',
  Swap = 'swap',
  Buy = 'buy',
  Sell = 'sell',
}

export interface TxMsg {
  type: TxMsgTypes
  from: string
  to: string
  fromAmount: {
    denom: string
    amount: string
  }[]
  toAmount: {
    denom: string
    amount: string
  }[]
}

export interface Transaction {
  hash: string
  timestamp: number
  msgs: TxMsg[]
  fee: {
    denom: string
    amount: string
  }[]
}
