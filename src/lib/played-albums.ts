const STORAGE_KEY = "vinydle-played-albums";

export function getPlayedAlbumIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored));
  } catch {
    return new Set();
  }
}

export function markAlbumPlayed(albumId: string): void {
  if (typeof window === "undefined") return;
  const played = getPlayedAlbumIds();
  played.add(albumId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...played]));
}

export function resetPlayedAlbums(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
