/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['plugin:@typescript-eslint/recommended', 'next', 'next/core-web-vitals', 'prettier'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowedNames: ['getServerSideProps'],
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: ['PascalCase'],
        selector: 'interface',
      },
    ],
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    'import/extensions': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        aspects: ['invalidHref', 'preferButton'],
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
      },
    ],
    'max-depth': 'error',
    'max-lines': 'error',
    'no-console': [
      'error',
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-unsafe-optional-chaining': 'error',
  },
};
