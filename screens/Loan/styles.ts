import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.white,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    marginHorizontal: theme.baseSpace * 4,
    marginBottom: theme.baseSpace * 4,
  },
  title: {
    margin: 4 * theme.baseSpace,
  },
})
