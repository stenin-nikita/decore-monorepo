import { configs, defineConfig } from '@decore/eslint-config';

export default defineConfig(configs.recommended, {
  ignores: ['./lib'],
});
