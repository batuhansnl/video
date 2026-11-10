// v2 seslendirme: eleven_v4 (duygu/vurgu etiketleri destekli) + kelime zamanlamaları
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const KEY = process.env.ELEVENLABS_API_KEY!;
const VOICE_ID = process.env.VOICE_ID || "JBFqnCBsd6RMkjVDRZzb"; // George
const MODEL_ID = process.env.MODEL_ID || "eleven_v4";
const only = process.argv.slice(2); // belirli sahneleri yeniden üretmek için id ver

type Scene = { id: string; text: string };
const scenes: Scene[] = JSON.parse(fs.readFileSync("scripts/script_v2.json", "utf8"));
const outDir = path.resolve("public/audio/v2");
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  for (const sc of scenes) {
    if (only.length && !only.includes(sc.id)) continue;
    const mp3 = path.join(outDir, `${sc.id}.mp3`);
    if (!only.length && fs.existsSync(mp3)) {
      console.log(`⏭️  ${sc.id} zaten var`);
      continue;
    }
    console.log(`🎙️  ${sc.id} (${sc.text.length} karakter)`);
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ text: sc.text, model_id: MODEL_ID, language_code: "tr" }),
      },
    );
    if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
    const data = await res.json();
    fs.writeFileSync(mp3, Buffer.from(data.audio_base64, "base64"));
    fs.writeFileSync(
      path.join(outDir, `${sc.id}.json`),
      JSON.stringify({ text: sc.text, alignment: data.normalized_alignment ?? data.alignment, raw: data.alignment }, null, 1),
    );
    await new Promise((r) => setTimeout(r, 800));
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
