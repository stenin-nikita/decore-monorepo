import prettier from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';

import baseConfig from './configs/base';
import importConfig from './configs/import';
import reactConfig from './configs/react';
import typescriptConfig from './configs/typescript';

const recommended = defineConfig(baseConfig, typescriptConfig, importConfig, prettier);
const react = defineConfig(reactConfig);

const configs = {
  recommended,
  react,
};

export { defineConfig, configs };
