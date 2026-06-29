import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Scene } from "../../types/storyboard";
import { CaptionBar } from "../ui/CaptionBar";

export type GraphicsSceneProps = {
  scene: Scene;
};

const ChartBars: React.FC<{ values: number[] }> = ({ values }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${values.length}, 1fr)`, gap: 16, height: 260 }}>
      {values.map((value, index) => {
        const progress = spring({
          frame: frame - index * 4,
          fps,
          config: { damping: 14, stiffness: 120 },
        });

        return (
          <div key={index} style={{ display: "flex", alignItems: "end", justifyContent: "center" }}>
            <div
              style={{
                width: "74%",
                height: `${Math.max(8, value * 100 * progress)}%`,
                borderRadius: 18,
                background: "linear-gradient(180deg, #67e8f9 0%, #3b82f6 100%)",
                boxShadow: "0 16px 40px rgba(59,130,246,0.35)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

const ChartLine: React.FC<{ values: number[] }> = ({ values }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(frame, [0, fps * 1.2], [0, 1], { extrapolateRight: "clamp" });

  const points = values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * 100;
      const y = 100 - value;
      return `${x},${y}`;
    })
    .join(" ");

  const animatedLength = 420 * draw;

  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: 260, overflow: "visible" }}>
      <polyline points={points} fill="none" stroke="rgba(103,232,249,0.32)" strokeWidth={1.5} />
      <polyline
        points={points}
        fill="none"
        stroke="#67e8f9"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={420}
        strokeDashoffset={420 - animatedLength}
      />
    </svg>
  );
};

export const GraphicsScene: React.FC<GraphicsSceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 16, stiffness: 140 } });
  const metric = scene.graphics?.metricValue ?? 0;
  const labels = ["Storyboard", "Voice", "Render"];
  const copy = scene.caption ?? scene.narration ?? scene.headline;

  return (
    <AbsoluteFill
      style={{
        color: "#f8fafc",
        background:
          "radial-gradient(circle at top right, rgba(59,130,246,0.3), transparent 38%), linear-gradient(180deg, #020617 0%, #0f172a 100%)",
      }}
    >
      <div style={{ position: "absolute", inset: "8% 7% 7%", display: "grid", gap: 24 }}>
        <div>
          <div style={{ fontSize: 24, letterSpacing: 5, textTransform: "uppercase", color: "#38bdf8" }}>
            Remotion x Typecast
          </div>
          <h1 style={{ margin: "12px 0 0", fontSize: 78, lineHeight: 1.02, letterSpacing: -2 }}>
            {scene.headline}
          </h1>
          {scene.caption ? (
            <p style={{ margin: "18px 0 0", fontSize: 30, color: "#cbd5e1", maxWidth: 760 }}>
              {scene.caption}
            </p>
          ) : null}
        </div>

        <div
          style={{
            padding: 32,
            borderRadius: 36,
            background: "rgba(15,23,42,0.86)",
            border: "1px solid rgba(148,163,184,0.2)",
            boxShadow: "0 24px 70px rgba(2,6,23,0.42)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
            <div>
              <div style={{ fontSize: 28, color: "#94a3b8" }}>{scene.graphics?.metricLabel ?? "Metric"}</div>
              <div style={{ fontSize: 118, fontWeight: 800, lineHeight: 1, transform: `scale(${0.92 + pop * 0.08})` }}>
                {Math.round(metric * pop)}
              </div>
            </div>
            <div
              style={{
                width: 180,
                height: 180,
                borderRadius: "50%",
                border: "18px solid rgba(56,189,248,0.18)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background:
                    "conic-gradient(from 0deg, #67e8f9 0deg, #3b82f6 calc(360deg * 0.87), rgba(148,163,184,0.14) calc(360deg * 0.87))",
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: 36, display: "grid", gap: 18 }}>
            {scene.graphics?.bars ? <ChartBars values={scene.graphics.bars} /> : null}
            {scene.graphics?.line ? <ChartLine values={scene.graphics.line} /> : null}
          </div>

          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {labels.map((label, index) => (
              <div
                key={label}
                style={{
                  padding: "18px 20px",
                  borderRadius: 22,
                  background: index === 1 ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.04)",
                  color: index === 1 ? "#e0f2fe" : "#cbd5e1",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <CaptionBar text={copy} />
    </AbsoluteFill>
  );
};
