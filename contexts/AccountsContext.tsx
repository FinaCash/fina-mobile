import React from 'react'
import CryptoJS from 'crypto-js'
import usePersistedState from '../utils/usePersistedState'
import { Actions } from 'react-native-router-flux'
import { defaultHdPath } from '../utils/terraConfig'
import { WalletTypes } from '../types/assets'
import { MnemonicKey } from '@terra-money/terra.js'

interface AccountsState {
  name: string
  address: string
  hdPath: number[]
  type: WalletTypes
  decryptSeedPhrase(password?: string): string
  loaded: boolean
  login(
    name: string,
    seedPhrase?: string,
    password?: string,
    ledgerAddress?: string,
    hdPath?: number[]
  ): void
  logout(): void
}

const initialState: AccountsState = {
  name: '',
  address: '',
  hdPath: defaultHdPath,
  type: 'seed',
  loaded: false,
  login: () => null,
  logout: () => null,
  decryptSeedPhrase: () => '',
}

const AccountsContext = React.createContext<AccountsState>(initialState)

const AccountsProvider: React.FC = ({ children }) => {
  const [address, setAddress, loaded] = usePersistedState('address', initialState.address)
  const [name, setName] = usePersistedState('name', initialState.name)
  const [type, setType] = usePersistedState('type', initialState.type)
  const [hdPath, setHdPath] = usePersistedState('hdPath', initialState.hdPath)
  const [encryptedSeedPhrase, setEncryptedSeedPhrase] = usePersistedState(
    'encryptedSeedPhrase',
    '',
    {
      secure: true,
    }
  )

  const login = React.useCallback(
    async (
      n: string,
      seedPhrase: string,
      password: string,
      ledgerAddress: string,
      hd: number[]
    ) => {
      if (ledgerAddress) {
        setType('ledger')
        setAddress(ledgerAddress)
        setEncryptedSeedPhrase('')
      } else {
        const key = new MnemonicKey({
          mnemonic: seedPhrase,
          coinType: (hd || hdPath)[1],
          account: (hd || hdPath)[2],
          index: (hd || hdPath)[4],
        })
        setType('seed')
        setAddress(key.accAddress)
        setEncryptedSeedPhrase(CryptoJS.AES.encrypt(seedPhrase, password).toString())
      }
      if (hd) {
        setHdPath(hd)
      }
      setName(n)
    },
    [setAddress, setEncryptedSeedPhrase, setHdPath, setType, hdPath, setName]
  )

  const logout = React.useCallback(() => {
    setAddress(initialState.address)
    setType(initialState.type)
    setHdPath(initialState.hdPath)
    setEncryptedSeedPhrase('')
    Actions.reset('Login')
  }, [setAddress, setEncryptedSeedPhrase, setType, setHdPath])

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
        name,
        address,
        hdPath,
        type,
        decryptSeedPhrase,
        loaded,
        login,
        logout,
      }}
    >
      {children}
    </AccountsContext.Provider>
  )
}

const useAccountsContext = (): AccountsState => React.useContext(AccountsContext)

export { AccountsProvider, useAccountsContext }
