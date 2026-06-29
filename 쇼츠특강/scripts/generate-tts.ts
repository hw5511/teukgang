import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import type { Scene, Storyboard } from "../src/types/storyboard";
import { makeSlug } from "../src/lib/storyboard";

type Args = {
  storyboardPath: string;
  sceneId?: string;
  outputDir: string;
  voiceId?: string;
  model: "ssfm-v30" | "ssfm-v21";
  language?: string;
  granularity: "word" | "char";
  format: "wav" | "mp3";
  writeStoryboard: boolean;
};

type TtsResult = {
  audio: string;
  audio_format: "wav" | "mp3";
  audio_duration: number;
  words: Array<{ text: string; start: number; end: number }> | null;
  characters: Array<{ text: string; start: number; end: number }> | null;
};

type GeneratedScene = {
  scene: Scene;
  result: TtsResult;
};

const parseArgs = (): Args => {
  const argv = process.argv.slice(2);
  const getValue = (flag: string) => {
    const index = argv.indexOf(flag);
    return index >= 0 ? argv[index + 1] : undefined;
  };

  const hasFlag = (flag: string) => argv.includes(flag);

  return {
    storyboardPath: getValue("--storyboard") ?? "storyboards/sample.storyboard.json",
    sceneId: getValue("--scene"),
    outputDir: getValue("--out") ?? "public/audio",
    voiceId: getValue("--voice-id"),
    model: (getValue("--model") as Args["model"]) ?? "ssfm-v30",
    language: getValue("--language"),
    granularity: (getValue("--granularity") as Args["granularity"]) ?? "word",
    format: (getValue("--format") as Args["format"]) ?? "wav",
    writeStoryboard: hasFlag("--write-storyboard"),
  };
};

const requireApiKey = () => {
  const apiKey = process.env.TYPECAST_API_KEY;
  if (!apiKey) {
    throw new Error("TYPECAST_API_KEY is not set. Copy .env.example to .env and add your key.");
  }
  return apiKey;
};

const readStoryboard = async (storyboardPath: string): Promise<Storyboard> => {
  const raw = await fs.readFile(storyboardPath, "utf8");
  return JSON.parse(raw) as Storyboard;
};

const getScenesToGenerate = (storyboard: Storyboard, sceneId?: string) => {
  const scenes = storyboard.scenes.filter((scene) => Boolean(scene.narration?.trim()));
  return sceneId ? scenes.filter((scene) => scene.id === sceneId) : scenes;
};

type TtsPayload = {
  voice_id: string;
  text: string;
  model: string;
  language: string;
  output: {
    volume: number;
    audio_pitch: number;
    audio_tempo: number;
    audio_format: "wav" | "mp3";
  };
  seed: number;
};

const postTts = async (
  apiKey: string,
  payload: TtsPayload,
  granularity: "word" | "char",
) => {
  const response = await fetch(
    `https://api.typecast.ai/v1/text-to-speech/with-timestamps?granularity=${granularity}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Typecast request failed (${response.status}): ${errorText}`);
  }

  return (await response.json()) as TtsResult;
};

const ensureDir = async (dirPath: string) => {
  await fs.mkdir(dirPath, { recursive: true });
};

const scaleSubtitleChunks = (
  chunks: Scene["subtitleChunks"],
  previousDurationSeconds: number | undefined,
  nextDurationSeconds: number,
) => {
  if (!chunks?.length || !previousDurationSeconds || previousDurationSeconds <= 0 || nextDurationSeconds <= 0) {
    return chunks;
  }

  const scale = nextDurationSeconds / previousDurationSeconds;

  return chunks.map((chunk) => ({
    ...chunk,
    startSeconds: Number((chunk.startSeconds * scale).toFixed(3)),
    endSeconds: Number((chunk.endSeconds * scale).toFixed(3)),
  }));
};

const updateStoryboardAudio = (
  storyboard: Storyboard,
  generatedScenes: GeneratedScene[],
  outputRoot: string,
  format: "wav" | "mp3",
) => {
  const publicRoot = path.join(process.cwd(), "public");
  const relativeRoot = path
    .relative(publicRoot, outputRoot)
    .split(path.sep)
    .join(path.posix.sep);

  const updatedScenes = storyboard.scenes.map((scene) => {
    const generatedScene = generatedScenes.find((item) => item.scene.id === scene.id);
    if (!generatedScene) {
      return scene;
    }

    const audioDuration = generatedScene.result.audio_duration;
    const source = `${relativeRoot}/${scene.id}.${format}`.replace(/\\/g, "/");

    return {
      ...scene,
      durationSeconds: audioDuration,
      audio: {
        enabled: true,
        source,
      },
      subtitleChunks: scaleSubtitleChunks(scene.subtitleChunks, scene.durationSeconds, audioDuration),
    };
  });

  return {
    ...storyboard,
    scenes: updatedScenes,
  };
};

const main = async () => {
  const args = parseArgs();
  const storyboard = await readStoryboard(args.storyboardPath);
  const apiKey = requireApiKey();
  const voiceId = args.voiceId ?? storyboard.voiceId;
  const language = args.language ?? storyboard.language ?? "eng";

  if (!voiceId) {
    throw new Error("A Typecast voice ID is required. Set it in the storyboard or pass --voice-id.");
  }

  const scenes = getScenesToGenerate(storyboard, args.sceneId);
  const generatedScenes: GeneratedScene[] = [];
  const storyboardSlug = makeSlug(
    storyboard.projectName || path.basename(args.storyboardPath, path.extname(args.storyboardPath)),
  );
  const outputRoot = path.join(args.outputDir, storyboardSlug);

  await ensureDir(outputRoot);

  for (const scene of scenes) {
    if (!scene.narration?.trim()) {
      continue;
    }

    const payload: TtsPayload = {
      voice_id: voiceId,
      text: scene.narration,
      model: args.model,
      language,
      output: {
        volume: 100,
        audio_pitch: 0,
        audio_tempo: 1,
        audio_format: args.format,
      },
      seed: 42,
    };

    const result = await postTts(apiKey, payload, args.granularity);
    generatedScenes.push({ scene, result });
    const audioBuffer = Buffer.from(result.audio, "base64");
    const audioPath = path.join(outputRoot, `${scene.id}.${result.audio_format}`);
    const metaPath = path.join(outputRoot, `${scene.id}.json`);

    await fs.writeFile(audioPath, audioBuffer);
    await fs.writeFile(
      metaPath,
      JSON.stringify(
        {
          sceneId: scene.id,
          narration: scene.narration,
          audioFormat: result.audio_format,
          audioDuration: result.audio_duration,
          durationSeconds: scene.durationSeconds,
          words: result.words,
          characters: result.characters,
        },
        null,
        2,
      ),
      "utf8",
    );

    console.log(`Generated ${scene.id}: ${audioPath}`);
  }

  if (args.writeStoryboard && generatedScenes.length > 0) {
    const updatedStoryboard = updateStoryboardAudio(storyboard, generatedScenes, outputRoot, args.format);
    await fs.writeFile(args.storyboardPath, JSON.stringify(updatedStoryboard, null, 2), "utf8");
    console.log(`Updated storyboard audio references in ${args.storyboardPath}`);
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
