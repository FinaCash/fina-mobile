import React from 'react'
import get from 'lodash/get'
import { terraFCDUrl } from '../utils/terraConfig'
import { Recipient } from '../types/recipients'
import { useAccountsContext } from './AccountsContext'
import { Transaction, TxMsg, TxMsgTypes } from '../types/transactions'

const transformMsg = (msg: any) => {
  // TODO
}

const transformTx = (tx: any): Transaction => {
  return {
    hash: tx.txhash,
    timestamp: new Date(tx.timestamp).getTime(),
    msgs: [],
    fee: get(tx, 'tx.value.fee.amount', []),
  }
}

interface TransactionsState {
  transactions: Recipient[]
  getTransactions(): void
}

const initialState: TransactionsState = {
  transactions: [],
  getTransactions: () => null,
}

const TransactionsContext = React.createContext<TransactionsState>(initialState)

const TransactionsProvider: React.FC = ({ children }) => {
  const { address } = useAccountsContext()
  const [offset, setOffset] = React.useState(0)
  const [transactions, setTransactions] = React.useState(initialState.transactions)

  const getTransactions = React.useCallback(
    async (refresh?: boolean) => {
      const result = await fetch(
        `${terraFCDUrl}/v1/txs?account=${address}${!refresh && offset ? `&offset=${offset}` : ''}`
      ).then((r) => r.json())
      setOffset(refresh ? 0 : result.next)
      const newTxs = result.txs.map(transformTx)
      setTransactions((txs) => (refresh ? newTxs : [...txs, ...newTxs]))
    },
    [address, offset]
  )

  // On logout
  React.useEffect(() => {
    if (!address) {
      setTransactions(initialState.transactions)
    }
  }, [address, setTransactions])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        getTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

const useTransactionsContext = (): TransactionsState => React.useContext(TransactionsContext)

export { TransactionsProvider, useTransactionsContext }
