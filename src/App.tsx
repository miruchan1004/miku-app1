import React, { useState } from "react";
import { TitleScreen } from "./components/TitleScreen";
import { SongSelection } from "./components/SongSelection";
import { GameStage } from "./components/GameStage";
import { ResultScreen } from "./components/ResultScreen";
import { Song, GameScore } from "./types";

type ScreenState = "title" | "selection" | "game" | "result";

export default function App() {
  const [screen, setScreen] = useState<ScreenState>("title");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isSynthMode, setIsSynthMode] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<GameScore | null>(null);

  // Router transitions
  const handleStartGame = (synthMode: boolean) => {
    setIsSynthMode(synthMode);
    setScreen("selection");
  };

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    setScreen("game");
  };

  const handleFinishGame = (score: GameScore) => {
    setFinalScore(score);
    setScreen("result");
  };

  const handleReturnToTitle = () => {
    setSelectedSong(null);
    setFinalScore(null);
    setScreen("title");
  };

  const handleExitToSelection = () => {
    setSelectedSong(null);
    setScreen("selection");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-[#39C5BB] selection:text-black">
      {screen === "title" && (
        <TitleScreen onStartGame={handleStartGame} />
      )}

      {screen === "selection" && (
        <SongSelection
          onBackToTitle={handleReturnToTitle}
          onSelectSong={handleSelectSong}
          isSynthMode={isSynthMode}
        />
      )}

      {screen === "game" && selectedSong && (
        <GameStage
          song={selectedSong}
          isSynthMode={isSynthMode}
          onFinishGame={handleFinishGame}
          onExitToTitle={handleExitToSelection}
        />
      )}

      {screen === "result" && finalScore && (
        <ResultScreen
          scoreData={finalScore}
          onReturnToTitle={handleReturnToTitle}
        />
      )}
    </div>
  );
}
