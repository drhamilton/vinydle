import type { Album } from "../providers/types";
import type { ObscureState } from "../obscure/types";

export type GameStatus = "playing" | "won" | "lost";

export interface Guess {
  albumId: string;
  albumTitle: string;
  artist: string;
  correct: boolean;
  sameArtist: boolean;
}

export interface GameState {
  album: Album;
  guesses: Guess[];
  maxGuesses: number;
  status: GameStatus;
  obscureState: ObscureState;
}
