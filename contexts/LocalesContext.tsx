import React from 'react'
import * as Localization from 'expo-localization'
import get from 'lodash/get'
import usePersistedState from '../utils/usePersistedState'
import en from '../locales/en.json'
import zh from '../locales/zh.json'

const translations = { en, zh }
const fallback = 'en'
const supportedLocales = Object.keys(translations)

const transformLocale = (locale: string) => {
  const transformedLocale = locale.split('-')[0]
  return supportedLocales.includes(transformedLocale) ? transformedLocale : fallback
}

interface LocalesState {
  locale: string
  setLocale: React.Dispatch<React.SetStateAction<string>>
  t(key: string, params?: any): string
  supportedLocales: string[]
}

const initialState: LocalesState = {
  locale: 'en',
  setLocale: () => null,
  t: () => '',
  supportedLocales,
}

const LocalesContext = React.createContext<LocalesState>(initialState)

const LocalesProvider: React.FC = ({ children }) => {
  const [locale, setLocale] = usePersistedState('locale', transformLocale(Localization.locale))

  const t = React.useCallback(
    (key: string, params = {}) => {
      let value: string = get(
        translations,
        `${locale}.${key}`,
        get(translations, `${fallback}.${key}`, key)
      )
      const vars = value.match(/{{([^}]+)}}/g) || []
      vars.forEach((v) => {
        value = value.replace(v, get(params, v.replace(/[{,}]/g, ''), v))
      })
      return value
    },
    [locale]
  )

  return (
    <LocalesContext.Provider
      value={{
        locale,
        setLocale,
        t,
        supportedLocales,
      }}
    >
      {children}
    </LocalesContext.Provider>
  )
}

const useLocalesContext = (): LocalesState => React.useContext(LocalesContext)

export { LocalesProvider, useLocalesContext }
