import { enDictionary } from "../lib/i18n/en.ts";
import { itDictionary } from "../lib/i18n/it.ts";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectLeafPaths(value, prefix = "", paths = new Set()) {
  if (!isPlainObject(value)) {
    if (prefix) {
      paths.add(prefix);
    }
    return paths;
  }

  for (const key of Object.keys(value)) {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    collectLeafPaths(value[key], nextPrefix, paths);
  }

  return paths;
}

function diffPaths(source, target) {
  return [...source].filter((path) => !target.has(path)).sort();
}

const enPaths = collectLeafPaths(enDictionary);
const itPaths = collectLeafPaths(itDictionary);

const missingInIt = diffPaths(enPaths, itPaths);
const missingInEn = diffPaths(itPaths, enPaths);

if (missingInIt.length === 0 && missingInEn.length === 0) {
  console.log("i18n parity check passed: EN and IT key paths match.");
  process.exit(0);
}

console.error("i18n parity check failed.");

if (missingInIt.length > 0) {
  console.error("\nMissing in IT dictionary:");
  for (const key of missingInIt) {
    console.error(`- ${key}`);
  }
}

if (missingInEn.length > 0) {
  console.error("\nMissing in EN dictionary:");
  for (const key of missingInEn) {
    console.error(`- ${key}`);
  }
}

process.exit(1);
