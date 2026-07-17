import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const sourceRoot = path.resolve(__dirname, "..");
const textExtensions = new Set([".css", ".json", ".js", ".jsx", ".md", ".scss", ".ts", ".tsx"]);
const ignoredSegments = new Set([".next", "dist", "generated", "node_modules"]);
const mojibakePatterns = [
  /(?:\u0420[^\x00-\x7F]){2}/u,
  /\u0420[^\x00-\x7F]\u0421[^\x00-\x7F]/u,
  /\u0421[^\x00-\x7F]\u0420[^\x00-\x7F]/u,
  /\u0432\u0402/u,
  /\u0432\u201e/u,
];

function collectSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return ignoredSegments.has(entry.name) ? [] : collectSourceFiles(absolutePath);
    }
    return textExtensions.has(path.extname(entry.name).toLowerCase()) ? [absolutePath] : [];
  });
}

function findMojibake() {
  return collectSourceFiles(sourceRoot).flatMap((filePath) => {
    const content = readFileSync(filePath, "utf8");
    return mojibakePatterns.some((pattern) => pattern.test(content)) ? [path.relative(sourceRoot, filePath)] : [];
  });
}

describe("frontend source encoding", () => {
  it("contains no UTF-8-as-Windows-1251 mojibake", () => {
    expect(findMojibake()).toEqual([]);
  });
});
