import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs', 'iife'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake: false,
    globalName: 'TMicro_FGuard',
    minify: true,
    external: [],
  },
]);
