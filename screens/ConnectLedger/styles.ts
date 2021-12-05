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
    marginBottom: 12 * theme.baseSpace,
    textAlign: 'center',
  },
  instruction: {
    marginBottom: 4 * theme.baseSpace,
  },
  button: {
    marginTop: 8 * theme.baseSpace,
  },
  closeButton: {
    position: 'absolute',
    top: 6 * theme.baseSpace + theme.statusBarHeight,
    right: 6 * theme.baseSpace,
  },
  error: {
    marginTop: theme.baseSpace,
  },
  image: {
    alignSelf: 'center',
    marginBottom: theme.baseSpace * 8,
  },
})
