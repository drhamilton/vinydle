import type { Album, AlbumProvider } from "./types";
import albumsData from "../../../data/albums.json";

const ALBUMS: Album[] = albumsData as Album[];
const ANSWER_ALBUMS: Album[] = ALBUMS.filter((a) => a.isAnswer !== false);

function hashDate(date: Date): number {
  const dateStr = date.toISOString().split("T")[0];
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function createStaticProvider(): AlbumProvider {
  return {
    async getAlbum(id: string): Promise<Album | null> {
      return ALBUMS.find((a) => a.id === id) ?? null;
    },

    async searchAlbums(query: string): Promise<Album[]> {
      const lower = query.toLowerCase();
      return ALBUMS.filter(
        (a) =>
          a.title.toLowerCase().includes(lower) ||
          a.artist.toLowerCase().includes(lower)
      );
    },

    async getDailyAlbum(date: Date): Promise<Album> {
      const index = hashDate(date) % ANSWER_ALBUMS.length;
      return ANSWER_ALBUMS[index];
    },

    async getRandomAlbum(exclude?: Set<string>): Promise<Album> {
      if (!exclude || exclude.size === 0) {
        const index = Math.floor(Math.random() * ANSWER_ALBUMS.length);
        return ANSWER_ALBUMS[index];
      }
      const available = ANSWER_ALBUMS.filter((a) => !exclude.has(a.id));
      if (available.length === 0) {
        // All albums played, pick any random one
        const index = Math.floor(Math.random() * ANSWER_ALBUMS.length);
        return ANSWER_ALBUMS[index];
      }
      const index = Math.floor(Math.random() * available.length);
      return available[index];
    },

    getTotalCount(): number {
      return ANSWER_ALBUMS.length;
    },
  };
}

export { ALBUMS };
