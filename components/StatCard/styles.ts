import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.altBackground,
    borderRadius: theme.borderRadius[1],
    paddingHorizontal: theme.baseSpace * 4,
    paddingVertical: theme.baseSpace * 3,
    margin: 4 * theme.baseSpace,
    flex: 1,
  },
  title: {
    marginBottom: theme.baseSpace,
  },
})
