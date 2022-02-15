import React from 'react'
import { RefreshControl, SectionList, View } from 'react-native'
import { useAssetsContext } from '../../contexts/AssetsContext'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import keyBy from 'lodash/keyBy'
import EarnIcon from '../../assets/images/icons/earn.svg'
import ReceiveIcon from '../../assets/images/icons/receive.svg'
import Typography from '../../components/Typography'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { getCurrentAssetDetail, getTokenAssetDetail } from '../../utils/transformAssets'
import AssetItem from '../../components/AssetItem'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import { useSettingsContext } from '../../contexts/SettingsContext'
import StakingItem from '../../components/StakingItem'
import Button from '../../components/Button'
import ConfirmClaimStakingRewardsModal from '../../components/ConfirmModals/ConfirmClaimStakingRewardsModal'
import { getPasswordOrLedgerApp } from '../../utils/signAndBroadcastTx'
import { useAccountsContext } from '../../contexts/AccountsContext'
import TerraApp from '@terra-money/ledger-terra-js'
import { Actions } from 'react-native-router-flux'
import StatCard from '../../components/StatCard'

const Stake: React.FC = () => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)
  const { type } = useAccountsContext()
  const {
    assets,
    availableAssets,
    availableCurrencies,
    stakingInfo,
    claimStakingRewards,
    fetchStakingInfo,
    fetchAssets,
    fetchAvailableAssets,
  } = useAssetsContext()
  const [loading, setLoading] = React.useState(false)
  const { showActionSheetWithOptions } = useActionSheet()
  const availableCurrenciesMap = React.useMemo(
    () =>
      keyBy(
        availableCurrencies.filter((c) => !c.hidden),
        'denom'
      ),
    [availableCurrencies]
  )
  const { currency, currencyRate } = useSettingsContext()
  const lunaAvailableAsset = availableAssets.find((a) => a.coin.denom === 'uluna')
  let luna = assets.filter((a) => a.coin.denom === 'uluna')
  if (luna.length === 0 && lunaAvailableAsset) {
    luna = [getTokenAssetDetail({ denom: 'uluna', amount: '0' }, availableAssets)!]
  }

  const totalDelegated = stakingInfo.delegated.map((d) => d.amount).reduce((a, b) => a + b, 0)

  const sections = [
    {
      title: t('available'),
      data: luna,
      renderItem: ({ item }: any) => <AssetItem asset={item} disabled />,
    },
    {
      title: t('delegated'),
      data: stakingInfo.delegated,
      renderItem: ({ item }: any) => (
        <StakingItem
          validator={item.validator}
          amount={item.amount}
          symbol={luna[0].symbol}
          price={luna[0].price}
          onPress={() => {
            showActionSheetWithOptions(
              {
                options: [t('undelegate'), t('redelegate'), t('cancel')],
                cancelButtonIndex: 2,
              },
              (i) => {
                if (i === 0) {
                  Actions.Undelegate(item)
                } else if (i === 1) {
                  Actions.Redelegate(item)
                }
              }
            )
          }}
        />
      ),
    },
    {
      title: t('redelegating'),
      data: stakingInfo.redelegating,
      renderItem: ({ item }: any) => (
        <StakingItem
          validator={item.fromValidator}
          toValidator={item.toValidator}
          amount={item.amount}
          completion={item.completion}
          symbol={luna[0].symbol}
          price={luna[0].price}
        />
      ),
    },
    {
      title: t('unbonding'),
      data: stakingInfo.unbonding,
      renderItem: ({ item }: any) => (
        <StakingItem
          validator={item.validator}
          amount={item.amount}
          completion={item.completion}
          symbol={luna[0].symbol}
          price={luna[0].price}
        />
      ),
    },
    {
      title: t('rewards'),
      data: stakingInfo.rewards,
      renderItem: ({ item }: any) =>
        item.denom === 'uluna' || availableCurrenciesMap[item.denom] ? (
          <AssetItem
            disabled
            asset={
              item.denom === 'uluna'
                ? { ...luna[0], coin: item }
                : getCurrentAssetDetail(item, availableCurrenciesMap[item.denom].price)
            }
          />
        ) : null,
    },
  ].filter((s) => s.data.length)

  const [claimingRewards, setClaimingRewards] = React.useState(false)

  const onClaim = React.useCallback(
    async (password?: string, terraApp?: TerraApp) => {
      const lunaRewards = stakingInfo.rewards.find((r) => r.denom === 'uluna')
      const message = {
        type: 'claim',
        availableAsset: lunaAvailableAsset,
        rewards: lunaRewards ? lunaRewards.amount : 0,
        apr: stakingInfo.stakingApr,
        more: stakingInfo.rewards.length - 1,
        rewardsValue: stakingInfo.totalRewards,
      }
      try {
        await claimStakingRewards(password, terraApp)
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
    [claimStakingRewards, lunaAvailableAsset, stakingInfo]
  )

  return (
    <>
      <SectionList
        style={styles.list}
        refreshControl={
          <RefreshControl
            tintColor={theme.fonts.H1.color}
            refreshing={loading}
            onRefresh={async () => {
              setLoading(true)
              await Promise.all([fetchAssets(), fetchStakingInfo(), fetchAvailableAssets()])
              setLoading(false)
            }}
          />
        }
        keyExtractor={(item, index) => String(index)}
        sections={sections as any}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <>
            <StatCard
              title={luna[0].symbol + ' ' + t('staking apr')}
              value={formatPercentage(stakingInfo.stakingApr, 2)}
              valueColor={theme.palette.green}
              mb={0}
              disabled
            />
            <View style={styles.buttonsRow}>
              <StatCard
                title={t('total delegated')}
                value={formatCurrency(totalDelegated, luna[0].symbol)}
                mr={2}
                disabled
              >
                <Typography type="Small" color={theme.palette.grey[7]}>
                  {formatCurrency(totalDelegated * luna[0].price * currencyRate, currency, true)}
                </Typography>
              </StatCard>
              <StatCard
                title={t('pending rewards')}
                value={formatCurrency(stakingInfo.totalRewards * currencyRate, currency, true)}
                ml={2}
                disabled
              >
                <Typography type="Small" color={theme.palette.grey[7]}>
                  {stakingInfo.rewards.length + ' ' + t('tokens')}
                </Typography>
              </StatCard>
            </View>
            <View style={styles.buttonsRow}>
              <Button
                disabled={Number(luna[0].coin.amount) === 0}
                icon={<EarnIcon fill={theme.palette.white} />}
                style={[styles.stakingButton, { marginRight: 2 * theme.baseSpace }]}
                onPress={() => Actions.Delegate()}
              >
                {t('delegate')}
              </Button>
              <Button
                icon={<ReceiveIcon fill={theme.palette.white} />}
                style={[styles.stakingButton, { marginLeft: 2 * theme.baseSpace }]}
                onPress={() => setClaimingRewards(true)}
              >
                {t('claim')}
              </Button>
            </View>
          </>
        }
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.titleContainer}>
            <Typography type="Large" bold>
              {title}
            </Typography>
          </View>
        )}
      />
      {lunaAvailableAsset ? (
        <ConfirmClaimStakingRewardsModal
          open={claimingRewards}
          onClose={() => setClaimingRewards(false)}
          availableAsset={lunaAvailableAsset}
          totalRewards={stakingInfo.totalRewards}
          rewards={stakingInfo.rewards}
          apr={stakingInfo.stakingApr}
          onConfirm={() => {
            getPasswordOrLedgerApp(onClaim, type)
            setClaimingRewards(false)
          }}
        />
      ) : null}
    </>
  )
}

export default Stake
