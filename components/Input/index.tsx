import React from 'react'
import { View, TextInput, TextInputProps } from 'react-native'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'

interface InputProps extends TextInputProps {
  icon?: React.ReactElement
}

const Input: React.FC<InputProps> = ({ style, icon, ...props }) => {
  const { styles, theme } = useStyles(getStyles)
  return (
    <View style={[styles.searchBar, style]}>
      {icon ? React.cloneElement(icon, { style: styles.icon }) : null}
      <TextInput style={styles.input} placeholderTextColor={theme.palette.grey[6]} {...props} />
    </View>
  )
}

export default Input
