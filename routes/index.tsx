import React from 'react'
import { View } from 'react-native'
import { Router, Scene, Tabs, Modal, Stack } from 'react-native-router-flux'
import HomeIcon from '../assets/images/icons/home.svg'
import RecipientsIcon from '../assets/images/icons/recipients.svg'
import InvestIcon from '../assets/images/icons/invest.svg'
import SettingsIcon from '../assets/images/icons/settings.svg'
import Typography from '../components/Typography'
import useStyles from '../theme/useStyles'
import getStyles from './styles'
import Home from '../screens/Home'
import Login from '../screens/Login'
import useTranslation from '../locales/useTranslation'
import Password from '../screens/Password'
import Savings from '../screens/Savings'
import Settings from '../screens/Settings'
import Invest from '../screens/Invest'
import MirrorSwap from '../screens/MirrorSwap'
import SelectAsset from '../screens/SelectAsset'
import SelectAmount from '../screens/SelectAmount'
import SelectRecipient from '../screens/SelectRecipient'
import Success from '../screens/Success'
import MyAddress from '../screens/MyAddress'
import ScanQRCode from '../screens/ScanQRCode'
import Recipients from '../screens/Recipients'
import SelectRecipients from '../screens/SelectRecipients'
import CurrencyExchange from '../screens/CurrencyExchange'
import UpdateRecipient from '../screens/UpdateRecipient'

export const TabIcon: React.FC<{
  focused: boolean
  iconSvg: React.ReactElement
  tabTitle: string
  navigation: { state: { key: string } }
}> = ({ focused, iconSvg, tabTitle }) => {
  const { theme, styles } = useStyles(getStyles)
  const color = focused ? theme.palette.primary : theme.palette.grey[6]
  return (
    <View style={styles.tab}>
      {React.cloneElement(iconSvg, {
        fill: color,
      })}
      <Typography style={styles.tabText} type="Mini" color={color}>
        {tabTitle}
      </Typography>
    </View>
  )
}

const Routes: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const { styles } = useStyles(getStyles)
  const { t } = useTranslation()
  return (
    <>
      <Router sceneStyle={styles.scene}>
        <Scene key="root">
          <Modal hideNavBar>
            <Scene key="Login" hideNavBar component={Login} />
            <Stack hideNavBar key="Main" initial={isLoggedIn}>
              <Tabs
                tabBarPosition="bottom"
                showLabel={false}
                tabBarStyle={styles.tabBar}
                hideNavBar
                lazy
              >
                <Scene
                  key="Home"
                  hideNavBar
                  iconSvg={<HomeIcon />}
                  tabTitle={t('home')}
                  icon={TabIcon}
                  component={Home}
                />
                <Scene
                  key="Invest"
                  hideNavBar
                  iconSvg={<InvestIcon />}
                  tabTitle={t('invest')}
                  icon={TabIcon}
                  component={Invest}
                />
                <Scene
                  key="Recipients"
                  hideNavBar
                  iconSvg={<RecipientsIcon />}
                  tabTitle={t('recipients')}
                  icon={TabIcon}
                  component={Recipients}
                />
                <Scene
                  key="Settings"
                  hideNavBar
                  iconSvg={<SettingsIcon />}
                  tabTitle={t('settings')}
                  icon={TabIcon}
                  component={Settings}
                />
              </Tabs>
              <Scene key="SelectAsset" hideNavBar component={SelectAsset} />
              <Scene key="SelectAmount" hideNavBar component={SelectAmount} />
              <Scene key="SelectRecipient" hideNavBar component={SelectRecipient} />
              <Scene key="SelectRecipients" hideNavBar component={SelectRecipients} />
              <Scene key="UpdateRecipient" hideNavBar component={UpdateRecipient} />
              <Scene key="MyAddress" hideNavBar component={MyAddress} />
              <Scene key="ScanQRCode" hideNavBar component={ScanQRCode} />
              <Scene key="CurrencyExchange" hideNavBar component={CurrencyExchange} />
              <Scene key="Savings" hideNavBar component={Savings} />
              <Scene key="MirrorSwap" hideNavBar component={MirrorSwap} />
            </Stack>
            <Scene key="Password" hideNavBar component={Password} />
            <Scene key="Success" hideNavBar component={Success} />
          </Modal>
        </Scene>
      </Router>
    </>
  )
}

export default React.memo(Routes)
