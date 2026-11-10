import voice from "./data/voice.json";

export const FPS = 30;
export const LEAD = 0.7; // sahne başında sesten önceki boşluk (sn)
export const TAIL = 1.0; // ses bittikten sonra sahnede kalma (sn)
export const CREDITS_SEC = 6;

export type SceneId =
  | "s1_intro"
  | "s2_binance"
  | "s3_php"
  | "s4_connectwise"
  | "s5_stryker"
  | "s6_outlook"
  | "s7_turkiye"
  | "s8_outro";

export const SCENE_ORDER: SceneId[] = [
  "s1_intro",
  "s2_binance",
  "s3_php",
  "s4_connectwise",
  "s5_stryker",
  "s6_outlook",
  "s7_turkiye",
  "s8_outro",
];

type VoiceData = { duration: number; text: string; starts: number[]; ends: number[] };
const V = voice as Record<SceneId, VoiceData>;

const lead = (id: SceneId) => (id === "s1_intro" ? 1.6 : LEAD);

export const sceneFrames = (id: SceneId) => Math.ceil((lead(id) + V[id].duration + TAIL) * FPS);
export const sceneLeadFrames = (id: SceneId) => Math.round(lead(id) * FPS);

export const sceneStarts = (() => {
  const m = {} as Record<SceneId, number>;
  let acc = 0;
  for (const id of SCENE_ORDER) {
    m[id] = acc;
    acc += sceneFrames(id);
  }
  return m;
})();

export const TOTAL_FRAMES =
  SCENE_ORDER.reduce((a, id) => a + sceneFrames(id), 0) + CREDITS_SEC * FPS;

/** Bir ifadenin seslendirmede söylendiği an, sahne başından itibaren kare cinsinden */
export const cue = (id: SceneId, phrase: string, nth = 0): number => {
  const d = V[id];
  let idx = -1;
  let from = 0;
  for (let i = 0; i <= nth; i++) {
    idx = d.text.indexOf(phrase, from);
    if (idx < 0) break;
    from = idx + 1;
  }
  if (idx < 0) {
    throw new Error(`cue bulunamadı: ${id} / ${phrase}`);
  }
  return Math.round((lead(id) + d.starts[idx]) * FPS);
};

export type SubCue = { from: number; to: number; text: string };

const TAG = /\[[a-z ]+\]\s*/g;

/** Hizalama verisinden cümle bazlı altyazılar üretir (kare cinsinden, sahneye göre) */
export const subtitlesFor = (id: SceneId): SubCue[] => {
  const d = V[id];
  const t = d.text;
  const pieces: { a: number; b: number }[] = [];
  let start = 0;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    const endSentence = (ch === "." || ch === "!" || ch === "?" || ch === ":") && t[i + 1] !== "." && t[i - 1] !== ".";
    if (endSentence || i === t.length - 1) {
      pieces.push({ a: start, b: i });
      start = i + 1;
    }
  }
  // uzun cümleleri virgülden böl
  const split: { a: number; b: number }[] = [];
  for (const p of pieces) {
    const raw = t.slice(p.a, p.b + 1).replace(TAG, "").trim();
    if (raw.length > 95) {
      const mid = p.a + Math.floor((p.b - p.a) / 2);
      let cut = -1;
      for (let k = 0; k < 40; k++) {
        if (t[mid + k] === ",") { cut = mid + k; break; }
        if (t[mid - k] === ",") { cut = mid - k; break; }
      }
      if (cut > 0) {
        split.push({ a: p.a, b: cut }, { a: cut + 1, b: p.b });
        continue;
      }
    }
    split.push(p);
  }
  // çok kısa parçaları (ör. "Bir: kimlik.") bir sonrakiyle birleştir
  const merged: { a: number; b: number }[] = [];
  for (const p of split) {
    const txt = t.slice(p.a, p.b + 1).replace(TAG, "").trim();
    const prev = merged[merged.length - 1];
    if (prev) {
      const prevTxt = t.slice(prev.a, prev.b + 1).replace(TAG, "").trim();
      if (prevTxt.length < 18 && prevTxt.length + txt.length < 90) {
        prev.b = p.b;
        continue;
      }
    }
    merged.push({ ...p });
  }
  const out: SubCue[] = [];
  for (const p of merged) {
    let a = p.a;
    while (a <= p.b && (t[a] === " " || t[a] === "[")) {
      if (t[a] === "[") a = t.indexOf("]", a) + 1;
      else a++;
    }
    const text = t.slice(p.a, p.b + 1).replace(TAG, "").replace(/\s+/g, " ").trim();
    if (!text) continue;
    out.push({
      from: Math.round((lead(id) + d.starts[Math.min(a, p.b)]) * FPS),
      to: Math.round((lead(id) + d.ends[p.b]) * FPS) + 6,
      text,
    });
  }
  // boşlukları kapat: bir sonraki başlayana kadar göster (maks 0.6 sn)
  for (let i = 0; i < out.length - 1; i++) {
    out[i].to = Math.min(out[i + 1].from, Math.max(out[i].to, out[i + 1].from - 18));
  }
  return out;
};

export const voiceDuration = (id: SceneId) => V[id].duration;
