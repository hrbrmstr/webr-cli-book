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

    await webR.FS.mkdir(`/conf`)
    await webR.FS.mkdir(`/home/webr_user`)
    await webR.FS.mkdir(`/home/webr_user/fonts`)
    await webR.FS.mkdir(`/fonts`)
    await webR.FS.mkdir(`/plots`)
    
    await webR.FS.mount("NODEFS", { root: path.join(__dirname, 'conf') }, `/conf`);
    await webR.FS.mount("NODEFS", { root: path.join(__dirname, 'fonts') }, `/home/webr_user/fonts`);
    await webR.FS.mount("NODEFS", { root: path.join(__dirname, 'plots') }, `/plots`);
    
    await webR.evalRVoid(`print(file.remove("/etc/fonts/fonts.conf"))`)
    await webR.evalRVoid(`print(file.copy("/conf/fonts.conf", "/etc/fonts/fonts.conf"))`)

    await webR.evalRVoid(`print(file.remove("/var/cache/fontconfig/3830d5c3ddfd5cd38a049b759396e72e-le32d8.cache-7"))`)
    await webR.evalRVoid(`print(file.remove("/var/cache/fontconfig/CACHEDIR.TAG"))`)

    await webR.evalRVoid(`print(list.files("/", full.names=TRUE, recursive=TRUE, include.dirs=TRUE))`)

    await webR.evalRVoid(`
library(ggplot2)

png(
  filename = "/plots/test.png", 
  width = 500,
  height = 500
)

ggplot() +
  geom_point(
    data = mtcars,
    aes(wt, mpg)
  ) +
  labs(
    title = "Will this work?",
    subtitle = "I hope so.",
    caption = "I am a caption"
  ) +
  theme_minimal(
    base_family = "Inter"
  ) +
  theme(
    plot.title = element_text(family = "Inter", size = 48, face = "bold")
  ) -> gg

plot(gg)

dev.off()
`)

    process.exit(0)

  })
  .parse()
