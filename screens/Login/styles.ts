import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    padding: theme.baseSpace * 12,
    justifyContent: 'center',
    flex: 1,
  },
  slogan: {
    alignSelf: 'center',
    marginTop: 4 * theme.baseSpace,
  },
  logo: {
    alignSelf: 'center',
    width: 60 * theme.baseSpace,
    height: (60 * theme.baseSpace * 558) / 1800,
  },
  button: {
    marginBottom: theme.baseSpace * 4,
  },
  contentContainer: {
    height: 0.4 * theme.screenHeight,
    justifyContent: 'flex-end',
  },
  phraseInput: {
    marginVertical: 8 * theme.baseSpace,
    flex: 1,
  },
  securityReminder: {
    marginTop: -4 * theme.baseSpace,
    marginBottom: 4 * theme.baseSpace,
  },
  row: {
    flexDirection: 'row',
  },
  rowButton: {
    flex: 1,
    marginHorizontal: theme.baseSpace,
    marginBottom: theme.baseSpace * 4,
  },
  borderButton: {
    borderWidth: 1,
    borderColor: theme.palette.primary,
    backgroundColor: 'transparent',
  },
})
