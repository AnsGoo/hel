import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  exports: {
    devExports: 'development',
  },
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  external: ['hel-micro-core', 'hel-types'],
  platform: 'neutral',
  target: 'esnext',
  globalName: 'HelUtils',
  minify: true,
  clean: true,
});
