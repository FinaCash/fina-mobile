import React from 'react'
import HeaderBar from '../../components/HeaderBar'
import { View, ScrollView } from 'react-native'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Typography from '../../components/Typography'
import Button from '../../components/Button'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { Asset, AssetTypes, AvailableAsset } from '../../types/assets'
import CollateralItem from '../../components/CollateralItem'
import RewardsItem from '../../components/RewardsItem'
import ConfirmClaimRewardsModal from '../../components/ConfirmModals/ConfirmClaimRewardsModal copy'
import { Portal } from '@gorhom/portal'
import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import { Actions } from 'react-native-router-flux'
import { useActionSheet } from '@expo/react-native-action-sheet'
import LoanCard from '../../components/LoanCard'

const Loan: React.FC = () => {
  const { styles } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { assets, availableAssets, borrowInfo, claimBorrowRewards } = useAssetsContext()
  const { showActionSheetWithOptions } = useActionSheet()

  const [isClaiming, setIsClaiming] = React.useState(false)

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
    async (password: string) => {
      try {
        await claimBorrowRewards(MARKET_DENOMS.UUSD, password)
        Actions.Success({
          message: {
            type: 'claim',
            availableAsset: anc,
            rewards: borrowInfo.pendingRewards,
            apr: borrowInfo.rewardsRate,
          },
          onClose: () => Actions.jump('Borrow'),
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
          onClose: () => Actions.jump('Borrow'),
        })
      }
    },
    [claimBorrowRewards, anc, borrowInfo]
  )

  return (
    <>
      <HeaderBar title={t('loan')} subtitle={t('powered by anchor protocol')} />
      <ScrollView style={styles.container}>
        <LoanCard denom={MARKET_DENOMS.UUSD} />
        <View style={styles.row}>
          <Button onPress={() => Actions.Borrow({ mode: 'repay' })} style={styles.button}>
            {t('repay')}
          </Button>
          <Button onPress={() => Actions.Borrow({ mode: 'borrow' })} style={styles.button}>
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
          <ConfirmClaimRewardsModal
            open={isClaiming}
            onClose={() => setIsClaiming(false)}
            onConfirm={() => {
              Actions.Password({ onSubmit: onClaim })
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
