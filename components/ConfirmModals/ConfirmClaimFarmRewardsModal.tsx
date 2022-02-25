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
import { getSymbolFromDenom, getTokenAssetDetail } from '../../utils/transformAssets'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { Farm } from '../../types/assets'
import BottomModal from '../BottomModal'
import AssetItem from '../AssetItem'

interface ConfirmClaimFarmRewardsModalProps {
  open: boolean
  onClose(): void
  farms: Farm[]
  onConfirm(): void
}

const ConfirmClaimFarmRewardsModal: React.FC<ConfirmClaimFarmRewardsModalProps> = ({
  open,
  onClose,
  farms,
  onConfirm,
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { claimFarmRewards, availableAssets } = useAssetsContext()
  const [fee, setFee] = React.useState<{ [denom: string]: { amount: number; denom: string } }>({})

  const estimateGasFee = React.useCallback(async () => {
    try {
      const tx = await claimFarmRewards(farms, '', undefined, true)
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
  }, [claimFarmRewards, farms])

  React.useEffect(() => {
    if (!open) {
      setFee({})
    }
  }, [open])

  const totalRewardTokens = React.useMemo(() => {
    const tokens: { [denom: string]: number } = {}
    farms.forEach((farm) =>
      farm.rewards.forEach((r) => {
        if (tokens[r.denom]) {
          tokens[r.denom] += r.amount
        } else {
          tokens[r.denom] = r.amount
        }
      })
    )
    return Object.keys(tokens).map((denom) => ({ denom, amount: tokens[denom] }))
  }, [farms])

  return (
    <BottomModal
      title={t('confirm transacrtion')}
      open={open}
      onClose={onClose}
      modalHeight={
        theme.baseSpace * 48 +
        theme.baseSpace * 18 * totalRewardTokens.length +
        Object.keys(fee).length * 2 * theme.baseSpace +
        theme.bottomSpace
      }
      onOpened={estimateGasFee}
    >
      <Typography style={styles.padded} type="Large" color={theme.palette.grey[7]}>
        {t('claim')}
      </Typography>
      {totalRewardTokens.map((reward) => (
        <AssetItem
          key={reward.denom}
          disabled
          asset={
            getTokenAssetDetail(
              { denom: reward.denom, amount: String(reward.amount) },
              availableAssets
            )!
          }
        />
      ))}
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
    </BottomModal>
  )
}

export default ConfirmClaimFarmRewardsModal
