"use client";

import { useState, useCallback } from "react";
import type { Album, AlbumProvider } from "@/lib/providers";
import type { ObscureStrategy } from "@/lib/obscure";
import { createGame, makeGuess, getRemainingGuesses } from "@/lib/game";
import type { GameState } from "@/lib/game";
import { AlbumGrid } from "./AlbumGrid";
import { GuessInput } from "./GuessInput";
import { GuessList } from "./GuessList";

interface GameProps {
  album: Album;
  provider: AlbumProvider;
  strategy: ObscureStrategy;
}

export function Game({ album, provider, strategy }: GameProps) {
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

  const remaining = getRemainingGuesses(gameState);

  return (
    <div className="flex flex-col items-center gap-6">
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
        </>
      )}

      {gameState.status === "won" && (
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">You got it!</div>
          <div className="mt-2 text-neutral-400">
            {album.title} by {album.artist}
          </div>
        </div>
      )}

      {gameState.status === "lost" && (
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">Game Over</div>
          <div className="mt-2 text-neutral-400">
            It was {album.title} by {album.artist}
          </div>
        </div>
      )}

      <GuessList guesses={gameState.guesses} />
    </div>
  );
}
