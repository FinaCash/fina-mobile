import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import useStyles from '../../theme/useStyles'
import { AvailableAsset } from '../../types/assets'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import Typography from '../Typography'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { useSettingsContext } from '../../contexts/SettingsContext'

export interface RewardsItemProps extends TouchableOpacityProps {
  rewards: number
  availableAsset: AvailableAsset
  apr: number
  more?: number
  rewardsValue?: number
  hideBorder?: boolean
  hideValue?: boolean
}

const RewardsItem: React.FC<RewardsItemProps> = ({
  rewards,
  availableAsset,
  apr,
  more,
  rewardsValue,
  hideBorder,
  hideValue,
  ...props
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { currency, currencyRate, hideAmount } = useSettingsContext()
  const deltaPercent = availableAsset
    ? (availableAsset.price - availableAsset.prevPrice) / availableAsset.prevPrice
    : 0

  return (
    <TouchableOpacity {...props}>
      <View style={[styles.innerContainer, hideBorder ? { borderBottomWidth: 0 } : {}]}>
        <View style={styles.topContainer}>
          <View style={styles.row}>
            <Image source={{ uri: availableAsset.image }} style={styles.avatar} />
            <View>
              <Typography type="H6">
                {availableAsset.symbol}{' '}
                {more ? (
                  <Typography color={theme.palette.green} type="H6">
                    {' '}
                    +{more}
                  </Typography>
                ) : null}
              </Typography>
              <Typography type="Small" color={theme.palette.grey[7]} numberOfLines={2}>
                {availableAsset.name}
              </Typography>
            </View>
          </View>

          {hideValue ? null : (
            <View style={styles.rightAligned}>
              <Typography type="H6">
                {formatCurrency(availableAsset.price * 10 ** 6 * currencyRate, currency, true)}
              </Typography>
              <Typography
                bold
                type="Small"
                color={deltaPercent >= 0 ? theme.palette.green : theme.palette.red}
              >
                {deltaPercent >= 0 ? '▲' : '▼'} {formatPercentage(Math.abs(deltaPercent), 2)}
              </Typography>
            </View>
          )}
        </View>

        <View style={styles.aprContainer}>
          <View>
            <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
              {t('apr')}
            </Typography>
            <Typography bold>{formatPercentage(apr, 2)}</Typography>
          </View>
          <View style={styles.alignRight}>
            <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
              {t('pending rewards')}
            </Typography>
            <Typography bold>
              {formatCurrency(rewards, '', undefined, hideAmount)}
              {more ? (
                <Typography color={theme.palette.green} bold>
                  {' '}
                  +{more}
                </Typography>
              ) : null}
            </Typography>
          </View>
          {hideValue ? null : (
            <View style={styles.alignRight}>
              <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
                {t('value')}
              </Typography>
              <Typography bold>
                {formatCurrency(
                  (rewardsValue || rewards * availableAsset.price) * currencyRate,
                  currency,
                  true,
                  hideAmount
                )}
              </Typography>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default RewardsItem
