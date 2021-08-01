import React from 'react'
import get from 'lodash/get'
import HeaderBar from '../../components/HeaderBar'
import useTranslation from '../../locales/useTranslation'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'
import { Asset } from '../../types/assets'
import { TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import Button from '../../components/Button'
import AssetItem from '../../components/AssetItem'
import Typography from '../../components/Typography'
import Input from '../../components/Input'
import { formatCurrency } from '../../utils/formatNumbers'
import { useSettingsContext } from '../../contexts/SettingsContext'

interface SelectAmountProps {
  asset: Asset
  onSubmit(amount: number): void
}

const SelectAmount: React.FC<SelectAmountProps> = ({ asset, onSubmit }) => {
  const { t } = useTranslation()
  const { styles, theme } = useStyles(getStyles)
  const { currency } = useSettingsContext()
  const [amount, setAmount] = React.useState('')
  const price = Number(get(asset, 'worth.amount', 0)) / Number(asset.coin.amount)

  return (
    <>
      <HeaderBar back title={t('amount')} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.card}>
          <AssetItem asset={asset} hideApr disabled />
          <View style={styles.amountContainer}>
            <Typography type="Large" bold>
              {t('amount')}
            </Typography>
            <Input
              style={styles.amountInput}
              placeholder="0"
              size="Large"
              autoFocus
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              endAdornment={
                <View style={styles.row}>
                  <Typography bold>{asset.symbol}</Typography>
                  <View style={styles.verticalDivider} />
                  <TouchableOpacity
                    onPress={() => setAmount(String(Number(asset.coin.amount) / 10 ** 6))}
                  >
                    <Typography bold color={theme.palette.secondary}>
                      {t('max')}
                    </Typography>
                  </TouchableOpacity>
                </View>
              }
            />
            <Typography color={theme.palette.grey[7]} type="Small">
              ~{formatCurrency(Number(amount) * price * 10 ** 6, currency)}
            </Typography>
          </View>
        </View>
        <Button
          disabled={!Number(amount) || Number(amount) * 10 ** 6 > Number(asset.coin.amount)}
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

export default SelectAmount
