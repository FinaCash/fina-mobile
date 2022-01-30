import React from 'react'
import { FlatList, RefreshControl, ScrollView, View } from 'react-native'
import get from 'lodash/get'
import { useAssetsContext } from '../../contexts/AssetsContext'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'
import keyBy from 'lodash/keyBy'
import FarmItem from '../../components/FarmItem'
import { FarmType } from '../../types/assets'
import Button from '../../components/Button'
import StatCard from '../../components/StatCard'
import { formatCurrency } from '../../utils/formatNumbers'
import { useSettingsContext } from '../../contexts/SettingsContext'

const FarmTab: React.FC = () => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)
  const { farmInfo, availableAssets, fetchFarmInfo } = useAssetsContext()
  const { currency, currencyRate } = useSettingsContext()
  const availableAssetsMap = React.useMemo(
    () => keyBy(availableAssets, 'symbol'),
    [availableAssets]
  )
  const [loading, setLoading] = React.useState(false)
  const [farmType, setFarmType] = React.useState(FarmType.Long)

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

  return (
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
      data={farmInfo.filter((f) => f.type === farmType)}
      ListHeaderComponent={
        <>
          <View style={styles.buttonsRow}>
            <StatCard
              title={t('total farm assets')}
              value={formatCurrency(totalFarmValue * currencyRate, currency, true)}
              mr={2}
            />
            <StatCard
              title={t('pending rewards')}
              value={formatCurrency(totalRewards * currencyRate, currency, true)}
              ml={2}
            />
          </View>
          <View style={styles.farmTabs}>
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
          </View>
        </>
      }
      renderItem={({ item }) => (
        <FarmItem
          asset={availableAssetsMap[item.symbol]}
          apr={item.apr}
          farmType={farmType}
          onPress={() => {}}
        />
      )}
    />
  )
}

export default FarmTab
