import React from 'react'
import { FlatList, View } from 'react-native'
import AssetItem, { AssetItemProps } from '../../components/AssetItem'
import AvailableAssetItem, { AvailableAssetItemProps } from '../../components/AvailableAssetItem'
import HeaderBar from '../../components/HeaderBar'
import Input from '../../components/Input'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import { Asset, AvailableAsset } from '../../types/assets'
import SearchIcon from '../../assets/images/icons/search.svg'
import getStyles from './styles'

interface SelectAssetProps {
  onSelect(asset: Asset | AvailableAsset): void
  assets?: Asset[]
  availableAssets?: AvailableAsset[]
  assetItemProps?: AssetItemProps
  availableAssetItemProps?: AvailableAssetItemProps
}

const SelectAsset: React.FC<SelectAssetProps> = ({
  onSelect,
  assets,
  assetItemProps,
  availableAssets,
  availableAssetItemProps,
}) => {
  const { t } = useTranslation()
  const { styles } = useStyles(getStyles)
  const [search, setSearch] = React.useState('')

  return (
    <>
      <HeaderBar back title={t('select asset')} />
      <View style={styles.searchBarContainer}>
        <Input
          placeholder={t('search')}
          icon={<SearchIcon />}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {assets ? (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.container}
          keyExtractor={(item) => item.symbol}
          data={assets.filter((a) =>
            (a.symbol + a.name).toLowerCase().includes(search.toLowerCase())
          )}
          renderItem={({ item }) => (
            <AssetItem hideApr asset={item} onPress={() => onSelect(item)} {...assetItemProps} />
          )}
        />
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.container}
          keyExtractor={(item) => item.symbol}
          data={(availableAssets || []).filter((a) =>
            (a.symbol + a.name).toLowerCase().includes(search.toLowerCase())
          )}
          renderItem={({ item }) => (
            <AvailableAssetItem
              availableAsset={item}
              onPress={() => onSelect(item)}
              {...availableAssetItemProps}
            />
          )}
        />
      )}
    </>
  )
}

export default SelectAsset
