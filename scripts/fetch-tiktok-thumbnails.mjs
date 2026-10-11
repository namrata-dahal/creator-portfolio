import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const outDir = "public/videos/tiktok";
const ids = [
  ...new Set(
    readFileSync("lib/portfolio.ts", "utf8").match(/(?<=")\d{15,}(?=")/g),
  ),
];
mkdirSync(outDir, { recursive: true });
const saved = new Set(
  readdirSync(outDir).map((f) => f.replace(/\.[^.]+$/, "")),
);

let failed = 0;
for (const id of ids) {
  const file = `${outDir}/${id}.jpg`;
  if (saved.has(id)) {
    console.log(`${id}  already saved`);
    continue;
  }
  const res = await fetch(
    `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@namratadahal62/video/${id}`,
  );
  if (!res.ok) {
    console.log(`${id}  failed (HTTP ${res.status}), try again later`);
    failed++;
    continue;
  }
  const { thumbnail_url } = await res.json();
  const image = await fetch(thumbnail_url);
  if (!image.ok) {
    console.log(`${id}  thumbnail download failed (HTTP ${image.status})`);
    failed++;
    continue;
  }
  writeFileSync(file, Buffer.from(await image.arrayBuffer()));
  console.log(`${id}  saved`);
  await new Promise((r) => setTimeout(r, 3000));
}
process.exitCode = failed ? 1 : 0;
