import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import en from './en.json'
import zh from './zh.json'
// Set the key-value pairs for the different languages you want to support.
i18n.translations = { en, zh }
i18n.fallbacks = 'en'
const supportedLocales = Object.keys(i18n.translations)
// Set the locale once at the beginning of your app.
const deviceLocale = Localization.locale.split('-')[0]
i18n.locale = supportedLocales.includes(deviceLocale) ? deviceLocale : i18n.fallbacks
