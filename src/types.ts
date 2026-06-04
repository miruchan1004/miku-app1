export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  genre: string;
  difficulty: "Easy" | "Normal" | "Hard";
  bpm: number;
  description: string;
  bgmNotes?: { freq: number; duration: number; time: number }[]; // fallback melody notes
  video?: {
    beatId?: number;
    chordId?: number;
    repetitiveSegmentId?: number;
    lyricId?: number;
    lyricDiffId?: number;
  };
}

export interface LyricItem {
  time: number; // millisecond position
  text: string;
  type: "char" | "word" | "phrase";
}

export interface SpawnItem {
  id: string;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  char: string;
  type: "star" | "flower" | "gem" | "lyric";
  points: number;
  createdAt: number;
  duration: number; // lifespan in ms
  scale: number;
}

export interface GameScore {
  score: number;
  combo: number;
  maxCombo: number;
  itemsCollected: {
    star: number;
    flower: number;
    gem: number;
    lyric: number;
  };
}

export interface PlayerStatus {
  isPlaying: boolean;
  progress: number; // percentage
  currentTime: number; // milliseconds
  duration: number; // milliseconds
  activeLyric: string;
  nextLyric: string;
  isChorus: boolean;
  beatTime: number; // multiplier
}
