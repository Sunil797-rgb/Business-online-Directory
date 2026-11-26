// Build a fully static, hostable copy of Thok Bazar in demo mode.
//
//   node preview/build.mjs
//
// `src/` is never modified: it is copied to .preview-build/src and the files
// in preview/overlay/ are laid on top. See preview/README.md for what the
// overlay changes and why.

import {
  cp,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  symlink,
  writeFile,
} from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const work = path.join(root, ".preview-build");
const outDir = path.join(root, "preview-out");

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: "inherit", env: { ...process.env } });
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited with ${code}`)),
    );
  });
}

async function countFiles(dir) {
  let n = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    n += entry.isDirectory() ? await countFiles(full) : 1;
  }
  return n;
}

await rm(work, { recursive: true, force: true });
await rm(outDir, { recursive: true, force: true });
await mkdir(work, { recursive: true });

// 1. The app, untouched.
await cp(path.join(root, "src"), path.join(work, "src"), { recursive: true });
await cp(path.join(root, "public"), path.join(work, "public"), { recursive: true }).catch(() => {});

// 2. Overlay the preview-only replacements.
await cp(path.join(root, "preview/overlay"), path.join(work, "src"), {
  recursive: true,
  force: true,
});

// 3. Drop what a static export cannot run.
// robots.txt and sitemap.xml are route handlers: `output: export` needs them
// marked force-static, and a shared preview should not be indexed anyway.
for (const gone of [
  "src/proxy.ts",
  "src/app/auth",
  "src/lib/search.test.ts",
  "src/app/robots.ts",
  "src/app/sitemap.ts",
]) {
  await rm(path.join(work, gone), { recursive: true, force: true });
}

// 4. Config for a static export.
await writeFile(
  path.join(work, "next.config.ts"),
  `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Directory-index layout: /suppliers -> suppliers/index.html, which is what
  // every ordinary static host serves.
  trailingSlash: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
`,
);

await cp(path.join(root, "postcss.config.mjs"), path.join(work, "postcss.config.mjs"));
await cp(path.join(root, "package.json"), path.join(work, "package.json"));
await writeFile(
  path.join(work, "tsconfig.json"),
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./src/*"] },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"],
    },
    null,
    2,
  ),
);

// 5. Share the installed dependencies rather than reinstalling.
if (!existsSync(path.join(work, "node_modules"))) {
  await symlink(path.join(root, "node_modules"), path.join(work, "node_modules"), "dir");
}

// 6. Build.
await run("npx", ["next", "build"], work);

await cp(path.join(work, "out"), outDir, { recursive: true });

// 7. Make the output hostable where paths may not begin with "_".
//
// Next emits its assets under /_next/ and one RSC prefetch payload per route
// named __next.*.txt. Some static hosts (the artifact host among them) reserve
// a leading underscore for their own use, so:
//   * /_next/ is renamed to /znext/ — same length, so a plain string swap
//     across every emitted text file is safe;
//   * the __next.*.txt payloads are dropped. Their names are built by the
//     client runtime at navigation time, so they cannot be renamed to match.
//     Without them, Next's link prefetch misses and the router falls back to
//     an ordinary full page load. Every page still works; navigation is just
//     not client-side.
async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

for (const file of await walk(outDir)) {
  if (file.endsWith(".txt")) await rm(file);
}
await rm(path.join(outDir, "_not-found"), { recursive: true, force: true });
await rename(path.join(outDir, "_next"), path.join(outDir, "znext"));

// Next's three build manifests also lead with an underscore. Same-length
// renames again, so the string swap below cannot shift anything.
const RENAMES = [
  ["/_next/", "/znext/"],
  ["_buildManifest.js", "zbuildManifest.js"],
  ["_ssgManifest.js", "zssgManifest.js"],
  ["_clientMiddlewareManifest.js", "zclientMiddlewareManifest.js"],
];

for (const file of await walk(outDir)) {
  const base = path.basename(file);
  const rename_to = RENAMES.find(([from]) => from === base)?.[1];
  if (rename_to) await rename(file, path.join(path.dirname(file), rename_to));
}

const TEXT = new Set([".html", ".js", ".css", ".json", ".map"]);
let rewritten = 0;
for (const file of await walk(outDir)) {
  if (!TEXT.has(path.extname(file))) continue;
  const body = await readFile(file, "utf8");
  let next = body;
  for (const [from, to] of RENAMES) next = next.replaceAll(from, to);
  if (next === body) continue;
  await writeFile(file, next);
  rewritten += 1;
}
console.log(`rewrote reserved "_" paths in ${rewritten} files`);

// Next ships a percent-decoding routine that embeds a literal U+FFFD (the
// replacement character it substitutes for invalid UTF-8). Some hosts reject
// text files containing it. Inside a JS string literal "\uFFFD" is exactly the
// same value, so swap the raw character for its escape and re-check the file
// still parses.
let escaped = 0;
for (const file of await walk(outDir)) {
  if (path.extname(file) !== ".js") continue;
  const body = await readFile(file, "utf8");
  if (!body.includes("\uFFFD")) continue;
  await writeFile(file, body.replaceAll("\uFFFD", "\\uFFFD"));
  await run("node", ["--check", file], outDir);
  escaped += 1;
}
if (escaped) console.log(`escaped U+FFFD in ${escaped} file(s)`);

const leftover = (await walk(outDir)).filter((f) =>
  path.relative(outDir, f).split(path.sep).some((part) => part.startsWith("_")),
);
if (leftover.length) {
  throw new Error(`paths still start with "_":\n  ${leftover.join("\n  ")}`);
}

const total = await countFiles(outDir);
const { size } = await stat(path.join(outDir, "index.html"));
console.log(`\nStatic preview written to preview-out/`);
console.log(`${total} files, index.html is ${(size / 1024).toFixed(0)} KB`);
