import type { FC } from "react";
import { Avatar } from "../components/Avatar";
import { avatarPositions, fit } from "../math";
import { largeNumber, svgStage } from "../styles";

export const ArrivalScene: FC<{ frame: number; duration: number; accent: string }> = ({
  frame,
  duration,
  accent,
}) => {
  const avatarInterval = Math.max(2, Math.floor((duration - 26) / 23));
  const visibleCount = Math.min(23, Math.floor(frame / avatarInterval) + 1);
  const pulse = 0.5 + Math.sin(frame / 10) * 0.5;

  return (
    <svg viewBox="0 0 900 760" style={svgStage}>
      <circle
        cx="450"
        cy="340"
        r={230 + pulse * 8}
        fill="none"
        stroke={accent}
        strokeWidth="3"
        opacity="0.22"
      />
      {avatarPositions.map((pos, index) => {
        const local = frame - index * avatarInterval;
        const opacity = fit(local, [0, 9], [0, 1]);
        const scale = fit(local, [0, 12], [0.35, 1]);

        return (
          <Avatar
            key={index}
            x={pos.x}
            y={pos.y}
            accent={accent}
            opacity={index < visibleCount ? opacity : 0}
            scale={scale}
          />
        );
      })}
      <text
        x="450"
        y="365"
        textAnchor="middle"
        style={largeNumber}
        opacity={fit(frame, [duration - 34, duration - 8], [0, 1])}
      >
        23
      </text>
    </svg>
  );
};
