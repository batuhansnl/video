import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const CyberBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle pulsing grid and scanline motion
  const gridOffset = (frame * 1.5) % 60;
  const scanlineY = (frame * 4) % 1080;
  const glowPulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.2, 0.45],
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#030712",
        overflow: "hidden",
        fontFamily: "'Courier New', monospace, sans-serif",
      }}
    >
      {/* Radial ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          width: 900,
          height: 600,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, rgba(99, 102, 241, 0.1) 45%, transparent 70%)",
          filter: "blur(60px)",
          opacity: glowPulse + 0.4,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 60%)",
          filter: "blur(70px)",
          opacity: glowPulse,
          pointerEvents: "none",
        }}
      />

      {/* Cyber Grid */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.18,
          pointerEvents: "none",
        }}
      >
        <defs>
          <pattern
            id="cyber-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(0, ${gridOffset})`}
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cyber-grid)" />
      </svg>

      {/* Floating binary stream accents */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 40,
          color: "rgba(14, 165, 233, 0.25)",
          fontSize: 13,
          lineHeight: 1.6,
          userSelect: "none",
        }}
      >
        <div>01010011 01001001 01000010 01000101 01010010</div>
        <div>2026 // INCIDENT_RESPONSE_PROTOCOL_V4</div>
        <div>SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4</div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 70,
          right: 40,
          textAlign: "right",
          color: "rgba(239, 68, 68, 0.35)",
          fontSize: 13,
          lineHeight: 1.6,
          userSelect: "none",
        }}
      >
        <div>SYSTEM STATUS: ELEVATED THREAT</div>
        <div>TELEMETRY: ONLINE [ACTIVE_SCAN]</div>
        <div>PORT: 8443 / ZERO_TRUST_ACTIVE</div>
      </div>

      {/* Moving scanning beam */}
      <div
        style={{
          position: "absolute",
          top: scanlineY,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent 0%, rgba(14, 165, 233, 0.6) 50%, transparent 100%)",
          boxShadow: "0 0 15px rgba(14, 165, 233, 0.8)",
          pointerEvents: "none",
        }}
      />

      {/* Vignette border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 100px rgba(0,0,0,0.85)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

