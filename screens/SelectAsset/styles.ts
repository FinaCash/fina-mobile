import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  list: {
    backgroundColor: theme.palette.white,
    flex: 1,
  },
  title: {
    margin: theme.baseSpace * 2,
  },
})
