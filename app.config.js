import 'dotenv/config'

export default {
  name: 'Fina',
  slug: 'fina',
  owner: 'fina-cash',
  version: '1.3.0',
  runtimeVersion: '44',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  icon: './assets/icon.png',
  plugins: ['@config-plugins/react-native-ble-plx', 'expo-community-flipper', 'sentry-expo'],
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
    userInterfaceStyle: 'automatic',
    infoPlist: {
      NSBluetoothAlwaysUsageDescription:
        'Allow $(PRODUCT_NAME) to connect to Ledger Nano X for transaction signing',
      NSBluetoothPeripheralUsageDescription:
        'Allow $(PRODUCT_NAME) to connect to Ledger Nano X for transaction signing',
      NSCameraUsageDescription: 'Allow $(PRODUCT_NAME) to scan QR Code with your camera',
      NSFaceIDUsageDescription: 'Allow $(PRODUCT_NAME) to unlock your wallet with Face ID',
      NSPhotoLibraryUsageDescription:
        "Allow $(PRODUCT_NAME) to access photo library for your recipients' profile images",
    },
  },
  android: {
    package: 'com.fina.cash',
    userInterfaceStyle: 'automatic',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    versionCode: 6,
  },
  web: {
    favicon: './assets/favicon.png',
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
  hooks: {
    postPublish: [
      {
        file: 'sentry-expo/upload-sourcemaps',
        config: {
          organization: 'fina-limited',
          project: 'fina-mobile',
          authToken: process.env.SENTRY_AUTH_TOKEN,
        },
      },
    ],
  },
}
