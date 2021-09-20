import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  modal: {
    borderTopLeftRadius: theme.borderRadius[2],
    borderTopRightRadius: theme.borderRadius[2],
    padding: theme.baseSpace,
    backgroundColor: theme.palette.white,
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
  padded: {
    marginTop: 3 * theme.baseSpace,
    marginBottom: -2 * theme.baseSpace,
    marginHorizontal: 4 * theme.baseSpace,
  },
})
