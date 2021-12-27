import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  list: {
    backgroundColor: theme.palette.background,
  },
  itemContainer: {
    marginHorizontal: 4 * theme.baseSpace,
    paddingVertical: 4 * theme.baseSpace,
    borderBottomWidth: 1,
    borderColor: theme.palette.border,
    backgroundColor: theme.palette.background,
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
  version: {
    alignSelf: 'center',
    marginTop: 4 * theme.baseSpace,
  },
})
