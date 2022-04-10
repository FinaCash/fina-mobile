import { get } from 'lodash'
import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { useSettingsContext } from '../../contexts/SettingsContext'
import useStyles from '../../theme/useStyles'
import { AvailableAsset } from '../../types/assets'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import { colleteralsInfo } from '../../utils/terraConfig'
import Typography from '../Typography'
import getStyles from './styles'

export interface AvailableAssetItemProps extends TouchableOpacityProps {
  availableAsset: AvailableAsset
  amount?: number
}

const AvailableAssetItem: React.FC<AvailableAssetItemProps> = ({
  availableAsset,
  amount,
  ...props
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { currency, currencyRate } = useSettingsContext()

  const deltaPercent =
    availableAsset.prevPrice === undefined
      ? undefined
      : (availableAsset.price - availableAsset.prevPrice) / availableAsset.prevPrice

  const collateral = availableAsset ? (colleteralsInfo as any)[availableAsset.symbol] : undefined

  return (
    <TouchableOpacity {...props}>
      <View style={styles.innerContainer}>
        <View style={styles.row}>
          <Image source={{ uri: availableAsset.image }} style={styles.avatar} />
          <View>
            <Typography type="H6">
              {availableAsset.displaySymbol || availableAsset.symbol}
            </Typography>
            <Typography type="Small" color={theme.palette.grey[7]} numberOfLines={2}>
              {availableAsset.name}
            </Typography>
          </View>
        </View>

        {amount === undefined ? (
          <View style={styles.rightAligned}>
            <Typography type="H6">
              {formatCurrency(availableAsset.price * 10 ** 6 * currencyRate, currency, true)}
            </Typography>
            {deltaPercent === undefined ? null : (
              <Typography
                bold
                type="Small"
                color={deltaPercent >= 0 ? theme.palette.green : theme.palette.red}
              >
                {deltaPercent >= 0 ? '▲' : '▼'} {formatPercentage(Math.abs(deltaPercent), 2)}
              </Typography>
            )}
          </View>
        ) : (
          <View style={styles.rightAligned}>
            <Typography type="H6">
              {formatCurrency(
                amount * 10 ** get(collateral, 'digits', 6),
                availableAsset.coin.denom,
                undefined,
                undefined,
                get(collateral, 'digits', 6)
              )}
            </Typography>
            <Typography type="Small" color={theme.palette.grey[7]}>
              {formatCurrency(
                amount * 10 ** get(collateral, 'digits', 6) * availableAsset.price * currencyRate,
                currency,
                true
              )}
            </Typography>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default AvailableAssetItem
