import lightTheme from './light.json'
import darkTheme from './dark.json'
import { useSettingsContext } from '../contexts/SettingsContext'
import { StyleSheet, Dimensions } from 'react-native'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import Constants from 'expo-constants'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const useStyles = (getStyles?: (t: Theme) => any) => {
  const { theme: themeType } = useSettingsContext()
  const theme = {
    ...(themeType === 'dark' ? darkTheme : lightTheme),
    bottomSpace: getBottomSpace(),
    statusBarHeight: Constants.statusBarHeight,
    screenWidth,
    screenHeight,
  }
  const styles = getStyles ? StyleSheet.create(getStyles(theme)) : {}
  return { styles, theme }
}

export default useStyles
