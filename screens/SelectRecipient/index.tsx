import React from 'react'
import get from 'lodash/get'
import * as Clipboard from 'expo-clipboard'
import HeaderBar from '../../components/HeaderBar'
import useTranslation from '../../locales/useTranslation'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'
import { Asset } from '../../types/assets'
import { Image, TouchableOpacity, View, KeyboardAvoidingView, Keyboard } from 'react-native'
import Button from '../../components/Button'
import Typography from '../../components/Typography'
import Input from '../../components/Input'
import ContactIcon from '../../assets/images/icons/recipients.svg'
import QRCodeIcon from '../../assets/images/icons/qrcode.svg'
import { formatCurrency } from '../../utils/formatNumbers'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { getCurrencyFromDenom } from '../../utils/transformAssets'
import isAddressValid from '../../utils/isAddressValid'
import ConfirmTransactionModal from '../../components/ConfirmModals/ConfirmTransactionModal'
import { Actions } from 'react-native-router-flux'
import { Recipient } from '../../types/recipients'
import RecipientModal from '../../components/RecipientModal'
import { useRecipientsContext } from '../../contexts/RecipientsContext'
import Toast from 'react-native-root-toast'

interface SelectRecipientProps {
  asset: Asset
  amount: number
  onSubmit(address: string): void
}

const SelectRecipient: React.FC<SelectRecipientProps> = ({ asset, amount, onSubmit }) => {
  const { t } = useTranslation()
  const { styles, theme } = useStyles(getStyles)
  const { currency } = useSettingsContext()
  const { addRecipient } = useRecipientsContext()
  const price = Number(get(asset, 'worth.amount', 0)) / Number(asset.coin.amount)
  const [address, setAddress] = React.useState('')
  const [isConfirming, setIsConfirming] = React.useState(false)
  const [isSavingRecipient, setIsSavingRecipient] = React.useState(false)

  return (
    <>
      <HeaderBar back title={t('recipient')} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View>
          <View style={styles.centered}>
            <Image source={{ uri: asset.image }} style={styles.image} />
            <Typography type="H6" style={styles.amount}>
              {formatCurrency(Number(amount) * 10 ** 6, asset.coin.denom)}{' '}
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
                <TouchableOpacity
                  onPress={() =>
                    Actions.SelectRecipients({
                      onSelect: (recipient: Recipient) => {
                        setAddress(recipient.address)
                        Actions.pop()
                      },
                    })
                  }
                >
                  <ContactIcon style={styles.iconButton} fill={theme.palette.grey[7]} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Actions.ScanQRCode({ onScan: setAddress })}>
                  <QRCodeIcon style={styles.iconButton} fill={theme.palette.grey[7]} />
                </TouchableOpacity>
              </View>
            </View>
            <Input
              style={styles.input}
              placeholder={t('recipient address placeholder')}
              size="Large"
              autoFocus
              autoCorrect={false}
              autoCapitalize="none"
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
            <TouchableOpacity
              disabled={!isAddressValid(address)}
              style={styles.addButton}
              onPress={() => setIsSavingRecipient(true)}
            >
              <Typography
                bold
                color={isAddressValid(address) ? theme.palette.secondary : theme.palette.grey[5]}
              >
                {t('save recipient')}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
        <Button
          disabled={!isAddressValid(address)}
          style={styles.button}
          size="Large"
          onPress={() => {
            setIsConfirming(true)
            Keyboard.dismiss()
          }}
        >
          {t('next')}
        </Button>
      </KeyboardAvoidingView>
      <ConfirmTransactionModal
        open={isConfirming}
        onClose={() => setIsConfirming(false)}
        asset={asset}
        address={address}
        amount={amount}
        onConfirm={() => onSubmit(address)}
      />
      <RecipientModal
        open={isSavingRecipient}
        onClose={() => setIsSavingRecipient(false)}
        recipient={{ name: '', image: '', address }}
        onSave={(recipient) => {
          addRecipient(recipient)
          setIsSavingRecipient(false)
          Toast.show(t('recipient added'))
        }}
      />
    </>
  )
}

export default SelectRecipient
