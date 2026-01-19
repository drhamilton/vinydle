import type { Album, AlbumProvider } from "./types";

const MOCK_ALBUMS: Album[] = [
  {
    id: "1",
    title: "OK Computer",
    artist: "Radiohead",
    coverUrl: "https://picsum.photos/seed/okcomputer/500/500",
    releaseYear: 1997,
  },
  {
    id: "2",
    title: "Kid A",
    artist: "Radiohead",
    coverUrl: "https://picsum.photos/seed/kida/500/500",
    releaseYear: 2000,
  },
  {
    id: "3",
    title: "In Rainbows",
    artist: "Radiohead",
    coverUrl: "https://picsum.photos/seed/inrainbows/500/500",
    releaseYear: 2007,
  },
  {
    id: "4",
    title: "Abbey Road",
    artist: "The Beatles",
    coverUrl: "https://picsum.photos/seed/abbeyroad/500/500",
    releaseYear: 1969,
  },
  {
    id: "5",
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    coverUrl: "https://picsum.photos/seed/darksideofthemoon/500/500",
    releaseYear: 1973,
  },
];

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

export function createMockProvider(): AlbumProvider {
  return {
    async getAlbum(id: string): Promise<Album | null> {
      return MOCK_ALBUMS.find((a) => a.id === id) ?? null;
    },

    async searchAlbums(query: string): Promise<Album[]> {
      const lower = query.toLowerCase();
      return MOCK_ALBUMS.filter(
        (a) =>
          a.title.toLowerCase().includes(lower) ||
          a.artist.toLowerCase().includes(lower)
      );
    },

    async getDailyAlbum(date: Date): Promise<Album> {
      const index = hashDate(date) % MOCK_ALBUMS.length;
      return MOCK_ALBUMS[index];
    },
  };
}

export { MOCK_ALBUMS };
