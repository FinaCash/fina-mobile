import React from 'react'
import { Image, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { FontAwesome5 as Icon } from '@expo/vector-icons'
import Button from '../../components/Button'
import Typography from '../../components/Typography'
import { useAssetsContext } from '../../contexts/AssetsContext'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'

const Login: React.FC = () => {
  const { styles } = useStyles(getStyles)
  const { login } = useAssetsContext()

  const start = React.useCallback(
    async (provider: string) => {
      await login(provider)
    },
    [login]
  )

  return (
    <View style={styles.screen}>
      <Image style={styles.logo} source={require('../../assets/images/logo.png')} />
      <Typography style={styles.description}>Decentralized banking powered by Terra</Typography>
      <Button
        style={styles.googleButton}
        onPress={() => start('google')}
        icon={<Icon name="google" />}
      >
        Sign in with Google
      </Button>
      <Button
        style={styles.facebookButton}
        onPress={() => start('facebook')}
        icon={<Icon name="facebook-f" />}
      >
        Sign in with Facebook
      </Button>
    </View>
  )
}

export default Login
