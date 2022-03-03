import React from 'react'
import { View, TouchableOpacity, Share } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { FontAwesome as Icon } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import Toast from 'react-native-root-toast'
import { Actions } from 'react-native-router-flux'
import Button from '../../components/Button'
import HeaderBar from '../../components/HeaderBar'
import Typography from '../../components/Typography'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useAccountsContext } from '../../contexts/AccountsContext'
import { useLocalesContext } from '../../contexts/LocalesContext'
import Input from '../../components/Input'
import {
  getSymbolFromDenom,
  getCurrentAssetDetail,
  getTokenAssetDetail,
} from '../../utils/transformAssets'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { Asset } from '../../types/assets'

interface MyAddressProps {}

const MyAddress: React.FC<MyAddressProps> = () => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)
  const { address } = useAccountsContext()
  const { currency } = useSettingsContext()
  const { availableCurrencies } = useAssetsContext()

  const [denom, setDenom] = React.useState(currency)
  const [amount, setAmount] = React.useState('')
  const [memo, setMemo] = React.useState('')

  const [qrString, setQrString] = React.useState(address)

  React.useEffect(() => {
    setQrString(address)
  }, [address])

  const generatePayCode = React.useCallback(() => {
    if (amount || memo) {
      setQrString(JSON.stringify({ address, amount, memo, denom }))
    } else {
      setQrString(address)
    }
  }, [address, denom, amount, memo])

  return (
    <>
      <HeaderBar back title={t('receive')} />
      <KeyboardAwareScrollView
        style={{ backgroundColor: theme.palette.background }}
        contentContainerStyle={{ flex: 1 }}
      >
        <View style={styles.container}>
          {qrString ? <QRCode value={qrString} size={120} /> : <View style={{ height: 120 }} />}
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
            bgColor="transparent"
            color={theme.palette.lightPrimary}
            bold
          >
            {t('share')}
          </Button>
        </View>
        <View style={styles.bottomContainer}>
          <Typography style={styles.smallMargin} type="Large">
            {t('optional fields')}
          </Typography>
          <Typography
            style={{ marginBottom: theme.baseSpace * 4 }}
            color={theme.palette.grey[7]}
            type="Small"
          >
            {t('optional fields descriptions')}
          </Typography>
          <Typography style={styles.smallMargin}>{t('currency')}</Typography>
          <TouchableOpacity
            style={styles.inputButton}
            onPress={() => {
              Actions.SelectAsset({
                assets: [
                  getTokenAssetDetail({ denom: 'uluna', amount: '0' }),
                  ...availableCurrencies
                    .filter((c) => !c.hidden)
                    .map((c) => getCurrentAssetDetail({ denom: c.denom, amount: '0' })),
                ],
                assetItemProps: { hideAmount: true },
                onSelect: (a: Asset) => {
                  setDenom(a.coin.denom)
                  Actions.pop()
                },
              })
            }}
          >
            <Typography>{getSymbolFromDenom(denom)}</Typography>
            <Icon name="chevron-right" color={theme.palette.lightPrimary} />
          </TouchableOpacity>
          <Typography style={styles.smallMargin}>{t('amount')}</Typography>
          <Input
            style={styles.input}
            size={theme.isSmallScreen ? 'Base' : 'Large'}
            placeholder="0"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Typography style={styles.smallMargin}>{t('memo')}</Typography>
          <Input
            style={styles.input}
            size={theme.isSmallScreen ? 'Base' : 'Large'}
            value={memo}
            onChangeText={setMemo}
          />
          <View style={styles.buttons}>
            <Button
              size={theme.isSmallScreen ? 'Base' : 'Large'}
              onPress={() => {
                setDenom(currency)
                setAmount('')
                setMemo('')
                setQrString(address)
              }}
              style={styles.borderButton}
              color={theme.palette.borderButton}
            >
              {t('reset')}
            </Button>
            <View style={{ width: 4 * theme.baseSpace }} />
            <Button
              style={{ flex: 1 }}
              size={theme.isSmallScreen ? 'Base' : 'Large'}
              onPress={generatePayCode}
            >
              {t('update qr code')}
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  )
}

export default MyAddress
