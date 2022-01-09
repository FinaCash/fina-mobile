import React from 'react'
import HeaderBar from '../../components/HeaderBar'
import { View, ScrollView, Alert, RefreshControl } from 'react-native'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Typography from '../../components/Typography'
import Button from '../../components/Button'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { Asset, AssetTypes, AvailableAsset } from '../../types/assets'
import CollateralItem from '../../components/CollateralItem'
import RewardsItem from '../../components/RewardsItem'
import ConfirmClaimBorrowRewardsModal from '../../components/ConfirmModals/ConfirmClaimBorrowRewardsModal'
import { Portal } from '@gorhom/portal'
import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import { Actions } from 'react-native-router-flux'
import { useActionSheet } from '@expo/react-native-action-sheet'
import LoanCard from '../../components/LoanCard'
import TransferIcon from '../../assets/images/icons/transfer.svg'
import ReceiveIcon from '../../assets/images/icons/receive.svg'
import { getPasswordOrLedgerApp } from '../../utils/signAndBroadcastTx'
import { useAccountsContext } from '../../contexts/AccountsContext'
import TerraApp from '@terra-money/ledger-terra-js'

const Loan: React.FC = () => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { type } = useAccountsContext()
  const {
    assets,
    availableAssets,
    borrowInfo,
    claimBorrowRewards,
    fetchBorrowInfo,
    fetchAssets,
    fetchAvailableAssets,
  } = useAssetsContext()
  const { showActionSheetWithOptions } = useActionSheet()

  const [isClaiming, setIsClaiming] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const collaterals = assets.filter((a) => a.type === AssetTypes.Collaterals)

  const anc = availableAssets.find((a) => a.symbol === 'ANC')

  const onCollateralPress = React.useCallback(
    (asset: Asset, availableAsset: AvailableAsset) => {
      showActionSheetWithOptions(
        {
          options: [t('buy'), t('sell'), t('provide'), t('withdraw'), t('cancel')],
          cancelButtonIndex: 4,
        },
        (i) => {
          if (i === 0 || i === 1) {
            Actions.Swap({
              mode: i === 0 ? 'buy' : 'sell',
              asset,
            })
          } else if (i === 2 || i === 3) {
            Actions.ProvideCollateral({
              asset,
              availableAsset,
              mode: i === 2 ? 'provide' : 'withdraw',
            })
          }
        }
      )
    },
    [showActionSheetWithOptions, t]
  )

  const onClaim = React.useCallback(
    async (password?: string, terraApp?: TerraApp) => {
      try {
        await claimBorrowRewards(MARKET_DENOMS.UUSD, password, terraApp)
        Actions.Success({
          message: {
            type: 'claim',
            availableAsset: anc,
            rewards: borrowInfo.pendingRewards,
            apr: borrowInfo.rewardsRate,
          },
          onClose: () => Actions.jump('Loan'),
        })
      } catch (err: any) {
        Actions.Success({
          message: {
            type: 'claim',
            availableAsset: anc,
            rewards: borrowInfo.pendingRewards,
            apr: borrowInfo.rewardsRate,
          },
          error: err.message,
          onClose: () => Actions.jump('Loan'),
        })
      }
    },
    [claimBorrowRewards, anc, borrowInfo]
  )

  return (
    <>
      <HeaderBar title={t('loan')} subtitle={t('powered by anchor protocol')} />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            style={{ zIndex: 100 }}
            tintColor={theme.palette.white}
            refreshing={loading}
            onRefresh={async () => {
              setLoading(true)
              await Promise.all([fetchBorrowInfo(), fetchAssets(), fetchAvailableAssets()])
              setLoading(false)
            }}
          />
        }
      >
        <LoanCard denom={MARKET_DENOMS.UUSD} />
        <View style={styles.row}>
          <Button
            icon={<TransferIcon fill={theme.palette.white} />}
            onPress={() => {
              if (!borrowInfo.borrowedValue) {
                return Alert.alert(t('no borrow value'), t('you have not borrowed anything yet'))
              }
              Actions.Borrow({ mode: 'repay' })
            }}
            style={styles.button}
          >
            {t('repay')}
          </Button>
          <Button
            icon={<ReceiveIcon fill={theme.palette.white} />}
            onPress={() => {
              if (borrowInfo.borrowedValue >= 0.5 * borrowInfo.collateralValue) {
                return Alert.alert(
                  t('insufficient collateral'),
                  t('please provide more collateral')
                )
              }
              Actions.Borrow({ mode: 'borrow' })
            }}
            style={styles.button}
          >
            {t('borrow')}
          </Button>
        </View>
        <Typography style={styles.title} type="H5">
          {t('collaterals')}
        </Typography>
        {collaterals.map((c) => {
          const availableAsset = availableAssets.find((a) => a.symbol === c.symbol)
          if (!availableAsset) {
            return null
          }
          return (
            <CollateralItem
              key={c.symbol}
              asset={c}
              availableAsset={availableAsset}
              onPress={() => onCollateralPress(c, availableAsset)}
            />
          )
        })}
        <Typography style={styles.title} type="H5">
          {t('rewards')}
        </Typography>
        {anc ? (
          <RewardsItem
            availableAsset={anc}
            rewards={borrowInfo.pendingRewards}
            apr={borrowInfo.rewardsRate}
            onPress={() => setIsClaiming(true)}
          />
        ) : null}
      </ScrollView>
      {anc ? (
        <Portal>
          <ConfirmClaimBorrowRewardsModal
            open={isClaiming}
            onClose={() => setIsClaiming(false)}
            onConfirm={() => {
              getPasswordOrLedgerApp(onClaim, type)
              setIsClaiming(false)
            }}
            availableAsset={anc}
            rewards={borrowInfo.pendingRewards}
            apr={borrowInfo.rewardsRate}
            denom={MARKET_DENOMS.UUSD}
          />
        </Portal>
      ) : null}
    </>
  )
}

export default Loan
