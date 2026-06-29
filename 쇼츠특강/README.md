# Remotion + Typecast Starter

This project wires a Remotion short video to Typecast TTS.

## What is included

- Remotion compositions under `src/`
- Typecast TTS generation with `TYPECAST_API_KEY`
- Sample storyboard at `storyboards/sample.storyboard.json`
- Audio, image, and SFX folders under `public/`
- A script for generating narration and optional storyboard updates

## Setup

1. Install dependencies:

```powershell
npm install
```

2. Create your local environment file:

```powershell
Copy-Item .env.example .env
```

3. Set your Typecast API key in `.env`:

```powershell
TYPECAST_API_KEY=your_typecast_api_key_here
```

4. Update `storyboards/sample.storyboard.json` with your own voice ID and script.

## Preview

Open Remotion Studio:

```powershell
npm run dev
```

## Generate TTS

Generate narration for the sample storyboard:

```powershell
npm run tts:sample
```

If you want to target a different storyboard:

```powershell
npm run tts -- --storyboard storyboards/sample.storyboard.json --out public/audio --write-storyboard
```

The script writes audio files into `public/audio/<storyboard-slug>/` and can update the storyboard JSON so the generated audio is wired into the composition.

## Render MP4

After the narration files exist, render the sample short:

```powershell
npm run render:sample
```

You can also pass your own composition ID and output path:

```powershell
npm run render -- SampleShort out/my-short.mp4
```

## Validation

Run TypeScript checks:

```powershell
npm run typecheck
```

## Project layout

- `src/index.tsx`: Remotion entry point
- `src/Root.tsx`: composition registration
- `src/compositions/`: video compositions
- `src/components/`: reusable scene UI
- `src/lib/`: storyboard helpers
- `src/types/`: shared types
- `scripts/generate-tts.ts`: Typecast audio generation
- `storyboards/sample.storyboard.json`: sample content
