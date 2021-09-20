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
    left: 6 * theme.baseSpace,
    bottom: 4 * theme.baseSpace,
  },
  rightButton: {
    position: 'absolute',
    right: 6 * theme.baseSpace,
    bottom: 4 * theme.baseSpace,
  },
})
