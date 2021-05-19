import React from 'react'
import * as Font from 'expo-font'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { SettingsProvider } from './contexts/SettingsContext'
import Routes from './routes'
import { AssetsProvider } from './contexts/AssetsContext'
import './locales'
// import 'node-libs-react-native/globals'

export default function App() {
  const [fontLoaded, setFontLoaded] = React.useState(false)

  const loadFont = React.useCallback(async () => {
    try {
      await Font.loadAsync({
        MontserratBold: require('./assets/fonts/Montserrat-SemiBold.ttf'),
        MontserratRegular: require('./assets/fonts/Montserrat-Regular.ttf'),
      })
      setFontLoaded(true)
    } catch (err) {
      console.log(err)
    }
  }, [setFontLoaded])

  React.useEffect(() => {
    loadFont()
  }, [])

  return (
    <ActionSheetProvider>
      <SettingsProvider>
        <AssetsProvider>{fontLoaded ? <Routes /> : null}</AssetsProvider>
      </SettingsProvider>
    </ActionSheetProvider>
  )
}
