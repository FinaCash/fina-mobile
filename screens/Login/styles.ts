import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  screen: {
    flex: 1,
    padding: 8 * theme.baseSpace,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    marginBottom: 60 * theme.baseSpace,
  },
  logo: {
    width: 50 * theme.baseSpace,
    height: 15 * theme.baseSpace,
    marginBottom: 6 * theme.baseSpace,
  },
  googleButton: {
    marginBottom: 2 * theme.baseSpace,
    width: 60 * theme.baseSpace,
    backgroundColor: theme.palette.google,
  },
  facebookButton: {
    marginBottom: 2 * theme.baseSpace,
    width: 60 * theme.baseSpace,
    backgroundColor: theme.palette.facebook,
  },
})
