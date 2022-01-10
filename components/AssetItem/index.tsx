import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { FontAwesome as Icon } from '@expo/vector-icons'
import useStyles from '../../theme/useStyles'
import { Asset, StakingInfo } from '../../types/assets'
import { formatCurrency, formatPercentage, getCurrencySymbol } from '../../utils/formatNumbers'
import Typography from '../Typography'
import getStyles from './styles'
import get from 'lodash/get'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { useSettingsContext } from '../../contexts/SettingsContext'

export interface AssetItemProps extends TouchableOpacityProps {
  asset?: Asset
  hideApr?: boolean
  hideAmount?: boolean
  hideBorder?: boolean
  stakingInfo?: StakingInfo
  reversePriceAmount?: boolean
}

const AssetItem: React.FC<AssetItemProps> = ({
  asset,
  hideApr,
  hideAmount,
  hideBorder,
  stakingInfo,
  reversePriceAmount,
  ...props
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { currencyRate, currency } = useSettingsContext()

  const totalDelegated = stakingInfo
    ? stakingInfo.delegated.map((d) => d.amount).reduce((a, b) => a + b, 0)
    : 0
  const totalUnbonding = stakingInfo
    ? stakingInfo.unbonding.map((d) => d.amount).reduce((a, b) => a + b, 0)
    : 0
  const totalAmount = asset ? Number(asset.coin.amount) + totalDelegated + totalUnbonding : 0
  const totalAmountString = asset
    ? formatCurrency(totalAmount, asset.coin.denom) + (reversePriceAmount ? ` ${asset.symbol}` : '')
    : ''
  const totalValueString =
    asset && asset.price
      ? formatCurrency(String(asset.price * totalAmount * currencyRate), currency, true)
      : ''

  return (
    <TouchableOpacity {...props}>
      <View style={[styles.innerContainer, hideBorder ? { borderBottomWidth: 0 } : {}]}>
        <View style={styles.topContainer}>
          {asset ? (
            <View style={styles.row}>
              <Image source={{ uri: asset.image }} style={styles.avatar} />
              <View>
                <Typography style={styles.gutterBottom} type="H6">
                  {asset.symbol}
                </Typography>
                <Typography type="Small" color={theme.palette.grey[7]}>
                  {asset.name}
                </Typography>
              </View>
            </View>
          ) : (
            <View style={styles.row}>
              <Icon
                name="question-circle-o"
                size={10 * theme.baseSpace}
                style={styles.avatar}
                color={theme.fonts.H6.color}
              />
              <Typography type="H6">{t('select asset')}</Typography>
            </View>
          )}
          {asset && !hideAmount ? (
            <View style={styles.rightAligned}>
              <Typography style={styles.gutterBottom} type="H6">
                {reversePriceAmount ? totalValueString : totalAmountString}
              </Typography>
              <Typography type="Small" color={theme.palette.grey[7]}>
                {reversePriceAmount ? totalAmountString : totalValueString}
              </Typography>
            </View>
          ) : null}
          {!asset ? (
            <Icon name="chevron-down" size={4 * theme.baseSpace} color={theme.fonts.H6.color} />
          ) : null}
        </View>
        {asset && asset.apr && !hideApr ? (
          <View style={styles.aprContainer}>
            <View>
              <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
                {t(asset.autoCompound ? 'apy' : 'apr', {
                  symbol: getCurrencySymbol(`u${asset.coin.denom.slice(-3)}`),
                })}
              </Typography>
              <Typography bold>{formatPercentage(asset.apr, 2)}</Typography>
            </View>
            <View style={styles.alignRight}>
              <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
                {t('rewards')}
              </Typography>
              <Typography color={theme.palette.green} bold>
                {asset.autoCompound
                  ? t('auto compounded')
                  : formatCurrency(
                      get(asset, 'rewards.amount', 0).toString(),
                      get(asset, 'rewards.denom', '')
                    )}
              </Typography>
            </View>
          </View>
        ) : null}
        {asset && stakingInfo ? (
          <View style={styles.aprContainer}>
            <View>
              <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
                {t('available')}
              </Typography>
              <Typography bold>{formatCurrency(asset.coin.amount, asset.coin.denom)}</Typography>
            </View>
            <View>
              <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
                {t('delegated')}
              </Typography>
              <Typography bold>{formatCurrency(totalDelegated, asset.coin.denom)}</Typography>
            </View>
            <View style={styles.alignRight}>
              <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
                {t('unbonding')}
              </Typography>
              <Typography bold>{formatCurrency(totalUnbonding, asset.coin.denom)}</Typography>
            </View>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  )
}

export default AssetItem
