import React from 'react'
import HeaderBar from '../../components/HeaderBar'
import getStyles from './styles'
import useStyles from '../../theme/useStyles'
import { Keyboard, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '../../components/Button'
import { useLocalesContext } from '../../contexts/LocalesContext'
import LoanCard from '../../components/LoanCard'
import ConfirmBorrowModal from '../../components/ConfirmModals/ConfirmBorrowModal'
import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import { Actions } from 'react-native-router-flux'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { getCurrentAssetDetail } from '../../utils/transformAssets'
import { getPasswordOrLedgerApp } from '../../utils/signAndBroadcastTx'
import TerraApp from '@terra-money/ledger-terra-js'
import { useAccountsContext } from '../../contexts/AccountsContext'

const denom = MARKET_DENOMS.UUSD

interface BorrowProps {
  mode: 'borrow' | 'repay'
}

const Borrow: React.FC<BorrowProps> = ({ mode }) => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)
  const { borrow, repay } = useAssetsContext()
  const { type } = useAccountsContext()
  const [amount, setAmount] = React.useState('')
  const [isConfirming, setIsConfirming] = React.useState(false)

  const onSubmit = React.useCallback(
    async (password?: string, terraApp?: TerraApp) => {
      const message = {
        type: mode,
        asset: getCurrentAssetDetail({ denom, amount: String(Number(amount) * 10 ** 6) }),
      }
      try {
        await (mode === 'borrow' ? borrow : repay)(
          MARKET_DENOMS.UUSD,
          Number(amount),
          password,
          terraApp
        )
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

  React.useEffect(() => {
    if (isConfirming) {
      Keyboard.dismiss()
    }
  }, [isConfirming])

  return (
    <>
      <HeaderBar back title={t(mode)} />
      <KeyboardAwareScrollView
        extraHeight={theme.baseSpace * 60}
        contentContainerStyle={styles.container}
      >
        <View>
          <LoanCard
            withInput
            mode={mode}
            denom={MARKET_DENOMS.UUSD}
            inputProps={{ autoFocus: true }}
            amount={amount}
            setAmount={setAmount}
          />
        </View>
        <Button
          style={styles.button}
          disabled={!Number(amount)}
          size="Large"
          onPress={() => setIsConfirming(true)}
        >
          {t('next')}
        </Button>
      </KeyboardAwareScrollView>
      <ConfirmBorrowModal
        open={isConfirming}
        onClose={() => setIsConfirming(false)}
        mode={mode}
        denom={denom}
        amount={Number(amount)}
        onConfirm={() => {
          setIsConfirming(false)
          getPasswordOrLedgerApp(onSubmit, type)
        }}
      />
    </>
  )
}

export default Borrow
