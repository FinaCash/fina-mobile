import React from 'react'
import { Modalize } from 'react-native-modalize'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
import keyBy from 'lodash/keyBy'
import CloseIcon from '../../assets/images/icons/close.svg'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Typography from '../Typography'
import Button from '../Button'
import { formatCurrency } from '../../utils/formatNumbers'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { StdSignMsg } from '@terra-money/terra.js'
import { getSymbolFromDenom } from '../../utils/transformAssets'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { AvailableAsset } from '../../types/assets'
import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import RewardsItem from '../RewardsItem'

interface ConfirmClaimRewardsModalProps {
  open: boolean
  onClose(): void
  denom: MARKET_DENOMS
  availableAsset: AvailableAsset
  rewards: number
  apr: number
  onConfirm(): void
}

const ConfirmClaimRewardsModal: React.FC<ConfirmClaimRewardsModalProps> = ({
  open,
  onClose,
  denom,
  availableAsset,
  rewards,
  apr,
  onConfirm,
}) => {
  const modalizeRef = React.useRef<Modalize>(null)
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { claimBorrowRewards } = useAssetsContext()
  const [fee, setFee] = React.useState<{ [denom: string]: { amount: number; denom: string } }>({})

  const estimateGasFee = React.useCallback(async () => {
    try {
      const tx = await claimBorrowRewards(denom, '', true)
      setFee(
        keyBy(
          JSON.parse((tx as unknown as StdSignMsg).fee.amount.toJSON()).map((f: any) => ({
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
    if (open) {
      modalizeRef.current?.open()
    } else {
      modalizeRef.current?.close()
      setFee({})
    }
  }, [open])

  return (
    <Modalize
      ref={modalizeRef}
      modalStyle={styles.modal}
      withHandle={false}
      scrollViewProps={{ scrollEnabled: false }}
      modalHeight={
        theme.baseSpace * 80 + Object.keys(fee).length * 2 * theme.baseSpace + theme.bottomSpace
      }
      onClosed={onClose}
      onOpened={estimateGasFee}
    >
      <View style={styles.confirmHeader}>
        <Typography type="H6">{t('confirm transacrtion')}</Typography>
        <TouchableOpacity onPress={onClose}>
          <CloseIcon fill={theme.palette.grey[9]} />
        </TouchableOpacity>
      </View>
      <Typography style={styles.padded} type="Large" color={theme.palette.grey[7]}>
        {t('claim')}
      </Typography>
      <RewardsItem availableAsset={availableAsset} rewards={rewards} apr={apr} />
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
            <ActivityIndicator size="small" />
          )}
        </View>
      </View>
      <Button style={styles.modalButton} size="Large" onPress={onConfirm}>
        {t('confirm')}
      </Button>
    </Modalize>
  )
}

export default ConfirmClaimRewardsModal
