import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { getSceneDurationFrames } from "../lib/storyboard";
import type { Scene, SubtitleChunk, Storyboard } from "../types/storyboard";

export type GraphicsCycloidShortProps = {
  storyboard: Storyboard;
  scenes: Scene[];
};

type Point = {
  x: number;
  y: number;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;

const easeInOut = (progress: number) =>
  progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

const makePath = (points: Point[]) =>
  points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");

const sampleCurve = (sampleCount: number, getPoint: (progress: number) => Point) =>
  Array.from({ length: sampleCount + 1 }, (_, index) => getPoint(index / sampleCount));

const getActiveChunk = (chunks: SubtitleChunk[] | undefined, seconds: number) => {
  if (!chunks?.length) {
    return undefined;
  }

  return chunks.find((chunk) => seconds >= chunk.startSeconds && seconds <= chunk.endSeconds) ?? undefined;
};

const SubtitleLayer: React.FC<{
  chunk?: SubtitleChunk;
  localSeconds: number;
}> = ({ chunk, localSeconds }) => {
  const opacity =
    chunk == null
      ? 0
      : interpolate(
          localSeconds,
          [chunk.startSeconds - 0.12, chunk.startSeconds + 0.08, chunk.endSeconds - 0.08, chunk.endSeconds + 0.14],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

  if (!chunk) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 118,
        transform: "translateX(-50%)",
        width: "88%",
        maxWidth: 980,
        textAlign: "center",
        color: "#f8fafc",
        fontSize: 56,
        fontWeight: 800,
        lineHeight: 1.12,
        letterSpacing: -1.4,
        textShadow: "0 4px 18px rgba(2,6,23,0.9), 0 0 24px rgba(103,232,249,0.16)",
        opacity,
      }}
    >
      {chunk.text}
    </div>
  );
};

const SceneChrome: React.FC<{ frame: number; durationFrames: number }> = ({ frame, durationFrames }) => {
  const globalGlow = interpolate(frame, [0, durationFrames * 0.5, durationFrames], [0.35, 0.52, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 28%, rgba(56,189,248,0.12), transparent 26%), radial-gradient(circle at 78% 18%, rgba(250,204,21,0.07), transparent 18%), linear-gradient(180deg, #020617 0%, #050b16 52%, #02040a 100%)",
        }}
      />
      <svg
        viewBox="0 0 1080 1920"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <defs>
          <linearGradient id="gridFade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(148,163,184,0.24)" />
            <stop offset="100%" stopColor="rgba(148,163,184,0.06)" />
          </linearGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {Array.from({ length: 14 }, (_, index) => (
          <line
            key={`v-${index}`}
            x1={80 + index * 70}
            y1="0"
            x2={80 + index * 70}
            y2="1920"
            stroke="rgba(148,163,184,0.08)"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 22 }, (_, index) => (
          <line
            key={`h-${index}`}
            x1="0"
            y1={index * 88}
            x2="1080"
            y2={index * 88}
            stroke="rgba(148,163,184,0.06)"
            strokeWidth="1"
          />
        ))}
        <path
          d="M 90 1550 C 250 1470, 360 1450, 510 1370 S 760 1250, 1000 1140"
          fill="none"
          stroke="rgba(103,232,249,0.10)"
          strokeWidth="2"
        />
        <path
          d="M 50 460 C 210 330, 390 290, 610 320 S 900 440, 1030 360"
          fill="none"
          stroke="rgba(59,130,246,0.10)"
          strokeWidth="2"
        />
        {[
          { x: 160, y: 220, r: 3.5, color: "rgba(103,232,249,0.8)", speed: 1 },
          { x: 920, y: 340, r: 4.5, color: "rgba(250,204,21,0.7)", speed: 0.8 },
          { x: 310, y: 1440, r: 3.2, color: "rgba(148,163,184,0.8)", speed: 1.25 },
          { x: 840, y: 1180, r: 2.8, color: "rgba(191,219,254,0.7)", speed: 0.65 },
        ].map((dot, index) => {
          const pulse = 0.5 + 0.5 * Math.sin((frame / 24) * dot.speed + index * 1.9);
          return (
            <circle
              key={`${dot.x}-${dot.y}`}
              cx={dot.x + Math.sin(frame / (34 + index * 5)) * 6}
              cy={dot.y + Math.cos(frame / (30 + index * 3)) * 5}
              r={dot.r + pulse * 2}
              fill={dot.color}
              opacity={0.25 + pulse * 0.7 * globalGlow}
              filter="url(#softGlow)"
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(2,6,23,0.18) 0%, rgba(2,6,23,0.04) 38%, rgba(2,6,23,0.18) 100%)",
          opacity: 0.96,
        }}
      />
    </AbsoluteFill>
  );
};

