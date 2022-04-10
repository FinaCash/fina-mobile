import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import useStyles from '../../theme/useStyles'
import { Asset, AvailableAsset } from '../../types/assets'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import Typography from '../Typography'
import getStyles from './styles'
import get from 'lodash/get'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { colleteralsInfo } from '../../utils/terraConfig'

export interface CollateralItemProps extends TouchableOpacityProps {
  asset: Asset
  availableAsset?: AvailableAsset
  hideBorder?: boolean
}

const CollateralItem: React.FC<CollateralItemProps> = ({
  asset,
  availableAsset,
  hideBorder,
  ...props
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { currency, currencyRate, hideAmount } = useSettingsContext()
  const deltaPercent = availableAsset
    ? availableAsset.prevPrice === undefined
      ? undefined
      : (availableAsset.price - availableAsset.prevPrice) / availableAsset.prevPrice
    : 0

  const collateral = (colleteralsInfo as any)[asset.symbol]

  return (
    <TouchableOpacity {...props}>
      <View style={[styles.innerContainer, hideBorder ? { borderBottomWidth: 0 } : {}]}>
        <View style={styles.topContainer}>
          <View style={styles.row}>
            <Image source={{ uri: asset.image }} style={styles.avatar} />
            <View>
              <Typography type="H6">{asset.displaySymbol || asset.symbol}</Typography>
              <Typography type="Small" color={theme.palette.grey[7]} numberOfLines={2}>
                {asset.name}
              </Typography>
            </View>
          </View>

          {availableAsset ? (
            <View style={styles.rightAligned}>
              <Typography type="H6">
                {formatCurrency(
                  availableAsset.price * 10 ** collateral.digits * currencyRate,
                  currency,
                  true
                )}
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
              <Typography style={styles.gutterBottom} type="H6">
                {formatCurrency(
                  asset.coin.amount,
                  asset.coin.denom,
                  undefined,
                  undefined,
                  collateral.digits
                )}
              </Typography>
              <Typography type="Small" color={theme.palette.grey[7]}>
                {formatCurrency(
                  String(asset.price * Number(asset.coin.amount) * currencyRate),
                  currency,
                  true
                )}
              </Typography>
            </View>
          )}
        </View>
        {asset ? (
          <View style={styles.aprContainer}>
            <View>
              <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
                {t('not provided')}
              </Typography>
              <Typography bold>
                {formatCurrency(
                  get(asset, 'notProvided', 0).toString(),
                  get(asset, 'coin.denom', ''),
                  undefined,
                  hideAmount,
                  collateral.digits
                )}
              </Typography>
            </View>
            <View>
              <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
                {t('provided')}
              </Typography>
              <Typography bold>
                {formatCurrency(
                  get(asset, 'provided', 0).toString(),
                  get(asset, 'coin.denom', ''),
                  undefined,
                  hideAmount,
                  collateral.digits
                )}
              </Typography>
            </View>
            <View style={styles.alignRight}>
              <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
                {t('collateral max ltv')}
              </Typography>
              <Typography bold>{formatPercentage(get(asset, 'maxLtv', 0), 0)}</Typography>
            </View>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  )
}

export default CollateralItem
