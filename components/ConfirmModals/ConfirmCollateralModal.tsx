import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import keyBy from 'lodash/keyBy'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Typography from '../Typography'
import Button from '../Button'
import { formatCurrency } from '../../utils/formatNumbers'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { Tx } from '@terra-money/terra.js'
import { getSymbolFromDenom } from '../../utils/transformAssets'
import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { AvailableAsset } from '../../types/assets'
import AvailableAssetItem from '../AvailableAssetItem'
import BottomModal from '../BottomModal'

interface ConfirmCollateralModalProps {
  open: boolean
  onClose(): void
  mode: 'provide' | 'withdraw'
  denom: MARKET_DENOMS
  amount: number
  availableAsset: AvailableAsset
  onConfirm(): void
}

const ConfirmCollateralModal: React.FC<ConfirmCollateralModalProps> = ({
  open,
  onClose,
  mode,
  denom,
  amount,
  availableAsset,
  onConfirm,
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { provideCollateral, withdrawCollateral } = useAssetsContext()
  const [fee, setFee] = React.useState<{ [denom: string]: { amount: number; denom: string } }>({})

  const estimateGasFee = React.useCallback(async () => {
    try {
      const tx = await (mode === 'provide' ? provideCollateral : withdrawCollateral)(
        denom,
        availableAsset.symbol,
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
  }, [denom, amount, provideCollateral, withdrawCollateral, mode, availableAsset])

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
        theme.baseSpace * 70 + Object.keys(fee).length * 2 * theme.baseSpace + theme.bottomSpace
      }
      onOpened={estimateGasFee}
    >
      <Typography style={styles.padded} type="Large" color={theme.palette.grey[7]}>
        {t(mode + ' collateral')}
      </Typography>
      <AvailableAssetItem disabled availableAsset={availableAsset} amount={amount} />
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
      <Button style={styles.modalButton} size="Large" onPress={onConfirm}>
        {t('confirm')}
      </Button>
    </BottomModal>
  )
}

export default ConfirmCollateralModal
