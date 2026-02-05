import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  external: ['@types/react', '@types/react-dom', 'react', 'react-dom'],
  globalName: 'HeluxMini',
  exports: {
    devExports: 'development',
  },
  platform: 'neutral',
  minify: true,
  clean: true,
});
