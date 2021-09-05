import React from 'react'
import { ThemeType } from '../types/misc'
import usePersistedState from '../utils/usePersistedState'
import { useAccountsContext } from './AccountsContext'

interface SettingsState {
  currency: string
  theme: ThemeType
  setCurrency: React.Dispatch<React.SetStateAction<string>>
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>
}

const initialState: SettingsState = {
  currency: 'uusd',
  theme: ThemeType.Light,
  setCurrency: () => null,
  setTheme: () => null,
}

const SettingsContext = React.createContext<SettingsState>(initialState)

const SettingsProvider: React.FC = ({ children }) => {
  const { address } = useAccountsContext()
  const [currency, setCurrency] = usePersistedState('currency', initialState.currency)
  const [theme, setTheme] = usePersistedState('theme', initialState.theme)

  // On logout
  React.useEffect(() => {
    if (!address) {
      setCurrency(initialState.currency)
      setTheme(initialState.theme)
    }
  }, [address, setCurrency, setTheme])

  return (
    <SettingsContext.Provider
      value={{
        currency,
        setCurrency,
        theme,
        setTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

const useSettingsContext = (): SettingsState => React.useContext(SettingsContext)

export { SettingsProvider, useSettingsContext }
