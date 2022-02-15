import React from 'react'
import { FlatList, RefreshControl, ScrollView, View } from 'react-native'
import get from 'lodash/get'
import { useAssetsContext } from '../../contexts/AssetsContext'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'
import keyBy from 'lodash/keyBy'
import SearchIcon from '../../assets/images/icons/search.svg'
import FarmItem from '../../components/FarmItem'
import { FarmType } from '../../types/assets'
import StatCard from '../../components/StatCard'
import { formatCurrency } from '../../utils/formatNumbers'
import { useSettingsContext } from '../../contexts/SettingsContext'
import Typography from '../../components/Typography'
import MyFarmItem from '../../components/MyFarmItem'
import { Actions } from 'react-native-router-flux'
import Input from '../../components/Input'
import ConfirmClaimFarmRewardsModal from '../../components/ConfirmModals/ConfirmClaimFarmRewardsModal'
import { getPasswordOrLedgerApp } from '../../utils/signAndBroadcastTx'
import TerraApp from '@terra-money/ledger-terra-js'
import { useAccountsContext } from '../../contexts/AccountsContext'

const FarmTab: React.FC = () => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)
  const { farmInfo, availableAssets, fetchFarmInfo, claimFarmRewards } = useAssetsContext()
  const { currency, currencyRate } = useSettingsContext()
  const { type } = useAccountsContext()
  const availableAssetsMap = React.useMemo(
    () => ({ ...keyBy(availableAssets, 'symbol'), UST: { price: 1 } }),
    [availableAssets]
  )
  const [loading, setLoading] = React.useState(false)
  const [farmType, setFarmType] = React.useState(FarmType.Long)
  const [search, setSearch] = React.useState('')
  const [isClaiming, setIsClaiming] = React.useState(false)

  const totalFarmValue = React.useMemo(
    () =>
      farmInfo
        .filter((farm) => farm.type !== FarmType.Short)
        .map(
          (farm) =>
            farm.balance * farm.rate.token * get(availableAssetsMap, [farm.symbol, 'price'], 0) +
            farm.balance * farm.rate.ust
        )
        .reduce((a, b) => a + b, 0),
    [farmInfo, availableAssetsMap]
  )

  const totalRewards = React.useMemo(
    () =>
      farmInfo
        .map((farm) =>
          farm.rewards
            .map((r) => r.amount * get(availableAssetsMap, [r.denom, 'price'], 0))
            .reduce((a, b) => a + b, 0)
        )
        .reduce((a, b) => a + b, 0),
    [farmInfo, availableAssetsMap]
  )

  const totalRewardTokens = React.useMemo(() => {
    const tokens: { [denom: string]: number } = {}
    farmInfo.forEach((farm) =>
      farm.rewards.forEach((r) => {
        if (tokens[r.denom]) {
          tokens[r.denom] += r.amount
        } else {
          tokens[r.denom] = r.amount
        }
      })
    )
    return Object.keys(tokens).map((denom) => ({ denom, amount: tokens[denom] }))
  }, [farmInfo])

  const myFarms = farmInfo.filter((f) => f.type === farmType && f.balance > 0)

  const onClaim = React.useCallback(
    async (password?: string, terraApp?: TerraApp) => {
      const message = {
        type: 'claim farm rewards',
        farms: farmInfo,
      }
      try {
        await claimFarmRewards(farmInfo, password, terraApp)
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
    [claimFarmRewards, farmInfo]
  )

  return (
    <>
      <View style={styles.searchBarContainer}>
        <Input
          placeholder={t('search')}
          icon={<SearchIcon />}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        style={styles.list}
        refreshControl={
          <RefreshControl
            tintColor={theme.fonts.H1.color}
            refreshing={loading}
            onRefresh={async () => {
              setLoading(true)
              await fetchFarmInfo()
              setLoading(false)
            }}
          />
        }
        keyExtractor={(item) => item.symbol}
        data={farmInfo.filter(
          (f) => f.type === farmType && f.symbol.toLowerCase().includes(search.toLowerCase())
        )}
        ListHeaderComponent={
          <>
            <View style={styles.buttonsRow}>
              <StatCard
                title={t('total farm assets')}
                value={formatCurrency(totalFarmValue * currencyRate, currency, true)}
                mr={2}
                disabled
              />
              <StatCard
                title={t('pending rewards')}
                value={formatCurrency(totalRewards * currencyRate, currency, true)}
                ml={2}
                onPress={() => setIsClaiming(true)}
              >
                <Typography type="Small" color={theme.palette.grey[7]}>
                  {totalRewardTokens
                    .map((token) => formatCurrency(token.amount, token.denom) + ' ' + token.denom)
                    .join('\n')}
                </Typography>
              </StatCard>
            </View>
            {/* <View style={styles.farmTabs}>
            {Object.values(FarmType).map((f) => (
              <Button
                key={f}
                borderRadius={2}
                style={styles.tabButton}
                bgColor={farmType !== f ? theme.palette.grey[4] : undefined}
                onPress={() => setFarmType(f)}
              >
                {t(f)}
              </Button>
            ))}
          </View> */}
            {myFarms.length ? (
              <>
                <Typography
                  style={{
                    marginHorizontal: 6 * theme.baseSpace,
                    // marginTop: 6 * theme.baseSpace
                  }}
                  type="H6"
                >
                  {t('my farm', { farm: t(farmType) })}
                </Typography>
                {myFarms
                  .filter((f) => f.symbol.toLowerCase().includes(search.toLowerCase()))
                  .map((f) => (
                    <MyFarmItem
                      key={f.symbol}
                      onPress={() => Actions.WithdrawLiquidity({ farm: f })}
                      farm={f}
                      availableAssetsMap={availableAssetsMap as any}
                    />
                  ))}
              </>
            ) : null}
            <Typography
              style={{ marginHorizontal: 6 * theme.baseSpace, marginTop: 6 * theme.baseSpace }}
              type="H6"
            >
              {t(farmType)}
            </Typography>
            <View style={styles.sectionHeader}>
              <Typography color={theme.palette.grey[7]}>{t('tokens')}</Typography>
              <Typography color={theme.palette.grey[7]}>{t('apr')}</Typography>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <FarmItem
            asset={(availableAssetsMap as any)[item.symbol]}
            apr={item.apr}
            farmType={farmType}
            dex={item.dex}
            onPress={() => Actions.ProvideLiquidity({ farm: item })}
          />
        )}
      />
      <ConfirmClaimFarmRewardsModal
        open={isClaiming}
        onClose={() => setIsClaiming(false)}
        farms={farmInfo}
        onConfirm={() => {
          getPasswordOrLedgerApp(onClaim, type)
          setIsClaiming(false)
        }}
      />
    </>
  )
}

export default FarmTab
