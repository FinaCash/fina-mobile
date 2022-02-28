import lightTheme from './light'
import darkTheme from './dark'
import { useSettingsContext } from '../contexts/SettingsContext'
import { StyleSheet, Dimensions } from 'react-native'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import Constants from 'expo-constants'
import { Theme } from '../types/misc'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const useStyles = (getStyles?: (t: Theme) => any) => {
  const { theme: themeType } = useSettingsContext()
  const theme = {
    ...(themeType === 'dark' ? darkTheme : lightTheme),
    bottomSpace: Math.max(getBottomSpace() - 12, 0),
    statusBarHeight: Constants.statusBarHeight,
    screenWidth,
    screenHeight,
    isSmallScreen: screenWidth < 400,
  }
  const styles = getStyles ? StyleSheet.create(getStyles(theme)) : {}
  return { styles, theme }
}

export default useStyles
