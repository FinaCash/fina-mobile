import React from 'react'
import { Actions } from 'react-native-router-flux'
import { useAssetsContext } from '../contexts/AssetsContext'
import { useLocalesContext } from '../contexts/LocalesContext'
import { Asset } from '../types/assets'
import { Recipient } from '../types/recipients'

const useSendToken = () => {
  const { assets, send } = useAssetsContext()
  const { t } = useLocalesContext()
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
              Actions.Password({
                onSubmit: async (password: string) => {
                  try {
                    await send({ denom: asset.coin.denom, amount }, address, memo, password)
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
                },
              }),
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
          assets: assets.filter((a) => a.coin.denom.match(/^u/)),
        })
      }
    },
    [assets, transferAsset]
  )

  return sendToken
}

export default useSendToken
