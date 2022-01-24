import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { FontAwesome as Icon } from '@expo/vector-icons'
import useStyles from '../../theme/useStyles'
import { AvailableAsset } from '../../types/assets'
import { formatPercentage } from '../../utils/formatNumbers'
import Typography from '../Typography'
import getStyles from './styles'

export interface FarmItemProps extends TouchableOpacityProps {
  asset: AvailableAsset
  asset2?: AvailableAsset
  apr: number
  hideBorder?: boolean
}

const FarmItem: React.FC<FarmItemProps> = ({ asset, asset2, apr, hideBorder, ...props }) => {
  const { styles, theme } = useStyles(getStyles)

  return (
    <TouchableOpacity {...props}>
      <View style={[styles.innerContainer, hideBorder ? { borderBottomWidth: 0 } : {}]}>
        <View style={styles.topContainer}>
          <View style={styles.row}>
            <Image source={{ uri: asset.image }} style={styles.avatar} />
            {asset2 ? <Image source={{ uri: asset2.image }} style={styles.avatar} /> : null}
            <View>
              <Typography style={styles.gutterBottom} type="H6">
                {asset.symbol}
              </Typography>
              <Typography type="Small" color={theme.palette.grey[7]}>
                {asset.name}
              </Typography>
            </View>
          </View>
          <View style={styles.rightAligned}>
            <Typography style={styles.gutterBottom} type="H6">
              {formatPercentage(apr)}
            </Typography>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default FarmItem
