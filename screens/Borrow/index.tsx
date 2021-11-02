import React from 'react'
import HeaderBar from '../../components/HeaderBar'
import { TouchableOpacity, View, ScrollView, Alert } from 'react-native'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Typography from '../../components/Typography'
import Button from '../../components/Button'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { Asset, AssetTypes, AvailableAsset } from '../../types/assets'
import CollateralItem from '../../components/CollateralItem'
import RewardsItem from '../../components/RewardsItem'
import ConfirmClaimRewardsModal from '../../components/ConfirmModals/ConfirmClaimRewardsModal copy'
import { Portal } from '@gorhom/portal'
import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import { Actions } from 'react-native-router-flux'
import { useActionSheet } from '@expo/react-native-action-sheet'

const baseCurrency = 'uusd'

const Borrow: React.FC = () => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { assets, availableAssets, borrowInfo, claimBorrowRewards } = useAssetsContext()
  const { showActionSheetWithOptions } = useActionSheet()

  const [isClaiming, setIsClaiming] = React.useState(false)

  const collaterals = assets.filter((a) => a.type === AssetTypes.Collaterals)
  const anc = availableAssets.find((a) => a.symbol === 'ANC')

  const netApr = borrowInfo.rewardsRate - borrowInfo.borrowRate
  const ltv = borrowInfo.borrowedValue / borrowInfo.collateralValue

  const innerBarStyle = {
    backgroundColor: theme.palette.green,
    width: formatPercentage(ltv / 0.6, 2),
  }

  const onCollateralPress = React.useCallback(
    (asset: Asset, availableAsset: AvailableAsset) => {
      showActionSheetWithOptions(
        {
          options: [t('buy'), t('sell'), t('provide'), t('withdraw'), t('cancel')],
          cancelButtonIndex: 4,
        },
        (i) => {
          if (i === 2 || i === 3) {
            Actions.ProvideCollateral({
              asset,
              availableAsset,
              mode: i === 2 ? 'provide' : 'withdraw',
            })
          }
        }
      )
    },
    [showActionSheetWithOptions]
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
      <HeaderBar title={t('borrow')} subtitle={t('powered by anchor protocol')} />
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.statRow}>
            <View>
              <Typography type="Mini">{t('collateral value')}</Typography>
              <Typography type="Large" bold>
                {formatCurrency(borrowInfo.collateralValue * 10 ** 6, 'uusd', true)}
              </Typography>
            </View>
            <View>
              <Typography type="Mini">{t('borrowed value')}</Typography>
              <Typography type="Large" bold>
                {formatCurrency(borrowInfo.borrowedValue * 10 ** 6, 'uusd', true)}
              </Typography>
            </View>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  t('net APR'),
                  t('borrow APR calculation', {
                    rewardsRate: formatPercentage(borrowInfo.rewardsRate, 2),
                    borrowRate: formatPercentage(borrowInfo.borrowRate, 2),
                    netApr: formatPercentage(netApr, 2),
                  })
                )
              }}
            >
              <Typography type="Mini">{t('net APR')} ⓘ</Typography>
              <Typography
                color={netApr > 0 ? theme.palette.green : theme.palette.red}
                type="Large"
                bold
              >
                {formatPercentage(netApr, 2)}
              </Typography>
            </TouchableOpacity>
          </View>
          <View style={styles.flexEndRow}>
            <View style={styles.recommendedLtv}>
              <Typography type="Small">{t('recommended ltv')}</Typography>
              <View style={styles.vertDivider} />
            </View>
            <View>
              <Typography type="Small">{t('max ltv')}</Typography>
              <View style={styles.vertDivider} />
            </View>
            <View style={[styles.myLtv, { right: formatPercentage(1 - ltv / 0.6, 2) }]}>
              <Typography
                style={ltv < 0.06 ? { marginRight: theme.baseSpace * -8 } : {}}
                type="Small"
                bold
              >
                {formatPercentage(ltv, 2)}
              </Typography>
              <View style={styles.shortVertDivider} />
            </View>
          </View>
          <View style={styles.outerBar}>
            <View style={[styles.innerBar, innerBarStyle]} />
          </View>
          <View style={styles.spacedRow}>
            <Typography type="Small">{t('LTV')}</Typography>
            <Typography type="Small">
              {t('borrow limit', {
                amount: formatCurrency(borrowInfo.borrowLimit * 10 ** 6, baseCurrency, true),
              })}
            </Typography>
          </View>
        </View>
        <View style={styles.row}>
          <Button onPress={() => null} style={styles.button}>
            {t('repay')}
          </Button>
          <Button onPress={() => null} style={styles.button}>
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

export default Borrow
