import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadArchivo } from "@remotion/google-fonts/ArchivoBlack";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { SubCue } from "./timing";

const archivo = loadArchivo("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
const mono = loadMono("normal", { weights: ["400", "700", "800"], subsets: ["latin", "latin-ext"] });
const grotesk = loadGrotesk("normal", { weights: ["400", "500", "700"], subsets: ["latin", "latin-ext"] });

export const F = {
  display: archivo.fontFamily,
  mono: mono.fontFamily,
  sans: grotesk.fontFamily,
};

export const C = {
  bg: "#070B14",
  panel: "rgba(13, 20, 36, 0.86)",
  line: "rgba(56, 225, 255, 0.22)",
  cyan: "#38E1FF",
  red: "#FF3B5C",
  amber: "#FFB547",
  green: "#3DF5A0",
  violet: "#A78BFA",
  text: "#EAF0FF",
  dim: "#94A3B8",
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 yumuşak giriş, verilen kareden başlayarak */
export const useIn = (at: number, dur = 18) => {
  const f = useCurrentFrame();
  return interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
};

export const useSpring = (at: number, damping = 14) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping, mass: 0.8 } });
};

/** Arka plan: ızgara, hafif hareketli parçacıklar, vinyet */
export const Backdrop: React.FC<{ tint?: string }> = ({ tint = C.cyan }) => {
  const f = useCurrentFrame();
  const shift = (f * 0.4) % 60;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 20% 15%, ${tint}22 0%, transparent 45%), radial-gradient(circle at 85% 90%, ${C.red}18 0%, transparent 50%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(to right, rgba(56,225,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,225,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          backgroundPosition: `${shift}px ${shift}px`,
        }}
      />
      {Array.from({ length: 26 }).map((_, i) => {
        const x = (i * 337) % 1920;
        const y = ((i * 191 + f * (0.3 + (i % 5) * 0.12)) % 1180) - 50;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: 1080 - y,
              width: 3,
              height: 3,
              borderRadius: 3,
              background: i % 4 === 0 ? C.red : C.cyan,
              opacity: 0.35,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      boxShadow: "inset 0 0 220px rgba(4,7,14,0.95)",
      background: "linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.12) 50%)",
      backgroundSize: "100% 4px",
    }}
  />
);

/** Ken Burns efektli tam ekran fotoğraf */
export const PhotoBg: React.FC<{
  src: string;
  dur: number;
  opacity?: number;
  from?: number;
  to?: number;
  pos?: string;
  blur?: number;
}> = ({ src, dur, opacity = 0.35, from = 1.05, to = 1.15, pos = "center", blur = 0 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [from, to], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: pos,
          transform: `scale(${s})`,
          filter: `saturate(0.7) contrast(1.05) ${blur ? `blur(${blur}px)` : ""}`,
        }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(7,11,20,0.92) 0%, rgba(7,11,20,0.55) 55%, rgba(7,11,20,0.85) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Çerçeveli gerçek fotoğraf kartı + kaynak etiketi */
export const PhotoCard: React.FC<{
  src: string;
  at: number;
  w: number;
  h: number;
  credit: string;
  caption?: string;
  rotate?: number;
  fit?: "cover" | "contain";
  bg?: string;
  accent?: string;
  style?: React.CSSProperties;
}> = ({ src, at, w, h, credit, caption, rotate = 0, fit = "cover", bg = "#0b1220", accent = C.cyan, style }) => {
  const f = useCurrentFrame();
  const p = useSpring(at, 16);
  const zoom = interpolate(f, [at, at + 300], [1.02, 1.12], clamp);
  return (
    <div
      style={{
        width: w,
        transform: `translateY(${(1 - p) * 40}px) rotate(${rotate * p}deg) scale(${0.92 + 0.08 * p})`,
        opacity: p,
        ...style,
      }}
    >
      <div
        style={{
          width: w,
          height: h,
          borderRadius: 14,
          overflow: "hidden",
          border: `2px solid ${accent}66`,
          boxShadow: `0 30px 70px rgba(0,0,0,0.7), 0 0 0 6px rgba(7,11,20,0.6)`,
          background: bg,
          position: "relative",
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: fit,
            transform: fit === "cover" ? `scale(${zoom})` : undefined,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 8,
            bottom: 8,
            fontFamily: F.mono,
            fontSize: 12,
            color: "rgba(255,255,255,0.75)",
            background: "rgba(0,0,0,0.55)",
            padding: "3px 8px",
            borderRadius: 4,
          }}
        >
          {credit}
        </div>
      </div>
      {caption ? (
        <div style={{ marginTop: 12, fontFamily: F.mono, fontSize: 17, color: C.dim, letterSpacing: 0.5, lineHeight: 1.4, whiteSpace: "pre-line" }}>
          {caption}
        </div>
      ) : null}
    </div>
  );
};

export const Tag: React.FC<{ children: React.ReactNode; color?: string; at?: number; size?: number }> = ({
  children,
  color = C.cyan,
  at = 0,
  size = 18,
}) => {
  const p = useIn(at, 12);
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: F.mono,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: 1.5,
        color,
        border: `1.5px solid ${color}`,
        background: `${color}1f`,
        padding: "7px 14px",
        borderRadius: 6,
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
      }}
    >
      {children}
    </span>
  );
};

