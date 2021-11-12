import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.white,
    paddingBottom: theme.bottomSpace,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flex: 1,
  },
  button: {
    margin: 4 * theme.baseSpace,
    marginBottom: 4 * theme.baseSpace + theme.bottomSpace,
  },
})
