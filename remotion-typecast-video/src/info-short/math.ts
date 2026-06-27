import { interpolate } from "remotion";

export const fit = (
  value: number,
  input: [number, number],
  output: [number, number],
) =>
  interpolate(value, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const splitCaption = (script: string) => {
  const words = script.split(/\s+/);
  const chunkSize = words.length > 11 ? 3 : 4;
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  return chunks;
};

export const avatarPositions = Array.from({ length: 23 }, (_, index) => {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / 23;
  const wave = Math.sin(index * 1.9) * 18;

  return {
    x: 450 + Math.cos(angle) * (258 + wave),
    y: 340 + Math.sin(angle) * (258 + wave * 0.5),
  };
});

export const singleComparePositions = [
  { x: 450, y: 338 },
  ...Array.from({ length: 22 }, (_, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / 22;

    return {
      x: 450 + Math.cos(angle) * 282,
      y: 338 + Math.sin(angle) * 246,
    };
  }),
];

export const pairs = (() => {
  const all: Array<[number, number]> = [];

  for (let a = 0; a < avatarPositions.length; a += 1) {
    for (let b = a + 1; b < avatarPositions.length; b += 1) {
      all.push([a, b]);
    }
  }

  return all;
})();

export const birthdayCells = [
  7, 23, 39, 58, 74, 86, 102, 119, 135, 148, 164, 177, 192, 205, 219, 234,
  248, 262, 276, 291, 306, 177, 341,
];
