import 'dotenv/config';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {TypecastClient} from '@neosapience/typecast-js';

const [, , textArg, outputArg = 'public/audio/voiceover.wav', voiceArg] = process.argv;

if (!textArg) {
  console.error('Usage: npm run tts -- "Text to narrate" [output.wav|output.mp3] [voice_id]');
  process.exit(1);
}

const apiKey = process.env.TYPECAST_API_KEY;

if (!apiKey) {
  console.error('TYPECAST_API_KEY is missing. Set it as an environment variable or in .env.');
  process.exit(1);
}

const client = new TypecastClient({apiKey});
const outputPath = path.resolve(outputArg);
const audioFormat = outputPath.toLowerCase().endsWith('.mp3') ? 'mp3' : 'wav';

const audio = await client.textToSpeech({
  text: textArg,
  model: process.env.TYPECAST_DEFAULT_MODEL || 'ssfm-v30',
  voice_id: voiceArg || process.env.TYPECAST_DEFAULT_VOICE_ID || 'tc_672c5f5ce59fac2a48faeaee',
  output: {
    audio_format: audioFormat,
    target_lufs: -14,
  },
});

await mkdir(path.dirname(outputPath), {recursive: true});
await writeFile(outputPath, Buffer.from(audio.audioData));

console.log(`Saved ${audioFormat.toUpperCase()} voiceover to ${outputPath}`);
if (audio.duration) {
  console.log(`Duration: ${audio.duration}s`);
}
