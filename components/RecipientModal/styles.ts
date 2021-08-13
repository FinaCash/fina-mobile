import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  modal: {
    borderTopLeftRadius: theme.borderRadius[2],
    borderTopRightRadius: theme.borderRadius[2],
    padding: theme.baseSpace,
  },
  confirmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.baseSpace * 4,
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
  buttonsRow: {
    flexDirection: 'row',
  },
  button: {
    margin: 4 * theme.baseSpace,
    flex: 1,
  },
})
