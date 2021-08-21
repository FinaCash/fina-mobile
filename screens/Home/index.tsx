import React from 'react'
import { Animated, View } from 'react-native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { Modalize } from 'react-native-modalize'
import get from 'lodash/get'
import * as WebBrowser from 'expo-web-browser'
import SearchIcon from '../../assets/images/icons/search.svg'
import TransakIcon from '../../assets/images/icons/transak.svg'
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
import AssetFilter from '../../components/AssetFilter'
import { getTransakUrl } from '../../utils/terraConfig'

const Home: React.FC = () => {
  const scrollY = React.useRef(new Animated.Value(0)).current
  const { styles, theme } = useStyles(getStyles)
  const { assets, send, address: walletAddress } = useAssetsContext()
  const { currency } = useSettingsContext()
  const { t } = useTranslation()
  const { showActionSheetWithOptions } = useActionSheet()
  const assetsDistribution = transformAssetsToDistributions(assets)
  assetsDistribution.overview = Object.values(assetsDistribution).reduce((a, b) => a + b, 0)
  const averageSavingsAPR =
    assets
      .filter((a) => a.type === AssetTypes.Savings)
      .map((a) => get(a, 'worth.amount', 0) * (a.apr || 0))
      .reduce((a, b) => a + b, 0) / assetsDistribution[AssetTypes.Savings]

  const [search, setSearch] = React.useState('')
  const [filterAsset, setFilterAsset] = React.useState('overview')

  const transferAsset = React.useCallback(
    (asset: Asset) => {
      Actions.SelectAmount({
        asset,
        onSubmit: (amount: number) =>
          Actions.SelectRecipient({
            asset,
            amount,
            onSubmit: (address: string, memo: string) =>
              Actions.Password({
                title: t('please enter your password'),
                onSubmit: async (password: string) => {
                  await send({ denom: asset.coin.denom, amount }, address, memo, password)
                  Actions.Success({
                    message: {
                      type: 'send',
                      asset,
                      amount,
                      address,
                    },
                    onClose: () => Actions.jump('Home'),
                  })
                },
              }),
          }),
      })
    },
    [send, t]
  )

  const selectAsset = React.useCallback(
    (asset: Asset) => {
      let options = []
      switch (asset.type) {
        case AssetTypes.Currents:
          options = [t('transfer'), t('currency exchange'), t('cancel')]
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
            return transferAsset(asset)
          }
          if (asset.type === AssetTypes.Currents && index === 1) {
            return Actions.CurrencyExchange({ from: asset.coin.denom })
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
    [t, showActionSheetWithOptions, transferAsset]
  )

  return (
    <LinearGradient
      start={[0, 0]}
      end={[1, 1]}
      colors={theme.gradients.primary}
      style={styles.parentContainer}
    >
      <View style={styles.header}>
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
              {`+ ${formatPercentage(averageSavingsAPR, 2)}`}
            </Button>
          ) : null}
        </View>
        <View style={styles.buttonRow}>
          <Button
            onPress={() => WebBrowser.openBrowserAsync(getTransakUrl(walletAddress))}
            borderRadius={1}
            style={styles.button}
            iconStyle={styles.buttonIcon}
            icon={<TransakIcon style={{ transform: [{ scale: 1.5 }] }} />}
          >
            {t('buy ust')}
          </Button>
          <Button
            onPress={() =>
              Actions.SelectAsset({
                onSelect: transferAsset,
                // TODO: transfer other tokens
                assets: assets.filter((a) => a.coin.denom.match(/^u/)),
              })
            }
            borderRadius={1}
            style={styles.button}
            iconStyle={styles.buttonIcon}
            icon={<TransferIcon />}
          >
            {t('transfer')}
          </Button>
          <Button
            onPress={() => Actions.MyAddress()}
            borderRadius={1}
            style={styles.button}
            iconStyle={styles.buttonIcon}
            icon={<ReceiveIcon />}
          >
            {t('receive')}
          </Button>
        </View>
      </View>
      <Modalize
        alwaysOpen={
          theme.screenHeight -
          65 * theme.baseSpace -
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
