import React from 'react'
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import useStyles from '../../theme/useStyles'
import Typography from '../Typography'
import getStyles from './styles'

interface ButtonProps extends TouchableOpacityProps {
  icon?: React.ReactElement
}

const Button: React.FC<ButtonProps> = ({ children, style, icon, ...props }) => {
  const { styles, theme } = useStyles(getStyles)
  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      {icon ? (
        <View style={styles.iconContainer}>
          {React.cloneElement(icon, {
            color: theme.palette.white,
            size: theme.fonts.Base.fontSize,
          })}
        </View>
      ) : null}
      {typeof children === 'string' ? (
        <Typography color={theme.palette.white} bold>
          {children}
        </Typography>
      ) : (
        children
      )}
    </TouchableOpacity>
  )
}

export default Button
