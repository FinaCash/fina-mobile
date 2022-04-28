import React from 'react'
import { FlatList, TouchableOpacity, View, Image } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import HeaderBar from '../../components/HeaderBar'
import Input from '../../components/Input'
import Typography from '../../components/Typography'
import useStyles from '../../theme/useStyles'
import SearchIcon from '../../assets/images/icons/search.svg'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { dapps } from '../../utils/terraConfig'
import { Actions } from 'react-native-router-flux'

const DappsList: React.FC = () => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)
  const [search, setSearch] = React.useState('')

  return (
    <>
      <HeaderBar back title={t('dapps')} />
      <View style={styles.searchBarContainer}>
        <Input
          placeholder={t('search')}
          icon={<SearchIcon />}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.container}
        keyExtractor={(item) => item.name}
        data={dapps.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => Actions.DappView({ dapp: item })}>
            <View style={styles.innerContainer}>
              <View style={styles.topContainer}>
                <View style={styles.row}>
                  <Image source={{ uri: item.image }} style={styles.avatar} />
                  <Typography type="H6">{item.name}</Typography>
                </View>
                <Icon
                  style={styles.arrow}
                  name="chevron-right"
                  size={6 * theme.baseSpace}
                  color={theme.fonts.Base.color}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </>
  )
}

export default DappsList
