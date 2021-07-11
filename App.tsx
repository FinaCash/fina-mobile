import 'node-libs-react-native/globals'
import React from 'react'
import * as Font from 'expo-font'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import AppLoading from 'expo-app-loading'
import { SettingsProvider } from './contexts/SettingsContext'
import Routes from './routes'
import { AssetsProvider, useAssetsContext } from './contexts/AssetsContext'
import './locales'
import { MirrorAssetsProvider } from './contexts/MirrorAssetsContext'

const InnerApp: React.FC = () => {
  const [fontLoaded, setFontLoaded] = React.useState(false)
  const { loaded: accountLoaded, address } = useAssetsContext()

  const initialize = React.useCallback(async () => {
    try {
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

  return accountLoaded && fontLoaded ? <Routes isLoggedIn={!!address} /> : <AppLoading />
}

export default function App() {
  return (
    <ActionSheetProvider>
      <SettingsProvider>
        <AssetsProvider>
          <MirrorAssetsProvider>
            <InnerApp />
          </MirrorAssetsProvider>
        </AssetsProvider>
      </SettingsProvider>
    </ActionSheetProvider>
  )
}
