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
import { useLocalesContext } from '../../contexts/LocalesContext'
import { AvailableAsset } from '../../types/assets'
import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import RewardsItem from '../RewardsItem'
import BottomModal from '../BottomModal'

interface ConfirmClaimBorrowRewardsModalProps {
  open: boolean
  onClose(): void
  denom: MARKET_DENOMS
  availableAsset: AvailableAsset
  rewards: number
  apr: number
  onConfirm(): void
}

const ConfirmClaimBorrowRewardsModal: React.FC<ConfirmClaimBorrowRewardsModalProps> = ({
  open,
  onClose,
  denom,
  availableAsset,
  rewards,
  apr,
  onConfirm,
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { claimBorrowRewards } = useAssetsContext()
  const [fee, setFee] = React.useState<{ [denom: string]: { amount: number; denom: string } }>({})

  const estimateGasFee = React.useCallback(async () => {
    try {
      const tx = await claimBorrowRewards(denom, '', undefined, true)
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
  }, [claimBorrowRewards, denom])

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
        theme.baseSpace * 80 + Object.keys(fee).length * 2 * theme.baseSpace + theme.bottomSpace
      }
      onOpened={estimateGasFee}
    >
      <Typography style={styles.padded} type="Large" color={theme.palette.grey[7]}>
        {t('claim')}
      </Typography>
      <RewardsItem disabled availableAsset={availableAsset} rewards={rewards} apr={apr} />
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

export default ConfirmClaimBorrowRewardsModal
