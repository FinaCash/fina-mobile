import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  parentContainer: {
    flex: 1,
  },
  filterScrollView: {
    marginBottom: 12 * theme.baseSpace,
    alignSelf: 'stretch',
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
    paddingHorizontal: 4 * theme.baseSpace,
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
  header: {
    alignItems: 'center',
    marginTop: theme.statusBarHeight + 6 * theme.baseSpace,
  },
  modal: {
    borderTopLeftRadius: theme.borderRadius[2],
    borderTopRightRadius: theme.borderRadius[2],
    marginTop: theme.statusBarHeight,
  },
  buttonContainer: {
    padding: 4 * theme.baseSpace,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avgApy: {
    marginLeft: theme.baseSpace * 2,
  },
})
