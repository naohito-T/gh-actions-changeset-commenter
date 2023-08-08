/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: { node: true, es6: true },
  parserOptions: {
    tsconfigRootDir: '.',
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:import/errors',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: ['PascalCase'],
        selector: 'interface',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-empty-function': [
      'warn',
      {
        allow: ['private-constructors'],
      },
    ],
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    'import/extensions': 'off',
    'max-depth': 'error',
    'max-lines': 'error',
    'import/no-cycle': 'warn',
    'no-unsafe-optional-chaining': 'error',
    'sort-imports': 0,
    'import/order': [2, { alphabetize: { order: 'asc' } }],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: true,
      node: {
        extensions: ['.ts'],
      },
    },
  },
};
