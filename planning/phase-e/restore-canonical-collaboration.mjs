import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const source = resolve(root, "planning/phase-c/COLLABORATION-GRAPH.json");
const target = resolve(root, "knowledge/github-collaboration.json");
const graph = JSON.parse(readFileSync(source, "utf8"));
if (!Array.isArray(graph.entities) || !Array.isArray(graph.relationships)) throw new Error("Phase-C collaboration graph is not canonical graph-shaped data");
writeFileSync(target, JSON.stringify(graph, null, 2) + "\n");
console.log(JSON.stringify({ source: "planning/phase-c/COLLABORATION-GRAPH.json", target: "knowledge/github-collaboration.json", entities: graph.entities.length, relationships: graph.relationships.length }, null, 2));
