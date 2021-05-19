import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  card: {
    borderRadius: theme.borderRadius[1],
    padding: theme.baseSpace * 3,
    backgroundColor: theme.palette.white,
    ...theme.shadow,
  },
})
