import { Coin } from '@terra-money/terra.js'
import React from 'react'
import { ThemeType } from '../types/misc'
import { terraLCDClient } from '../utils/terraConfig'
import usePersistedState from '../utils/usePersistedState'
import { useAccountsContext } from './AccountsContext'

interface SettingsState {
  currency: string
  currencyRate: number
  theme: ThemeType
  setCurrency: React.Dispatch<React.SetStateAction<string>>
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>
}

const initialState: SettingsState = {
  currency: 'uusd',
  currencyRate: 1,
  theme: ThemeType.Light,
  setCurrency: () => null,
  setTheme: () => null,
}

const SettingsContext = React.createContext<SettingsState>(initialState)

const SettingsProvider: React.FC = ({ children }) => {
  const { address } = useAccountsContext()
  const [currency, setCurrency] = usePersistedState('currency', initialState.currency)
  const [currencyRate, setCurrencyRate] = usePersistedState(
    'currencyRate',
    initialState.currencyRate
  )
  const [theme, setTheme] = usePersistedState('theme', initialState.theme)

  React.useEffect(() => {
    if (currency !== 'uusd') {
      terraLCDClient.market
        .swapRate(new Coin('uusd', 1), currency)
        .then((result) => setCurrencyRate(result.amount.toNumber()))
    } else {
      setCurrencyRate(1)
    }
  }, [currency])

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
        currencyRate,
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
