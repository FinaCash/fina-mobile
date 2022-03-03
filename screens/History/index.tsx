import React from 'react'
import { WebView } from 'react-native-webview'
import * as WebBrowser from 'expo-web-browser'
import { Feather as Icon } from '@expo/vector-icons'
import HeaderBar from '../../components/HeaderBar'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'
import {
  chainID,
  networkName,
  terraLCDUrl,
  terraMantleUrl,
  terraStationUrl,
} from '../../utils/terraConfig'
import { useAccountsContext } from '../../contexts/AccountsContext'
import { ActivityIndicator, View } from 'react-native'
import { useSettingsContext } from '../../contexts/SettingsContext'

const History: React.FC = () => {
  const webview = React.useRef<WebView>(null)
  const { theme, styles } = useStyles(getStyles)
  const { t, locale } = useLocalesContext()
  const { address } = useAccountsContext()
  const { currency, theme: uiTheme } = useSettingsContext()

  const [loading, setLoading] = React.useState(true)

  const uri = `${terraStationUrl}/history`

  const style = `
    <style>
      .Layout_layout__3qLmz {
        grid-template-rows: none;
      }
      .Layout_sidebar__1VZN4,
      .Layout_header__1IkV6,
      .Page_title__1-E8o {
        display: none;
      }
    </style>
  `

  return (
    <>
      <HeaderBar
        title={t('history')}
        back
        subtitle={t('powered by terra station')}
        rightButton={{
          icon: <Icon name="refresh-cw" size={theme.baseSpace * 5} color={theme.palette.white} />,
          onPress: () => {
            setLoading(true)
            webview.current?.reload()
          },
        }}
      />
      <View style={styles.webview}>
        <View style={{ flex: loading ? 0 : 1 }}>
          <WebView
            ref={webview}
            source={{ uri }}
            injectedJavaScriptBeforeContentLoaded={`
              localStorage.setItem('__terra-readonly-wallet-storage-key__', '{"network":{"name":"${networkName}","chainID":"${chainID}","lcd":"${terraLCDUrl}","mantle":"${terraMantleUrl}","walletconnectID":1},"terraAddress":"${address}"}')
              localStorage.setItem('Currency', '${currency}')
              localStorage.setItem('i18nextLng', '${locale}')
              localStorage.setItem('Theme', '${uiTheme}')
            `}
            injectedJavaScript={
              `
              document.head.innerHTML += '${style.replace(/(?:\r\n|\r|\n)/g, '')}'
              document.querySelector('body').style.opacity = 0
              const interval = setInterval(() => {
                if (document.querySelector('.Page_title__1-E8o')) {
                  document.querySelector('body').style.opacity = 1
                  window.ReactNativeWebView.postMessage("loaded")
                  clearInterval(interval)
                }
              }, 100)
            ` as string
            }
            onMessage={(e) => {
              if (e.nativeEvent.data === 'loaded') {
                setLoading(false)
              }
            }}
            onNavigationStateChange={(e) => {
              if (!e.url.includes(uri) && !e.loading) {
                WebBrowser.openBrowserAsync(e.url)
                webview.current?.goBack()
              }
            }}
          />
        </View>
        {loading ? <ActivityIndicator style={styles.loader} color={theme.fonts.H1.color} /> : null}
      </View>
    </>
  )
}

export default History
