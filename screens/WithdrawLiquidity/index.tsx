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

interface WithdrawLiquidityProps {
  farm: Farm
}

const WithdrawLiquidity: React.FC<WithdrawLiquidityProps> = ({ farm }) => {
  const { styles, theme } = useStyles(getStyles)
  const { type } = useAccountsContext()
  const { withdrawLiquidity, assets, availableAssets } = useAssetsContext()
  const availableAsset = availableAssets.find((a) => a.symbol === farm.symbol)!

  const { t } = useLocalesContext()
  const [amount, setAmount] = React.useState('')
  const [isConfirming, setIsConfirming] = React.useState(false)

  const onSubmit = React.useCallback(
    async (password?: string, terraApp?: TerraApp) => {
      const message = {
        type: 'provide liquidity',
        // asset: {
        //   ...asset,
        //   coin: { denom: asset?.coin.denom, amount: String(Number(amount) * 10 ** 6) },
        // },
        // ustAsset: {
        //   ...ustAsset,
        //   coin: { denom: ustAsset?.coin.denom, amount: String(Number(ustAmount) * 10 ** 6) },
        // },
      }
      try {
        await withdrawLiquidity(farm, Number(amount), password, terraApp)
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
    [amount, withdrawLiquidity, farm]
  )

  React.useEffect(() => {
    if (isConfirming) {
      Keyboard.dismiss()
    }
  }, [isConfirming])

  return (
    <>
      <HeaderBar back title={t(`withdraw liquidity`)} />
      <View style={styles.container}>
        <KeyboardAwareScrollView contentContainerStyle={{ paddingTop: 4 * theme.baseSpace }}>
          <AssetAmountInput
            availableAsset={availableAsset}
            farm={farm}
            amount={amount}
            setAmount={(a) => {
              setAmount(a)
            }}
            assetItemProps={{ disabled: true }}
          />
        </KeyboardAwareScrollView>
        <Button
          // disabled={
          //   asset &&
          //   (!Number(amount) ||
          //     Number(amount) * 10 ** 6 > Number(asset.coin.amount) ||
          //     !Number(ustAmount) ||
          //     Number(ustAmount) * 10 ** 6 > Number(ustAsset.coin.amount))
          // }
          style={styles.button}
          size="Large"
          onPress={() => setIsConfirming(true)}
        >
          {t('next')}
        </Button>
      </View>
      {/* {amount ? (
        <ConfirmProvideLiquidityModal
          open={isConfirming}
          farm={farm}
          amount={Number(amount)}
          ustAmount={Number(ustAmount)}
          onClose={() => setIsConfirming(false)}
          onConfirm={() => {
            getPasswordOrLedgerApp(onSubmit, type)
            setIsConfirming(false)
          }}
        />
      ) : null} */}
    </>
  )
}

export default WithdrawLiquidity
