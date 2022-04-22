import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  gutterBottom: {
    marginBottom: theme.baseSpace,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: theme.baseSpace * 10,
    height: theme.baseSpace * 10,
    borderRadius: theme.baseSpace * 4,
    marginRight: theme.baseSpace * 6,
  },
  secondAvatar: {
    width: theme.baseSpace * 6,
    height: theme.baseSpace * 6,
    borderRadius: theme.baseSpace * 4,
    marginRight: theme.baseSpace * 3,
    marginLeft: theme.baseSpace * -9,
    marginTop: theme.baseSpace * 4,
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
  aprContainer: {
    marginTop: 4 * theme.baseSpace,
    marginLeft: 12 * theme.baseSpace,
    paddingLeft: 4 * theme.baseSpace,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
})
