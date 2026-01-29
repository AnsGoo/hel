import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  external: ['hel-html-parser', 'hel-lib-proxy', 'hel-micro-core', 'hel-types'],
  minify: false,
  clean: true,
});
