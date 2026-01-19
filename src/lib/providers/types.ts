export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  releaseYear?: number;
}

export interface AlbumProvider {
  getAlbum(id: string): Promise<Album | null>;
  searchAlbums(query: string): Promise<Album[]>;
  getDailyAlbum(date: Date): Promise<Album>;
}
