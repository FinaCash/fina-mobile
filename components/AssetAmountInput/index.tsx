import React from 'react'
import get from 'lodash/get'
import useTranslation from '../../locales/useTranslation'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'
import { Asset } from '../../types/assets'
import { TouchableOpacity, View } from 'react-native'
import AssetItem, { AssetItemProps } from '../../components/AssetItem'
import Typography from '../../components/Typography'
import Input, { InputProps } from '../../components/Input'
import { formatCurrency } from '../../utils/formatNumbers'
import { useSettingsContext } from '../../contexts/SettingsContext'

interface AssetAmountInputProps {
  asset?: Asset
  amount: string
  setAmount(amount: string): void
  assetItemProps?: AssetItemProps
  inputProps?: InputProps
}

const AssetAmountInput: React.FC<AssetAmountInputProps> = ({
  asset,
  amount,
  setAmount,
  assetItemProps,
  inputProps,
}) => {
  const { t } = useTranslation()
  const { styles, theme } = useStyles(getStyles)
  const { currency } = useSettingsContext()
  const price = asset ? Number(get(asset, 'worth.amount', 0)) / Number(asset.coin.amount) : 0

  return (
    <View style={styles.card}>
      <AssetItem asset={asset} {...assetItemProps} />
      <View style={styles.amountContainer}>
        <Typography type="Large" bold>
          {t('amount')}
        </Typography>
        <Input
          style={styles.amountInput}
          placeholder="0"
          size="Large"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          endAdornment={
            asset ? (
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
            ) : undefined
          }
          {...inputProps}
        />
        <Typography color={theme.palette.grey[7]} type="Small">
          ~{formatCurrency(Number(amount) * price * 10 ** 6, currency, true)}
        </Typography>
      </View>
    </View>
  )
}

export default AssetAmountInput
