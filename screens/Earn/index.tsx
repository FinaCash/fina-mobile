import React from 'react'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view'
import { LinearGradient } from 'expo-linear-gradient'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'
import Farm from './Farm'
import Stake from './Stake'
import Airdrop from './Airdrop'
import HeaderBar from '../../components/HeaderBar'

const Earn: React.FC = () => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)
  const [index, setIndex] = React.useState(0)

  return (
    <>
      <HeaderBar title={t('earn')} />
      <TabView
        navigationState={{
          index,
          routes: [
            { key: 'Stake', title: t('stake') },
            { key: 'Farm', title: t('farm') },
            { key: 'Airdrop', title: t('airdrop') },
          ],
        }}
        renderScene={SceneMap({ Stake, Farm, Airdrop })}
        onIndexChange={setIndex}
        initialLayout={{ width: theme.screenWidth }}
        renderTabBar={(props) => (
          <LinearGradient
            start={[0, 0]}
            end={[1, 3.65]}
            colors={theme.gradients.primary}
            style={styles.tabs}
          >
            <TabBar
              {...props}
              style={{ backgroundColor: 'transparent' }}
              labelStyle={{
                ...theme.fonts.Large,
                color: theme.palette.white,
                textTransform: 'none',
              }}
              indicatorStyle={{ backgroundColor: theme.palette.white, height: theme.baseSpace }}
            />
          </LinearGradient>
        )}
      />
    </>
  )
}

export default Earn
