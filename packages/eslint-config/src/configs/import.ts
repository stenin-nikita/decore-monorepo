import importPlugin from 'eslint-plugin-import';
import { defineConfig } from 'eslint/config';

const config = defineConfig({
  name: '@decore/eslint-config/import',
  extends: [importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'import/no-named-as-default': 'off',
    'import/first': 'warn',
    'import/no-anonymous-default-export': [
      'warn',
      {
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowArray: true,
        allowArrowFunction: false,
        allowCallExpression: true,
        allowLiteral: true,
        allowObject: true,
      },
    ],
    'import/no-cycle': 'error',
    'import/no-extraneous-dependencies': 'error',
    'import/no-useless-path-segments': 'error',
    'import/order': 'off',
    'import/no-duplicates': 'error',
  },
});

export default config;
