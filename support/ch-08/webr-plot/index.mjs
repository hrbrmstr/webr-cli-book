#!/usr/bin / env node

import { readFileSync } from 'fs';
import * as path from 'path'
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

    await makeAndMount(webR, appDir('pkgs'), '/pkgs')

    await makeAndMount(webR, cwd, '/cwd')
    await makeAndMount(webR, appDir('fonts'), '/home/web_user/fonts')
    await makeAndMount(webR, appDir('data'), '/data')
    await makeAndMount(webR, appDir('scripts'), '/scripts')
    await makeAndMount(webR, appDir('plots'), '/plots')

    await webR.evalRVoid(`.libPaths(c("/pkgs", .libPaths()))`)

    const quakesGeoJSON = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson")
    await webR.objs.globalEnv.bind("quakes_json", await quakesGeoJSON.text());

    await webR.evalRVoid(`source("/scripts/plot.R")`)
    
    process.exit(0)

  })
  .parse()
