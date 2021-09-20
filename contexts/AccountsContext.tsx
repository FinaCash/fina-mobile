import React from 'react'
import { MnemonicKey } from '@terra-money/terra.js'
import CryptoJS from 'crypto-js'
import usePersistedState from '../utils/usePersistedState'
import { Actions } from 'react-native-router-flux'

interface AccountsState {
  address: string
  decryptSecretPhrase(password: string): string
  loaded: boolean
  login(secretPhrase: string, password: string): void
  logout(): void
}

const initialState: AccountsState = {
  address: '',
  loaded: false,
  login: () => null,
  logout: () => null,
  decryptSecretPhrase: () => '',
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
    setEncryptedSecretPhrase('')
    Actions.reset('Login')
  }, [setAddress, setEncryptedSecretPhrase])

  const decryptSecretPhrase = React.useCallback(
    (password: string) => {
      try {
        const secretPhrase = CryptoJS.AES.decrypt(encryptedSecretPhrase, password).toString(
          CryptoJS.enc.Utf8
        )
        if (!secretPhrase) {
          throw new Error('incorrect password')
        }
        return secretPhrase
      } catch (err: any) {
        throw new Error('incorrect password')
      }
    },
    [encryptedSecretPhrase]
  )

  return (
    <AccountsContext.Provider
      value={{
        address,
        decryptSecretPhrase,
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
