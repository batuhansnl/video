import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;
const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George - documentary narrator

interface VoiceSegment {
  filename: string;
  text: string;
}

const segments: VoiceSegment[] = [
  {
    filename: "intro.mp3",
    text: "2026 siber tehdit bülteni. Yapay zekâ destekli saldırılar, kuantum öncesi tehditler ve dijital savunma dinamikleri. Küresel veri ihlallerinde yüzde dört yüz yirmi artış gözlemleniyor.",
  },
  {
    filename: "threat01.mp3",
    text: "Tehdit numaraları bir. Yapay zekâ destekli saldırı ajanları. İnsan müdahalesi olmadan zafiyet tarayan ve sızma gerçekleştiren otonom yazılımlar, ses ve video tabanlı derin sahtecilik oltalama kampanyaları ve geleneksel güvenlik sistemlerini anlık olarak baypas eden yapay zekâ modülleri. Otonom saldırılarda yüzde üç yüz seksen artış kaydedildi.",
  },
  {
    filename: "threat02.mp3",
    text: "Tehdit numaraları iki. Kuantum öncesi veri hasadı. Şifreli verilerin gelecekte kuantum bilgisayarlarla kırılmak üzere bugünden çalınması. RSA ve ECC gibi yaygın şifreleme standartlarının geçerliliğini yitirmesi riski. Kritik devlet, bankacılık ve altyapı verilerinin acil koruma altına alınma zorunluluğu.",
  },
  {
    filename: "threat03.mp3",
    text: "Tehdit numaraları üç. Tedarik zinciri ve açık kaynak zehirlenmesi. Paket yöneticileri üzerinden dağıtılan otomatik zararlı yazılımlar, bulut API anahtarlarının ele geçirilmesi ve enerji şebekelerine yönelik dolaylı tedarikçi sızmaları. Yedi gün yirmi dört saat süren altyapı tehdidi.",
  },
  {
    filename: "outro.mp3",
    text: "2026 için proaktif önlemler. Sıfır güven mimarisi, post kuantum şifreleme geçişi ve yapay zekâ ile otonom savunma. Olay gerçekleştikten sonra değil, gerçekleşmeden önce korunun. Güvenliğinizi şimdiden güncelleyin.",
  },
];

async function generateAll() {
  const outDir = path.resolve(process.cwd(), "public/audio");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  let totalChars = 0;

  for (const seg of segments) {
    totalChars += seg.text.length;
    const outputPath = path.join(outDir, seg.filename);

    if (fs.existsSync(outputPath)) {
      console.log(`⏭️ Zaten mevcut, atlanıyor: ${seg.filename}`);
      continue;
    }

    console.log(`🎙️  Üretiliyor: ${seg.filename} (${seg.text.length} karakter)`);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: seg.text,
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
      console.error(`❌ Hata (${response.status}): ${errorText}`);
      process.exit(1);
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    console.log(`✅ Kaydedildi: ${outputPath}`);

    // Rate limit koruması
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`\n📊 Toplam karakter kullanımı: ${totalChars}`);
  console.log(`🎉 Tüm ses dosyaları hazır!`);
}

generateAll().catch(console.error);

