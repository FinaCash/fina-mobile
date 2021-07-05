import React from 'react'
import { Animated, TouchableOpacity, View } from 'react-native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { Modalize } from 'react-native-modalize'
import SearchIcon from '../../assets/images/icons/search.svg'
import TransferIcon from '../../assets/images/icons/transfer.svg'
import ReceiveIcon from '../../assets/images/icons/receive.svg'
import NotificationsIcon from '../../assets/images/icons/notifications.svg'
import AssetItem from '../../components/AssetItem'
import { LinearGradient } from 'expo-linear-gradient'
import Typography from '../../components/Typography'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import {
  transformAssetsToDistributions,
  transformAssetsToSections,
} from '../../utils/transformAssets'
import getStyles from './styles'
import { Asset, AssetTypes } from '../../types/assets'
import { Actions } from 'react-native-router-flux'
import { formatCurrency } from '../../utils/formatNumbers'
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
  const [assetsDistribution, setAssetsDistribution] = React.useState<
    Array<{ type: string; value: number }>
  >([])
  const [search, setSearch] = React.useState('')
  const total = React.useMemo(
    () => assetsDistribution.map((a) => a.value).reduce((a, b) => a + b, 0),
    [assetsDistribution]
  )

  const calculateAssetsDistribution = React.useCallback(async () => {
    try {
      const result = await transformAssetsToDistributions(assets, currency)
      setAssetsDistribution(result)
    } catch (err) {
      console.log(err)
    }
  }, [assets, currency])

  React.useEffect(() => {
    calculateAssetsDistribution()
  }, [calculateAssetsDistribution])

  const sections = React.useMemo(() => transformAssetsToSections(assets), [assets])

  const selectAsset = React.useCallback(
    (asset: Asset) => {
      const options =
        asset.type === AssetTypes.Currents
          ? [t('transfer'), t('receive'), t('deposit to savings'), t('exchange'), t('cancel')]
          : [t('withdraw to currents'), t('cancel')]
      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
        },
        (index) => {
          if (index === options.length - 1) {
            return
          }
          if (asset.type === AssetTypes.Savings && index === 0) {
            return Actions.push('Swap', { to: asset.coin.denom, type: AssetTypes.Savings })
          }
          if (asset.type === AssetTypes.Currents && index === 0) {
            // Send
          }
          if (asset.type === AssetTypes.Currents && index === 1) {
            // Receive
          }
          if (asset.type === AssetTypes.Currents && index === 2) {
            return Actions.push('Savings', { from: asset.coin.denom, type: 'deposit' })
          }
          if (asset.type === AssetTypes.Currents && index === 3) {
            return Actions.push('Swap', { from: asset.coin.denom, type: AssetTypes.Currents })
          }
        }
      )
    },
    [t]
  )

  return (
    <LinearGradient
      start={[0, 0]}
      end={[1, 1]}
      colors={theme.gradients.primary}
      style={styles.parentContainer}
    >
      <View style={styles.header}>
        <Typography color={theme.palette.white}>{t('total balance')}</Typography>
        <Typography color={theme.palette.white} type="H2">
          {formatCurrency(total, currency)}
        </Typography>
        <View style={styles.buttonRow}>
          <Button style={styles.button} icon={<TransferIcon />}>
            {t('transfer')}
          </Button>
          <Button style={styles.button} icon={<ReceiveIcon />}>
            {t('receive')}
          </Button>
        </View>
      </View>
      <TouchableOpacity style={styles.notiButton}>
        <NotificationsIcon />
      </TouchableOpacity>
      <Modalize
        ref={modalizeRef}
        alwaysOpen={
          theme.screenHeight -
          64 * theme.baseSpace -
          theme.bottomSpace -
          theme.tabBarHeight -
          theme.statusBarHeight
        }
        modalStyle={{
          borderTopLeftRadius: theme.borderRadius[2],
          borderTopRightRadius: theme.borderRadius[2],
        }}
        withHandle={false}
        panGestureAnimatedValue={scrollY}
        useNativeDriver={false}
        HeaderComponent={
          <Animated.View
            style={[
              styles.searchBarContainer,
              {
                opacity: scrollY,
                height: Animated.multiply(scrollY, 18 * theme.baseSpace),
              },
            ]}
          >
            <View style={styles.swipeIndicator} />
            <Input
              placeholder={t('search')}
              icon={<SearchIcon />}
              value={search}
              onChangeText={setSearch}
            />
          </Animated.View>
        }
        sectionListProps={{
          sections,
          renderItem: ({ item }) =>
            (t(`${item.coin.denom} name`) + t(`${item.coin.denom} description`))
              .toLowerCase()
              .includes(search.toLowerCase()) ? (
              <AssetItem asset={item} onPress={() => selectAsset(item)} />
            ) : null,
          keyExtractor: (item, i) => item.denom + '_' + i,
          showsVerticalScrollIndicator: false,
          style: { borderRadius: theme.borderRadius[2] },
        }}
      />
    </LinearGradient>
  )
}

export default Home
