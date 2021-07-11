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
  leftButton: {
    position: 'absolute',
    left: 0,
  },
  rightButton: {
    position: 'absolute',
    right: 0,
  },
})
