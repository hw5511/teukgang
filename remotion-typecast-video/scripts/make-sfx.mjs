import {mkdir, writeFile} from 'node:fs/promises';

const sampleRate = 44100;

const wav = (samples) => {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  samples.forEach((sample, index) => {
    const clamped = Math.max(-1, Math.min(1, sample));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + index * 2);
  });
  return buffer;
};

const makeTone = (duration, fn) => {
  const length = Math.floor(duration * sampleRate);
  return Array.from({length}, (_, i) => {
    const t = i / sampleRate;
    return fn(t, i / length);
  });
};

const pop = makeTone(0.22, (t, p) => Math.sin(2 * Math.PI * (520 - p * 260) * t) * (1 - p) * 0.28);
const hop = makeTone(0.18, (t, p) => Math.sin(2 * Math.PI * (320 + p * 520) * t) * Math.sin(Math.PI * p) * 0.18);
const whoosh = makeTone(0.55, (t, p) => {
  const noise = Math.sin(2 * Math.PI * (80 + p * 700) * t) + Math.sin(2 * Math.PI * (160 + p * 1300) * t);
  return noise * Math.sin(Math.PI * p) * 0.08;
});

await mkdir('public/sfx', {recursive: true});
await writeFile('public/sfx/pop.wav', wav(pop));
await writeFile('public/sfx/hop.wav', wav(hop));
await writeFile('public/sfx/whoosh.wav', wav(whoosh));
