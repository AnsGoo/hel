import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  external: [],
  iife: {
    name: 'HelHello',
  },
  exports: {
    devExports: 'development'
  },
  platform: 'neutral',
  minify: true,
  clean: true,
});
