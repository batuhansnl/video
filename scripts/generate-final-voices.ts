import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;
const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George - Serious executive documentary narrator

const scenes = [
  {
    id: "scene1",
    filename: "scene1_stats.mp3",
    text: "Merhabalar. 2026, siber tehditlerin şekil değiştirdiği bir yıl oldu. Küresel siber suç maliyeti on iki trilyon doları aştı. Bu yıl seksen altı binden fazla yeni güvenlik açığı raporlandı. Sekiz binden fazlası kritik seviyede.",
  },
  {
    id: "scene2",
    filename: "scene2_binance.mp3",
    text: "Yılın en büyük soygunu, kripto borsası Binance'tan tek gecede altı virgül otuz dört milyar doların çekilmesiydi. Hedef yazılım değil, insandı. Sahte bir yapay zekâ aracı ve sahte iş görüşmeleriyle yetkili anahtarlar alındı. Transfer, dakikalar içinde on ayrı zincirde tamamlandı.",
  },
  {
    id: "scene3",
    filename: "scene3_php2shell.mp3",
    text: "Aynı ölçekteki ikinci kırılma, yirmi bir Ekim'de geldi: PHP2Shell. İnternetteki sitelerin yaklaşık yüzde yetmişini çalıştıran PHP dilinde, kimlik doğrulaması olmadan uzaktan kod çalıştırmaya izin veren kritik açıklar yayımlandı. Yamalar, sekiz nokta iki ve üzeri sürümler için çıktı. Desteklenmeyen eski sürümlerin büyük bölümü haftalar sonra hâlâ açıktı. Yirmi altı Ekim'de bu açıklar, istismar edilen zafiyetler listesine alındı. Bankacılık, havayolu ve kamu siteleri yama için kısa süreliğine kapatıldı. Etki, Log4Shell ile aynı sınıfta anıldı.",
  },
  {
    id: "scene4",
    filename: "scene3_iot.mp3",
    text: "Tehdit ekranda kalmadı. Fransa'da yedi yüzden fazla süpermarketin soğutma sistemleri ele geçirildi. Fabrika ayarı değiştirilmemiş cihazlar defrost moduna alındı ve dolaplar elli dereceye çıktı. Açık kalan iklimlendirme, kamera ve jeneratör ağları, kurumsal sistemlere köprü olabilir.",
  },
  {
    id: "scene5",
    filename: "scene4_ai.mp3",
    text: "Yapay zekâ bu yıl saldırı aracına dönüştü. Destek sohbet botları kandırılarak hesaplar devredildi. Deney kafesindeki otonom ajanlar, dış sistemlere izinsiz çıktı. Deepfake dolandırıcılığı yüzde bin artarken, insan kulağı bu sesleri yaklaşık yüzde elli beş doğrulukla ayırt edebildi.",
  },
  {
    id: "scene6",
    filename: "scene5_supply.mp3",
    text: "Ekim ayında Güney Kore'de yirmiye yakın finans kuruluşu art arda hedef alındı. Bir aracı kurumda otuz sekiz bini aşkın müşteri kaydı açığa çıktı. Aynı haftalarda sertifika altyapısındaki bir zayıflık, Java için acil yama gerektirdi.",
  },
  {
    id: "scene7",
    filename: "scene6_action.mp3",
    text: "Dört başlık öne çıkıyor. Kritik işlemlerde tek kişiye bağlı kalmayan onay. Deepfake ayırt eden kontroller. Fiziksel cihaz ağlarının ayrılması. Ve yazılım tedarik zincirinin sürekli taranması. Siber güvenlik bir masraf kalemi değil, dijital varlığın devamıdır.",
  },
];

async function main() {
  const outDir = path.resolve(process.cwd(), "public/audio");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  let totalChars = 0;
  for (const sc of scenes) {
    totalChars += sc.text.length;
    const dest = path.join(outDir, sc.filename);
    console.log(`🎙️ [${sc.id}] Ses üretiliyor (${sc.text.length} karakter): ${sc.filename}`);

    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: sc.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`ElevenLabs Hatası (${res.status}): ${err}`);
    }

    const buf = await res.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(buf));
    console.log(`✅ Kaydedildi: ${dest}`);
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`\n🎉 Toplam ${totalChars} karakter seslendirildi!`);
}

main().catch(console.error);

