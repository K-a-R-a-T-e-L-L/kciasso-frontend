import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
for (const scope of ["src/app/admin", "src/widgets/admin", "src/shared/admin", "src/shared/ui/admin"]) {
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (file.endsWith(".tsx")) {
        let source = fs.readFileSync(file, "utf8");
        source = source.replace(/\b(on(?:Change|Submit|Input|Drop|Click|MouseDown))=\{\s*e\s*=>/g, "$1={(e: any) =>");
        source = source.replace(/\b(on(?:Change|Submit|Input|Drop|Click|MouseDown))=\{\s*\(e\)\s*=>/g, "$1={(e: any) =>");
        source = source.replace(/\b(on(?:Change|Submit|Input|Drop|Click|MouseDown))=\{\s*\(event\)\s*=>/g, "$1={(event: any) =>");
        fs.writeFileSync(file, source, "utf8");
      }
    }
  };
  walk(path.join(root, scope));
}
