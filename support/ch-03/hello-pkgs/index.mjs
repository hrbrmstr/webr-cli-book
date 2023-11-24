import { WebR } from "webr";

const webR = new WebR();
await webR.init();

await webR.installPackages([ 'cowsay' ], { quiet: true })

await webR.evalRVoid(`cowsay::say("Hello from WebR + Node!")`); // <4>

process.exit(0)
