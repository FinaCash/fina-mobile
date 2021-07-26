import React from 'react'
import { View, TextInput, TextInputProps } from 'react-native'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'

interface InputProps extends TextInputProps {
  icon?: React.ReactElement
  endAdornment?: React.ReactElement
  size?: 'Large' | 'Base'
}

const Input: React.FC<InputProps> = ({ style, icon, size = 'Base', endAdornment, ...props }) => {
  const { styles, theme } = useStyles(getStyles)
  const containerPaddings = {
    Large: {
      paddingVertical: theme.baseSpace * 3,
      paddingHorizontal: theme.baseSpace * 4,
    },
    Base: {
      paddingVertical: theme.baseSpace * 2,
      paddingHorizontal: theme.baseSpace * 3,
    },
  }
  return (
    <View style={[styles.container, containerPaddings[size], style]}>
      {icon ? React.cloneElement(icon, { style: styles.icon }) : null}
      <TextInput
        style={[styles.input, size === 'Large' ? theme.fonts.Large : theme.fonts.Base]}
        placeholderTextColor={theme.palette.grey[6]}
        {...props}
      />
      {endAdornment ? <View style={styles.marginLeft}>{endAdornment}</View> : null}
    </View>
  )
}

export default Input
