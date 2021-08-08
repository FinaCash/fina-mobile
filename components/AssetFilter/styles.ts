import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  filterScrollView: {
    alignSelf: 'stretch',
  },
  filterContainer: {
    paddingHorizontal: 4 * theme.baseSpace,
  },
  filterButton: {
    marginRight: theme.baseSpace,
  },
})
