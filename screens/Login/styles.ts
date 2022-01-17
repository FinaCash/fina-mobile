import { Theme } from '../../types/misc'

export default (theme: Theme) => ({
  container: {
    padding: theme.baseSpace * 12,
    paddingTop: theme.screenHeight * 0.14,
    flex: 1,
  },
  slogan: {
    marginTop: 12 * theme.baseSpace,
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
    marginTop: 16 * theme.baseSpace,
    backgroundColor: theme.palette.altBackground,
    flex: 1,
    margin: theme.baseSpace * -12,
    marginBottom: theme.baseSpace * -120,
    padding: theme.baseSpace * 12,
    borderTopLeftRadius: theme.borderRadius[2],
    borderTopRightRadius: theme.borderRadius[2],
  },
  phraseInput: {
    height: theme.baseSpace * 36,
    backgroundColor: theme.palette.background,
    fontSize: theme.fonts.Large.fontSize,
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
    borderColor: theme.palette.borderButton,
    backgroundColor: 'transparent',
  },
  hdContainer: {
    marginBottom: 16 * theme.baseSpace,
  },
  numberInput: {
    width: theme.baseSpace * 16,
    marginHorizontal: theme.baseSpace * 2,
    backgroundColor: theme.palette.background,
  },
  btnDescription: {
    textAlign: 'center',
    marginBottom: 4 * theme.baseSpace,
    color: theme.palette.grey[6],
  },
})
