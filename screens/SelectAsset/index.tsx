import React from 'react'
import { FlatList } from 'react-native'
import AssetItem from '../../components/AssetItem'
import HeaderBar from '../../components/HeaderBar'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import { Asset } from '../../types/assets'
import getStyles from './styles'

interface SelectAssetProps {
  onSelect(asset: Asset): void
  assets: Asset[]
}

const SelectAsset: React.FC<SelectAssetProps> = ({ onSelect, assets }) => {
  const { t } = useTranslation()
  const { styles } = useStyles(getStyles)

  return (
    <>
      <HeaderBar back title={t('select asset')} />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.container}
        keyExtractor={(item) => item.symbol}
        data={assets}
        renderItem={({ item }) => <AssetItem hideApr asset={item} onPress={() => onSelect(item)} />}
      />
    </>
  )
}

export default SelectAsset
