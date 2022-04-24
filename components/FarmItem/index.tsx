import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import useStyles from '../../theme/useStyles'
import { AvailableAsset, FarmType } from '../../types/assets'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import Typography from '../Typography'
import getStyles from './styles'
import { getCurrentAssetDetail } from '../../utils/transformAssets'
import { useSettingsContext } from '../../contexts/SettingsContext'

export interface FarmItemProps extends TouchableOpacityProps {
  asset: AvailableAsset
  pairAsset?: AvailableAsset
  farmType: FarmType
  dex: string
  apr?: number
  balance?: number
  rate?: {
    token: number
    pairToken: number
  }
  hideBorder?: boolean
}

const FarmItem: React.FC<FarmItemProps> = ({
  asset,
  pairAsset,
  farmType,
  apr,
  balance,
  rate,
  hideBorder,
  dex,
  ...props
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { currency, currencyRate } = useSettingsContext()
  const pairToken =
    farmType === FarmType.Long
      ? pairAsset?.symbol
        ? pairAsset
        : getCurrentAssetDetail({ denom: 'uusd', amount: '0' }, 1)
      : undefined

  return (
    <TouchableOpacity {...props}>
      <View style={[styles.innerContainer, hideBorder ? { borderBottomWidth: 0 } : {}]}>
        <View style={styles.topContainer}>
          <View style={styles.row}>
            <Image source={{ uri: asset.image }} style={styles.avatar} />
            {pairToken ? (
              <Image source={{ uri: pairToken.image }} style={styles.secondAvatar} />
            ) : null}
            <View>
              <Typography style={styles.gutterBottom} type="H6">
                {asset.symbol}
                {pairToken ? ` + ${pairToken.symbol}` : ''}
              </Typography>
              <Typography type="Small" color={theme.palette.grey[7]}>
                {dex}
              </Typography>
            </View>
          </View>
          <View style={styles.rightAligned}>
            <Typography style={styles.gutterBottom} type="H6">
              {apr ? formatPercentage(apr) : formatCurrency(balance || 0, '')}
            </Typography>
            {rate && balance !== undefined ? (
              <Typography type="Small" color={theme.palette.grey[7]}>
                {formatCurrency(
                  balance * rate.token * 2 * asset.price * currencyRate,
                  currency,
                  true
                )}
              </Typography>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default FarmItem
