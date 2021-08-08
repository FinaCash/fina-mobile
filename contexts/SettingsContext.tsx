import React from 'react'
import { ThemeType } from '../types/misc'
import usePersistedState from '../utils/usePersistedState'

interface SettingsState {
  currency: string
  theme: ThemeType
  setCurrency?: React.Dispatch<React.SetStateAction<string>>
  setTheme?: React.Dispatch<React.SetStateAction<ThemeType>>
}

const initialState: SettingsState = {
  currency: 'uusd',
  theme: 'light',
}

const SettingsContext = React.createContext<SettingsState>(initialState)

const SettingsProvider: React.FC = ({ children }) => {
  const [currency, setCurrency] = usePersistedState('currency', initialState.currency)
  const [theme, setTheme] = usePersistedState('theme', initialState.theme)

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