const pathPointAt = (points: Point[], progress: number) => {
  if (points.length === 0) {
    return { x: 0, y: 0 };
  }

  const clamped = clamp01(progress);
  const scaled = clamped * (points.length - 1);
  const index = Math.floor(scaled);
  const nextIndex = Math.min(points.length - 1, index + 1);
  const local = scaled - index;
  return {
    x: lerp(points[index].x, points[nextIndex].x, local),
    y: lerp(points[index].y, points[nextIndex].y, local),
  };
};

const drawPoint = (point: Point, radius: number, fill: string, glow: string, opacity = 1) => (
  <>
    <circle cx={point.x} cy={point.y} r={radius * 2.2} fill={glow} opacity={0.22 * opacity} filter="url(#softGlow)" />
    <circle cx={point.x} cy={point.y} r={radius} fill={fill} opacity={opacity} />
  </>
);

const SceneOne: React.FC<{ frame: number; fps: number; durationFrames: number }> = ({ frame, fps, durationFrames }) => {
  const progress = easeInOut(clamp01(frame / durationFrames));
  const start = { x: 160, y: 360 };
  const end = { x: 920, y: 1400 };

  const straightPoints = sampleCurve(2, (t) => ({
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t),
  }));

  const arcPoints = sampleCurve(120, (t) => ({
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t) - Math.sin(Math.PI * t) * 210,
  }));

  const cycloidPoints = sampleCurve(160, (t) => {
    const wave = t - Math.sin(2 * Math.PI * t) / (2 * Math.PI);
    return {
      x: lerp(start.x, end.x, t),
      y: lerp(start.y, end.y, 0.08 * t + 0.92 * wave),
    };
  });

  const straightDot = pathPointAt(straightPoints, progress * 0.92);
  const arcDot = pathPointAt(arcPoints, progress * 1.06);
  const cycloidDot = pathPointAt(cycloidPoints, progress * 1.35);

  return (
    <StageLayout>
      <svg viewBox="0 0 1080 1920" style={svgFull}>
        <defs>
          <linearGradient id="cyanStroke" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="blueStroke" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <path d={makePath(straightPoints)} fill="none" stroke="rgba(148,163,184,0.70)" strokeWidth="8" strokeDasharray="18 16" />
        <path d={makePath(arcPoints)} fill="none" stroke="url(#blueStroke)" strokeWidth="9" opacity="0.92" />
        <path d={makePath(cycloidPoints)} fill="none" stroke="url(#cyanStroke)" strokeWidth="12" filter="url(#softGlow)" />
        <circle cx={start.x} cy={start.y} r="12" fill="rgba(248,250,252,0.88)" />
        <circle cx={end.x} cy={end.y} r="13" fill="rgba(248,250,252,0.92)" />
        <text x="122" y="340" fill="rgba(226,232,240,0.86)" fontSize="26" letterSpacing="3">
          출발
        </text>
        <text x="884" y="1480" fill="rgba(226,232,240,0.86)" fontSize="26" letterSpacing="3">
          도착
        </text>
        {drawPoint(straightDot, 17, "#e2e8f0", "rgba(148,163,184,0.45)", 0.95)}
        {drawPoint(arcDot, 17, "#93c5fd", "rgba(59,130,246,0.45)", 1)}
        {drawPoint(cycloidDot, 17, "#67e8f9", "rgba(103,232,249,0.75)", 1)}
        <path
          d={makePath(sampleCurve(26, (t) => {
            const p = pathPointAt(cycloidPoints, clamp01(progress * 1.35 * t));
            return p;
          }))}
          fill="none"
          stroke="rgba(103,232,249,0.5)"
          strokeWidth="5"
          strokeLinecap="round"
          opacity={0.75}
          filter="url(#softGlow)"
        />
      </svg>
      <SubtitleLayer chunk={getActiveChunk(undefined, 0)} localSeconds={0} />
    </StageLayout>
  );
};

