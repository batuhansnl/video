import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cue } from "../timing";
import { C, Counter, F, Source, clamp, useIn, useSpring } from "../ui";

const ID = "s7_turkiye" as const;
const TR_RED = "#E30A17";

const Flag: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size * 1.5} height={size} viewBox="0 0 30 20">
    <rect width="30" height="20" fill={TR_RED} />
    <circle cx="11.25" cy="10" r="5" fill="#fff" />
    <circle cx="12.5" cy="10" r="4" fill={TR_RED} />
    <polygon
      fill="#fff"
      points="16.5,10 18.9,9.2 18.9,6.7 20.4,8.7 22.8,7.9 21.3,10 22.8,12.1 20.4,11.3 18.9,13.3 18.9,10.8"
      transform="rotate(0)"
    />
  </svg>
);

type CardProps = {
  at: number;
  numAt: number;
  name: string;
  sub: string;
  date: string;
  value: number;
  valuePrefix?: string;
  valueSuffix?: string;
  valueLabel: string;
  rows: [string, string][];
  color: string;
  photo?: string;
  stampAt?: number;
  stamp?: string;
};

const Card: React.FC<CardProps> = (p) => {
  const s = useSpring(p.at, 15);
  const f = useCurrentFrame();
  const stamp = p.stampAt !== undefined ? interpolate(f, [p.stampAt, p.stampAt + 8], [0, 1], clamp) : 0;
  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        border: `2px solid ${p.color}55`,
        background: "rgba(13,20,36,0.9)",
        padding: "24px 26px",
        opacity: s,
        transform: `translateY(${(1 - s) * 40}px)`,
        boxShadow: "0 20px 50px rgba(0,0,0,0.55)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {p.photo ? (
        <Img
          src={staticFile(p.photo)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.16 }}
        />
      ) : null}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: p.color }} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ fontFamily: F.mono, fontSize: 17, color: p.color, fontWeight: 800, letterSpacing: 2 }}>{p.date}</div>
        <div style={{ fontFamily: F.display, fontSize: 40, color: "#fff", marginTop: 8, lineHeight: 1.02, textTransform: "uppercase" }}>
          {p.name}
        </div>
        <div style={{ fontFamily: F.sans, fontSize: 19, color: C.dim, marginTop: 4 }}>{p.sub}</div>
        <div style={{ marginTop: 18 }}>
          <Counter at={p.numAt} dur={35} to={p.value} decimals={p.value % 1 ? 1 : 0} prefix={p.valuePrefix} suffix={p.valueSuffix} size={50} color={p.color} />
          <div style={{ fontFamily: F.mono, fontSize: 15, color: C.text, letterSpacing: 1, marginTop: 6 }}>{p.valueLabel}</div>
        </div>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10, paddingTop: 16 }}>
          {p.rows.map(([k, v]) => (
            <div key={k} style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 8 }}>
              <div style={{ fontFamily: F.mono, fontSize: 13, color: C.dim, letterSpacing: 2 }}>{k}</div>
              <div style={{ fontFamily: F.sans, fontSize: 19, color: C.text, lineHeight: 1.3 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      {p.stamp ? (
        <div
          style={{
            position: "absolute",
            right: 18,
            top: 330,
            fontFamily: F.display,
            fontSize: 26,
            color: C.red,
            border: `4px solid ${C.red}`,
            borderRadius: 8,
            padding: "4px 12px",
            transform: `rotate(-10deg) scale(${1.6 - 0.6 * stamp})`,
            opacity: stamp,
            background: "rgba(7,11,20,0.85)",
          }}
        >
          {p.stamp}
        </div>
      ) : null}
    </div>
  );
};

export const S7Turkiye: React.FC = () => {
  const head = useSpring(2, 14);
  const common = cue(ID, "Ortak sorun");
  const banner = useSpring(common, 14);
  const kvkk = useIn(10, 16);
  return (
    <AbsoluteFill style={{ padding: "96px 80px 170px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 26, opacity: head }}>
        <Flag size={58} />
        <div style={{ fontFamily: F.display, fontSize: 60, color: "#fff", letterSpacing: -1 }}>
          TÜRKİYE'DEN <span style={{ color: TR_RED }}>VAKALAR</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16, opacity: kvkk }}>
          <div style={{ fontFamily: F.mono, fontSize: 15, color: C.dim, letterSpacing: 2, textAlign: "right" }}>
            KVKK KAMUOYU
            <br />
            DUYURULARI
          </div>
          <div style={{ background: "#fff", borderRadius: 10, padding: "8px 14px" }}>
            <Img src={staticFile("img/kvkk_logo.png")} style={{ height: 52 }} />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 22, marginTop: 28, flex: 1 }}>
        <Card
          at={cue(ID, "Civil") - 6}
          numAt={cue(ID, "dört buçuk")}
          name="Civil Mağazacılık"
          sub="Perakende"
          date="ŞUBAT 2026"
          value={4.5}
          valueSuffix=" MİLYON"
          valuePrefix="~"
          valueLabel="KİŞİ (MÜŞTERİ + ÇALIŞAN)"
          rows={[
            ["NE OLDU", "Kimlik ve iletişim verileri sızdırıldı"],
            ["İŞ ETKİSİ", "İtibar kaybı, KVKK riski"],
          ]}
          color={TR_RED}
          photo="img/avm.jpg"
        />
        <Card
          at={cue(ID, "Türkkep") - 6}
          numAt={cue(ID, "Türkkep") + 6}
          name="TÜRKKEP"
          sub="Kayıtlı elektronik posta (KEP)"
          date="10–16 ŞUBAT 2026"
          value={8170}
          valuePrefix="~"
          valueLabel="UYGULAMA KULLANICISI"
          rows={[
            ["NE OLDU", "Kullanıcı listesine yetkisiz erişim"],
            ["SIZAN", "Ad, TCKN/VKN, e-posta, telefon, hash'li şifre"],
          ]}
          color={C.cyan}
        />
        <Card
          at={cue(ID, "Onbir Grup") - 6}
          numAt={cue(ID, "beş ay")}
          name="1Onbir Grup"
          sub="Bilişim"
          date="KASIM 2025 – NİSAN 2026"
          value={5}
          valuePrefix="~"
          valueSuffix=" AY"
          valueLabel="FARK EDİLMEDEN İÇERİDE"
          rows={[
            ["NE OLDU", "Yetkisiz erişim ve veri silme"],
            ["ETKİLENEN", "~10 bin çalışan, kullanıcı ve müşteri"],
          ]}
          color={C.amber}
          stampAt={cue(ID, "verileri sildi")}
          stamp="VERİ SİLİNDİ"
        />
        <Card
          at={cue(ID, "Eve Kozmetik") - 6}
          numAt={cue(ID, "altı milyonu")}
          name="Eve Kozmetik"
          sub="Yeni Mağazacılık A.Ş."
          date="EYLÜL 2026"
          value={6263305}
          valueLabel="MÜŞTERİ ETKİLENDİ"
          rows={[
            ["NE OLDU", "Üçüncü taraf yazılım kütüphanesindeki açık istismar edildi"],
            ["İŞ ETKİSİ", "Müşteri güveni, KVKK riski"],
          ]}
          color={C.violet}
        />
      </div>
      <div
        style={{
          marginTop: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: "16px 24px",
          borderRadius: 12,
          border: `2px solid ${C.red}`,
          background: `${C.red}1c`,
          opacity: banner,
          transform: `scale(${0.95 + 0.05 * banner})`,
        }}
      >
        <span style={{ fontFamily: F.mono, fontWeight: 800, fontSize: 24, color: C.red, letterSpacing: 3 }}>ORTAK KÖK NEDEN</span>
        <span style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 30, color: "#fff" }}>Zayıf erişim kontrolü + geç tespit</span>
      </div>
      <Source>KVKK veri ihlali bildirimleri (2026)</Source>
    </AbsoluteFill>
  );
};
