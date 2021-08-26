import React from 'react'
import { ScrollView, View } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import { Mirror, UST } from '@mirror-protocol/mirror.js'
import {
  queryTerraswapNativeSimulation,
  queryTerraswapReverseNativeSimulation,
  queryTerraswapSimulation,
  queryTerraswapReverseTokenSimulation,
} from '@anchor-protocol/anchor.js/dist/queries/terraswap'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { Asset, AssetTypes, AvailableAsset } from '../../types/assets'
import { Actions } from 'react-native-router-flux'
import Button from '../../components/Button'
import { useAssetsContext } from '../../contexts/AssetsContext'
import {
  anchorAddressProvider,
  mirrorOptions,
  terraLCDClient,
  terraUstPairContract,
} from '../../utils/terraConfig'
import {
  getCurrentAssetDetail,
  getMAssetDetail,
  getTokenAssetDetail,
} from '../../utils/transformAssets'
import HeaderBar from '../../components/HeaderBar'
import AssetAmountInput from '../../components/AssetAmountInput'
import ConfirmSwapModal from '../../components/ConfirmModals/ConfirmSwapModal'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { useAccountsContext } from '../../contexts/AccountsContext'

const mirror = new Mirror(mirrorOptions)

type SwapProps =
  | {
      asset: AvailableAsset
      mode: 'buy'
    }
  | {
      asset: Asset
      mode: 'sell'
    }

