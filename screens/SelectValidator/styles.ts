import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  list: {
    backgroundColor: theme.palette.background,
    flex: 1,
  },
  container: {
    paddingBottom: theme.bottomSpace,
  },
  searchBarContainer: {
    backgroundColor: theme.palette.background,
    paddingHorizontal: 4 * theme.baseSpace,
    paddingTop: 4 * theme.baseSpace,
  },
})
