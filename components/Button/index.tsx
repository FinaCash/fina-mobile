import React from 'react'
import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import useStyles from '../../theme/useStyles'
import Typography from '../Typography'
import getStyles from './styles'

interface ButtonProps extends TouchableOpacityProps {
  icon?: React.ReactElement
  size?: 'Small' | 'Base' | 'Large'
  loading?: boolean
}

const paddings = {
  Small: 1,
  Base: 2,
  Large: 3,
}

const Button: React.FC<ButtonProps> = ({
  children,
  style,
  icon,
  size = 'Base',
  loading,
  disabled,
  ...props
}) => {
  const { styles, theme } = useStyles(getStyles)
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: !loading ? theme.palette.primary : theme.palette.grey[3] },
        { padding: theme.baseSpace * paddings[size] },
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <ActivityIndicator size={theme.fonts[size].fontSize} /> : null}
      {icon && !loading ? (
        <View style={styles.iconContainer}>
          {React.cloneElement(icon, {
            color: theme.palette.white,
            size: theme.fonts[size].fontSize,
          })}
        </View>
      ) : null}
      {loading ? null : typeof children === 'string' ? (
        <Typography type={size} color={theme.palette.white} bold>
          {children}
        </Typography>
      ) : (
        children
      )}
    </TouchableOpacity>
  )
}

export default Button
