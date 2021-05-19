import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'

interface CardProps extends TouchableOpacityProps {}

const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  const { styles } = useStyles(getStyles)
  return (
    <TouchableOpacity style={[styles.card, style]} {...props}>
      {children}
    </TouchableOpacity>
  )
}

export default Card
