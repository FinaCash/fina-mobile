import React from 'react'
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import Typography from '../../components/Typography'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { useSettingsContext } from '../../contexts/SettingsContext'
import useTranslation from '../../locales/useTranslation'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { Actions } from 'react-native-router-flux'
import AssetItem from '../../components/AssetItem'
import { formatCurrency } from '../../utils/formatNumbers'
import { Coin } from '@terra-money/terra.js'
import { anchorClient, terraLCDClient as terra } from '../../utils/terraConfig'
import Button from '../../components/Button'
import {
  getCurrencyFromDenom,
  getCurrentAssetDetail,
  getSavingAssetDetail,
} from '../../utils/transformAssets'

interface SavingsProps {
  mode: 'deposit' | 'withdraw'
}

const Savings: React.FC<SavingsProps> = ({ mode }) => {
  const { styles, theme } = useStyles(getStyles)
  const { address, depositSavings, withdrawSavings } = useAssetsContext()
  const { currency } = useSettingsContext()
  const { t } = useTranslation()
  const [amount, setAmount] = React.useState('')
  const [apr, setApr] = React.useState(0)

  const [baseCurrencyCoin, setBaseCurrencyCoin] = React.useState(new Coin(currency, '0'))

  const [loading, setLoading] = React.useState(false)

  const changeAmount = React.useCallback(
    async (a: string) => {
      try {
        setAmount(a)
        const newCoinAmount = (Number(a) * 10 ** 6).toString()
        const rate =
          currency === 'uusd'
            ? new Coin('uusd', newCoinAmount)
            : await terra.market.swapRate(new Coin('uusd', newCoinAmount), currency)
        setBaseCurrencyCoin(rate)
      } catch (err) {
        setBaseCurrencyCoin(new Coin(currency, 0))
      }
    },
    [currency]
  )

  const onSubmit = React.useCallback(
    async (password: string) => {
      try {
        setLoading(true)
        await (mode === 'deposit' ? depositSavings : withdrawSavings)(
          MARKET_DENOMS.UUSD,
          Number(amount),
          password
        )
        Actions.pop()
      } catch (err) {
        console.log(err)
        setLoading(false)
      }
    },
    [mode, depositSavings, withdrawSavings, amount]
  )

  const fetchApr = React.useCallback(async () => {
    try {
      const rate = await anchorClient.earn.getAPY({
        market: MARKET_DENOMS.UUSD,
      })
      setApr(rate)
    } catch (err) {
      console.log(err)
    }
  }, [setApr])

  React.useEffect(() => {
    fetchApr()
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
        asset={(mode === 'deposit' ? getCurrentAssetDetail : getSavingAssetDetail)({
          denom: 'uusd',
          amount: (Number(amount) * 10 ** 6).toString(),
          apr,
        })}
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
          ={formatCurrency(baseCurrencyCoin.amount.toString(), baseCurrencyCoin.denom)}{' '}
          {getCurrencyFromDenom(baseCurrencyCoin.denom)}
        </Typography>
        <Icon name="arrow-down" size={theme.fonts.H1.fontSize} color={theme.palette.grey[10]} />
      </View>
      <AssetItem
        style={styles.to}
        asset={(mode === 'withdraw' ? getCurrentAssetDetail : getSavingAssetDetail)({
          denom: 'uusd',
          amount: (Number(amount) * 10 ** 6).toString(),
          apr,
        })}
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
        onPress={() => Actions.Password({ title: t('please enter your password'), onSubmit })}
        loading={loading}
      >
        Confirm
      </Button>
    </ScrollView>
  )
}

export default Savings
