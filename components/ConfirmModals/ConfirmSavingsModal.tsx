import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import keyBy from 'lodash/keyBy'
import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Typography from '../Typography'
import Button from '../Button'
import AssetItem from '../AssetItem'
import { formatCurrency } from '../../utils/formatNumbers'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { Tx } from '@terra-money/terra.js'
import {
  getCurrentAssetDetail,
  getSavingAssetDetail,
  getSymbolFromDenom,
} from '../../utils/transformAssets'
import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import { useLocalesContext } from '../../contexts/LocalesContext'
import BottomModal from '../BottomModal'

interface ConfirmSavingsModalProps {
  open: boolean
  onClose(): void
  mode: 'deposit' | 'withdraw'
  denom: MARKET_DENOMS
  amount: number
  apr: number
  onConfirm(): void
}

const ConfirmSavingsModal: React.FC<ConfirmSavingsModalProps> = ({
  open,
  onClose,
  mode,
  denom,
  amount,
  apr,
  onConfirm,
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { depositSavings, withdrawSavings, availableCurrencies } = useAssetsContext()
  const currencyRate = availableCurrencies.find((c) => c.denom === denom)
  const aTerraRate = availableCurrencies.find((c) => c.denom === `a${denom.slice(-3)}`)
  const [fee, setFee] = React.useState<{ [denom: string]: { amount: number; denom: string } }>({})
  const total = React.useMemo(() => {
    const result = cloneDeep(fee)
    const coin =
      mode === 'deposit'
        ? { amount, denom }
        : {
            amount: amount / get(aTerraRate, 'price', 1),
            denom: `a${getSymbolFromDenom(denom)}`,
          }
    if (result[coin.denom]) {
      result[coin.denom].amount += coin.amount
    } else {
      result[coin.denom] = coin
    }
    return result
  }, [fee, denom, amount, aTerraRate, mode])

  const estimateGasFee = React.useCallback(async () => {
    try {
      const tx = await (mode === 'deposit' ? depositSavings : withdrawSavings)(
        denom,
        amount,
        '',
        undefined,
        true
      )
      setFee(
        keyBy(
          JSON.parse((tx as unknown as Tx).auth_info.fee.amount.toJSON()).map((f: any) => ({
            ...f,
            amount: Number(f.amount) / 10 ** 6,
          })),
          'denom'
        )
      )
    } catch (err: any) {
      console.log(err)
    }
  }, [denom, amount, depositSavings, withdrawSavings, mode])

  React.useEffect(() => {
    if (!open) {
      setFee({})
    }
  }, [open])

  return (
    <BottomModal
      title={t('confirm transacrtion')}
      open={open}
      onClose={onClose}
      modalHeight={
        theme.baseSpace * 120 +
        Object.keys(fee).length * 2 * theme.baseSpace +
        Object.keys(total).length * 2 * theme.baseSpace +
        theme.bottomSpace
      }
      onOpened={estimateGasFee}
    >
      <Typography style={styles.padded} type="Large" color={theme.palette.grey[7]}>
        {t('from')}
      </Typography>
      <AssetItem
        disabled
        asset={(mode === 'deposit' ? getCurrentAssetDetail : getSavingAssetDetail)(
          {
            denom: mode === 'deposit' ? denom : `a${denom.slice(1)}`,
            amount: String(
              (amount * 10 ** 6) / (mode === 'deposit' ? 1 : get(aTerraRate, 'price', 1))
            ),
            apr,
          },
          mode === 'deposit' ? get(currencyRate, 'price', 1) : get(aTerraRate, 'price', 1)
        )}
      />
      <Typography style={styles.padded} type="Large" color={theme.palette.grey[7]}>
        {t('to')}
      </Typography>
      <AssetItem
        disabled
        asset={(mode === 'withdraw' ? getCurrentAssetDetail : getSavingAssetDetail)(
          {
            denom: mode === 'withdraw' ? denom : `a${denom.slice(1)}`,
            amount: String(
              (amount * 10 ** 6) / (mode === 'withdraw' ? 1 : aTerraRate ? aTerraRate.price : 1)
            ),
            apr,
          },
          mode === 'withdraw' ? get(currencyRate, 'price', 1) : get(aTerraRate, 'price', 1)
        )}
      />
      <View style={[styles.confirmMiodalRow, styles.borderBottom]}>
        <Typography type="Large" color={theme.palette.grey[7]}>
          {t('transaction fee')}
        </Typography>
        <View style={styles.alignRight}>
          {Object.keys(fee).length ? (
            Object.values(fee).map((f) => (
              <Typography key={f.denom} type="Large">
                {formatCurrency(f.amount * 10 ** 6, '')} {getSymbolFromDenom(f.denom)}
              </Typography>
            ))
          ) : (
            <ActivityIndicator size="small" color={theme.fonts.H1.color} />
          )}
        </View>
      </View>
      <View style={styles.confirmMiodalRow}>
        <Typography type="H6">{t('total')}</Typography>
        <View style={styles.alignRight}>
          {Object.values(total).map((f) => (
            <Typography key={f.denom} type="H6">
              {formatCurrency(f.amount * 10 ** 6, '')} {getSymbolFromDenom(f.denom)}
            </Typography>
          ))}
        </View>
      </View>
      <Button style={styles.modalButton} size="Large" onPress={onConfirm}>
        {t('confirm')}
      </Button>
    </BottomModal>
  )
}

export default ConfirmSavingsModal
