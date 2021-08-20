import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
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
  },
  verticalDivider: {
    height: theme.baseSpace * 4,
    width: 1,
    backgroundColor: theme.palette.grey[3],
    marginHorizontal: theme.baseSpace * 4,
  },
})
