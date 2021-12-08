import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import useStyles from '../../theme/useStyles'
import { Asset } from '../../types/assets'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import Typography from '../Typography'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'

export interface StakingItemProps extends TouchableOpacityProps {
  asset: Asset
  hideBorder?: boolean
  hideValue?: boolean
}

const StakingItem: React.FC<StakingItemProps> = ({ asset, hideBorder, hideValue, ...props }) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()

  return (
    <TouchableOpacity {...props}>
      <View style={[styles.innerContainer, hideBorder ? { borderBottomWidth: 0 } : {}]}>
        <View style={styles.topContainer}>
          <View style={styles.row}>
            <Image source={{ uri: asset.image }} style={styles.avatar} />
            <View>
              <Typography type="H6">{asset.symbol}</Typography>
              <Typography type="Small" color={theme.palette.grey[7]} numberOfLines={2}>
                {asset.name}
              </Typography>
            </View>
          </View>

          {hideValue ? null : (
            <View style={styles.rightAligned}>
              <Typography type="H6">
                {formatCurrency(asset.staked || 0, asset.coin.denom)}
              </Typography>
              <Typography type="Small" color={theme.palette.grey[7]}>
                {formatCurrency((asset.staked || 0) * asset.price, 'uusd', true)}
              </Typography>
            </View>
          )}
        </View>

        <View style={styles.aprContainer}>
          <View>
            <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
              {t('available')}
            </Typography>
            <Typography bold>{formatPercentage(asset.apr || 0, 2)}</Typography>
          </View>
          <View style={styles.alignRight}>
            <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
              {t('delegated')}
            </Typography>
            <Typography bold>{formatCurrency(rewards, '')}</Typography>
          </View>
          <View style={styles.alignRight}>
            <Typography color={theme.palette.grey[7]} style={styles.gutterBottom}>
              {t('unbonding')}
            </Typography>
            <Typography bold>
              {formatCurrency(rewards * availableAsset.price, 'uusd', true)}
            </Typography>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default StakingItem
