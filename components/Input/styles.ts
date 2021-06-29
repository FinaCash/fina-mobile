import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  searchBar: {
    borderRadius: theme.borderRadius[1],
    paddingVertical: theme.baseSpace * 2,
    paddingHorizontal: theme.baseSpace * 3,
    backgroundColor: theme.palette.grey[2],
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  icon: {
    marginRight: theme.baseSpace * 3,
  },
  input: {
    flex: 1,
  },
})
