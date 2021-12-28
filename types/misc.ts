export enum ThemeType {
  Light = 'light',
  Dark = 'dark',
}

export type FontType = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6' | 'Large' | 'Base' | 'Small' | 'Mini'

export interface Font {
  color: string
  fontFamily: string
  fontSize: number
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
    background: string
    altBackground: string
    border: string
    active: string
    button: string
  }
  gradients: {
    primary: string[]
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
