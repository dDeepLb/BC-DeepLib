import fsExtra from 'fs-extra';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IN_PUB_DIR = path.join(__dirname, '../public');
const OUT_DIST_DIR = path.join(__dirname, '../dist/public');

fsExtra.copy(IN_PUB_DIR, OUT_DIST_DIR)
  .then(() => console.log('Copied assets'))
  .catch(console.error);