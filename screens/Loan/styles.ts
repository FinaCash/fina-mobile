import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.background,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    marginHorizontal: theme.baseSpace * 8,
    marginBottom: theme.baseSpace * 2,
  },
  title: {
    margin: 4 * theme.baseSpace,
  },
})
