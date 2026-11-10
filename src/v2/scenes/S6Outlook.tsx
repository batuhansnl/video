import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { cue } from "../timing";
import { C, Counter, F, Panel, PhotoCard, Source, clamp, useIn, useSpring } from "../ui";

const ID = "s6_outlook" as const;

type Item = { n: number; title: string; color: string; icon: React.ReactNode };

const I = (d: string, color: string) => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ITEMS: Item[] = [
  { n: 1, title: "Kimlik tabanlı saldırılar", color: C.cyan, icon: I("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0", C.cyan) },
  { n: 2, title: "Yapay zekâ destekli dolandırıcılık", color: C.violet, icon: I("M9 3h6v4H9zM5 9h14v10H5zM9 13h.01M15 13h.01M9 17h6", C.violet) },
  { n: 3, title: "Fidye yazılımı ve veri şantajı", color: C.red, icon: I("M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5zM12 15v3", C.red) },
  { n: 4, title: "Tedarik zinciri ve üçüncü taraf", color: C.green, icon: I("M3 7h7v6H3zM14 11h7v6h-7zM10 10h4M6 13v4h8", C.green) },
  { n: 5, title: "Devlet destekli ve jeopolitik", color: C.amber, icon: I("M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18", C.amber) },
  { n: 6, title: "Bulut ve veri güvenliği", color: "#60A5FA", icon: I("M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19.5 10 4 4 0 0 1 18 18z", "#60A5FA") },
];

const Bullet: React.FC<{ at: number; children: React.ReactNode; color: string }> = ({ at, children, color }) => {
  const p = useIn(at, 12);
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", opacity: p, transform: `translateX(${(1 - p) * 20}px)` }}>
      <span style={{ color, fontSize: 26, lineHeight: "36px" }}>✓</span>
      <span style={{ fontFamily: F.sans, fontSize: 28, color: C.text, lineHeight: "36px" }}>{children}</span>
    </div>
  );
};

const StatBox: React.FC<{ at: number; value: React.ReactNode; label: string; src: string; color: string }> = ({ at, value, label, src, color }) => {
  const p = useSpring(at, 14);
  return (
    <div
      style={{
        border: `2px solid ${color}66`,
        background: `${color}14`,
        borderRadius: 14,
        padding: "22px 26px",
        opacity: p,
        transform: `scale(${0.9 + 0.1 * p})`,
      }}
    >
      {value}
      <div style={{ fontFamily: F.sans, fontSize: 23, color: C.text, marginTop: 8, lineHeight: 1.3 }}>{label}</div>
      <div style={{ fontFamily: F.mono, fontSize: 14, color: C.dim, marginTop: 8, letterSpacing: 1 }}>{src}</div>
    </div>
  );
};

const DetailHead: React.FC<{ item: Item }> = ({ item }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 26 }}>
    <div
      style={{
        fontFamily: F.display,
        fontSize: 64,
        color: item.color,
        lineHeight: 1,
        textShadow: `0 0 30px ${item.color}66`,
      }}
    >
      {item.n}
    </div>
    <div style={{ fontFamily: F.display, fontSize: 46, color: "#fff", textTransform: "uppercase", lineHeight: 1.05 }}>{item.title}</div>
  </div>
);

/** Sahte giriş ekranı: saldırgan geçerli kimlikle giriyor */
const LoginMock: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const step = (k: number) => f > at + k * 18;
  const typed = "a.yilmaz@sirket.com".slice(0, Math.max(0, Math.floor((f - at) / 1.5)));
  return (
    <Panel at={at} accent={C.cyan} style={{ padding: 28, width: 560 }}>
      <div style={{ fontFamily: F.mono, fontSize: 16, color: C.dim, letterSpacing: 2, marginBottom: 18 }}>KURUMSAL OTURUM AÇMA</div>
      <div style={{ fontFamily: F.mono, fontSize: 22, color: C.text, border: "1px solid #334155", borderRadius: 8, padding: "12px 16px" }}>
        {typed}
      </div>
      <div style={{ fontFamily: F.mono, fontSize: 22, color: C.text, border: "1px solid #334155", borderRadius: 8, padding: "12px 16px", marginTop: 12 }}>
        {step(1) ? "●●●●●●●●●●" : ""}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 18, fontFamily: F.mono, fontSize: 20 }}>
        <span style={{ color: step(2) ? C.green : "transparent" }}>✓ Şifre doğru (infostealer'dan)</span>
        <span style={{ color: step(3) ? C.green : "transparent" }}>✓ MFA onaylandı (yorgunluk saldırısı)</span>
        <span style={{ color: step(4) ? C.red : "transparent", fontWeight: 800 }}>▶ GİRİŞ BAŞARILI — SALDIRGAN İÇERİDE</span>
      </div>
    </Panel>
  );
};

