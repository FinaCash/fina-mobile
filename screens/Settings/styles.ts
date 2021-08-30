import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  list: {
    backgroundColor: theme.palette.white,
  },
  itemContainer: {
    marginHorizontal: 4 * theme.baseSpace,
    paddingVertical: 4 * theme.baseSpace,
    borderBottomWidth: 1,
    borderColor: theme.palette.grey[1],
    backgroundColor: theme.palette.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 12 * theme.baseSpace,
    marginLeft: 4 * theme.baseSpace,
  },
  arrow: {
    marginLeft: 4 * theme.baseSpace,
  },
})
