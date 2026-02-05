import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.js'],
  outDir: 'dist',
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  external: ['axios', 'crypto-js', 'hel-types'],
  iife: {
    name: 'HelpackJsSdk',
  },
  exports: {
    devExports: 'development',
  },
  platform: 'neutral',
  minify: true,
  clean: true,
});
