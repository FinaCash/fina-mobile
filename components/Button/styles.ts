import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: 2 * theme.baseSpace,
  },
})
