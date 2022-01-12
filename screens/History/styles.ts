import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  webview: {
    backgroundColor: theme.palette.background,
    flex: 1,
  },
  loader: {
    marginTop: 50 * theme.baseSpace,
  },
})
