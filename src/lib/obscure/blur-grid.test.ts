import { describe, it, expect } from "vitest";
import { createBlurGridStrategy } from "./blur-grid";

describe("blur grid strategy", () => {
  it("creates strategy with correct total cells", () => {
    const strategy = createBlurGridStrategy({ gridSize: 3 });
    expect(strategy.totalCells).toBe(9);
    expect(strategy.name).toBe("blur-grid");
  });

  it("creates initial state with all cells hidden", () => {
    const strategy = createBlurGridStrategy({ gridSize: 3 });
    const state = strategy.createInitialState();

    expect(state.revealedCells).toHaveLength(9);
    expect(state.revealedCells.every((c) => c === false)).toBe(true);
  });

  it("revealNext reveals exactly one cell", () => {
    const strategy = createBlurGridStrategy({ gridSize: 3 });
    let state = strategy.createInitialState();

    state = strategy.revealNext(state);
    const revealedCount = state.revealedCells.filter(Boolean).length;

    expect(revealedCount).toBe(1);
  });

  it("revealNext does nothing when all cells revealed", () => {
    const strategy = createBlurGridStrategy({ gridSize: 2 });
    let state = strategy.createInitialState();

    // Reveal all 4 cells
    for (let i = 0; i < 4; i++) {
      state = strategy.revealNext(state);
    }

    const stateAfter = strategy.revealNext(state);
    expect(stateAfter).toBe(state);
  });

  it("getCellStyle returns blur for hidden cells", () => {
    const strategy = createBlurGridStrategy({ gridSize: 3, blurAmount: 20 });
    const state = strategy.createInitialState();

    const style = strategy.getCellStyle(0, state);
    expect(style.filter).toBe("blur(20px)");
  });

  it("getCellStyle returns no blur for revealed cells", () => {
    const strategy = createBlurGridStrategy({ gridSize: 3 });
    let state = strategy.createInitialState();
    state = strategy.revealNext(state);

    const revealedIndex = state.revealedCells.findIndex(Boolean);
    const style = strategy.getCellStyle(revealedIndex, state);

    expect(style.filter).toBe("none");
  });

  it("revealAll reveals all cells", () => {
    const strategy = createBlurGridStrategy({ gridSize: 3 });
    const state = strategy.createInitialState();
    const revealed = strategy.revealAll(state);

    expect(revealed.revealedCells.every(Boolean)).toBe(true);
  });
});
