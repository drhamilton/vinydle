import { describe, it, expect } from "vitest";
import { createGame, makeGuess, getRemainingGuesses, getRevealedCount } from "./logic";
import { createBlurGridStrategy } from "../obscure";
import type { Album } from "../providers";

const testAlbum: Album = {
  id: "1",
  title: "OK Computer",
  artist: "Radiohead",
  coverUrl: "https://example.com/cover.jpg",
  releaseYear: 1997,
};

const wrongAlbum: Album = {
  id: "2",
  title: "Kid A",
  artist: "Radiohead",
  coverUrl: "https://example.com/cover2.jpg",
  releaseYear: 2000,
};

describe("game logic", () => {
  const strategy = createBlurGridStrategy({ gridSize: 3 });

  describe("createGame", () => {
    it("creates initial game state", () => {
      const state = createGame(testAlbum, strategy);

      expect(state.album).toBe(testAlbum);
      expect(state.guesses).toEqual([]);
      expect(state.maxGuesses).toBe(9);
      expect(state.status).toBe("playing");
      expect(state.obscureState.revealedCells).toHaveLength(9);
      expect(state.obscureState.revealedCells.every((c) => c === false)).toBe(true);
    });
  });

  describe("makeGuess", () => {
    it("records correct guess and wins", () => {
      const state = createGame(testAlbum, strategy);
      const newState = makeGuess(state, testAlbum, strategy);

      expect(newState.guesses).toHaveLength(1);
      expect(newState.guesses[0].correct).toBe(true);
      expect(newState.status).toBe("won");
    });

    it("reveals all cells on correct guess", () => {
      const state = createGame(testAlbum, strategy);
      const newState = makeGuess(state, testAlbum, strategy);

      expect(newState.obscureState.revealedCells.every(Boolean)).toBe(true);
    });

    it("records wrong guess and reveals a cell", () => {
      const state = createGame(testAlbum, strategy);
      const newState = makeGuess(state, wrongAlbum, strategy);

      expect(newState.guesses).toHaveLength(1);
      expect(newState.guesses[0].correct).toBe(false);
      expect(newState.status).toBe("playing");
      expect(getRevealedCount(newState)).toBe(1);
    });

    it("loses after max wrong guesses", () => {
      let state = createGame(testAlbum, strategy);

      for (let i = 0; i < 9; i++) {
        const wrongGuess: Album = {
          id: `wrong-${i}`,
          title: `Wrong Album ${i}`,
          artist: "Wrong Artist",
          coverUrl: "",
        };
        state = makeGuess(state, wrongGuess, strategy);
      }

      expect(state.status).toBe("lost");
      expect(state.guesses).toHaveLength(9);
    });

    it("does not modify state after game is won", () => {
      let state = createGame(testAlbum, strategy);
      state = makeGuess(state, testAlbum, strategy);
      const stateAfterWin = makeGuess(state, wrongAlbum, strategy);

      expect(stateAfterWin).toBe(state);
    });

    it("ignores duplicate guesses", () => {
      let state = createGame(testAlbum, strategy);
      state = makeGuess(state, wrongAlbum, strategy);
      const stateAfterDupe = makeGuess(state, wrongAlbum, strategy);

      expect(stateAfterDupe).toBe(state);
      expect(stateAfterDupe.guesses).toHaveLength(1);
    });

    it("matches by title and artist case-insensitively", () => {
      const state = createGame(testAlbum, strategy);
      const guessWithDifferentCase: Album = {
        id: "different-id",
        title: "ok computer",
        artist: "radiohead",
        coverUrl: "https://example.com/other.jpg",
      };

      const newState = makeGuess(state, guessWithDifferentCase, strategy);
      expect(newState.guesses[0].correct).toBe(true);
      expect(newState.status).toBe("won");
    });
  });

  describe("getRemainingGuesses", () => {
    it("returns correct remaining count", () => {
      let state = createGame(testAlbum, strategy);
      expect(getRemainingGuesses(state)).toBe(9);

      state = makeGuess(state, wrongAlbum, strategy);
      expect(getRemainingGuesses(state)).toBe(8);
    });
  });
});