const ComparisonMeter: React.FC<{
  label: string;
  color: string;
  length: number;
  time: number;
  y: number;
  frame: number;
  fps: number;
}> = ({ label, color, length, time, y, frame, fps }) => {
  const intro = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 120 },
  });
  const timer = clamp01(interpolate(frame, [0, fps * 2.2], [0, time], { extrapolateRight: "clamp" }));
  const barWidth = 180 + length * 420 * intro;

  return (
    <>
      <line x1="130" y1={y} x2="930" y2={y} stroke="rgba(148,163,184,0.16)" strokeWidth="1.5" />
      <path
        d={`M 150 ${y} C 310 ${y - 42}, 470 ${y - 42}, 630 ${y} S 860 ${y + 42}, 950 ${y}`}
        fill="none"
        stroke={color}
        strokeWidth="5"
        opacity={0.26}
      />
      <rect x="150" y={y - 14} width={barWidth} height="28" fill={color} opacity={0.86} rx="0" />
      <circle cx={150 + barWidth} cy={y} r="18" fill={color} opacity={0.94} filter="url(#softGlow)" />
      <circle cx={770} cy={y} r="32" fill="none" stroke={color} strokeWidth="4" opacity={0.45} />
      <path
        d={makeArc(timer, 32, 770, y)}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        opacity={0.96}
        filter="url(#softGlow)"
      />
      <text x="150" y={y - 28} fill="rgba(226,232,240,0.84)" fontSize="24" letterSpacing="2">
        {label}
      </text>
    </>
  );
};

const SceneTwo: React.FC<{ frame: number; fps: number; durationFrames: number }> = ({ frame, fps, durationFrames }) => {
  const progress = clamp01(frame / durationFrames);
  return (
    <StageLayout>
      <svg viewBox="0 0 1080 1920" style={svgFull}>
        <defs>
          <linearGradient id="meterBlue" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="meterCyan" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="meterGold" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
        <text x="118" y="260" fill="rgba(248,250,252,0.8)" fontSize="28" letterSpacing="4">
          길이
        </text>
        <text x="738" y="260" fill="rgba(248,250,252,0.8)" fontSize="28" letterSpacing="4">
          시간
        </text>
        <ComparisonMeter
          label="직선"
          color="url(#meterBlue)"
          length={0.28}
          time={1}
          y={520}
          frame={frame}
          fps={fps}
        />
        <ComparisonMeter
          label="완만한 원호"
          color="url(#meterCyan)"
          length={0.56}
          time={0.78}
          y={810}
          frame={frame - 6}
          fps={fps}
        />
        <ComparisonMeter
          label="사이클로이드"
          color="url(#meterGold)"
          length={0.82}
          time={0.55}
          y={1100}
          frame={frame - 12}
          fps={fps}
        />
        <line x1="120" y1="1360" x2="960" y2="1360" stroke="rgba(148,163,184,0.14)" strokeWidth="1" />
        <circle cx={190 + progress * 700} cy="1360" r="10" fill="rgba(103,232,249,0.8)" filter="url(#softGlow)" />
        <circle cx={190 + progress * 700} cy="1360" r="36" fill="none" stroke="rgba(103,232,249,0.28)" strokeWidth="3" />
      </svg>
      <SubtitleLayer chunk={getActiveChunk(undefined, 0)} localSeconds={0} />
    </StageLayout>
  );
};

