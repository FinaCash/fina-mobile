import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.grey[1],
    paddingVertical: theme.baseSpace * 4,
    marginHorizontal: theme.baseSpace * 4,
    overflow: 'hidden',
  },
  avatar: {
    width: theme.baseSpace * 10,
    height: theme.baseSpace * 10,
    borderRadius: theme.baseSpace * 5,
    marginRight: theme.baseSpace * 6,
  },
  rightContainer: {
    flex: 1,
  },
})