export const Kicker: React.FC<{ children: React.ReactNode; color?: string; at?: number }> = ({
  children,
  color = C.cyan,
  at = 0,
}) => {
  const p = useIn(at, 14);
  return (
    <div
      style={{
        fontFamily: F.mono,
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: 4,
        color,
        opacity: p,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <span style={{ width: 40 * p, height: 3, background: color, display: "inline-block" }} />
      {children}
    </div>
  );
};

export const Title: React.FC<{ children: React.ReactNode; at?: number; size?: number; color?: string }> = ({
  children,
  at = 0,
  size = 76,
  color = "#fff",
}) => {
  const p = useSpring(at, 15);
  return (
    <div
      style={{
        fontFamily: F.display,
        fontSize: size,
        lineHeight: 1.02,
        color,
        letterSpacing: -1,
        textTransform: "uppercase",
        opacity: p,
        transform: `translateX(${(1 - p) * -40}px)`,
        textShadow: "0 0 30px rgba(56,225,255,0.25)",
      }}
    >
      {children}
    </div>
  );
};

/** Sayaç: belirtilen karede başlayıp değere doğru sayar */
export const Counter: React.FC<{
  at: number;
  dur?: number;
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  size?: number;
  color?: string;
}> = ({ at, dur = 40, to, decimals = 0, prefix = "", suffix = "", size = 110, color = C.red }) => {
  const f = useCurrentFrame();
  const pe = interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: Easing.out(Easing.exp) });
  const p = f >= at + dur ? 1 : pe; // Easing.exp 1'e tam ulaşmıyor
  const v = (to * p).toLocaleString("tr-TR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <div
      style={{
        fontFamily: F.mono,
        fontWeight: 800,
        fontSize: size,
        color,
        lineHeight: 1,
        textShadow: `0 0 40px ${color}66`,
        opacity: f < at ? 0.25 : 1,
      }}
    >
      {prefix}
      {v}
      {suffix}
    </div>
  );
};

export const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; accent?: string; at?: number }> = ({
  children,
  style,
  accent = C.cyan,
  at = 0,
}) => {
  const p = useSpring(at, 18);
  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${accent}40`,
        borderRadius: 16,
        padding: 32,
        boxShadow: `0 25px 60px rgba(0,0,0,0.6), inset 0 0 25px ${accent}10`,
        position: "relative",
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 24,
          right: 24,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
      {children}
    </div>
  );
};

/** Üst HUD şeridi */
export const Hud: React.FC<{ label: string; frame: number; total: number }> = ({ label, frame, total }) => {
  const t = frame / 30;
  const T = total / 30;
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "rgba(255,255,255,0.08)" }}>
        <div
          style={{
            width: `${(frame / total) * 100}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${C.cyan}, ${C.amber}, ${C.red})`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 22,
          left: 56,
          right: 56,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: F.mono,
          fontSize: 16,
          letterSpacing: 2,
          color: "rgba(234,240,255,0.65)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 10,
              background: C.red,
              boxShadow: `0 0 10px ${C.red}`,
              opacity: Math.floor(frame / 15) % 2 ? 1 : 0.4,
            }}
          />
          <span style={{ color: C.cyan, fontWeight: 700 }}>BİLGİ GÜVENLİĞİ // BRİFİNG 2026</span>
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <span
            style={{
              border: `1px solid ${C.cyan}66`,
              color: C.cyan,
              padding: "3px 10px",
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {label}
          </span>
          <span>
            {fmt(t)} / {fmt(T)}
          </span>
        </div>
      </div>
    </>
  );
};

/** Alt altyazı kutusu */
export const Subtitles: React.FC<{ cues: SubCue[]; accent?: string }> = ({ cues, accent = C.cyan }) => {
  const f = useCurrentFrame();
  const cur = cues.find((c) => f >= c.from && f < c.to);
  if (!cur) return null;
  const p = interpolate(f, [cur.from, cur.from + 6], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 46,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          background: "rgba(5,8,16,0.86)",
          borderLeft: `5px solid ${accent}`,
          borderRadius: 8,
          padding: "14px 28px",
          fontFamily: F.sans,
          fontWeight: 500,
          fontSize: 31,
          lineHeight: 1.35,
          color: C.text,
          textAlign: "center",
          opacity: p,
          transform: `translateY(${(1 - p) * 6}px)`,
          boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
        }}
      >
        {cur.text}
      </div>
    </div>
  );
};

export const Source: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      right: 60,
      bottom: 150,
      fontFamily: F.mono,
      fontSize: 15,
      color: "rgba(148,163,184,0.85)",
      letterSpacing: 0.5,
    }}
  >
    KAYNAK: {children}
  </div>
);

/** Sahne geçişi: hızlı glitch flaşı */
export const SceneFade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, dur - 10, dur], [0, 1, 1, 0], clamp);
  const glitch = f < 6 ? (6 - f) * 6 : 0;
  return (
    <AbsoluteFill style={{ opacity: o, transform: `translateX(${glitch * (f % 2 ? 1 : -1)}px)` }}>{children}</AbsoluteFill>
  );
};
