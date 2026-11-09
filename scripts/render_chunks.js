const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const FPS = 30;
const TOTAL_DURATION = 185.0; // seconds
const TOTAL_FRAMES = Math.floor(TOTAL_DURATION * FPS); // 5550 frames
const CHUNK_SIZE = 450; // 450 frames per chunk (15s)
const FFMPEG_BIN = path.resolve(__dirname, "../bin/ffmpeg");

async function renderChunk(chunkIndex, startFrame, endFrame, browser) {
  const chunksDir = path.resolve(__dirname, "../chunks");
  if (!fs.existsSync(chunksDir)) {
    fs.mkdirSync(chunksDir, { recursive: true });
  }

  const chunkFile = path.join(chunksDir, `chunk_${String(chunkIndex).padStart(2, "0")}.mp4`);
  console.log(`🎬 [Chunk ${chunkIndex}] Başlıyor: Kare ${startFrame} -> ${endFrame} (${endFrame - startFrame + 1} kare) -> ${path.basename(chunkFile)}`);

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
    stdio: ["pipe", "ignore", "pipe"],
  });

  let ffmpegErr = "";
  ffmpeg.stderr.on("data", (d) => {
    ffmpegErr += d.toString();
  });

  const chunkStartTime = Date.now();

  for (let f = startFrame; f <= endFrame; f++) {
    const t = f / FPS;
    await page.evaluate((currT) => window.renderAt(currT), t);
    const buf = await page.screenshot({ type: "png" });
    ffmpeg.stdin.write(buf);
  }

  ffmpeg.stdin.end();

  await new Promise((resolve, reject) => {
    ffmpeg.on("close", (code) => {
      if (code === 0) {
        const elapsed = ((Date.now() - chunkStartTime) / 1000).toFixed(1);
        console.log(`✅ [Chunk ${chunkIndex}] Tamamlandı (${elapsed}s): ${path.basename(chunkFile)}`);
        resolve();
      } else {
        reject(new Error(`FFmpeg error (code ${code}): ${ffmpegErr}`));
      }
    });
  });

  await context.close();
}

async function main() {
  const specificChunk = process.argv[2] !== undefined ? parseInt(process.argv[2], 10) : null;
  const numChunks = Math.ceil(TOTAL_FRAMES / CHUNK_SIZE);

  console.log(`🚀 Render Başlıyor: Toplam ${TOTAL_FRAMES} kare, ${numChunks} parça (her biri ${CHUNK_SIZE} kare)`);

  const browser = await chromium.launch({ headless: true });

  if (specificChunk !== null) {
    const startFrame = specificChunk * CHUNK_SIZE;
    const endFrame = Math.min(TOTAL_FRAMES - 1, startFrame + CHUNK_SIZE - 1);
    await renderChunk(specificChunk, startFrame, endFrame, browser);
  } else {
    for (let i = 0; i < numChunks; i++) {
      const startFrame = i * CHUNK_SIZE;
      const endFrame = Math.min(TOTAL_FRAMES - 1, startFrame + CHUNK_SIZE - 1);
      await renderChunk(i, startFrame, endFrame, browser);
    }
  }

  await browser.close();
  console.log("🎉 Tüm parçalar başarıyla render edildi!");
}

main().catch(console.error);

