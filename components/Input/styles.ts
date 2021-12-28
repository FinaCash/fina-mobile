import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    borderRadius: theme.borderRadius[0],
    backgroundColor: theme.palette.grey[1],
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  icon: {
    marginRight: theme.baseSpace * 3,
  },
  input: {
    flex: 1,
    color: theme.palette.grey[10],
  },
  marginLeft: {
    marginLeft: theme.baseSpace * 2,
  },
  error: {
    borderWidth: 2,
    borderColor: theme.palette.red,
    margin: -2,
  },
  errorText: {
    marginTop: theme.baseSpace,
  },
})
