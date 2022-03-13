import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    paddingTop: theme.statusBarHeight,
    height: theme.baseSpace * 12 + theme.statusBarHeight,
    paddingHorizontal: theme.baseSpace * 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  leftButton: {
    position: 'absolute',
    padding: 4 * theme.baseSpace,
    left: 2 * theme.baseSpace,
    bottom: 0,
  },
  rightButton: {
    position: 'absolute',
    padding: 4 * theme.baseSpace,
    right: 2 * theme.baseSpace,
    bottom: 0,
  },
})
