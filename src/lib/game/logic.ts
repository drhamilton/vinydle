import type { Album } from "../providers/types";
import type { ObscureStrategy } from "../obscure/types";
import type { GameState, Guess } from "./types";

export function createGame(
  album: Album,
  strategy: ObscureStrategy
): GameState {
  return {
    album,
    guesses: [],
    maxGuesses: strategy.totalCells,
    status: "playing",
    obscureState: strategy.createInitialState(),
  };
}

export function makeGuess(
  state: GameState,
  guessedAlbum: Album,
  strategy: ObscureStrategy
): GameState {
  if (state.status !== "playing") return state;

  const alreadyGuessed = state.guesses.some(
    (g) => g.albumId === guessedAlbum.id
  );
  if (alreadyGuessed) return state;

  const isCorrect =
    guessedAlbum.id === state.album.id ||
    (guessedAlbum.title.toLowerCase() === state.album.title.toLowerCase() &&
      guessedAlbum.artist.toLowerCase() === state.album.artist.toLowerCase());

  const guess: Guess = {
    albumId: guessedAlbum.id,
    albumTitle: guessedAlbum.title,
    artist: guessedAlbum.artist,
    correct: isCorrect,
  };

  const newGuesses = [...state.guesses, guess];
  const newObscureState = isCorrect
    ? strategy.revealAll(state.obscureState)
    : strategy.revealNext(state.obscureState);

  let newStatus = state.status;
  if (isCorrect) {
    newStatus = "won";
  } else if (newGuesses.length >= state.maxGuesses) {
    newStatus = "lost";
  }

  return {
    ...state,
    guesses: newGuesses,
    status: newStatus,
    obscureState: newObscureState,
  };
}

export function getRevealedCount(state: GameState): number {
  return state.obscureState.revealedCells.filter(Boolean).length;
}

export function getRemainingGuesses(state: GameState): number {
  return state.maxGuesses - state.guesses.length;
}
