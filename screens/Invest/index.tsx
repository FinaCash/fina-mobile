import React from 'react'
import { FlatList } from 'react-native'
import MirrorAssetItem from '../../components/MirrorAssetItem'
import Typography from '../../components/Typography'
import { useAssetsContext } from '../../contexts/AssetsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import { terraLCDClient } from '../../utils/terraConfig'
import useMirrorAssets from '../../utils/useMirrorAssets'
import getStyles from './styles'

const Invest: React.FC = () => {
  const { t } = useTranslation()
  const { styles } = useStyles(getStyles)
  const now = React.useMemo(() => Date.now(), [])
  const mirrorAssets = useMirrorAssets({ from: now - 24 * 3600 * 1000, to: now, interval: 60 })

  return (
    <FlatList
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <Typography style={styles.title} type="H3">
          {t('invest')}
        </Typography>
      }
      data={mirrorAssets}
      renderItem={({ item }) => <MirrorAssetItem mAsset={item} onPress={() => null} />}
    />
  )
}

export default Invest