const SceneThree: React.FC<{ frame: number; fps: number; durationFrames: number }> = ({ frame, fps, durationFrames }) => {
  const progress = easeInOut(clamp01(frame / durationFrames));
  const groundY = 1460;
  const radius = 162;
  const travel = 760;
  const centerX = 190 + travel * progress;
  const centerY = groundY - radius;
  const wheelRotation = (travel * progress) / radius;
  const point = {
    x: centerX - radius * Math.sin(wheelRotation),
    y: centerY + radius * Math.cos(wheelRotation),
  };
  const tracePoints = sampleCurve(180, (t) => {
    const theta = wheelRotation * t;
    return {
      x: 190 + radius * theta - radius * Math.sin(theta),
      y: groundY - radius * (1 - Math.cos(theta)),
    };
  });
  const wheelSpoke = (angle: number) => ({
    x: centerX + radius * 0.78 * Math.cos(angle),
    y: centerY + radius * 0.78 * Math.sin(angle),
  });

  return (
    <StageLayout>
      <svg viewBox="0 0 1080 1920" style={svgFull}>
        <defs>
          <linearGradient id="wheelStroke" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#67e8f9" />
          </linearGradient>
        </defs>
        <line x1="120" y1={groundY} x2="960" y2={groundY} stroke="rgba(226,232,240,0.24)" strokeWidth="3" />
        <path
          d={makePath(tracePoints)}
          fill="none"
          stroke="rgba(103,232,249,0.24)"
          strokeWidth="10"
          filter="url(#softGlow)"
        />
        <path
          d={makePath(tracePoints.slice(0, Math.max(2, Math.floor(tracePoints.length * progress))))}
          fill="none"
          stroke="url(#wheelStroke)"
          strokeWidth="12"
          filter="url(#softGlow)"
        />
        <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="rgba(226,232,240,0.9)" strokeWidth="6" />
        <circle cx={centerX} cy={centerY} r={radius - 16} fill="none" stroke="rgba(103,232,249,0.18)" strokeWidth="2" />
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle) => {
          const spokeEnd = wheelSpoke(angle + wheelRotation);
          return (
            <line
              key={angle}
              x1={centerX}
              y1={centerY}
              x2={spokeEnd.x}
              y2={spokeEnd.y}
              stroke="rgba(226,232,240,0.5)"
              strokeWidth="3"
            />
          );
        })}
        <circle cx={centerX} cy={centerY} r="14" fill="rgba(248,250,252,0.92)" />
        <circle cx={point.x} cy={point.y} r="14" fill="#67e8f9" filter="url(#softGlow)" />
        <path d={`M ${point.x} ${point.y} L ${centerX} ${centerY}`} stroke="rgba(103,232,249,0.38)" strokeWidth="3" />
        <circle cx={point.x} cy={point.y} r="34" fill="none" stroke="rgba(103,232,249,0.22)" strokeWidth="3" />
      </svg>
      <SubtitleLayer chunk={getActiveChunk(undefined, 0)} localSeconds={0} />
    </StageLayout>
  );
};

