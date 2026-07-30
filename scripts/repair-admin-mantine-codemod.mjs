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
        let text = fs.readFileSync(file, "utf8");
        text = text.replace(/<AdminElement as="(number|string|typeof|void)"/g, "<$1");
        fs.writeFileSync(file, text, "utf8");
      }
    }
  };
  walk(path.join(root, scope));
}
