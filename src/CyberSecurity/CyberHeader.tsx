import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export const CyberHeader: React.FC<{ title?: string }> = ({
  title = "2026 SİBER TEHDİT & OLAY İSTİHBARATI",
}) => {
  const frame = useCurrentFrame();

  const blink = Math.floor(frame / 15) % 2 === 0;

  return (
    <div
      style={{
        position: "absolute",
        top: 28,
        left: 48,
        right: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(14, 165, 233, 0.25)",
        paddingBottom: 14,
        zIndex: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: blink ? "#ef4444" : "#7f1d1d",
            boxShadow: blink ? "0 0 10px #ef4444" : "none",
          }}
        />
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 14,
            letterSpacing: 2,
            color: "#38bdf8",
            fontWeight: "bold",
          }}
        >
          {title}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            padding: "4px 10px",
            borderRadius: 4,
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            color: "#f87171",
            fontFamily: "monospace",
            fontSize: 12,
            letterSpacing: 1,
            fontWeight: 600,
          }}
        >
          KRİTİK UYARI
        </div>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: 13,
            color: "rgba(255, 255, 255, 0.5)",
          }}
        >
          YIL: 2026 // TR-CERT RADAR
        </div>
      </div>
    </div>
  );
};

