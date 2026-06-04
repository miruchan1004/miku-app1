import { Song } from "./types";

export const SONGS_DATA: Song[] = [
  {
    id: "kotaete",
    title: "こたえて",
    artist: "imie",
    url: "https://piapro.jp/t/6W2N/20251215164617",
    genre: "Acoustic Pop",
    difficulty: "Normal",
    bpm: 120,
    description: "情緒あるメロディと切ない言葉が心に染み渡る、imie氏のセンチメンタルで透明感あふれる一曲。",
    video: {
      beatId: 4827293,
      chordId: 2963754,
      repetitiveSegmentId: 3086261,
      lyricId: 126519,
      lyricDiffId: 28645
    },
    bgmNotes: [
      { freq: 261.63, duration: 250, time: 0 },    // C4
      { freq: 293.66, duration: 250, time: 300 },  // D4
      { freq: 329.63, duration: 500, time: 600 },  // E4
      { freq: 349.23, duration: 500, time: 1200 }, // F4
      { freq: 392.00, duration: 1000, time: 1800 }, // G4
      { freq: 349.23, duration: 250, time: 3000 }, // F4
      { freq: 329.63, duration: 250, time: 3300 }, // E4
      { freq: 293.66, duration: 500, time: 3600 }, // D4
      { freq: 261.63, duration: 1000, time: 4200 }, // C4
    ]
  },
  {
    id: "after_curtain",
    title: "アフター・ザ・カーテン",
    artist: "Rulmry",
    url: "https://piapro.jp/t/zoqO/20251214200738",
    genre: "Theatrical Waltz",
    difficulty: "Easy",
    bpm: 115,
    description: "静かな劇場を思わせる、Rulmry氏が紡ぐシアトリカルでどこか神秘的、そしてドラマチックなナンバー。",
    video: {
      beatId: 4827294,
      chordId: 2963755,
      repetitiveSegmentId: 3086262,
      lyricId: 126591,
      lyricDiffId: 28627
    },
    bgmNotes: [
      { freq: 329.63, duration: 300, time: 0 },    // E4
      { freq: 293.66, duration: 300, time: 400 },  // D4
      { freq: 261.63, duration: 600, time: 800 },  // C4
      { freq: 293.66, duration: 300, time: 1600 }, // D4
      { freq: 329.63, duration: 300, time: 2000 }, // E4
      { freq: 392.00, duration: 600, time: 2400 }, // G4
      { freq: 440.00, duration: 1200, time: 3200 }, // A4
    ]
  },
  {
    id: "shutter_chance",
    title: "シャッターチャンス",
    artist: "夜未アガリ",
    url: "https://piapro.jp/t/PNpQ/20251209170719",
    genre: "Alternative Rock",
    difficulty: "Normal",
    bpm: 130,
    description: "ノスタルジックでエモーショナルな瞬間を切り取った、夜未アガリ氏による爽快感弾けるロック調ソング。",
    video: {
      beatId: 4827295,
      chordId: 2963756,
      repetitiveSegmentId: 3086263,
      lyricId: 126542,
      lyricDiffId: 28628
    },
    bgmNotes: [
      { freq: 440.00, duration: 200, time: 0 },    // A4
      { freq: 440.00, duration: 200, time: 250 },  // A4
      { freq: 493.88, duration: 200, time: 500 },  // B4
      { freq: 523.25, duration: 400, time: 750 },  // C5
      { freq: 493.88, duration: 400, time: 1200 }, // B4
      { freq: 440.00, duration: 200, time: 1700 }, // A4
      { freq: 392.00, duration: 800, time: 2000 }, // G4
    ]
  },
  {
    id: "sekai_saigo",
    title: "世界最後の音楽隊",
    artist: "夏山よつぎ×ど～ぱみん",
    url: "https://piapro.jp/t/B3yJ/20251215061727",
    genre: "Folk Rock March",
    difficulty: "Hard",
    bpm: 165,
    description: "圧倒的疾走感と楽しげなマーチングサウンドが極上！夏山よつぎ×ど～ぱみんが放つ、感動的なシンフォニー。",
    video: {
      beatId: 4827296,
      chordId: 2963757,
      repetitiveSegmentId: 3086264,
      lyricId: 126594,
      lyricDiffId: 28629
    },
    bgmNotes: [
      { freq: 261.63, duration: 150, time: 0 },    // C4
      { freq: 293.66, duration: 150, time: 200 },  // D4
      { freq: 329.63, duration: 150, time: 400 },  // E4
      { freq: 349.23, duration: 150, time: 600 },  // F4
      { freq: 392.00, duration: 300, time: 800 },  // G4
      { freq: 440.00, duration: 300, time: 1200 }, // A4
      { freq: 493.88, duration: 300, time: 1600 }, // B4
      { freq: 523.25, duration: 600, time: 2000 }, // C5
    ]
  },
  {
    id: "toritsukuroji",
    title: "トリツクロジー",
    artist: "鶴三",
    url: "https://piapro.jp/t/QBdL/20251215094303",
    genre: "Swing Jazz Pop",
    difficulty: "Hard",
    bpm: 145,
    description: "トリッキーなリズムとジャジーな展開に引き込まれる、鶴三氏による遊び心溢れる極上のスウィング・ダンス曲。",
    video: {
      beatId: 4827297,
      chordId: 2963758,
      repetitiveSegmentId: 3086265,
      lyricId: 126593,
      lyricDiffId: 28630
    },
    bgmNotes: [
      { freq: 293.66, duration: 180, time: 0 },    // D4
      { freq: 349.23, duration: 180, time: 200 },  // F4
      { freq: 392.00, duration: 360, time: 400 },  // G4
      { freq: 440.00, duration: 180, time: 900 },  // A4
      { freq: 523.25, duration: 180, time: 1100 }, // C5
      { freq: 587.33, duration: 540, time: 1300 }, // D5
    ]
  },
  {
    id: "takeover",
    title: "TAKEOVER",
    artist: "Twinfield",
    url: "https://piapro.jp/t/E2i3/20251215092113",
    genre: "Future Bass",
    difficulty: "Hard",
    bpm: 150,
    description: "エッジの効いた最先端のFuture Bassサウンドと、未来を切り開く疾走シンセサイザーの高揚感を体感せよ！",
    video: {
      beatId: 4827298,
      chordId: 2963759,
      repetitiveSegmentId: 3086266,
      lyricId: 126533,
      lyricDiffId: 28631
    },
    bgmNotes: [
      { freq: 440.00, duration: 120, time: 0 },    // A4
      { freq: 493.88, duration: 120, time: 150 },  // B4
      { freq: 523.25, duration: 240, time: 300 },  // C5
      { freq: 587.33, duration: 240, time: 600 },  // D5
      { freq: 659.25, duration: 480, time: 900 },  // E5
      { freq: 587.33, duration: 120, time: 1500 }, // D5
      { freq: 659.25, duration: 120, time: 1650 }, // E5
      { freq: 783.99, duration: 600, time: 1800 }, // G5
    ]
  }
];

