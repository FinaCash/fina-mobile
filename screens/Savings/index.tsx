import React from 'react'
import { Keyboard, KeyboardAvoidingView } from 'react-native'
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
import { useAccountsContext } from '../../contexts/AccountsContext'
import { getPasswordOrLedgerApp } from '../../utils/signAndBroadcastTx'
import TerraApp from '@terra-money/ledger-terra-js'
import cloneDeep from 'lodash/cloneDeep'

interface SavingsProps {
  mode: 'deposit' | 'withdraw'
  denom: MARKET_DENOMS
}

const Savings: React.FC<SavingsProps> = ({ mode, denom = MARKET_DENOMS.UUSD }) => {
  const { styles } = useStyles(getStyles)
  const { type } = useAccountsContext()
  const { depositSavings, withdrawSavings, assets } = useAssetsContext()
  const { t } = useLocalesContext()
  const [amount, setAmount] = React.useState('')
  const [apr, setApr] = React.useState(0)
  const [isConfirming, setIsConfirming] = React.useState(false)

  const savingAsset =
    assets.find((a) => a.coin.denom === `a${denom.slice(-3)}`) ||
    getSavingAssetDetail({
      denom: `a${denom.slice(1)}`,
      amount: '0',
      apr,
    })
  let asset =
    assets.find((a) => a.coin.denom === denom) ||
    getCurrentAssetDetail({
      denom,
      amount: '0',
    })
  if (mode === 'withdraw') {
    asset = {
      ...asset,
      coin: {
        ...asset.coin,
        amount: String(Number(savingAsset.coin.amount) * savingAsset.price),
      },
    }
  }

  const onSubmit = React.useCallback(
    async (password?: string, terraApp?: TerraApp) => {
      const message = {
        type: 'swap',
        from: (mode === 'deposit' ? getCurrentAssetDetail : getSavingAssetDetail)(
          {
            denom: mode === 'deposit' ? denom : `a${denom.slice(1)}`,
            amount: String(
              (Number(amount) * 10 ** 6) / (mode === 'deposit' ? 1 : savingAsset.price)
            ),
            apr,
          },
          mode === 'deposit' ? 1 : savingAsset.price
        ),
        to: (mode === 'withdraw' ? getCurrentAssetDetail : getSavingAssetDetail)(
          {
            denom: mode === 'withdraw' ? denom : `a${denom.slice(1)}`,
            amount: String(
              (Number(amount) * 10 ** 6) / (mode === 'withdraw' ? 1 : savingAsset.price)
            ),
            apr,
          },
          mode === 'withdraw' ? 1 : savingAsset.price
        ),
      }
      try {
        await (mode === 'deposit' ? depositSavings : withdrawSavings)(
          MARKET_DENOMS.UUSD,
          Number(amount),
          password,
          terraApp
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

  React.useEffect(() => {
    if (isConfirming) {
      Keyboard.dismiss()
    }
  }, [isConfirming])

  return (
    <>
      <HeaderBar back title={t(`${mode} savings`)} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <AssetAmountInput
          asset={asset}
          amount={amount}
          setAmount={setAmount}
          assetItemProps={{ disabled: true }}
          inputProps={{ autoFocus: true }}
        />
        <Button
          disabled={!Number(amount) || Number(amount) * 10 ** 6 > Number(asset.coin.amount)}
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
          onConfirm={() => {
            getPasswordOrLedgerApp(onSubmit, type)
            setIsConfirming(false)
          }}
        />
      ) : null}
    </>
  )
}

export default Savings
