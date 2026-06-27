import {readdir, readFile, writeFile, mkdir} from 'node:fs/promises';
import path from 'node:path';

const fps = 30;
const playbackRate = 1.15;
const minSceneSeconds = 5.2;
const padSeconds = 0.35;

const readWavDuration = async (file) => {
  const buffer = await readFile(file);
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error(`${file} is not a WAV file.`);
  }

  let offset = 12;
  let byteRate = 0;
  let dataSize = 0;

  while (offset + 8 <= buffer.length) {
    const chunkId = buffer.toString('ascii', offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const chunkStart = offset + 8;

    if (chunkId === 'fmt ') {
      byteRate = buffer.readUInt32LE(chunkStart + 8);
    }

    if (chunkId === 'data') {
      dataSize = chunkSize;
      break;
    }

    offset = chunkStart + chunkSize + (chunkSize % 2);
  }

  if (!byteRate || !dataSize) {
    throw new Error(`Could not read duration from ${file}.`);
  }

  return dataSize / byteRate;
};

const audioFiles = (await readdir('public/audio'))
  .filter((name) => /^scene-\d+\.wav$/.test(name))
  .sort();

let cursor = 0;
const timeline = [];

for (const file of audioFiles) {
  const durationSeconds = await readWavDuration(path.join('public/audio', file));
  const sceneSeconds = Math.max(minSceneSeconds, durationSeconds / playbackRate + padSeconds);
  const durationInFrames = Math.ceil(sceneSeconds * fps);
  timeline.push({
    audio: `audio/${file}`,
    durationSeconds: Number(durationSeconds.toFixed(3)),
    playbackRate,
    from: cursor,
    durationInFrames,
  });
  cursor += durationInFrames;
}

await mkdir('src/data', {recursive: true});
await writeFile(
  'src/data/timeline.ts',
  `export const fps = ${fps};\nexport const totalFrames = ${cursor};\nexport const sceneTimeline = ${JSON.stringify(timeline, null, 2)} as const;\n`,
);

console.log(`Timeline: ${cursor} frames, ${(cursor / fps).toFixed(1)} seconds`);
