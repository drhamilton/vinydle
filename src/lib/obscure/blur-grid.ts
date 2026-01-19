import type { ObscureState, ObscureStrategy } from "./types";

export interface BlurGridConfig {
  gridSize: number;
  blurAmount: number;
}

const DEFAULT_CONFIG: BlurGridConfig = {
  gridSize: 3,
  blurAmount: 20,
};

export function createBlurGridStrategy(
  config: Partial<BlurGridConfig> = {}
): ObscureStrategy {
  const { gridSize, blurAmount } = { ...DEFAULT_CONFIG, ...config };
  const totalCells = gridSize * gridSize;

  return {
    name: "blur-grid",
    totalCells,

    createInitialState(): ObscureState {
      return {
        revealedCells: Array(totalCells).fill(false),
        totalCells,
      };
    },

    revealNext(state: ObscureState): ObscureState {
      const hiddenIndices = state.revealedCells
        .map((revealed, i) => (!revealed ? i : -1))
        .filter((i) => i !== -1);

      if (hiddenIndices.length === 0) return state;

      const randomIndex =
        hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
      const newRevealed = [...state.revealedCells];
      newRevealed[randomIndex] = true;

      return {
        ...state,
        revealedCells: newRevealed,
      };
    },

    revealAll(state: ObscureState): ObscureState {
      return {
        ...state,
        revealedCells: Array(totalCells).fill(true),
      };
    },

    getCellStyle(cellIndex: number, state: ObscureState): React.CSSProperties {
      const isRevealed = state.revealedCells[cellIndex];
      return {
        filter: isRevealed ? "none" : `blur(${blurAmount}px)`,
        transition: "filter 0.3s ease-out",
      };
    },
  };
}
