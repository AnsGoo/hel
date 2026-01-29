import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.js'],
  outDir: 'dist',
  format: ['cjs', 'esm', 'iife'],
  dts: false,
  external: ['hel-types', 'hel-utils-base'],
  iife: {
    name: 'HelDevUtilsBase',
  },
  exports: {
    devExports: 'development'
  },
  platform: 'neutral',
  minify: true,
  clean: true,
});
