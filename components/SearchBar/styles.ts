export default (theme: Theme) => ({
  container: {
    paddingVertical: theme.baseSpace * 2,
    paddingHorizontal: theme.baseSpace * 3,
    backgroundColor: theme.palette.grey[0],
    borderRadius: theme.borderRadius[0],
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  input: () => ({
    color: theme.palette.grey[9],
    fontFamily: 'MontserratRegular',
    fontSize: 14,
    marginLeft: theme.baseSpace * 2,
    flex: 1,
  }),
})
