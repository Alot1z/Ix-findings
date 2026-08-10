// Deterministic assembly of planning/wiki/index-standalone.html from sources.
//
//   SOURCE                        DERIVED
//   standalone-template.html  ─┐
//   assets/wiki.css           ─┤  ──►  index-standalone.html
//   data/data.js              ─┤        (build-data.mjs generates data.js)
//   assets/wiki.js            ─┘
//
// Run from workspace root:  node planning/wiki/build-standalone.mjs
// Reproducibility: running twice on the same sources produces byte-identical
// output (no timestamps, no absolute paths, no machine-specific values).
// Line endings are normalized to LF so the output matches the canonical
// committed blob regardless of the platform's autocrlf setting.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

const template = readFileSync(join(here, "standalone-template.html"), "utf8").replace(/\r\n/g, "\n");
const css = readFileSync(join(here, "assets/wiki.css"), "utf8").replace(/\r\n/g, "\n");
const data = readFileSync(join(here, "data/data.js"), "utf8").replace(/\r\n/g, "\n");
const js = readFileSync(join(here, "assets/wiki.js"), "utf8").replace(/\r\n/g, "\n");

const missing = [];
if (!template.includes("@@IX_CSS@@")) missing.push("@@IX_CSS@@ marker");
if (!template.includes("@@IX_DATA@@")) missing.push("@@IX_DATA@@ marker");
if (!template.includes("@@IX_JS@@")) missing.push("@@IX_JS@@ marker");
if (missing.length) {
  console.error("FATAL: template missing markers — " + missing.join(", "));
  process.exit(1);
}

const out =
  template
    .replace("@@IX_CSS@@", css)
    .replace("@@IX_DATA@@", data)
    .replace("@@IX_JS@@", js);

writeFileSync(join(here, "index-standalone.html"), out, "utf8");
console.log(
  "Wrote planning/wiki/index-standalone.html (" + out.length + " bytes, LF-only: " + !out.includes("\r") + ")"
);
