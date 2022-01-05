import 'node-libs-expo/globals'
import 'react-native-get-random-values'
import React from 'react'
import * as Font from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import AppLoading from 'expo-app-loading'
import { RootSiblingParent } from 'react-native-root-siblings'
import { SettingsProvider } from './contexts/SettingsContext'
import Routes from './routes'
import { AccountsProvider, useAccountsContext } from './contexts/AccountsContext'
import { LocalesProvider } from './contexts/LocalesContext'
import { PortalProvider } from '@gorhom/portal'

const InnerApp: React.FC = () => {
  const [fontLoaded, setFontLoaded] = React.useState(false)
  const { loaded: accountLoaded, address } = useAccountsContext()

  const initialize = React.useCallback(async () => {
    try {
      await Font.loadAsync({
        PoppinsBold: require('./assets/fonts/Poppins-Bold.ttf'),
        RobotoBold: require('./assets/fonts/Roboto-Bold.ttf'),
        RobotoRegular: require('./assets/fonts/Roboto-Regular.ttf'),
      })
      setFontLoaded(true)
    } catch (err: any) {
      console.log(err)
    }
  }, [setFontLoaded])

  React.useEffect(() => {
    initialize()
  }, [])

  return (
    <>
      <StatusBar style="light" />
      {accountLoaded && fontLoaded ? <Routes address={address} /> : <AppLoading />}
    </>
  )
}

export default function App() {
  return (
    <LocalesProvider>
      <ActionSheetProvider>
        <AccountsProvider>
          <SettingsProvider>
            <RootSiblingParent>
              <PortalProvider>
                <InnerApp />
              </PortalProvider>
            </RootSiblingParent>
          </SettingsProvider>
        </AccountsProvider>
      </ActionSheetProvider>
    </LocalesProvider>
  )
}
