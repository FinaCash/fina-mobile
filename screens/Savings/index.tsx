import React from 'react'
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import get from 'lodash/get'
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
import { terraLCDClient as terra, anchorConfig } from '../../utils/terraConfig'
import Button from '../../components/Button'
import { AnchorEarn, CHAINS, DENOMS, NETWORKS } from '@anchor-protocol/anchor-earn'

interface SavingsProps {
  type: 'deposit' | 'withdraw'
}

const Savings: React.FC<SavingsProps> = ({ type }) => {
  const { styles, theme } = useStyles(getStyles)
  const { address, depositSavings, withdrawSavings } = useAssetsContext()
  const { currency } = useSettingsContext()
  const { t } = useTranslation()
  const [amount, setAmount] = React.useState('')
  const [apy, setApy] = React.useState(0)

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

  const onSubmit = React.useCallback(
    async (passcode: string) => {
      try {
        setLoading(true)
        await (type === 'deposit' ? depositSavings : withdrawSavings)(Number(amount), passcode)
        Actions.pop()
      } catch (err) {
        console.log(err)
        setLoading(false)
      }
    },
    [type, depositSavings, withdrawSavings, amount]
  )

  const fetchApy = React.useCallback(async () => {
    try {
      const anchorEarn = new AnchorEarn({
        ...anchorConfig,
        address,
      })
      const market = await anchorEarn.market({
        currencies: [DENOMS.UST],
      })
      setApy(Number(get(market, 'markets[0].APY', 0)))
    } catch (err) {
      console.log(err)
    }
  }, [setApy])

  React.useEffect(() => {
    fetchApy()
  }, [])

  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
      <View style={styles.header}>
        <Typography type="H3">{t('savings')}</Typography>
        <TouchableOpacity onPress={() => Actions.pop()}>
          <Icon name="x" size={theme.fonts.H3.fontSize} color={theme.palette.grey[10]} />
        </TouchableOpacity>
      </View>
      <AssetItem
        style={styles.from}
        asset={{
          type: type === 'deposit' ? AssetTypes.Currents : AssetTypes.Savings,
          coin: { denom: Currencies.USD, amount: (Number(amount) * 10 ** 6).toString() },
          apy: type === 'deposit' ? undefined : apy,
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
      <AssetItem
        style={styles.to}
        asset={{
          type: type === 'withdraw' ? AssetTypes.Currents : AssetTypes.Savings,
          coin: { denom: Currencies.USD, amount: (Number(amount) * 10 ** 6).toString() },
          apy: type === 'withdraw' ? undefined : apy,
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
      <Button
        style={styles.button}
        size="Large"
        onPress={() => Actions.Passcode({ title: t('please enter your passcode'), onSubmit })}
        loading={loading}
      >
        Confirm
      </Button>
    </ScrollView>
  )
}

export default Savings
