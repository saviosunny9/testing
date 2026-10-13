# Builds the hero film's sound: an original ambient music loop (synthesised here, no samples) and a short
# voiceover story timed to the film's scenes (lib/../components/hero/scenes.ts).
#
#   pip install piper-tts onnxruntime numpy
#   python3 build_audio.py <piper voice .onnx> <out dir>
#
# The voice is Piper "en_US-joe-medium" (CC0). Its .onnx.json config is written next to the model if missing
# (Piper's standard espeak phoneme map, 22.05 kHz).
import json
import os
import subprocess
import sys
import tempfile
import wave

import numpy as np

SR = 44100
LOOP = 15.28           # film length: the music loops in step with it
BEAT = LOOP / 16       # 4 bars of 4/4 ≈ 62.8 bpm
rng = np.random.default_rng(11)

# ------------------------------------------------------------------ music


def hz(note):
    names = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
             'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11}
    n, o = note[:-1], int(note[-1])
    return 440.0 * 2 ** ((names[n] + 12 * (o + 1) - 69) / 12)


# F maj9 | E m7 | D m9 | C add9 -> back to F
CHORDS = [
    {'bass': 'F2', 'pad': ['F3', 'A3', 'C4', 'E4', 'G4'], 'arp': ['A4', 'C5', 'E5', 'G5', 'E5', 'C5', 'A4', 'C5']},
    {'bass': 'E2', 'pad': ['E3', 'G3', 'B3', 'D4'], 'arp': ['G4', 'B4', 'D5', 'E5', 'D5', 'B4', 'G4', 'B4']},
    {'bass': 'D2', 'pad': ['D3', 'F3', 'A3', 'C4', 'E4'], 'arp': ['F4', 'A4', 'C5', 'E5', 'C5', 'A4', 'F4', 'A4']},
    {'bass': 'C2', 'pad': ['C3', 'G3', 'D4', 'E4'], 'arp': ['E4', 'G4', 'D5', 'G5', 'D5', 'G4', 'E4', 'G4']},
]


def env(n, attack, release, total):
    t = np.arange(n) / SR
    e = np.clip(t / attack, 0, 1) * np.clip((total - t) / release, 0, 1)
    return e


