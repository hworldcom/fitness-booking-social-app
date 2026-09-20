import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(target);
    return /\.[cm]?[jt]sx?$/.test(entry.name) ? [target] : [];
  });
}

function imports(file: string): string[] {
  const contents = readFileSync(file, "utf8");
  const pattern =
    /(?:import|export)\s+(?:type\s+)?(?:[^"']*?\s+from\s*)?["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']/g;
  return Array.from(
    contents.matchAll(pattern),
    (match) => match[1] || match[2],
  );
}

function resolveImport(file: string, specifier: string): string | undefined {
  if (specifier.startsWith("@/")) return path.resolve(src, specifier.slice(2));
  if (specifier.startsWith("."))
    return path.resolve(path.dirname(file), specifier);
  return undefined;
}

function within(target: string, directory: string) {
  return target === directory || target.startsWith(`${directory}${path.sep}`);
}

test("source imports respect domain, component and feature boundaries", () => {
  const domain = path.join(src, "domain");
  const components = path.join(src, "components");
  const features = path.join(src, "features");
  const server = path.join(src, "server");
  const violations: string[] = [];

  for (const file of sourceFiles(src)) {
    for (const specifier of imports(file)) {
      const target = resolveImport(file, specifier);
      if (!target) continue;
      const relativeFile = path.relative(root, file);

      if (within(file, domain) && !within(target, domain)) {
        violations.push(
          `${relativeFile} imports ${specifier} outside src/domain`,
        );
      }

      if (
        within(file, components) &&
        (within(target, features) || within(target, server))
      ) {
        violations.push(
          `${relativeFile} imports ${specifier} from a feature/server module`,
        );
      }

      if (within(file, features)) {
        if (within(target, server)) {
          violations.push(
            `${relativeFile} imports ${specifier} from src/server`,
          );
          continue;
        }
        if (within(target, features)) {
          const sourceFeature = path
            .relative(features, file)
            .split(path.sep)[0];
          const targetFeature = path
            .relative(features, target)
            .split(path.sep)[0];
          if (sourceFeature !== targetFeature && targetFeature !== "preview") {
            violations.push(
              `${relativeFile} imports sibling feature ${targetFeature} via ${specifier}`,
            );
          }
        }
      }
    }
  }

  assert.deepEqual(violations, []);
});
