import React from 'react'
import { FontAwesome5 as Icon } from '@expo/vector-icons'
import { TextInputProps, View } from 'react-native'
import TextInput from '../TextInput'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'

const SearchBar: React.FC<TextInputProps> = ({ style, ...props }) => {
  const { styles, theme } = useStyles(getStyles)
  return (
    <View style={[styles.container, style]}>
      <Icon name="search" size={theme.fonts.H5.fontSize} color={theme.palette.grey[5]} />
      <TextInput style={styles.input} {...props} />
    </View>
  )
}

export default SearchBar
