import React from 'react'
import { View, TouchableOpacity, Share } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { FontAwesome as Icon } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import Toast from 'react-native-root-toast'
import Button from '../../components/Button'
import HeaderBar from '../../components/HeaderBar'
import Typography from '../../components/Typography'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useAccountsContext } from '../../contexts/AccountsContext'
import { useLocalesContext } from '../../contexts/LocalesContext'

interface MyAddressProps {}

const MyAddress: React.FC<MyAddressProps> = () => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)
  const { address } = useAccountsContext()

  return (
    <>
      <HeaderBar back title={t('my address')} />
      <View style={styles.container}>
        <QRCode value={address} size={180} />
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            Clipboard.setString(address)
            Toast.show(t('address copied'))
          }}
        >
          <Typography style={styles.address}>{address}</Typography>
          <Icon name="copy" color={theme.fonts.Base.color} />
        </TouchableOpacity>
        <Button
          onPress={() => Share.share({ message: address })}
          size="Large"
          icon={<Icon name="share" />}
        >
          {t('share')}
        </Button>
      </View>
    </>
  )
}

export default MyAddress
