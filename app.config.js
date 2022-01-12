import 'dotenv/config'

export default {
  name: 'Fina Wallet',
  slug: 'fina',
  owner: 'fina-cash',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  plugins: ['@config-plugins/react-native-ble-plx'],
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'com.fina.wallet',
    supportsTablet: true,
  },
  android: {
    package: 'com.fina.wallet',
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
