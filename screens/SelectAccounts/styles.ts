import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  list: {
    backgroundColor: theme.palette.background,
    flex: 1,
  },
  emptyContainer: {
    margin: 8 * theme.baseSpace,
    marginTop: 24 * theme.baseSpace,
    alignItems: 'center',
  },
  emptyText: {
    marginVertical: theme.baseSpace * 8,
    alignItems: 'center',
  },
  titleContainer: {
    marginHorizontal: 4 * theme.baseSpace,
    paddingVertical: 4 * theme.baseSpace,
    borderBottomWidth: 1,
    borderColor: theme.palette.border,
    backgroundColor: theme.palette.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
})
