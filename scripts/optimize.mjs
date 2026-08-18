/**
 * Find the control setup that maximises the score in the ECO//SIM engine.
 * Coarse grid search (10% steps) then fine hill-climb around the best.
 */
import { readFileSync } from "fs";
import { execSync } from "child_process";

// We'll compile a tiny runner using esbuild on the source, but simpler:
// use the engine source with a minimal types shim and run under tsx if available.
// Check what executors exist:
const avail = execSync("which tsx ts-node-esm node").toString();
console.log("executors:", avail);