const Swap: React.FC<SwapProps> = ({ asset: defaultAsset, mode }) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useTranslation()
  const { swap, assets, availableAssets } = useAssetsContext()
  const { address } = useAccountsContext()
  const { currency } = useSettingsContext()

  const [asset, setAsset] = React.useState(defaultAsset)

  const [fromAmount, setFromAmount] = React.useState('')
  const [toAmount, setToAmount] = React.useState('')

  const [isConfirming, setIsConfirming] = React.useState(false)

  // TODO: currently non current assets can only be traded with UST
  const currentAsset =
    assets.find((a) => a.coin.denom === 'uusd') ||
    getCurrentAssetDetail({
      denom: 'uusd',
      amount: (Number(mode === 'buy' ? fromAmount : toAmount) * 10 ** 6).toString(),
    })

  const changeAmount = React.useCallback(
    async (a: string, which: 'from' | 'to', defaultSymbol?: string) => {
      try {
        ;(which === 'from' ? setFromAmount : setToAmount)(a)
        let rate
        const isUstBase =
          (which === 'from' && mode === 'buy') || (which === 'to' && mode === 'sell')
        // LUNA or ANC
        if ((defaultSymbol || asset.symbol) === 'LUNA') {
          rate = await (which === 'from'
            ? queryTerraswapNativeSimulation
            : queryTerraswapReverseNativeSimulation)({
            lcd: terraLCDClient as any,
            pair_contract_address: terraUstPairContract,
            denom: isUstBase ? currentAsset.coin.denom : 'uluna',
            amount: a,
          })(anchorAddressProvider)
        } else if ((defaultSymbol || asset.symbol) === 'ANC') {
          if (isUstBase) {
            rate = await (which === 'from'
              ? queryTerraswapNativeSimulation
              : queryTerraswapReverseNativeSimulation)({
              lcd: terraLCDClient as any,
              pair_contract_address: anchorAddressProvider.terraswapAncUstPair(),
              denom: currentAsset.coin.denom,
              amount: a,
            })(anchorAddressProvider)
          } else {
            rate = await (which === 'from'
              ? queryTerraswapSimulation
              : queryTerraswapReverseTokenSimulation)({
              lcd: terraLCDClient as any,
              pair_contract_address: anchorAddressProvider.terraswapAncUstPair(),
              contractAddr: anchorAddressProvider.ANC(),
              amount: a,
            })(anchorAddressProvider)
            console.log(rate)
          }
        } else {
          // M Assets
          const simulation = {
            amount: (Number(a) * 10 ** 6).toString(),
            info: isUstBase
              ? UST
              : {
                  token: {
                    contract_addr:
                      mirror.assets[defaultSymbol || asset.coin.denom].token.contractAddress,
                  },
                },
          }
          rate = await mirror.assets[defaultSymbol || asset.coin.denom].pair[
            which === 'from' ? 'getSimulation' : 'getReverseSimulation'
          ](simulation as any)
        }
        const result = (
          Number((rate as any).offer_amount || (rate as any).return_amount) /
          10 ** 6
        ).toString()
        ;(which === 'from' ? setToAmount : setFromAmount)(result)
      } catch (err) {
        console.log(err)
        ;(which === 'from' ? setToAmount : setFromAmount)('')
      }
    },
    [asset, mode, currentAsset, address]
  )
  // TODO: calculate non USD base currency
  const fromAsset = React.useMemo(
    () => ({
      ...(mode === 'buy'
        ? currentAsset
        : (asset.type === AssetTypes.Tokens ? getTokenAssetDetail : getMAssetDetail)(
            { denom: asset.coin.denom, amount: String(Number(fromAmount) * 10 ** 6) },
            availableAssets
          )),
      coin: {
        denom: mode === 'buy' ? currentAsset.coin.denom : asset.coin.denom,
        amount: String(Number(fromAmount) * 10 ** 6),
      },
      worth: {
        denom: currency,
        amount: String(Number(mode === 'buy' ? fromAmount : toAmount) * 10 ** 6),
      },
    }),
    [mode, currentAsset, asset, fromAmount, toAmount, availableAssets, currency]
  )
  const toAsset = React.useMemo(
    () => ({
      ...(mode === 'buy' ? (asset as Asset) : currentAsset),
      coin: {
        denom: mode === 'buy' ? asset.coin.denom : currentAsset.coin.denom,
        amount: String(Number(toAmount) * 10 ** 6),
      },
      worth: {
        denom: currency,
        amount: String(Number(mode === 'buy' ? fromAmount : toAmount) * 10 ** 6),
      },
    }),
    [mode, currentAsset, asset, fromAmount, toAmount, currency]
  )

  const onSubmit = React.useCallback(
    async (password: string) => {
      if (fromAmount) {
        if (mode === 'buy') {
          await swap(
            { denom: currentAsset.coin.denom, amount: Number(fromAmount) },
            asset.coin.denom,
            password
          )
        } else {
          await swap(
            { denom: asset.coin.denom, amount: Number(fromAmount) },
            currentAsset.coin.denom,
            password
          )
        }
        Actions.Success({
          message: {
            type: 'swap',
            from: fromAsset,
            to: toAsset,
          },
          onClose: () => Actions.jump('Home'),
        })
      }
    },
    [asset, fromAmount, fromAsset, toAsset, swap, currentAsset, mode]
  )

  return (
    <>
      <HeaderBar title={t(mode)} back />
      <View style={styles.container}>
        <ScrollView scrollEnabled={false}>
          {mode === 'buy' ? (
            <AssetAmountInput
              asset={currentAsset}
              amount={fromAmount}
              setAmount={(a) => changeAmount(a, 'from')}
              assetItemProps={{
                disabled: true,
              }}
            />
          ) : (
            <AssetAmountInput
              asset={asset as Asset}
              amount={fromAmount}
              setAmount={(a) => changeAmount(a, 'from')}
              assetItemProps={{
                onPress: () => {
                  Actions.SelectAsset({
                    assets: assets.filter(
                      (a) => a.type === AssetTypes.Investments || a.type === AssetTypes.Tokens
                    ),
                    onSelect: (a: Asset) => {
                      setAsset(a)
                      changeAmount(toAmount, 'to', a.symbol)
                      Actions.pop()
                    },
                  })
                },
              }}
            />
          )}
          <Icon
            name="arrow-down"
            size={theme.baseSpace * 8}
            color={theme.palette.grey[10]}
            style={styles.arrow}
          />
          {mode === 'buy' ? (
            <AssetAmountInput
              availableAsset={asset as AvailableAsset}
              asset={toAsset}
              amount={toAmount}
              setAmount={(a) => changeAmount(a, 'to')}
              availableAssetItemProps={{
                onPress: () => {
                  Actions.SelectAsset({
                    availableAssets,
                    onSelect: (a: AvailableAsset) => {
                      setAsset(a)
                      changeAmount(fromAmount, 'from', a.symbol)
                      Actions.pop()
                    },
                  })
                },
              }}
            />
          ) : (
            <AssetAmountInput
              asset={currentAsset}
              amount={toAmount}
              setAmount={(a) => changeAmount(a, 'to')}
              assetItemProps={{
                disabled: true,
                hideAmount: true,
              }}
            />
          )}
        </ScrollView>
        <Button
          disabled={
            !Number(fromAmount) ||
            (mode === 'buy' && Number(fromAmount) * 10 ** 6 > Number(currentAsset.coin.amount)) ||
            (mode === 'sell' && Number(fromAmount) * 10 ** 6 > Number((asset as Asset).coin.amount))
          }
          style={styles.button}
          size="Large"
          onPress={() => setIsConfirming(true)}
        >
          {t('next')}
        </Button>
      </View>
      {fromAsset && toAsset ? (
        <ConfirmSwapModal
          open={isConfirming}
          from={fromAsset as any}
          to={toAsset}
          onClose={() => setIsConfirming(false)}
          onConfirm={() => Actions.Password({ onSubmit, title: t('please enter your password') })}
        />
      ) : null}
    </>
  )
}

export default Swap
