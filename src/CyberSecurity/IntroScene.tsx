import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ShieldIcon } from "./CyberIcons";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animations
  const scale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  const titleOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleSlide = interpolate(frame, [15, 35], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glitch flicker effect on title
  const glitch = frame % 9 === 0 ? "2px 0 0 #0ea5e9, -2px 0 0 #ef4444" : "none";

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        textAlign: "center",
      }}
    >
      {/* Animated Glowing Shield Centerpiece */}
      <div
        style={{
          transform: `scale(${scale})`,
          marginBottom: 30,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -20,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, transparent 70%)",
            filter: "blur(15px)",
          }}
        />
        <ShieldIcon size={100} color="#38bdf8" />
      </div>

      {/* Main Tag */}
      <div
        style={{
          opacity: badgeOpacity,
          padding: "6px 18px",
          borderRadius: 20,
          background: "linear-gradient(90deg, rgba(14, 165, 233, 0.2), rgba(99, 102, 241, 0.2))",
          border: "1px solid rgba(56, 189, 248, 0.4)",
          color: "#38bdf8",
          fontSize: 15,
          letterSpacing: 3,
          fontWeight: 700,
          fontFamily: "monospace",
          marginBottom: 20,
        }}
      >
        KÜRESEL TEHDİT BÜLTENİ
      </div>

      {/* Massive Headline */}
      <h1
        style={{
          fontSize: 76,
          fontWeight: 900,
          letterSpacing: -1,
          color: "#ffffff",
          margin: 0,
          lineHeight: 1.1,
          opacity: titleOpacity,
          textShadow: glitch,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        2026 SİBER OLAYLAR
      </h1>

      {/* Futuristic Gradient Subtitle */}
      <p
        style={{
          fontSize: 28,
          color: "#94a3b8",
          marginTop: 18,
          maxWidth: 900,
          transform: `translateY(${subtitleSlide}px)`,
          opacity: titleOpacity,
          fontWeight: 400,
          lineHeight: 1.4,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        Yapay Zekâ Saldırıları, Kuantum Öncesi Tehditler ve Dijital Savunma Dinamikleri
      </p>

      {/* Bottom telemetry indicators */}
      <div
        style={{
          marginTop: 50,
          display: "flex",
          gap: 32,
          opacity: badgeOpacity,
        }}
      >
        {[
          { label: "KÜRESEL VERİ İHLALİ", val: "%420 ARTIŞ" },
          { label: "HEDEF ALINAN SİSTEMLER", val: "BULUT & AJANLAR" },
          { label: "MÜDAHALE SÜRESİ", val: "< 4 DAKİKA" },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              padding: "12px 24px",
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(51, 65, 85, 0.7)",
              borderRadius: 8,
              textAlign: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontFamily: "monospace",
                color: "#64748b",
                letterSpacing: 1,
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontSize: 18,
                fontFamily: "monospace",
                fontWeight: 700,
                color: "#38bdf8",
                marginTop: 4,
              }}
            >
              {item.val}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

