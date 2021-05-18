import React from 'react'
import { View, ViewProps } from 'react-native'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'

interface CardProps extends ViewProps {}

const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  const { styles } = useStyles(getStyles)
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  )
}

export default Card
