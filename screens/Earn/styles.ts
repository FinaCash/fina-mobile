import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  tabbar: {
    backgroundColor: theme.palette.background,
    borderBottomWidth: 0.8,
    borderColor: theme.palette.border,
  },
  tabLabel: {
    ...theme.fonts.Large,
    color: theme.palette.active,
    textTransform: 'none',
  },
  tabIndicator: {
    backgroundColor: theme.palette.active,
    height: theme.baseSpace / 2,
  },
  list: {
    backgroundColor: theme.palette.background,
    flex: 1,
  },
  titleContainer: {
    marginHorizontal: 4 * theme.baseSpace,
    paddingVertical: 4 * theme.baseSpace,
    borderBottomWidth: 1,
    borderColor: theme.palette.border,
    backgroundColor: theme.palette.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  searchBarContainer: {
    backgroundColor: theme.palette.background,
    paddingHorizontal: 4 * theme.baseSpace,
    paddingTop: 4 * theme.baseSpace,
  },
  buttonsRow: {
    flexDirection: 'row',
  },
  stakingButton: {
    flex: 1,
    marginHorizontal: theme.baseSpace * 4,
    marginBottom: theme.baseSpace * 2,
  },
  centered: {
    alignItems: 'center',
  },
  margin: {
    margin: 4 * theme.baseSpace,
  },
  tabButton: {
    marginHorizontal: 2 * theme.baseSpace,
    width: '25%',
  },
  farmTabs: {
    paddingLeft: 2 * theme.baseSpace,
    marginVertical: 2 * theme.baseSpace,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sectionHeader: {
    flexDirection: 'row',
    paddingHorizontal: 2 * theme.baseSpace,
    marginHorizontal: 4 * theme.baseSpace,
    borderBottomWidth: 1,
    borderColor: theme.palette.border,
    justifyContent: 'space-between',
    paddingTop: 2 * theme.baseSpace,
    paddingBottom: theme.baseSpace,
  },
})
