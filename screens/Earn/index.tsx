import React from 'react'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view'
import useStyles from '../../theme/useStyles'
import getStyles from './styles'
import { useLocalesContext } from '../../contexts/LocalesContext'
import Farm from './Farm'
import Stake from './Stake'
import HeaderBar from '../../components/HeaderBar'

interface EarnProps {
  toFarm?: number // a random number. whenever it changes it will switch to Farm tab
}

const Earn: React.FC<EarnProps> = ({ toFarm }) => {
  const { t } = useLocalesContext()
  const { styles, theme } = useStyles(getStyles)

  const routes = React.useMemo(
    () => [
      { key: 'Stake', title: t('stake') },
      { key: 'Farm', title: t('farm') },
    ],
    [t]
  )

  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    if (toFarm) {
      setIndex(1)
    }
  }, [toFarm])

  return (
    <>
      <HeaderBar title={t('earn')} />
      <TabView
        navigationState={{
          index,
          routes,
        }}
        renderScene={SceneMap({ Stake, Farm })}
        onIndexChange={setIndex}
        initialLayout={{ width: theme.screenWidth }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={styles.tabbar}
            labelStyle={styles.tabLabel}
            indicatorStyle={styles.tabIndicator}
          />
        )}
      />
    </>
  )
}

export default Earn
