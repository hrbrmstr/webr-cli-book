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
  .name('plotr')
  .description('plotr')
  .version('0.1.0')
  .action(async () => {

    const webR = new WebR();
    await webR.init();

    globalThis.webR = webR;

    await loadPackages(webR, path.join(__dirname, 'webr_packages'))

    await webR.FS.mkdir(`/plots`)
    await webR.FS.mount("NODEFS", { root: path.join(__dirname, 'plots') }, `/plots`);

    await webR.FS.mkdir(`/fonts`)
    await webR.FS.mkdir(`/home/web_user/fonts`)
    await webR.FS.mount("NODEFS", { root: path.join(__dirname, 'fonts') }, `/home/web_user/fonts`);

    await webR.evalRVoid(`
suppressPackageStartupMessages(library(ggplot2))

png("/plots/via-js.png", width = 512, height = 512, units = "px")

ggplot() + 
  geom_point(
    data = mtcars, 
    aes(x = mpg, y = disp)
  ) +
  labs(
    title = "Inter Via JS"
  ) +
  theme_minimal(
    base_family = "Inter"
  ) +
  theme(
    plot.title = element_text(size = 48, face = "bold")
  ) -> gg

plot(gg)

dev.off()
`)

    process.exit(0)

  })
  .parse()
