import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  parentContainer: {
    flex: 1,
  },
  title: {
    marginTop: 6 * theme.baseSpace,
  },
  swipeIndicator: {
    width: '30%',
    alignSelf: 'center',
    height: theme.baseSpace,
    backgroundColor: theme.palette.border,
    borderRadius: theme.borderRadius[1],
    marginVertical: 3 * theme.baseSpace,
  },
  searchBarContainer: {
    paddingHorizontal: 4 * theme.baseSpace,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.baseSpace * 4,
  },
  iconButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: theme.baseSpace * 6,
    marginBottom: theme.baseSpace * 5,
  },
  iconButton: {
    marginLeft: theme.baseSpace * 8,
  },
  button: {
    backgroundColor: theme.palette.primary + '88',
    flexDirection: 'column',
    width: 20 * theme.baseSpace,
    height: 16 * theme.baseSpace,
    marginHorizontal: 2 * theme.baseSpace,
    justifyContent: 'space-around',
    paddingTop: theme.baseSpace * 3,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.statusBarHeight + 6 * theme.baseSpace,
    marginBottom: 12 * theme.baseSpace,
  },
  modal: {
    borderTopLeftRadius: theme.borderRadius[2],
    borderTopRightRadius: theme.borderRadius[2],
    marginTop: theme.statusBarHeight,
    backgroundColor: theme.palette.background,
  },
  buttonContainer: {
    padding: 4 * theme.baseSpace,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4 * theme.baseSpace,
  },
  avgApr: {
    marginLeft: theme.baseSpace * 2,
  },
  buttonIcon: {
    marginRight: 0,
  },
})
