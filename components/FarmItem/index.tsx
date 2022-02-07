import React from 'react'
import { Image, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { FontAwesome as Icon } from '@expo/vector-icons'
import useStyles from '../../theme/useStyles'
import { AvailableAsset, FarmType } from '../../types/assets'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import Typography from '../Typography'
import getStyles from './styles'
import { getCurrentAssetDetail } from '../../utils/transformAssets'

export interface FarmItemProps extends TouchableOpacityProps {
  asset: AvailableAsset
  farmType: FarmType
  apr?: number
  balance?: number
  rate?: {
    token: number
    ust: number
  }
  hideBorder?: boolean
}

const FarmItem: React.FC<FarmItemProps> = ({
  asset,
  farmType,
  apr,
  balance,
  rate,
  hideBorder,
  ...props
}) => {
  const { styles, theme } = useStyles(getStyles)
  const ust =
    farmType === FarmType.Long
      ? getCurrentAssetDetail({ denom: 'uusd', amount: '0' }, 1)
      : undefined

  return (
    <TouchableOpacity {...props}>
      <View style={[styles.innerContainer, hideBorder ? { borderBottomWidth: 0 } : {}]}>
        <View style={styles.topContainer}>
          <View style={styles.row}>
            <Image source={{ uri: asset.image }} style={styles.avatar} />
            {ust ? <Image source={{ uri: ust.image }} style={styles.avatar} /> : null}
            <View>
              <Typography style={styles.gutterBottom} type="H6">
                {asset.symbol}
                {ust ? ` + ${ust.symbol}` : ''}
              </Typography>
              <Typography type="Small" color={theme.palette.grey[7]}>
                {asset.name}
              </Typography>
            </View>
          </View>
          <View style={styles.rightAligned}>
            <Typography style={styles.gutterBottom} type="H6">
              {apr ? formatPercentage(apr) : formatCurrency(balance || 0, '')}
            </Typography>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default FarmItem
