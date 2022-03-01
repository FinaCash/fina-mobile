import React from 'react'
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native'
import useStyles from '../../theme/useStyles'
import Typography from '../Typography'
import getStyles from './styles'

interface ButtonProps extends TouchableOpacityProps {
  icon?: React.ReactElement
  size?: 'Small' | 'Base' | 'Large'
  loading?: boolean
  bgColor?: string
  color?: string
  iconStyle?: ViewStyle
  borderRadius?: number
  bold?: boolean
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
  iconStyle,
  bold,
  ...props
}) => {
  const { styles, theme } = useStyles(getStyles)
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor:
            !loading && !disabled ? bgColor || theme.palette.button : theme.palette.grey[3],
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
      {loading ? (
        <ActivityIndicator size={theme.fonts[size].fontSize} color={color || theme.palette.white} />
      ) : null}
      {icon && !loading ? (
        <View style={[styles.iconContainer, iconStyle]}>
          {React.cloneElement(icon, {
            color: color || theme.palette.white,
            fill: color || theme.palette.white,
            width: theme.fonts[size].fontSize * 1.5,
            height: theme.fonts[size].fontSize * 1.5,
          })}
        </View>
      ) : null}
      {loading ? null : typeof children === 'string' ? (
        <Typography type={size} color={color || theme.palette.white} bold={bold}>
          {children}
        </Typography>
      ) : (
        children
      )}
    </TouchableOpacity>
  )
}

export default Button
