import React from 'react'
import { AppState, AppStateStatus, Image, View } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'
import { useSettingsContext } from '../../contexts/SettingsContext'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'
import { Actions } from 'react-native-router-flux'

const Logo = require('../../assets/images/logo.png')
const LogoWhite = require('../../assets/images/logo_white.png')

const unlockWallet = async () => {
  try {
    AppState.removeEventListener('change', onStateChange)
    const isEnrolled = await LocalAuthentication.isEnrolledAsync()
    const result = await LocalAuthentication.authenticateAsync()
    if (isEnrolled && !result.success) {
      throw new Error()
    }
    Actions.pop()
  } catch (err) {
    setTimeout(() => AppState.addEventListener('change', onStateChange), 1000)
  }
}

const onStateChange = (nextState: AppStateStatus) => {
  if (nextState === 'active') {
    unlockWallet()
  }
}

const LockScreen: React.FC = () => {
  const { theme: uiTheme } = useSettingsContext()
  const { styles } = useStyles(getStyles)

  React.useEffect(() => {
    if (AppState.currentState === 'active') {
      unlockWallet()
    }
    AppState.addEventListener('change', onStateChange)
    return () => {
      AppState.removeEventListener('change', onStateChange)
    }
  }, [])

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={uiTheme === 'light' ? Logo : LogoWhite} />
    </View>
  )
}

export default LockScreen
