import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  scrollContainer: {
    backgroundColor: theme.palette.background,
  },
  container: {
    padding: theme.baseSpace * 6,
    flex: 1,
  },
  input: {
    marginBottom: 6 * theme.baseSpace,
  },
  seedInput: {
    height: 36 * theme.baseSpace,
    marginBottom: 6 * theme.baseSpace,
  },
  label: {
    marginBottom: theme.baseSpace * 2,
  },
  warning: {
    marginBottom: theme.baseSpace * 4,
  },
  error: {
    color: theme.palette.red,
    marginTop: theme.baseSpace * -6,
    marginBottom: theme.baseSpace * 2,
  },
  marginTop: {
    marginTop: 4 * theme.baseSpace,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hdContainer: {
    marginBottom: 8 * theme.baseSpace,
  },
  numberInput: {
    width: theme.baseSpace * 16,
    marginHorizontal: theme.baseSpace * 2,
  },
})
