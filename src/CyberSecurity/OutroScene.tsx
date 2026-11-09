import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ShieldIcon } from "./CyberIcons";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  const contentOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const items = [
    {
      title: "Sıfır Güven (Zero Trust) Mimarisi",
      desc: "Sürekli kimlik doğrulama ve en az yetki prensibi zorunlu tutulmalı.",
    },
    {
      title: "Post-Quantum Şifreleme Geçişi",
      desc: "NIST standartlarına uygun PQC algoritmaları altyapıya entegre edilmeli.",
    },
    {
      title: "Yapay Zekâ ile Otonom Savunma",
      desc: "Saldırı hızındaki tehditler ancak yapay zekâ tehdit avcılarıyla engellenebilir.",
    },
  ];

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
      <div
        style={{
          transform: `scale(${scale})`,
          marginBottom: 20,
        }}
      >
        <ShieldIcon size={80} color="#22c55e" />
      </div>

      <div
        style={{
          padding: "4px 14px",
          borderRadius: 20,
          background: "rgba(34, 197, 94, 0.15)",
          border: "1px solid rgba(34, 197, 94, 0.4)",
          color: "#4ade80",
          fontSize: 13,
          letterSpacing: 2,
          fontWeight: 700,
          fontFamily: "monospace",
          marginBottom: 16,
        }}
      >
        SAVUNMA PROTOKOLÜ
      </div>

      <h1
        style={{
          fontSize: 52,
          fontWeight: 900,
          color: "#ffffff",
          margin: 0,
          fontFamily: "system-ui, -apple-system, sans-serif",
          opacity: contentOpacity,
        }}
      >
        2026 İÇİN PROAKTİF ÖNLEMLER
      </h1>

      <p
        style={{
          fontSize: 22,
          color: "#94a3b8",
          marginTop: 10,
          marginBottom: 40,
          opacity: contentOpacity,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        Olay gerçekleştikten sonra değil, gerçekleşmeden önce korunun.
      </p>

      {/* Action items grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
          maxWidth: 1180,
          width: "100%",
          opacity: contentOpacity,
        }}
      >
        {items.map((item, idx) => {
          const itemSlide = interpolate(
            frame,
            [15 + idx * 10, 30 + idx * 10],
            [20, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={idx}
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: 12,
                padding: "24px 20px",
                textAlign: "left",
                transform: `translateY(${itemSlide}px)`,
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: "#4ade80",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                0{idx + 1} // ADIM
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#f8fafc",
                  marginBottom: 8,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#94a3b8",
                  lineHeight: 1.5,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {item.desc}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 40,
          fontFamily: "monospace",
          fontSize: 13,
          color: "rgba(148, 163, 184, 0.7)",
          letterSpacing: 2,
        }}
      >
        GÜVENLİĞİNİZİ ŞİMDİDEN GÜNCELLEYİN // 2026 SİBER RAPOR
      </div>
    </AbsoluteFill>
  );
};

