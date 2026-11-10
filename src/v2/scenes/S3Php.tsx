import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cue, sceneFrames } from "../timing";
import { C, F, Kicker, Panel, PhotoBg, PhotoCard, Source, Tag, clamp, useIn, useSpring } from "../ui";

const ID = "s3_php" as const;

const Milestone: React.FC<{ at: number; date: string; text: string; color: string }> = ({ at, date, text, color }) => {
  const p = useSpring(at, 14);
  return (
    <div style={{ flex: 1, opacity: 0.2 + 0.8 * p, transform: `translateY(${(1 - p) * 16}px)` }}>
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 26,
          background: p > 0.5 ? color : "transparent",
          border: `3px solid ${color}`,
          boxShadow: p > 0.5 ? `0 0 18px ${color}` : "none",
          margin: "0 0 14px",
        }}
      />
      <div style={{ fontFamily: F.mono, fontWeight: 800, fontSize: 26, color }}>{date}</div>
      <div style={{ fontFamily: F.sans, fontSize: 22, color: C.text, marginTop: 4, lineHeight: 1.3 }}>{text}</div>
    </div>
  );
};

export const S3Php: React.FC = () => {
  const f = useCurrentFrame();
  const dur = sceneFrames(ID);
  const title = cue(ID, "PHP2Shell");
  const auth = cue(ID, "şifre bile");
  const two = cue(ID, "iki kritik");
  const patch = cue(ID, "Yamalar");
  const cisa = cue(ID, "CISA");
  const glitch = f > title && f < title + 14 ? Math.sin(f * 3) * 8 : 0;
  const tp = useSpring(title, 12);
  const lineP = interpolate(f, [patch - 10, cisa + 10], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <PhotoBg src="img/php_code.jpg" dur={dur} opacity={0.45} />
      <AbsoluteFill style={{ padding: "110px 90px 170px", flexDirection: "column", gap: 26 }}>
        <Kicker color={C.red}>OLAY 02 // ZAFİYET</Kicker>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <Img src={staticFile("img/php_logo.png")} style={{ width: 230, opacity: useIn(4), filter: "drop-shadow(0 10px 30px rgba(0,0,0,.6))" }} />
          <div
            style={{
              fontFamily: F.display,
              fontSize: 150,
              color: "#fff",
              opacity: tp,
              transform: `translateX(${glitch}px)`,
              textShadow: `${-glitch / 2}px 0 ${C.red}, ${glitch / 2}px 0 ${C.cyan}`,
              lineHeight: 1,
            }}
          >
            PHP2SHELL
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Tag at={auth} color={C.red} size={22}>
            KİMLİK DOĞRULAMASIZ UZAKTAN KOD ÇALIŞTIRMA
          </Tag>
          <Tag at={two} color={C.amber} size={22}>
            CVE-2026-109618
          </Tag>
          <Tag at={two + 6} color={C.amber} size={22}>
            CVE-2026-109619
          </Tag>
          <Tag at={two + 12} color={C.cyan} size={22}>
            PHP ÇALIŞMA ORTAMININ KENDİSİNDE
          </Tag>
        </div>
        <div style={{ display: "flex", gap: 40, alignItems: "flex-end", marginTop: "auto" }}>
          <Panel at={patch - 20} accent={C.amber} style={{ flex: 1, padding: "34px 40px" }}>
            <div style={{ fontFamily: F.mono, fontSize: 17, color: C.dim, letterSpacing: 2, marginBottom: 22 }}>ZAMAN ÇİZELGESİ</div>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: 12, left: 12, right: 12, height: 3, background: "rgba(255,255,255,0.12)" }} />
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  width: `calc((100% - 24px) * ${lineP})`,
                  height: 3,
                  background: `linear-gradient(90deg, ${C.green}, ${C.red})`,
                }}
              />
              <div style={{ display: "flex", gap: 30, position: "relative" }}>
                <Milestone at={patch} date="21 EKİM" text="PHP güvenlik yamaları yayımlandı" color={C.green} />
                <Milestone at={cue(ID, "Beş gün sonra")} date="26 EKİM · +5 GÜN" text="CISA: aktif istismar ediliyor (KEV listesi)" color={C.red} />
                <Milestone at={cisa + 20} date="29 EKİM" text="ABD federal kurumları için yama son tarihi" color={C.amber} />
              </div>
            </div>
          </Panel>
          <PhotoCard
            src="img/cisa_seal.png"
            at={cisa}
            w={250}
            h={250}
            fit="contain"
            bg="transparent"
            accent={C.cyan}
            credit="CISA · Kamu malı"
            style={{ marginBottom: 10 }}
          />
        </div>
      </AbsoluteFill>
      <Source>CISA KEV · BleepingComputer · SecurityAffairs (Ekim 2026)</Source>
    </AbsoluteFill>
  );
};
