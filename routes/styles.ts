import { Theme } from '../types/misc'

export default (theme: Theme) => ({
  tabBar: {
    backgroundColor: theme.palette.background,
    borderTopWidth: 0,
    paddingTop: 4 * theme.baseSpace,
    height: theme.tabBarHeight + theme.bottomSpace,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    marginTop: theme.baseSpace,
  },
})
