import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  dts: true,
  format: {
    cjs: {
      name: 'HelHello',
    },
    esm: {
      name: 'HelHello',
    },
    iife: {
      name: 'HelHello',
    },
  },
  external: [],
  exports: {
    devExports: 'development',
  },
  platform: 'neutral',
  minify: true,
  clean: true,
  sourcemap: true,
});
