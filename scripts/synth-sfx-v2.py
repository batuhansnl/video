# Basit ses tasarımı: arka plan pad'i, geçiş whoosh'u, vurgu (impact) ve tik sesi (yalnızca standart kütüphane)
import math, random, struct, wave, sys
SR = 44100
out = sys.argv[1]

def write(name, samples, stereo=False):
    with wave.open(f"{out}/{name}.wav", "w") as w:
        w.setnchannels(2 if stereo else 1); w.setsampwidth(2); w.setframerate(SR)
        if stereo:
            w.writeframes(b"".join(struct.pack("<hh", int(max(-1,min(1,l))*32000), int(max(-1,min(1,r))*32000)) for l, r in samples))
        else:
            w.writeframes(b"".join(struct.pack("<h", int(max(-1,min(1,s))*32000)) for s in samples))

random.seed(7)
# whoosh: filtrelenmiş gürültü, yükselen-düşen zarf
n = int(SR * 1.1); s = []; lp = 0.0
for i in range(n):
    t = i / n
    cutoff = 0.02 + 0.25 * math.sin(math.pi * t) ** 2
    lp += cutoff * (random.uniform(-1, 1) - lp)
    env = math.sin(math.pi * t) ** 2.2
    s.append(lp * env * 2.2)
write("whoosh", s)

# impact: düşen frekanslı sinüs + gürültü patlaması
n = int(SR * 1.6); s = []; ph = 0.0
for i in range(n):
    t = i / SR
    f = 38 + 90 * math.exp(-t * 9)
    ph += 2 * math.pi * f / SR
    env = math.exp(-t * 3.2)
    noise = random.uniform(-1, 1) * math.exp(-t * 30) * 0.5
    s.append((math.sin(ph) * 0.95 + noise) * env)
write("impact", s)

# tick: kısa dijital bip
n = int(SR * 0.09); s = []
for i in range(n):
    t = i / SR
    s.append(math.sin(2 * math.pi * 1760 * t) * math.exp(-t * 60) * 0.6)
write("tick", s)

# pad: 20 sn döngü, akor (La minör) + yavaş LFO, stereo
dur = 20.0; n = int(SR * dur); s = []
freqs = [55.0, 110.0, 130.81, 164.81, 220.0]
for i in range(n):
    t = i / SR
    lfo = 0.5 + 0.5 * math.sin(2 * math.pi * t / dur)  # döngü sınırında sürekli
    l = r = 0.0
    for k, f in enumerate(freqs):
        a = 0.16 / (1 + k * 0.4)
        fa = round(f * dur) / dur  # döngüde kesintisiz olsun diye tam periyot
        det = (k + 1) / dur
        l += a * math.sin(2 * math.pi * (fa - det) * t)
        r += a * math.sin(2 * math.pi * (fa + det) * t + k)
    pulse = 0.35 + 0.65 * (0.5 + 0.5 * math.sin(2 * math.pi * t * 0.5))
    g = (0.55 + 0.45 * lfo) * pulse * 0.6
    s.append((l * g, r * g))
write("pad", s, stereo=True)
print("ok")
