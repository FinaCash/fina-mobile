import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    borderRadius: theme.borderRadius[1],
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...theme.shadow,
  },
  iconContainer: {
    marginRight: 2 * theme.baseSpace,
  },
})
