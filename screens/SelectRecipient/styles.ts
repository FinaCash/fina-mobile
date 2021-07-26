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
  confirmMiodalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3 * theme.baseSpace,
    marginHorizontal: 4 * theme.baseSpace,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.grey[1],
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  marginBottom: {
    marginBottom: theme.baseSpace,
  },
  modalButton: {
    margin: 4 * theme.baseSpace,
  },
})
