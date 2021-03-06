import { Coin } from '@terra-money/terra.js'
import React from 'react'
import { Appearance, useColorScheme } from 'react-native'
import { ThemeType } from '../types/misc'
import { terraLCDClient } from '../utils/terraConfig'
import usePersistedState from '../utils/usePersistedState'

interface SettingsState {
  currency: string
  currencyRate: number
  theme: ThemeType
  systemDefaultTheme: boolean
  hideSmallBalance: boolean
  hideAmount: boolean
  lockScreenMode: 'on app open' | 'on background' | 'off'
  setCurrency: React.Dispatch<React.SetStateAction<string>>
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>
  setSystemDefaultTheme: React.Dispatch<React.SetStateAction<boolean>>
  setHideSmallBalance: React.Dispatch<React.SetStateAction<boolean>>
  setHideAmount: React.Dispatch<React.SetStateAction<boolean>>
  setLockScreenMode: React.Dispatch<React.SetStateAction<'on app open' | 'on background' | 'off'>>
}

const initialState: SettingsState = {
  currency: 'uusd',
  currencyRate: 1,
  theme: ThemeType.Light,
  systemDefaultTheme: true,
  hideSmallBalance: true,
  hideAmount: false,
  lockScreenMode: 'on app open',
  setCurrency: () => null,
  setTheme: () => null,
  setSystemDefaultTheme: () => null,
  setHideSmallBalance: () => null,
  setHideAmount: () => null,
  setLockScreenMode: () => null,
}

const SettingsContext = React.createContext<SettingsState>(initialState)

const SettingsProvider: React.FC = ({ children }) => {
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

  const [hideAmount, setHideAmount] = usePersistedState('hideAmount', initialState.hideAmount)

  const [lockScreenMode, setLockScreenMode] = usePersistedState(
    'lockScreenMode',
    initialState.lockScreenMode
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

  React.useEffect(() => {
    if (systemDefaultTheme) {
      setTheme((colorScheme as any) || 'light')
    }
  }, [systemDefaultTheme, colorScheme, setTheme])

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
        hideAmount,
        setHideAmount,
        lockScreenMode,
        setLockScreenMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

const useSettingsContext = (): SettingsState => React.useContext(SettingsContext)

export { SettingsProvider, useSettingsContext }
