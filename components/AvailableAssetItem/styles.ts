import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.border,
    paddingVertical: theme.baseSpace * 4,
    marginHorizontal: theme.baseSpace * 4,
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
  aprContainer: {
    marginTop: 4 * theme.baseSpace,
    marginLeft: 12 * theme.baseSpace,
    paddingHorizontal: 4 * theme.baseSpace,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightAligned: {
    alignItems: 'flex-end',
    width: 150,
  },
  longName: {
    width: '100%',
  },
})
