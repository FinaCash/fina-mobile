import React from 'react'
import { View, TouchableOpacity, Share } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { FontAwesome as Icon } from '@expo/vector-icons'
import Clipboard from 'expo-clipboard'
import Toast from 'react-native-root-toast'
import Button from '../../components/Button'
import HeaderBar from '../../components/HeaderBar'
import Typography from '../../components/Typography'
import { useAssetsContext } from '../../contexts/AssetsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'

interface MyAddressProps {}

const MyAddress: React.FC<MyAddressProps> = () => {
  const { t } = useTranslation()
  const { styles, theme } = useStyles(getStyles)
  const { address } = useAssetsContext()

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
          <Typography style={styles.address} color={theme.palette.grey[7]}>
            {address}
          </Typography>
          <Icon name="copy" />
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
