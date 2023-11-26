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
    await webR.FS.mount("NODEFS", { root: path.join(__dirname, 'fonts') }, `/fonts`);

    await webR.evalRVoid(`
suppressPackageStartupMessages(library(ggplot2))

dir.create("/home/web_user/fonts")

file.copy("/fonts/Inter-Bold.ttf", "/home/web_user/fonts/Inter-Bold.ttf")
file.copy("/fonts/Inter-Italic.ttf", "/home/web_user/fonts/Inter-Italic.ttf")
file.copy("/fonts/Inter-Regular.ttf", "/home/web_user/fonts/Inter-Regular.ttf")

png("/plots/via-r.png", width = 512, height = 512, units = "px")

ggplot() + 
  geom_point(
    data = mtcars, 
    aes(x = mpg, y = disp)
  ) +
  labs(
    title = "Inter Via R"
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
