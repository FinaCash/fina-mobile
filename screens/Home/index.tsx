import React from 'react'
import { Image, SectionList, View } from 'react-native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import AssetCard from '../../components/AssetCard'
import AssetDonutChart from '../../components/AssetsDonutChart'
import Typography from '../../components/Typography'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import {
  transformAssetsToDistributions,
  transformAssetsToSections,
} from '../../utils/transformAssets'
import getStyles from './styles'
import { Asset, AssetTypes } from '../../types/assets'
import { Actions } from 'react-native-router-flux'

const Home: React.FC = () => {
  const { styles } = useStyles(getStyles)
  const { assets } = useAssetsContext()
  const { currency } = useSettingsContext()
  const { t } = useTranslation()
  const { showActionSheetWithOptions } = useActionSheet()
  const [assetsDistribution, setAssetsDistribution] = React.useState<
    Array<{ type: string; value: number }>
  >([])

  const calculateAssetsDistribution = React.useCallback(async () => {
    try {
      const result = await transformAssetsToDistributions(assets, currency)
      setAssetsDistribution(result)
    } catch (err) {
      console.log(err)
    }
  }, [assets, currency])

  React.useEffect(() => {
    calculateAssetsDistribution()
  }, [calculateAssetsDistribution])

  const sections = React.useMemo(() => transformAssetsToSections(assets, t), [assets, t])

  const selectAsset = React.useCallback(
    (asset: Asset) => {
      const options =
        asset.type === AssetTypes.Currents
          ? [t('send'), t('receive'), t('deposit to savings'), t('exchange'), t('cancel')]
          : [t('withdraw to currents'), t('cancel')]
      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
        },
        (index) => {
          if (index === options.length - 1) {
            return
          }
          if (asset.type === AssetTypes.Savings && index === 0) {
            return Actions.push('Swap', { to: asset.coin.denom, type: AssetTypes.Savings })
          }
          if (asset.type === AssetTypes.Currents && index === 0) {
            // Send
          }
          if (asset.type === AssetTypes.Currents && index === 1) {
            // Receive
          }
          if (asset.type === AssetTypes.Currents && index === 2) {
            return Actions.push('Swap', { from: asset.coin.denom, type: AssetTypes.Savings })
          }
          if (asset.type === AssetTypes.Currents && index === 3) {
            return Actions.push('Swap', { from: asset.coin.denom, type: AssetTypes.Currents })
          }
        }
      )
    },
    [t]
  )

  return (
    <View style={styles.parentContainer}>
      {assets.length ? (
        <SectionList
          keyExtractor={(item, i) => item.coin.denom + i}
          contentContainerStyle={styles.container}
          sections={sections}
          ListHeaderComponent={<AssetDonutChart assets={assetsDistribution} />}
          renderSectionHeader={({ section }) => (
            <Typography style={styles.title} type="H3">
              {t(section.title)}
            </Typography>
          )}
          renderItem={({ item }) => <AssetCard asset={item} onPress={() => selectAsset(item)} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Image style={styles.emptyImage} source={require('../../assets/images/empty.png')} />
          <Typography type="H3">{t('no assets')}</Typography>
        </View>
      )}
    </View>
  )
}

export default Home
