import React from 'react'
import { FlatList, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import SearchIcon from '../../assets/images/icons/search.svg'
import HeaderBar from '../../components/HeaderBar'
import AvailableAssetItem from '../../components/AvailableAssetItem'
import { useAssetsContext } from '../../contexts/AssetsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Input from '../../components/Input'

const Invest: React.FC = () => {
  const { t } = useTranslation()
  const { styles } = useStyles(getStyles)
  const { availableAssets } = useAssetsContext()
  const [search, setSearch] = React.useState('')

  return (
    <>
      <HeaderBar title={t('invest')} />
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
        keyExtractor={(item) => item.symbol}
        data={availableAssets.filter((a) =>
          (a.symbol + a.name).toLowerCase().includes(search.toLowerCase())
        )}
        renderItem={({ item }) => (
          <AvailableAssetItem
            availableAsset={item}
            onPress={() => Actions.Swap({ mode: 'buy', asset: item })}
          />
        )}
      />
    </>
  )
}

export default Invest
