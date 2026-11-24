import { slugify } from "./slug.js";
import { recordCliRun } from "../record-cli.mjs";

const input = process.argv[2] ?? "";
const result = slugify(input);
if (!result) {
  console.error("Input produced an empty slug");
  recordCliRun(input, 1);
  process.exit(1);
}
console.log(result);
recordCliRun(input, 0);
