// 打包网页端动画：输出 docs/assets/anim/plusone-anim.js（Docsify 直接引用）
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

await build({
  entryPoints: [path.join(root, "src", "web", "entry.tsx")],
  outfile: path.join(root, "..", "docs", "assets", "anim", "plusone-anim.js"),
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2019",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "none",
  logLevel: "info",
});
