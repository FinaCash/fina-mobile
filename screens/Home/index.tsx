import React from 'react'
import { ActivityIndicator, Animated, TouchableOpacity, View } from 'react-native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { Modalize } from 'react-native-modalize'
import { Feather as Icon } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import ContactIcon from '../../assets/images/icons/recipients.svg'
import QRCodeIcon from '../../assets/images/icons/qrcode.svg'
import SearchIcon from '../../assets/images/icons/search.svg'
import TransakIcon from '../../assets/images/icons/transak.svg'
import TransferIcon from '../../assets/images/icons/transfer.svg'
import ReceiveIcon from '../../assets/images/icons/receive.svg'
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
import { getTransakUrl } from '../../utils/terraConfig'
import { useAccountsContext } from '../../contexts/AccountsContext'
import useSendToken from '../../utils/useSendToken'
import { useLocalesContext } from '../../contexts/LocalesContext'
import CollateralItem from '../../components/CollateralItem'

const Home: React.FC = () => {
  const scrollY = React.useRef(new Animated.Value(0)).current
  const { styles, theme } = useStyles(getStyles)
  const { assets, availableAssets, fetchAssets } = useAssetsContext()
  const sendToken = useSendToken()
  const { address: walletAddress } = useAccountsContext()
  const { currency } = useSettingsContext()
  const { t } = useLocalesContext()
  const { showActionSheetWithOptions } = useActionSheet()
  const assetsDistribution = transformAssetsToDistributions(assets)
  assetsDistribution.overview = Object.values(assetsDistribution).reduce((a, b) => a + b, 0)
  const averageSavingsAPR =
    assets
      .filter((a) => a.type === AssetTypes.Savings)
      .map((a) => a.price * Number(a.coin.amount) * (a.apr || 0))
      .reduce((a, b) => a + b, 0) / assetsDistribution[AssetTypes.Savings]

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
          options = [t('buy'), t('sell'), t('cancel')]
          break
        case AssetTypes.Collaterals:
          options = [t('buy'), t('sell'), t('provide'), t('withdraw'), t('cancel')]
          break
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
          if (asset.type === AssetTypes.Collaterals && (index === 0 || index === 1)) {
            Actions.Swap({
              mode: index === 0 ? 'buy' : 'sell',
              asset,
            })
          }
          if (asset.type === AssetTypes.Collaterals && (index === 2 || index === 3)) {
            Actions.ProvideCollateral({
              asset,
              availableAsset: availableAssets.find((a) => a.symbol === asset.symbol),
              mode: index === 2 ? 'provide' : 'withdraw',
            })
          }
        }
      )
    },
    [t, showActionSheetWithOptions, sendToken, availableAssets]
  )

  const refresh = React.useCallback(async () => {
    setLoading(true)
    await fetchAssets()
    setLoading(false)
  }, [fetchAssets, setLoading])

  return (
    <LinearGradient
      start={[0, 0]}
      end={[1, 1]}
      colors={theme.gradients.primary}
      style={styles.parentContainer}
    >
      <View style={styles.header}>
        <View style={styles.iconButtonsRow}>
          <TouchableOpacity onPress={() => Actions.History()}>
            <Icon
              name="activity"
              style={styles.iconButton}
              size={theme.baseSpace * 5}
              color={theme.palette.white}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.Recipients()}>
            <ContactIcon style={styles.iconButton} fill={theme.palette.white} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Actions.ScanQRCode({
                onScan: (to: string) =>
                  sendToken({ recipient: { address: to, name: '', image: '' } }),
              })
            }
          >
            <QRCodeIcon style={styles.iconButton} fill={theme.palette.white} />
          </TouchableOpacity>
        </View>
        <AssetFilter withOverview currentFilter={filterAsset} onChange={setFilterAsset} />
        <Typography style={styles.title} color={theme.palette.white} type="Large">
          {t(filterAsset === 'overview' ? 'total balance' : 'equity value', {
            currency: getCurrencyFromDenom(currency),
          })}
        </Typography>
        <View style={styles.row}>
          <Typography color={theme.palette.white} type="H2">
            {formatCurrency(assetsDistribution[filterAsset], currency, true)}
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
      {loading ? <ActivityIndicator size="large" /> : null}
      <Modalize
        alwaysOpen={
          theme.screenHeight -
          72 * theme.baseSpace -
          theme.bottomSpace -
          theme.tabBarHeight -
          theme.statusBarHeight -
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
              (filterAsset === 'overview' || a.type === filterAsset) &&
              (a.symbol + a.name).toLowerCase().includes(search.toLowerCase()) &&
              // Filter empty savings/collateral assets on overview tab
              (filterAsset === 'overview'
                ? (a.type !== AssetTypes.Savings && a.type !== AssetTypes.Collaterals) ||
                  Number(a.coin.amount) > 0
                : true)
          ),
          renderItem: ({ item }) =>
            filterAsset === 'overview' || item.type !== AssetTypes.Collaterals ? (
              <AssetItem
                asset={item}
                onPress={() => selectAsset(item)}
                hideApr={filterAsset === 'overview'}
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
