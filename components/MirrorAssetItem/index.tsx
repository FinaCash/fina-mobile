import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import useStyles from '../../theme/useStyles'
import { MirrorAsset } from '../../types/assets'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import Typography from '../Typography'
import getStyles from './styles'
import { Currencies } from '../../types/misc'
import { darkBGIconMAssets } from '../../utils/terraConfig'

interface MirrorAssetItemProps extends TouchableOpacityProps {
  mAsset: MirrorAsset
}

const MirrorAssetItem: React.FC<MirrorAssetItemProps> = ({ mAsset, style, ...props }) => {
  const { styles, theme } = useStyles(getStyles)

  const deltaPercent = (mAsset.price - mAsset.prevPrice) / mAsset.prevPrice

  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      <View style={styles.innerContainer}>
        <View style={styles.row}>
          <Image
            source={{ uri: mAsset.image }}
            style={[
              styles.avatar,
              darkBGIconMAssets.includes(mAsset.symbol) ? styles.darkBackground : {},
            ]}
          />
          <View>
            <Typography type="H6">{mAsset.symbol}</Typography>
            <Typography type="Small" numberOfLines={2}>
              {mAsset.name}
            </Typography>
          </View>
        </View>

        <View style={styles.rightAligned}>
          <Typography type="H6">{formatCurrency(mAsset.price, Currencies.USD)}</Typography>
          <Typography bold color={deltaPercent >= 0 ? theme.palette.green : theme.palette.red}>
            {deltaPercent >= 0 ? '▲' : '▼'} {formatPercentage(Math.abs(deltaPercent), 2)}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default MirrorAssetItem
