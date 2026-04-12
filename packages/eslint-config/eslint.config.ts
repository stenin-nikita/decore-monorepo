import { configs, defineConfig } from './src';

export default defineConfig(configs.recommended, {
  ignores: ['./lib'],
});
