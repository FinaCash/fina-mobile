import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  parentContainer: {
    flex: 1,
  },
  swipeIndicator: {
    width: '30%',
    alignSelf: 'center',
    height: theme.baseSpace,
    backgroundColor: theme.palette.grey[2],
    borderRadius: theme.borderRadius[1],
    marginVertical: 3 * theme.baseSpace,
  },
  searchBarContainer: {
    paddingHorizontal: 4 * theme.baseSpace,
  },
  filterContainer: {
    padding: 4 * theme.baseSpace,
    paddingBottom: 0,
  },
  filterButton: {
    marginRight: theme.baseSpace,
  },
  buttonRow: {
    flexDirection: 'row',
    width: 64 * theme.baseSpace,
    justifyContent: 'space-between',
    marginTop: theme.baseSpace * 6,
  },
  button: {
    backgroundColor: theme.palette.primary + '88',
    width: 30 * theme.baseSpace,
  },
  notiButton: {
    position: 'absolute',
    top: theme.baseSpace * 6 + theme.statusBarHeight,
    right: theme.baseSpace * 6,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.baseSpace * 24 + theme.statusBarHeight,
  },
  modal: {
    borderTopLeftRadius: theme.borderRadius[2],
    borderTopRightRadius: theme.borderRadius[2],
    marginTop: theme.statusBarHeight,
  },
})
