import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    paddingHorizontal: theme.baseSpace * 12,
    paddingVertical: theme.baseSpace * 36,
    alignItems: 'stretch',
  },
  title: {
    marginBottom: 12 * theme.baseSpace,
  },
  placeholderDot: {
    width: 3 * theme.baseSpace,
    height: 3 * theme.baseSpace,
    borderRadius: 1.5 * theme.baseSpace,
    backgroundColor: theme.palette.primary,
    opacity: 0.3,
  },
  maskDot: {
    width: 3 * theme.baseSpace,
    height: 3 * theme.baseSpace,
    borderRadius: 1.5 * theme.baseSpace,
    backgroundColor: theme.palette.primary,
  },
  closeButton: {
    position: 'absolute',
    top: 6 * theme.baseSpace + theme.statusBarHeight,
    right: 6 * theme.baseSpace,
  },
})
