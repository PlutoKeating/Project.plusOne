// 扫描 src/scenes/*.tsx，生成 src/registry.ts。
// 动画 id 就是文件名（不含扩展名），页面里用 <div data-anim="文件名"></div> 引用。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dir = path.join(root, "src", "scenes");
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".tsx"))
  .sort();

const lines = ['import type { SceneDef } from "./kit";'];
const entries = [];
files.forEach((f, i) => {
  const id = f.replace(/\.tsx$/, "");
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`场景文件名只能用小写字母、数字和连字符: ${f}`);
  lines.push(`import { scene as s${i} } from "./scenes/${id}";`);
  entries.push(`  "${id}": s${i},`);
});
lines.push("", "export const scenes: Record<string, SceneDef> = {", ...entries, "};", "");
fs.writeFileSync(path.join(root, "src", "registry.ts"), lines.join("\n"));
console.log(`registry: ${files.length} scenes`);
