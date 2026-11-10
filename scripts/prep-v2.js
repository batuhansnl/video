// Ses sürelerini ve hizalama verisini Remotion'un içe aktarabileceği tek bir JSON'a toplar
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const D = path.resolve(__dirname, "../node_modules/@remotion/compositor-darwin-arm64");
const ids = JSON.parse(fs.readFileSync(path.resolve(__dirname, "script_v2.json"), "utf8")).map((s) => s.id);
const out = {};
for (const id of ids) {
  const mp3 = path.resolve(__dirname, `../public/audio/v2/${id}.mp3`);
  const dur = parseFloat(
    execFileSync(path.join(D, "ffprobe"), ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3], {
      env: { ...process.env, DYLD_LIBRARY_PATH: D },
    }).toString(),
  );
  const j = JSON.parse(fs.readFileSync(mp3.replace(".mp3", ".json"), "utf8"));
  const a = j.raw || j.alignment;
  out[id] = {
    duration: dur,
    text: j.text,
    starts: a.character_start_times_seconds.map((x) => +x.toFixed(3)),
    ends: a.character_end_times_seconds.map((x) => +x.toFixed(3)),
  };
  if (a.characters.join("") !== j.text) console.warn("⚠️ hizalama metni farklı:", id);
}
fs.writeFileSync(path.resolve(__dirname, "../src/v2/data/voice.json"), JSON.stringify(out));
console.log(Object.entries(out).map(([k, v]) => `${k}: ${v.duration.toFixed(2)}s`).join("\n"));