const SpeedMeter: React.FC<{ at: number; fast: number }> = ({ at, fast }) => {
  const f = useCurrentFrame();
  const needle = interpolate(f, [at, at + 40, fast, fast + 25], [-110, 20, 20, 105], { ...clamp });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
      <svg width="420" height="260" viewBox="0 0 420 260">
        <path d="M30 230 A180 180 0 0 1 390 230" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="26" />
        <path d="M30 230 A180 180 0 0 1 390 230" fill="none" stroke="url(#g)" strokeWidth="26" strokeDasharray="565" strokeDashoffset={565 * (1 - (needle + 110) / 220)} />
        <defs>
          <linearGradient id="g">
            <stop offset="0" stopColor={C.green} />
            <stop offset="0.5" stopColor={C.amber} />
            <stop offset="1" stopColor={C.red} />
          </linearGradient>
        </defs>
        <g transform={`rotate(${needle} 210 230)`}>
          <line x1="210" y1="230" x2="210" y2="78" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        </g>
        <circle cx="210" cy="230" r="16" fill="#fff" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <div>
          <Counter at={at} to={29} suffix=" dk" size={110} color={C.amber} />
          <div style={{ fontFamily: F.sans, fontSize: 26, color: C.text }}>Ortalama yayılma (breakout) süresi</div>
        </div>
        <div style={{ opacity: f > fast ? 1 : 0.15 }}>
          <Counter at={fast} dur={25} to={27} suffix=" sn" size={110} color={C.red} />
          <div style={{ fontFamily: F.sans, fontSize: 26, color: C.text }}>Gözlenen en hızlı vaka</div>
        </div>
      </div>
    </div>
  );
};

export const S6Outlook: React.FC = () => {
  const f = useCurrentFrame();
  const cues = [
    cue(ID, "Bir: kimlik"),
    cue(ID, "İki:"),
    cue(ID, "Üç:"),
    cue(ID, "Dört:"),
    cue(ID, "Beş:"),
    cue(ID, "Altı:"),
  ];
  const speed = cue(ID, "Ve hız arttı");
  const six = cue(ID, "altı başlıkta");
  let active = -1;
  cues.forEach((c, i) => {
    if (f >= c - 4) active = i;
  });
  if (f >= speed - 4) active = 6;
  const headP = useSpring(2, 14);
  const sixP = useIn(six, 16);
  const sixP2 = useIn(six + 6, 16);
  const segs = [...cues, speed, 99999];
  return (
    <AbsoluteFill style={{ padding: "96px 80px 170px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24, opacity: headP, transform: `translateY(${(1 - headP) * -20}px)` }}>
        <div style={{ fontFamily: F.display, fontSize: 56, color: "#fff", letterSpacing: -1, whiteSpace: "nowrap" }}>
          <span style={{ color: C.cyan }}>2026</span> SİBER TEHDİT GÖRÜNÜMÜ
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 16, color: C.dim, letterSpacing: 1.5, whiteSpace: "nowrap" }}>
          IBM X-FORCE · CROWDSTRIKE · MANDIANT · MICROSOFT · WEF
        </div>
      </div>
      <div style={{ display: "flex", gap: 40, marginTop: 26, flex: 1 }}>
        {/* sol: 6 başlık */}
        <div style={{ width: 560, display: "flex", flexDirection: "column", gap: 12 }}>
          {ITEMS.map((it, i) => {
            const appear = interpolate(f, [six + i * 5, six + i * 5 + 12], [0, 1], clamp);
            const on = active === i;
            const done = active > i;
            return (
              <div
                key={it.n}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 18px",
                  borderRadius: 12,
                  border: `2px solid ${on ? it.color : "rgba(255,255,255,0.08)"}`,
                  background: on ? `${it.color}22` : "rgba(13,20,36,0.7)",
                  opacity: appear * (on ? 1 : done ? 0.6 : 0.85),
                  transform: `translateX(${(1 - appear) * -30 + (on ? 14 : 0)}px)`,
                  boxShadow: on ? `0 0 30px ${it.color}44` : "none",
                }}
              >
                <div style={{ fontFamily: F.display, fontSize: 30, color: it.color, width: 34 }}>{it.n}</div>
                {it.icon}
                <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 25, color: "#fff" }}>{it.title}</div>
              </div>
            );
          })}
        </div>
        {/* sağ: detay */}
        <div style={{ flex: 1, position: "relative" }}>
          {active === -1 ? (
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: F.display, fontSize: 210, color: C.cyan, opacity: sixP, lineHeight: 1 }}>6</div>
              <div style={{ fontFamily: F.mono, fontSize: 28, letterSpacing: 6, color: C.text, opacity: sixP2 }}>
                ANA TEHDİT BAŞLIĞI
              </div>
            </AbsoluteFill>
          ) : null}
          {ITEMS.map((it, i) => (
            <Sequence key={it.n} from={segs[i] - 4} durationInFrames={segs[i + 1] - segs[i]} layout="none">
              <Detail i={i} item={it} />
            </Sequence>
          ))}
          <Sequence from={speed - 4} layout="none">
            <div style={{ position: "absolute", inset: 0 }}>
              <div style={{ fontFamily: F.display, fontSize: 46, color: "#fff", textTransform: "uppercase", marginBottom: 30 }}>
                Hepsinin ortak noktası: <span style={{ color: C.red }}>hız</span>
              </div>
              <SpeedMeter at={4 + (cue(ID, "yirmi dokuz") - speed)} fast={4 + (cue(ID, "yirmi yedi") - speed)} />
              <div style={{ fontFamily: F.mono, fontSize: 16, color: C.dim, marginTop: 24 }}>
                CROWDSTRIKE 2026 KÜRESEL TEHDİT RAPORU · e-SUÇ GRUPLARI, 2025 VERİSİ
              </div>
            </div>
          </Sequence>
        </div>
      </div>
      <Source>IBM X-Force Threat Intelligence Index 2026 · CrowdStrike Global Threat Report 2026</Source>
    </AbsoluteFill>
  );
};

