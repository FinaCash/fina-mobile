import React from 'react'
import { MnemonicKey } from '@terra-money/terra.js'
import CryptoJS from 'crypto-js'
import usePersistedState from '../utils/usePersistedState'
import { Actions } from 'react-native-router-flux'
import { deafultHdPath } from '../utils/terraConfig'
import { WalletTypes } from '../types/assets'

interface AccountsState {
  address: string
  hdPath: number[]
  type: WalletTypes
  decryptSeedPhrase(password: string): string
  loaded: boolean
  login(
    seedPhrase?: string,
    password?: string,
    ledgerAddress?: string,
    coinType?: number,
    account?: number,
    index?: number
  ): void
  logout(): void
}

const initialState: AccountsState = {
  address: '',
  hdPath: deafultHdPath,
  type: 'seed',
  loaded: false,
  login: () => null,
  logout: () => null,
  decryptSeedPhrase: () => '',
}

const AccountsContext = React.createContext<AccountsState>(initialState)

const AccountsProvider: React.FC = ({ children }) => {
  const [address, setAddress, loaded] = usePersistedState('address', initialState.address)
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
      seedPhrase: string,
      password: string,
      ledgerAddress: string,
      coinType = initialState.hdPath[1],
      account = initialState.hdPath[2],
      index = initialState.hdPath[4]
    ) => {
      if (ledgerAddress) {
        setType('ledger')
        setAddress(ledgerAddress)
        setEncryptedSeedPhrase('')
      } else {
        const key = new MnemonicKey({
          mnemonic: seedPhrase,
          coinType,
          account,
          index,
        })
        setType('seed')
        setAddress(key.accAddress)
        setEncryptedSeedPhrase(CryptoJS.AES.encrypt(seedPhrase, password).toString())
      }
      setHdPath([44, coinType, account, 0, index])
    },
    [setAddress, setEncryptedSeedPhrase, setHdPath, setType]
  )

  const logout = React.useCallback(() => {
    setAddress(initialState.address)
    setType(initialState.type)
    setHdPath(initialState.hdPath)
    setEncryptedSeedPhrase('')
    Actions.reset('Login')
  }, [setAddress, setEncryptedSeedPhrase, setType, setHdPath])

  const decryptSeedPhrase = React.useCallback(
    (password: string) => {
      try {
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
