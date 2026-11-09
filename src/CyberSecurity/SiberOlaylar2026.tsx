import React from "react";
import { AbsoluteFill, Audio, Sequence, Series, staticFile } from "remotion";
import { CyberBackground } from "./CyberBackground";
import { CyberHeader } from "./CyberHeader";
import { IntroScene } from "./IntroScene";
import { ThreatCardProps, ThreatCardScene } from "./ThreatCardScene";
import { OutroScene } from "./OutroScene";

const threats: readonly ThreatCardProps[] = [
  {
    index: "01",
    category: "OTONOM TEHDİTLER",
    title: "Yapay Zekâ Destekli Saldırı Ajanları",
    severity: "KRİTİK",
    statValue: "%380",
    statLabel: "OTONOM SALDIRI ARTIŞI",
    iconType: "ai",
    points: [
      "İnsan müdahalesi olmadan zafiyet tarayan ve sızma gerçekleştiren yapay zeka ajanları.",
      "Ses, video ve metin tabanlı gerçek zamanlı derin sahtecilik (Deepfake) oltalama.",
      "Geleneksel imza tabanlı antivirüs ve EDR sistemlerini anlık olarak baypas etme.",
    ],
  },
  {
    index: "02",
    category: "KRİPTOGRAFİ",
    title: "Kuantum Öncesi Veri Hasadı (SNDL)",
    severity: "YÜKSEK",
    statValue: "PQC",
    statLabel: "GEÇİŞ ACİLİYETİ",
    iconType: "quantum",
    points: [
      "'Store Now, Decrypt Later': Şifreli verilerin gelecekte kuantum ile kırılmak üzere çalınması.",
      "RSA ve ECC gibi yaygın asimetrik şifreleme standartlarının geçerliliğini yitirmesi riski.",
      "Kritik devlet, bankacılık ve altyapı verilerinin bugünden koruma altına alınma zorunluluğu.",
    ],
  },
  {
    index: "03",
    category: "BULUT & YAZILIM",
    title: "Tedarik Zinciri ve Açık Kaynak Zehirlenmesi",
    severity: "KRİTİK",
    statValue: "7/24",
    statLabel: "ALTYAPI TEHDİDİ",
    iconType: "cloud",
    points: [
      "Paket yöneticileri (npm, PyPI) üzerinden dağıtılan otomatik zararlı yazılımlar.",
      "Bulut API anahtarlarının ve otonom CI/CD süreçlerinin ele geçirilmesi.",
      "Kritik kamu ve enerji şebekelerine yönelik dolaylı tedarikçi sızmaları.",
    ],
  },
];

// Scene durations in frames (30 fps)
const INTRO_DURATION = 120;
const THREAT_DURATION = 130;
const OUTRO_DURATION = 120;
const TOTAL_DURATION =
  INTRO_DURATION + THREAT_DURATION * 3 + OUTRO_DURATION; // 630

// Audio segments with their start frames
const audioSegments = [
  { file: "audio/intro.mp3", from: 0 },
  { file: "audio/threat01.mp3", from: INTRO_DURATION },
  { file: "audio/threat02.mp3", from: INTRO_DURATION + THREAT_DURATION },
  {
    file: "audio/threat03.mp3",
    from: INTRO_DURATION + THREAT_DURATION * 2,
  },
  {
    file: "audio/outro.mp3",
    from: INTRO_DURATION + THREAT_DURATION * 3,
  },
];

export const SiberOlaylar2026: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background layer running throughout */}
      <CyberBackground />

      {/* Cyber HUD Header */}
      <CyberHeader />

      {/* Voiceover audio tracks synced to each scene */}
      {audioSegments.map((seg) => (
        <Sequence key={seg.file} from={seg.from} durationInFrames={TOTAL_DURATION - seg.from}>
          <Audio src={staticFile(seg.file)} volume={0.9} />
        </Sequence>
      ))}

      {/* Sequence of scenes */}
      <Series>
        {/* Intro */}
        <Series.Sequence durationInFrames={INTRO_DURATION}>
          <IntroScene />
        </Series.Sequence>

        {/* Threat 1 */}
        <Series.Sequence durationInFrames={THREAT_DURATION}>
          <ThreatCardScene {...threats[0]} />
        </Series.Sequence>

        {/* Threat 2 */}
        <Series.Sequence durationInFrames={THREAT_DURATION}>
          <ThreatCardScene {...threats[1]} />
        </Series.Sequence>

        {/* Threat 3 */}
        <Series.Sequence durationInFrames={THREAT_DURATION}>
          <ThreatCardScene {...threats[2]} />
        </Series.Sequence>

        {/* Outro */}
        <Series.Sequence durationInFrames={OUTRO_DURATION}>
          <OutroScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
