import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.background,
    padding: 4 * theme.baseSpace,
    paddingBottom: theme.bottomSpace,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flex: 1,
  },
  button: {
    marginBottom: 4 * theme.baseSpace + theme.bottomSpace,
  },
  arrow: {
    alignSelf: 'center',
    marginVertical: 4 * theme.baseSpace,
  },
})
