import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const scopes = [
  "src/app/admin",
  "src/widgets/admin",
  "src/shared/admin",
  "src/shared/ui/admin",
  "src/shared/lib/theme",
];
const native = /<(div|section|header|footer|main|nav|h[1-6]|p|span|strong|small|button|a|form|label|input|select|textarea|table|img|iframe)(?:\s|\/?>)/g;
const boxNativeControl = /<Box\b[^>]*\bcomponent=["'](input|select|textarea|form|dialog)["'][^>]*>/g;
const boxDialog = /<Box\b[^>]*\brole=["']dialog["'][^>]*>/g;
const mojibake = /(?:Рџ|Рњ|Рљ|С‚|СЃ|вЂ[”–—])/g;
const violations = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.(module\.)?(css|scss|sass)$/.test(entry.name)) {
      violations.push(`${path.relative(root, file)}: CSS module/style file is forbidden in Mantine-only scope`);
    } else if (/\.(tsx|jsx)$/.test(entry.name)) {
      const source = fs.readFileSync(file, "utf8");
      if (source.includes("@/shared/ui/AdminElement") || /\bAdminElement\b/.test(source)) violations.push(`${path.relative(root, file)}: forbidden AdminElement compatibility layer`);
      for (const match of source.matchAll(native)) {
        const line = source.slice(0, match.index).split("\n").length;
        violations.push(`${path.relative(root, file)}:${line}: native JSX <${match[1]}>`);
      }
      for (const match of source.matchAll(boxNativeControl)) {
        const line = source.slice(0, match.index).split("\n").length;
        violations.push(`${path.relative(root, file)}:${line}: Box-backed native ${match[1]} control`);
      }
      for (const match of source.matchAll(boxDialog)) {
        const line = source.slice(0, match.index).split("\n").length;
        violations.push(`${path.relative(root, file)}:${line}: Box-backed dialog`);
      }
      for (const match of source.matchAll(mojibake)) {
        const line = source.slice(0, match.index).split("\n").length;
        violations.push(`${path.relative(root, file)}:${line}: visible mojibake ${match[0]}`);
      }
      for (const pattern of [/window\.confirm\s*\(/, /window\.alert\s*\(/, /window\.prompt\s*\(/, /dangerouslySetInnerHTML\s*=/]) {
        if (pattern.test(source)) violations.push(`${path.relative(root, file)}: forbidden ${pattern}`);
      }
    }
  }
}

for (const scope of scopes) walk(path.join(root, scope));
if (violations.length) {
  console.error(violations.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Admin Mantine policy: PASS");
  console.log("AdminElement=0 CSS_modules=0 native_dialogs=0 Box_native_controls=0 mojibake=0");
}
