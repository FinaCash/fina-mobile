import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    alignItems: 'center',
  },
  chart: {
    width: theme.baseSpace * 50,
    height: theme.baseSpace * 50,
  },
  title: {
    marginTop: -35 * theme.baseSpace,
  },
  legends: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 22 * theme.baseSpace,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.baseSpace,
  },
  colorPad: {
    width: theme.baseSpace * 3,
    height: theme.baseSpace * 3,
    borderRadius: theme.borderRadius[0],
    marginHorizontal: theme.baseSpace * 2,
  },
})
