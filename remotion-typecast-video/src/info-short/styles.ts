import type { CSSProperties } from "react";

const fontStack =
  "Pretendard, 'Spoqa Han Sans Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif";

export const stage: CSSProperties = {
  backgroundColor: "#f7f6ef",
  color: "#0f172a",
  fontFamily: fontStack,
};

export const gridBackground: CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage:
    "linear-gradient(rgba(15, 23, 42, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.035) 1px, transparent 1px)",
  backgroundSize: "58px 58px",
};

export const visualWrap: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 174,
  width: 1080,
  height: 980,
};

export const svgStage: CSSProperties = {
  width: "100%",
  height: "100%",
  overflow: "visible",
};

export const captionWrap: CSSProperties = {
  position: "absolute",
  left: 36,
  top: 1154,
  width: 1008,
  minHeight: 330,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
};

export const captionText: CSSProperties = {
  width: "100%",
  color: "#101827",
  fontSize: 76,
  lineHeight: 1.08,
  fontWeight: 950,
  letterSpacing: 0,
  textAlign: "center",
  wordBreak: "keep-all",
  textWrap: "balance",
  textShadow:
    "0 4px 0 rgba(247,246,239,0.98), 4px 0 0 rgba(247,246,239,0.98), -4px 0 0 rgba(247,246,239,0.98), 0 -4px 0 rgba(247,246,239,0.98)",
};

export const largeNumber: CSSProperties = {
  fill: "#0f172a",
  fontSize: 204,
  fontWeight: 980,
  letterSpacing: 0,
};

export const smallMathText: CSSProperties = {
  fill: "#0f172a",
  fontSize: 76,
  fontWeight: 920,
  letterSpacing: 0,
};

export const formulaText: CSSProperties = {
  fill: "#0f172a",
  fontSize: 56,
  fontWeight: 900,
  letterSpacing: 0,
};

export const dateText: CSSProperties = {
  fill: "#0f172a",
  fontSize: 52,
  fontWeight: 950,
  letterSpacing: 0,
};
