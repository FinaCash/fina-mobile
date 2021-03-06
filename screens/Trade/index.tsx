import React from 'react'
import { Alert, RefreshControl, SectionList, View } from 'react-native'
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
import { useActionSheet } from '@expo/react-native-action-sheet'
import { getMAssetDetail } from '../../utils/transformAssets'
import { AssetTypes } from '../../types/assets'
import { colleteralsInfo, supportedTokens } from '../../utils/terraConfig'

const Trade: React.FC = () => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)
  const { availableAssets, assets, fetchAvailableAssets, fetchAssets, fetchBorrowInfo } =
    useAssetsContext()
  const { showActionSheetWithOptions } = useActionSheet()
  const [search, setSearch] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const groupedAssets = groupBy(
    availableAssets.filter((a) => (a.symbol + a.name).toLowerCase().includes(search.toLowerCase())),
    'type'
  )
  const sections = Object.keys(groupedAssets).map((k) => ({
    title: t(k),
    data: groupedAssets[k].filter((a) =>
      k === AssetTypes.Collaterals
        ? (colleteralsInfo as any)[a.coin.denom]?.tradeable
        : k === AssetTypes.Tokens
        ? !!(supportedTokens as any)[a.coin.denom]?.addresses.pair
        : true
    ),
  }))

  return (
    <>
      <HeaderBar title={t('trade')} />
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
        refreshControl={
          <RefreshControl
            tintColor={theme.fonts.H1.color}
            refreshing={loading}
            onRefresh={async () => {
              setLoading(true)
              const timeout = setTimeout(() => setLoading(false), 5000)
              await Promise.all([fetchAvailableAssets(), fetchAssets(), fetchBorrowInfo()])
              clearTimeout(timeout)
              setLoading(false)
            }}
          />
        }
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
            onPress={() =>
              showActionSheetWithOptions(
                { options: [t('buy'), t('sell'), t('cancel')], cancelButtonIndex: 2 },
                (i) => {
                  if (i === 0) {
                    Actions.Swap({ mode: 'buy', asset: item })
                  } else if (i === 1) {
                    const asset =
                      assets.find((a) => a.symbol === item.symbol) ||
                      getMAssetDetail({ denom: item.coin.denom, amount: '0' }, availableAssets)
                    Actions.Swap({ mode: 'sell', asset })
                  }
                }
              )
            }
          />
        )}
      />
    </>
  )
}

export default Trade
