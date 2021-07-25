import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.white,
    padding: 4 * theme.baseSpace,
    paddingBottom: theme.bottomSpace,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flex: 1,
  },
  card: {
    borderRadius: theme.borderRadius[1],
    borderWidth: 1,
    borderColor: theme.palette.grey[1],
  },
  amountContainer: {
    marginTop: theme.baseSpace,
    padding: 3 * theme.baseSpace,
  },
  amountInput: {
    marginVertical: theme.baseSpace * 2,
  },
  row: {
    flexDirection: 'row',
    marginLeft: theme.baseSpace * 2,
  },
  verticalDivider: {
    height: theme.baseSpace * 4,
    width: 1,
    backgroundColor: theme.palette.grey[3],
    marginHorizontal: theme.baseSpace * 4,
  },
  button: {
    marginBottom: 4 * theme.baseSpace,
  },
})
