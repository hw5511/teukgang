import type { FC } from "react";
import { fit } from "../math";
import { captionText, captionWrap } from "../styles";

export const Caption: FC<{
  chunks: string[];
  frame: number;
  duration: number;
}> = ({ chunks, frame, duration }) => {
  const chunkDuration = duration / chunks.length;
  const index = Math.min(chunks.length - 1, Math.floor(frame / chunkDuration));
  const local = frame - index * chunkDuration;
  const fadeFrames = Math.min(4, chunkDuration / 5);
  const opacity =
    fit(local, [0, fadeFrames], [0, 1]) *
    fit(local, [chunkDuration - fadeFrames, chunkDuration], [1, 0]);
  const y = fit(local, [0, fadeFrames + 4], [14, 0]);

  return (
    <div style={captionWrap}>
      <div
        style={{
          ...captionText,
          opacity,
          transform: `translateY(${y}px)`,
        }}
      >
        {chunks[index]}
      </div>
    </div>
  );
};
