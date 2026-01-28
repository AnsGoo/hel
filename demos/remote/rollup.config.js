import typescript from '@rollup/plugin-typescript';
import helDevUtils from 'hel-dev-utils';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from './package.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cst = helDevUtils.cst;
const resolvePath = (name) => path.join(process.cwd(), name);
const lib_types_path = resolvePath('src/entrance/libTypes.ts');

const plugins = [typescript()];

export default [
  {
    input: lib_types_path,
    plugins,
    output: {
      format: 'esm',
      name: pkg.appGroupName,
      file: `${cst.HEL_PROXY_DIR}_es/entry.js`,
    },
  },
  {
    input: lib_types_path,
    plugins,
    output: {
      format: 'umd',
      name: pkg.appGroupName,
      file: `${cst.HEL_PROXY_DIR}/entry.js`,
    },
  },
];
