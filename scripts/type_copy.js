import fsExtra from 'fs-extra';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');

fsExtra.copy(path.join(SRC_DIR, 'vendored_types'), path.join(DIST_DIR, 'vendored_types'))
  .then(() => console.log('Copied 3rd party types'))
  .catch(console.error);