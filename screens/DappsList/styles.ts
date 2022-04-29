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
  innerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.border,
    marginHorizontal: theme.baseSpace * 4,
    paddingVertical: theme.baseSpace * 4,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: theme.baseSpace * 10,
    height: theme.baseSpace * 10,
    borderRadius: theme.baseSpace * 4,
    marginRight: theme.baseSpace * 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gutterBottom: {
    marginBottom: theme.baseSpace,
  },
})
