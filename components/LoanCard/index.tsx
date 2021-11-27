import React from 'react'
import { TouchableOpacity, View, Alert, Platform } from 'react-native'
import Slider from '@ptomasroos/react-native-multi-slider'
import { LinearGradient } from 'expo-linear-gradient'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Typography from '../../components/Typography'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { formatCurrency, formatPercentage } from '../../utils/formatNumbers'
import { useAssetsContext } from '../../contexts/AssetsContext'
import Input, { InputProps } from '../Input'
import { useSettingsContext } from '../../contexts/SettingsContext'
import { getSymbolFromDenom } from '../../utils/transformAssets'
import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'

type LoanCardProps =
  | {
      withInput: true
      denom: MARKET_DENOMS
      amount: string
      setAmount: React.Dispatch<React.SetStateAction<string>>
      mode: 'borrow' | 'repay'
      inputProps?: InputProps
    }
  | {
      withInput?: false
      denom: MARKET_DENOMS
      amount?: string
      setAmount?: React.Dispatch<React.SetStateAction<string>>
      inputProps?: InputProps
      mode?: 'borrow' | 'repay'
    }

const LoanCard: React.FC<LoanCardProps> = ({
  withInput,
  inputProps = {},
  amount,
  setAmount,
  denom,
  mode,
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { borrowInfo } = useAssetsContext()
  const { currency, currencyRate } = useSettingsContext()

  const [reload, setReload] = React.useState(false)

  React.useEffect(() => {
    if (reload) {
      setReload(false)
    }
  }, [reload])

  const netApr = borrowInfo.rewardsRate - borrowInfo.borrowRate
  const ltv =
    (borrowInfo.borrowedValue + (mode === 'borrow' ? 1 : -1) * (Number(amount) || 0)) /
    (borrowInfo.collateralValue || 1)

  const innerBarStyle = {
    backgroundColor: theme.palette.green,
    width: formatPercentage(ltv / 0.6, 2),
  }
  if (ltv > 0.45) {
    innerBarStyle.backgroundColor = theme.palette.yellow
  }
  if (ltv > 0.5) {
    innerBarStyle.backgroundColor = theme.palette.red
  }

  const originalLtv = borrowInfo.borrowedValue / borrowInfo.borrowLimit
  const min = mode === 'borrow' ? originalLtv : 0
  const max = mode === 'borrow' ? 0.5 / 0.6 : originalLtv
  const minValue =
    (mode === 'borrow' ? 1 : -1) *
    Number(
      ((mode === 'borrow' ? min : max) * borrowInfo.borrowLimit - borrowInfo.borrowedValue).toFixed(
        2
      )
    )
  const maxValue =
    (mode === 'borrow' ? 1 : -1) *
    Number(
      ((mode === 'borrow' ? max : min) * borrowInfo.borrowLimit - borrowInfo.borrowedValue).toFixed(
        2
      )
    )

  return (
    <>
      <LinearGradient
        start={[0, 0]}
        end={[1, 2.4]}
        colors={theme.gradients.primary}
        style={styles.top}
      >
        <View>
          <Typography color={theme.palette.white} type="H4">
            {formatCurrency(borrowInfo.collateralValue * 10 ** 6, 'uusd', true)}
          </Typography>
          <Typography color={theme.palette.white} type="Small">
            {t('collateral value')}
          </Typography>
        </View>
        <View>
          <Typography color={theme.palette.white} type="H4">
            {formatCurrency(borrowInfo.borrowedValue * 10 ** 6, 'uusd', true)}
          </Typography>
          <Typography color={theme.palette.white} type="Small">
            {t('borrowed value')}
          </Typography>
        </View>
      </LinearGradient>
      <View style={styles.card}>
        <View style={styles.statRow}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                t('net APR'),
                t('borrow APR calculation', {
                  rewardsRate: formatPercentage(borrowInfo.rewardsRate, 2),
                  borrowRate: formatPercentage(borrowInfo.borrowRate, 2),
                  netApr: formatPercentage(netApr, 2),
                })
              )
            }}
          >
            <Typography color={netApr > 0 ? theme.palette.green : theme.palette.red} type="H3" bold>
              {formatPercentage(netApr, 2)}
            </Typography>
            <Typography type="Small" color={theme.palette.grey[7]}>
              {t('net APR')} ⓘ
            </Typography>
          </TouchableOpacity>
          <View>
            <Typography type="Large">
              {formatCurrency(borrowInfo.borrowLimit * 10 ** 6, denom, true)}
            </Typography>
            <Typography type="Small" color={theme.palette.grey[7]}>
              {t('borrow limit')}
            </Typography>
          </View>
        </View>
        <View style={withInput ? styles.padded : {}}>
          <View style={styles.flexEndRow}>
            <View style={[styles.myLtv, { right: formatPercentage(1 - ltv / 0.6, 2) }]}>
              <Typography
                style={ltv < 0.06 ? { marginRight: theme.baseSpace * -8 } : {}}
                type="Small"
                bold
              >
                {formatPercentage(ltv, 2)}
              </Typography>
              {withInput ? null : <View style={styles.shortVertDivider} />}
            </View>
          </View>
          {withInput && !reload ? (
            <Slider
              min={0}
              max={1}
              sliderLength={theme.screenWidth - 24 * theme.baseSpace}
              step={0.001 / 0.6}
              values={[ltv / 0.6]}
              selectedStyle={{ backgroundColor: innerBarStyle.backgroundColor }}
              unselectedStyle={{ backgroundColor: theme.palette.grey[1] }}
              onValuesChange={(v) => {
                const result =
                  (mode === 'borrow' ? 1 : -1) *
                  (borrowInfo.borrowLimit * Math.max(min, Math.min(v[0], max)) -
                    borrowInfo.borrowedValue)
                setAmount!(result > 0.005 ? result.toFixed(2) : '')
                if (v[0] > max || v[0] < min) {
                  setReload(true)
                }
              }}
            />
          ) : (
            <View style={styles.outerBar}>
              <View style={[styles.innerBar, innerBarStyle]} />
            </View>
          )}
        </View>

        <View style={styles.spacedRow}>
          <Typography type="Small" color={theme.palette.grey[7]}>
            {t('LTV')}
          </Typography>
          <View style={styles.recommendedLtv}>
            <View style={styles.vertDivider} />
            <Typography type="Small">{t('recommended ltv')}</Typography>
          </View>
          <View>
            <View style={styles.vertDivider} />
            <Typography type="Small">{t('max ltv')}</Typography>
          </View>
        </View>
        {withInput ? (
          <View style={styles.amountContainer}>
            <Typography type="Large" bold>
              {t('amount')}
            </Typography>
            <Input
              style={styles.amountInput}
              placeholder="0"
              size="Large"
              keyboardType="numeric"
              value={amount}
              onChangeText={(a) => {
                if (Number(a) === NaN) {
                  return
                }
                if (Number(a) > maxValue) {
                  setAmount!(maxValue.toFixed(2))
                } else if (Number(a) < minValue) {
                  setAmount!(minValue.toFixed(2))
                } else {
                  setAmount!(a)
                }
              }}
              endAdornment={
                <View style={styles.row}>
                  <Typography bold>{getSymbolFromDenom(denom)}</Typography>
                  <View style={styles.verticalDivider} />
                  <TouchableOpacity onPress={() => setAmount!(maxValue.toFixed(2))}>
                    <Typography bold color={theme.palette.secondary}>
                      {t('max')}
                    </Typography>
                  </TouchableOpacity>
                </View>
              }
              {...inputProps}
            />
            <Typography color={theme.palette.grey[7]} type="Small">
              ~{formatCurrency(Number(amount) * 10 ** 6 * currencyRate, currency, true)}
            </Typography>
          </View>
        ) : null}
      </View>
    </>
  )
}

export default LoanCard
