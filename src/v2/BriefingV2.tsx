import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { S1Intro } from "./scenes/S1Intro";
import { S2Binance } from "./scenes/S2Binance";
import { S3Php } from "./scenes/S3Php";
import { S4ConnectWise } from "./scenes/S4ConnectWise";
import { S5Stryker } from "./scenes/S5Stryker";
import { S6Outlook } from "./scenes/S6Outlook";
import { S7Turkiye } from "./scenes/S7Turkiye";
import { Credits, S8Outro } from "./scenes/S8Outro";
import {
  CREDITS_SEC,
  FPS,
  SCENE_ORDER,
  SceneId,
  TOTAL_FRAMES,
  cue,
  sceneFrames,
  sceneLeadFrames,
  sceneStarts,
  subtitlesFor,
} from "./timing";
import { Backdrop, C, Hud, SceneFade, Subtitles, Vignette } from "./ui";

const SCENES: Record<SceneId, { C: React.FC; label: string; tint: string; accent: string }> = {
  s1_intro: { C: S1Intro, label: "GİRİŞ", tint: C.cyan, accent: C.cyan },
  s2_binance: { C: S2Binance, label: "OLAY 01 / 04", tint: C.red, accent: C.red },
  s3_php: { C: S3Php, label: "OLAY 02 / 04", tint: C.red, accent: C.red },
  s4_connectwise: { C: S4ConnectWise, label: "OLAY 03 / 04", tint: C.amber, accent: C.amber },
  s5_stryker: { C: S5Stryker, label: "OLAY 04 / 04", tint: C.red, accent: C.red },
  s6_outlook: { C: S6Outlook, label: "TEHDİT GÖRÜNÜMÜ", tint: C.violet, accent: C.violet },
  s7_turkiye: { C: S7Turkiye, label: "TÜRKİYE", tint: "#E30A17", accent: "#E30A17" },
  s8_outro: { C: S8Outro, label: "YOL HARİTASI", tint: C.green, accent: C.green },
};

// Ses efektleri: [sahne, sahne içi kare, efekt, ses seviyesi]
const sfxEvents = (): [number, string, number][] => {
  const ev: [number, string, number][] = [];
  for (const id of SCENE_ORDER) {
    if (id !== "s1_intro") ev.push([sceneStarts[id] - 8, "whoosh", 0.5]);
  }
  const at = (id: SceneId, phrase: string) => sceneStarts[id] + cue(id, phrase);
  ev.push([4, "impact", 0.7]);
  ev.push([at("s1_intro", "Anahtarla"), "impact", 0.45]);
  ev.push([at("s2_binance", "altı virgül üç"), "impact", 0.6]);
  ev.push([at("s2_binance", "FBI"), "tick", 0.5]);
  ev.push([at("s3_php", "PHP2Shell"), "impact", 0.5]);
  ev.push([at("s3_php", "CISA"), "tick", 0.5]);
  ev.push([at("s4_connectwise", "yüz altmışı"), "impact", 0.45]);
  ev.push([at("s4_connectwise", "çok faktörlü"), "tick", 0.5]);
  ev.push([at("s5_stryker", "yalnızca zarar"), "impact", 0.6]);
  for (const p of ["Bir: kimlik", "İki:", "Üç:", "Dört:", "Beş:", "Altı:"]) ev.push([at("s6_outlook", p), "tick", 0.45]);
  ev.push([at("s6_outlook", "yirmi yedi"), "impact", 0.5]);
  for (const p of ["Civil", "Türkkep", "Onbir Grup", "Eve Kozmetik"]) ev.push([at("s7_turkiye", p), "tick", 0.45]);
  ev.push([at("s8_outro", "Siber güvenlik bir masraf"), "impact", 0.5]);
  return ev;
};

const Music: React.FC = () => {
  // konuşma altında düşük, girişte ve kapanışta biraz daha yüksek
  const end = TOTAL_FRAMES;
  return (
    <Audio
      src={staticFile("audio/v2/sfx/pad.wav")}
      loop
      volume={(f) =>
        interpolate(f, [0, 30, 50, end - CREDITS_SEC * FPS, end - 60, end], [0, 0.4, 0.16, 0.16, 0.3, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};

const HudLayer: React.FC = () => {
  const f = useCurrentFrame();
  let label = "KAYNAKLAR";
  for (const id of SCENE_ORDER) {
    if (f >= sceneStarts[id] && f < sceneStarts[id] + sceneFrames(id)) label = SCENES[id].label;
  }
  return <Hud label={label} frame={f} total={TOTAL_FRAMES} />;
};

export const BriefingV2: React.FC = () => {
  const creditsStart = sceneStarts.s8_outro + sceneFrames("s8_outro");
  return (
    <AbsoluteFill lang="tr" style={{ background: C.bg }}>
      <Music />
      {SCENE_ORDER.map((id) => {
        const S = SCENES[id];
        const dur = sceneFrames(id);
        return (
          <Sequence key={id} from={sceneStarts[id]} durationInFrames={dur} name={id}>
            <Backdrop tint={S.tint} />
            <SceneFade dur={dur}>
              <S.C />
            </SceneFade>
            <Subtitles cues={subtitlesFor(id)} accent={S.accent} />
            <Sequence from={sceneLeadFrames(id)} layout="none">
              <Audio src={staticFile(`audio/v2/${id}.mp3`)} />
            </Sequence>
          </Sequence>
        );
      })}
      <Sequence from={creditsStart} durationInFrames={CREDITS_SEC * FPS} name="credits">
        <Backdrop />
        <SceneFade dur={CREDITS_SEC * FPS}>
          <Credits />
        </SceneFade>
      </Sequence>
      {sfxEvents().map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={60} layout="none">
          <Audio src={staticFile(`audio/v2/sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
      <Vignette />
      <HudLayer />
    </AbsoluteFill>
  );
};

export const BRIEFING_V2_FRAMES = TOTAL_FRAMES;
