import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.grey[1],
    padding: theme.baseSpace * 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: theme.baseSpace * 10,
    height: theme.baseSpace * 10,
    borderRadius: theme.baseSpace * 4,
    marginRight: theme.baseSpace * 6,
    backgroundColor: theme.palette.grey[9],
  },
  badge: {
    paddingHorizontal: 1.5 * theme.baseSpace,
    paddingVertical: 1 * theme.baseSpace,
    backgroundColor: theme.palette.red,
    borderRadius: theme.borderRadius[2],
    position: 'absolute',
    top: -2 * theme.baseSpace,
    left: theme.baseSpace * 5,
  },
  rightAligned: {
    alignItems: 'flex-end',
    width: 150,
  },
  longName: {
    width: '100%',
  },
})
