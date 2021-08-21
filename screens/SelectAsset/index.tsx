import React from 'react'
import { FlatList } from 'react-native'
import AssetItem, { AssetItemProps } from '../../components/AssetItem'
import AvailableAssetItem, { AvailableAssetItemProps } from '../../components/AvailableAssetItem'
import HeaderBar from '../../components/HeaderBar'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import { Asset, AvailableAsset } from '../../types/assets'
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

  return (
    <>
      <HeaderBar back title={t('select asset')} />
      {assets ? (
        <FlatList
          style={styles.list}
          keyExtractor={(item) => item.symbol}
          data={assets}
          renderItem={({ item }) => (
            <AssetItem hideApr asset={item} onPress={() => onSelect(item)} {...assetItemProps} />
          )}
        />
      ) : (
        <FlatList
          style={styles.list}
          keyExtractor={(item) => item.symbol}
          data={availableAssets}
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
