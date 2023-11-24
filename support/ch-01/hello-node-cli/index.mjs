import { basename } from 'path'

if (process.argv.length > 2) {
  console.log(`Hello, ${process.argv[ 2 ]}`);
  process.exit(0);
} else {
  console.log(`Usage: ${process.argv.slice(0, 2).map(d => basename(d)).join(" ")} <parameter>`);
}