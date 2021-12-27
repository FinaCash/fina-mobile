import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.background,
    flex: 1,
    paddingTop: 6 * theme.baseSpace,
  },
  input: {
    marginTop: theme.baseSpace * 2,
    margin: 4 * theme.baseSpace,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 4 * theme.baseSpace,
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
  imageContainer: {
    margin: 2 * theme.baseSpace,
    alignItems: 'center',
  },
  avatar: {
    width: 24 * theme.baseSpace,
    height: 24 * theme.baseSpace,
    borderRadius: 12 * theme.baseSpace,
  },
  button: {
    margin: 4 * theme.baseSpace,
    marginBottom: 4 * theme.baseSpace + theme.bottomSpace,
  },
})
