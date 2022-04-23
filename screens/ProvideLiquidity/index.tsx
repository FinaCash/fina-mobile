import React from 'react'
import { Keyboard, KeyboardAvoidingView, View } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import { useAssetsContext } from '../../contexts/AssetsContext'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { Actions } from 'react-native-router-flux'
import { anchorClient } from '../../utils/terraConfig'
import Button from '../../components/Button'
import {
  getCurrentAssetDetail,
  getMAssetDetail,
  getSavingAssetDetail,
  getTokenAssetDetail,
} from '../../utils/transformAssets'
import HeaderBar from '../../components/HeaderBar'
import AssetAmountInput from '../../components/AssetAmountInput'
import ConfirmSavingsModal from '../../components/ConfirmModals/ConfirmSavingsModal'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { useAccountsContext } from '../../contexts/AccountsContext'
import { getPasswordOrLedgerApp } from '../../utils/signAndBroadcastTx'
import TerraApp from '@terra-money/ledger-terra-js'
import cloneDeep from 'lodash/cloneDeep'
import { AvailableAsset, Farm } from '../../types/assets'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ConfirmProvideLiquidityModal from '../../components/ConfirmModals/ConfirmProvideLiquidityModal'

interface ProvideLiquidityProps {
  farm: Farm
}

const ProvideLiquidity: React.FC<ProvideLiquidityProps> = ({ farm }) => {
  const { styles, theme } = useStyles(getStyles)
  const { type } = useAccountsContext()
  const { provideLiquidity, assets, availableAssets } = useAssetsContext()
  const asset =
    assets.find((a) => a.symbol === farm.symbol) ||
    getMAssetDetail({ denom: farm.symbol, amount: '0' }, availableAssets) ||
    getTokenAssetDetail(
      { denom: farm.symbol === 'LUNA' ? 'uluna' : farm.symbol, amount: '0' },
      availableAssets
    ) ||
    undefined
  if (asset?.provided) {
    asset.coin.amount = String(Number(asset.coin.amount) - asset.provided)
    asset.provided = 0
  }

  const pairAsset =
    assets.find((a) => a.symbol === farm.pairSymbol) ||
    (farm.pairSymbol !== 'UST'
      ? getTokenAssetDetail({ denom: farm.pairDenom, amount: '0' })
      : getCurrentAssetDetail({ denom: 'uusd', amount: '0' }, 1)) ||
    undefined

  const { t } = useLocalesContext()
  const [amount, setAmount] = React.useState('')
  const [pairAmount, setPairAmount] = React.useState('')
  const [isConfirming, setIsConfirming] = React.useState(false)

  const onSubmit = React.useCallback(
    async (password?: string, terraApp?: TerraApp) => {
      const message = {
        type: 'provide liquidity',
        asset: {
          ...asset,
          coin: { denom: asset?.coin.denom, amount: String(Number(amount) * 10 ** 6) },
        },
        pairAsset: {
          ...pairAsset,
          coin: { denom: pairAsset?.coin.denom, amount: String(Number(pairAmount) * 10 ** 6) },
        },
      }
      try {
        await provideLiquidity(farm, Number(amount), Number(pairAmount), password, terraApp)
        Actions.Success({
          message,
          onClose: () => Actions.jump('Earn'),
        })
      } catch (err: any) {
        Actions.Success({
          message,
          error: err.message,
          onClose: () => Actions.popTo('ProvideLiquidity'),
        })
      }
    },
    [amount, pairAmount, asset, pairAsset, provideLiquidity, farm]
  )

  React.useEffect(() => {
    if (isConfirming) {
      Keyboard.dismiss()
    }
  }, [isConfirming])

  return (
    <>
      <HeaderBar back title={t(`provide liquidity`)} />
      <View style={styles.container}>
        <KeyboardAwareScrollView contentContainerStyle={{ paddingTop: 4 * theme.baseSpace }}>
          <AssetAmountInput
            asset={asset}
            amount={amount}
            setAmount={(a) => {
              setAmount(a)
              if (asset) {
                setPairAmount(a ? String((Number(a) * asset.price) / (pairAsset?.price || 1)) : '')
              }
            }}
            assetItemProps={{ disabled: true }}
            hideProvided
          />
          <Icon
            name="plus"
            size={theme.baseSpace * 8}
            color={theme.fonts.H6.color}
            style={styles.arrow}
          />
          <AssetAmountInput
            asset={pairAsset}
            amount={pairAmount}
            setAmount={(a) => {
              setPairAmount(a)
              if (asset) {
                setAmount(a ? String((Number(a) / asset.price) * (pairAsset?.price || 1)) : '')
              }
            }}
            assetItemProps={{ disabled: true }}
            hideProvided
          />
        </KeyboardAwareScrollView>
        <Button
          disabled={
            asset &&
            (!Number(amount) ||
              Math.round(Number(amount) * 10 ** 6) > Number(asset.coin.amount) ||
              !Number(pairAmount) ||
              Math.round(Number(pairAmount) * 10 ** 6) > Number(pairAsset?.coin.amount))
          }
          style={styles.button}
          size="Large"
          onPress={() => setIsConfirming(true)}
        >
          {t('next')}
        </Button>
      </View>
      {amount ? (
        <ConfirmProvideLiquidityModal
          open={isConfirming}
          farm={farm}
          amount={Number(amount)}
          pairAmount={Number(pairAmount)}
          onClose={() => setIsConfirming(false)}
          onConfirm={() => {
            getPasswordOrLedgerApp(onSubmit, type)
            setIsConfirming(false)
          }}
        />
      ) : null}
    </>
  )
}

export default ProvideLiquidity
