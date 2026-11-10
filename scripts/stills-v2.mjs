// Hızlı görsel kontrol: tek paketle birden çok kare üretir
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
import { enableTailwind } from "@remotion/tailwind-v4";
const outDir = process.argv[2];
const frames = process.argv.slice(3).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), webpackOverride: (c) => enableTailwind(c), rspack: true });
const composition = await selectComposition({ serveUrl, id: "Brifing2026-v2" });
console.log("toplam kare", composition.durationInFrames, (composition.durationInFrames / 30).toFixed(1) + "s");
for (const frame of frames) {
  await renderStill({ serveUrl, composition, frame, output: path.join(outDir, `f${String(frame).padStart(5, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 70, scale: 0.5 });
  console.log("✓", frame);
}