const SceneFour: React.FC<{ frame: number; fps: number; durationFrames: number }> = ({ frame, fps, durationFrames }) => {
  const progress = easeInOut(clamp01(frame / durationFrames));
  const start = { x: 180, y: 520 };
  const end = { x: 910, y: 1260 };
  const curvePoints = sampleCurve(180, (t) => {
    const wave = t - Math.sin(2 * Math.PI * t) / (2 * Math.PI);
    const mirrored = 1 - (0.12 * t + 0.88 * wave);
    return {
      x: lerp(start.x, end.x, t),
      y: lerp(start.y, end.y, mirrored),
    };
  });
  const marbleTs = [0.08, 0.34, 0.62];
  const marbleColors = ["#fde68a", "#fbbf24", "#fff7d6"];

  return (
    <StageLayout>
      <svg viewBox="0 0 1080 1920" style={svgFull}>
        <path
          d={makePath(curvePoints)}
          fill="none"
          stroke="rgba(250,204,21,0.75)"
          strokeWidth="12"
          filter="url(#softGlow)"
        />
        <path
          d={makePath(curvePoints)}
          fill="none"
          stroke="rgba(253,224,71,0.2)"
          strokeWidth="2"
        />
        {marbleTs.map((startT, index) => {
          const travelProgress = clamp01(progress * 0.98);
          const currentT = lerp(startT, 0.98, travelProgress);
          const point = pathPointAt(curvePoints, currentT);
          const startPoint = pathPointAt(curvePoints, startT);
          const arrival = 1 - clamp01(Math.abs(progress - 1) * 8);
          return (
            <React.Fragment key={startT}>
              <circle cx={startPoint.x} cy={startPoint.y} r="10" fill="rgba(248,250,252,0.26)" />
              <path
                d={makePath(sampleCurve(40, (t) => pathPointAt(curvePoints, lerp(startT, currentT, t))))}
                fill="none"
                stroke={marbleColors[index]}
                strokeWidth="5"
                opacity="0.28"
              />
              {drawPoint(point, 16, marbleColors[index], "rgba(250,204,21,0.7)", 0.9)}
            </React.Fragment>
          );
        })}
        <circle cx={end.x} cy={end.y} r="24" fill="rgba(254,249,195,0.14)" stroke="rgba(254,249,195,0.75)" strokeWidth="3" />
        <circle cx={end.x} cy={end.y} r="64" fill="none" stroke="rgba(250,204,21,0.16)" strokeWidth="3" />
        <text x="120" y="430" fill="rgba(254,243,199,0.88)" fontSize="28" letterSpacing="2">
          서로 다른 출발
        </text>
        <text x="760" y="1320" fill="rgba(254,243,199,0.88)" fontSize="28" letterSpacing="2">
          같은 도착
        </text>
      </svg>
      <SubtitleLayer chunk={getActiveChunk(undefined, 0)} localSeconds={0} />
    </StageLayout>
  );
};

const SceneFive: React.FC<{ frame: number; fps: number; durationFrames: number }> = ({ frame, fps, durationFrames }) => {
  const progress = easeInOut(clamp01(frame / durationFrames));
  const start = { x: 160, y: 380 };
  const end = { x: 930, y: 1410 };
  const straight = sampleCurve(2, (t) => ({
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t),
  }));
  const arc = sampleCurve(90, (t) => ({
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t) - Math.sin(Math.PI * t) * 190,
  }));
  const cycloid = sampleCurve(160, (t) => {
    const wave = t - Math.sin(2 * Math.PI * t) / (2 * Math.PI);
    return {
      x: lerp(start.x, end.x, t),
      y: lerp(start.y, end.y, 0.06 * t + 0.94 * wave),
    };
  });
  const point = pathPointAt(cycloid, progress);
  const trail = sampleCurve(50, (t) => pathPointAt(cycloid, clamp01(progress * t)));

  return (
    <StageLayout>
      <svg viewBox="0 0 1080 1920" style={svgFull}>
        <path d={makePath(straight)} fill="none" stroke="rgba(148,163,184,0.28)" strokeWidth="6" strokeDasharray="16 14" />
        <path d={makePath(arc)} fill="none" stroke="rgba(96,165,250,0.26)" strokeWidth="8" />
        <path d={makePath(cycloid)} fill="none" stroke="rgba(103,232,249,0.96)" strokeWidth="12" filter="url(#softGlow)" />
        <path d={makePath(trail)} fill="none" stroke="rgba(103,232,249,0.72)" strokeWidth="6" strokeLinecap="round" filter="url(#softGlow)" />
        {drawPoint(point, 18, "#67e8f9", "rgba(103,232,249,0.8)", 1)}
        <circle cx={end.x} cy={end.y} r="15" fill="rgba(248,250,252,0.94)" />
        <circle cx={start.x} cy={start.y} r="11" fill="rgba(248,250,252,0.84)" />
        <text
          x="110"
          y="600"
          fill="rgba(255,255,255,0.94)"
          fontSize="84"
          fontWeight="800"
          letterSpacing="-2"
        >
          최단
        </text>
        <text
          x="108"
          y="720"
          fill="rgba(103,232,249,0.98)"
          fontSize="84"
          fontWeight="900"
          letterSpacing="-2"
        >
          시간
        </text>
        <text x="110" y="1160" fill="rgba(226,232,240,0.82)" fontSize="30" letterSpacing="3">
          직선보다 빠른 길
        </text>
        <text x="110" y="1210" fill="rgba(226,232,240,0.82)" fontSize="30" letterSpacing="3">
          그 답은 사이클로이드
        </text>
      </svg>
      <SubtitleLayer chunk={getActiveChunk(undefined, 0)} localSeconds={0} />
    </StageLayout>
  );
};

