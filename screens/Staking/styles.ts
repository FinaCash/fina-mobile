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
  avatar: {
    width: theme.baseSpace * 10,
    height: theme.baseSpace * 10,
    borderRadius: theme.baseSpace * 4,
    marginRight: theme.baseSpace * 6,
  },
  validatorButton: {
    marginVertical: theme.baseSpace * 3,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  validatorContainer: {
    marginTop: theme.baseSpace,
    padding: 3 * theme.baseSpace,
  },
})
