import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cue } from "../timing";
import { C, Counter, F, Kicker, Panel, PhotoCard, Source, Tag, Title, clamp, useIn } from "../ui";

const ID = "s2_binance" as const;

const Step: React.FC<{ at: number; n: string; title: string; desc: string; color: string }> = ({ at, n, title, desc, color }) => {
  const p = useIn(at, 14);
  return (
    <div style={{ display: "flex", gap: 18, alignItems: "flex-start", opacity: 0.25 + 0.75 * p }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          border: `2px solid ${color}`,
          background: p > 0.5 ? `${color}33` : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: F.mono,
          fontWeight: 800,
          fontSize: 22,
          color,
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      <div>
        <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 28, color: "#fff" }}>{title}</div>
        <div style={{ fontFamily: F.sans, fontSize: 21, color: C.dim, marginTop: 2 }}>{desc}</div>
      </div>
    </div>
  );
};

export const S2Binance: React.FC = () => {
  const f = useCurrentFrame();
  const amount = cue(ID, "altı virgül üç");
  const how = cue(ID, "Peki nasıl");
  const pc = cue(ID, "bilgisayarı");
  const keys = cue(ID, "imza anahtarlarına");
  const chains = cue(ID, "on ayrı blokzincire");
  const fbi = cue(ID, "FBI");
  const termOut = interpolate(f, [fbi - 4, fbi + 10], [1, 0], clamp);
  const lines: [number, string, string][] = [
    [cue(ID, "Yirmi dokuz"), "[29.10.2026 20:05 UTC] hot-wallet: imzalı çekim başladı", C.amber],
    [amount + 8, "[20:06] ETH  ▸ sweeper delegasyonu (EIP-7702)", C.cyan],
    [amount + 30, "[20:09] BTC · TRX · SOL · BSC ▸ çoklu zincir transfer", C.cyan],
    [cue(ID, "Kripto tarihinin"), "[20:18] KRİTİK: ≈ $6,3 MİLYAR çıkış", C.red],
    [how + 10, "[30.10] Binance: kök neden ▸ ele geçirilen DevOps dizüstü", C.amber],
    [chains + 10, "[30.10] ≈ $3 milyar Tether/Circle tarafından donduruldu", C.green],
  ];
  return (
    <AbsoluteFill style={{ padding: "110px 90px 170px", flexDirection: "row", gap: 60 }}>
      <div style={{ flex: 1.05, display: "flex", flexDirection: "column", gap: 22 }}>
        <Kicker color={C.red}>OLAY 01 // KRİPTO</Kicker>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <Img src={staticFile("img/binance_logo.png")} style={{ width: 96, height: 96, opacity: useIn(4) }} />
          <Title at={6} size={80}>
            Binance soygunu
          </Title>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Tag at={cue(ID, "Yirmi dokuz")} color={C.amber}>
            29 EKİM 2026 · TEK GECE
          </Tag>
          <Tag at={cue(ID, "en büyük soygunu")} color={C.red}>
            KRİPTO TARİHİNİN EN BÜYÜĞÜ
          </Tag>
        </div>
        <div style={{ marginTop: 10 }}>
          <Counter at={amount} to={6.3} decimals={1} prefix="$" suffix=" MİLYAR" size={112} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 12 }}>
          <Step at={pc} n="1" title="Mühendis bilgisayarı ele geçirildi" desc="Hedef yazılım değil, insan ve cihazı" color={C.amber} />
          <Step at={keys} n="2" title="İmza anahtarlarına ulaşıldı" desc="Saldırgan geçerli işlem imzalayabildi" color={C.red} />
          <Step at={chains} n="3" title="Dakikalar içinde 10 blokzincir" desc="Takibi zorlaştıran çoklu zincir dağıtımı" color={C.red} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          {Array.from({ length: 10 }).map((_, i) => {
            const on = f > chains + i * 3;
            return (
              <div
                key={i}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  border: `2px solid ${C.red}88`,
                  background: on ? C.red : "transparent",
                  boxShadow: on ? `0 0 14px ${C.red}` : "none",
                }}
              />
            );
          })}
        </div>
      </div>
      <div style={{ flex: 1, position: "relative" }}>
        <Panel at={10} accent={C.red} style={{ position: "absolute", inset: "40px 0 auto 0", opacity: termOut, padding: 28 }}>
          <div style={{ fontFamily: F.mono, fontSize: 16, color: C.dim, letterSpacing: 2, marginBottom: 16 }}>
            ZİNCİR ÜSTÜ OLAY GÜNLÜĞÜ
          </div>
          {lines.map(([at, txt, col], i) => {
            const p = interpolate(f, [at, at + 14], [0, 1], clamp);
            const shown = txt.slice(0, Math.floor(txt.length * p));
            return (
              <div key={i} style={{ fontFamily: F.mono, fontSize: 21, color: col, lineHeight: 1.75, minHeight: 37 }}>
                {shown}
                {p > 0 && p < 1 ? "▌" : ""}
              </div>
            );
          })}
        </Panel>
        <div style={{ position: "absolute", top: 0, left: 90, display: "flex", gap: 30, alignItems: "flex-start" }}>
          <PhotoCard
            src="img/fbi_parkjinhyok.png"
            at={fbi}
            w={430}
            h={510}
            rotate={-3}
            accent={C.red}
            fit="contain"
            bg="#fff"
            credit="FBI · Kamu malı"
            caption="FBI, saldırıyı Kuzey Kore'nin TraderTraitor (Lazarus) birimine bağladı. Görsel: Lazarus üyesi için FBI arama posteri (2018)."
          />
        </div>
      </div>
      <Source>Binance açıklaması · TRM Labs · FBI · BleepingComputer (Ekim 2026)</Source>
    </AbsoluteFill>
  );
};
