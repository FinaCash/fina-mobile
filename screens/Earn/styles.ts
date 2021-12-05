import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  tabs: {
    paddingTop: theme.baseSpace * 9 + theme.statusBarHeight,
    marginTop: -(theme.baseSpace * 12 + theme.statusBarHeight),
  },
  list: {
    backgroundColor: theme.palette.white,
  },
  titleContainer: {
    marginHorizontal: 4 * theme.baseSpace,
    paddingVertical: 4 * theme.baseSpace,
    borderBottomWidth: 1,
    borderColor: theme.palette.grey[1],
    backgroundColor: theme.palette.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  searchBarContainer: {
    backgroundColor: theme.palette.white,
    paddingHorizontal: 4 * theme.baseSpace,
    paddingTop: 4 * theme.baseSpace,
  },
})
