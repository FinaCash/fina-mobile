import React from 'react'
import { Image, View } from 'react-native'
import useStyles from '../../theme/useStyles'
import Card from '../Card'
import Typography from '../Typography'
import getStyles from './styles'

interface AssetCardProps {
  title: string
  badge?: string
  subtitle?: string
  image?: string
  value?: string
}

const AssetCard: React.FC<AssetCardProps> = ({ title, badge, subtitle, image, value }) => {
  const { styles, theme } = useStyles(getStyles)
  return (
    <Card style={styles.container}>
      <View style={styles.row}>
        {image ? <Image source={{ uri: image }} style={styles.avatar} /> : null}
        {badge ? (
          <View style={styles.badge}>
            <Typography color={theme.palette.white} type="Small">
              {badge}
            </Typography>
          </View>
        ) : null}
        <View>
          <Typography type="H5">{title}</Typography>
          {subtitle ? <Typography>{subtitle}</Typography> : null}
        </View>
      </View>
      {value ? <Typography type="H5">{value}</Typography> : null}
    </Card>
  )
}

export default AssetCard
