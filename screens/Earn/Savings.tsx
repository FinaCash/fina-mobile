import React from 'react'
import { RefreshControl, SectionList, View } from 'react-native'
import { useAssetsContext } from '../../contexts/AssetsContext'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import EarnIcon from '../../assets/images/icons/earn.svg'
import ReceiveIcon from '../../assets/images/icons/receive.svg'
import Typography from '../../components/Typography'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { getCurrentAssetDetail } from '../../utils/transformAssets'
import AssetItem from '../../components/AssetItem'
import { formatPercentage } from '../../utils/formatNumbers'
import { useSettingsContext } from '../../contexts/SettingsContext'
import Button from '../../components/Button'
import { Actions } from 'react-native-router-flux'
import StatCard from '../../components/StatCard'

const Savings: React.FC = () => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)
  const { assets, fetchAssets } = useAssetsContext()
  const [loading, setLoading] = React.useState(false)

  const ust =
    assets.find((a) => a.coin.denom === 'uusd') ||
    getCurrentAssetDetail({ denom: 'uusd', amount: '0' })
  const aust = assets.find((a) => a.coin.denom === 'ausd')

  const sections = [
    {
      title: t('available'),
      data: [ust],
      renderItem: ({ item }: any) => <AssetItem asset={item} disabled />,
    },
    {
      title: t('deposited'),
      data: [aust],
      renderItem: ({ item }: any) => <AssetItem asset={item} disabled />,
    },
  ]

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
              const timeout = setTimeout(() => setLoading(false), 5000)
              await fetchAssets()
              clearTimeout(timeout)
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
              title={t('ust savings apy')}
              value={formatPercentage(aust?.apr || 0, 2)}
              valueColor={theme.palette.green}
              mb={4}
              disabled
            />
            <View style={styles.buttonsRow}>
              <Button
                disabled={Number(aust?.coin.amount) === 0}
                // icon={<ReceiveIcon fill={theme.palette.white} />}
                style={[styles.stakingButton, { marginRight: 2 * theme.baseSpace }]}
                onPress={() => Actions.Savings({ mode: 'withdraw', denom: 'uusd' })}
              >
                {t('withdraw')}
              </Button>
              <Button
                disabled={Number(ust?.coin.amount) === 0}
                // icon={<EarnIcon fill={theme.palette.white} />}
                style={[styles.stakingButton, { marginLeft: 2 * theme.baseSpace }]}
                onPress={() => Actions.Savings({ mode: 'deposit', denom: 'uusd' })}
              >
                {t('deposit')}
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
    </>
  )
}

export default Savings
