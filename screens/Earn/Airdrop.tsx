import React from 'react'
import { FlatList, RefreshControl, View } from 'react-native'
import { useAssetsContext } from '../../contexts/AssetsContext'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { getTokenAssetDetail } from '../../utils/transformAssets'
import AssetItem from '../../components/AssetItem'
import { Airdrop, Asset } from '../../types/assets'
import ConfirmClaimAirdropModal from '../../components/ConfirmModals/ConfirmClaimAirdropModal'
import { Actions } from 'react-native-router-flux'
import { getPasswordOrLedgerApp } from '../../utils/signAndBroadcastTx'
import { useAccountsContext } from '../../contexts/AccountsContext'
import TerraApp from '@terra-money/ledger-terra-js'
import Button from '../../components/Button'

const AirdropTab: React.FC = () => {
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

  const onClaim = React.useCallback(
    async (password?: string, terraApp?: TerraApp) => {
      const message = {
        type: 'claim airdrops',
        airdrops: claimingAirdrops,
      }
      try {
        await claimAirdrops(claimingAirdrops, password, terraApp)
        Actions.Success({
          message,
          onClose: () => Actions.jump('Earn'),
        })
      } catch (err: any) {
        Actions.Success({
          message,
          error: err.message,
          onClose: () => Actions.jump('Earn'),
        })
      }
    },
    [claimAirdrops, claimingAirdrops]
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
        ListFooterComponent={
          <View style={styles.margin}>
            <Button size="Large" onPress={() => setClaimingAirdrops(airdrops)}>
              {t('claim all')}
            </Button>
          </View>
        }
      />
      <ConfirmClaimAirdropModal
        open={!!claimingAirdrops.length}
        onClose={() => setClaimingAirdrops([])}
        airdrops={claimingAirdrops}
        onConfirm={() => {
          getPasswordOrLedgerApp(onClaim, type)
          setClaimingAirdrops([])
        }}
      />
    </>
  )
}

export default AirdropTab
