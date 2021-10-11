import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.white,
    flex: 1,
  },
  card: {
    borderRadius: theme.borderRadius[1],
    borderWidth: 1,
    borderColor: theme.palette.grey[1],
    padding: 4 * theme.baseSpace,
    margin: 4 * theme.baseSpace,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4 * theme.baseSpace,
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
})
