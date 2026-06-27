import type { FC } from "react";
import { birthdayCells } from "../math";

export const CalendarGrid: FC<{
  accent: string;
  reveal: number;
  duplicate?: boolean;
  dots?: boolean;
}> = ({ accent, reveal, duplicate = false, dots = false }) => {
  const cell = 19;
  const gap = 5;
  const cols = 31;
  const startX = 74;
  const startY = 98;
  const visibleCells = Math.floor(365 * reveal);

  return (
    <g>
      {Array.from({ length: 365 }).map((_, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const isDuplicate = duplicate && index === 177;
        const opacity = index <= visibleCells ? 1 : 0.06;

        return (
          <rect
            key={index}
            x={startX + col * (cell + gap)}
            y={startY + row * (cell + gap)}
            width={cell}
            height={cell}
            fill={isDuplicate ? accent : "#ffffff"}
            stroke={isDuplicate ? accent : "#94a3b8"}
            strokeWidth={isDuplicate ? 4 : 1.6}
            opacity={isDuplicate ? 0.95 : opacity * 0.44}
          />
        );
      })}
      {dots &&
        birthdayCells.map((index, dotIndex) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          const x = startX + col * (cell + gap) + cell / 2;
          const y = startY + row * (cell + gap) + cell / 2;
          const duplicateDot = index === 177;

          return (
            <circle
              key={`${index}-${dotIndex}`}
              cx={x}
              cy={y}
              r={duplicateDot ? 8 : 6}
              fill={duplicateDot ? accent : "#0f172a"}
              opacity={0.88}
            />
          );
        })}
    </g>
  );
};
