import React from 'react'
import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import useStyles from '../../theme/useStyles'
import Typography from '../Typography'
import getStyles from './styles'

interface ButtonProps extends TouchableOpacityProps {
  icon?: React.ReactElement
  size?: 'Small' | 'Base' | 'Large'
  loading?: boolean
  bgColor?: string
  color?: string
  borderRadius?: number
}

const paddings = {
  Small: 2,
  Base: 3,
  Large: 4,
}

const Button: React.FC<ButtonProps> = ({
  children,
  style,
  icon,
  size = 'Base',
  loading,
  disabled,
  bgColor,
  color,
  borderRadius,
  onPress,
  ...props
}) => {
  const { styles, theme } = useStyles(getStyles)
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor:
            !loading && !disabled ? bgColor || theme.palette.primary : theme.palette.grey[3],
        },
        {
          paddingHorizontal: theme.baseSpace * paddings[size],
          paddingVertical: theme.baseSpace * (paddings[size] - 1),
          borderRadius: theme.borderRadius[borderRadius || 0],
        },
        style,
      ]}
      disabled={!onPress || disabled || loading}
      onPress={onPress}
      {...props}
    >
      {loading ? <ActivityIndicator size={theme.fonts[size].fontSize} /> : null}
      {icon && !loading ? (
        <View style={styles.iconContainer}>
          {React.cloneElement(icon, {
            color: color || theme.palette.white,
            size: theme.fonts[size].fontSize,
          })}
        </View>
      ) : null}
      {loading ? null : typeof children === 'string' ? (
        <Typography type={size} color={color || theme.palette.white}>
          {children}
        </Typography>
      ) : (
        children
      )}
    </TouchableOpacity>
  )
}

export default Button
