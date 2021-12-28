import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.background,
    flex: 1,
    alignItems: 'center',
    paddingTop: 24 * theme.baseSpace,
  },
  address: {
    marginVertical: 8 * theme.baseSpace,
    marginRight: 2 * theme.baseSpace,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
