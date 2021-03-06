import React from 'react'
import {
  ActivityIndicator,
  Animated,
  AppState,
  AppStateStatus,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { Modalize } from 'react-native-modalize'
import { Feather as Icon, MaterialIcons as MIcon } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import ContactIcon from '../../assets/images/icons/recipients.svg'
import QRCodeIcon from '../../assets/images/icons/qrcode.svg'
import SearchIcon from '../../assets/images/icons/search.svg'
import TransakIcon from '../../assets/images/icons/transak.svg'
import TransferIcon from '../../assets/images/icons/transfer.svg'
import ReceiveIcon from '../../assets/images/icons/receive.svg'
import EmptyImage from '../../assets/images/empty.svg'
import AssetItem from '../../components/AssetItem'
import { LinearGradient } from 'expo-linear-gradient'
import Typography from '../../components/Typography'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import useStyles from '../../theme/useStyles'
import { getCurrencyFromDenom, transformAssetsToDistributions } from '../../utils/transformAssets'
import getStyles from './styles'
import { Asset, AssetTypes } from '../../types/assets'
import { Actions } from 'react-native-router-flux'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import Button from '../../components/Button'
import Input from '../../components/Input'
import AssetFilter from '../../components/AssetFilter'
import { colleteralsInfo, getTransakUrl, supportedTokens } from '../../utils/terraConfig'
import { useAccountsContext } from '../../contexts/AccountsContext'
import useSendToken from '../../utils/useSendToken'
import { useLocalesContext } from '../../contexts/LocalesContext'
import CollateralItem from '../../components/CollateralItem'

const onStateChange = (nextState: AppStateStatus) => {
  if (nextState !== 'active' && Actions.currentScene !== 'LockScreen') {
    Actions.LockScreen()
  }
}

const Home: React.FC = () => {
  const scrollY = React.useRef(new Animated.Value(0)).current
  const { styles, theme } = useStyles(getStyles)
  const {
    assets,
    availableAssets,
    stakingInfo,
    farmInfo,
    fetchAssets,
    fetchAvailableAssets,
    fetchBorrowInfo,
    fetchStakingInfo,
  } = useAssetsContext()
  const sendToken = useSendToken()
  const { address: walletAddress } = useAccountsContext()
  const { currency, currencyRate, hideSmallBalance, hideAmount, setHideAmount, lockScreenMode } =
    useSettingsContext()
  const { t } = useLocalesContext()
  const { showActionSheetWithOptions } = useActionSheet()
  const assetsDistribution = React.useMemo(
    () => transformAssetsToDistributions(assets, stakingInfo),
    [assets, stakingInfo]
  )
  assetsDistribution.overview = React.useMemo(
    () => Object.values(assetsDistribution).reduce((a, b) => a + b, 0),
    [assetsDistribution]
  )
  const averageSavingsAPR = React.useMemo(
    () =>
      assets
        .filter((a) => a.type === AssetTypes.Savings)
        .map((a) => a.price * Number(a.coin.amount) * (a.apr || 0))
        .reduce((a, b) => a + b, 0) / assetsDistribution[AssetTypes.Savings],
    [assets, assetsDistribution]
  )

  const [search, setSearch] = React.useState('')
  const [filterAsset, setFilterAsset] = React.useState('overview')
  const [loading, setLoading] = React.useState(false)

  const selectAsset = React.useCallback(
    (asset: Asset) => {
      let options: any = []
      switch (asset.type) {
        case AssetTypes.Currents:
          options =
            asset.symbol === 'UST'
              ? [t('transfer'), t('currency exchange'), t('deposit'), t('cancel')]
              : [t('transfer'), t('currency exchange'), t('cancel')]
          break
        case AssetTypes.Savings:
          options = [t('deposit'), t('withdraw'), t('cancel')]
          break
        case AssetTypes.Investments:
          options = [t('buy'), t('sell'), t('cancel')]
          break
        case AssetTypes.Tokens:
          options =
            asset.symbol === 'LUNA'
              ? [t('buy'), t('sell'), t('stake'), t('cancel')]
              : supportedTokens[asset.coin.denom]?.addresses.pair
              ? [t('buy'), t('sell'), t('cancel')]
              : []
          break
        case AssetTypes.Collaterals:
          options = (colleteralsInfo as any)[asset.symbol].tradeable
            ? [t('provide'), t('withdraw'), t('buy'), t('sell'), t('cancel')]
            : [t('provide'), t('withdraw'), t('cancel')]
          break
        case AssetTypes.Farms:
          options = [t('provide liquidity'), t('withdraw liquidity'), t('cancel')]
          break
      }
      if (!options.length) {
        return
      }
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
            return sendToken({ asset })
          }
          if (asset.type === AssetTypes.Currents && index === 1) {
            return Actions.CurrencyExchange({ from: asset.coin.denom })
          }
          if (asset.type === AssetTypes.Currents && index === 2) {
            return Actions.Savings({ from: asset.coin.denom, mode: 'deposit' })
          }
          if (asset.type === AssetTypes.Savings && index === 0) {
            return Actions.Savings({ from: asset.coin.denom, mode: 'deposit' })
          }
          if (asset.type === AssetTypes.Savings && index === 1) {
            return Actions.Savings({ from: asset.coin.denom, mode: 'withdraw' })
          }
          if (
            (asset.type === AssetTypes.Investments || asset.type === AssetTypes.Tokens) &&
            index === 0
          ) {
            return Actions.Swap({
              asset: availableAssets.find((a) => a.symbol === asset.symbol),
              mode: 'buy',
            })
          }
          if (
            (asset.type === AssetTypes.Investments || asset.type === AssetTypes.Tokens) &&
            index === 1
          ) {
            return Actions.Swap({ asset, mode: 'sell' })
          }
          if (asset.symbol === 'LUNA' && index === 2) {
            return Actions.jump('Earn')
          }
          if (asset.type === AssetTypes.Collaterals && (index === 0 || index === 1)) {
            Actions.ProvideCollateral({
              asset,
              availableAsset: availableAssets.find((a) => a.symbol === asset.symbol),
              mode: index === 0 ? 'provide' : 'withdraw',
            })
          }
          if (
            options.length > 3 &&
            asset.type === AssetTypes.Collaterals &&
            (index === 2 || index === 3)
          ) {
            Actions.Swap({
              mode: index === 2 ? 'buy' : 'sell',
              asset,
            })
          }
          if (asset.type === AssetTypes.Farms && index === 0) {
            Actions.ProvideLiquidity({
              farm: farmInfo.find((f) => f.symbol + ' + ' + f.pairSymbol === asset.symbol),
            })
          }
          if (asset.type === AssetTypes.Farms && index === 1) {
            Actions.WithdrawLiquidity({
              farm: farmInfo.find((f) => f.symbol + ' + ' + f.pairSymbol === asset.symbol),
            })
          }
        }
      )
    },
    [t, showActionSheetWithOptions, sendToken, availableAssets, farmInfo]
  )

  const refresh = React.useCallback(async () => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 5000)
    await Promise.all([
      fetchAssets(),
      fetchAvailableAssets(),
      fetchBorrowInfo(),
      fetchStakingInfo(),
    ])
    clearTimeout(timeout)
    setLoading(false)
  }, [fetchAssets, fetchAvailableAssets, fetchBorrowInfo, fetchStakingInfo, setLoading])

  // const smallBalanceAssets = React.useMemo(
  //   () =>
  //     assets.filter(
  //       (a) =>
  //         a.type !== AssetTypes.Savings &&
  //         a.type !== AssetTypes.Collaterals &&
  //         (Number(a.coin.amount) * a.price) / 10 ** 6 <= 0.1
  //     ),
  //   [assets]
  // )

  React.useEffect(() => {
    if (lockScreenMode !== 'off' && Actions.currentScene === '_Home') {
      Actions.LockScreen()
    }
    if (lockScreenMode === 'on background') {
      AppState.addEventListener('change', onStateChange)
    } else {
      AppState.removeEventListener('change', onStateChange)
    }
    return () => {
      AppState.removeEventListener('change', onStateChange)
    }
  }, [lockScreenMode])

  return (
    <LinearGradient
      start={[0, 0]}
      end={[1, 1]}
      colors={theme.gradients.primary}
      style={styles.parentContainer}
    >
      <View style={styles.header}>
        <View style={styles.iconButtonsRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => Actions.DappsList()}>
            <MIcon name="apps" size={theme.baseSpace * 6} color={theme.palette.white} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.iconButton} onPress={() => Actions.History()}>
              <Icon name="activity" size={theme.baseSpace * 5} color={theme.palette.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => setHideAmount((a) => !a)}>
              <Icon
                name={hideAmount ? 'eye' : 'eye-off'}
                size={theme.baseSpace * 5}
                color={theme.palette.white}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => Actions.Recipients()}>
              <ContactIcon fill={theme.palette.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() =>
                Actions.ScanQRCode({
                  onScan: (to: string) =>
                    sendToken({ recipient: { address: to, name: '', image: '' } }),
                })
              }
            >
              <QRCodeIcon fill={theme.palette.white} />
            </TouchableOpacity>
          </View>
        </View>
        <AssetFilter withOverview currentFilter={filterAsset} onChange={setFilterAsset} />
        <Typography style={styles.title} color={theme.palette.white} type="Large">
          {t(filterAsset === 'overview' ? 'total balance' : 'equity value', {
            currency: getCurrencyFromDenom(currency),
          })}
        </Typography>
        <View style={styles.row}>
          <Typography color={theme.palette.white} type="H2">
            {formatCurrency(
              assetsDistribution[filterAsset] * currencyRate,
              currency,
              true,
              hideAmount
            )}
          </Typography>
          {filterAsset === AssetTypes.Savings ? (
            <Button
              style={styles.avgApr}
              bgColor={theme.palette.green}
              size="Small"
              borderRadius={2}
            >
              {`${t('apy')} ${formatPercentage(averageSavingsAPR, 2)}`}
            </Button>
          ) : null}
        </View>
        <View style={styles.buttonRow}>
          <Button
            onPress={() => WebBrowser.openBrowserAsync(getTransakUrl(walletAddress))}
            borderRadius={1}
            style={styles.button}
            iconStyle={styles.buttonIcon}
            icon={
              <TransakIcon fill={theme.palette.white} style={{ transform: [{ scale: 1.5 }] }} />
            }
          >
            {t('buy ust')}
          </Button>
          <Button
            onPress={() => sendToken()}
            borderRadius={1}
            style={styles.button}
            iconStyle={styles.buttonIcon}
            icon={<TransferIcon fill={theme.palette.white} />}
          >
            {t('transfer')}
          </Button>
          <Button
            onPress={() => Actions.MyAddress()}
            borderRadius={1}
            style={styles.button}
            iconStyle={styles.buttonIcon}
            icon={<ReceiveIcon fill={theme.palette.white} />}
          >
            {t('receive')}
          </Button>
        </View>
      </View>
      {loading ? <ActivityIndicator size="large" color={theme.palette.white} /> : null}
      <Modalize
        alwaysOpen={
          theme.screenHeight -
          70 * theme.baseSpace -
          theme.bottomSpace -
          theme.tabBarHeight -
          theme.statusBarHeight -
          (Platform.OS === 'android' ? 12 * theme.baseSpace : 0) -
          (loading ? 20 * theme.baseSpace : 0)
        }
        modalStyle={styles.modal}
        onPullToRefresh={refresh}
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
          contentContainerStyle: { paddingBottom: theme.tabBarHeight + theme.bottomSpace },
          data: assets.filter(
            (a) =>
              (a.coin.denom === 'uluna'
                ? Number(a.coin.amount) +
                    [...stakingInfo.delegated, ...stakingInfo.unbonding]
                      .map((d) => d.amount)
                      .reduce((c, b) => c + b, 0) >
                  0
                : true) &&
              (filterAsset === 'overview' || a.type === filterAsset) &&
              (a.symbol + a.name).toLowerCase().includes(search.toLowerCase()) &&
              // Filter empty savings/collateral assets on overview tab
              (filterAsset === 'overview'
                ? (a.type !== AssetTypes.Savings && a.type !== AssetTypes.Collaterals) ||
                  Number(a.coin.amount) > 0
                : true) &&
              // Filter small balance tokens/currents/mAssets
              (hideSmallBalance
                ? (filterAsset !== 'overview' && a.type === AssetTypes.Savings) ||
                  (filterAsset !== 'overview' && a.type === AssetTypes.Collaterals) ||
                  (Number(
                    Number(a.coin.amount) +
                      (a.coin.denom === 'uluna'
                        ? [...stakingInfo.delegated, ...stakingInfo.unbonding]
                            .map((d) => d.amount)
                            .reduce((c, b) => c + b, 0)
                        : 0)
                  ) *
                    a.price) /
                    10 ** 6 >
                    0.1
                : true)
          ),
          // ListHeaderComponent: smallBalanceAssets.length ? (
          //   <View style={styles.linkButtonContainer}>
          //     <Button
          //       size="Small"
          //       icon={<TradeIcon />}
          //       bgColor="transparent"
          //       color={theme.palette.lightPrimary}
          //     >
          //       {t('convert small balance')}
          //     </Button>
          //   </View>
          // ) : null,
          renderItem: ({ item }) =>
            item.type !== AssetTypes.Collaterals ? (
              <AssetItem
                asset={item}
                onPress={() => selectAsset(item)}
                hideApr={filterAsset === 'overview'}
                stakingInfo={item.coin.denom === 'uluna' ? stakingInfo : undefined}
              />
            ) : (
              <CollateralItem asset={item} onPress={() => selectAsset(item)} />
            ),
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
                <Button onPress={() => Actions.jump('Trade')} size="Large">
                  {t('invest')}
                </Button>
              ) : null}
              {AssetTypes.Farms === filterAsset ? (
                <Button onPress={() => Actions.jump('_Earn', { toFarm: Date.now() })} size="Large">
                  {t('more farms')}
                </Button>
              ) : null}
            </View>
          ),
          ListEmptyComponent:
            filterAsset === 'overview' || filterAsset === 'currents' ? (
              <View style={styles.emptyContainer}>
                <EmptyImage />
                <View style={styles.emptyText}>
                  <Typography style={{ marginBottom: theme.baseSpace * 2 }} type="H4">
                    {t('wallet is empty')}
                  </Typography>
                  <Typography type="Large" color={theme.palette.grey[7]}>
                    {t('empty wallet description')}
                  </Typography>
                </View>
                <Button
                  onPress={() => WebBrowser.openBrowserAsync(getTransakUrl(walletAddress))}
                  size="Large"
                  style={{ width: theme.baseSpace * 40 }}
                >
                  {t('buy ust')}
                </Button>
              </View>
            ) : undefined,
        }}
      />
    </LinearGradient>
  )
}

export default Home
