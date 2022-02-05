import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Router, Scene, Tabs, Modal, Stack, SceneProps, Actions } from 'react-native-router-flux'
import HomeIcon from '../assets/images/icons/home.svg'
import BorrowIcon from '../assets/images/icons/borrow.svg'
import EarnIcon from '../assets/images/icons/earn.svg'
import TradeIcon from '../assets/images/icons/swap.svg'
import SettingsIcon from '../assets/images/icons/settings.svg'
import Typography from '../components/Typography'
import useStyles from '../theme/useStyles'
import getStyles from './styles'
import Home from '../screens/Home'
import Login from '../screens/Login'
import Password from '../screens/Password'
import Savings from '../screens/Savings'
import Settings from '../screens/Settings'
import Trade from '../screens/Trade'
import Swap from '../screens/Swap'
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
import { useLocalesContext } from '../contexts/LocalesContext'
import History from '../screens/History'
import Loan from '../screens/Loan'
import ProvideCollateral from '../screens/ProvideCollateral'
import Borrow from '../screens/Borrow'
import Earn from '../screens/Earn'
import ConnectLedger from '../screens/ConnectLedger'
import Delegate from '../screens/Staking/Delegate'
import SelectValidator from '../screens/SelectValidator'
import Undelegate from '../screens/Staking/Undelegate'
import Redelegate from '../screens/Staking/Redelegate'
import ProvideLiquidity from '../screens/ProvideLiquidity'

const Tab: React.FC<{
  sceneKey: string
  focused: boolean
  iconSvg: React.ReactElement
  tabTitle: string
}> = ({ sceneKey, focused, iconSvg, tabTitle }) => {
  const { theme, styles } = useStyles(getStyles)
  const color = focused ? theme.palette.active : theme.palette.grey[6]
  return (
    <TouchableOpacity activeOpacity={1} onPress={() => Actions.jump(sceneKey)} style={styles.tab}>
      {React.cloneElement(iconSvg, {
        fill: color,
        color,
        width: theme.baseSpace * 5,
        height: theme.baseSpace * 5,
      })}
      <Typography style={styles.tabText} type="Mini" color={color}>
        {tabTitle}
      </Typography>
    </TouchableOpacity>
  )
}

const TabBar: React.FC<SceneProps> = ({ navigation: { state } }) => {
  const { styles } = useStyles(getStyles)
  const { t } = useLocalesContext()
  return (
    <View style={styles.tabBar}>
      {state.routes.map((r: any, i: any) => (
        <Tab
          key={r.key}
          sceneKey={r.key}
          focused={i === state.index}
          iconSvg={r.routes[0].params.iconSvg}
          tabTitle={t(r.routes[0].params.tabTitle)}
        />
      ))}
    </View>
  )
}

const Routes: React.FC<{ address: string }> = ({ address }) => {
  return (
    <>
      <Router>
        <Scene key="root">
          <Modal hideNavBar>
            <Scene key="Login" hideNavBar component={Login} />
            <Stack hideNavBar key="Main" initial={!!address}>
              <Tabs
                tabBarPosition="bottom"
                showLabel={false}
                tabBarComponent={TabBar}
                hideNavBar
                lazy
              >
                <Scene
                  key="Home"
                  hideNavBar
                  iconSvg={<HomeIcon />}
                  tabTitle="home"
                  component={Home}
                />
                <Scene
                  key="Trade"
                  hideNavBar
                  iconSvg={<TradeIcon />}
                  tabTitle="trade"
                  component={Trade}
                />
                <Scene
                  key="Earn"
                  hideNavBar
                  iconSvg={<EarnIcon />}
                  tabTitle="earn"
                  component={Earn}
                />
                <Scene
                  key="Loan"
                  hideNavBar
                  iconSvg={<BorrowIcon />}
                  tabTitle="loan"
                  component={Loan}
                />
                <Scene
                  key="Settings"
                  hideNavBar
                  iconSvg={<SettingsIcon />}
                  tabTitle="settings"
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
              <Scene key="Swap" hideNavBar component={Swap} />
              <Scene key="History" hideNavBar component={History} />
              <Scene key="Recipients" hideNavBar component={Recipients} />
              <Scene key="ProvideCollateral" hideNavBar component={ProvideCollateral} />
              <Scene key="Borrow" hideNavBar component={Borrow} />
              <Scene key="Delegate" hideNavBar component={Delegate} />
              <Scene key="Undelegate" hideNavBar component={Undelegate} />
              <Scene key="Redelegate" hideNavBar component={Redelegate} />
              <Scene key="SelectValidator" hideNavBar component={SelectValidator} />
              <Scene key="ProvideLiquidity" hideNavBar component={ProvideLiquidity} />
            </Stack>
            <Scene key="Password" hideNavBar component={Password} />
            <Scene key="ConnectLedger" hideNavBar component={ConnectLedger} />
            <Scene key="Success" hideNavBar component={Success} />
          </Modal>
        </Scene>
      </Router>
    </>
  )
}

export default React.memo(Routes)
