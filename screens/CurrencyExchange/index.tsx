import React from 'react'
import { ScrollView, View } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { Actions } from 'react-native-router-flux'
import { Coin } from '@terra-money/terra.js'
import { terraLCDClient as terra } from '../../utils/terraConfig'
import Button from '../../components/Button'
import { getCurrentAssetDetail } from '../../utils/transformAssets'
import HeaderBar from '../../components/HeaderBar'
import AssetAmountInput from '../../components/AssetAmountInput'
import { Asset, AssetTypes } from '../../types/assets'
import ConfirmSwapModal from '../../components/ConfirmModals/ConfirmSwapModal'
import { useLocalesContext } from '../../contexts/LocalesContext'

interface CurrencyExchangeProps {
  from?: string
  to?: string
}

const CurrencyExchange: React.FC<CurrencyExchangeProps> = ({
  from: defaultFrom,
  to: defaultTo,
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { assets, availableCurrencies, swap } = useAssetsContext()
  const { currency } = useSettingsContext()
  const { t } = useLocalesContext()

  const [from, setFrom] = React.useState(defaultFrom)
  const [fromAmount, setFromAmount] = React.useState('')

  const [to, setTo] = React.useState(defaultTo)
  const [toAmount, setToAmount] = React.useState('')

  const [isConfirming, setIsConfirming] = React.useState(false)

  const [baseCurrencyAmount, setBaseCurrencyAmount] = React.useState(0)

  const changeAmount = React.useCallback(
    async (a: string, which: 'from' | 'to', defaultObj?: string) => {
      try {
        ;(which === 'from' ? setFromAmount : setToAmount)(a)
        const subj = which === 'from' ? from : to
        const obj = defaultObj || (which === 'from' ? to : from)
        if (!subj) {
          return
        }
        const newCoinAmount = (Number(a) * 10 ** 6).toString()
        const rate =
          subj === currency
            ? new Coin(subj, newCoinAmount)
            : await terra.market.swapRate(new Coin(subj, newCoinAmount), currency)
        setBaseCurrencyAmount(rate.amount.toNumber())
        if (!obj) {
          return
        }
        const swapped =
          subj === obj
            ? new Coin(subj, newCoinAmount)
            : await terra.market.swapRate(new Coin(subj, newCoinAmount), obj)
        ;(which === 'from' ? setToAmount : setFromAmount)(
          (swapped.amount.toNumber() / 10 ** 6).toString()
        )
      } catch (err: any) {
        setBaseCurrencyAmount(0)
        ;(which === 'from' ? setToAmount : setFromAmount)('')
      }
    },
    [from, to, currency]
  )

  const fromAsset = assets.find((a) => a.coin.denom === from)
  const fromAssetWithAmount = React.useMemo(
    () =>
      from && fromAsset
        ? {
            ...fromAsset,
            coin: { denom: from, amount: String(Number(fromAmount) * 10 ** 6) },
            worth: {
              denom: currency,
              amount: String(baseCurrencyAmount),
            },
          }
        : undefined,
    [from, fromAsset, fromAmount, currency, baseCurrencyAmount]
  )
  const toAsset = React.useMemo(
    () =>
      to
        ? {
            ...getCurrentAssetDetail({
              denom: to,
              amount: String(Number(toAmount) * 10 ** 6),
            }),
            worth: {
              denom: currency,
              amount: String(baseCurrencyAmount),
            },
          }
        : undefined,
    [to, toAmount, currency, baseCurrencyAmount]
  )

  const onSubmit = React.useCallback(
    async (password: string) => {
      if (from && to) {
        try {
          await swap({ denom: from, amount: Number(fromAmount) }, to, password)
          Actions.Success({
            message: {
              type: 'swap',
              from: fromAssetWithAmount,
              to: toAsset,
            },
            onClose: () => Actions.jump('Home'),
          })
        } catch (err: any) {
          Actions.Success({
            message: {
              type: 'swap',
              from: fromAssetWithAmount,
              to: toAsset,
            },
            error: err.message,
            onClose: () => Actions.popTo('CurrencyExchange'),
          })
        }
      }
    },
    [from, to, fromAmount, fromAssetWithAmount, toAsset, swap]
  )

  return (
    <>
      <HeaderBar title={t('currency exchange')} back />
      <View style={styles.container}>
        <ScrollView scrollEnabled={false}>
          <AssetAmountInput
            asset={fromAsset}
            amount={fromAmount}
            setAmount={(a) => changeAmount(a, 'from')}
            assetItemProps={{
              onPress: () => {
                Actions.SelectAsset({
                  assets: assets.filter((a) => a.type === AssetTypes.Currents),
                  onSelect: (a: Asset) => {
                    setFrom(a.coin.denom)
                    changeAmount(toAmount, 'to', a.coin.denom)
                    Actions.pop()
                  },
                })
              },
            }}
          />
          <Icon
            name="arrow-down"
            size={theme.baseSpace * 8}
            color={theme.palette.grey[10]}
            style={styles.arrow}
          />
          <AssetAmountInput
            asset={toAsset}
            amount={toAmount}
            setAmount={(a) => changeAmount(a, 'to')}
            assetItemProps={{
              hideAmount: true,
              onPress: () => {
                Actions.SelectAsset({
                  assets: availableCurrencies.map((c) =>
                    getCurrentAssetDetail({ denom: c, amount: '0' })
                  ),
                  assetItemProps: { hideAmount: true },
                  onSelect: (a: Asset) => {
                    setTo(a.coin.denom)
                    changeAmount(fromAmount, 'from', a.coin.denom)
                    Actions.pop()
                  },
                })
              },
            }}
          />
        </ScrollView>
        <Button
          disabled={
            !Number(fromAmount) ||
            (fromAsset && Number(fromAmount) * 10 ** 6 > Number(fromAsset.coin.amount))
          }
          style={styles.button}
          size="Large"
          onPress={() => setIsConfirming(true)}
        >
          {t('next')}
        </Button>
      </View>
      {from && fromAssetWithAmount && toAsset ? (
        <ConfirmSwapModal
          open={isConfirming}
          from={fromAssetWithAmount}
          to={toAsset}
          onClose={() => setIsConfirming(false)}
          onConfirm={() => Actions.Password({ onSubmit })}
        />
      ) : null}
    </>
  )
}

export default CurrencyExchange
