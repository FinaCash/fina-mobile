import TerraApp from '@terra-money/ledger-terra-js'
import React from 'react'
import { Actions } from 'react-native-router-flux'
import { useAccountsContext } from '../contexts/AccountsContext'
import { useAssetsContext } from '../contexts/AssetsContext'
import { useLocalesContext } from '../contexts/LocalesContext'
import { useSettingsContext } from '../contexts/SettingsContext'
import { Asset } from '../types/assets'
import { Recipient } from '../types/recipients'
import { getPasswordOrLedgerApp } from './signAndBroadcastTx'

const useSendToken = () => {
  const { assets, send } = useAssetsContext()
  const { t } = useLocalesContext()
  const { type } = useAccountsContext()
  const { hideSmallBalance } = useSettingsContext()
  const transferAsset = React.useCallback(
    ({ asset, recipient }: { asset: Asset; recipient?: Recipient }) => {
      Actions.SelectAmount({
        asset,
        onSubmit: (amount: number) =>
          Actions.SelectRecipient({
            asset,
            recipient,
            amount,
            onSubmit: (address: string, memo: string) =>
              getPasswordOrLedgerApp(async (password?: string, terraApp?: TerraApp) => {
                try {
                  await send({ denom: asset.coin.denom, amount }, address, memo, password, terraApp)
                  Actions.Success({
                    message: {
                      type: 'send',
                      asset,
                      amount,
                      address,
                      memo,
                    },
                    onClose: () => Actions.jump('Home'),
                  })
                } catch (err: any) {
                  Actions.Success({
                    message: {
                      type: 'send',
                      asset,
                      amount,
                      address,
                      memo,
                    },
                    error: err.message,
                    onClose: () => Actions.popTo('SelectRecipient'),
                  })
                }
              }, type),
          }),
      })
    },
    [send, t]
  )

  const sendToken = React.useCallback(
    (params?: { asset?: Asset; recipient?: Recipient }) => {
      const { asset, recipient } = params || {}
      if (asset) {
        transferAsset({ asset, recipient })
      } else {
        Actions.SelectAsset({
          onSelect: (a: Asset) => transferAsset({ asset: a, recipient }),
          // TODO: transfer other tokens
          assets: assets.filter(
            (a) =>
              a.coin.denom.match(/^u/) &&
              a.coin.amount !== '0' &&
              (hideSmallBalance ? (Number(a.coin.amount) * a.price) / 10 ** 6 > 0.1 : true)
          ),
        })
      }
    },
    [assets, transferAsset]
  )

  return sendToken
}

export default useSendToken
