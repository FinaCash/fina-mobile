import React from 'react'
import { View } from 'react-native'
import Button from '../../components/Button'
import HeaderBar from '../../components/HeaderBar'
import { useAccountsContext } from '../../contexts/AccountsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'

const Settings: React.FC = () => {
  const { logout } = useAccountsContext()
  const { t } = useTranslation()
  const { styles } = useStyles(getStyles)

  return (
    <>
      <HeaderBar title={t('settings')} />
      <View style={styles.container}>
        <Button size="Large" onPress={logout}>
          {t('logout')}
        </Button>
      </View>
    </>
  )
}

export default Settings
