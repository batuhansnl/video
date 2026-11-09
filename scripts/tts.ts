import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Default high-quality deep male/narrator voice (e.g. Adam: pNInz6obpgDQGcFmaJgB or George: JBFqnCBsd6RMkjVDRZzb)
const DEFAULT_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George - Great for documentary / tech reporting

export async function generateSpeech(
  text: string,
  outputFilename: string,
  voiceId: string = DEFAULT_VOICE_ID
): Promise<string> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY .env dosyasında bulunamadı!");
  }

  const outDir = path.resolve(process.cwd(), "public/audio");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outputPath = path.join(outDir, outputFilename);

  console.log(`🎙️ ElevenLabs ile ses üretiliyor: "${text.slice(0, 40)}..." -> ${outputFilename}`);

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API Hatası (${response.status}): ${errorText}`);
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
  console.log(`✅ Ses kaydedildi: ${outputPath}`);
  return outputPath;
}

