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
import Swap from '../screens/Swap'
import Login from '../screens/Login'
import useTranslation from '../locales/useTranslation'
import Passcode from '../screens/Passcode'
import Savings from '../screens/Savings'
import Settings from '../screens/Settings'
import Invest from '../screens/Invest'
import MirrorSwap from '../screens/MirrorSwap'

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
                  key="Contacts"
                  hideNavBar
                  iconSvg={<RecipientsIcon />}
                  tabTitle={t('recipients')}
                  icon={TabIcon}
                  component={() => null}
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
            </Stack>
            <Scene key="Swap" hideNavBar component={Swap} />
            <Scene key="Savings" hideNavBar component={Savings} />
            <Scene key="MirrorSwap" hideNavBar component={MirrorSwap} />
            <Scene key="Passcode" hideNavBar component={Passcode} />
          </Modal>
        </Scene>
      </Router>
    </>
  )
}

export default React.memo(Routes)
