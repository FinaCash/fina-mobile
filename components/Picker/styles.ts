import { SEARCH_BAR_HEIGHT } from './config'

export default (theme: Theme) => ({
  modal: {
    margin: 0,
    justifyContent: 'flex-start',
  },
  picker: {
    backgroundColor: theme.palette.white,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  pickerItem: {
    borderBottomColor: theme.palette.grey[1],
    borderBottomWidth: 1,
    padding: theme.baseSpace * 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchContainer: {
    borderBottomColor: theme.palette.grey[1],
    borderBottomWidth: 1,
    paddingHorizontal: theme.baseSpace * 4,
    paddingVertical: theme.baseSpace * 3,
    height: SEARCH_BAR_HEIGHT,
  },
})
