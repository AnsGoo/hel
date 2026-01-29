import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.js'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: false,
  external: ['shx'],
  exports: {
    devExports: 'development'
  },
  platform: 'neutral',
  minify: true,
  clean: true,
});
