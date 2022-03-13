import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 0.5 * theme.screenWidth,
    height: (0.5 * theme.screenWidth * 558) / 1800,
  },
})
