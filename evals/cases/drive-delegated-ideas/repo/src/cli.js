import { readFileSync } from "node:fs";
import { report } from "./report.js";

const json = process.argv.includes("--json");
const file = process.argv.filter((a) => !a.startsWith("--"))[2];
const rows = JSON.parse(readFileSync(file, "utf8"));
console.log(json ? JSON.stringify(rows) : report(rows));
