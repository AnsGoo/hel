import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs', 'iife'],
    external: ['electron'],
    outDir: 'dist',
    platform: 'node',
    minify: true,
    clean: true,
    dts: true,
    sourcemap: true,
    globalName: 'HelMicroNode',
    exports: {
      devExports: 'development',
    },
  },
]);
