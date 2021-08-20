import React from 'react'
import { FlatList } from 'react-native'
import { Actions } from 'react-native-router-flux'
import HeaderBar from '../../components/HeaderBar'
import AvailableAssetItem from '../../components/AvailableAssetItem'
import { useAssetsContext } from '../../contexts/AssetsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'

const Invest: React.FC = () => {
  const { t } = useTranslation()
  const { styles } = useStyles(getStyles)
  const { availableAssets } = useAssetsContext()

  return (
    <>
      <HeaderBar title={t('invest')} />
      <FlatList
        style={styles.list}
        keyExtractor={(item) => item.symbol}
        data={availableAssets}
        renderItem={({ item }) => (
          <AvailableAssetItem
            availableAsset={item}
            onPress={() => Actions.MirrorSwap({ mode: 'buy', asset: item })}
          />
        )}
      />
    </>
  )
}

export default Invest
