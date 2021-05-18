import React from 'react'
import { SectionList, View } from 'react-native'
import AssetCard from '../../components/AssetCard'
import AssetDonutChart from '../../components/AssetsDonutChart'
import Typography from '../../components/Typography'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import useStyles from '../../theme/useStyles'
import {
  transformAssetsToDistributions,
  transformAssetsToSections,
} from '../../utils/transformAssets'
import getStyles from './styles'

const Home: React.FC = () => {
  const { styles } = useStyles(getStyles)
  const { assets } = useAssetsContext()
  const { currency } = useSettingsContext()
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

  const sections = React.useMemo(() => transformAssetsToSections(assets), [assets])

  return (
    <View style={styles.parentContainer}>
      <SectionList
        keyExtractor={(item, i) => item.title + i}
        contentContainerStyle={styles.container}
        sections={sections}
        ListHeaderComponent={<AssetDonutChart assets={assetsDistribution} />}
        renderSectionHeader={({ section }) => (
          <Typography style={styles.title} type="H3">
            {section.title}
          </Typography>
        )}
        renderItem={({ item }) => <AssetCard {...item} />}
      />
    </View>
  )
}

export default Home
