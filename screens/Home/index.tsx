import React from 'react'
import { Animated, ScrollView, View } from 'react-native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { Modalize } from 'react-native-modalize'
import get from 'lodash/get'
import SearchIcon from '../../assets/images/icons/search.svg'
import TransferIcon from '../../assets/images/icons/transfer.svg'
import ReceiveIcon from '../../assets/images/icons/receive.svg'
import AssetItem from '../../components/AssetItem'
import { LinearGradient } from 'expo-linear-gradient'
import Typography from '../../components/Typography'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import { getCurrencyFromDenom, transformAssetsToDistributions } from '../../utils/transformAssets'
import getStyles from './styles'
import { Asset, AssetTypes } from '../../types/assets'
import { Actions } from 'react-native-router-flux'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import Button from '../../components/Button'
import Input from '../../components/Input'

const Home: React.FC = () => {
  const scrollY = React.useRef(new Animated.Value(0)).current
  const modalizeRef = React.useRef<Modalize>(null)
  const { styles, theme } = useStyles(getStyles)
  const { assets } = useAssetsContext()
  const { currency } = useSettingsContext()
  const { t } = useTranslation()
  const { showActionSheetWithOptions } = useActionSheet()
  const assetsDistribution = transformAssetsToDistributions(assets)
  assetsDistribution.overview = Object.values(assetsDistribution).reduce((a, b) => a + b, 0)
  const averageSavingsAPY =
    assets
      .filter((a) => a.type === AssetTypes.Savings)
      .map((a) => get(a, 'worth.amount', 0) * (a.apy || 0))
      .reduce((a, b) => a + b, 0) / assetsDistribution[AssetTypes.Savings]

  const [search, setSearch] = React.useState('')
  const [filterAsset, setFilterAsset] = React.useState<AssetTypes | 'overview'>('overview')

  const selectAsset = React.useCallback(
    (asset: Asset) => {
      const options =
        asset.type === AssetTypes.Currents
          ? [t('transfer'), t('receive'), t('swap'), t('cancel')]
          : [t('deposit'), t('withdraw'), t('cancel')]
      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
        },
        (index) => {
          if (index === options.length - 1) {
            return
          }
          if (asset.type === AssetTypes.Currents && index === 0) {
            // Send
          }
          if (asset.type === AssetTypes.Currents && index === 1) {
            // Receive
          }
          if (asset.type === AssetTypes.Currents && index === 2) {
            return Actions.Swap({ from: asset.coin.denom })
          }
          if (asset.type === AssetTypes.Savings && index === 0) {
            return Actions.Savings({ from: asset.coin.denom, mode: 'deposit' })
          }
          if (asset.type === AssetTypes.Savings && index === 1) {
            return Actions.Savings({ from: asset.coin.denom, mode: 'withdraw' })
          }
        }
      )
    },
    [t, showActionSheetWithOptions]
  )

  return (
    <LinearGradient
      start={[0, 0]}
      end={[1, 1]}
      colors={theme.gradients.primary}
      style={styles.parentContainer}
    >
      <View style={styles.header}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterContainer}
        >
          {['overview', ...Object.values(AssetTypes)].map((v) => (
            <Button
              key={v}
              borderRadius={2}
              style={styles.filterButton}
              bgColor={filterAsset === v ? theme.palette.grey[1] : 'transparent'}
              color={filterAsset === v ? theme.palette.primary : theme.palette.white}
              onPress={() => setFilterAsset(v as any)}
            >
              {t(v)}
            </Button>
          ))}
        </ScrollView>
        <Typography color={theme.palette.white}>
          {t(filterAsset === 'overview' ? 'total balance' : 'equity value', {
            currency: getCurrencyFromDenom(currency),
          })}
        </Typography>
        <View style={styles.row}>
          <Typography color={theme.palette.white} type="H2">
            {formatCurrency(assetsDistribution[filterAsset], currency)}
          </Typography>
          {filterAsset === AssetTypes.Savings ? (
            <Button
              style={styles.avgApy}
              bgColor={theme.palette.green}
              size="Small"
              borderRadius={2}
            >
              {`${t('apy')} ${formatPercentage(averageSavingsAPY, 2)}`}
            </Button>
          ) : null}
        </View>
        <View style={styles.buttonRow}>
          <Button
            onPress={() =>
              Actions.SelectAsset({
                onSelect: (asset: Asset) =>
                  Actions.SelectAmount({
                    asset,
                    onSubmit: (amount: number) =>
                      Actions.SelectRecipient({
                        asset,
                        amount,
                        onSubmit: (recipient: string) => null,
                      }),
                  }),
                assets,
              })
            }
            borderRadius={2}
            style={styles.button}
            size="Large"
            icon={<TransferIcon />}
          >
            {t('transfer')}
          </Button>
          <Button borderRadius={2} style={styles.button} size="Large" icon={<ReceiveIcon />}>
            {t('receive')}
          </Button>
        </View>
      </View>
      <Modalize
        ref={modalizeRef}
        alwaysOpen={
          theme.screenHeight -
          68 * theme.baseSpace -
          theme.bottomSpace -
          theme.tabBarHeight -
          theme.statusBarHeight
        }
        modalStyle={styles.modal}
        withHandle={false}
        panGestureAnimatedValue={scrollY}
        useNativeDriver={false}
        HeaderComponent={
          <View>
            <View style={styles.swipeIndicator} />
            <Animated.View
              style={[
                styles.searchBarContainer,
                {
                  opacity: scrollY,
                  height: Animated.multiply(scrollY, 8 * theme.baseSpace),
                },
              ]}
            >
              <Input
                placeholder={t('search')}
                icon={<SearchIcon />}
                value={search}
                onChangeText={setSearch}
              />
            </Animated.View>
          </View>
        }
        flatListProps={{
          data: assets.filter(
            (a) =>
              a.type === filterAsset &&
              (a.symbol + a.name).toLowerCase().includes(search.toLowerCase())
          ),
          renderItem: ({ item }) => <AssetItem asset={item} onPress={() => selectAsset(item)} />,
          keyExtractor: (item, i) => item.denom + '_' + i,
          showsVerticalScrollIndicator: false,
          ListFooterComponent: (
            <View style={styles.buttonContainer}>
              {AssetTypes.Savings === filterAsset ? (
                <Button onPress={() => Actions.Savings({ mode: 'deposit' })} size="Large">
                  {t('deposit')}
                </Button>
              ) : null}
              {AssetTypes.Investments === filterAsset ? (
                <Button onPress={() => Actions.jump('Invest')} size="Large">
                  {t('invest')}
                </Button>
              ) : null}
            </View>
          ),
        }}
      />
    </LinearGradient>
  )
}

export default Home
