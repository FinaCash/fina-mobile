import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  list: {
    backgroundColor: theme.palette.white,
  },
  titleContainer: {
    marginHorizontal: 4 * theme.baseSpace,
    paddingVertical: 4 * theme.baseSpace,
    borderBottomWidth: 1,
    borderColor: theme.palette.grey[1],
    backgroundColor: theme.palette.white,
  },
  searchBarContainer: {
    backgroundColor: theme.palette.white,
    paddingHorizontal: 4 * theme.baseSpace,
    paddingTop: 4 * theme.baseSpace,
  },
})
