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
  const { depositSavings, withdrawSavings, assets, availableAssets } = useAssetsContext()
  const asset =
    assets.find((a) => a.symbol === farm.symbol) ||
    getMAssetDetail({ denom: farm.symbol, amount: '0' }, availableAssets) ||
    getTokenAssetDetail(
      { denom: farm.symbol === 'LUNA' ? 'uluna' : farm.symbol, amount: '0' },
      availableAssets
    ) ||
    undefined

  const ustAsset =
    assets.find((a) => a.symbol === 'UST') ||
    getCurrentAssetDetail({ denom: 'uusd', amount: '0' }, 1) ||
    undefined

  const { t } = useLocalesContext()
  const [amount, setAmount] = React.useState('')
  const [ustAmount, setUstAmount] = React.useState('')
  const [isConfirming, setIsConfirming] = React.useState(false)

  const onSubmit = React.useCallback(
    async (password?: string, terraApp?: TerraApp) => {
      const message = {
        type: 'swap',
        // from: (mode === 'deposit' ? getCurrentAssetDetail : getSavingAssetDetail)(
        //   {
        //     denom: mode === 'deposit' ? denom : `a${denom.slice(1)}`,
        //     amount: String(
        //       (Number(amount) * 10 ** 6) / (mode === 'deposit' ? 1 : savingAsset.price)
        //     ),
        //     apr,
        //   },
        //   mode === 'deposit' ? 1 : savingAsset.price
        // ),
        // to: (mode === 'withdraw' ? getCurrentAssetDetail : getSavingAssetDetail)(
        //   {
        //     denom: mode === 'withdraw' ? denom : `a${denom.slice(1)}`,
        //     amount: String(
        //       (Number(amount) * 10 ** 6) / (mode === 'withdraw' ? 1 : savingAsset.price)
        //     ),
        //     apr,
        //   },
        //   mode === 'withdraw' ? 1 : savingAsset.price
        // ),
      }
      try {
        // await (mode === 'deposit' ? depositSavings : withdrawSavings)(
        //   MARKET_DENOMS.UUSD,
        //   Number(amount),
        //   password,
        //   terraApp
        // )
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
    [amount]
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
                setUstAmount(a ? String(Number(a) * asset.price) : '')
              }
            }}
            assetItemProps={{ disabled: true }}
          />
          <Icon
            name="plus"
            size={theme.baseSpace * 8}
            color={theme.palette.grey[10]}
            style={styles.arrow}
          />
          <AssetAmountInput
            asset={ustAsset}
            amount={ustAmount}
            setAmount={(a) => {
              setUstAmount(a)
              if (asset) {
                setAmount(a ? String(Number(a) / asset.price) : '')
              }
            }}
            assetItemProps={{ disabled: true }}
          />
        </KeyboardAwareScrollView>
        <Button
          disabled={
            asset &&
            (!Number(amount) ||
              Number(amount) * 10 ** 6 > Number(asset.coin.amount) ||
              !Number(ustAmount) ||
              Number(ustAmount) * 10 ** 6 > Number(ustAsset.coin.amount))
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
          ustAmount={Number(ustAmount)}
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
