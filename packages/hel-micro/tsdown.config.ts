import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm', 'iife', 'umd'],
  dts: true,
  globalName: 'HelMicro',
  external: ['hel-html-parser', 'hel-lib-proxy', 'hel-micro-core', 'hel-types'],
  minify: false,
  clean: true,
  platform: 'neutral',
  exports: {
    devExports: 'development',
  },
});
