import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import keyBy from 'lodash/keyBy'
import cloneDeep from 'lodash/cloneDeep'
import { Feather as Icon } from '@expo/vector-icons'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import Typography from '../Typography'
import Button from '../Button'
import AssetItem from '../AssetItem'
import { formatCurrency } from '../../utils/formatNumbers'
import { Asset, Farm } from '../../types/assets'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { Tx } from '@terra-money/terra.js'
import {
  getCurrentAssetDetail,
  getMAssetDetail,
  getSymbolFromDenom,
  getTokenAssetDetail,
} from '../../utils/transformAssets'
import { useLocalesContext } from '../../contexts/LocalesContext'
import BottomModal from '../BottomModal'

interface ConfirmProvideLiquidityModalProps {
  open: boolean
  onClose(): void
  farm: Farm
  amount: number
  ustAmount: number
  onConfirm(): void
}

const ConfirmProvideLiquidityModal: React.FC<ConfirmProvideLiquidityModalProps> = ({
  open,
  onClose,
  farm,
  amount,
  ustAmount,
  onConfirm,
}) => {
  const { styles, theme } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { provideLiquidity, availableAssets } = useAssetsContext()

  const asset =
    getMAssetDetail({ denom: farm.symbol, amount: String(amount * 10 ** 6) }, availableAssets) ||
    getTokenAssetDetail(
      { denom: farm.symbol === 'LUNA' ? 'uluna' : farm.symbol, amount: String(amount * 10 ** 6) },
      availableAssets
    ) ||
    undefined

  const ustAsset =
    getCurrentAssetDetail({ denom: 'uusd', amount: String(ustAmount * 10 ** 6) }, 1) || undefined

  const [fee, setFee] = React.useState<{ [denom: string]: { amount: number; denom: string } }>({})
  const total = React.useMemo(() => {
    const result = cloneDeep(fee)
    if (asset) {
      if (result[asset.coin.denom]) {
        result[asset.coin.denom].amount += Number(asset.coin.amount) / 10 ** 6
      } else {
        result[asset.coin.denom] = {
          denom: asset.coin.denom,
          amount: Number(asset.coin.amount) / 10 ** 6,
        }
      }

      if (result[ustAsset.coin.denom]) {
        result[ustAsset.coin.denom].amount += Number(ustAsset.coin.amount) / 10 ** 6
      } else {
        result[ustAsset.coin.denom] = {
          denom: ustAsset.coin.denom,
          amount: Number(ustAsset.coin.amount) / 10 ** 6,
        }
      }
    }
    return result
  }, [fee, asset, ustAsset])

  const estimateGasFee = React.useCallback(async () => {
    try {
      const tx = await provideLiquidity(farm, amount, ustAmount, '', undefined, true)
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
  }, [farm, amount, ustAmount, provideLiquidity])

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
        theme.baseSpace * 114 +
        Object.keys(fee).length * 2 * theme.baseSpace +
        Object.keys(total).length * 2 * theme.baseSpace +
        theme.bottomSpace
      }
      onOpened={estimateGasFee}
    >
      <Typography style={styles.padded} type="Large" color={theme.palette.grey[7]}>
        {t('provide liquidity')}
      </Typography>
      <AssetItem disabled asset={asset} hideApr hideBorder />
      <Icon
        name="plus"
        size={theme.baseSpace * 8}
        color={theme.fonts.H6.color}
        style={styles.arrow}
      />
      <AssetItem disabled asset={ustAsset} hideApr />
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

export default ConfirmProvideLiquidityModal
