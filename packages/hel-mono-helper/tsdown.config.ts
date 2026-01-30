import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.js'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  external: [],
  platform: 'node',
  clean: true,
});
