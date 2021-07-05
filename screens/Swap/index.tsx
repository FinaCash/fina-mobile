import React from 'react'
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { Feather as Icon } from '@expo/vector-icons'
import Typography from '../../components/Typography'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { AssetTypes } from '../../types/assets'
import { Actions } from 'react-native-router-flux'
import AssetItem from '../../components/AssetItem'
import { Currencies } from '../../types/misc'
import { formatCurrency } from '../../utils/formatNumbers'
import { Coin } from '@terra-money/terra.js'
import terra from '../../utils/terraClient'
import Button from '../../components/Button'

interface SwapProps {
  from?: Currencies
  to?: Currencies
  type: AssetTypes
}

const Swap: React.FC<SwapProps> = ({ from: defaultFrom, to: defaultTo, type }) => {
  const { styles, theme } = useStyles(getStyles)
  const { assets, swap } = useAssetsContext()
  const { currency } = useSettingsContext()
  const { t } = useTranslation()
  const { showActionSheetWithOptions } = useActionSheet()

  const [from, setFrom] = React.useState(defaultFrom)
  const [fromAmount, setFromAmount] = React.useState('')

  const [to, setTo] = React.useState(defaultTo)
  const [toAmount, setToAmount] = React.useState('')

  const [baseCurrencyCoin, setBaseCurrencyCoin] = React.useState(new Coin(currency, '0'))

  const changeAmount = React.useCallback(
    async (a: string, which: 'from' | 'to', defaultObj?: Currencies) => {
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
        setBaseCurrencyCoin(rate)
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
      } catch (err) {
        setBaseCurrencyCoin(new Coin(currency, 0))
        ;(which === 'from' ? setToAmount : setFromAmount)('')
      }
    },
    [fromAmount, from, toAmount, to, currency]
  )

  const selectAsset = React.useCallback(
    (which: 'from' | 'to') => {
      const values = Object.values(Currencies)
      const options = [...values.map((c) => t(`${c} name`)), t('cancel')]
      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
        },
        (index) => {
          if (index === options.length - 1) {
            return
          }
          ;(which === 'from' ? setFrom : setTo)(values[index])
          changeAmount(
            which === 'to' ? fromAmount : toAmount,
            which === 'from' ? 'to' : 'from',
            values[index]
          )
        }
      )
    },
    [t, fromAmount, toAmount, changeAmount]
  )

  const onSubmit = React.useCallback(
    async (passcode: string) => {
      if (from && to) {
        await swap(
          new Coin(from, (Number(fromAmount) * 10 ** 6).toString()),
          new Coin(to, (Number(toAmount) * 10 ** 6).toString()),
          passcode
        )
      }
      Actions.pop()
    },
    [from, to, fromAmount, toAmount]
  )

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Typography type="H3">{t('exchange')}</Typography>
        <TouchableOpacity onPress={() => Actions.pop()}>
          <Icon name="x" size={theme.fonts.H3.fontSize} color={theme.palette.grey[10]} />
        </TouchableOpacity>
      </View>
      <AssetItem
        style={styles.from}
        asset={
          from
            ? {
                type: AssetTypes.Currents,
                coin: { denom: from, amount: (Number(fromAmount) * 10 ** 6).toString() },
              }
            : undefined
        }
        dropdown
        onPress={() => selectAsset('from')}
      />
      <View style={styles.centered}>
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor={theme.palette.grey[3]}
          onChangeText={(a) => changeAmount(a, 'from')}
          value={fromAmount}
        />
        <Typography>
          =
          {formatCurrency(baseCurrencyCoin.amount.toString(), baseCurrencyCoin.denom as Currencies)}{' '}
          {t(`${baseCurrencyCoin.denom} name`)}
        </Typography>
        <Icon name="arrow-down" size={theme.fonts.H1.fontSize} color={theme.palette.grey[10]} />
      </View>
      <AssetItem
        style={styles.to}
        asset={
          to
            ? {
                type: AssetTypes.Currents,
                coin: { denom: to, amount: (Number(toAmount) * 10 ** 6).toString() },
              }
            : undefined
        }
        dropdown
        onPress={() => selectAsset('to')}
      />
      <TextInput
        style={styles.input}
        placeholder="0"
        placeholderTextColor={theme.palette.grey[3]}
        onChangeText={(a) => changeAmount(a, 'to')}
        value={toAmount}
      />
      <Button
        style={styles.button}
        size="Large"
        onPress={() => Actions.Passcode({ onSubmit, title: t('please enter your passcode') })}
      >
        Confirm
      </Button>
    </ScrollView>
  )
}

export default Swap
