import React, { useState, useEffect, useRef } from "react";
import { Player } from "textalive-app-api";
import { Song, SpawnItem, GameScore, PlayerStatus } from "../types";
import { SIMULATED_LYRICS } from "../songsData";
import { MikuSprite } from "./MikuSprite";
import { Play, Pause, RotateCcw, Volume2, Award, Zap, Heart, AlertCircle, Home } from "lucide-react";

interface GameStageProps {
  song: Song;
  isSynthMode: boolean;
  onFinishGame: (score: GameScore) => void;
  onExitToTitle: () => void;
}

export const GameStage: React.FC<GameStageProps> = ({
  song,
  isSynthMode,
  onFinishGame,
  onExitToTitle,
}) => {
  // Game state
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // in ms
  const [duration, setDuration] = useState(30000); // default 30s or loaded from player
  
  // Scoring
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [collectedCounts, setCollectedCounts] = useState({
    star: 0,
    flower: 0,
    gem: 0,
    lyric: 0,
  });

  // Lyrics synced tags
  const [activePhraseText, setActivePhraseText] = useState("");
  const [nextPhraseText, setNextPhraseText] = useState("");
  const [isChorusActive, setIsChorusActive] = useState(false);
  
  // Game play screen visual assets
  const [spawnedItems, setSpawnedItems] = useState<SpawnItem[]>([]);
  const [sceneryOffset, setSceneryOffset] = useState(0);
  const [mikuPose, setMikuPose] = useState<"idle" | "walk_1" | "walk_2" | "jump" | "dance_1" | "dance_2">("idle");
  const [beatPulse, setBeatPulse] = useState(false);

  // References
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const rAFRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const notesScheduledRef = useRef<Record<number, boolean>>({});

  // Ensure refs stay in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Handle Score combo helper updates
  const incrementScore = (type: "star" | "flower" | "gem" | "lyric", points: number) => {
    setScore((prev) => prev + points + Math.floor(combo * 1.5));
    setCombo((prev) => {
      const next = prev + 1;
      if (next > maxCombo) setMaxCombo(next);
      return next;
    });
    setCollectedCounts((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  const registerMiss = () => {
    setCombo(0);
  };

  // Web Audio retro synthesizer for Chiptune Mode / fallback
  const playRetroBgmNote = (freq: number, lengthMs: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Create primary 8-bit pulse oscillator
      const osc = ctx.createOscillator();
      // Retro chiptune feel uses "square wave"
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Create envelope filter
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      // decay tail
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + lengthMs / 1000);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + lengthMs / 1000);
    } catch (e) {
      console.warn("Web Audio failure:", e);
    }
  };

  // Spawn retro target items dynamically based on lyrics keywords
  const spawnTargetItem = (lyricWord: string) => {
    let type: "star" | "flower" | "gem" | "lyric" = "lyric";
    let points = 100;
    let textChar = lyricWord.substring(0, 4);

    // Identify keyword targets
    if (lyricWord.includes("星") || lyricWord.includes("空") || lyricWord.includes("きら")) {
      type = "star";
      points = 150;
      textChar = "🌟";
    } else if (lyricWord.includes("さくら") || lyricWord.includes("桜") || lyricWord.includes("花") || lyricWord.includes("舞い")) {
      type = "flower";
      points = 180;
      textChar = "🌸";
    } else if (lyricWord.includes("宝石") || lyricWord.includes("光") || lyricWord.includes("瞳") || lyricWord.includes("輝")) {
      type = "gem";
      points = 220;
      textChar = "💎";
    }

    // Position coordinates
    const randomX = 15 + Math.random() * 70; // 15% to 85% layout safety margin
    const randomY = 20 + Math.random() * 45; // 20% to 65% height span

    const newItem: SpawnItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      x: randomX,
      y: randomY,
      char: textChar,
      type,
      points,
      createdAt: Date.now(),
      duration: isChorusActive ? 5500 : 4000, // shorter in chorus for speed speed
      scale: 1,
    };

    setSpawnedItems((prev) => [...prev, newItem]);
  };

  // Main ticker animation loops
  useEffect(() => {
    let lastTime = Date.now();
    
    const tick = () => {
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;

      // Update scenery scrolling
      if (isPlayingRef.current) {
        setSceneryOffset((prev) => (prev + (isChorusActive ? 0.38 : 0.18) * delta) % 1000);
        
        // Dynamic Miku animation state updates
        setMikuPose((prev) => {
          const mikuTick = Math.floor(now / 150) % 4;
          if (isChorusActive) {
            // High speed dance and skips during chorus
            return mikuTick % 2 === 0 ? "dance_1" : "dance_2";
          } else {
            // Standard walking gait
            if (mikuTick === 0) return "walk_1";
            if (mikuTick === 1) return "idle";
            if (mikuTick === 2) return "walk_2";
            return "idle";
          }
        });
      }

      rAFRef.current = requestAnimationFrame(tick);
    };

    rAFRef.current = requestAnimationFrame(tick);
    return () => {
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, [isChorusActive]);

  // Cleanup completed / missed targets automatically
  useEffect(() => {
    const itemCleanupInterval = setInterval(() => {
      const rightNow = Date.now();
      setSpawnedItems((prev) => {
        let missedCount = 0;
        const valid = prev.filter((item) => {
          const elapsed = rightNow - item.createdAt;
          const keep = elapsed < item.duration;
          if (!keep) {
            missedCount++;
          }
          return keep;
        });

        if (missedCount > 0) {
          registerMiss();
        }
        return valid;
      });
    }, 500);

    return () => clearInterval(itemCleanupInterval);
  }, []);

  // SYNTH MODE: Handle synthesized sounds and synced state
  useEffect(() => {
    if (!isSynthMode) return;

    setLoading(false);
    let playbackInterval: NodeJS.Timeout | null = null;
    let localTime = 0;
    const intervalMs = 100;

    let lyricsPool = [...(SIMULATED_LYRICS[song.id] || [])];
    const originalNotes = song.bgmNotes || [];

    if (isPlaying) {
      playbackInterval = setInterval(() => {
        localTime += intervalMs;
        setCurrentTime(localTime);

        // Simulated beat pulse periodically (based on BPM, e.g. bpm 140 -> ~428ms beat rate)
        const beatRate = Math.floor(60000 / song.bpm);
        if (Math.floor(localTime / beatRate) !== Math.floor((localTime - intervalMs) / beatRate)) {
          setBeatPulse(true);
          setTimeout(() => setBeatPulse(false), 150);
        }

        // Trigger notes synthesis matching scheduler
        originalNotes.forEach((note) => {
          if (localTime >= note.time && !notesScheduledRef.current[note.time]) {
            notesScheduledRef.current[note.time] = true;
            playRetroBgmNote(note.freq, note.duration);
          }
        });

        // Search lyrics
        const matched = lyricsPool.filter((l) => localTime >= l.time && localTime < l.time + 1000);
        if (matched.length > 0) {
          const word = matched[0];
          setActivePhraseText(word.text);
          // Lookahead for next lyric
          const nextIndex = lyricsPool.findIndex((l) => l.time === word.time) + 1;
          if (nextIndex < lyricsPool.length) {
            setNextPhraseText(lyricsPool[nextIndex].text);
          } else {
            setNextPhraseText("");
          }

          // Decide chorus transition
          if (word.text.includes("サビ")) {
            setIsChorusActive(true);
          }

          // Trigger targets spawning matching melody
          spawnTargetItem(word.text);

          lyricsPool = lyricsPool.filter((l) => l.time > localTime);
        }

        // Auto trigger finish when mock timer expires
        if (localTime >= duration) {
          handleGameFinished();
        }
      }, intervalMs);
    }

    return () => {
      if (playbackInterval) clearInterval(playbackInterval);
    };
  }, [isPlaying, isSynthMode, song]);

  // ONLINE MODE: TextAlive API Sync Implementation
  useEffect(() => {
    if (isSynthMode) return;

    setLoading(true);
    setErrorMsg(null);

    let activePlayer: any = null;

    try {
      activePlayer = new Player({
        app: {
          token: "AqHTv4foPWytoc5g",
        } as any,
        // Container element to inject the TextAlive customized streaming frame / YouTube video
        mediaElement: document.getElementById("textalive-media-box") || undefined,
      } as any);

      playerRef.current = activePlayer;

      activePlayer.addListener({
        onAppReady(app: any) {
          if (!app.managed) {
            activePlayer.createFromSongUrl(song.url, song.video ? { video: song.video } : undefined);
          }
        },
        onVideoReady(video: any) {
          setLoading(false);
          setDuration(activePlayer.video.duration);
        },
        onTimerReady() {
          // Player is ready to execute play loops
        },
        onPlay() {
          setIsPlaying(true);
        },
        onPause() {
          setIsPlaying(false);
        },
        onTimeUpdate(pos: number) {
          setCurrentTime(pos);

          // Real-time synchronization of active segments
          const phrase = activePlayer.video.findPhrase(pos);
          if (phrase) {
            setActivePhraseText(phrase.text);
            const nextPhrase = phrase.next;
            if (nextPhrase) {
              setNextPhraseText(nextPhrase.text);
            }
          }

          // Detect active chorus (sabi Section)
          const section = activePlayer.findSection(pos);
          if (section) {
            setIsChorusActive(!!section.chorus);
          }

          // Detect character changes to drop game tokens dynamically
          const word = activePlayer.video.findWord(pos);
          if (word && word.startTime && pos >= word.startTime && pos < word.startTime + 150) {
            // Prevent spamming matching duplicates
            if (!notesScheduledRef.current[word.startTime]) {
              notesScheduledRef.current[word.startTime] = true;
              spawnTargetItem(word.text);
            }
          }
        },
        onBeat(beat: any) {
          setBeatPulse(true);
          setTimeout(() => setBeatPulse(false), 150);
        }
      });
    } catch (e: any) {
      console.error("TextAlive init error:", e);
      setErrorMsg("TextAlive APIの初期化に失敗しました。オフラインシンセモードをお試しください。");
      setLoading(false);
    }

    return () => {
      if (activePlayer) {
        try {
          activePlayer.dispose();
        } catch (e) {
          console.warn("Disposal warn:", e);
        }
      }
    };
  }, [song, isSynthMode]);

  // Audio Play controls toggling
  const handleTogglePlay = () => {
    // Unlock Audio Context as user-intent click
    if (isSynthMode) {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
      } catch (e) {}
      setIsPlaying(!isPlaying);
    } else {
      if (playerRef.current) {
        if (isPlaying) {
          playerRef.current.requestPause();
        } else {
          playerRef.current.requestPlay();
        }
      }
    }
  };

  const handleRestart = () => {
    setScore(0);
    setCombo(0);
    setSpawnedItems([]);
    setCollectedCounts({ star: 0, flower: 0, gem: 0, lyric: 0 });
    notesScheduledRef.current = {};
    setCurrentTime(0);

    if (isSynthMode) {
      setIsPlaying(true);
    } else {
      if (playerRef.current) {
        playerRef.current.requestPlay();
      }
    }
  };

  const handleGameFinished = () => {
    if (playerRef.current) {
      try {
        playerRef.current.requestPause();
      } catch (e) {}
    }
    setIsPlaying(false);

    onFinishGame({
      score,
      combo,
      maxCombo,
      itemsCollected: collectedCounts,
    });
  };

  // Calculate matching target style colors
  const getItemColor = (type: "star" | "flower" | "gem" | "lyric") => {
    switch (type) {
      case "star":
        return "border-amber-400 bg-amber-950/90 text-amber-300 shadow-[0_0_12px_rgba(234,179,8,0.4)]";
      case "flower":
        return "border-rose-400 bg-rose-950/90 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.4)]";
      case "gem":
        return "border-cyan-400 bg-cyan-950/90 text-cyan-300 shadow-[0_0_12px_rgba(57,197,187,0.4)]";
      case "lyric":
      default:
        return "border-emerald-400 bg-emerald-950/90 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]";
    }
  };

  const formatProgressTime = (ms: number) => {
    const totalSecs = Math.max(0, Math.floor(ms / 1000));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="relative min-h-screen text-white bg-zinc-950 flex flex-col justify-between overflow-hidden select-none font-sans"
      id="game-stage-container"
    >
      {/* Laser Top Status Header Banner */}
      <header className="relative z-20 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)]" id="game-header-banner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Song selection feedback */}
          <div className="flex items-center gap-3">
            <button
              onClick={onExitToTitle}
              className="cursor-pointer font-mono text-xs border border-zinc-800 hover:border-zinc-700 bg-zinc-900 px-3 py-1.5 rounded-lg text-zinc-300 hover:text-[#39C5BB] flex items-center gap-1.5 transition-all"
              id="btn-return-select"
            >
              <Home className="w-3.5 h-3.5" />
              <span>選択画面へ</span>
            </button>
            <div className="hidden sm:block">
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase block">CURRENT TRACK</span>
              <h2 className="text-sm font-bold text-[#39C5BB] max-w-[200px] truncate">{song.title}</h2>
            </div>
          </div>

          {/* Sabi / Chorus indicator */}
          <div className="flex items-center gap-3">
            {isChorusActive && (
              <div
                className="font-mono text-xs font-black animate-pulse bg-rose-500 text-white border border-rose-400 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)] flex items-center gap-1.5"
                id="chorus-active-pill"
              >
                <Heart className="w-3.5 h-3.5 fill-current animate-bounce" />
                <span>CHORUS (サビ効果発動中: COMBO BONUS 1.5x)</span>
              </div>
            )}
          </div>

          {/* Live Score block */}
          <div className="flex items-center gap-6" id="header-counters-layout">
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 font-mono block">COMBO</span>
              <span className="text-xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#39C5BB] to-emerald-400 flex items-center justify-end gap-1">
                <Zap className="w-4 h-4 fill-current text-[#39C5BB] animate-bounce" />
                {combo}
              </span>
            </div>
            <div className="text-right bg-zinc-900 px-4 py-1 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-500 font-mono block">SCORE</span>
              <span className="text-xl font-bold font-mono tracking-wider text-amber-300">
                {score.toString().padStart(6, "0")}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Pixel Gameplay Stage Arena */}
      <main className="relative z-10 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 items-stretch max-w-7xl w-full mx-auto" id="gameplay-main-layout">
        
        {/* Play Stage Field (Left - Col spans 9) */}
        <div
          ref={canvasContainerRef}
          className="lg:col-span-9 relative border-4 border-zinc-800 rounded-3xl overflow-hidden bg-gradient-to-b from-sky-950 via-slate-900 to-zinc-950 min-h-[460px] flex flex-col justify-between"
          id="gameplay-stage-arena"
        >
          {/* Background layered scrolling sceneries */}
          
          {/* Layer 1: Pixel Sky Starry Grid */}
          <div
            className="absolute inset-0 z-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(ellipse at center, rgba(24,24,27,0) 0%, rgba(9,9,11,0.9) 100%)`,
            }}
          />
          {/* Drifting background clouds/stars matching offset */}
          <div
            className="absolute inset-x-0 top-10 h-32 opacity-25 z-0 pointer-events-none"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40' viewBox='0 0 120 40'%3E%3Cpath d='M10 20h20v4H10zm30 5h15v4H40zm45-12h25v4H85z' fill='%2339C5BB' fill-opacity='0.5'/%3E%3C/svg%3E\")",
              backgroundPositionX: `${-sceneryOffset * 0.1}px`,
              backgroundRepeat: "repeat-x",
            }}
          />

          {/* Layer 2: Neon mountain silhouette scrolls */}
          <div
            className={`absolute inset-x-0 bottom-16 h-36 opacity-30 z-0 pointer-events-none transition-colors duration-1000 ${
              isChorusActive ? "text-rose-500" : "text-[#39C5BB]"
            }`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2500/svg' width='160' height='100' viewBox='0 0 160 100'%3E%3Cpolygon points='0,100 40,30 80,100 120,45 160,100' fill='currentColor'/%3E%3C/svg%3E")`,
              backgroundPositionX: `${-sceneryOffset * 0.3}px`,
              backgroundSize: "320px 100%",
              backgroundRepeat: "repeat-x",
            }}
          />

          {/* Layer 3: Floor & Scenery decorations side scrolling */}
          <div
            className="absolute inset-x-0 bottom-0 h-16 bg-zinc-900 border-t-4 border-zinc-700 z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect x='0' y='0' width='38' height='12' fill='%2327272A'/%3E%3Crect x='10' y='16' width='18' height='24' fill='%2318181B'/%3E%3C/svg%3E")`,
              backgroundPositionX: `${-sceneryOffset}px`,
              backgroundRepeat: "repeat-x",
            }}
          />

          {/* Beat indicator spotlight ring */}
          <div
            className={`absolute bottom-8 left-1/4 -translate-x-1/2 w-48 h-10 rounded-full transition-all duration-200 pointer-events-none z-10 ${
              beatPulse
                ? "bg-[#39C5BB]/25 border-2 border-[#39C5BB] scale-110 shadow-[0_0_20px_rgba(57,197,187,0.4)]"
                : "bg-black/25 border border-zinc-700"
            }`}
            style={{ transform: "rotateX(75deg)" }}
          />

          {/* Falling / Floating Tap Targets container */}
          <div className="absolute inset-0 z-20 pointer-events-auto" id="playable-tap-field">
            {spawnedItems.map((item) => (
              <button
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  incrementScore(item.type, item.points);
                  setSpawnedItems((prev) => prev.filter((it) => it.id !== item.id));
                }}
                className={`absolute cursor-pointer p-3 rounded-2xl border-2 flex flex-col items-center justify-center font-mono text-xs font-bold font-black transform hover:scale-110 active:scale-95 transition-all outline-none select-none duration-100 ${getItemColor(
                  item.type
                )}`}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  animation: "bounce 2s infinite ease-in-out",
                }}
                id={`target-item-${item.id}`}
              >
                {/* Large responsive icon */}
                <span className="text-xl mb-1 select-none">{item.char}</span>
                {/* Score bonus */}
                <span className="text-[9px] font-semibold opacity-85">+{item.points}</span>
              </button>
            ))}
          </div>

          {/* Hatsune Miku Character Sprite */}
          <div className="absolute bottom-10 left-1/4 -translate-x-1/2 z-20" id="miku-sprite-game-viewport">
            {/* Action text popping */}
            {beatPulse && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 font-mono text-[9px] font-black text-[#39C5BB] bg-zinc-950 border border-[#39C5BB]/30 px-2 py-0.5 rounded shadow whitespace-nowrap animate-bounce leading-none">
                STEP-UP!
              </div>
            )}
            <MikuSprite pose={isPlaying ? mikuPose : "idle"} width={100} height={100} />
            <div className="text-center font-mono text-[9px] text-[#39C5BB] mt-1 bg-zinc-950/80 px-2 py-0.5 rounded-full border border-[#39C5BB]/20">
              Miku
            </div>
          </div>

          {/* Live scrolling Lyrics Subtitle Display at the bottom of gameplay */}
          <div className="relative z-20 flex flex-col items-center justify-end p-6 bg-gradient-to-t from-zinc-950/95 via-zinc-950/80 to-transparent pt-32 pointer-events-none" id="live-subtitles-block">
            {/* Current Active Lyrics line */}
            <div className="text-center min-h-[40px] px-4">
              <span className={`block text-xl md:text-2xl font-bold tracking-wide transition-all ${
                isChorusActive 
                  ? "text-rose-400 font-extrabold animate-pulse drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" 
                  : "text-[#39C5BB] drop-shadow-[0_0_8px_rgba(57,197,187,0.3)]"
              }`}>
                {activePhraseText || "♪ 楽曲読込中... ［Play］ボタンで開始 ♫"}
              </span>
            </div>
            {/* Next lyrics outline */}
            <div className="text-center min-h-[20px] mt-1.5 opacity-55">
              <span className="block text-xs text-zinc-400 font-medium italic">
                {nextPhraseText ? `Next: ${nextPhraseText}` : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Right TV Drawer for Video Playback / Controls (Right - Col spans 3) */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-4" id="vocaloid-visualizer-section">
          
          {/* Nostalgic TV Cabinet Container */}
          <div className="border-4 border-zinc-800 bg-zinc-900 rounded-2xl p-4 flex-grow flex flex-col justify-between relative overflow-hidden" id="tv-cabinet-wrapper">
            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-rose-500 animate-ping"></div>
            <div className="absolute top-2 right-2 font-mono text-[9px] text-zinc-500">MONITOR-V1</div>

            <div className="mt-4 flex-grow flex flex-col justify-center">
              <h3 className="text-xs font-semibold text-zinc-400 font-mono tracking-widest text-center mb-2">LIVE SOUND FEED</h3>
              
              {/* Box container for actual TextAlive media elements */}
              <div
                className="w-full aspect-video bg-black rounded-lg border border-zinc-800 relative flex items-center justify-center overflow-hidden"
                id="live-media-box"
              >
                {/* TextAlive player elements binding */}
                {!isSynthMode && (
                  <div id="textalive-media-box" className="absolute inset-0 w-full h-full z-10" />
                )}

                {/* Synth Visualizer Graphic */}
                {isSynthMode && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-zinc-950 z-10" id="synth-graphic-wrapper">
                    <span className="text-4xl animate-bounce">📻</span>
                    <span className="text-[10px] font-mono text-[#39C5BB] mt-2 tracking-wide uppercase">BUILT-IN CHIPTUNE</span>
                    <span className="text-[9px] font-mono text-zinc-500 mt-0.5">8-bit Soundcard Mode Enabled</span>
                  </div>
                )}

                {/* Loading state placeholders */}
                {loading && (
                  <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center text-center p-4 z-20">
                    <div className="w-10 h-10 border-4 border-t-[#39C5BB] border-r-transparent border-zinc-800 rounded-full animate-spin"></div>
                    <p className="font-mono text-xs text-zinc-400 mt-3 animate-pulse">LOADING STREAMING SYSTEM...</p>
                  </div>
                )}

                {/* Errors display */}
                {errorMsg && (
                  <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center text-center p-4 z-30">
                    <AlertCircle className="w-8 h-8 text-rose-500 mb-2 animate-bounce" />
                    <p className="font-mono text-xs text-rose-200 mt-1">{errorMsg}</p>
                    <button
                      onClick={() => onExitToTitle()}
                      className="mt-3 px-3 py-1 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs rounded transition-all"
                    >
                      SELECT SCREEN
                    </button>
                  </div>
                )}
              </div>

              {/* Instructions memo details under monitor */}
              <div className="mt-4 p-3 bg-zinc-950 rounded-xl border border-zinc-800 font-mono text-[10px] text-zinc-400 leading-relaxed space-y-1.5" id="tv-instruction-list">
                <p className="text-[#39C5BB] font-bold">🎮 遊び方：</p>
                <p>・曲が始まると、歌詞やリズムに合わせて画面にタップ目標（🌟や🌸、💎、文字バルーン）が出現します。</p>
                <p>・タイミングよく［クリック］または［タップ］して回収、コンボを繋げてハイスコアを狙いましょう！</p>
              </div>
            </div>

            {/* Collection overview widget */}
            <div className="border-t border-zinc-800 pt-3 mt-4 flex items-center justify-between text-xs font-mono" id="cabinet-collection-panel">
              <span className="text-zinc-500">COLLECTED:</span>
              <div className="flex gap-2">
                <span className="bg-zinc-950 px-2 py-0.5 rounded text-amber-300">🌟 {collectedCounts.star}</span>
                <span className="bg-zinc-950 px-2 py-0.5 rounded text-rose-300">🌸 {collectedCounts.flower}</span>
                <span className="bg-zinc-950 px-2 py-0.5 rounded text-cyan-300">💎 {collectedCounts.gem}</span>
              </div>
            </div>
          </div>

          {/* Quick interactive utility media controls console */}
          <div className="border-4 border-zinc-800 bg-zinc-900 rounded-2xl p-4 flex flex-col gap-3" id="playback-console-wrapper">
            <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
              <span>STATUS: {isPlaying ? "PLAYING" : "PAUSED"}</span>
              <span className="text-[#39C5BB]">{formatProgressTime(currentTime)} / {formatProgressTime(duration)}</span>
            </div>

            {/* Simulated progress slider bar */}
            <div className="w-full h-2.5 bg-zinc-950 border border-zinc-800 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#39C5BB] to-teal-500 transition-all duration-100"
                style={{ width: `${Math.min(100, (currentTime / duration) * 105)}%` }}
              />
            </div>

            {/* Control buttons layout */}
            <div className="grid grid-cols-4 gap-2 mt-1">
              <button
                onClick={handleTogglePlay}
                disabled={loading}
                className="col-span-2 cursor-pointer py-2 px-3 bg-[#39C5BB] hover:bg-teal-400 text-zinc-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_3px_8px_rgba(57,197,187,0.25)] active:translate-y-0.5"
                id="btn-play-pause-toggle"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>PLAY</span>
                  </>
                )}
              </button>

              <button
                onClick={handleRestart}
                disabled={loading}
                className="cursor-pointer py-2 px-1 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all text-zinc-300 active:translate-y-0.5"
                id="btn-media-restart"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RETRY</span>
              </button>

              <button
                onClick={handleGameFinished}
                className="cursor-pointer py-2 px-1 bg-rose-500 hover:bg-rose-450 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1 transition-all active:translate-y-0.5"
                id="btn-media-finish"
              >
                <Award className="w-3.5 h-3.5" />
                <span>FINISH</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Retro visualizer scanning grid bottom advice */}
      <footer className="relative z-10 text-center font-mono text-[10px] text-zinc-500 py-4 border-t border-zinc-900 bg-zinc-950 space-y-1" id="gameplay-under-footer">
        <p className="text-zinc-400">本アプリは <a href="https://developer.textalive.jp/" target="_blank" rel="noopener noreferrer" className="text-[#39C5BB] hover:underline">TextAlive App API</a> を利用して開発されています。</p>
        <p className="text-[9px] opacity-50">ミクのピクセル・ミュージック・ジャーニー — POWERED BY TEXTALIVE APP API & WEB AUDIO</p>
      </footer>
    </div>
  );
};
