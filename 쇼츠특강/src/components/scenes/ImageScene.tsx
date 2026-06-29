import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Scene } from "../../types/storyboard";
import { CaptionBar } from "../ui/CaptionBar";

export type ImageSceneProps = {
  scene: Scene;
};

export const ImageScene: React.FC<ImageSceneProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateLeft: "clamp" });
  const zoom = interpolate(frame, [0, fps * 1.2], [1.08, 1], { extrapolateLeft: "clamp" });
  const hasImage = Boolean(scene.image?.enabled && scene.image.source);
  const copy = scene.caption ?? scene.narration ?? scene.headline;

  return (
    <AbsoluteFill
      style={{
        color: "#f8fafc",
        background:
          "radial-gradient(circle at top, rgba(56,189,248,0.26), transparent 40%), linear-gradient(180deg, #08111f 0%, #0f172a 100%)",
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.32,
          background:
            "linear-gradient(135deg, rgba(14,165,233,0.24), rgba(244,114,182,0.12), rgba(15,23,42,0))",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "8% 8% auto 8%",
          display: "grid",
          gap: 24,
        }}
      >
        <div style={{ maxWidth: 860, opacity: fadeIn }}>
          <div
            style={{
              fontSize: 24,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#7dd3fc",
            }}
          >
            Remotion x Typecast
          </div>
          <h1
            style={{
              margin: "12px 0 0",
              fontSize: 78,
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
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
            width: "100%",
            height: "62vh",
            borderRadius: 36,
            overflow: "hidden",
            border: "1px solid rgba(148,163,184,0.22)",
            boxShadow: "0 24px 80px rgba(2,6,23,0.45)",
            position: "relative",
            transform: `scale(${zoom})`,
            opacity: fadeIn,
            background: "rgba(15,23,42,0.78)",
          }}
        >
          {hasImage ? (
            <Img
              src={staticFile(scene.image!.source!)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: scene.image?.fit ?? "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "grid",
                placeItems: "center",
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)), radial-gradient(circle at 20% 20%, rgba(59,130,246,0.45), transparent 35%)",
                padding: 48,
                textAlign: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 26, color: "#94a3b8", letterSpacing: 2 }}>Image placeholder</div>
                <div style={{ marginTop: 16, fontSize: 44, lineHeight: 1.15, maxWidth: 700 }}>
                  Add a file to <code>public/images/</code> and enable it in the storyboard.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <CaptionBar text={copy} />
    </AbsoluteFill>
  );
};
