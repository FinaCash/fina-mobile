import React from 'react'
import { FlatList, View } from 'react-native'
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

const AirdropTab: React.FC = () => {
  const { t } = useLocalesContext()
  const { styles } = useStyles(getStyles)
  const { availableAssets, airdrops, claimAirdrops } = useAssetsContext()
  const { type } = useAccountsContext()

  const [claimingAirdrops, setClaimingAirdrops] = React.useState<Airdrop[]>([])

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
      <Portal>
        <ConfirmClaimAirdropModal
          open={!!claimingAirdrops.length}
          onClose={() => setClaimingAirdrops([])}
          airdrops={claimingAirdrops}
          onConfirm={() => {
            getPasswordOrLedgerApp(onClaim, type)
            setClaimingAirdrops([])
          }}
        />
      </Portal>
    </>
  )
}

export default AirdropTab
