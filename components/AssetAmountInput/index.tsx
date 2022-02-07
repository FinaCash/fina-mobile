import React from 'react'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'
import { Asset, AssetTypes, AvailableAsset, Validator, Farm } from '../../types/assets'
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
import FarmItem from '../FarmItem'

interface AssetAmountInputProps {
  farm?: Farm
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
  farm,
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
      ) : farm && availableAsset ? (
        <FarmItem
          asset={availableAsset}
          farmType={farm.type}
          balance={farm.balance}
          rate={farm.rate}
          {...assetItemProps}
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
            asset || (availableAsset && stakedAmount) || farm ? (
              <View style={styles.row}>
                <Typography color={theme.palette.grey[10]} bold>
                  {asset ? asset.symbol : availableAsset?.symbol}
                </Typography>
                <View style={styles.verticalDivider} />
                <TouchableOpacity
                  onPress={() =>
                    setAmount(
                      String(
                        max !== undefined
                          ? max / 10 ** 6
                          : asset
                          ? Math.max(
                              Number(asset.coin.amount) / 10 ** 6 -
                                (asset.coin.denom === 'uusd' ? 0.5 : 0),
                              0
                            )
                          : stakedAmount || Number(farm?.balance) / 10 ** 6
                      )
                    )
                  }
                >
                  <Typography bold color={theme.palette.lightPrimary}>
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
            Number(amount) *
              (asset ? asset.price : farm ? farm.rate.ust * 2 : 0) *
              10 ** 6 *
              currencyRate,
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
