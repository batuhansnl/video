const { chromium } = require("playwright");
const { spawn, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const FPS = 30;
const TOTAL_DURATION = 185.0; // 185 seconds
const TOTAL_FRAMES = Math.floor(TOTAL_DURATION * FPS); // 5550 frames
const CHUNK_SIZE = 450; // 450 frames = 15 seconds per chunk
const FFMPEG_BIN = path.resolve(__dirname, "../bin/ffmpeg");

function writeAsync(stream, buffer) {
  return new Promise((resolve, reject) => {
    const ok = stream.write(buffer, (err) => {
      if (err) reject(err);
      else if (ok) resolve();
    });
    if (!ok) {
      stream.once("drain", resolve);
    }
  });
}

async function renderChunk(chunkIndex, startFrame, endFrame, browser) {
  const chunksDir = path.resolve(__dirname, "../chunks");
  if (!fs.existsSync(chunksDir)) {
    fs.mkdirSync(chunksDir, { recursive: true });
  }

  const chunkFile = path.join(chunksDir, `chunk_${String(chunkIndex).padStart(2, "0")}.mp4`);
  const frameCount = endFrame - startFrame + 1;
  console.log(`🎬 [Chunk ${chunkIndex}] Başlıyor: Kare ${startFrame}..${endFrame} (${frameCount} kare) -> ${path.basename(chunkFile)}`);

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const fileUrl = "file://" + path.resolve(__dirname, "../template.html") + "?render=1";
  await page.goto(fileUrl, { waitUntil: "networkidle" });

  const ffmpeg = spawn(FFMPEG_BIN, [
    "-y",
    "-f", "image2pipe",
    "-vcodec", "png",
    "-r", String(FPS),
    "-i", "-",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-preset", "veryfast",
    "-crf", "18",
    chunkFile,
  ], {
    stdio: ["pipe", "ignore", "inherit"],
  });

  const chunkStartTime = Date.now();

  for (let f = startFrame; f <= endFrame; f++) {
    const t = f / FPS;
    await page.evaluate((currT) => window.renderAt(currT), t);
    const buf = await page.screenshot({ type: "png" });
    await writeAsync(ffmpeg.stdin, buf);
  }

  ffmpeg.stdin.end();

  await new Promise((resolve, reject) => {
    ffmpeg.on("close", (code) => {
      if (code === 0) {
        const elapsed = ((Date.now() - chunkStartTime) / 1000).toFixed(1);
        console.log(`✅ [Chunk ${chunkIndex}] Tamamlandı (${elapsed}s, ${(frameCount / elapsed).toFixed(1)} fps)`);
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
  });

  await context.close();
}

async function concatenateChunks(numChunks) {
  const chunksDir = path.resolve(__dirname, "../chunks");
  const listFile = path.join(chunksDir, "chunks.txt");
  let fileContent = "";
  for (let i = 0; i < numChunks; i++) {
    const cf = `chunk_${String(i).padStart(2, "0")}.mp4`;
    fileContent += `file '${cf}'\n`;
  }
  fs.writeFileSync(listFile, fileContent);

  const outDir = path.resolve(__dirname, "../out");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const mergedVideo = path.join(outDir, "visuals_merged.mp4");
  console.log(`🔗 Parçalar birleştiriliyor: ${mergedVideo}`);

  execSync(`"${FFMPEG_BIN}" -y -f concat -safe 0 -i "${listFile}" -c copy "${mergedVideo}"`, {
    stdio: "inherit",
  });
  console.log(`✅ Görsel video hazır: ${mergedVideo}`);
  return mergedVideo;
}

async function mixAudioAndFinalize(mergedVideo) {
  const outDir = path.resolve(__dirname, "../out");
  const finalOutput = path.join(outDir, "2026_siber_olaylar_brifing.mp4");

  console.log(`🎵 Sesler miksleniyor ve videoya ekleniyor -> ${finalOutput}`);

  // Voiceovers and delays:
  // scene1: 0.5s = 500ms
  // scene2: 25.5s = 25500ms
  // scene3: 58.5s = 58500ms
  // scene4: 93.5s = 93500ms
  // scene5: 131.5s = 131500ms
  // scene6: 165.5s = 165500ms
  const v1 = path.resolve(__dirname, "../public/audio/scene1_stats.mp3");
  const v2 = path.resolve(__dirname, "../public/audio/scene2_binance.mp3");
  const v3 = path.resolve(__dirname, "../public/audio/scene3_iot.mp3");
  const v4 = path.resolve(__dirname, "../public/audio/scene4_ai.mp3");
  const v5 = path.resolve(__dirname, "../public/audio/scene5_supply.mp3");
  const v6 = path.resolve(__dirname, "../public/audio/scene6_action.mp3");
  const sfx = path.resolve(__dirname, "../public/audio/sfx_track.wav");

  // Complex filter graph:
  // Delay each voice track to its scene start time, mix all voices + SFX
  const filterGraph = `
    [1:a]adelay=500|500[a1];
    [2:a]adelay=25500|25500[a2];
    [3:a]adelay=58500|58500[a3];
    [4:a]adelay=93500|93500[a4];
    [5:a]adelay=131500|131500[a5];
    [6:a]adelay=165500|165500[a6];
    [7:a]volume=0.55[sfx_vol];
    [a1][a2][a3][a4][a5][a6][sfx_vol]amix=inputs=7:duration=longest:dropout_transition=2[aout]
  `.replace(/\s+/g, " ");

  const cmd = [
    `"${FFMPEG_BIN}" -y`,
    `-i "${mergedVideo}"`,
    `-i "${v1}"`,
    `-i "${v2}"`,
    `-i "${v3}"`,
    `-i "${v4}"`,
    `-i "${v5}"`,
    `-i "${v6}"`,
    `-i "${sfx}"`,
    `-filter_complex "${filterGraph}"`,
    `-map 0:v`,
    `-map "[aout]"`,
    `-c:v copy`,
    `-c:a aac -b:a 192k`,
    `-shortest`,
    `"${finalOutput}"`
  ].join(" ");

  execSync(cmd, { stdio: "inherit" });
  console.log(`\n🎉 NİHAİ VİDEO OLUŞTURULDU: ${finalOutput}`);
}

async function main() {
  const numChunks = Math.ceil(TOTAL_FRAMES / CHUNK_SIZE);
  console.log(`=======================================================`);
  console.log(`2026 SİBER OLAYLAR — TAM RENDER VE MONTAJ HATTI`);
  console.log(`Süre: ${TOTAL_DURATION}s (${TOTAL_FRAMES} kare) | ${numChunks} Parça (her biri ${CHUNK_SIZE} kare)`);
  console.log(`=======================================================\n`);

  const browser = await chromium.launch({ headless: true });

  for (let i = 0; i < numChunks; i++) {
    const chunkFile = path.resolve(__dirname, `../chunks/chunk_${String(i).padStart(2, "0")}.mp4`);
    // If chunk already exists with reasonable size, skip to speed up resume
    if (fs.existsSync(chunkFile) && fs.statSync(chunkFile).size > 10000) {
      console.log(`⏭️ [Chunk ${i}] Zaten mevcut, atlanıyor: ${path.basename(chunkFile)}`);
      continue;
    }
    const startFrame = i * CHUNK_SIZE;
    const endFrame = Math.min(TOTAL_FRAMES - 1, startFrame + CHUNK_SIZE - 1);
    await renderChunk(i, startFrame, endFrame, browser);
  }

  await browser.close();

  const mergedVideo = await concatenateChunks(numChunks);
  await mixAudioAndFinalize(mergedVideo);
}

main().catch(console.error);

