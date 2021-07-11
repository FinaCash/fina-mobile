import { Theme } from '../types/misc'

export default (theme: Theme) => ({
  scene: {
    backgroundColor: theme.palette.white,
  },
  tabBar: {
    backgroundColor: theme.palette.white,
    borderTopWidth: 0,
    paddingTop: 4 * theme.baseSpace,
    paddingBottom: 4 * theme.baseSpace + theme.bottomSpace,
    height: theme.tabBarHeight + theme.bottomSpace,
    // position: 'absolute',
    // ...theme.shadow,
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    marginTop: theme.baseSpace,
  },
  // raisedTab: {
  //   backgroundColor: theme.palette.primary,
  //   height: theme.tabBarHeight + 2 * theme.baseSpace,
  //   width: theme.tabBarHeight + 2 * theme.baseSpace,
  //   borderRadius: '50%',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginTop: -4 * theme.baseSpace,
  //   ...theme.shadow,
  // },
})
