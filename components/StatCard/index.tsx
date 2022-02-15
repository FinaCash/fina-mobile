import React from 'react'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import Typography from '../Typography'

interface StarCardProps extends TouchableOpacityProps {
  title: string
  value: string
  valueColor?: string
  ml?: number
  mr?: number
  mt?: number
  mb?: number
}

const StarCard: React.FC<StarCardProps> = ({
  title,
  value,
  valueColor,
  children,
  ml,
  mr,
  mt,
  mb,
  ...props
}) => {
  const { styles, theme } = useStyles(getStyles)

  return (
    <TouchableOpacity
      style={[
        styles.container,
        ml !== undefined ? { marginLeft: theme.baseSpace * ml } : {},
        mr !== undefined ? { marginRight: theme.baseSpace * mr } : {},
        mt !== undefined ? { marginTop: theme.baseSpace * mt } : {},
        mb !== undefined ? { marginBottom: theme.baseSpace * mb } : {},
      ]}
      {...props}
    >
      <Typography style={styles.title} type="Small" color={theme.palette.grey[7]}>
        {title}
      </Typography>
      <Typography type="H4" style={valueColor ? { color: valueColor } : {}}>
        {value}
      </Typography>
      {children}
    </TouchableOpacity>
  )
}

export default StarCard
