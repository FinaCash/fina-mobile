import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.baseSpace * 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: theme.baseSpace * 10,
    height: theme.baseSpace * 10,
    borderRadius: '50%',
    marginRight: theme.baseSpace * 6,
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
  },
})
