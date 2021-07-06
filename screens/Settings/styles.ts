import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    padding: theme.baseSpace * 6,
    marginTop: theme.statusBarHeight,
  },
})
