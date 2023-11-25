#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path'
import { loadPackages } from './src/webrtools.mjs';
import { Command } from 'commander'
import { WebR } from "webr";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command()

program
  .name('doj-scraper')
  .description('scrape the DoJ Jan 6 table to ndjson')
  .version('0.1.0')
  .action(async () => {

		const webR = new WebR();
		await webR.init();

		globalThis.webR = webR;

    await loadPackages(webR, path.join(__dirname, 'webr_packages'))

    // mount our local "scripts" folder
    await webR.FS.mkdir(`/scripts`)
    await webR.FS.mount("NODEFS", { root: path.join(__dirname, 'scripts') }, `/scripts`);

    // source the script
    await webR.evalRVoid(`source("/scripts/doj-scrape.R")`)

    process.exit(0)

  })
  .parse()
