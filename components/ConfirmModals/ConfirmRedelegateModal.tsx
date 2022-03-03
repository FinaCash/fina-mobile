import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import keyBy from 'lodash/keyBy'
import cloneDeep from 'lodash/cloneDeep'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Typography from '../Typography'
import Button from '../Button'
import { formatCurrency } from '../../utils/formatNumbers'
import { Validator } from '../../types/assets'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { Tx } from '@terra-money/terra.js'
import { getSymbolFromDenom } from '../../utils/transformAssets'
import { useLocalesContext } from '../../contexts/LocalesContext'
import StakingItem from '../StakingItem'
import BottomModal from '../BottomModal'

interface ConfirmRedelegateModalProps {
  open: boolean
  onClose(): void
  amount: number
  fromValidator: Validator
  toValidator: Validator
  onConfirm(): void
}

const ConfirmRedelegateModal: React.FC<ConfirmRedelegateModalProps> = ({
  open,
  onClose,
  amount,
  fromValidator,
  toValidator,
  onConfirm,
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { redelegate, availableAssets } = useAssetsContext()
  const luna = availableAssets.find((a) => a.coin.denom === 'uluna')!
  const [fee, setFee] = React.useState<{ [denom: string]: { amount: number; denom: string } }>({})
  const total = React.useMemo(() => {
    const result = cloneDeep(fee)
    return result
  }, [fee])

  const estimateGasFee = React.useCallback(async () => {
    try {
      const tx = await redelegate(
        { denom: 'uluna', amount },
        fromValidator.address,
        toValidator.address,
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
  }, [redelegate, amount, fromValidator, toValidator])

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
        theme.baseSpace * 80 +
        Object.keys(fee).length * 2 * theme.baseSpace +
        Object.keys(total).length * 2 * theme.baseSpace +
        theme.bottomSpace
      }
      onOpened={estimateGasFee}
    >
      <Typography style={styles.padded} type="Large" color={theme.palette.grey[7]}>
        {t('redelegate')}
      </Typography>
      <StakingItem
        validator={fromValidator}
        toValidator={toValidator}
        amount={amount * 10 ** 6}
        symbol={luna.symbol}
        price={luna.price}
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

export default ConfirmRedelegateModal
