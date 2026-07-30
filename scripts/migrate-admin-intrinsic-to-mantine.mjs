import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const scopes = ["src/app/admin", "src/widgets/admin", "src/shared/admin", "src/shared/ui/admin"];
const files = [];
const tags = new Set();

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.tsx$/.test(entry.name)) files.push(file);
  }
}
for (const scope of scopes) walk(path.join(root, scope));

for (const file of files) {
  let source = fs.readFileSync(file, "utf8");
  const found = [...source.matchAll(/<([a-z][a-z0-9-]*)(?=\s|\/?>)/g)].map((match) => match[1]).filter((tag) => tag !== "html" && tag !== "body");
  if (!found.length) continue;
  for (const tag of found) tags.add(tag);
  source = source.replace(/<([a-z][a-z0-9-]*)(?=\s|\/?>)/g, (full, tag) => tag === "html" || tag === "body" ? full : `<AdminElement as="${tag}"`);
  source = source.replace(/<\/([a-z][a-z0-9-]*)>/g, (full, tag) => tag === "html" || tag === "body" ? full : "</AdminElement>");
  if (!source.includes('from "@/shared/ui/AdminElement"')) {
    const marker = source.startsWith('"use client";') ? '"use client";\n' : "";
    source = source.startsWith(marker) ? `${marker}import AdminElement from "@/shared/ui/AdminElement";\n${source.slice(marker.length)}` : `import AdminElement from "@/shared/ui/AdminElement";\n${source}`;
  }
  fs.writeFileSync(file, source, "utf8");
}
console.log(`Migrated ${files.length} admin TSX files through Mantine AdminElement; tags: ${[...tags].sort().join(", ")}`);
