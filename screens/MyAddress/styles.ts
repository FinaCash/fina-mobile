import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.background,
    alignItems: 'center',
    paddingVertical: 8 * theme.baseSpace,
    marginBottom: -4 * theme.baseSpace,
  },
  address: {
    marginRight: 2 * theme.baseSpace,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6 * theme.baseSpace,
    marginBottom: 2 * theme.baseSpace,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: theme.palette.altBackground,
    padding: 8 * theme.baseSpace,
    borderTopLeftRadius: theme.borderRadius[2],
    borderTopRightRadius: theme.borderRadius[2],
  },
  smallMargin: {
    marginBottom: 2 * theme.baseSpace,
  },
  input: {
    marginBottom: 4 * theme.baseSpace,
    backgroundColor: theme.palette.background,
  },
  inputButton: {
    marginBottom: 4 * theme.baseSpace,
    backgroundColor: theme.palette.background,
    borderRadius: theme.borderRadius[0],
    padding: theme.baseSpace * 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 4 * theme.baseSpace,
  },
  borderButton: {
    borderWidth: 1,
    borderColor: theme.palette.borderButton,
    backgroundColor: 'transparent',
    flex: 1,
  },
})
