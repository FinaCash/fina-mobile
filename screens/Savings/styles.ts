import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    padding: theme.baseSpace * 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  from: {
    marginBottom: 4 * theme.baseSpace,
    marginTop: 16 * theme.baseSpace,
  },
  to: {
    marginVertical: 4 * theme.baseSpace,
  },
  centered: {
    alignItems: 'center',
  },
  input: {
    ...theme.fonts.H1,
    textAlign: 'center',
    width: '100%',
  },
  avatar: {
    width: theme.baseSpace * 10,
    height: theme.baseSpace * 10,
    borderRadius: '50%',
    marginRight: theme.baseSpace * 6,
  },
  button: {
    marginTop: 12 * theme.baseSpace,
  },
})
