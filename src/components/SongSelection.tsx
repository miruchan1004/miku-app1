import React, { useState } from "react";
import { Song } from "../types";
import { SONGS_DATA } from "../songsData";
import { ArrowLeft, Play, Music, Sparkles } from "lucide-react";
import { MikuSprite } from "./MikuSprite";

interface SongSelectionProps {
  onBackToTitle: () => void;
  onSelectSong: (song: Song) => void;
  isSynthMode: boolean;
}

export const SongSelection: React.FC<SongSelectionProps> = ({
  onBackToTitle,
  onSelectSong,
  isSynthMode,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const currentSong = SONGS_DATA[selectedIdx];

  // Map difficulty colors
  const getDiffColor = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "Normal":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "Hard":
      default:
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    }
  };

  return (
    <div
      className="relative min-h-screen py-10 px-4 md:px-8 text-white bg-zinc-950 flex flex-col justify-between overflow-hidden"
      id="song-selection-screen"
    >
      {/* Background Synthwave Effect */}
      <div 
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(57,197,187,0.12),rgba(9,9,11,1))]" 
        id="selection-background-pulse"
      />

      {/* Top Bar with Go Back action */}
      <div className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full mb-8" id="selection-topbar-wrapper">
        <button
          onClick={onBackToTitle}
          className="cursor-pointer flex items-center gap-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-750 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-mono"
          id="btn-back-to-title"
        >
          <ArrowLeft className="w-4 h-4 text-[#39C5BB]" />
          <span>ESC: BACK</span>
        </button>
        <div className="text-right">
          <span className="font-mono text-xs text-[#39C5BB] font-semibold bg-[#39C5BB]/10 px-3 py-1 rounded border border-[#39C5BB]/20">
            {isSynthMode ? "MODE: CHIPTUNE WEB AUDIO" : "MODE: TEXTALIVE SYNC"}
          </span>
        </div>
      </div>

      {/* Center Layout: split into Song list (Left) and Detailed Jacket card (Right) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 max-w-5xl mx-auto w-full items-stretch my-auto" id="selection-main-grid">
        
        {/* Left Column: List of Songs */}
        <div className="md:col-span-7 flex flex-col gap-4" id="selection-song-list">
          <div className="mb-2">
            <h2 className="text-2xl mt-1 font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400 flex items-center gap-2">
              <Music className="w-6 h-6 text-[#39C5BB]" />
              <span>選択可能楽曲リスト</span>
            </h2>
            <p className="text-xs font-mono text-zinc-400 mt-1">SELECT A MUSIC TRACK FOR MIKU'S JOURNEY</p>
          </div>

          <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
            {SONGS_DATA.map((song, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <button
                  key={song.id}
                  onClick={() => setSelectedIdx(idx)}
                  className={`cursor-pointer w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? "bg-[#39C5BB]/15 border-[#39C5BB] shadow-[0_0_15px_rgba(57,197,187,0.15)] scale-[1.01]"
                      : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850"
                  }`}
                  id={`btn-song-${song.id}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Retro vinyl disk / micro jacket placeholder */}
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg font-mono border-2 select-none relative overflow-hidden ${
                      isSelected ? "border-[#39C5BB] bg-zinc-950 text-[#39C5BB]" : "border-zinc-650 bg-zinc-900 text-zinc-400"
                    }`}>
                      {/* Rotating needle circle */}
                      <span className={`absolute w-10 h-10 rounded-full border border-dashed border-[#39C5BB]/20 ${isSelected ? "animate-spin duration-3000" : ""}`}></span>
                      🎵
                    </div>
                    <div>
                      <h3 className={`font-bold transition-colors ${isSelected ? "text-white" : "text-zinc-300"}`}>
                        {song.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">{song.artist}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 font-mono text-xs">
                    <span className={`px-2 py-0.5 rounded border ${getDiffColor(song.difficulty)}`}>
                      {song.difficulty}
                    </span>
                    <span className="text-zinc-500">BPM {song.bpm}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Song Jacket / Detail Inspection Panel */}
        <div className="md:col-span-5 flex" id="selection-inspection-panel">
          <div className="w-full flex flex-col justify-between p-6 rounded-2xl bg-zinc-900/40 border-2 border-zinc-800 shadow-xl backdrop-blur-md relative overflow-hidden">
            {/* Pixel scanlines overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>

            <div className="relative z-10">
              {/* Outer decorative square (Simulating cassette / vinyl box art) */}
              <div className="aspect-square w-full bg-zinc-950 rounded-xl mb-5 border-4 border-dashed border-zinc-800 relative flex flex-col items-center justify-center p-4">
                <div className="absolute top-2 left-2 text-[#39C5BB]/30 font-mono text-[9px]">MIKU SYNC</div>
                <div className="absolute top-2 right-2 text-rose-500/20 font-mono text-xs">100% SYNC</div>
                
                {/* Central character view */}
                <div className="bg-[#39C5BB]/5 p-4 rounded-full border border-[#39C5BB]/10">
                  <MikuSprite pose={selectedIdx % 2 === 0 ? "dance_1" : "dance_2"} width={110} height={110} />
                </div>

                <div className="mt-4 text-center">
                  <h3 className="font-bold text-zinc-100 tracking-tight text-lg max-w-[200px] truncate">{currentSong.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">Artist: {currentSong.artist}</p>
                </div>
              </div>

              {/* Stats Block */}
              <div className="space-y-3 font-mono text-xs text-zinc-300" id="selected-song-stats">
                <div className="flex justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-zinc-500">GENRE:</span>
                  <span className="text-[#39C5BB]">{currentSong.genre}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-zinc-500">TEMPO:</span>
                  <span>{currentSong.bpm} BPM</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-zinc-500">DIFFICULTY:</span>
                  <span className={`font-bold ${getDiffColor(currentSong.difficulty).split(" ")[0]}`}>
                    {currentSong.difficulty.toUpperCase()}
                  </span>
                </div>
                <div className="leading-relaxed text-zinc-400 text-[11px] mt-2 italic">
                  "{currentSong.description}"
                </div>
              </div>
            </div>

            {/* Launch Game Button */}
            <button
              onClick={() => onSelectSong(currentSong)}
              className="cursor-pointer relative z-10 w-full mt-6 py-4 bg-gradient-to-r from-[#39C5BB] to-teal-500 hover:from-[#39C5BB] hover:to-cyan-400 text-zinc-950 text-center rounded-xl font-bold font-sans tracking-wide shadow-[0_4px_15px_rgba(57,197,187,0.3)] hover:shadow-[0_4px_25px_rgba(57,197,187,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
              id="btn-depart-journey"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>旅に出る (DEPART JOURNEY)</span>
              <Sparkles className="w-4 h-4 animate-spin text-white delay-1000 duration-5000" />
            </button>
          </div>
        </div>

      </div>

      {/* Underbar Help Advice */}
      <div className="relative z-10 text-center text-zinc-500 font-mono text-xs mt-10 max-w-xl mx-auto border-t border-zinc-900/60 pt-4 space-y-2" id="selection-footer">
        <p>※ 曲を選択して［旅に出る］ボタンを押すと、歌詞連動のライブアドベンチャー画面へ進みます。</p>
        <div className="text-[10px] text-zinc-400">
          <p>本アプリは <a href="https://developer.textalive.jp/" target="_blank" rel="noopener noreferrer" className="text-[#39C5BB] hover:underline">TextAlive App API</a> を利用して開発されています。</p>
        </div>
      </div>
    </div>
  );
};
