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
  .name('rconsole')
  .description('Say things with animals')
  .version('0.1.0')
  .option('-b, --by <what>', 'which animal to use', 'cat')
  .arguments("<message>", "message to say")
  .action(async (message, options) => {

    const webR = new WebR();
    await webR.init();

    globalThis.webR = webR;

    await loadPackages(webR, path.join(__dirname, 'webr_packages'))

    await webR.objs.globalEnv.bind('by', options.by)
    await webR.objs.globalEnv.bind('what', message)

    await webR.evalRVoid(`cowsay::say(what = what, by = by)`); 

    process.exit(0)

  })
  .parse()
