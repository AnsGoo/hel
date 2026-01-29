import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs', 'iife'],
    external: ['electron'],
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: false,
  },
]);
