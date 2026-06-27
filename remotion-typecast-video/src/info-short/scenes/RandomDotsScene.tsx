import type { FC } from "react";
import { CalendarGrid } from "../components/CalendarGrid";
import { birthdayCells, fit } from "../math";
import { svgStage } from "../styles";

export const RandomDotsScene: FC<{ frame: number; duration: number; accent: string }> = ({
  frame,
  duration,
  accent,
}) => {
  const reveal = fit(frame, [0, 18], [0, 1]);
  const dotCount = Math.floor(fit(frame, [10, duration - 28], [0, birthdayCells.length]));

  return (
    <svg viewBox="0 0 900 760" style={svgStage}>
      <CalendarGrid accent={accent} reveal={reveal} duplicate={dotCount > 21} />
      <g opacity={fit(frame, [8, 24], [0, 1])}>
        {birthdayCells.slice(0, dotCount).map((index, dotIndex) => {
          const cell = 19;
          const gap = 5;
          const cols = 31;
          const startX = 74;
          const startY = 98;
          const col = index % cols;
          const row = Math.floor(index / cols);
          const x = startX + col * (cell + gap) + cell / 2;
          const targetY = startY + row * (cell + gap) + cell / 2;
          const drop = fit(frame - dotIndex * 3, [0, 12], [-82, 0]);
          const duplicate = index === 177;

          return (
            <circle
              key={`${index}-${dotIndex}`}
              cx={x}
              cy={targetY + drop}
              r={duplicate ? 10 : 7}
              fill={duplicate ? accent : "#0f172a"}
              opacity={duplicate ? 0.94 : 0.72}
            />
          );
        })}
      </g>
    </svg>
  );
};
