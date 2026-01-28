import babel from '@rollup/plugin-babel'; // 支持jsx
import commonjs from '@rollup/plugin-commonjs'; // 支持按commonjs规范来导入外部模块
import resolve from '@rollup/plugin-node-resolve'; // 支持内部的模块路径解析
import terser from '@rollup/plugin-terser';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const external = Object.keys(pkg.peerDependencies || {});
const env = process.env.BUILD_ENV;
const distFileName = 'hel-micro-core';
const globalName = 'HelMicroCore';

const env2outputConf = {
  commonjs: {
    format: 'cjs',
    dir: 'lib',
  },
  es: {
    format: 'es',
    dir: 'es',
  },
  development: {
    format: 'umd',
    file: `dist/${distFileName}.js`,
    name: globalName,
  },
  production: {
    format: 'umd',
    file: `dist/${distFileName}.min.js`,
    name: globalName,
  },
};

const config = {
  input: 'src/index.js',
  external,
  output: {
    ...env2outputConf[env],
    exports: 'named',
    globals: {},
  },
  plugins: [
    resolve(),
    babel({
      exclude: '**/node_modules/**',
      babelHelpers: 'runtime',
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: false, // 使用 core-js 版本，例如 { "version": 3, "proposals": true }
            helpers: true, // 启用辅助函数
            regenerator: true, // 使用 regenerator runtime
          },
        ],
      ],
    }),
    commonjs(),
  ],
};

if (env === 'production') {
  config.plugins.push(
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
    }),
  );
}

export default config;
