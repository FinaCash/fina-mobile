const { getDefaultConfig } = require('@expo/metro-config')

module.exports = (async () => {
  const { resolver, transformer } = getDefaultConfig(__dirname)
  return {
    transformer: {
      ...transformer,
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      ...resolver,
      extraNodeModules: require('node-libs-expo'),
      assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...resolver.sourceExts, 'svg'],
    },
  }
})()
