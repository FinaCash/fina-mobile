import React from 'react'
import { View, TextInput, TextInputProps } from 'react-native'
import SearchIcon from '../../assets/images/icons/search.svg'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'

interface SearchBarProps extends TextInputProps {}

const SearchBar: React.FC<SearchBarProps> = ({ style, ...props }) => {
  const { styles } = useStyles(getStyles)
  return (
    <View style={[styles.searchBar, style]}>
      <SearchIcon />
      <TextInput style={styles.input} placeholder="Search" {...props} />
    </View>
  )
}

export default SearchBar
