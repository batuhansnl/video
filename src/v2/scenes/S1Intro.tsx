import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { cue, sceneFrames } from "../timing";
import { C, F, PhotoBg, Tag, clamp, useIn, useSpring } from "../ui";

const ID = "s1_intro" as const;

export const S1Intro: React.FC = () => {
  const f = useCurrentFrame();
  const dur = sceneFrames(ID);
  const t1 = useSpring(4, 12);
  const t2 = useSpring(14, 12);
  const sub = useIn(26, 20);
  const key = cue(ID, "Anahtarla");
  const keyP = useSpring(key, 10);
  const flicker = f < 30 ? (Math.floor(f / 3) % 2 ? 0.6 : 1) : 1;
  const ring = interpolate(f, [0, dur], [0, 360], clamp);
  return (
    <AbsoluteFill>
      <PhotoBg src="img/datacenter.jpg" dur={dur} opacity={0.5} from={1.15} to={1.0} />
      <AbsoluteFill style={{ padding: "150px 110px", flexDirection: "row", alignItems: "center" }}>
        <div style={{ flex: 1.25 }}>
          <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: 6, color: C.cyan, opacity: sub }}>
            BİLGİ GÜVENLİĞİ BRİFİNGİ
          </div>
          <div
            style={{
              fontFamily: F.display,
              fontSize: 250,
              lineHeight: 0.95,
              color: "#fff",
              opacity: t1 * flicker,
              transform: `scale(${0.9 + 0.1 * t1})`,
              transformOrigin: "left center",
              textShadow: "0 0 50px rgba(56,225,255,0.35)",
            }}
          >
            2026
          </div>
          <div style={{ fontFamily: F.display, fontSize: 104, lineHeight: 1, opacity: t2, transform: `translateX(${(1 - t2) * -60}px)` }}>
            <span style={{ color: C.red }}>SİBER</span> <span style={{ color: "#fff" }}>OLAYLAR</span>
          </div>
          <div style={{ fontFamily: F.sans, fontSize: 34, color: C.dim, marginTop: 24, opacity: sub }}>
            Yılın öne çıkan saldırıları, tehdit görünümü ve Türkiye'den vakalar
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 42 }}>
            <Tag at={cue(ID, "Çalınan kimlikler")} color={C.red} size={22}>
              ÇALINAN KİMLİKLER
            </Tag>
            <Tag at={cue(ID, "yapay zekâ")} color={C.violet} size={22}>
              YAPAY ZEKÂ
            </Tag>
            <Tag at={cue(ID, "güvenilen tedarikçiler")} color={C.amber} size={22}>
              TEDARİK ZİNCİRİ
            </Tag>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "relative", width: 520, height: 520 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: i * 50,
                  borderRadius: "50%",
                  border: `2px dashed ${i === 1 ? C.red : C.cyan}${i === 1 ? "aa" : "66"}`,
                  transform: `rotate(${(i % 2 ? -1 : 1) * ring * (1 + i * 0.5)}deg)`,
                }}
              />
            ))}
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
              <svg width="220" height="220" viewBox="0 0 100 100" style={{ opacity: t1 }}>
                {/* anahtar deliği / kilit */}
                <rect x="22" y="44" width="56" height="44" rx="7" fill="none" stroke={C.cyan} strokeWidth="4" />
                <path
                  d={`M34 44 V32 a16 16 0 0 1 32 0 V${44 - keyP * 10}`}
                  fill="none"
                  stroke={keyP > 0.5 ? C.red : C.cyan}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="62" r="6" fill={keyP > 0.5 ? C.red : C.cyan} />
                <rect x="47.5" y="64" width="5" height="12" rx="2" fill={keyP > 0.5 ? C.red : C.cyan} />
              </svg>
            </AbsoluteFill>
            <div
              style={{
                position: "absolute",
                bottom: -20,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: F.mono,
                fontWeight: 800,
                fontSize: 26,
                letterSpacing: 4,
                color: C.red,
                opacity: keyP,
              }}
            >
              ERİŞİM: GEÇERLİ KİMLİK İLE
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