export const SIMULATED_LYRICS: Record<string, { time: number; text: string }[]> = {
  kotaete: [
    { time: 500, text: "そっと応えて" },
    { time: 1500, text: "小さな声でもいい" },
    { time: 2800, text: "耳を澄ませば" },
    { time: 4000, text: "星の砂が" },
    { time: 5200, text: "きらきらと光る" },
    { time: 6500, text: "言葉の桜が" },
    { time: 7800, text: "舞う森を抜けて" },
    { time: 9000, text: "どこまでもいける" },
    { time: 10500, text: "きみの隣で" },
    { time: 12000, text: "サビに入るよ！" },
    { time: 13500, text: "ねえ、こたえて" },
    { time: 15500, text: "響くメロディライン" },
    { time: 17500, text: "宇宙の果てへ" },
    { time: 19500, text: "届くように歌うから" },
    { time: 21500, text: "ずっと忘れないでね" },
    { time: 23500, text: "きらめく思い出" }
  ],
  after_curtain: [
    { time: 400, text: "カーテンの向こう" },
    { time: 1400, text: "静かな劇場" },
    { time: 2600, text: "光を浴びながら" },
    { time: 3800, text: "始まりを待つ" },
    { time: 5000, text: "桜の花びら舞い" },
    { time: 6200, text: "宝石の一粒が" },
    { time: 7400, text: "きらりと瞬き" },
    { time: 8600, text: "未来を誘う" },
    { time: 10000, text: "サビの幕が開く！" },
    { time: 11500, text: "アフター・ザ・カーテン" },
    { time: 13500, text: "夢からさめても" },
    { time: 15500, text: "響き続ける" },
    { time: 17500, text: "私たちのステージ" },
    { time: 19500, text: "喝采をきみに" },
    { time: 21500, text: "ずっと響くよ" }
  ],
  shutter_chance: [
    { time: 300, text: "シャッターチャンス" },
    { time: 1200, text: "切り取る一瞬" },
    { time: 2400, text: "宝石みたいな日の" },
    { time: 3600, text: "最高のスマイル" },
    { time: 4800, text: "星空を駆けるよ" },
    { time: 6000, text: "さくらの風が吹く" },
    { time: 7200, text: "君だけのステップ" },
    { time: 8400, text: "見逃さないでね" },
    { time: 9800, text: "サビ・シャッターチャンス！" },
    { time: 11000, text: "今、最高に輝いて！" },
    { time: 13000, text: "時間を止めたくて" },
    { time: 15000, text: "歌い続けるメロディ" },
    { time: 17000, text: "未来まで写しだす" },
    { time: 19000, text: "笑顔のままでいてね" }
  ],
  sekai_saigo: [
    { time: 300, text: "世界最後の" },
    { time: 1000, text: "音楽隊が往く" },
    { time: 2000, text: "星々のリズムで" },
    { time: 3000, text: "ステップ軽やかに" },
    { time: 4000, text: "さくらの絨毯の上" },
    { time: 5000, text: "宝石を散りばめて" },
    { time: 6000, text: "ドラムが鳴れば" },
    { time: 7000, text: "ジャーニーのはじまり" },
    { time: 8500, text: "サビ・大行進！" },
    { time: 10000, text: "奏でろ！音楽のすべて" },
    { time: 12000, text: "響け！世界の隅々まで" },
    { time: 14000, text: "私たちはまだ旅の途中" },
    { time: 16000, text: "最後のシンフォニーを" },
    { time: 18000, text: "高らかに歌おう" }
  ],
  toritsukuroji: [
    { time: 300, text: "トリツクロジー" },
    { time: 1100, text: "着飾る言葉" },
    { time: 2100, text: "星空をまとって" },
    { time: 3100, text: "スウィングしよう" },
    { time: 4100, text: "さくら色に染まる" },
    { time: 5100, text: "宝石のパズルゲーム" },
    { time: 6100, text: "リズムに乗って" },
    { time: 7200, text: "ステップ＆タップ" },
    { time: 8500, text: "サビ・トリツクロジータイム！" },
    { time: 10000, text: "仮面の裏の真実を" },
    { time: 12000, text: "メロディが暴き出す" },
    { time: 14000, text: "スウィング・ミュージック" },
    { time: 16000, text: "踊り明かそうよ" },
    { time: 18000, text: "果てしないこのジャーニー" }
  ],
  takeover: [
    { time: 305, text: "TAKEOVER" },
    { time: 1000, text: "ビートが満ちる" },
    { time: 1900, text: "電子の星屑を" },
    { time: 2800, text: "飛び越えるように" },
    { time: 3700, text: "満開のサクラ" },
    { time: 4600, text: "ネオンの宝石が" },
    { time: 5500, text: "加速するビート" },
    { time: 6500, text: "フューチャー・サウンド" },
    { time: 8000, text: "サビ・TAKEOVER！" },
    { time: 9500, text: "すべてを圧倒する" },
    { time: 11500, text: "このシンセの渦へ" },
    { time: 13505, text: "未来の音楽が今" },
    { time: 15500, text: "君の心を奪うよ" },
    { time: 17500, text: "加速してジャーニーへ" }
  ]
};
