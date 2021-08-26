import React from 'react'
import { View } from 'react-native'
import Button from '../../components/Button'
import { useAccountsContext } from '../../contexts/AccountsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'

const Settings: React.FC = () => {
  const { logout } = useAccountsContext()
  const { t } = useTranslation()
  const { styles } = useStyles(getStyles)

  return (
    <View style={styles.container}>
      <Button onPress={logout}>{t('logout')}</Button>
    </View>
  )
}

export default Settings
