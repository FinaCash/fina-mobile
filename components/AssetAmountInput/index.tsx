import React from 'react'
import get from 'lodash/get'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'
import { Asset, AvailableAsset } from '../../types/assets'
import { TouchableOpacity, View } from 'react-native'
import AssetItem, { AssetItemProps } from '../../components/AssetItem'
import Typography from '../../components/Typography'
import Input, { InputProps } from '../../components/Input'
import { formatCurrency } from '../../utils/formatNumbers'
import { useSettingsContext } from '../../contexts/SettingsContext'
import AvailableAssetItem, { AvailableAssetItemProps } from '../AvailableAssetItem'
import { useLocalesContext } from '../../contexts/LocalesContext'

interface AssetAmountInputProps {
  asset?: Asset
  availableAsset?: AvailableAsset
  amount: string
  setAmount(amount: string): void
  assetItemProps?: Omit<AssetItemProps, 'asset'>
  availableAssetItemProps?: Omit<AvailableAssetItemProps, 'availableAsset'>
  inputProps?: InputProps
}

const AssetAmountInput: React.FC<AssetAmountInputProps> = ({
  asset,
  availableAsset,
  amount,
  setAmount,
  assetItemProps,
  availableAssetItemProps,
  inputProps,
}) => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)
  const { currency } = useSettingsContext()
  const price = asset ? Number(get(asset, 'worth.amount', 0)) / Number(asset.coin.amount) : 0

  return (
    <View style={styles.card}>
      {availableAsset ? (
        <AvailableAssetItem availableAsset={availableAsset} {...availableAssetItemProps} />
      ) : (
        <AssetItem asset={asset} {...assetItemProps} />
      )}
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
