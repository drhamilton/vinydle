"use client";

import type { ObscureState, ObscureStrategy } from "@/lib/obscure";

interface AlbumGridProps {
  coverUrl: string;
  strategy: ObscureStrategy;
  state: ObscureState;
  size?: number;
}

export function AlbumGrid({
  coverUrl,
  strategy,
  state,
  size = 300,
}: AlbumGridProps) {
  const gridSize = Math.sqrt(strategy.totalCells);
  const cellSize = size / gridSize;

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      style={{ width: size, height: size }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          width: size,
          height: size,
        }}
      >
        {Array.from({ length: strategy.totalCells }).map((_, index) => {
          const row = Math.floor(index / gridSize);
          const col = index % gridSize;
          const cellStyle = strategy.getCellStyle(index, state);

          return (
            <div
              key={index}
              className="overflow-hidden"
              style={{
                width: cellSize,
                height: cellSize,
              }}
            >
              <div
                style={{
                  width: size,
                  height: size,
                  backgroundImage: `url(${coverUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transform: `translate(-${col * cellSize}px, -${row * cellSize}px)`,
                  ...cellStyle,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
