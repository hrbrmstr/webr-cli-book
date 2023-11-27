#!/usr/bin/env node

import { readFileSync } from 'fs';
import * as path from 'path'
import { Command } from 'commander'
import { WebR } from "webr";
import { makeAndMount, appDir, cwd } from './src/utils.mjs';

const program = new Command()

// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson

program
  .name('quake-plot')
  .version('0.1.0')
  .description('Plot magnitude 2.5+ quakes that have happened in the last day')
  .option('-o, --output-dir <dir>', `path to output directory where plots will go (must exist)`, "./")
  .action(async (options) => {

    const webR = new WebR();
    await webR.init();

    await makeAndMount(webR, appDir('pkgs'), '/pkgs')
    await makeAndMount(webR, cwd, '/cwd')

    let plotDir = options.outputDir
    if (plotDir.startsWith("./")) {
      plotDir = path.join(cwd, options.outputDir);
    }

    await makeAndMount(webR, plotDir, '/plots')

    await makeAndMount(webR, appDir('fonts'), '/home/web_user/fonts')
    await makeAndMount(webR, appDir('data'), '/data')
    await makeAndMount(webR, appDir('scripts'), '/scripts')

    await webR.evalRVoid(`.libPaths(c("/pkgs", .libPaths()))`)

    const quakesGeoJSON = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson")
    await webR.objs.globalEnv.bind("quakes_json", await quakesGeoJSON.text());

    await webR.evalRVoid(`source("/scripts/plot.R")`)
    
    process.exit(0)

  })
  .parse()
