import React from 'react'
import { FlatList, RefreshControl, View } from 'react-native'
import { useAssetsContext } from '../../contexts/AssetsContext'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { getTokenAssetDetail } from '../../utils/transformAssets'
import AssetItem from '../../components/AssetItem'
import { Airdrop, Asset } from '../../types/assets'
import { Portal } from '@gorhom/portal'
import ConfirmClaimAirdropModal from '../../components/ConfirmModals/ConfirmClaimAirdropModal'
import { Actions } from 'react-native-router-flux'
import { getPasswordOrLedgerApp } from '../../utils/signAndBroadcastTx'
import { useAccountsContext } from '../../contexts/AccountsContext'
import TerraApp from '@terra-money/ledger-terra-js'
import Button from '../../components/Button'

const FarmTab: React.FC = () => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)
  const { availableAssets, airdrops, claimAirdrops, fetchAirdrops } = useAssetsContext()
  const { type } = useAccountsContext()

  const [claimingAirdrops, setClaimingAirdrops] = React.useState<Airdrop[]>([])
  const [loading, setLoading] = React.useState(false)

  const data = React.useMemo(
    () =>
      airdrops.map((a) => getTokenAssetDetail(a.coin, availableAssets)).filter((a) => a) as Asset[],
    [availableAssets, airdrops]
  )

  return (
    <>
      <FlatList
        style={styles.list}
        refreshControl={
          <RefreshControl
            tintColor={theme.fonts.H1.color}
            refreshing={loading}
            onRefresh={async () => {
              setLoading(true)
              await fetchAirdrops()
              setLoading(false)
            }}
          />
        }
        keyExtractor={(item) => item.symbol}
        data={data}
        renderItem={({ item }) => (
          <AssetItem
            asset={item}
            onPress={() =>
              setClaimingAirdrops([airdrops.find((a) => a.coin.denom === item.coin.denom)!])
            }
          />
        )}
      />
    </>
  )
}

export default FarmTab
