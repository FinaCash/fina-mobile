import { Coin } from '@terra-money/terra.js'
import React from 'react'
import { Appearance, useColorScheme } from 'react-native'
import { ThemeType } from '../types/misc'
import { terraLCDClient } from '../utils/terraConfig'
import usePersistedState from '../utils/usePersistedState'
import { useAccountsContext } from './AccountsContext'

interface SettingsState {
  currency: string
  currencyRate: number
  theme: ThemeType
  systemDefaultTheme: boolean
  hideSmallBalance: boolean
  setCurrency: React.Dispatch<React.SetStateAction<string>>
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>
  setSystemDefaultTheme: React.Dispatch<React.SetStateAction<boolean>>
  setHideSmallBalance: React.Dispatch<React.SetStateAction<boolean>>
}

const initialState: SettingsState = {
  currency: 'uusd',
  currencyRate: 1,
  theme: ThemeType.Light,
  systemDefaultTheme: true,
  hideSmallBalance: true,
  setCurrency: () => null,
  setTheme: () => null,
  setSystemDefaultTheme: () => null,
  setHideSmallBalance: () => null,
}

const SettingsContext = React.createContext<SettingsState>(initialState)

const SettingsProvider: React.FC = ({ children }) => {
  const { address } = useAccountsContext()
  const colorScheme = useColorScheme()
  const [currency, setCurrency] = usePersistedState('currency', initialState.currency)
  const [currencyRate, setCurrencyRate] = usePersistedState(
    'currencyRate',
    initialState.currencyRate
  )
  const [theme, setTheme] = usePersistedState('theme', initialState.theme)
  const [systemDefaultTheme, setSystemDefaultTheme] = usePersistedState(
    'systemDefaultTheme',
    initialState.systemDefaultTheme
  )

  const [hideSmallBalance, setHideSmallBalance] = usePersistedState(
    'hideSmallBalance',
    initialState.hideSmallBalance
  )

  React.useEffect(() => {
    if (currency !== 'uusd') {
      terraLCDClient.market.swapRate(new Coin('uusd', 10 ** 6), currency).then((result) => {
        setCurrencyRate(result.amount.toNumber() / 10 ** 6)
      })
    } else {
      setCurrencyRate(1)
    }
  }, [currency, setCurrencyRate])

  // On logout
  React.useEffect(() => {
    if (!address) {
      setCurrency(initialState.currency)
      setHideSmallBalance(initialState.hideSmallBalance)
    }
  }, [address, setCurrency, setHideSmallBalance])

  React.useEffect(() => {
    if (systemDefaultTheme) {
      setTheme((colorScheme as any) || 'light')
    }
  }, [systemDefaultTheme, colorScheme, setTheme])

  React.useEffect(() => {
    if (systemDefaultTheme) {
      const themeNow = Appearance.getColorScheme()
      setTheme((themeNow as any) || 'light')
    }
  }, [systemDefaultTheme, setTheme])

  return (
    <SettingsContext.Provider
      value={{
        currency,
        currencyRate,
        setCurrency,
        theme,
        setTheme,
        systemDefaultTheme,
        setSystemDefaultTheme,
        hideSmallBalance,
        setHideSmallBalance,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

const useSettingsContext = (): SettingsState => React.useContext(SettingsContext)

export { SettingsProvider, useSettingsContext }
