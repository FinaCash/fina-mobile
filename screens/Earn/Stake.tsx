import React from 'react'
import { Alert, SectionList, View } from 'react-native'
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

const Stake: React.FC = () => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)
  const { availableAssets, assets } = useAssetsContext()
  const { showActionSheetWithOptions } = useActionSheet()
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
          onPress={() =>
            showActionSheetWithOptions(
              { options: [t('buy'), t('sell'), t('cancel')], cancelButtonIndex: 2 },
              (i) => {
                if (i === 0) {
                  Actions.Swap({ mode: 'buy', asset: item })
                } else {
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
  )
}

export default Stake
