import React from 'react'
import { SectionList, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import SearchIcon from '../../assets/images/icons/search.svg'
import HeaderBar from '../../components/HeaderBar'
import AvailableAssetItem from '../../components/AvailableAssetItem'
import { useAssetsContext } from '../../contexts/AssetsContext'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Input from '../../components/Input'
import { groupBy } from 'lodash'
import Typography from '../../components/Typography'
import { useLocalesContext } from '../../contexts/LocalesContext'

const Invest: React.FC = () => {
  const { t } = useLocalesContext()
  const { styles } = useStyles(getStyles)
  const { availableAssets } = useAssetsContext()
  const [search, setSearch] = React.useState('')

  const groupedAssets = groupBy(
    availableAssets.filter((a) => (a.symbol + a.name).toLowerCase().includes(search.toLowerCase())),
    'type'
  )
  const sections = Object.keys(groupedAssets).map((k) => ({
    title: t(k),
    data: groupedAssets[k],
  }))

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
      <SectionList
        style={styles.list}
        keyExtractor={(item) => item.symbol}
        sections={sections}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.titleContainer}>
            <Typography type="Large" bold>
              {title}
            </Typography>
          </View>
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
