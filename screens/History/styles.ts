import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  webview: {
    backgroundColor: theme.palette.background,
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: 50 * theme.baseSpace,
    left: theme.screenWidth * 0.5 - 4 * theme.baseSpace,
  },
})
