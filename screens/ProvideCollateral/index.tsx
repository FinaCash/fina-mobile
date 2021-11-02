import React from 'react'
import { KeyboardAvoidingView } from 'react-native'
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

interface ProvideCollateralProps {
  availableAsset: AvailableAsset
  asset: Asset
  mode: 'provide' | 'withdraw'
}

const ProvideCollateral: React.FC<ProvideCollateralProps> = ({ asset, availableAsset, mode }) => {
  const { styles } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { provideCollateral, withdrawCollateral } = useAssetsContext()

  const [amount, setAmount] = React.useState('')

  const [isConfirming, setIsConfirming] = React.useState(false)

  const onSubmit = React.useCallback(
    async (password: string) => {
      try {
        await (mode === 'provide' ? provideCollateral : withdrawCollateral)(
          MARKET_DENOMS.UUSD,
          availableAsset.symbol,
          Number(amount),
          password
        )
        Actions.Success({
          message: {
            type: 'provide collateral',
            availableAsset,
            amount: Number(amount),
          },
          onClose: () => Actions.jump('Borrow'),
        })
      } catch (err: any) {
        Actions.Success({
          message: {
            type: 'provide collateral',
            availableAsset,
            amount: Number(amount),
          },
          error: err.message,
          onClose: () => Actions.popTo('Borrow'),
        })
      }
    },
    [availableAsset, mode, provideCollateral, withdrawCollateral, amount]
  )

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
          onPress={() => setIsConfirming(true)}
        >
          {t('next')}
        </Button>
      </KeyboardAvoidingView>
      <ConfirmCollateralModal
        open={isConfirming}
        onClose={() => setIsConfirming(false)}
        onConfirm={() => Actions.Password({ onSubmit })}
        availableAsset={availableAsset}
        amount={Number(amount)}
        mode={mode}
        denom={MARKET_DENOMS.UUSD}
      />
    </>
  )
}

export default ProvideCollateral
