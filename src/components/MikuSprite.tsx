import React from "react";

// Pixel character map for chibi Hatsune Miku
// . = transparent
// T = Teal hair, boots, tie (#39C5BB)
// L = Light Teal highlight (#76E5DC)
// D = Grey/Silver vest (#D4D4D8)
// B = Dark Anthracite skirts, sleeves (#27272A)
// S = Skin tone (#FBCFE8) -> actually cute pink peach: #FFE4E6 (tailored for high contrast)
// P = Soft Pink blush / details (#FDA4AF)
// R = Red details, ribbons (#F43F5E)
// Y = Yellow/Gold belt (#EAB308)
// E = Eye pupil / dark outline (#18181B)
// W = White eye highlights, shirt (#FFFFFF)

type SpritePose = "idle" | "walk_1" | "walk_2" | "jump" | "dance_1" | "dance_2" | "victory";

interface MikuSpriteProps {
  pose: SpritePose;
  className?: string;
  width?: number;
  height?: number;
}

// 24x24 grid templates for each frame
const SPRITE_GRIDS: Record<SpritePose, string[]> = {
  idle: [
    "....RRRR........RRRR....",
    "...RBBBRR......RRBBBR...",
    "..RTTTTTTR....RTTTTTTR..",
    "..RTTLLTTR....RTTLLTTR..",
    "..RTTTTTTR....RTTTTTTR..",
    "...TTTTTTBBBBBBTTTTTT...",
    "....SSBSSSEEEESSSBSS....",
    "....SSSSEWSSWESSSEEE....",
    "....SSSSEEEESSSESSS.....",
    ".....SSSSEEEESSSSS......",
    "......SSSPPPSSSSS.......",
    ".......SSSSSSSSS........",
    "......DDWWWBDDD.........",
    ".....DDDBBWTBDB.........",
    ".....BBDDWTWBDDB........",
    ".....BBBDDWTBDD.........",
    ".....B..BBWBB..B........",
    "....TT..BBYBB..TT.......",
    "....TT..BBBBB..TT.......",
    "....TT..BB.BB..TT.......",
    "....TT..BB.BB..TT.......",
    "....LL..TT.TT..LL.......",
    "....TT..TT.TT..TT.......",
    "........BB.BB...........",
  ],
  walk_1: [
    "....RRRR........RRRR....",
    "...RBBBRR......RRBBBR...",
    "..RTTTTTTR....RTTTTTTR..",
    "..RTTLLTTR....RTTLLTTR..",
    "..RTTTTTTR....RTTTTTTR..",
    "...TTTTTTBBBBBBTTTTTT...",
    "....SSBSSSEEEESSSBSS....",
    "....SSSSEWSSWESSSEEE....",
    "....SSSSEEEESSSESSS.....",
    ".....SSSSEEEESSSSS......",
    "......SSSPPPSSSSS.......",
    ".......SSSSSSSSS........",
    "......DDWWWBDDD.........",
    ".....DDDBBWTBDB.........",
    ".....BBDDWTWBDDB........",
    ".....BBBDDWTBDD.........",
    ".....B..BBWBB..B........",
    "....TT..BBYBB..TT.......",
    "....TT..BB.BB..TT.......",
    "....TT..TT.BB..TT.......",
    "....TT.TT..BB..TT.......",
    "....LL.TT..TT..LL.......",
    "....TT.....TT..TT.......",
    "...........BB...........",
  ],
  walk_2: [
    "....RRRR........RRRR....",
    "...RBBBRR......RRBBBR...",
    "..RTTTTTTR....RTTTTTTR..",
    "..RTTLLTTR....RTTLLTTR..",
    "..RTTTTTTR....RTTTTTTR..",
    "...TTTTTTBBBBBBTTTTTT...",
    "....SSBSSSEEEESSSBSS....",
    "....SSSSEWSSWESSSEEE....",
    "....SSSSEEEESSSESSS.....",
    ".....SSSSEEEESSSSS......",
    "......SSSPPPSSSSS.......",
    ".......SSSSSSSSS........",
    "......DDWWWBDDD.........",
    ".....DDDBBWTBDB.........",
    ".....BBDDWTWBDDB........",
    ".....BBBDDWTBDD.........",
    ".....B..BBWBB..B........",
    "....TT..BBYBB..TT.......",
    "....TT..BB.BB..TT.......",
    "....TT..BB..TT.TT.......",
    "....TT..BB..TT.TT.......",
    "....LL..TT..TT.LL.......",
    "....TT..TT.....TT.......",
    "........BB..............",
  ],
  jump: [
    "....RRRR........RRRR....",
    "..RBTTTRR......RRTTRBR..",
    ".RTTTTTTTR....RTTTTTTTR.",
    ".RTTTLLTTR....RTTLLTTTR.",
    ".RTTTTTTR......RTTTTTTR.",
    "..TTTTTBBBBBBBBBBTTTT...",
    "....SSBSEEEEESSSBSS.....",
    "....SSSEWSSWESSSEEE.....",
    "....SSSEEEESSSESSS......",
    ".....SSEEEESSSSSSS......",
    "......SSSPPPSSSSS.......",
    ".......SSSSSSSSS........",
    "......DDWWWBDDD.........",
    ".....DDDBBWTBDB.........",
    ".....BBDDWTWBDDB........",
    ".....BBBDDWTBDD.........",
    "....TT..BBWBB..TT.......",
    "....TT.BBYBB..TT........",
    "....TT.BBBBB..TT........",
    ".......TT.TT............",
    "......TT...TT...........",
    "......LL...LL...........",
    "......TT...TT...........",
    "........................",
  ],
  dance_1: [
    "....RRRR........RRRR....",
    "...RBBBRR......RRBBBR...",
    "..RTTTTTTR....RTTTTTTR..",
    "..RTTLLTTR....RTTLLTTR..",
    "..RTTTTTTR....RTTTTTTR..",
    "...TTTTTTBBBBBBTTTTTT...",
    "....SSBSSSEEEESSSBSS....",
    "....SSSSEWSSWESSSEEE....",
    "....SSSSEEEESSSESSS.....",
    ".....SSSSEEEESSSSS......",
    "......SSSPPPSSSSS.......",
    ".......SSSSSSSSS........",
    "......BBDWWWBDD.........",
    ".....TTDBBWTBDB.........",
    ".....TTDDWTWBDDB........",
    ".....TTBDDWTBDD.........",
    ".....B..BBWBB..TT.......",
    "....T...BBYBB...T.......",
    "....T...BBBBB...T.......",
    "....T...BB.BB...T.......",
    "........BB.BB...........",
    "........TT.TT...........",
    "........TT.TT...........",
    "........BB.BB...........",
  ],
  dance_2: [
    "....RRRR........RRRR....",
    "...RBBBRR......RRBBBR...",
    "..RTTTTTTR....RTTTTTTR..",
    "..RTTLLTTR....RTTLLTTR..",
    "..RTTTTTTR....RTTTTTTR..",
    "...TTTTTTBBBBBBTTTTTT...",
    "....SSBSSSEEEESSSBSS....",
    "....SSSSEWSSWESSSEEE....",
    "....SSSSEEEESSSESSS.....",
    ".....SSSSEEEESSSSS......",
    "......SSSPPPSSSSS.......",
    ".......SSSSSSSSS........",
    ".......DDWWWBDDBB.......",
    ".....BDBBWTBDBBTT.......",
    ".....BBDDWTWBDDTT.......",
    "......BBDDWTBDDTT.......",
    ".....TT.BBWBB..B........",
    ".....T..BBYBB...T.......",
    ".....T..BBBBB...T.......",
    ".....T..BB.BB...T.......",
    "........BB.BB...........",
    "........TT.TT...........",
    "........TT.TT...........",
    "........BB.BB...........",
  ],
  victory: [
    "....RRRR........RRRR....",
    "...RBBBRR......RRBBBR...",
    "..RTTTTTTR....RTTTTTTR..",
    "..RTTLLTTR....RTTLLTTR..",
    "..RTTTTTTR....RTTTTTTR..",
    "...TTTTTTBBBBBBTTTTTT...",
    "....SSBSSSEEEESSSBSS....",
    "....SSSSPSSWPESSSEEE....",
    "....SSSSEEEEESSESSS.....",
    ".....SSSSEEEESSSSS......",
    "......SSSPPPSSSSS.......",
    ".......SSSSSSSSS........",
    "....BBDDDWWWBDD.........",
    "....BTTTDBWTBDB.........",
    "......BBDDWTWBDDB.......",
    "......BBBDDWTBDD........",
    ".....WWWBBWBB..B........",
    ".....W.WBBYBB..TT.......",
    ".....WWWBBBBB..TT.......",
    ".....W..BB.BB..TT.......",
    "........BB.BB..TT.......",
    "........TT.TT..LL.......",
    "........TT.TT..TT.......",
    "........BB.BB...........",
  ],
};

