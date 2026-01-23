"use client";

import { useState, useCallback } from "react";
import type { Album, AlbumProvider } from "@/lib/providers";
import type { ObscureStrategy } from "@/lib/obscure";
import { createGame, makeGuess, getRemainingGuesses, giveUp } from "@/lib/game";
import type { GameState } from "@/lib/game";
import { AlbumGrid } from "./AlbumGrid";
import { GuessInput } from "./GuessInput";
import { GuessList } from "./GuessList";

interface GameProps {
  album: Album;
  provider: AlbumProvider;
  strategy: ObscureStrategy;
  onNewAlbum?: () => void;
}

export function Game({ album, provider, strategy, onNewAlbum }: GameProps) {
  const [gameState, setGameState] = useState<GameState>(() =>
    createGame(album, strategy)
  );

  const handleGuess = useCallback(
    (guessedAlbum: Album) => {
      setGameState((prev) => makeGuess(prev, guessedAlbum, strategy));
    },
    [strategy]
  );

  const searchAlbums = useCallback(
    (query: string) => provider.searchAlbums(query),
    [provider]
  );

  const handleGiveUp = useCallback(() => {
    setGameState((prev) => giveUp(prev, strategy));
  }, [strategy]);

  const remaining = getRemainingGuesses(gameState);

  return (
    <div className="flex flex-col items-center gap-6">
      {onNewAlbum && (
        <button
          onClick={onNewAlbum}
          className="self-end text-neutral-400 hover:text-white text-sm"
          title="Skip to new album"
        >
          ↻ Skip
        </button>
      )}
      <AlbumGrid
        coverUrl={album.coverUrl}
        strategy={strategy}
        state={gameState.obscureState}
        size={300}
      />

      {gameState.status === "playing" && (
        <>
          <div className="text-neutral-400">
            {remaining} guess{remaining !== 1 ? "es" : ""} remaining
          </div>
          <GuessInput onGuess={handleGuess} searchAlbums={searchAlbums} />
          <button
            onClick={handleGiveUp}
            className="text-neutral-500 hover:text-neutral-300 text-sm"
          >
            Give up
          </button>
        </>
      )}

      {gameState.status === "won" && (
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">You got it!</div>
          <div className="mt-2 text-neutral-400">
            {album.title} by {album.artist}
          </div>
          {onNewAlbum && (
            <button
              onClick={onNewAlbum}
              className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
            >
              Next Album
            </button>
          )}
        </div>
      )}

      {gameState.status === "lost" && (
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">Game Over</div>
          <div className="mt-2 text-neutral-400">
            It was {album.title} by {album.artist}
          </div>
          {onNewAlbum && (
            <button
              onClick={onNewAlbum}
              className="mt-4 px-4 py-2 bg-neutral-600 hover:bg-neutral-700 rounded text-white"
            >
              Try Another
            </button>
          )}
        </div>
      )}

      <GuessList guesses={gameState.guesses} />
    </div>
  );
}
