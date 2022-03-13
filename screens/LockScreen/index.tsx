import React from 'react'
import { Image, View } from 'react-native'
import { useSettingsContext } from '../../contexts/SettingsContext'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'

const Logo = require('../../assets/images/logo.png')
const LogoWhite = require('../../assets/images/logo_white.png')

const LockScreen: React.FC = () => {
  const { theme: uiTheme } = useSettingsContext()
  const { styles } = useStyles(getStyles)

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={uiTheme === 'light' ? Logo : LogoWhite} />
    </View>
  )
}

export default LockScreen
