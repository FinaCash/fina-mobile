import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    padding: theme.baseSpace * 4,
    paddingTop: theme.statusBarHeight + theme.baseSpace * 4,
  },
  title: {
    margin: theme.baseSpace * 2,
  },
})
