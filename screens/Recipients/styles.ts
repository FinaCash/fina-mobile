import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  list: {
    backgroundColor: theme.palette.white,
    flex: 1,
  },
  button: {
    margin: 4 * theme.baseSpace,
  },
})
