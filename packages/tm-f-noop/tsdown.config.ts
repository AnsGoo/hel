import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs', 'iife'],
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: false,
    globalName: 'TMicro_FNoop',
    minify: true,
    external: [],
  },
]);
