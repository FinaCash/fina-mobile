import React from 'react'
import CryptoJS from 'crypto-js'
import usePersistedState from '../utils/usePersistedState'
import { Actions } from 'react-native-router-flux'
import { defaultHdPath } from '../utils/terraConfig'
import { WalletTypes } from '../types/assets'
import { MnemonicKey } from '@terra-money/terra.js'

interface AccountsState {
  id: string
  name: string
  address: string
  hdPath: number[]
  type: WalletTypes
  decryptSeedPhrase(password?: string): string
  loaded: boolean
  createAccount(
    name: string,
    seedPhrase?: string,
    password?: string,
    ledgerAddress?: string,
    hdPath?: number[]
  ): void
  deleteAccount(): void
  accounts: {
    id: string
    name: string
    address: string
    hdPath: number[]
    type: WalletTypes
    encryptedSeedPhrase: string
  }[]
}

const initialState: AccountsState = {
  id: '',
  name: '',
  address: '',
  hdPath: defaultHdPath,
  type: 'seed',
  loaded: false,
  createAccount: () => null,
  deleteAccount: () => null,
  decryptSeedPhrase: () => '',
  accounts: [],
}

const AccountsContext = React.createContext<AccountsState>(initialState)

const AccountsProvider: React.FC = ({ children }) => {
  const [accounts, setAccounts, loaded] = usePersistedState('accounts', initialState.accounts, {
    secure: true,
  })
  const [currenctAccountId, setCurrenctAccountId] = usePersistedState('currenctAccountId', '')

  const { id, address, name, type, hdPath, encryptedSeedPhrase } = React.useMemo(() => {
    return (
      accounts.find((a) => a.id === currenctAccountId) || {
        id: initialState.id,
        name: initialState.name,
        address: initialState.address,
        type: initialState.type,
        hdPath: initialState.hdPath,
        encryptedSeedPhrase: '',
      }
    )
  }, [accounts, currenctAccountId])

  const createAccount = React.useCallback(
    async (
      n: string,
      seedPhrase: string,
      password: string,
      ledgerAddress: string,
      hd: number[]
    ) => {
      const newAccount = {
        id: String(Date.now()),
        name: n,
        address:
          ledgerAddress ||
          new MnemonicKey({
            mnemonic: seedPhrase,
            coinType: hd[1],
            account: hd[2],
            index: hd[4],
          }).accAddress,
        type: (ledgerAddress ? 'ledger' : 'seed') as WalletTypes,
        hdPath: hd,
        encryptedSeedPhrase: ledgerAddress
          ? ''
          : CryptoJS.AES.encrypt(seedPhrase, password).toString(),
      }
      setAccounts((a) => [...a, newAccount])
      setCurrenctAccountId(newAccount.id)
    },
    [setAccounts, setCurrenctAccountId]
  )

  const deleteAccount = React.useCallback(() => {
    const updatedAccounts = accounts.filter((a) => a.id !== currenctAccountId)
    setAccounts(updatedAccounts)
    setCurrenctAccountId(updatedAccounts.length ? updatedAccounts[0].id : initialState.id)
    if (!updatedAccounts.length) {
      Actions.reset('Login')
    }
  }, [setAccounts, setCurrenctAccountId, accounts, currenctAccountId])

  const decryptSeedPhrase = React.useCallback(
    (password?: string) => {
      try {
        if (!password) {
          return ''
        }
        const seedPhrase = CryptoJS.AES.decrypt(encryptedSeedPhrase, password).toString(
          CryptoJS.enc.Utf8
        )
        if (!seedPhrase) {
          throw new Error('incorrect password')
        }
        return seedPhrase
      } catch (err: any) {
        throw new Error('incorrect password')
      }
    },
    [encryptedSeedPhrase]
  )

  return (
    <AccountsContext.Provider
      value={{
        id,
        name,
        address,
        hdPath,
        type,
        decryptSeedPhrase,
        loaded,
        createAccount,
        deleteAccount,
        accounts,
      }}
    >
      {children}
    </AccountsContext.Provider>
  )
}

const useAccountsContext = (): AccountsState => React.useContext(AccountsContext)

export { AccountsProvider, useAccountsContext }
