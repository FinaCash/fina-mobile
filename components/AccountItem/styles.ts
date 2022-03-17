import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.border,
    paddingVertical: theme.baseSpace * 4,
    marginHorizontal: theme.baseSpace * 4,
    overflow: 'hidden',
    paddingLeft: 4 * theme.baseSpace,
  },
  avatar: {
    marginRight: theme.baseSpace * 6,
  },
  rightContainer: {
    flex: 1,
  },
})
