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
        const hasClient = source.includes('"use client";');
        source = source.replace(/^import AdminElement from "@\/shared\/ui\/AdminElement";\n/, "");
        source = source.replace(/^import AdminElement from "@\/shared\/ui\/AdminElement";/, "");
        source = source.replace(/^\s*"use client";\s*/, "");
        source = `${hasClient ? '"use client";\n' : ""}import AdminElement from "@/shared/ui/AdminElement";\n${source}`;
        fs.writeFileSync(file, source, "utf8");
      }
    }
  };
  walk(path.join(root, scope));
}
