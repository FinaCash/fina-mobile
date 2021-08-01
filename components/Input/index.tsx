import React from 'react'
import { View, TextInput, TextInputProps } from 'react-native'
import useStyles from '../../theme/useStyles'
import Typography from '../Typography'
import getStyles from './styles'

interface InputProps extends TextInputProps {
  icon?: React.ReactElement
  endAdornment?: React.ReactElement
  size?: 'XLarge' | 'Large' | 'Base'
  inputRef?: any
  error?: string
}

const Input: React.FC<InputProps> = ({
  style,
  icon,
  size = 'Base',
  endAdornment,
  inputRef,
  error,
  ...props
}) => {
  const { styles, theme } = useStyles(getStyles)
  const container = {
    XLarge: {
      paddingVertical: theme.baseSpace * 3,
      paddingHorizontal: theme.baseSpace * 4,
      borderRadius: theme.borderRadius[1],
    },
    Large: {
      paddingVertical: theme.baseSpace * 3,
      paddingHorizontal: theme.baseSpace * 4,
    },
    Base: {
      paddingVertical: theme.baseSpace * 2,
      paddingHorizontal: theme.baseSpace * 3,
    },
  }
  const font = {
    XLarge: {
      ...theme.fonts.Large,
      fontSize: theme.fonts.H4.fontSize,
    },
    Large: theme.fonts.Large,
    Base: theme.fonts.Base,
  }
  return (
    <>
      <View style={[styles.container, container[size], error ? styles.error : {}, style]}>
        {icon ? React.cloneElement(icon, { style: styles.icon }) : null}
        <TextInput
          ref={inputRef}
          style={[styles.input, font[size]]}
          placeholderTextColor={theme.palette.grey[6]}
          {...props}
        />
        {endAdornment ? <View style={styles.marginLeft}>{endAdornment}</View> : null}
      </View>
      {error ? (
        <Typography style={styles.errorText} color={theme.palette.red}>
          {error}
        </Typography>
      ) : null}
    </>
  )
}

export default Input
