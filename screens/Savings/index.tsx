import React from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import { useAssetsContext } from '../../contexts/AssetsContext'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { Actions } from 'react-native-router-flux'
import { anchorClient } from '../../utils/terraConfig'
import Button from '../../components/Button'
import { getCurrentAssetDetail, getSavingAssetDetail } from '../../utils/transformAssets'
import HeaderBar from '../../components/HeaderBar'
import AssetAmountInput from '../../components/AssetAmountInput'
import ConfirmSavingsModal from '../../components/ConfirmModals/ConfirmSavingsModal'
import { useLocalesContext } from '../../contexts/LocalesContext'

interface SavingsProps {
  mode: 'deposit' | 'withdraw'
  denom: MARKET_DENOMS
}

const Savings: React.FC<SavingsProps> = ({ mode, denom = MARKET_DENOMS.UUSD }) => {
  const { styles } = useStyles(getStyles)
  const { depositSavings, withdrawSavings, assets } = useAssetsContext()
  const { t } = useLocalesContext()
  const [amount, setAmount] = React.useState('')
  const [apr, setApr] = React.useState(0)
  const [isConfirming, setIsConfirming] = React.useState(false)

  const baseAsset =
    assets.find((a) => a.coin.denom === denom) ||
    getCurrentAssetDetail({
      denom,
      amount: '0',
    })
  const savingAsset =
    assets.find((a) => a.coin.denom === `a${denom.slice(1)}`) ||
    getSavingAssetDetail({
      denom: `a${denom.slice(1)}`,
      amount: '0',
      apr,
    })

  const onSubmit = React.useCallback(
    async (password: string) => {
      const message = {
        type: 'swap',
        from: (mode === 'deposit' ? getCurrentAssetDetail : getSavingAssetDetail)({
          denom: mode === 'deposit' ? denom : `a${denom.slice(1)}`,
          amount: String(Number(amount) * 10 ** 6),
          apr,
        }),
        to: (mode === 'withdraw' ? getCurrentAssetDetail : getSavingAssetDetail)({
          denom: mode === 'withdraw' ? denom : `a${denom.slice(1)}`,
          amount: String(Number(amount) * 10 ** 6),
          apr,
        }),
      }
      try {
        await (mode === 'deposit' ? depositSavings : withdrawSavings)(
          MARKET_DENOMS.UUSD,
          Number(amount),
          password
        )
        Actions.Success({
          message,
          onClose: () => Actions.jump('Home'),
        })
      } catch (err: any) {
        Actions.Success({
          message,
          error: err.message,
          onClose: () => Actions.popTo('Savings'),
        })
      }
    },
    [mode, depositSavings, withdrawSavings, amount, denom, apr]
  )

  const fetchApr = React.useCallback(async () => {
    try {
      const rate = await anchorClient.earn.getAPY({
        market: MARKET_DENOMS.UUSD,
      })
      setApr(rate)
    } catch (err: any) {
      console.log(err)
    }
  }, [setApr])

  React.useEffect(() => {
    fetchApr()
  }, [])

  return (
    <>
      <HeaderBar back title={t(`${mode} savings`)} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <AssetAmountInput
          asset={mode === 'deposit' ? baseAsset : savingAsset}
          amount={amount}
          setAmount={setAmount}
          assetItemProps={{ disabled: true }}
          inputProps={{ autoFocus: true }}
        />
        <Button
          disabled={
            !Number(amount) ||
            (mode === 'deposit' && Number(amount) * 10 ** 6 > Number(baseAsset.coin.amount)) ||
            (mode === 'withdraw' && Number(amount) * 10 ** 6 > Number(savingAsset.coin.amount))
          }
          style={styles.button}
          size="Large"
          onPress={() => setIsConfirming(true)}
        >
          {t('next')}
        </Button>
      </KeyboardAvoidingView>
      {amount ? (
        <ConfirmSavingsModal
          open={isConfirming}
          denom={denom}
          amount={Number(amount)}
          mode={mode}
          apr={apr}
          onClose={() => setIsConfirming(false)}
          onConfirm={() => Actions.Password({ onSubmit })}
        />
      ) : null}
    </>
  )
}

export default Savings
