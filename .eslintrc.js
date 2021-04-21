module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],

  // in antd-design-pro
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
  },

  rules: {
    '@typescript-eslint/consistent-type-imports': 0,
    'import/no-named-as-default': 0,
    'react/self-closing-comp': 1,
    'react-hooks/exhaustive-deps': 'error',
  },
};
