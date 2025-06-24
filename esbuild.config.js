/* eslint-disable */

import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import npm_dts from 'npm-dts';
const { Generator } = npm_dts;
import fsExtra from 'fs-extra';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

esbuild.build({
  entryPoints: [path.join(SRC_DIR, 'deeplib.ts')],
  outfile: path.join(DIST_DIR, 'deeplib.js'),
  format: 'esm',
  bundle: true,
  sourcemap: true,
  keepNames: true,
  target: 'es6',
  platform: 'browser',
  plugins: [
    sassPlugin({
      type: 'css-text',
    })
  ]
}).then(() => {
  console.log(`Successfully bundled deeplib.js`);
}).catch((error) => {
  console.error('Build failed:', error);
  throw error;
});

new Generator({
  entry: path.join(SRC_DIR, 'deeplib.ts'),
  output: path.join(DIST_DIR, 'deeplib.d.ts'),
  tsc: `--project ${path.join(__dirname, 'tsconfig.json')}`
})
.generate()
.then(() => console.log('Generated types'))
.catch(console.error);

fsExtra.copy(path.join(SRC_DIR, '3rd_party_types'), path.join(DIST_DIR, '3rd_party_types'))
.then(() => console.log('Copied 3rd party types'))
.catch(console.error);
