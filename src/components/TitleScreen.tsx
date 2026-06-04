import React, { useState, useEffect } from "react";
import { MikuSprite } from "./MikuSprite";
import { Sparkles, Music, CirclePlay } from "lucide-react";

interface TitleScreenProps {
  onStartGame: (isSynthMode: boolean) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame }) => {
  const [blink, setBlink] = useState(true);
  const [mikuPose, setMikuPose] = useState<"idle" | "dance_1" | "dance_2">("idle");

  // Retro flashing "PRESS START" button
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 650);

    // Cute dance animation for Miku on the title screen
    const danceInterval = setInterval(() => {
      setMikuPose((prev) => {
        if (prev === "idle") return "dance_1";
        if (prev === "dance_1") return "dance_2";
        return "idle";
      });
    }, 1000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(danceInterval);
    };
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-between min-h-screen py-10 px-4 text-white overflow-hidden bg-zinc-950 font-sans"
      id="title-screen-container"
    >
      {/* Laser Synthwave Grid in background */}
      <div 
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(57,197,187,0.18),rgba(24,24,27,1))]" 
        id="title-grid-radial"
      />
      <div
        className="absolute inset-x-0 bottom-0 top-1/2 opacity-25 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(#39C5BB 1px, transparent 1px),
            linear-gradient(90deg, #39C5BB 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          transform: "perspective(300px) rotateX(60deg)",
          transformOrigin: "top center",
        }}
        id="title-grid-lines"
      />

      {/* Floating Retro Stars */}
      <div className="absolute top-10 left-10 animate-bounce text-[#39C5BB]/40">
        <Sparkles size={32} />
      </div>
      <div className="absolute top-32 right-12 animate-pulse text-rose-500/30">
        <Sparkles size={24} />
      </div>
      <div className="absolute bottom-24 left-16 animate-pulse text-[#39C5BB]/30">
        <Music size={28} />
      </div>

      {/* Top Banner / Credit */}
      <div className="relative z-10 text-center" id="title-header-wrapper">
        <p className="font-mono text-xs text-[#39C5BB] tracking-[0.3em] uppercase bg-[#39C5BB]/10 px-4 py-1.5 rounded-full border border-[#39C5BB]/30 backdrop-blur-md">
          Magical Mirai Programming Contest App
        </p>
      </div>

      {/* Main Title Block */}
      <div className="relative z-10 flex flex-col items-center my-auto text-center" id="title-main-block">
        {/* Adorable Pixel Title Logo */}
        <div className="mb-2 text-rose-500 font-mono tracking-widest text-xs font-bold flex items-center gap-1.5 justify-center bg-rose-500/10 px-3 py-1 rounded">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          PIXEL MUSIC GAME
        </div>
        
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400 select-none pb-2"
          id="title-retro-h1"
          style={{ textShadow: "0 4px 12px rgba(57,197,187,0.3)" }}
        >
          ミクのピクセル・
          <br className="sm:hidden" />
          ミュージック・ジャーニー
        </h1>
        <p className="text-zinc-400 font-mono text-sm tracking-wide mt-2">
          Miku's Pixel Music Journey — 歌詞連動アドベンチャー
        </p>

        {/* Big Animated Hatsune Miku Character */}
        <div className="relative my-8 flex items-center justify-center" id="title-miku-sprite-wrapper">
          {/* Neon back glow circles */}
          <div className="absolute w-36 h-36 bg-[#39C5BB]/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute w-24 h-24 bg-rose-500/15 rounded-full blur-xl delay-75"></div>
          
          <div className="border-4 border-[#39C5BB] bg-zinc-900/95 p-6 rounded-2xl shadow-[0_0_25px_rgba(57,197,187,0.25)] flex items-center justify-center transform hover:scale-105 transition-all duration-300">
            <MikuSprite pose={mikuPose} width={140} height={140} />
          </div>
          <div className="absolute -bottom-3 text-zinc-500 font-mono text-[10px] bg-zinc-900 border border-zinc-700 px-2.5 py-0.5 rounded-full">
            MODEL: chibiku-v1
          </div>
        </div>

        {/* Start Button Layout */}
        <div className="flex flex-col gap-4 mt-4 w-full max-w-sm" id="title-mode-selection">
          {/* Main Option: TextAlive Iframe Sync */}
          <button
            onClick={() => onStartGame(false)}
            className="group relative cursor-pointer px-6 py-4 border-2 border-[#39C5BB] bg-[#39C5BB]/10 text-white rounded-xl shadow-[0_0_15px_rgba(57,197,187,0.2)] hover:shadow-[0_0_25px_rgba(57,197,187,0.5)] hover:bg-[#39C5BB] hover:text-black transition-all duration-300 flex items-center justify-between"
            id="btn-play-textalive"
          >
            <div className="flex items-center gap-3 text-left">
              <CirclePlay className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <div>
                <span className="block font-bold text-base tracking-wide">
                  TextAlive 同期モード
                </span>
                <span className="block text-[11px] opacity-75 font-mono">
                  楽曲の歌声と歌詞をネット同期
                </span>
              </div>
            </div>
            <span className="font-mono text-sm font-bold bg-zinc-900 text-[#39C5BB] group-hover:bg-black group-hover:text-white px-2 py-1 rounded">
              START
            </span>
          </button>

          {/* Fallback Option: Chiptune Synth */}
          <button
            onClick={() => onStartGame(true)}
            className="group cursor-pointer px-6 py-3 border border-zinc-700 bg-zinc-900/80 text-zinc-300 hover:text-[#39C5BB] hover:border-[#39C5BB] hover:bg-zinc-850 rounded-xl transition-all duration-200 flex items-center justify-between"
            id="btn-play-chiptune"
          >
            <div className="flex items-center gap-3 text-left">
              <Music className="w-5 h-5 text-[#39C5BB]/85 group-hover:animate-pulse" />
              <div>
                <span className="block font-medium text-xs">
                  レトロ音源 / オフライン演奏
                </span>
                <span className="block text-[10px] text-zinc-500 font-mono">
                  Web Audioの8Bit音源による模擬ロード
                </span>
              </div>
            </div>
            <span className="font-mono text-xs border border-zinc-650 text-zinc-400 group-hover:text-[#39C5BB] group-hover:border-[#39C5BB]/40 px-2 py-0.5 rounded">
              SOLO
            </span>
          </button>
        </div>
      </div>

      {/* Footer Details */}
      <div className="relative z-10 text-center text-xs text-zinc-500 font-mono mt-8" id="title-game-footer">
        <p className="animate-pulse duration-1000 text-zinc-400">
          {blink ? "▼ SELECT MODE TO LAUNCH JOURNEY" : "  SELECT MODE TO LAUNCH JOURNEY  "}
        </p>
        <div className="mt-4 text-[10px] bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80 max-w-md mx-auto leading-relaxed text-zinc-400">
          <p>本アプリは <a href="https://developer.textalive.jp/" target="_blank" rel="noopener noreferrer" className="text-[#39C5BB] hover:underline">TextAlive App API</a> を利用して開発されています。</p>
          <p className="mt-1 opacity-50">© Hatsune Miku Pixel Journey / TextAlive App API Integration</p>
        </div>
      </div>
    </div>
  );
};
