import type { FC } from "react";
import { CalendarGrid } from "../components/CalendarGrid";
import { fit } from "../math";
import { largeNumber, svgStage } from "../styles";

export const CalendarScene: FC<{ frame: number; duration: number; accent: string }> = ({
  frame,
  duration,
  accent,
}) => {
  const reveal = fit(frame, [0, duration * 0.58], [0, 1]);
  const shake =
    Math.sin(frame * 0.78) * fit(frame, [duration * 0.34, duration * 0.68], [0, 9]);

  return (
    <svg viewBox="0 0 900 760" style={svgStage}>
      <CalendarGrid accent={accent} reveal={reveal} />
      <g transform={`translate(${shake} 0)`}>
        <text
          x="450"
          y="386"
          textAnchor="middle"
          style={{ ...largeNumber, fontSize: 170, fill: accent }}
          opacity={fit(frame, [12, 30], [0, 1])}
        >
          365
        </text>
      </g>
    </svg>
  );
};
