import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    vite: 'src/vite/index.ts',
  },
  dts: {
    tsconfig: 'tsconfig.lib.json',
  },
  outDir: 'lib',
  platform: 'node',
  publint: true,
  format: {
    esm: {
      target: ['node20'],
    },
    cjs: {
      target: ['node20'],
      outputOptions: {
        exports: 'named',
      },
    },
  },
});
