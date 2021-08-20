import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import useStyles from '../../theme/useStyles'
import { AvailableAsset } from '../../types/assets'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import Typography from '../Typography'
import getStyles from './styles'

interface AvailableAssetItemProps extends TouchableOpacityProps {
  availableAsset: AvailableAsset
}

const AvailableAssetItem: React.FC<AvailableAssetItemProps> = ({
  availableAsset,
  style,
  ...props
}) => {
  const { styles, theme } = useStyles(getStyles)

  const deltaPercent = (availableAsset.price - availableAsset.prevPrice) / availableAsset.prevPrice

  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      <View style={styles.innerContainer}>
        <View style={styles.row}>
          <Image source={{ uri: availableAsset.image }} style={styles.avatar} />
          <View>
            <Typography type="H6">{availableAsset.symbol}</Typography>
            <Typography type="Small" numberOfLines={2}>
              {availableAsset.name}
            </Typography>
          </View>
        </View>

        <View style={styles.rightAligned}>
          <Typography type="H6">{formatCurrency(availableAsset.price, 'uusd')}</Typography>
          <Typography bold color={deltaPercent >= 0 ? theme.palette.green : theme.palette.red}>
            {deltaPercent >= 0 ? '▲' : '▼'} {formatPercentage(Math.abs(deltaPercent), 2)}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default AvailableAssetItem
