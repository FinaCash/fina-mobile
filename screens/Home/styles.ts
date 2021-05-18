export default (theme: Theme) => ({
  parentContainer: {
    height: theme.screenHeight - theme.tabBarHeight - theme.bottomSpace,
  },
  container: {
    padding: theme.baseSpace * 6,
  },
  title: {
    marginTop: theme.baseSpace * 4,
    marginBottom: theme.baseSpace * 4,
  },
})
