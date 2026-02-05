import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.js'],
  outDir: 'dist',
  format: ['cjs', 'esm', 'iife', 'umd'],
  dts: true,
  external: [],
  globalName: 'HelMonoHelper',
  exports: {
    devExports: 'development',
  },
  platform: 'node',
  clean: true,
});
