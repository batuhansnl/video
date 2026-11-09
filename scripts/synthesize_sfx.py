#!/usr/bin/env python3
import math
import struct
import wave
import json
import os

SAMPLE_RATE = 44100
TOTAL_DURATION = 185.0 # seconds
TOTAL_SAMPLES = int(SAMPLE_RATE * TOTAL_DURATION)

def clamp(val, min_v=-32767, max_v=32767):
    return max(min_v, min(max_v, int(val)))

def generate_sfx():
    # 16-bit mono buffer initialized to 0
    buffer = [0.0] * TOTAL_SAMPLES

    # Pre-defined sound generator primitives
    def add_impact(start_time, amp=0.8):
        start_idx = int(start_time * SAMPLE_RATE)
        dur = 0.8
        samples = int(dur * SAMPLE_RATE)
        for i in range(samples):
            idx = start_idx + i
            if idx >= TOTAL_SAMPLES: break
            t = i / SAMPLE_RATE
            # Sine pitch drop from 120Hz to 40Hz
            freq = 120.0 * math.exp(-t * 6.0) + 40.0
            val = math.sin(2.0 * math.pi * freq * t) * math.exp(-t * 4.5)
            # Add subtle transient click
            if i < 400:
                val += (math.sin(i * 0.5) * (1.0 - i/400.0) * 0.3)
            buffer[idx] += val * amp * 32767

    def add_glitch(start_time, amp=0.5):
        start_idx = int(start_time * SAMPLE_RATE)
        dur = 0.35
        samples = int(dur * SAMPLE_RATE)
        state = 0.5
        for i in range(samples):
            idx = start_idx + i
            if idx >= TOTAL_SAMPLES: break
            t = i / SAMPLE_RATE
            # Square wave with randomized sample-and-hold frequency
            if i % 150 == 0:
                state = -1.0 if state > 0 else 1.0
            freq = 800.0 + 600.0 * math.sin(t * 120.0)
            val = (1.0 if math.sin(2.0 * math.pi * freq * t) > 0 else -1.0) * 0.5 + state * 0.5
            env = math.exp(-t * 8.0)
            buffer[idx] += val * env * amp * 32767

    def add_tick(start_time, amp=0.3):
        start_idx = int(start_time * SAMPLE_RATE)
        dur = 0.04
        samples = int(dur * SAMPLE_RATE)
        for i in range(samples):
            idx = start_idx + i
            if idx >= TOTAL_SAMPLES: break
            t = i / SAMPLE_RATE
            val = math.sin(2.0 * math.pi * 1400.0 * t) * math.exp(-t * 90.0)
            buffer[idx] += val * amp * 32767

    def add_whoosh(start_time, amp=0.45):
        start_idx = int(start_time * SAMPLE_RATE)
        dur = 0.5
        samples = int(dur * SAMPLE_RATE)
        for i in range(samples):
            idx = start_idx + i
            if idx >= TOTAL_SAMPLES: break
            t = i / SAMPLE_RATE
            # Frequency sweep upward then downward
            freq = 300.0 + 1200.0 * math.sin(math.pi * (t / dur))
            val = math.sin(2.0 * math.pi * freq * t)
            env = math.sin(math.pi * (t / dur))
            buffer[idx] += val * env * amp * 32767

    def add_alarm(start_time, amp=0.4):
        start_idx = int(start_time * SAMPLE_RATE)
        dur = 0.7
        samples = int(dur * SAMPLE_RATE)
        for i in range(samples):
            idx = start_idx + i
            if idx >= TOTAL_SAMPLES: break
            t = i / SAMPLE_RATE
            freq = 900.0 if int(t * 8) % 2 == 0 else 700.0
            val = 1.0 if math.sin(2.0 * math.pi * freq * t) > 0 else -1.0
            env = 1.0 - (t / dur)
            buffer[idx] += val * env * amp * 32767

    def add_sweep(start_time, amp=0.4):
        start_idx = int(start_time * SAMPLE_RATE)
        dur = 0.6
        samples = int(dur * SAMPLE_RATE)
        for i in range(samples):
            idx = start_idx + i
            if idx >= TOTAL_SAMPLES: break
            t = i / SAMPLE_RATE
            freq = 250.0 + (t / dur) * 1100.0
            val = math.sin(2.0 * math.pi * freq * t)
            env = math.exp(-t * 2.0)
            buffer[idx] += val * env * amp * 32767

    def add_chime(start_time, amp=0.6):
        start_idx = int(start_time * SAMPLE_RATE)
        dur = 1.6
        samples = int(dur * SAMPLE_RATE)
        # Major triad (C5=523.25, E5=659.25, G5=783.99)
        freqs = [523.25, 659.25, 783.99, 1046.50]
        for i in range(samples):
            idx = start_idx + i
            if idx >= TOTAL_SAMPLES: break
            t = i / SAMPLE_RATE
            val = 0.0
            for f in freqs:
                val += math.sin(2.0 * math.pi * f * t) * 0.25
            env = math.exp(-t * 2.5)
            buffer[idx] += val * env * amp * 32767

    # SFX Event timeline (synced with template.html window.__sfx)
    events = [
        {"time": 0.1, "type": "glitch"},
        {"time": 0.3, "type": "impact"},
        {"time": 6.0, "type": "tick"},
        {"time": 7.0, "type": "tick"},
        {"time": 8.0, "type": "tick"},
        {"time": 15.0, "type": "whoosh"},
        {"time": 25.0, "type": "impact"},
        {"time": 33.0, "type": "tick"},
        {"time": 48.0, "type": "alarm"},
        {"time": 58.0, "type": "glitch"},
        {"time": 68.0, "type": "alarm"},
        {"time": 93.0, "type": "whoosh"},
        {"time": 105.0, "type": "alarm"},
        {"time": 118.0, "type": "sweep"},
        {"time": 131.0, "type": "whoosh"},
        {"time": 144.0, "type": "tick"},
        {"time": 165.0, "type": "chime"},
        {"time": 180.0, "type": "chime"}
    ]

    for ev in events:
        t = ev["time"]
        typ = ev["type"]
        if typ == "impact": add_impact(t)
        elif typ == "glitch": add_glitch(t)
        elif typ == "tick": add_tick(t)
        elif typ == "whoosh": add_whoosh(t)
        elif typ == "alarm": add_alarm(t)
        elif typ == "sweep": add_sweep(t)
        elif typ == "chime": add_chime(t)

    os.makedirs("public/audio", exist_ok=True)
    out_path = "public/audio/sfx_track.wav"

    with wave.open(out_path, "w") as wav_file:
        wav_file.setnchannels(1) # mono
        wav_file.setsampwidth(2) # 16-bit
        wav_file.setframerate(SAMPLE_RATE)
        
        frames = bytearray()
        for sample in buffer:
            clamped = clamp(sample)
            frames.extend(struct.pack("<h", clamped))
        wav_file.writeframes(frames)

    print(f"✅ SFX Track sentezlendi: {out_path} ({TOTAL_DURATION}s, {len(events)} olay)")

if __name__ == "__main__":
    generate_sfx()

