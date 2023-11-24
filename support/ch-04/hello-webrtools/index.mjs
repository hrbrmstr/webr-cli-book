import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path'
import { loadPackages } from './src/webrtools.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { WebR } from "webr";

const webR = new WebR();
await webR.init();

globalThis.webR = webR; // webrtools needs this

await loadPackages(webR, path.join(__dirname, 'webr_packages'))

await webR.evalRVoid(`cowsay::say("Hello from WebR + Node!")`); // <4>

process.exit(0)
