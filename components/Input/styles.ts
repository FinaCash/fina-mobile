import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    borderRadius: theme.borderRadius[0],
    backgroundColor: theme.palette.altBackground,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  icon: {
    marginRight: theme.baseSpace * 3,
  },
  input: {
    flex: 1,
    textAlignVertical: 'top',
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
