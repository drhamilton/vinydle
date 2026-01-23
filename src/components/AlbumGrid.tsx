"use client";

import { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const gridSize = Math.sqrt(strategy.totalCells);
  const cellSize = size / gridSize;

  useEffect(() => {
    setIsLoading(true);
    const img = new Image();
    img.onload = () => setIsLoading(false);
    img.onerror = () => setIsLoading(false);
    img.src = coverUrl;
  }, [coverUrl]);

  if (isLoading) {
    return (
      <div
        className="relative overflow-hidden rounded-lg bg-neutral-800 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-neutral-600 border-t-neutral-400 rounded-full animate-spin" />
          <span className="text-neutral-500 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

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
