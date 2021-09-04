import React from 'react'
import { MnemonicKey } from '@terra-money/terra.js'
import CryptoJS from 'crypto-js'
import usePersistedState from '../utils/usePersistedState'
import { Actions } from 'react-native-router-flux'

interface AccountsState {
  address: string
  encryptedSecretPhrase: string
  loaded: boolean
  login(secretPhrase: string, password: string): void
  logout(): void
}

const initialState: AccountsState = {
  address: '',
  encryptedSecretPhrase: '',
  loaded: false,
  login: () => null,
  logout: () => null,
}

const AccountsContext = React.createContext<AccountsState>(initialState)

const AccountsProvider: React.FC = ({ children }) => {
  const [address, setAddress, loaded] = usePersistedState('address', initialState.address)
  const [encryptedSecretPhrase, setEncryptedSecretPhrase] = usePersistedState(
    'encryptedSecretPhrase',
    '',
    {
      secure: true,
    }
  )

  const login = React.useCallback(
    async (secretPhrase: string, password: string) => {
      const key = new MnemonicKey({ mnemonic: secretPhrase })
      setAddress(key.accAddress)
      setEncryptedSecretPhrase(CryptoJS.AES.encrypt(secretPhrase, password).toString())
    },
    [setAddress, setEncryptedSecretPhrase]
  )

  const logout = React.useCallback(() => {
    setAddress(initialState.address)
    setEncryptedSecretPhrase(initialState.encryptedSecretPhrase)
    Actions.reset('Login')
  }, [setAddress, setEncryptedSecretPhrase])

  return (
    <AccountsContext.Provider
      value={{
        address,
        encryptedSecretPhrase,
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