/** Her başlığın detayı. Sequence içinde: f=0 başlığın başladığı an */
const Detail: React.FC<{ i: number; item: Item }> = ({ i, item }) => {
  const rel = (phrase: string) => 4 + cue(ID, phrase) - cue(ID, ["Bir: kimlik", "İki:", "Üç:", "Dört:", "Beş:", "Altı:"][i]);
  const wrap = (children: React.ReactNode) => (
    <div style={{ position: "absolute", inset: 0 }}>
      <DetailHead item={item} />
      {children}
    </div>
  );
  if (i === 0)
    return wrap(
      <div style={{ display: "flex", gap: 36 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          <Bullet at={rel("Saldırganlar artık")} color={item.color}>
            Saldırganlar sızmıyor, <b>oturum açıyor</b>
          </Bullet>
          <Bullet at={rel("Bilgi çalan")} color={item.color}>
            Infostealer kaynaklı kimlik hırsızlığında artış
          </Bullet>
          <Bullet at={rel("MFA atlatma")} color={item.color}>
            MFA atlatma ve oturum çerezi çalma yaygınlaşıyor
          </Bullet>
          <div style={{ marginTop: 12 }}>
            <StatBox
              at={rel("en yaygın")}
              color={item.color}
              value={<Counter at={rel("en yaygın")} to={300000} suffix="+" size={60} color={item.color} />}
              label="Infostealer ile ele geçirilen ChatGPT hesabı (2025)"
              src="IBM X-FORCE 2026"
            />
          </div>
        </div>
        <LoginMock at={10} />
      </div>,
    );
  if (i === 1)
    return wrap(
      <div style={{ display: "flex", gap: 36 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          <Bullet at={rel("Kusursuz")} color={item.color}>
            AI ile yazılmış kusursuz oltalama ve BEC e-postaları
          </Bullet>
          <Bullet at={rel("klonlanmış")} color={item.color}>
            Deepfake ses ve görüntüyle üst yönetici taklidi
          </Bullet>
          <div style={{ display: "flex", gap: 18, marginTop: 10 }}>
            <StatBox
              at={rel("CrowdStrike")}
              color={item.color}
              value={<Counter at={rel("yüzde seksen")} to={89} prefix="+%" size={64} color={item.color} />}
              label="AI kullanan saldırgan gruplarda faaliyet artışı"
              src="CROWDSTRIKE 2026"
            />
            <StatBox
              at={rel("Arup")}
              color={C.red}
              value={<Counter at={rel("yirmi beş")} to={25} prefix="$" suffix=" MİLYON" size={52} color={C.red} />}
              label="Arup: deepfake görüntülü toplantıyla transfer (Hong Kong, 2024)"
              src="CNN · HONG KONG POLİSİ"
            />
          </div>
        </div>
        <PhotoCard
          src="img/deepfake_ted.jpg"
          at={rel("klonlanmış")}
          w={470}
          h={350}
          rotate={2}
          accent={item.color}
          credit="Steve Jurvetson · CC BY 2.0"
          caption="Gerçek zamanlı deepfake gösterimi (TED 2019). Bugün aynı teknoloji dolandırıcıların elinde."
        />
      </div>,
    );
  if (i === 2)
    return wrap(
      <div style={{ display: "flex", gap: 36 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          <Bullet at={rel("Artık sadece")} color={item.color}>
            Önce veriyi çal, sonra şifrele: <b>çifte şantaj</b>
          </Bullet>
          <Bullet at={rel("şantaj yapıyor")} color={item.color}>
            Ransomware-as-a-Service (RaaS) büyümeye devam ediyor
          </Bullet>
          <Bullet at={rel("şantaj yapıyor") + 15} color={item.color}>
            Operasyonel kesinti ve itibar kaybı riski
          </Bullet>
        </div>
        <StatBox
          at={rel("Artık sadece") + 10}
          color={item.color}
          value={<Counter at={rel("Artık sadece") + 10} to={49} prefix="+%" size={90} color={item.color} />}
          label="Aktif fidye yazılımı grubu sayısında yıllık artış"
          src="IBM X-FORCE 2026"
        />
      </div>,
    );
  if (i === 3)
    return wrap(
      <div style={{ display: "flex", gap: 36 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          <Bullet at={6} color={item.color}>
            Hizmet sağlayıcılar ve iş ortakları üzerinden saldırılar
          </Bullet>
          <Bullet at={rel("Marks")} color={item.color}>
            Üçüncü taraf riski yönetim kurulu gündeminde
          </Bullet>
          <div style={{ display: "flex", gap: 18, marginTop: 10 }}>
            <StatBox
              at={rel("faturası")}
              color={C.red}
              value={<Counter at={rel("üç yüz")} to={300} prefix="~£" suffix=" MİLYON" size={50} color={C.red} />}
              label="Marks & Spencer: üçüncü taraf üzerinden saldırı (2025)"
              src="M&S FİNANSAL AÇIKLAMASI"
            />
            <StatBox
              at={14}
              color={item.color}
              value={<div style={{ fontFamily: F.mono, fontWeight: 800, fontSize: 50, color: item.color }}>~4×</div>}
              label="2020'den bu yana büyük tedarik zinciri ihlalleri"
              src="IBM X-FORCE 2026"
            />
          </div>
        </div>
        <PhotoCard
          src="img/ms_store.jpg"
          at={rel("Marks")}
          w={420}
          h={330}
          rotate={-2}
          accent={item.color}
          credit="Sunil060902 · CC BY-SA 3.0"
          caption="M&S'te online satışlar haftalarca durdu."
        />
      </div>,
    );
  if (i === 4)
    return wrap(
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Bullet at={6} color={item.color}>
          Finans, enerji ve kritik altyapılar hedef olmaya devam ediyor
        </Bullet>
        <Bullet at={14} color={item.color}>
          Jeopolitik gerilimler saldırıları doğrudan tetikliyor
        </Bullet>
        <div style={{ display: "flex", gap: 18, marginTop: 14 }}>
          <StatBox at={18} color={C.red} value={<div style={{ fontFamily: F.display, fontSize: 40, color: C.red }}>KUZEY KORE</div>} label="Binance: $6,3 milyar (TraderTraitor)" src="FBI" />
          <StatBox at={24} color={C.amber} value={<div style={{ fontFamily: F.display, fontSize: 40, color: C.amber }}>İRAN</div>} label="Stryker: yıkıcı silme saldırısı (Handala)" src="UNIT 42" />
        </div>
      </div>,
    );
  return wrap(
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Bullet at={6} color={item.color}>
        Yanlış yapılandırılmış bulut ortamları veri sızıntısına yol açıyor
      </Bullet>
      <Bullet at={14} color={item.color}>
        Güvenilen uygulama izinleri (OAuth) yeni saldırı yüzeyi
      </Bullet>
      <Bullet at={22} color={item.color}>
        Bulut güvenliği artık iş sürekliliğinin parçası
      </Bullet>
    </div>,
  );
};
