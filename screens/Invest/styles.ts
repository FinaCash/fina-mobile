import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  list: {
    backgroundColor: theme.palette.white,
  },
  searchBarContainer: {
    backgroundColor: theme.palette.white,
    paddingHorizontal: 4 * theme.baseSpace,
    paddingTop: 4 * theme.baseSpace,
  },
})
