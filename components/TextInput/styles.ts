export default (theme: Theme) => ({
  container: {
    flexDirection: 'row',
  },
  clearButton: {
    marginLeft: theme.baseSpace * 4,
    width: theme.baseSpace * 4,
    height: theme.baseSpace * 4,
    borderRadius: theme.baseSpace * 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[1],
  },
})
