module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['react-app', 'react-app/jest'],
  ignorePatterns: ['build', 'dist', 'legacy-templates'],
  globals: {
    kakao: 'readonly',
  },
  rules: {
    'jsx-a11y/no-redundant-roles': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'no-new-func': 'off',
    'no-script-url': 'off',
    'no-template-curly-in-string': 'off',
  },
};
