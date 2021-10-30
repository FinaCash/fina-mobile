import { Platform } from 'react-native'

export default {
  palette: {
    primary: '#0E1E59',
    secondary: '#432DD9',
    green: '#26BD6B',
    red: '#fb5063',
    grey: [
      '#0d0c07',
      '#15140e',
      '#201e14',
      '#2f2d20',
      '#3d392b',
      '#504d3c',
      '#64614e',
      '#908d76',
      '#b7b39c',
      '#d3ceb4',
      '#e4dfc4',
    ],
    overlay: '#e4dfc4e6',
    white: '#111111',
    facebook: '#3c5898',
    google: '#DB4437',
  },
  gradients: {
    primary: ['#432DD9', '#2FC3FF'],
    error: ['#FFAD85', '#FD4E76'],
  },
  baseSpace: 4,
  tabBarHeight: Platform.OS === 'web' ? 64 : 32,
  shadow: {
    shadowColor: '#e4dfc4',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 1,
  },
  borderRadius: [8, 16, 24],
  fonts: {
    H1: {
      color: '#e4dfc4',
      fontFamily: 'PoppinsBold',
      fontSize: 48,
    },
    H2: {
      color: '#e4dfc4',
      fontFamily: 'PoppinsBold',
      fontSize: 36,
    },
    H3: {
      color: '#e4dfc4',
      fontFamily: 'PoppinsBold',
      fontSize: 28,
    },
    H4: {
      color: '#e4dfc4',
      fontFamily: 'RobotoBold',
      fontSize: 24,
    },
    H5: {
      color: '#e4dfc4',
      fontFamily: 'RobotoBold',
      fontSize: 20,
    },
    H6: {
      color: '#e4dfc4',
      fontFamily: 'RobotoBold',
      fontSize: 18,
    },
    Large: {
      color: '#d3ceb4',
      fontFamily: 'RobotoRegular',
      fontSize: 16,
    },
    Base: {
      color: '#d3ceb4',
      fontFamily: 'RobotoRegular',
      fontSize: 14,
    },
    Small: {
      color: '#d3ceb4',
      fontFamily: 'RobotoRegular',
      fontSize: 12,
    },
    Mini: {
      color: '#d3ceb4',
      fontFamily: 'RobotoRegular',
      fontSize: 10,
    },
  },
}
