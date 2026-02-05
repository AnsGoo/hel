import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm', 'iife', 'umd'],
  dts: true,
  external: ['hel-micro-core', 'hel-types'],
  globalName: 'HelLibProxy',
  exports: {
    devExports: 'development',
  },
  platform: 'neutral',
  minify: true,
  clean: true,
});
