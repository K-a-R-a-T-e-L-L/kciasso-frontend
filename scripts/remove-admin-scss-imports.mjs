import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const scopes = ["src/app/admin", "src/widgets/admin", "src/shared/admin", "src/shared/ui/admin"];
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      let source = fs.readFileSync(file, "utf8");
      source = source.replace(/^import\s+cls\s+from\s+[^;]+\.module\.scss";\s*$/gm, "");
      source = source.replace(/cls\.[A-Za-z0-9_]+/g, '""');
      fs.writeFileSync(file, source, "utf8");
    }
  }
};
for (const scope of scopes) walk(path.join(root, scope));
