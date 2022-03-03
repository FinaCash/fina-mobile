import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import keyBy from 'lodash/keyBy'
import cloneDeep from 'lodash/cloneDeep'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Typography from '../Typography'
import Button from '../Button'
import AssetItem from '../AssetItem'
import { formatCurrency } from '../../utils/formatNumbers'
import { Asset } from '../../types/assets'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { Tx } from '@terra-money/terra.js'
import { getSymbolFromDenom } from '../../utils/transformAssets'
import { useLocalesContext } from '../../contexts/LocalesContext'
import BottomModal from '../BottomModal'

interface ConfirmSwapModalProps {
  open: boolean
  onClose(): void
  from: Asset
  to: Asset
  onConfirm(): void
}

const ConfirmSwapModal: React.FC<ConfirmSwapModalProps> = ({
  open,
  onClose,
  from,
  to,
  onConfirm,
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { swap } = useAssetsContext()
  const [fee, setFee] = React.useState<{ [denom: string]: { amount: number; denom: string } }>({})
  const total = React.useMemo(() => {
    const result = cloneDeep(fee)
    if (result[from.coin.denom]) {
      result[from.coin.denom].amount += Number(from.coin.amount) / 10 ** 6
    } else {
      result[from.coin.denom] = {
        denom: from.coin.denom,
        amount: Number(from.coin.amount) / 10 ** 6,
      }
    }
    return result
  }, [fee, from])

  const estimateGasFee = React.useCallback(async () => {
    try {
      const tx = await swap(
        { denom: from.coin.denom, amount: Number(from.coin.amount) / 10 ** 6 },
        to.coin.denom,
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
  }, [from, to, swap])

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
        theme.baseSpace * 108 +
        Object.keys(fee).length * 2 * theme.baseSpace +
        Object.keys(total).length * 2 * theme.baseSpace +
        theme.bottomSpace
      }
      onOpened={estimateGasFee}
    >
      <Typography style={styles.padded} type="Large" color={theme.palette.grey[7]}>
        {t('from')}
      </Typography>
      <AssetItem disabled asset={from} hideApr />
      <Typography style={styles.padded} type="Large" color={theme.palette.grey[7]}>
        {t('to')}
      </Typography>
      <AssetItem disabled asset={to} hideApr />
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

export default ConfirmSwapModal
