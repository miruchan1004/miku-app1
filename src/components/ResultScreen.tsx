import React, { useState, useEffect } from "react";
import { GameScore } from "../types";
import { MikuSprite } from "./MikuSprite";
import { Award, Star, Heart, Volume2, Sparkles, Home, RotateCcw } from "lucide-react";

interface ResultScreenProps {
  scoreData: GameScore;
  onReturnToTitle: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  scoreData,
  onReturnToTitle,
}) => {
  const [stampAppeared, setStampAppeared] = useState(false);
  const [isWinking, setIsWinking] = useState(false);

  // Simple cute interval to sway Miku wink posture
  useEffect(() => {
    // delay clear stamp
    const timer = setTimeout(() => {
      setStampAppeared(true);
    }, 400);

    const blinkTimer = setInterval(() => {
      setIsWinking((prev) => !prev);
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearInterval(blinkTimer);
    };
  }, []);

  // Determine ranking letters
  const getRankLetter = (scoreValue: number) => {
    if (scoreValue >= 10000) return { rank: "SS", text: "ボーカルの神様!!", color: "text-amber-300 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" };
    if (scoreValue >= 6000) return { rank: "S", text: "奇跡のライブ大成功！", color: "text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.5)]" };
    if (scoreValue >= 3000) return { rank: "A", text: "素晴らしいステージ！", color: "text-cyan-400 drop-shadow-[0_0_10px_rgba(57,197,187,0.4)]" };
    if (scoreValue >= 1000) return { rank: "B", text: "ミクと一緒に完走！", color: "text-emerald-400" };
    return { rank: "C", text: "一歩ずつ旅を学ぼう！", color: "text-zinc-400" };
  };

  const rankInfo = getRankLetter(scoreData.score);

  return (
    <div
      className="relative min-h-screen py-10 px-4 md:px-8 text-white bg-zinc-950 flex flex-col justify-between overflow-hidden"
      id="result-screen-viewport"
    >
      {/* Background radial highlight */}
      <div 
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_30%,rgba(244,63,94,0.1),rgba(24,24,27,1))]" 
        id="result-background"
      />

      {/* Decorative Particle sparkles */}
      <div className="absolute top-16 left-1/4 animate-ping text-[#39C5BB]/20">
        <Sparkles size={40} />
      </div>
      <div className="absolute top-24 right-1/4 animate-bounce text-yellow-500/15">
        <Sparkles size={48} />
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto my-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center" id="result-main-layout">
        
        {/* Left Column: Chibi Miku Victory pose animations */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-zinc-900/40 rounded-3xl border-2 border-zinc-800 backdrop-blur-md relative overflow-hidden" id="result-miku-portrait-panel">
          <div className="absolute top-4 left-4 font-mono text-[9px] text-zinc-500">STAGE CLEAR</div>
          
          {/* Main victory sprite frame */}
          <div className="relative p-6 bg-zinc-950/80 rounded-2xl border border-zinc-800 shadow-inner flex items-center justify-center" id="result-sprite-card">
            {/* Soft pulsing halo behind */}
            <div className={`absolute w-36 h-36 rounded-full blur-2xl transition-colors duration-1000 ${stampAppeared ? "bg-[#39C5BB]/25" : "bg-rose-500/15"}`}></div>
            
            <MikuSprite pose="victory" width={140} height={140} />
          </div>

          <div className="text-center mt-5">
            <h2 className="text-[#39C5BB] font-mono text-sm tracking-wider font-extrabold px-3 py-1 bg-[#39C5BB]/10 rounded-full border border-[#39C5BB]/30">
              VICTORY STRIKE!
            </h2>
            <p className="text-xs text-zinc-400 mt-2 font-mono leading-relaxed">
              「また一緒に、音楽の旅へ出かけようね♪」
            </p>
          </div>
        </div>

        {/* Right Column: Score Breakdown and clearances */}
        <div className="md:col-span-7 flex flex-col gap-5 justify-center" id="result-statistics-panel">
          
          {/* Big CLEAR statement block */}
          <div className="relative" id="result-clear-title-wrapper">
            <span className="text-[11px] font-mono tracking-[0.4em] text-rose-500 font-bold block">MISSION FINISHED</span>
            <h1 className="text-5xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-[#39C5BB]" id="clear-glowing-h1">
              CLEAR!
            </h1>
            <div className="absolute -top-3 right-0 border-4 border-dashed border-rose-500 text-rose-500 rounded px-3 py-1 font-mono text-xs font-black rotate-12 scale-110 opacity-80 animate-pulse">
              GOOD STAGE!
            </div>
          </div>

          {/* Core Score Block Card */}
          <div className="bg-zinc-900/60 rounded-2xl p-6 border-2 border-zinc-800 shadow-xl" id="result-card-outer">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-4">
              <div>
                <span className="text-xs text-zinc-500 font-mono block">TOTAL SCORE</span>
                <span className="text-4xl font-mono font-black text-amber-300 tracking-wider">
                  {scoreData.score.toString().padStart(6, "0")}
                </span>
              </div>
              <div className="text-center bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-1.5 min-w-[120px] justify-center">
                <span className="text-xs text-zinc-500 font-mono">RANK</span>
                <span className={`text-3xl font-black font-mono ${rankInfo.color}`}>
                  {rankInfo.rank}
                </span>
              </div>
            </div>

            {/* Performance message */}
            <div className="mb-5 font-mono text-xs text-zinc-300 bg-[#39C5BB]/10 border border-[#39C5BB]/10 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-[#39C5BB] flex-shrink-0" />
              <span>評価: <strong className="text-white">{rankInfo.text}</strong> 君のタップリズムは完璧だ！</span>
            </div>

            {/* Numeric Item collection Breakdown */}
            <h3 className="font-mono text-xs text-zinc-500 tracking-wider mb-2 uppercase">COLLECTED ITEMS BREAKDOWN:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs" id="result-collection-breakdown">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
                <span className="text-amber-300">🌟 星</span>
                <span className="font-bold text-white text-sm">{scoreData.itemsCollected.star}個</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
                <span className="text-rose-300 font-medium">🌸 桜</span>
                <span className="font-bold text-white text-sm">{scoreData.itemsCollected.flower}個</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
                <span className="text-cyan-300 font-medium">💎 宝石</span>
                <span className="font-bold text-white text-sm">{scoreData.itemsCollected.gem}個</span>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
                <span className="text-emerald-400">🎈 歌</span>
                <span className="font-bold text-white text-sm">{scoreData.itemsCollected.lyric}個</span>
              </div>
            </div>

            {/* High-streak combo statistics */}
            <div className="mt-5 border-t border-zinc-800 pt-4 flex justify-between items-center text-xs font-mono" id="results-combos-display">
              <span className="text-zinc-500">MAX STREAK COMBO:</span>
              <span className="text-white bg-zinc-950 border border-zinc-805 px-3 py-1 rounded font-bold text-sm">
                🔥 {scoreData.maxCombo} CONBOS
              </span>
            </div>
          </div>

          {/* Action Route Return Button */}
          <button
            onClick={onReturnToTitle}
            className="cursor-pointer py-4 bg-[#39C5BB] hover:bg-teal-400 text-zinc-950 text-center rounded-xl font-bold font-sans tracking-wide shadow-[0_4px_15px_rgba(57,197,187,0.3)] hover:shadow-[0_4px_25px_rgba(57,197,187,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 mt-2"
            id="btn-return-home"
          >
            <Home className="w-5 h-5 fill-current" />
            <span>タイトルへ戻る (RETURN TO TITLE)</span>
          </button>

        </div>

      </div>

      {/* Retro scanlines footer decoration */}
      <footer className="relative z-10 text-center font-mono text-[10px] text-zinc-500 py-4 border-t border-zinc-900 bg-zinc-950 space-y-1" id="result-under-footer">
        <p className="text-zinc-400">本アプリは <a href="https://developer.textalive.jp/" target="_blank" rel="noopener noreferrer" className="text-[#39C5BB] hover:underline">TextAlive App API</a> を利用して開発されています。</p>
        <p className="text-[9px] opacity-50">ミクのピクセル・ミュージック・ジャーニー — CONGRATULATIONS ON FINISHING YOUR TRIP!</p>
      </footer>
    </div>
  );
};
