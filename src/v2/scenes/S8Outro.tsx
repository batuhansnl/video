import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import credits from "../../../public/img/credits.json";
import { cue } from "../timing";
import { C, F, Kicker, Title, clamp, useIn, useSpring } from "../ui";

const ID = "s8_outro" as const;

const Check: React.FC<{ at: number; n: number; title: string; desc: string }> = ({ at, n, title, desc }) => {
  const p = useSpring(at, 14);
  return (
    <div
      style={{
        display: "flex",
        gap: 22,
        alignItems: "center",
        padding: "24px 28px",
        borderRadius: 14,
        border: `2px solid ${C.green}${p > 0.5 ? "aa" : "33"}`,
        background: `rgba(61,245,160,${0.04 + 0.08 * p})`,
        opacity: 0.2 + 0.8 * p,
        transform: `translateX(${(1 - p) * 40}px)`,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 60,
          border: `3px solid ${C.green}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 34,
          color: C.green,
          background: p > 0.5 ? `${C.green}22` : "transparent",
          flexShrink: 0,
        }}
      >
        ✓
      </div>
      <div>
        <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 31, color: "#fff" }}>
          {n}. {title}
        </div>
        <div style={{ fontFamily: F.sans, fontSize: 22, color: C.dim, marginTop: 4 }}>{desc}</div>
      </div>
    </div>
  );
};

export const S8Outro: React.FC = () => {
  const f = useCurrentFrame();
  const closing = cue(ID, "Çünkü 2026");
  const line = cue(ID, "Siber güvenlik bir masraf");
  const fadeList = interpolate(f, [closing - 6, closing + 10], [1, 0], clamp);
  const lineP = useSpring(line, 14);
  return (
    <AbsoluteFill style={{ padding: "110px 110px 170px" }}>
      <div style={{ opacity: fadeList, display: "flex", flexDirection: "column", gap: 20 }}>
        <Kicker color={C.green}>YOL HARİTASI // NE YAPMALI?</Kicker>
        <Title at={4} size={68}>
          Dört öncelik
        </Title>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 14 }}>
          <Check at={cue(ID, "Kimlikleri")} n={1} title="Kimliği koru" desc="Oltalamaya dayanıklı MFA (FIDO2), ayrıcalıklı hesap kontrolü" />
          <Check at={cue(ID, "Kritik transferleri")} n={2} title="İkinci kanaldan doğrula" desc="Ödeme ve kritik işlemlerde geri arama / çift onay" />
          <Check at={cue(ID, "Tedarikçi")} n={3} title="Üçüncü tarafları denetle" desc="Tedarikçi ve OAuth uygulama izinlerini düzenli gözden geçir" />
          <Check at={cue(ID, "tespit süresini")} n={4} title="Tespiti hızlandır" desc="7/24 izleme: tespit ve müdahale süresi dakikalara insin" />
        </div>
      </div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - fadeList }}>
        <div style={{ fontFamily: F.mono, fontSize: 28, letterSpacing: 6, color: C.cyan, opacity: useIn(closing, 14) }}>
          2026 BİZE ŞUNU GÖSTERDİ
        </div>
        <div
          style={{
            fontFamily: F.display,
            fontSize: 84,
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.08,
            marginTop: 30,
            opacity: lineP,
            transform: `scale(${0.94 + 0.06 * lineP})`,
          }}
        >
          SİBER GÜVENLİK
          <br />
          BİR MASRAF DEĞİL,
          <br />
          <span style={{ color: C.green, textShadow: `0 0 40px ${C.green}66` }}>İŞİN DEVAMLILIĞIDIR.</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

type Credit = { artist: string; license: string; title: string };

export const Credits: React.FC = () => {
  const p = useIn(4, 20);
  const list = Object.values(credits as Record<string, Credit>);
  return (
    <AbsoluteFill style={{ padding: "120px 140px", opacity: p }}>
      <div style={{ fontFamily: F.display, fontSize: 52, color: "#fff" }}>KAYNAKLAR</div>
      <div style={{ fontFamily: F.sans, fontSize: 24, color: C.text, marginTop: 18, lineHeight: 1.55 }}>
        IBM X-Force Threat Intelligence Index 2026 · CrowdStrike Global Threat Report 2026 · KVKK veri ihlali kamuoyu duyuruları ·
        Binance, TRM Labs ve FBI açıklamaları · CISA KEV kataloğu · Huntress ve Microsoft Threat Intelligence · Stryker SEC 8-K ·
        BleepingComputer, The Record, Help Net Security
      </div>
      <div style={{ fontFamily: F.display, fontSize: 30, color: C.cyan, marginTop: 40 }}>GÖRSELLER (WIKIMEDIA COMMONS)</div>
      <div style={{ columnCount: 2, columnGap: 60, marginTop: 14 }}>
        {list.map((c) => (
          <div key={c.title} style={{ fontFamily: F.mono, fontSize: 16, color: C.dim, lineHeight: 1.8 }}>
            {c.title.replace("File:", "")} — {c.artist.replace(/(Unknown author)+/, "Bilinmiyor").slice(0, 50)} · {c.license}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
