import React from 'react'
import HeaderBar from '../../components/HeaderBar'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'
import { KeyboardAvoidingView } from 'react-native'
import Button from '../../components/Button'
import { useLocalesContext } from '../../contexts/LocalesContext'
import LoanCard from '../../components/LoanCard'
import ConfirmBorrowModal from '../../components/ConfirmModals/ConfirmBorrowModal'
import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import { Actions } from 'react-native-router-flux'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { getCurrentAssetDetail } from '../../utils/transformAssets'

const denom = MARKET_DENOMS.UUSD

interface BorrowProps {
  mode: 'borrow' | 'repay'
}

const Borrow: React.FC<BorrowProps> = ({ mode }) => {
  const { t } = useLocalesContext()
  const { styles } = useStyles(getStyles)
  const { borrow, repay } = useAssetsContext()
  const [amount, setAmount] = React.useState('')
  const [isConfirming, setIsConfirming] = React.useState(false)

  const onSubmit = React.useCallback(
    async (password: string) => {
      const message = {
        type: mode,
        asset: getCurrentAssetDetail({ denom, amount: String(Number(amount) * 10 ** 6) }),
      }
      try {
        await (mode === 'borrow' ? borrow : repay)(MARKET_DENOMS.UUSD, Number(amount), password)
        Actions.Success({
          message,
          onClose: () => Actions.jump('Loan'),
        })
      } catch (err: any) {
        Actions.Success({
          message,
          error: err.message,
          onClose: () => Actions.popTo('Borrow'),
        })
      }
    },
    [mode, borrow, repay, amount]
  )

  return (
    <>
      <HeaderBar back title={t(mode)} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <LoanCard
          withInput
          mode={mode}
          denom={MARKET_DENOMS.UUSD}
          inputProps={{ autoFocus: true }}
          amount={amount}
          setAmount={setAmount}
        />
        <Button
          disabled={!Number(amount)}
          style={styles.button}
          size="Large"
          onPress={() => setIsConfirming(true)}
        >
          {t('next')}
        </Button>
      </KeyboardAvoidingView>
      <ConfirmBorrowModal
        open={isConfirming}
        onClose={() => setIsConfirming(false)}
        mode={mode}
        denom={denom}
        amount={Number(amount)}
        onConfirm={() => Actions.Password({ onSubmit })}
      />
    </>
  )
}

export default Borrow