def pad_voice(f, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for det in (-0.0018, 0.0, 0.0021):  # soft chorus
        ff = f * (1 + det)
        ph = rng.uniform(0, 2 * np.pi)
        s += np.sin(2 * np.pi * ff * t + ph) + 0.22 * np.sin(4 * np.pi * ff * t + ph) + 0.06 * np.sin(6 * np.pi * ff * t)
    trem = 1 + 0.06 * np.sin(2 * np.pi * 0.21 * t + rng.uniform(0, 6))
    return s * trem * env(n, 1.6, 1.8, dur) / 3


def felt_piano(f, vel, dur=4.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for k, (amp, dec) in enumerate([(1.0, 2.6), (0.38, 1.3), (0.16, 0.8), (0.07, 0.5), (0.03, 0.35)], start=1):
        inh = 1 + 0.0004 * k * k  # slight inharmonicity
        s += amp * np.exp(-t / dec) * np.sin(2 * np.pi * f * k * inh * t)
    att = np.clip(t / 0.012, 0, 1)  # felt hammer: soft attack
    # felt knock: low-passed noise, so the onset is soft rather than a click
    m = int(0.08 * SR)
    knock = rng.normal(0, 1, m)
    for i in range(1, m):
        knock[i] = knock[i] * 0.04 + knock[i - 1] * 0.96
    thump = np.zeros(n)
    thump[:m] = knock * np.exp(-t[:m] / 0.025) * 0.05
    return (s * att + thump) * vel


def place(buf, sig, start, pan=0.0):
    i = int(start * SR)
    if i < 0:
        sig, i = sig[-i:], 0
    if i >= buf.shape[1]:
        return
    sig = sig[: buf.shape[1] - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[0, i:i + len(sig)] += sig * l
    buf[1, i:i + len(sig)] += sig * r


def reverb(x, seconds=3.2, decay=1.25, wet=0.38):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros_like(x)
    for ch in range(2):
        ir = rng.normal(0, 1, n) * np.exp(-t / decay)
        # darken the tail: one-pole low-pass
        for i in range(1, n):
            ir[i] = ir[i] * 0.35 + ir[i - 1] * 0.65
        ir[: int(0.018 * SR)] = 0  # pre-delay
        ir /= np.sqrt((ir ** 2).sum())
        wet_sig = np.fft.irfft(np.fft.rfft(x[ch], len(x[ch]) + n) * np.fft.rfft(ir, len(x[ch]) + n))[: len(x[ch])]
        out[ch] = (1 - wet) * x[ch] + wet * wet_sig * 1.6
    return out


def music():
    loops = 3  # render three passes and keep the middle one, so the reverb tails wrap and the loop is seamless
    buf = np.zeros((2, int(LOOP * loops * SR) + SR * 5))
    for L in range(loops):
        base = L * LOOP
        for b, ch in enumerate(CHORDS):
            t0 = base + b * 4 * BEAT
            for i, note in enumerate(ch['pad']):
                place(buf, 0.11 * pad_voice(hz(note), 4 * BEAT + 1.8), t0 - 0.3, pan=-0.5 + i / max(1, len(ch['pad']) - 1))
            place(buf, 0.20 * pad_voice(hz(ch['bass']), 4 * BEAT + 1.5), t0 - 0.2)
            for j, note in enumerate(ch['arp']):
                # eighth notes, gently humanised; softer on the off-beats
                when = t0 + j * BEAT / 2 + rng.normal(0, 0.012)
                vel = (0.20 if j % 2 == 0 else 0.13) * rng.uniform(0.85, 1.1)
                if j == 7 and b == 3:
                    vel *= 0.7
                place(buf, felt_piano(hz(note), vel), when, pan=rng.uniform(-0.35, 0.35))
    buf = reverb(buf)
    seg = buf[:, int(LOOP * SR): int(2 * LOOP * SR)]
    seg /= np.abs(seg).max()
    rms = np.sqrt((seg ** 2).mean())
    seg *= min(10 ** (-21 / 20) / rms, 0.89)  # a quiet bed: about -21 dBFS RMS
    return seg

# ------------------------------------------------------------------ voiceover


# (start time in the film, line). "Alahro" spells the brand the way it is said: uh-LAH-roh.
VO = [
    (0.5, 'Home is made of little moments.'),
    (3.0, 'Game nights that run late.'),
    (5.1, 'Wishes, made over candles.'),
    (7.6, 'Stories before bed.'),
    (10.1, 'And first flights, across the kitchen.'),
    (13.3, 'Alahro keeps them close.'),
    (15.6, "Even when you're away."),
]


def voice(model):
    from piper import PiperVoice, SynthesisConfig
    from piper.phoneme_ids import DEFAULT_PHONEME_ID_MAP

    cfg = model + '.json'
    if not os.path.exists(cfg):
        json.dump({'audio': {'sample_rate': 22050}, 'espeak': {'voice': 'en-us'}, 'phoneme_type': 'espeak',
                   'num_symbols': 256, 'num_speakers': 1, 'phoneme_id_map': DEFAULT_PHONEME_ID_MAP}, open(cfg, 'w'))
    v = PiperVoice.load(model, config_path=cfg)
    total = VO[-1][0] + 3.0
    track = np.zeros(int(total * SR))
    for start, text in VO:
        with tempfile.NamedTemporaryFile(suffix='.wav') as tmp:
            with wave.open(tmp.name, 'wb') as w:
                v.synthesize_wav(text, w, syn_config=SynthesisConfig(length_scale=1.12, noise_scale=0.6, noise_w_scale=0.7))
            with wave.open(tmp.name) as w:
                sr = w.getframerate()
                x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float) / 32768
        # trim Piper's leading silence so the line lands on its cue, then resample to 44.1 kHz
        lead = np.argmax(np.abs(x) > 0.01)
        x = x[max(0, lead - int(0.02 * sr)):]
        x = np.interp(np.arange(0, len(x), sr / SR), np.arange(len(x)), x)
        i = int(start * SR)
        track[i:i + len(x)] += x[: len(track) - i]
    # gentle room and level: about -17 dBFS RMS while speaking
    st = np.stack([track, track])
    st = reverb(st, seconds=1.2, decay=0.35, wet=0.12)
    speech = st[:, np.abs(st[0]) > 0.02]
    st *= 10 ** (-17 / 20) / np.sqrt((speech ** 2).mean())
    st *= min(1, 0.89 / np.abs(st).max())
    return st[0]


def write_mp3(x, path, bitrate):
    ch = 1 if x.ndim == 1 else 2
    pcm = (np.clip(x.T if ch == 2 else x, -1, 1) * 32767).astype('<i2').tobytes()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', str(ch), '-i', '-',
                    '-c:a', 'libmp3lame', '-b:a', bitrate, path], input=pcm, check=True)
    print('wrote', path, os.path.getsize(path) // 1024, 'KB')


if __name__ == '__main__':
    model, out = sys.argv[1:3]
    os.makedirs(out, exist_ok=True)
    write_mp3(music(), f'{out}/hero-music.mp3', '128k')
    write_mp3(voice(model), f'{out}/hero-voice.mp3', '96k')
