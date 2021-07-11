import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  list: {
    backgroundColor: theme.palette.white,
  },
  container: {
    paddingHorizontal: theme.baseSpace * 4,
  },
  title: {
    margin: theme.baseSpace * 2,
  },
})
