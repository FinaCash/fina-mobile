import React from 'react'
import i18n from 'i18n-js'
import { Locales } from '../types/misc'
import usePersistedState from '../utils/usePersistedState'
import { transformLocale } from '.'

const useTranslation = () => {
  const [locale, setLocale] = usePersistedState('locale', transformLocale(i18n.locale))

  const changeLocale = React.useCallback(
    (newLocale: Locales) => {
      i18n.locale = newLocale
      setLocale(newLocale)
    },
    [setLocale]
  )

  const t = React.useCallback(
    (scope: i18n.Scope, options?: i18n.TranslateOptions) => i18n.t(scope, options),
    [locale]
  )

  return { t, locale, changeLocale }
}

export default useTranslation
