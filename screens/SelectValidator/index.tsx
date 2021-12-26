import React from 'react'
import { FlatList, View } from 'react-native'
import AssetItem, { AssetItemProps } from '../../components/AssetItem'
import AvailableAssetItem, { AvailableAssetItemProps } from '../../components/AvailableAssetItem'
import HeaderBar from '../../components/HeaderBar'
import Input from '../../components/Input'
import useStyles from '../../theme/useStyles'
import { Validator } from '../../types/assets'
import SearchIcon from '../../assets/images/icons/search.svg'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { useAssetsContext } from '../../contexts/AssetsContext'
import StakingItem from '../../components/StakingItem'

interface SelectValidatorProps {
  onSelect(validator: Validator): void
}

const SelectValidator: React.FC<SelectValidatorProps> = ({ onSelect }) => {
  const { t } = useLocalesContext()
  const { validators } = useAssetsContext()
  const { styles } = useStyles(getStyles)
  const [search, setSearch] = React.useState('')

  return (
    <>
      <HeaderBar back title={t('select validator')} />
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
        keyExtractor={(item) => item.address}
        data={validators.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))}
        renderItem={({ item }) => (
          <StakingItem
            hideValue
            validator={item}
            onPress={() => onSelect(item)}
            amount={0}
            symbol=""
            price={0}
          />
        )}
      />
    </>
  )
}

export default SelectValidator
