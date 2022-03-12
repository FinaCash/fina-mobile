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
    flex: 1,
  },
  avatar: {
    width: theme.baseSpace * 10,
    height: theme.baseSpace * 10,
    borderRadius: theme.baseSpace * 4,
    marginRight: theme.baseSpace * 6,
  },
  toAvatar: {
    width: theme.baseSpace * 10,
    height: theme.baseSpace * 10,
    borderRadius: theme.baseSpace * 4,
    borderWidth: theme.baseSpace / 2,
    borderColor: theme.palette.white,
    marginLeft: -theme.baseSpace * 10,
    marginRight: theme.baseSpace * 2,
  },
  name: {
    maxWidth: theme.screenWidth / 2 - theme.baseSpace * 26,
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
    marginLeft: 16 * theme.baseSpace,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  barContainer: {
    marginLeft: 16 * theme.baseSpace,
  },
  outerBar: {
    backgroundColor: theme.palette.grey[1],
    height: theme.baseSpace,
    borderRadius: theme.baseSpace,
    marginVertical: theme.baseSpace * 2,
  },
  innerBar: {
    height: theme.baseSpace,
    borderRadius: theme.baseSpace,
  },
})
