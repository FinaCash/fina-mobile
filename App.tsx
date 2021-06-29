import 'node-libs-react-native/globals'
import React from 'react'
import * as Font from 'expo-font'
import { Platform } from 'react-native'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { SettingsProvider } from './contexts/SettingsContext'
import Routes from './routes'
import { AssetsProvider } from './contexts/AssetsContext'
import './locales'

export default function App() {
  const [fontLoaded, setFontLoaded] = React.useState(false)

  const initialize = React.useCallback(async () => {
    try {
      if (Platform.OS === 'web' && document) {
        const rnwStyleSheet: any = document.getElementById('react-native-stylesheet')
        if (rnwStyleSheet) {
          rnwStyleSheet.sheet.insertRule(`#animated-view { transition: transform 100ms;}`, 0)
          rnwStyleSheet.sheet.insertRule(`*:focus { outline: none; }`, 0)
        }
      }
      await Font.loadAsync({
        PoppinsBold: require('./assets/fonts/Poppins-Bold.ttf'),
        RobotoBold: require('./assets/fonts/Roboto-Bold.ttf'),
        RobotoRegular: require('./assets/fonts/Roboto-Regular.ttf'),
      })
      setFontLoaded(true)
    } catch (err) {
      console.log(err)
    }
  }, [setFontLoaded])

  React.useEffect(() => {
    initialize()
  }, [])

  return (
    <ActionSheetProvider>
      <SettingsProvider>
        <AssetsProvider>{fontLoaded ? <Routes /> : null}</AssetsProvider>
      </SettingsProvider>
    </ActionSheetProvider>
  )
}
