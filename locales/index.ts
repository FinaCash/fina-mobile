import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import en from './en.json'
import zh from './zh.json'
// Set the key-value pairs for the different languages you want to support.
i18n.translations = { en, zh }
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale
i18n.fallbacks = 'en'
