import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { cue, sceneFrames } from "../timing";
import { C, F, Kicker, PhotoBg, PhotoCard, Source, Tag, useIn, useSpring } from "../ui";

const ID = "s5_stryker" as const;

const Ops: React.FC<{ at: number; label: string }> = ({ at, label }) => {
  const p = useSpring(at, 12);
  const f = useCurrentFrame();
  const down = f > at + 8;
  return (
    <div
      style={{
        flex: 1,
        border: `2px solid ${down ? C.red : C.green}`,
        background: down ? `${C.red}22` : `${C.green}18`,
        borderRadius: 12,
        padding: "18px 20px",
        transform: `scale(${0.9 + 0.1 * p})`,
        opacity: 0.3 + 0.7 * p,
      }}
    >
      <div style={{ fontFamily: F.mono, fontSize: 18, color: C.dim, letterSpacing: 2 }}>{label}</div>
      <div style={{ fontFamily: F.mono, fontWeight: 800, fontSize: 30, color: down ? C.red : C.green, marginTop: 4 }}>
        {down ? "● DURDU" : "● ÇALIŞIYOR"}
      </div>
    </div>
  );
};

export const S5Stryker: React.FC = () => {
  const dur = sceneFrames(ID);
  const handala = cue(ID, "Handala");
  const wipe = cue(ID, "uzaktan sildi");
  const ops = cue(ID, "Sipariş");
  const noRansom = cue(ID, "Fidye istenmedi");
  const goal = cue(ID, "yalnızca zarar");
  const stamp = useSpring(goal, 9);
  return (
    <AbsoluteFill>
      <PhotoBg src="img/stryker_hq.jpg" dur={dur} opacity={0.38} blur={2} />
      <AbsoluteFill style={{ padding: "110px 90px 170px", flexDirection: "row", gap: 60 }}>
        <div style={{ flex: 1.1, display: "flex", flexDirection: "column", gap: 24 }}>
          <Kicker color={C.red}>OLAY 04 // DEVLET DESTEKLİ YIKIM</Kicker>
          <Img src={staticFile("img/stryker_logo.png")} style={{ width: 460, filter: "invert(1)", opacity: useIn(6) }} />
          <div style={{ fontFamily: F.sans, fontSize: 30, color: C.text, opacity: useIn(14) }}>
            Dünyanın en büyük tıbbi teknoloji şirketlerinden
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Tag at={cue(ID, "Mart ayında")} color={C.amber}>
              11 MART 2026
            </Tag>
            <Tag at={handala} color={C.red}>
              HANDALA · İRAN BAĞLANTILI
            </Tag>
            <Tag at={wipe} color={C.red}>
              WIPER: VERİ SİLME SALDIRISI
            </Tag>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
            <Ops at={ops} label="SİPARİŞ" />
            <Ops at={ops + 10} label="ÜRETİM" />
            <Ops at={ops + 20} label="SEVKİYAT" />
          </div>
          <div style={{ display: "flex", gap: 22, alignItems: "center", marginTop: 20 }}>
            <div
              style={{
                fontFamily: F.display,
                fontSize: 50,
                color: C.red,
                border: `5px solid ${C.red}`,
                padding: "8px 22px",
                borderRadius: 10,
                transform: `scale(${1.4 - 0.4 * stamp}) rotate(-4deg)`,
                opacity: stamp,
                background: "rgba(7,11,20,0.75)",
              }}
            >
              AMAÇ: YIKIM
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 22, color: C.dim, opacity: useIn(noRansom) }}>
              Fidye notu yok.
              <br />
              Şifreleme değil, silme.
            </div>
          </div>
        </div>
        <div style={{ flex: 0.9, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PhotoCard
            src="img/stryker_hq.jpg"
            at={8}
            w={700}
            h={470}
            rotate={2}
            accent={C.red}
            credit="Vraal48 · CC BY-SA 4.0"
            caption="Stryker genel merkezi, Kalamazoo (Michigan). Şirket SEC'e bildirdi: saldırı tüm Microsoft ortamını etkiledi."
          />
        </div>
      </AbsoluteFill>
      <Source>Stryker SEC 8-K · BleepingComputer · The Record · Unit 42 (Mart 2026)</Source>
    </AbsoluteFill>
  );
};
