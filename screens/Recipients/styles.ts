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
})
