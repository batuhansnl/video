const { chromium } = require("playwright");
const path = require("path");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const fileUrl = "file://" + path.resolve(__dirname, "../template.html") + "?render=1";
  console.log("Navigating to:", fileUrl);
  await page.goto(fileUrl, { waitUntil: "networkidle" });

  // Kontrol Görüntüsü 1: t=10s (Sahne 1 - İstatistikler & Sayaçlar)
  await page.evaluate(() => window.renderAt(10.0));
  await page.waitForTimeout(200);
  await page.screenshot({ path: "control_shot_1.png" });
  console.log("✅ Kontrol Görüntüsü 1 alındı: control_shot_1.png (t=10s)");

  // Kontrol Görüntüsü 2: t=40s (Sahne 2 - Binance Hack & Terminal Log)
  await page.evaluate(() => window.renderAt(40.0));
  await page.waitForTimeout(200);
  await page.screenshot({ path: "control_shot_2.png" });
  console.log("✅ Kontrol Görüntüsü 2 alındı: control_shot_2.png (t=40s)");

  await browser.close();
}

main().catch(console.error);

