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

  const selectRecipient = React.useCallback(
    (asset: Asset, amount: number, recipient?: Recipient) =>
      Actions.SelectRecipient({
        asset,
        recipient,
        amount,
        onSubmit: (address: string, memo: string) =>
          getPasswordOrLedgerApp(async (password?: string, terraApp?: TerraApp) => {
            try {
              const tx = await send(
                { denom: asset.coin.denom, amount },
                address,
                memo,
                password,
                terraApp
              )
              Actions.Success({
                message: {
                  type: 'send',
                  asset,
                  amount,
                  address,
                  memo,
                },
                txHash: tx.txhash,
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
    [send, type]
  )

  const transferAsset = React.useCallback(
    ({ asset, recipient, amount }: { asset: Asset; recipient?: Recipient; amount?: number }) => {
      if (amount) {
        selectRecipient(asset, amount, recipient)
      } else {
        Actions.SelectAmount({
          asset,
          onSubmit: (a: number) => selectRecipient(asset, a, recipient),
        })
      }
    },
    [selectRecipient]
  )

  const sendToken = React.useCallback(
    (params?: { asset?: Asset; recipient?: Recipient; amount?: number }) => {
      const { asset, recipient, amount } = params || {}
      if (asset) {
        transferAsset({ asset, recipient, amount })
      } else {
        Actions.SelectAsset({
          onSelect: (a: Asset) => transferAsset({ asset: a, recipient, amount }),
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
    [assets, transferAsset, hideSmallBalance]
  )

  return sendToken
}

export default useSendToken
