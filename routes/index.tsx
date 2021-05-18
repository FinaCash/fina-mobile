import React from 'react'
import { Router, Scene, Tabs, Modal, Stack } from 'react-native-router-flux'
import { Feather as Icon } from '@expo/vector-icons'
import useStyles from '../theme/useStyles'
import getStyles from './styles'
import Home from '../screens/Home'
import { TouchableOpacity, View } from 'react-native'
import styles from './styles'
import { useAssetsContext } from '../contexts/AssetsContext'
import Login from '../screens/Login'

export const TabIcon: React.FC<{
  focused: boolean
  raised?: boolean
  onPress?(): void
  iconName: any
  navigation: { state: { key: string } }
}> = ({ raised, focused, iconName, onPress }) => {
  const { theme, styles } = useStyles(getStyles)
  return raised ? (
    <TouchableOpacity onPress={onPress} style={styles.raisedTab}>
      <Icon name={iconName} size={theme.fonts.H3.fontSize} color={theme.palette.white} />
    </TouchableOpacity>
  ) : (
    <Icon
      name={iconName}
      size={theme.fonts.H3.fontSize}
      color={focused ? theme.palette.primary : theme.palette.grey[5]}
    />
  )
}

const Routes: React.FC = () => {
  const { styles } = useStyles(getStyles)
  const { address } = useAssetsContext()
  return (
    <>
      <Router sceneStyle={styles.scene}>
        <Scene key="root">
          <Modal hideNavBar>
            <Stack hideNavBar>
              {/* <Scene initial={!address} key="Login" hideNavBar component={Login} /> */}
              <Tabs
                key="Tabs"
                tabBarPosition="bottom"
                showLabel={false}
                tabBarStyle={styles.tabBar}
                hideNavBar
                lazy
                // initial={!!address}
              >
                <Scene key="Home" hideNavBar iconName="home" icon={TabIcon} component={Home} />
                <Scene
                  key="Transactions"
                  hideNavBar
                  iconName="list"
                  icon={TabIcon}
                  component={() => null}
                />
                <Scene
                  key="Pay"
                  hideNavBar
                  iconName="dollar-sign"
                  icon={TabIcon}
                  raised
                  onPress={() => console.log('hi')}
                  component={() => null}
                />
                <Scene
                  key="Contacts"
                  hideNavBar
                  iconName="users"
                  icon={TabIcon}
                  component={() => null}
                />
                <Scene
                  key="Settings"
                  hideNavBar
                  iconName="settings"
                  icon={TabIcon}
                  component={() => null}
                />
              </Tabs>
            </Stack>
          </Modal>
        </Scene>
      </Router>
    </>
  )
}

export default React.memo(Routes)
