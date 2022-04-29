import React, { useCallback, useEffect, useState } from 'react'
import { WebView } from 'react-native-webview'
import WalletConnect from '@walletconnect/client'
import { Feather as Icon } from '@expo/vector-icons'
import { Buffer } from 'buffer'
import HeaderBar from '../../components/HeaderBar'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useAccountsContext } from '../../contexts/AccountsContext'
import { View } from 'react-native'
import ConfirmWalletConnectModal from '../../components/ConfirmModals/ConfirmWalletConnectModal'
import { getPasswordOrLedgerApp } from '../../utils/signAndBroadcastTx'
import { Actions } from 'react-native-router-flux'
import TerraApp from '@terra-money/ledger-terra-js'
import { useAssetsContext } from '../../contexts/AssetsContext'
import { Dapp } from '../../types/misc'

let connector: WalletConnect

const DappView: React.FC<{ dapp: Dapp }> = ({ dapp }) => {
  const webview = React.useRef<WebView>(null)

  const { theme, styles } = useStyles(getStyles)
  const { address, type } = useAccountsContext()
  const { sendRawTx } = useAssetsContext()

  const [txParams, setTxParams] = useState<{ msgs: string[]; fee: string }>()
  const [isConfirming, setIsConfirming] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    return () => {
      connector?.killSession()
    }
  }, [])

  useEffect(() => {
    if (refreshing) {
      setRefreshing(false)
    }
  }, [refreshing])

  const onSubmit = useCallback(
    async (password?: string, terraApp?: TerraApp) => {
      const message = {
        type: 'wallet connect',
        msgs: txParams?.msgs || [],
        fee: txParams?.fee || '',
      }
      try {
        const tx = await sendRawTx(
          message.msgs.map((m) => JSON.parse(m)),
          JSON.parse(message.fee),
          password,
          terraApp
        )
        Actions.Success({
          message,
          txHash: tx.txhash,
          onClose: () => Actions.popTo('DappView'),
        })
      } catch (err: any) {
        Actions.Success({
          message,
          error: err.message,
          onClose: () => Actions.popTo('DappView'),
        })
      }
    },
    [txParams, sendRawTx]
  )

  return (
    <>
      <HeaderBar
        title={dapp.name}
        back
        rightButton={{
          icon: <Icon name="refresh-cw" size={theme.baseSpace * 5} color={theme.palette.white} />,
          onPress: () => {
            setRefreshing(true)
          },
        }}
      />
      <View style={styles.webview}>
        {refreshing ? null : (
          <WebView
            ref={webview}
            originWhitelist={['*']}
            source={{ uri: dapp.url }}
            onShouldStartLoadWithRequest={(e) => {
              if (e.url.includes('https://preview.page.link/')) {
                const uri = e.url
                  .split('payload%3D')[1]
                  .split('&apn=')[0]
                  .replace(/%25/g, '%')
                  .replace(/%3D/g, '=')
                  .replace(/%25/g, '%')
                  .replace(/%26/g, '&')
                connector = new WalletConnect({
                  uri,
                  clientMeta: {
                    description: 'Terra DeFi Wallet On The Go',
                    url: 'https://fina.cash',
                    icons: ['https://fina.cash/images/logo.png?imwidth=1920'],
                    name: 'Fina',
                  },
                })
                if (!connector.connected) {
                  connector.createSession()
                }
                connector.on('session_request', (error, payload) => {
                  if (!error) {
                    connector.approveSession({
                      accounts: [address],
                      chainId: 1,
                    })
                  }
                })
                return false
              } else if (e.url.includes('terrastation://')) {
                const payload = JSON.parse(
                  Buffer.from(
                    e.url.replace('terrastation://walletconnect_confirm/?payload=', ''),
                    'base64'
                  ).toString()
                )
                setTxParams(payload.params)
                setIsConfirming(true)
                return false
              } else {
                return true
              }
            }}
          />
        )}
      </View>
      <ConfirmWalletConnectModal
        open={isConfirming}
        onClose={() => {
          setTxParams(undefined)
          setIsConfirming(false)
        }}
        msgs={txParams?.msgs || []}
        fee={txParams?.fee || ''}
        onConfirm={() => {
          getPasswordOrLedgerApp(onSubmit, type)
          setIsConfirming(false)
        }}
      />
    </>
  )
}

export default DappView
