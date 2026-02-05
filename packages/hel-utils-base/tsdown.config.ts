import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.js'],
  outDir: 'dist',
  format: ['cjs', 'esm', 'iife', 'umd'],
  dts: true, 
  globalName: 'HelUtilsBase',
  external: [],
  exports: {
    devExports: 'development',
  },
  platform: 'neutral',
  minify: true,
  clean: true,
});
