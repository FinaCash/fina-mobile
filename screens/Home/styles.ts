import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  parentContainer: {
    height: theme.screenHeight - theme.tabBarHeight - theme.bottomSpace,
  },
  container: {
    padding: theme.baseSpace * 6,
  },
  title: {
    marginTop: theme.baseSpace * 4,
    marginBottom: theme.baseSpace * 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyImage: {
    width: 40 * theme.baseSpace,
    height: 40 * theme.baseSpace,
    marginBottom: 5 * theme.baseSpace,
  },
})
