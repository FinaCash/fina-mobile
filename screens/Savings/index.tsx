import React from 'react'
import { Image, TextInput, TouchableOpacity, View } from 'react-native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { Feather as Icon } from '@expo/vector-icons'
import Typography from '../../components/Typography'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { Asset, AssetTypes } from '../../types/assets'
import { Actions } from 'react-native-router-flux'
import AssetCard from '../../components/AssetCard'
import { Currencies } from '../../types/misc'
import { formatCurrency } from '../../utils/formatNumbers'
import { Coin } from '@terra-money/terra.js'
import terra from '../../utils/terraClient'
import Button from '../../components/Button'

interface SwapProps {
  type: 'deposit' | 'withdraw'
}

const Swap: React.FC<SwapProps> = ({ type }) => {
  const { styles, theme } = useStyles(getStyles)
  const { depositSavings, withdrawSavings } = useAssetsContext()
  const { currency } = useSettingsContext()
  const { t } = useTranslation()
  const { showActionSheetWithOptions } = useActionSheet()
  const [amount, setAmount] = React.useState('')

  const [baseCurrencyCoin, setBaseCurrencyCoin] = React.useState(new Coin(currency, '0'))

  const [loading, setLoading] = React.useState(false)

  const changeAmount = React.useCallback(
    async (a: string) => {
      try {
        setAmount(a)
        const newCoinAmount = (Number(a) * 10 ** 6).toString()
        const rate =
          Currencies.USD === currency
            ? new Coin(Currencies.USD, newCoinAmount)
            : await terra.market.swapRate(new Coin(Currencies.USD, newCoinAmount), currency)
        setBaseCurrencyCoin(rate)
      } catch (err) {
        setBaseCurrencyCoin(new Coin(currency, 0))
      }
    },
    [currency]
  )

  const submit = React.useCallback(async () => {
    try {
      setLoading(true)
      await (type === 'deposit' ? depositSavings : withdrawSavings)(Number(amount))
      Actions.pop()
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }, [type, depositSavings, withdrawSavings, amount])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography type="H3">{t('savings')}</Typography>
        <TouchableOpacity onPress={() => Actions.pop()}>
          <Icon name="x" size={theme.fonts.H3.fontSize} color={theme.palette.grey[10]} />
        </TouchableOpacity>
      </View>
      <AssetCard
        style={styles.from}
        asset={{
          type: type === 'deposit' ? AssetTypes.Currents : AssetTypes.Savings,
          coin: { denom: Currencies.USD, amount: (Number(amount) * 10 ** 6).toString() },
        }}
        dropdown
        onPress={() => null}
      />
      <View style={styles.centered}>
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor={theme.palette.grey[3]}
          onChangeText={changeAmount}
          value={amount}
        />
        <Typography>
          =
          {formatCurrency(baseCurrencyCoin.amount.toString(), baseCurrencyCoin.denom as Currencies)}{' '}
          {t(`${baseCurrencyCoin.denom} name`)}
        </Typography>
        <Icon name="arrow-down" size={theme.fonts.H1.fontSize} color={theme.palette.grey[10]} />
      </View>
      <AssetCard
        style={styles.to}
        asset={{
          type: type === 'withdraw' ? AssetTypes.Currents : AssetTypes.Savings,
          coin: { denom: Currencies.USD, amount: (Number(amount) * 10 ** 6).toString() },
        }}
        dropdown
        onPress={() => null}
      />
      <TextInput
        style={styles.input}
        placeholder="0"
        placeholderTextColor={theme.palette.grey[3]}
        value={amount}
      />
      <Button style={styles.button} size="Large" onPress={submit} loading={loading}>
        Confirm
      </Button>
    </View>
  )
}

export default Swap
