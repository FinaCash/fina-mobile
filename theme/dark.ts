import { Platform } from 'react-native'

export default {
  palette: {
    primary: '#0E1E59',
    lightPrimary: '#4361EE',
    secondary: '#432DD9',
    green: '#26BD6B',
    red: '#fb5063',
    yellow: '#EED202',
    grey: [
      '#F2F3F8',
      '#eaebf1',
      '#dfe1eb',
      '#d0d2df',
      '#c2c6d4',
      '#afb2c3',
      '#abaebb',
      '#9b9eb1',
      '#484c63',
      '#2c314b',
      '#1b203b',
    ],
    overlay: '#1b203be6',
    white: '#ffffff',
    facebook: '#3c5898',
    google: '#DB4437',
    background: '#1F2A50',
    border: '#171E39',
    active: '#ffffff',
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
      color: '#ffffff',
      fontFamily: 'PoppinsBold',
      fontSize: 48,
    },
    H2: {
      color: '#ffffff',
      fontFamily: 'PoppinsBold',
      fontSize: 36,
    },
    H3: {
      color: '#ffffff',
      fontFamily: 'PoppinsBold',
      fontSize: 28,
    },
    H4: {
      color: '#ffffff',
      fontFamily: 'RobotoBold',
      fontSize: 24,
    },
    H5: {
      color: '#ffffff',
      fontFamily: 'RobotoBold',
      fontSize: 20,
    },
    H6: {
      color: '#ffffff',
      fontFamily: 'RobotoBold',
      fontSize: 18,
    },
    Large: {
      color: '#dfe1eb',
      fontFamily: 'RobotoRegular',
      fontSize: 16,
    },
    Base: {
      color: '#dfe1eb',
      fontFamily: 'RobotoRegular',
      fontSize: 14,
    },
    Small: {
      color: '#dfe1eb',
      fontFamily: 'RobotoRegular',
      fontSize: 12,
    },
    Mini: {
      color: '#dfe1eb',
      fontFamily: 'RobotoRegular',
      fontSize: 10,
    },
  },
}
