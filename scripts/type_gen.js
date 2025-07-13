import npm_dts from 'npm-dts';
const { Generator } = npm_dts;
import fsExtra from 'fs-extra';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');

new Generator({
  entry: path.join(SRC_DIR, 'deeplib.ts'),
  output: path.join(DIST_DIR, 'deeplib.d.ts'),
  tsc: `--project ${path.join(__dirname, '../tsconfig.json')}`
})
  .generate()
  .then(() => console.log('Generated types'))
  .catch(console.error);

fsExtra.copy(path.join(SRC_DIR, 'vendored_types'), path.join(DIST_DIR, 'vendored_types'))
  .then(() => console.log('Copied 3rd party types'))
  .catch(console.error);