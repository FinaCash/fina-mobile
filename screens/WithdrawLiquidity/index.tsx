import React from 'react'
import { Keyboard, KeyboardAvoidingView } from 'react-native'
import { useAssetsContext } from '../../contexts/AssetsContext'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { Actions } from 'react-native-router-flux'
import Button from '../../components/Button'
import HeaderBar from '../../components/HeaderBar'
import AssetAmountInput from '../../components/AssetAmountInput'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { useAccountsContext } from '../../contexts/AccountsContext'
import { getPasswordOrLedgerApp } from '../../utils/signAndBroadcastTx'
import TerraApp from '@terra-money/ledger-terra-js'
import { Farm } from '../../types/assets'
import ConfirmWithdrawLiquidityModal from '../../components/ConfirmModals/ConfirmWithdrawLiquidityModal'

interface WithdrawLiquidityProps {
  farm: Farm
}

const WithdrawLiquidity: React.FC<WithdrawLiquidityProps> = ({ farm }) => {
  const { styles } = useStyles(getStyles)
  const { type } = useAccountsContext()
  const { withdrawLiquidity, availableAssets } = useAssetsContext()
  const availableAsset = availableAssets.find((a) => a.symbol === farm.symbol)!
  const pairAsset = availableAssets.find((a) => a.symbol === farm.pairSymbol)!

  const { t } = useLocalesContext()
  const [amount, setAmount] = React.useState('')
  const [isConfirming, setIsConfirming] = React.useState(false)

  const onSubmit = React.useCallback(
    async (password?: string, terraApp?: TerraApp) => {
      const message = {
        type: 'withdraw liquidity',
        availableAsset,
        pairAsset,
        farm,
        amount: Number(amount),
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
          onClose: () => Actions.popTo('WithdrawLiquidity'),
        })
      }
    },
    [amount, withdrawLiquidity, farm, availableAsset, pairAsset]
  )

  React.useEffect(() => {
    if (isConfirming) {
      Keyboard.dismiss()
    }
  }, [isConfirming])

  return (
    <>
      <HeaderBar back title={t(`withdraw liquidity`)} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <AssetAmountInput
          availableAsset={availableAsset}
          pairAsset={pairAsset}
          farm={farm}
          amount={amount}
          setAmount={(a) => {
            setAmount(a)
          }}
          assetItemProps={{ disabled: true }}
          inputProps={{ autoFocus: true }}
        />
        <Button
          disabled={Number(amount) * 10 ** 6 > Number(farm.balance) || !Number(amount)}
          style={styles.button}
          size="Large"
          onPress={() => setIsConfirming(true)}
        >
          {t('next')}
        </Button>
      </KeyboardAvoidingView>
      {amount ? (
        <ConfirmWithdrawLiquidityModal
          open={isConfirming}
          farm={farm}
          amount={Number(amount)}
          availableAsset={availableAsset}
          pairAsset={pairAsset}
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

export default WithdrawLiquidity
