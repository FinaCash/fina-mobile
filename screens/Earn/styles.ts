import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  tabbar: { backgroundColor: theme.palette.white },
  tabLabel: {
    ...theme.fonts.Large,
    color: theme.palette.primary,
    textTransform: 'none',
  },
  tabIndicator: { backgroundColor: theme.palette.primary, height: theme.baseSpace / 2 },
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
