import React from 'react'
import { WebView } from 'react-native-webview'
import * as WebBrowser from 'expo-web-browser'
import { Feather as Icon } from '@expo/vector-icons'
import HeaderBar from '../../components/HeaderBar'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'
import { exTerraFinderUrl } from '../../utils/terraConfig'
import { useAccountsContext } from '../../contexts/AccountsContext'
import { ActivityIndicator, View } from 'react-native'

const History: React.FC = () => {
  const webview = React.useRef<WebView>(null)
  const { theme, styles } = useStyles(getStyles)
  const { t } = useLocalesContext()
  const { address } = useAccountsContext()

  const [loading, setLoading] = React.useState(true)

  const uri = `${exTerraFinderUrl}/address/${address}`

  const style = `
    <style>
      body {
        background-color: ${theme.palette.background};
        color: ${theme.fonts.Base.color};
      }
      .TxSummary_tx__281GP {
        border-bottom: 1px solid ${theme.palette.border};
      }
    </style>
  `

  return (
    <>
      <HeaderBar
        title={t('history')}
        back
        subtitle={t('powered by extraterrestrial finder')}
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
            injectedJavaScript={
              `
              document.head.innerHTML += '${style.replace(/(?:\r\n|\r|\n)/g, '')}'
              document.querySelector('body').style.opacity = 0
              const interval = setInterval(() => {
                if (document.querySelector('#rc-tabs-0-panel-overview article:nth-of-type(2)>section').outerHTML.length > 1000) {
                  document.querySelector('body').innerHTML = document.querySelector('#rc-tabs-0-panel-overview article:nth-of-type(2)>section').outerHTML
                  setTimeout(() => window.scrollTo(0, 0), 100)
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
        {loading ? <ActivityIndicator style={styles.loader} /> : null}
      </View>
    </>
  )
}

export default History
