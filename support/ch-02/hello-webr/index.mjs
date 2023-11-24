import { WebR } from "webr";

const webR = new WebR();
await webR.init();

let result = await webR.evalR(`set.seed(1999); sample(100, 20)`); // <4>

console.log(await result.toJs());

webR.destroy(result);

process.exit(0)
