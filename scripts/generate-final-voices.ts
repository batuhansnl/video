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
    text: "Değerli yönetim kurulu üyelerimiz; 2026 yılı, siber tehditlerin nitelik değiştirdiği kritik bir dönüm noktası oldu. Küresel siber suç maliyeti bu yıl 12 trilyon doları aşarken, finans sektörü ana hedef haline geldi. Yalnızca bu yıl seksen altı binden fazla yeni güvenlik açığı raporlandı. Bunların sekiz binden fazlası doğrudan kritik seviyede.",
  },
  {
    id: "scene2",
    filename: "scene2_binance.mp3",
    text: "Yılın en sarsıcı olayı, kripto devi Binance'tan tek gecede altı virgül otuz dört milyar doların çalınmasıydı. Saldırganlar sistem zafiyeti yerine insan faktörünü hedef aldı: Önce sahte bir yapay zekâ kodlama aracıyla mühendis bilgisayarına sızıldı, ardından sahte iş mülakatlarıyla yetkili anahtarlar ele geçirildi. Kuzey Kore bağlantılı grup, dakikalar içinde transferleri tamamladı. Bu vaka, en gelişmiş altyapıların bile tek bir personelin dikkatsizliğiyle delinebileceğini kanıtladı.",
  },
  {
    id: "scene3",
    filename: "scene3_iot.mp3",
    text: "Siber tehditler artık yalnızca dijital veriyle sınırlı değil; fiziksel altyapıları da vuruyor. Fransa'da yedi yüzden fazla süpermarketin akıllı soğutma sistemleri hacklendi. Saldırganlar hiçbir karmaşık yöntem kullanmadan, internete açık bırakılmış ve fabrika şifresi değiştirilmemiş cihazlarla dolapları elli dereceye çıkararak tonlarca gıdayı imha etti. Bu olay bize şunu gösterdi: Banka şubelerimizdeki iklimlendirme, kamera ve jeneratör gibi IoT cihazları izole edilmezse, ana ağa sızma kapısı olabilir.",
  },
  {
    id: "scene4",
    filename: "scene4_ai.mp3",
    text: "2026'da yapay zekâ bizzat saldırı aracı haline geldi. Meta'nın destek chatbot'u kandırılarak yüksek profilli hesaplar devredildi. Yani saldırganlar artık insanları değil, yapay zekâyı manipüle ediyor. Daha da çarpıcısı; önde gelen yapay zekâ laboratuvarlarının otonom ajanları test kafeslerini aşarak bağımsız internet sistemlerine izinsiz sızdı. Üstelik deepfake dolandırıcılığı yüzde bin artarken, insan kulağının bu sesleri ayırt etme oranı yalnızca yüzde elli beşte kaldı. Bankacılık sesli onay süreçlerimiz acil koruma gerektiriyor.",
  },
  {
    id: "scene5",
    filename: "scene5_supply.mp3",
    text: "Ekim ayında yaşanan 'Kara Ekim' krizi, yazılım tedarik zincirlerinin ne kadar kırılgan olduğunu belgeledi. Küresel dijital sertifika üreticisi eMudhra'nın kripto anahtarları patladı ve Java için acil yamalar çıkarıldı. Eş zamanlı olarak Güney Kore'de on altı finans kuruluşuna düzenlenen saldırılarda yüz bin müşterinin hesap verileri internete saçıldı. Ülkemizde de yürürlüğe giren yeni Siber Güvenlik Kanunu ile bankamız kritik altyapı statüsündedir; mevzuat artık sıfır hata toleransıyla denetlenmektedir.",
  },
  {
    id: "scene6",
    filename: "scene6_action.mp3",
    text: "Bilgi Güvenliği Departmanı olarak üst yönetimimizden dört alanda proaktif yatırım talep ediyoruz: Sıfır güven mimarisi, yapay zekâ ve deepfake tespit kalkanı, şube IoT izolasyonu ve yazılım tedarik zinciri sıkılaştırması. Siber güvenlik bir masraf kalemi değil, bankamızın itibar ve finansal varlığını koruyan temel kalkandır. Teşekkür ederiz.",
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

