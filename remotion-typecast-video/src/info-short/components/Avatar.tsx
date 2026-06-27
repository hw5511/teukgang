import type { FC } from "react";

export const Avatar: FC<{
  x: number;
  y: number;
  r?: number;
  accent: string;
  active?: boolean;
  dim?: boolean;
  opacity?: number;
  scale?: number;
}> = ({ x, y, r = 24, accent, active, dim, opacity = 1, scale = 1 }) => {
  const fill = active ? accent : "#f8fafc";
  const stroke = active ? accent : "#334155";
  const body = active ? "#ffffff" : "#64748b";

  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      opacity={opacity * (dim ? 0.36 : 1)}
    >
      <circle
        cx="0"
        cy="0"
        r={r}
        fill={fill}
        stroke={stroke}
        strokeWidth={active ? 5 : 3}
      />
      <circle cx="0" cy={-r * 0.22} r={r * 0.22} fill={body} />
      <path
        d={`M ${-r * 0.38} ${r * 0.35} Q 0 ${r * 0.05} ${r * 0.38} ${r * 0.35}`}
        fill="none"
        stroke={body}
        strokeWidth={r * 0.12}
        strokeLinecap="round"
      />
    </g>
  );
};
