import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.background,
    paddingHorizontal: theme.baseSpace * 8,
    paddingTop: theme.baseSpace * 28 + theme.statusBarHeight,
    paddingBottom: theme.baseSpace * 8 + theme.bottomSpace,
    flex: 1,
    justifyContent: 'space-between',
  },
  greyConteiner: {
    backgroundColor: theme.palette.altBackground,
    borderRadius: theme.borderRadius[2],
  },
  checkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.baseSpace * 20,
    height: theme.baseSpace * 20,
    borderRadius: theme.baseSpace * 10,
    marginTop: -10 * theme.baseSpace,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4 * theme.baseSpace,
    marginHorizontal: 4 * theme.baseSpace,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  marginBottom: {
    marginBottom: theme.baseSpace,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.border,
  },
  title: {
    marginTop: 12 * theme.baseSpace,
    textAlign: 'center',
  },
  title2: {
    marginTop: 6 * theme.baseSpace,
    marginBottom: 4 * theme.baseSpace,
    textAlign: 'center',
  },
  arrow: {
    alignSelf: 'center',
    // marginVertical: 4 * theme.baseSpace,
  },
})