const COLOR_MAP: Record<string, string> = {
  T: "#39C5BB", // Miku Main Turquoise
  L: "#86F0E8", // Miku Highlight Turquoise
  D: "#E4E4E7", // Outfit Light Silver
  B: "#3F3F46", // Outfit Dark Slate (Sleeve, tie support, skirt)
  S: "#FFF1F2", // Safe Contrast Skin (Rose Peach skin tone)
  P: "#FB7185", // Cheek / Mouth Pink
  R: "#F43F5E", // Bright ribbon pink-red
  Y: "#F59E0B", // Accent gold yellow
  E: "#18181B", // Dark line outline / iris
  W: "#FFFFFF", // Crisp White highlights
};

export const MikuSprite: React.FC<MikuSpriteProps> = ({
  pose,
  className = "",
  width = 96,
  height = 96,
}) => {
  const grid = SPRITE_GRIDS[pose] || SPRITE_GRIDS.idle;

  return (
    <svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      className={`select-none ${className}`}
      style={{ imageRendering: "pixelated" }}
      id={`miku-sprite-svg-${pose}`}
    >
      <g>
        {grid.map((row, rIdx) => {
          return row.split("").map((char, cIdx) => {
            if (char === "." || !COLOR_MAP[char]) return null;
            return (
              <rect
                key={`${rIdx}-${cIdx}`}
                x={cIdx}
                y={rIdx}
                width={1}
                height={1}
                fill={COLOR_MAP[char]}
                stroke={COLOR_MAP[char]}
                strokeWidth={0.01}
              />
            );
          });
        })}
      </g>
    </svg>
  );
};
