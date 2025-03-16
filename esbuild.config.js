/* eslint-disable */

import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import npm_dts from 'npm-dts';
const { Generator } = npm_dts;

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

/** @type {esbuild.BuildOptions} */
const sharedConfig = {
  entryPoints: [path.join(SRC_DIR, 'deep_lib.ts')],
  bundle: true,
  sourcemap: true,
  minify: false,
  target: 'es6',
  platform: 'browser',
  plugins: [
    sassPlugin({
      type: 'css-text',
    })
  ]
};

async function build({ outfile, format }) {
  return esbuild
    .build({
      ...sharedConfig,
      outfile,
      format,
    })
    .catch((error) => {
      process.error('Build failed:', error);
      throw error;
    });
}

build({ outfile: path.join(DIST_DIR, 'deeplib.js'), format: 'esm' });

build({ outfile: path.join(DIST_DIR, 'deeplib.cjs'), format: 'cjs' });

new Generator({
  entry: path.join(SRC_DIR, 'deep_lib.ts'),
  output: path.join(DIST_DIR, 'deeplib.d.ts'),
}).generate();
