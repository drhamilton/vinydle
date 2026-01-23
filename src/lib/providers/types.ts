export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  releaseYear?: number;
  isAnswer?: boolean;
}

export interface AlbumProvider {
  getAlbum(id: string): Promise<Album | null>;
  searchAlbums(query: string): Promise<Album[]>;
  getDailyAlbum(date: Date): Promise<Album>;
  getRandomAlbum(exclude?: Set<string>): Promise<Album>;
  getTotalCount(): number;
}
