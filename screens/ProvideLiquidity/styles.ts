import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.background,
    paddingHorizontal: 4 * theme.baseSpace,
    paddingBottom: theme.bottomSpace,
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
