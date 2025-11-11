module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['react-app', 'react-app/jest'],
  ignorePatterns: ['build', 'dist'],
  globals: {
    kakao: 'readonly',
  },
  rules: {
    'jsx-a11y/no-redundant-roles': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/role-supports-aria-props': 'off',
    'jsx-a11y/heading-has-content': 'off',
    'no-unused-vars': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-loop-func': 'off',
    'no-new-func': 'off',
    'no-script-url': 'off',
    'no-template-curly-in-string': 'off',
  },
};
