import 'dotenv/config'

export default {
  name: 'Fina Wallet',
  slug: 'fina',
  owner: 'fina-cash',
  version: '1.0.0',
  runtimeVersion: '44',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  icon: './assets/icon.png',
  plugins: ['@config-plugins/react-native-ble-plx'],
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/c124fefd-261e-4dee-a6f4-f93f629894bd',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'com.fina.cash',
    supportsTablet: true,
    userInterfaceStyle: 'automatic',
  },
  android: {
    package: 'com.fina.cash',
    userInterfaceStyle: 'automatic',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    torusProjectId: process.env.TORUS_PROJECT_ID,
    defaultAvatarUrl: process.env.DEFAULT_AVATAR_URL,
  },
  packagerOpts: {
    config: 'metro.config.js',
    sourceExts: [
      'expo.ts',
      'expo.tsx',
      'expo.js',
      'expo.jsx',
      'ts',
      'tsx',
      'js',
      'jsx',
      'json',
      'wasm',
      'svg',
    ],
  },
}
