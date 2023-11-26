#!/usr/bin/env node
import { loadPackages } from './src/webrtools.mjs';
import { Command } from 'commander'
import { WebR } from "webr";
import { makeAndMount, appDir, cwd } from './src/utils.mjs';

const program = new Command()

// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson

program
  .name('plotr')
  .description('plotr')
  .version('0.1.0')
  .action(async () => {

    const webR = new WebR();
    await webR.init();

    await loadPackages(webR, appDir('webr_packages'))

    await makeAndMount(webR, cwd, '/cwd')
    await makeAndMount(webR, appDir('fonts'), '/home/web_user/fonts')
    await makeAndMount(webR, appDir('scripts'), '/scripts')
    await makeAndMount(webR, appDir('plots'), '/plots')

    await webR.evalRVoid(`
source("/scripts/plot.R")
`)

    process.exit(0)

  })
  .parse()
