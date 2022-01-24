import React from 'react'
import { Keyboard, KeyboardAvoidingView } from 'react-native'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { Asset, AvailableAsset } from '../../types/assets'
import { Actions } from 'react-native-router-flux'
import Button from '../../components/Button'
import HeaderBar from '../../components/HeaderBar'
import AssetAmountInput from '../../components/AssetAmountInput'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import ConfirmCollateralModal from '../../components/ConfirmModals/ConfirmCollateralModal'
import { getPasswordOrLedgerApp } from '../../utils/signAndBroadcastTx'
import { useAccountsContext } from '../../contexts/AccountsContext'
import TerraApp from '@terra-money/ledger-terra-js'

interface ProvideCollateralProps {
  availableAsset: AvailableAsset
  asset: Asset
  mode: 'provide' | 'withdraw'
}

const ProvideCollateral: React.FC<ProvideCollateralProps> = ({ asset, availableAsset, mode }) => {
  const { styles } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { type } = useAccountsContext()
  const { provideCollateral, withdrawCollateral } = useAssetsContext()

  const [amount, setAmount] = React.useState('')

  const [isConfirming, setIsConfirming] = React.useState(false)

  const onSubmit = React.useCallback(
    async (password?: string, terraApp?: TerraApp) => {
      try {
        await (mode === 'provide' ? provideCollateral : withdrawCollateral)(
          MARKET_DENOMS.UUSD,
          availableAsset.symbol,
          Number(amount),
          password,
          terraApp
        )
        Actions.Success({
          message: {
            type: 'provide collateral',
            availableAsset,
            amount: Number(amount),
          },
          onClose: () => Actions.jump('Loan'),
        })
      } catch (err: any) {
        Actions.Success({
          message: {
            type: 'provide collateral',
            availableAsset,
            amount: Number(amount),
          },
          error: err.message,
          onClose: () => Actions.popTo('ProvideCollateral'),
        })
      }
    },
    [availableAsset, mode, provideCollateral, withdrawCollateral, amount]
  )

  React.useEffect(() => {
    if (isConfirming) {
      Keyboard.dismiss()
    }
  }, [isConfirming])

  return (
    <>
      <HeaderBar title={t(mode + ' collateral')} back />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <AssetAmountInput
          asset={asset}
          amount={amount}
          setAmount={setAmount}
          assetItemProps={{ disabled: true }}
          inputProps={{ autoFocus: true }}
          max={mode === 'provide' ? asset.notProvided : asset.provided}
        />
        <Button
          disabled={
            !Number(amount) ||
            (mode === 'provide' && Number(amount) * 10 ** 6 > Number(asset.notProvided)) ||
            (mode === 'withdraw' && Number(amount) * 10 ** 6 > Number(asset.provided))
          }
          style={styles.button}
          size="Large"
          onPress={() => {
            setIsConfirming(true)
          }}
        >
          {t('next')}
        </Button>
      </KeyboardAvoidingView>
      <ConfirmCollateralModal
        open={isConfirming}
        onClose={() => setIsConfirming(false)}
        onConfirm={() => {
          setIsConfirming(false)
          getPasswordOrLedgerApp(onSubmit, type)
        }}
        availableAsset={availableAsset}
        amount={Number(amount)}
        mode={mode}
        denom={MARKET_DENOMS.UUSD}
      />
    </>
  )
}

export default ProvideCollateral
