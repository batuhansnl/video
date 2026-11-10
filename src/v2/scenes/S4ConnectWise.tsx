import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cue } from "../timing";
import { C, Counter, F, Kicker, Panel, Source, Tag, Title, clamp, useIn, useSpring } from "../ui";

const ID = "s4_connectwise" as const;

export const S4ConnectWise: React.FC = () => {
  const f = useCurrentFrame();
  const key = cue(ID, "tek bir anahtar");
  const stolen = cue(ID, "anahtarı çalındı");
  const tenants = cue(ID, "yüz altmışı");
  const mfa = cue(ID, "çok faktörlü");
  const keyP = useSpring(stolen, 12);
  const mfaP = useSpring(mfa, 10);
  const N = 162;
  return (
    <AbsoluteFill style={{ padding: "110px 90px 170px", flexDirection: "row", gap: 50 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
        <Kicker color={C.amber}>OLAY 03 // TEDARİK ZİNCİRİ</Kicker>
        <Title at={key} size={78}>
          Tek anahtar,
          <br />
          <span style={{ color: C.amber }}>yüzlerce kapı</span>
        </Title>
        <Img src={staticFile("img/connectwise_logo.png")} style={{ width: 430, opacity: useIn(10), filter: "brightness(1.6)" }} />
        <div style={{ fontFamily: F.sans, fontSize: 26, color: C.dim, lineHeight: 1.4, opacity: useIn(16) }}>
          Cloud Backup (eski adıyla SkyKick) uygulamasına ait
          <br />
          Microsoft 365 API anahtarı ele geçirildi.
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Tag at={key} color={C.amber}>
            15–16 EKİM 2026
          </Tag>
          <Tag at={stolen} color={C.red}>
            ÇALINAN UYGULAMA ANAHTARI
          </Tag>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, marginTop: 8 }}>
          <Counter at={tenants} to={162} prefix="" suffix="+" size={120} color={C.amber} />
          <div style={{ fontFamily: F.mono, fontSize: 20, color: C.dim, letterSpacing: 1.5, paddingBottom: 14 }}>
            MICROSOFT 365 ORTAMINA
            <br />
            YETKİSİZ GİRİŞ
          </div>
        </div>
        <Panel at={mfa} accent={C.red} style={{ padding: "20px 26px", marginTop: 6 }}>
          <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 27, color: "#fff" }}>
            <span style={{ color: C.red }}>MFA devreye girmedi:</span> erişim bir kullanıcıya değil, güvenilen bir uygulamaya aitti.
          </div>
        </Panel>
      </div>
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 720, height: 720 }}>
          {Array.from({ length: N }).map((_, i) => {
            const ringI = i % 3;
            const r = 200 + ringI * 75;
            const a = (i / N) * Math.PI * 2 * 1 + ringI * 0.3 + f * 0.002 * (ringI % 2 ? -1 : 1);
            const lit = f > tenants + (i / N) * 50;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 360 + Math.cos(a) * r - 6,
                  top: 360 + Math.sin(a) * r - 6,
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: lit ? C.red : "rgba(255,181,71,0.35)",
                  boxShadow: lit ? `0 0 10px ${C.red}` : "none",
                }}
              />
            );
          })}
          {/* yayılan ışınlar */}
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const p = interpolate(f, [tenants - 10 + i, tenants + 30 + i], [0, 1], clamp);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 360,
                  top: 359,
                  width: 340 * p,
                  height: 2,
                  background: `linear-gradient(90deg, ${C.red}, transparent)`,
                  transform: `rotate(${a}rad)`,
                  transformOrigin: "0 50%",
                  opacity: 0.7 * (1 - p * 0.5),
                }}
              />
            );
          })}
          <div
            style={{
              position: "absolute",
              left: 360 - 95,
              top: 360 - 95,
              width: 190,
              height: 190,
              borderRadius: 190,
              background: `radial-gradient(circle, ${keyP > 0.5 ? C.red : C.amber}55, rgba(7,11,20,0.95) 70%)`,
              border: `3px solid ${keyP > 0.5 ? C.red : C.amber}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 60px ${keyP > 0.5 ? C.red : C.amber}88`,
            }}
          >
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
              <circle cx="7.5" cy="12" r="4" />
              <path d="M11.5 12H21M18 12v3M15 12v2" strokeLinecap="round" />
            </svg>
            <div style={{ fontFamily: F.mono, fontWeight: 800, fontSize: 15, color: "#fff", marginTop: 6, letterSpacing: 1 }}>
              OAUTH UYGULAMASI
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              right: 30,
              top: 20,
              fontFamily: F.display,
              fontSize: 54,
              color: C.red,
              transform: `scale(${mfaP}) rotate(-8deg)`,
              border: `5px solid ${C.red}`,
              padding: "6px 18px",
              borderRadius: 10,
              background: "rgba(7,11,20,0.8)",
            }}
          >
            MFA ✕
          </div>
        </div>
      </div>
      <Source>Huntress · Microsoft Threat Intelligence · Help Net Security (Ekim 2026)</Source>
    </AbsoluteFill>
  );
};
