import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.white,
    padding: 4 * theme.baseSpace,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    marginTop: 2 * theme.baseSpace,
  },
  image: {
    width: 16 * theme.baseSpace,
    height: 16 * theme.baseSpace,
    borderRadius: theme.borderRadius[1],
    marginBottom: theme.baseSpace * 3,
  },
  amount: {
    marginBottom: theme.baseSpace,
  },
  card: {
    borderRadius: theme.borderRadius[1],
    borderWidth: 1,
    borderColor: theme.palette.grey[1],
    padding: 3 * theme.baseSpace,
    marginTop: 8 * theme.baseSpace,
  },
  input: {
    marginTop: theme.baseSpace * 2,
  },
  button: {
    marginBottom: 4 * theme.baseSpace + theme.bottomSpace,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    paddingRight: theme.baseSpace,
  },
  iconButton: {
    width: theme.baseSpace * 5,
    height: theme.baseSpace * 5,
    marginLeft: theme.baseSpace * 4,
  },
  addButton: {
    marginTop: 2 * theme.baseSpace,
  },
})
