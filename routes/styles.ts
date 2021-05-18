export default (theme: Theme) => ({
  scene: {
    backgroundColor: theme.palette.grey[0],
  },
  tabBar: {
    backgroundColor: theme.palette.white,
    borderTopWidth: 0,
    marginBottom: '$spaceBase + $bottomSpace',
    paddingTop: 4 * theme.baseSpace,
    paddingBottom: 4 * theme.baseSpace + theme.bottomSpace,
    height: theme.tabBarHeight + theme.bottomSpace,
    position: 'absolute',
    ...theme.shadow,
  },
  raisedTab: {
    backgroundColor: theme.palette.primary,
    height: theme.tabBarHeight + 2 * theme.baseSpace,
    width: theme.tabBarHeight + 2 * theme.baseSpace,
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -4 * theme.baseSpace,
    ...theme.shadow,
  },
})
