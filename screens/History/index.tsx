import React from 'react'
import { WebView } from 'react-native-webview'
import * as WebBrowser from 'expo-web-browser'
import { Feather as Icon } from '@expo/vector-icons'
import HeaderBar from '../../components/HeaderBar'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { terraStationChain, terraStationUrl } from '../../utils/terraConfig'
import { useAccountsContext } from '../../contexts/AccountsContext'
import { useSettingsContext } from '../../contexts/SettingsContext'

const History: React.FC = () => {
  const webview = React.useRef<WebView>(null)
  const { theme, styles } = useStyles(getStyles)
  const { t, locale } = useLocalesContext()
  const { currency } = useSettingsContext()
  const { address } = useAccountsContext()

  const terraStationSettings = {
    recentAddresses: [address],
    user: {
      address,
      ledger: false,
    },
    hideSmallBalances: false,
    chain: terraStationChain,
    lang: locale,
    currency: currency,
  }

  const style = `
    <style>
      body {
        color: ${theme.palette.grey[9]};
        background: ${theme.palette.grey[0]};
      }
      nav, header {
        display: none !important;
      }
      .card {
        background: ${theme.palette.white} !important;
      }
      .card-header {
        display: flex !important
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
          onPress: () => webview.current?.reload(),
        }}
      />
      <WebView
        ref={webview}
        style={styles.webview}
        source={{ uri: `${terraStationUrl}/history` }}
        injectedJavaScriptBeforeContentLoaded={
          `
          localStorage.setItem("settings", '${JSON.stringify(terraStationSettings)}')
        ` as string
        }
        injectedJavaScript={
          `
          document.head.innerHTML += '${style.replace(/(?:\r\n|\r|\n)/g, '')}'
        ` as string
        }
        onMessage={() => null}
        onNavigationStateChange={(e) => {
          if (!e.url.includes(terraStationUrl) && !e.loading) {
            WebBrowser.openBrowserAsync(e.url)
            webview.current?.goBack()
          }
        }}
      />
    </>
  )
}

export default History
