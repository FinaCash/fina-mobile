import React from 'react'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'
import { Asset, AssetTypes, AvailableAsset, Validator } from '../../types/assets'
import { TouchableOpacity, View } from 'react-native'
import AssetItem, { AssetItemProps } from '../../components/AssetItem'
import Typography from '../../components/Typography'
import Input, { InputProps } from '../../components/Input'
import { formatCurrency } from '../../utils/formatNumbers'
import { useSettingsContext } from '../../contexts/SettingsContext'
import AvailableAssetItem, { AvailableAssetItemProps } from '../AvailableAssetItem'
import { useLocalesContext } from '../../contexts/LocalesContext'
import CollateralItem from '../CollateralItem'
import StakingItem from '../StakingItem'

interface AssetAmountInputProps {
  asset?: Asset
  availableAsset?: AvailableAsset
  validator?: Validator
  stakedAmount?: number
  amount: string
  setAmount(amount: string): void
  assetItemProps?: Omit<AssetItemProps, 'asset'>
  availableAssetItemProps?: Omit<AvailableAssetItemProps, 'availableAsset'>
  inputProps?: InputProps
  max?: number
  bottomElement?: React.ReactNode
}

const AssetAmountInput: React.FC<AssetAmountInputProps> = ({
  asset,
  availableAsset,
  validator,
  stakedAmount,
  amount,
  setAmount,
  assetItemProps,
  availableAssetItemProps,
  inputProps,
  max,
  bottomElement,
}) => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)
  const { currency, currencyRate } = useSettingsContext()

  return (
    <View style={styles.card}>
      {validator && availableAsset && stakedAmount !== undefined ? (
        <StakingItem
          validator={validator}
          amount={stakedAmount * 10 ** 6}
          symbol={availableAsset.symbol}
          price={availableAsset.price}
        />
      ) : availableAsset ? (
        <AvailableAssetItem availableAsset={availableAsset} {...availableAssetItemProps} />
      ) : asset && asset.type === AssetTypes.Collaterals ? (
        <CollateralItem asset={asset} />
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
            asset || (availableAsset && stakedAmount) ? (
              <View style={styles.row}>
                <Typography bold>{asset ? asset.symbol : availableAsset?.symbol}</Typography>
                <View style={styles.verticalDivider} />
                <TouchableOpacity
                  onPress={() =>
                    setAmount(
                      String(
                        max !== undefined
                          ? max / 10 ** 6
                          : asset
                          ? Number(asset.coin.amount) / 10 ** 6
                          : stakedAmount
                      )
                    )
                  }
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
          ~
          {formatCurrency(
            Number(amount) * (asset ? asset.price : 0) * 10 ** 6 * currencyRate,
            currency,
            true
          )}
        </Typography>
      </View>
      {bottomElement || null}
    </View>
  )
}

export default AssetAmountInput
