import React from 'react'
import { View } from 'react-native'
import { Router, Scene, Tabs, Modal, Stack } from 'react-native-router-flux'
import HomeIcon from '../assets/images/icons/home.svg'
import RecipientsIcon from '../assets/images/icons/recipients.svg'
import SwapIcon from '../assets/images/icons/swap.svg'
import SettingsIcon from '../assets/images/icons/settings.svg'
import Typography from '../components/Typography'
import useStyles from '../theme/useStyles'
import getStyles from './styles'
import Home from '../screens/Home'
import Swap from '../screens/Swap'
import Login from '../screens/Login'
import useTranslation from '../locales/useTranslation'
import Passcode from '../screens/Passcode'

export const TabIcon: React.FC<{
  focused: boolean
  iconSvg: React.ReactElement
  tabTitle: string
  navigation: { state: { key: string } }
}> = ({ focused, iconSvg, tabTitle }) => {
  const { theme, styles } = useStyles(getStyles)
  return (
    <View style={styles.tab}>
      {React.cloneElement(iconSvg, {
        fill: focused ? theme.palette.primary : theme.palette.grey[6],
      })}
      <Typography type="Mini" color={focused ? theme.palette.primary : theme.palette.grey[6]}>
        {tabTitle}
      </Typography>
    </View>
  )
}

const Routes: React.FC = () => {
  const { styles } = useStyles(getStyles)
  const { t } = useTranslation()
  return (
    <>
      <Router sceneStyle={styles.scene}>
        <Scene key="root">
          <Modal hideNavBar>
            <Scene key="Login" hideNavBar component={Login} />
            <Stack hideNavBar>
              <Tabs
                key="Tabs"
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
                  key="Contacts"
                  hideNavBar
                  iconSvg={<RecipientsIcon />}
                  tabTitle={t('recipients')}
                  icon={TabIcon}
                  component={() => null}
                />
                <Scene
                  key="Swap"
                  hideNavBar
                  iconSvg={<SwapIcon />}
                  tabTitle={t('swap')}
                  icon={TabIcon}
                  component={() => null}
                />
                <Scene
                  key="Settings"
                  hideNavBar
                  iconSvg={<SettingsIcon />}
                  tabTitle={t('settings')}
                  icon={TabIcon}
                  component={() => null}
                />
              </Tabs>
            </Stack>
            <Scene key="Swap" hideNavBar component={Swap} />
            <Scene key="Passcode" hideNavBar component={Passcode} />
          </Modal>
        </Scene>
      </Router>
    </>
  )
}

export default React.memo(Routes)
