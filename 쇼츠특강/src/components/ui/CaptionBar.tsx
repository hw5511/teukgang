import React from "react";

export type CaptionBarProps = {
  text: string;
};

export const CaptionBar: React.FC<CaptionBarProps> = ({ text }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: "6.5%",
        transform: "translateX(-50%)",
        width: "84%",
        maxWidth: 960,
        padding: "18px 24px",
        borderRadius: 22,
        background: "rgba(2,6,23,0.78)",
        border: "1px solid rgba(148,163,184,0.25)",
        boxShadow: "0 18px 50px rgba(2,6,23,0.45)",
        color: "#f8fafc",
        fontSize: 30,
        lineHeight: 1.35,
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
};
