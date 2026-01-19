"use client";

import { useState, useRef, useEffect } from "react";
import type { Album } from "@/lib/providers";

interface GuessInputProps {
  onGuess: (album: Album) => void;
  searchAlbums: (query: string) => Promise<Album[]>;
  disabled?: boolean;
}

type SearchState = "idle" | "searching" | "done";

export function GuessInput({
  onGuess,
  searchAlbums,
  disabled = false,
}: GuessInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Album[]>([]);
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setSearchState("idle");
      setIsOpen(false);
      return;
    }

    setSearchState("searching");
    setIsOpen(true);

    const timer = setTimeout(async () => {
      const albums = await searchAlbums(query);
      setResults(albums);
      setSearchState("done");
      setSelectedIndex(0);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, searchAlbums]);

  const handleSelect = (album: Album) => {
    onGuess(album);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        disabled={disabled}
        placeholder="Guess the album..."
        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-neutral-500 disabled:opacity-50"
      />
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-neutral-700 bg-neutral-900">
          {searchState === "searching" && (
            <div className="px-4 py-3 text-neutral-400">Searching...</div>
          )}
          {searchState === "done" && results.length === 0 && (
            <div className="px-4 py-3 text-neutral-400">No results found</div>
          )}
          {searchState === "done" && results.length > 0 && (
            <ul>
              {results.map((album, index) => (
                <li
                  key={album.id}
                  onClick={() => handleSelect(album)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`cursor-pointer px-4 py-2 ${
                    index === selectedIndex ? "bg-neutral-800" : ""
                  }`}
                >
                  <div className="font-medium">{album.title}</div>
                  <div className="text-sm text-neutral-400">{album.artist}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
