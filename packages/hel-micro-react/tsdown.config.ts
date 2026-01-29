import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  external: ['@types/react', '@types/react-dom', 'hel-micro', 'hel-micro-core', 'hel-types', 'react', 'react-dom', 'react-is'],
  iife: {
    name: 'HelMicroReact',
  },
  exports: {
    devExports: 'development'
  },
  platform: 'neutral',
  minify: true,
  clean: true,
});
