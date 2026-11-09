import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AiIncidentIcon, CloudChainIcon, QuantumIcon, ShieldIcon } from "./CyberIcons";

export type ThreatCardProps = {
  readonly index: string;
  readonly category: string;
  readonly title: string;
  readonly severity: "KRİTİK" | "YÜKSEK" | "ORTA";
  readonly statLabel: string;
  readonly statValue: string;
  readonly points: readonly string[];
  readonly iconType: "ai" | "quantum" | "cloud" | "shield";
};

export const ThreatCardScene: React.FC<ThreatCardProps> = ({
  index,
  category,
  title,
  severity,
  statLabel,
  statValue,
  points,
  iconType,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  const cardSlide = interpolate(cardEntrance, [0, 1], [40, 0]);
  const cardOpacity = interpolate(cardEntrance, [0, 1], [0, 1]);

  const severityColor =
    severity === "KRİTİK"
      ? "#ef4444"
      : severity === "YÜKSEK"
      ? "#f97316"
      : "#eab308";

  const renderIcon = () => {
    switch (iconType) {
      case "ai":
        return <AiIncidentIcon size={70} color="#ef4444" />;
      case "quantum":
        return <QuantumIcon size={70} color="#a855f7" />;
      case "cloud":
        return <CloudChainIcon size={70} color="#f59e0b" />;
      default:
        return <ShieldIcon size={70} color="#38bdf8" />;
    }
  };

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 100px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.7) 100%)",
          border: "1px solid rgba(56, 189, 248, 0.35)",
          borderRadius: 16,
          padding: "44px 56px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(14, 165, 233, 0.15)",
          backdropFilter: "blur(12px)",
          transform: `translateY(${cardSlide}px)`,
          opacity: cardOpacity,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle accent line on top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, transparent 0%, ${severityColor} 50%, transparent 100%)`,
          }}
        />

        {/* Top meta row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 22,
                fontWeight: 900,
                color: "#38bdf8",
              }}
            >
              TEHDİT #{index}
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                letterSpacing: 2,
                color: "#94a3b8",
                textTransform: "uppercase",
              }}
            >
              // {category}
            </span>
          </div>

          <div
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              backgroundColor: `${severityColor}22`,
              border: `1px solid ${severityColor}66`,
              color: severityColor,
              fontFamily: "monospace",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 1.5,
            }}
          >
            SEVİYE: {severity}
          </div>
        </div>

        {/* Main content grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 280px",
            gap: 40,
            alignItems: "center",
          }}
        >
          {/* Left Column: Title & Points */}
          <div>
            <h2
              style={{
                fontSize: 42,
                fontWeight: 800,
                color: "#f8fafc",
                margin: "0 0 24px 0",
                lineHeight: 1.2,
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              {title}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {points.map((p, idx) => {
                const pointOpacity = interpolate(
                  frame,
                  [20 + idx * 12, 35 + idx * 12],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const pointSlide = interpolate(
                  frame,
                  [20 + idx * 12, 35 + idx * 12],
                  [15, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );

                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      opacity: pointOpacity,
                      transform: `translateX(${pointSlide}px)`,
                    }}
                  >
                    <span
                      style={{
                        color: "#38bdf8",
                        fontSize: 18,
                        lineHeight: 1.4,
                      }}
                    >
                      ▶
                    </span>
                    <span
                      style={{
                        color: "#cbd5e1",
                        fontSize: 20,
                        lineHeight: 1.4,
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                    >
                      {p}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Icon & Stat Badge */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
              borderRadius: 12,
              padding: "32px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: 16 }}>{renderIcon()}</div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: severityColor,
                fontFamily: "monospace",
                letterSpacing: -1,
              }}
            >
              {statValue}
            </div>
            <div
              style={{
                fontSize: 12,
                fontFamily: "monospace",
                color: "#94a3b8",
                marginTop: 6,
                letterSpacing: 1,
              }}
            >
              {statLabel}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

