import "dotenv/config";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { TypecastClient } from "@neosapience/typecast-js";

const storyboardPath = "src/info-short/storyboard.json";
const outputDir = "public/audio/info-short";
const defaultVoiceId = "tc_672c5f5ce59fac2a48faeaee";
const audioTempo = Number(process.env.TYPECAST_AUDIO_TEMPO || "1.28");

if (!process.env.TYPECAST_API_KEY) {
  throw new Error("TYPECAST_API_KEY is missing.");
}

const storyboard = JSON.parse(await readFile(storyboardPath, "utf8"));
const client = new TypecastClient({ apiKey: process.env.TYPECAST_API_KEY });
const requestedScenes = new Set(process.argv.slice(2).map((value) => Number(value)));
const targetScenes =
  requestedScenes.size > 0
    ? storyboard.scenes.filter((scene) => requestedScenes.has(scene.scene))
    : storyboard.scenes;

await mkdir(outputDir, { recursive: true });

for (const scene of targetScenes) {
  const text = scene.scriptLines.join(" ").trim();
  const sceneNumber = String(scene.scene).padStart(2, "0");
  const filename = path.join(outputDir, `scene-${sceneNumber}.wav`);

  if (!text) {
    throw new Error(`Scene ${scene.scene} has no script text.`);
  }

  console.log(`Generating ${filename}`);

  const audio = await client.textToSpeech({
    text,
    model: process.env.TYPECAST_DEFAULT_MODEL || "ssfm-v30",
    voice_id: process.env.TYPECAST_DEFAULT_VOICE_ID || defaultVoiceId,
    language: "kor",
    prompt: {
      emotion_type: "preset",
      emotion_preset: "normal",
      emotion_intensity: 1.0,
    },
    output: {
      audio_format: "wav",
      target_lufs: -14,
      audio_tempo: audioTempo,
    },
  });

  await writeFile(filename, Buffer.from(audio.audioData));
}
