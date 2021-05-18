module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'prettier/react',
    'plugin:import/typescript',
    'plugin:react-native/all'
  ],
  plugins: ['@typescript-eslint', 'import', 'react', 'react-hooks', 'jsx-a11y', 'prettier', 'react-native'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: `./tsconfig.json`,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    '@typescript-eslint/explicit-function-return-type': 0,
    'import/prefer-default-export': 0,
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
    '@typescript-eslint/interface-name-prefix': ['error', { prefixWithI: 'always' }],
    '@typescript-eslint/camelcase': 0,
    'react/jsx-props-no-spreading': 0,
    '@typescript-eslint/await-thenable': 0,
    'react/prop-types': 0,
    'import/no-cycle': 0,
    'global-require': 0,
    'no-underscore-dangle': 0,
    'import/no-extraneous-dependencies': 0,
    'react/button-has-type': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'consistent-return': 0,
    'no-console': 0,
    '@typescript-eslint/unbound-method': 0,
    '@typescript-eslint/no-misused-promises': 1,
    '@typescript-eslint/prefer-regexp-exec': 0,
    'react-native/no-inline-styles': 0,
  },
  env: {
    'react-native/react-native': true,
  },
}
