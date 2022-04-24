import React from 'react'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'
import { Asset, AssetTypes, AvailableAsset, Validator, Farm, FarmType } from '../../types/assets'
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
import { colleteralsInfo } from '../../utils/terraConfig'
import get from 'lodash/get'

interface AssetAmountInputProps {
  farm?: Farm
  asset?: Asset
  availableAsset?: AvailableAsset
  pairAsset?: AvailableAsset
  validator?: Validator
  stakedAmount?: number
  amount: string
  setAmount(amount: string): void
  assetItemProps?: Omit<AssetItemProps, 'asset'>
  availableAssetItemProps?: Omit<AvailableAssetItemProps, 'availableAsset'>
  inputProps?: InputProps
  max?: number
  bottomElement?: React.ReactNode
  hideProvided?: boolean
}

const AssetAmountInput: React.FC<AssetAmountInputProps> = ({
  asset,
  farm,
  availableAsset,
  pairAsset,
  validator,
  stakedAmount,
  amount,
  setAmount,
  assetItemProps,
  availableAssetItemProps,
  inputProps,
  max,
  bottomElement,
  hideProvided,
}) => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)
  const { currency, currencyRate } = useSettingsContext()

  const collateral = asset ? (colleteralsInfo as any)[asset.symbol] : undefined

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
          pairAsset={pairAsset}
          farmType={farm.type}
          balance={farm.balance}
          rate={farm.rate}
          dex={farm.dex}
          {...assetItemProps}
        />
      ) : availableAsset ? (
        <AvailableAssetItem availableAsset={availableAsset} {...availableAssetItemProps} />
      ) : asset && asset.type === AssetTypes.Collaterals && !hideProvided ? (
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
                  {asset
                    ? asset.symbol
                    : farm && farm.type === FarmType.Long && availableAsset
                    ? availableAsset?.symbol + '-UST'
                    : availableAsset?.symbol}
                </Typography>
                <View style={styles.verticalDivider} />
                <TouchableOpacity
                  onPress={() =>
                    setAmount(
                      String(
                        max !== undefined
                          ? max / 10 ** get(collateral, 'digits', 6)
                          : asset
                          ? Math.max(
                              Number(asset.coin.amount) / 10 ** get(collateral, 'digits', 6) -
                                (asset.coin.denom === 'uusd' ? 0.5 : 0),
                              0
                            )
                          : stakedAmount ||
                            Number(farm?.balance) / 10 ** get(collateral, 'digits', 6)
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
          {farm && farm.type === FarmType.Long
            ? `${formatCurrency(Number(amount) * farm.rate.token * 10 ** 6, farm.symbol)} ${
                farm.symbol
              } + ${formatCurrency(
                Number(amount) * farm.rate.pairToken * 10 ** 6,
                farm.pairSymbol
              )} ${farm.pairSymbol} = `
            : '~'}
          {formatCurrency(
            Number(amount) *
              (asset
                ? asset.price
                : farm
                ? farm.rate.token * 2 * (availableAsset?.price || 1)
                : 0) *
              10 ** get(collateral, 'digits', 6) *
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
