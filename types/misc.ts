export type Locales = 'en' | 'zh'

export type ThemeType = 'light' | 'dark'
export type FontType = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6' | 'Large' | 'Base' | 'Small'

export interface Font {
  color: string
  fontFamily: string
  fontSize: string
}

export interface Theme {
  palette: {
    primary: string
    secondary: string
    red: string
    grey: string[]
    white: string
    overlay: string
    facebook: string
    google: string
  }
  baseSpace: number
  tabBarHeight: number
  shadow: {
    shadowColor: string
    shadowOffset: {
      width: number
      height: number
    }
    shadowOpacity: number
    shadowRadius: number
    elevation: number
  }
  borderRadius: number[]
  bottomSpace: number
  statusBarHeight: number
  fonts: { [type in FontType]: Font }
  screenWidth: number
  screenHeight: number
}

export enum Currencies {
  USD = 'uusd',
  HKD = 'uhkd',
  EUR = 'ueur',
  JPY = 'ujpy',
  KRW = 'ukrw',
}

export const CurrencySymbols = {
  [Currencies.USD]: '$',
  [Currencies.HKD]: '$',
  [Currencies.EUR]: '€',
  [Currencies.JPY]: '¥',
  [Currencies.KRW]: '₩',
}
