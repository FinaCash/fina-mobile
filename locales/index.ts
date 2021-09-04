import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import en from './en.json'
import zh from './zh.json'
// Set the key-value pairs for the different languages you want to support.
i18n.translations = { en, zh }
i18n.fallbacks = 'en'

export const transformLocale = (locale: string) => {
  const supportedLocales = Object.keys(i18n.translations)
  const transformedLocale = locale.split('-')[0]
  return supportedLocales.includes(transformedLocale) ? transformedLocale : String(i18n.fallbacks)
}

// Set the locale once at the beginning of your app.
i18n.locale = transformLocale(Localization.locale)
