import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  top: {
    padding: theme.baseSpace * 10,
    paddingTop: theme.baseSpace * 16 + theme.statusBarHeight,
    marginTop: -(theme.baseSpace * 12 + theme.statusBarHeight),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: theme.borderRadius[1],
    borderWidth: 1,
    borderColor: theme.palette.border,
    padding: 6 * theme.baseSpace,
    marginBottom: 4 * theme.baseSpace,
    marginTop: -theme.borderRadius[1],
    backgroundColor: theme.palette.background,
  },
  padded: {
    marginHorizontal: 4 * theme.baseSpace,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6 * theme.baseSpace,
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
    alignItems: 'flex-end',
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
    height: theme.baseSpace * 4,
    width: 1,
    backgroundColor: theme.palette.grey[2],
    alignSelf: 'flex-end',
    marginTop: theme.baseSpace * -3,
  },
  recommendedLtv: {
    position: 'absolute',
    right: '25%',
  },
  myLtv: {
    position: 'absolute',
    top: theme.baseSpace * -4,
  },
  shortVertDivider: {
    height: theme.baseSpace * 4,
    width: 1,
    backgroundColor: theme.palette.grey[3],
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
