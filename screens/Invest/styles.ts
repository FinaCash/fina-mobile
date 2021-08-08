import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  list: {
    backgroundColor: theme.palette.white,
  },
  title: {
    margin: theme.baseSpace * 2,
  },
})
