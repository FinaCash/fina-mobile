import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    paddingHorizontal: theme.baseSpace * 12,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary,
    flex: 1,
  },
  title: {
    marginBottom: 6 * theme.baseSpace,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 6 * theme.baseSpace + theme.statusBarHeight,
    right: 6 * theme.baseSpace,
  },
})
