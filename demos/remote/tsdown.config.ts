import { defineConfig } from 'tsdown';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resolvePath = (name: string) => path.join(process.cwd(), name);
const lib_types_path = resolvePath('src/entrance/libTypes.ts');

export default defineConfig({
  entry: {
    'entry': lib_types_path,
  },
  outDir: 'dist',
  format: ['esm', 'iife'],
  platform: 'neutral',
  clean: false,
});