const makeArc = (progress: number, radius: number, cx: number, cy: number) => {
  const clamped = clamp01(progress);
  const start = -Math.PI / 2;
  const end = start + Math.PI * 2 * clamped;
  const x = cx + radius * Math.cos(end);
  const y = cy + radius * Math.sin(end);
  const largeArc = clamped > 0.5 ? 1 : 0;
  return `M ${cx} ${cy - radius} A ${radius} ${radius} 0 ${largeArc} 1 ${x.toFixed(2)} ${y.toFixed(2)}`;
};

const svgFull: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
};

const StageLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#020617" }}>
      {children}
    </AbsoluteFill>
  );
};

const SceneRenderer: React.FC<{
  scene: Scene;
  sceneStartFrame: number;
  durationFrames: number;
  fps: number;
}> = ({ scene, sceneStartFrame, durationFrames, fps }) => {
  const globalFrame = useCurrentFrame();
  const localFrame = Math.max(0, globalFrame - sceneStartFrame);
  const localSeconds = localFrame / fps;
  const subtitleChunk = getActiveChunk(scene.subtitleChunks, localSeconds);

  return (
    <AbsoluteFill>
      {scene.id === "scene-1-path-race" ? (
        <SceneOne frame={localFrame} fps={fps} durationFrames={durationFrames} />
      ) : null}
      {scene.id === "scene-2-length-vs-time" ? (
        <SceneTwo frame={localFrame} fps={fps} durationFrames={durationFrames} />
      ) : null}
      {scene.id === "scene-3-rolling-circle" ? (
        <SceneThree frame={localFrame} fps={fps} durationFrames={durationFrames} />
      ) : null}
      {scene.id === "scene-4-inverted-cycloid" ? (
        <SceneFour frame={localFrame} fps={fps} durationFrames={durationFrames} />
      ) : null}
      {scene.id === "scene-5-final-answer" ? (
        <SceneFive frame={localFrame} fps={fps} durationFrames={durationFrames} />
      ) : null}
      <SubtitleLayer chunk={subtitleChunk} localSeconds={localSeconds} />
    </AbsoluteFill>
  );
};

export const GraphicsCycloidShort: React.FC<GraphicsCycloidShortProps> = ({ storyboard, scenes }) => {
  let startFrame = 0;
  const totalDurationFrames = scenes.reduce(
    (total, scene) => total + getSceneDurationFrames(scene, storyboard.canvas.fps),
    0,
  );
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#020617",
      }}
    >
      <SceneChrome frame={frame} durationFrames={totalDurationFrames} />
      {scenes.map((scene) => {
        const durationFrames = getSceneDurationFrames(scene, storyboard.canvas.fps);
        const sequence = (
          <Sequence key={scene.id} from={startFrame} durationInFrames={durationFrames}>
            <SceneRenderer
              scene={scene}
              sceneStartFrame={startFrame}
              durationFrames={durationFrames}
              fps={storyboard.canvas.fps}
            />
            {scene.audio?.enabled && scene.audio.source ? <Audio src={staticFile(scene.audio.source)} /> : null}
          </Sequence>
        );

        startFrame += durationFrames;
        return sequence;
      })}
    </AbsoluteFill>
  );
};
