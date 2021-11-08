import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { FontAwesome as Icon } from '@expo/vector-icons'
import useStyles from '../../theme/useStyles'
import { Asset } from '../../types/assets'
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
}

const AssetItem: React.FC<AssetItemProps> = ({
  asset,
  hideApr,
  hideAmount,
  hideBorder,
  ...props
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { currencyRate, currency } = useSettingsContext()

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
                {formatCurrency(asset.coin.amount, asset.coin.denom)}
              </Typography>
              <Typography type="Small" color={theme.palette.grey[7]}>
                {asset.price
                  ? formatCurrency(
                      String(asset.price * Number(asset.coin.amount) * currencyRate),
                      currency,
                      true
                    )
                  : ''}
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
      </View>
    </TouchableOpacity>
  )
}

export default AssetItem
