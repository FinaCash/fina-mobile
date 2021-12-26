import React from 'react'
import HeaderBar from '../../components/HeaderBar'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'
import { KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native'
import Button from '../../components/Button'
import AssetAmountInput from '../../components/AssetAmountInput'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { Actions } from 'react-native-router-flux'
import { Validator } from '../../types/assets'
import { getPasswordOrLedgerApp } from '../../utils/signAndBroadcastTx'
import { useAccountsContext } from '../../contexts/AccountsContext'
import TerraApp from '@terra-money/ledger-terra-js'
import ConfirmUndelegateModal from '../../components/ConfirmModals/ConfirmUndelegateModal'

interface UndelegateProps {
  validator: Validator
  amount: number
}

const Undelegate: React.FC<UndelegateProps> = ({ validator, amount: totalAmount }) => {
  const { t } = useLocalesContext()
  const { type } = useAccountsContext()
  const { availableAssets, unstake } = useAssetsContext()
  const { styles } = useStyles(getStyles)
  const [confirmUndelegationModalOpen, setConfirmUndelegationModalOpen] = React.useState(false)
  const [amount, setAmount] = React.useState('')

  const availableAsset = availableAssets.find((a) => a.coin.denom === 'uluna')!

  const onSubmit = React.useCallback(
    async (password?: string, terraApp?: TerraApp) => {
      const message = {
        type: 'undelegate',
        amount: Number(amount),
        validator,
        symbol: availableAsset.symbol,
        price: availableAsset.price,
      }
      try {
        await unstake(
          { denom: 'uluna', amount: Number(amount) },
          validator!.address,
          password,
          terraApp
        )
        Actions.Success({
          message,
          onClose: () => Actions.jump('Earn'),
        })
      } catch (err: any) {
        Actions.Success({
          message,
          error: err.message,
          onClose: () => Actions.jump('Earn'),
        })
      }
    },
    [unstake, amount, validator, availableAsset]
  )

  React.useEffect(() => {
    if (confirmUndelegationModalOpen) {
      Keyboard.dismiss()
    }
  }, [confirmUndelegationModalOpen])

  return (
    <>
      <HeaderBar back title={t('undelegate')} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView>
          <AssetAmountInput
            validator={validator}
            stakedAmount={totalAmount / 10 ** 6}
            availableAsset={availableAsset}
            amount={amount}
            setAmount={setAmount}
            assetItemProps={{ disabled: true }}
            inputProps={{ autoFocus: true }}
          />
        </ScrollView>
        <Button
          disabled={!Number(amount) || Number(amount) * 10 ** 6 > totalAmount || !validator}
          style={styles.button}
          size="Large"
          onPress={() => setConfirmUndelegationModalOpen(true)}
        >
          {t('next')}
        </Button>
      </KeyboardAvoidingView>
      {validator ? (
        <ConfirmUndelegateModal
          open={confirmUndelegationModalOpen}
          onClose={() => setConfirmUndelegationModalOpen(false)}
          amount={Number(amount)}
          validator={validator}
          onConfirm={() => getPasswordOrLedgerApp(onSubmit, type)}
        />
      ) : null}
    </>
  )
}

export default Undelegate
