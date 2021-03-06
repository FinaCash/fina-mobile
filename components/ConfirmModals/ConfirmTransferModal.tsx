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
import { useRecipientsContext } from '../../contexts/RecipientsContext'
import { useLocalesContext } from '../../contexts/LocalesContext'
import BottomModal from '../BottomModal'

interface ConfirmTransferModalProps {
  open: boolean
  onClose(): void
  asset: Asset
  amount: number
  address: string
  memo: string
  onConfirm(): void
}

const ConfirmTransferModal: React.FC<ConfirmTransferModalProps> = ({
  open,
  onClose,
  asset,
  amount,
  address,
  memo,
  onConfirm,
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { send } = useAssetsContext()
  const { recipients } = useRecipientsContext()
  const recipient = recipients.find((r) => r.address === address)
  const [fee, setFee] = React.useState<{ [denom: string]: { amount: number; denom: string } }>({})
  const total = React.useMemo(() => {
    const result = cloneDeep(fee)
    if (result[asset.coin.denom]) {
      result[asset.coin.denom].amount += amount
    } else {
      result[asset.coin.denom] = {
        denom: asset.coin.denom,
        amount,
      }
    }
    return result
  }, [fee, asset, amount])

  const estimateGasFee = React.useCallback(async () => {
    try {
      const tx = await send({ denom: asset.coin.denom, amount }, address, memo, '', undefined, true)
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
  }, [asset, amount, address, memo, send])

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
        theme.baseSpace * 112 +
        Object.keys(fee).length * 2 * theme.baseSpace +
        Object.keys(total).length * 2 * theme.baseSpace +
        theme.bottomSpace
      }
      onOpened={estimateGasFee}
    >
      <AssetItem disabled asset={asset} hideAmount hideApr />
      <View style={[styles.confirmMiodalRow, styles.borderBottom]}>
        <Typography type="Large" color={theme.palette.grey[7]}>
          {t('amount')}
        </Typography>
        <Typography type="Large">
          {formatCurrency(amount * 10 ** 6, '')} {asset.symbol}
        </Typography>
      </View>
      <View style={[styles.confirmMiodalRow, styles.borderBottom]}>
        <Typography type="Large" color={theme.palette.grey[7]}>
          {t('to')}
        </Typography>
        <View style={styles.alignRight}>
          <Typography type="Large" style={styles.marginBottom}>
            {recipient ? recipient.name : t('new address')}
          </Typography>
          <Typography type="Small" color={theme.palette.grey[7]}>
            {address}
          </Typography>
        </View>
      </View>
      <View style={[styles.confirmMiodalRow, styles.borderBottom]}>
        <Typography type="Large" color={theme.palette.grey[7]}>
          {t('memo')}
        </Typography>
        <Typography type="Large">{memo}</Typography>
      </View>
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

export default ConfirmTransferModal
