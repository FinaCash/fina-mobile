import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    padding: theme.baseSpace * 12,
    paddingTop: theme.screenHeight * 0.2,
    flex: 1,
    backgroundColor: theme.palette.background,
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
    marginTop: 36 * theme.baseSpace,
  },
  phraseInput: {
    marginTop: 8 * theme.baseSpace,
    height: theme.baseSpace * 30,
  },
  securityReminder: {
    marginTop: -4 * theme.baseSpace,
    marginBottom: 4 * theme.baseSpace,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowButton: {
    flex: 1,
    marginHorizontal: theme.baseSpace,
    marginBottom: theme.baseSpace * 4,
  },
  borderButton: {
    borderWidth: 1,
    borderColor: theme.palette.button,
    backgroundColor: 'transparent',
  },
  hdContainer: {
    marginVertical: 16 * theme.baseSpace,
  },
  numberInput: {
    width: theme.baseSpace * 16,
    marginHorizontal: theme.baseSpace * 2,
  },
})
