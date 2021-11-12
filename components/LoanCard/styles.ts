import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  card: {
    borderRadius: theme.borderRadius[1],
    borderWidth: 1,
    borderColor: theme.palette.grey[1],
    padding: 4 * theme.baseSpace,
    margin: 4 * theme.baseSpace,
  },
  padded: {
    marginHorizontal: 4 * theme.baseSpace,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8 * theme.baseSpace,
  },
  outerBar: {
    backgroundColor: theme.palette.grey[1],
    height: theme.baseSpace * 2,
    borderRadius: theme.baseSpace,
    marginVertical: theme.baseSpace * 2,
  },
  innerBar: {
    height: theme.baseSpace * 2,
    borderRadius: theme.baseSpace,
  },
  spacedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  flexEndRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  vertDivider: {
    height: theme.baseSpace * 6,
    width: 1,
    backgroundColor: theme.palette.grey[2],
    alignSelf: 'flex-end',
    marginTop: theme.baseSpace * 2,
    marginBottom: theme.baseSpace * -2,
  },
  recommendedLtv: {
    position: 'absolute',
    right: '25%',
  },
  myLtv: {
    position: 'absolute',
    top: theme.baseSpace * 6,
  },
  shortVertDivider: {
    height: theme.baseSpace * 4,
    width: 2,
    backgroundColor: theme.palette.grey[6],
    alignSelf: 'flex-end',
  },
  amountContainer: {
    marginTop: 6 * theme.baseSpace,
    // padding: 3 * theme.baseSpace,
  },
  amountInput: {
    marginVertical: theme.baseSpace * 2,
  },
  verticalDivider: {
    height: theme.baseSpace * 4,
    width: 1,
    backgroundColor: theme.palette.grey[3],
    marginHorizontal: theme.baseSpace * 4,
  },
})
