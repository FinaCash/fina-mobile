import React from 'react'
import get from 'lodash/get'
import Clipboard from 'expo-clipboard'
import HeaderBar from '../../components/HeaderBar'
import useTranslation from '../../locales/useTranslation'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'
import { Asset } from '../../types/assets'
import { Image, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import Button from '../../components/Button'
import Typography from '../../components/Typography'
import Input from '../../components/Input'
import ContactIcon from '../../assets/images/icons/recipients.svg'
import QRCodeIcon from '../../assets/images/icons/qrcode.svg'
import { formatCurrency } from '../../utils/formatNumbers'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { getCurrencyFromDenom } from '../../utils/transformAssets'
import isAddressValid from '../../utils/isAddressValid'

interface SelectRecipientProps {
  asset: Asset
  amount: number
  onSubmit(amount: number): void
}

const SelectRecipient: React.FC<SelectRecipientProps> = ({ asset, amount, onSubmit }) => {
  const { t } = useTranslation()
  const { styles, theme } = useStyles(getStyles)
  const { currency } = useSettingsContext()
  const price = Number(get(asset, 'worth.amount', 0)) / Number(asset.coin.amount)
  const [address, setAddress] = React.useState('')

  return (
    <>
      <HeaderBar back title={t('recipient')} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View>
          <View style={styles.centered}>
            <Image source={{ uri: asset.image }} style={styles.image} />
            <Typography type="H6" style={styles.amount}>
              {formatCurrency(Number(amount) * 10 ** 6, asset.coin.denom, true)}{' '}
              {getCurrencyFromDenom(asset.coin.denom)}
            </Typography>
            <Typography color={theme.palette.grey[7]} type="Small">
              ~{formatCurrency(Number(amount) * price * 10 ** 6, currency)}
            </Typography>
          </View>
          <View style={styles.card}>
            <View style={styles.splitRow}>
              <Typography type="Large" bold>
                {t('recipient address')}
              </Typography>
              <View style={styles.row}>
                <TouchableOpacity>
                  <ContactIcon style={styles.iconButton} fill={theme.palette.grey[7]} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <QRCodeIcon style={styles.iconButton} fill={theme.palette.grey[7]} />
                </TouchableOpacity>
              </View>
            </View>
            <Input
              style={styles.input}
              placeholder={t('recipient address placeholder')}
              size="Large"
              autoFocus
              value={address}
              onChangeText={setAddress}
              endAdornment={
                <TouchableOpacity
                  onPress={async () => {
                    const text = await Clipboard.getStringAsync()
                    setAddress(text)
                  }}
                >
                  <Typography bold color={theme.palette.secondary}>
                    {t('paste')}
                  </Typography>
                </TouchableOpacity>
              }
            />
          </View>
        </View>
        <Button
          disabled={!isAddressValid(address)}
          style={styles.button}
          size="Large"
          onPress={() => onSubmit(Number(amount))}
        >
          {t('next')}
        </Button>
      </KeyboardAvoidingView>
    </>
  )
}

export default SelectRecipient
