/**
 * Fetches album data from MusicBrainz and Cover Art Archive
 * Run with: npx tsx scripts/fetch-albums.ts
 */

import { writeFileSync } from "fs";
import { join } from "path";

interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  releaseYear?: number;
}

interface MusicBrainzRelease {
  id: string;
  title: string;
  date?: string;
  "artist-credit"?: Array<{ name: string }>;
  "release-group"?: { "primary-type"?: string };
}

interface MusicBrainzSearchResult {
  releases: MusicBrainzRelease[];
}

const USER_AGENT = "Vinydle/0.1.0 (https://github.com/vinydle)";

// Search queries with expected artist to filter results
const ALBUMS_TO_FETCH = [
  { query: "OK Computer", artist: "Radiohead" },
  { query: "Abbey Road", artist: "The Beatles" },
  { query: "The Dark Side of the Moon", artist: "Pink Floyd" },
  { query: "Thriller", artist: "Michael Jackson" },
  { query: "Nevermind", artist: "Nirvana" },
  { query: "Rumours", artist: "Fleetwood Mac" },
  { query: "Back in Black", artist: "AC/DC" },
  { query: "Purple Rain", artist: "Prince" },
  { query: "Born to Run", artist: "Bruce Springsteen" },
  { query: "London Calling", artist: "The Clash" },
  { query: "Revolver", artist: "The Beatles" },
  { query: "Wish You Were Here", artist: "Pink Floyd" },
  { query: "Hotel California", artist: "Eagles" },
  { query: "The Velvet Underground & Nico", artist: "The Velvet Underground" },
  { query: "In Rainbows", artist: "Radiohead" },
  { query: "Kid A", artist: "Radiohead" },
  { query: "Appetite for Destruction", artist: "Guns N' Roses" },
  { query: "The Joshua Tree", artist: "U2" },
  { query: "Is This It", artist: "The Strokes" },
  { query: "Loveless", artist: "My Bloody Valentine" },
];

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3
): Promise<Response | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      console.log(`  Retry ${i + 1}/${retries}: ${(error as Error).message}`);
      await sleep(2000 * (i + 1));
    }
  }
  return null;
}

async function searchRelease(
  albumTitle: string,
  artistName: string
): Promise<MusicBrainzRelease | null> {
  // Use Lucene query syntax to search for exact matches
  const query = `release:"${albumTitle}" AND artist:"${artistName}" AND primarytype:album`;
  const url = `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(query)}&limit=5&fmt=json`;

  const response = await fetchWithRetry(url, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response?.ok) {
    return null;
  }

  const data = (await response.json()) as MusicBrainzSearchResult;

  // Find the best match - prefer exact title match and Album type
  const match = data.releases?.find((r) => {
    const titleMatch = r.title.toLowerCase() === albumTitle.toLowerCase();
    const artistMatch = r["artist-credit"]?.[0]?.name
      ?.toLowerCase()
      .includes(artistName.toLowerCase());
    const isAlbum = r["release-group"]?.["primary-type"] === "Album";
    return titleMatch && artistMatch && isAlbum;
  });

  return match ?? data.releases?.[0] ?? null;
}

async function getCoverArtUrl(releaseId: string): Promise<string | null> {
  const url = `https://coverartarchive.org/release/${releaseId}`;

  const response = await fetchWithRetry(url, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response?.ok) {
    return null;
  }

  const data = await response.json();
  const front = data.images?.find((img: { front: boolean }) => img.front);

  return front?.thumbnails?.["500"] ?? front?.thumbnails?.large ?? front?.image ?? null;
}

async function fetchAlbum(albumTitle: string, artistName: string): Promise<Album | null> {
  console.log(`Fetching: "${albumTitle}" by ${artistName}`);

  const release = await searchRelease(albumTitle, artistName);
  if (!release) {
    console.log(`  No release found`);
    return null;
  }

  await sleep(1000);

  const coverUrl = await getCoverArtUrl(release.id);
  if (!coverUrl) {
    console.log(`  No cover art for: ${release.title}`);
    return null;
  }

  const artist = release["artist-credit"]?.[0]?.name ?? artistName;
  const year = release.date ? parseInt(release.date.substring(0, 4), 10) : undefined;

  console.log(`  OK: ${release.title} by ${artist} (${year || "?"})`);

  return {
    id: release.id,
    title: release.title,
    artist,
    coverUrl,
    releaseYear: year,
  };
}

async function main() {
  const albums: Album[] = [];

  for (const { query, artist } of ALBUMS_TO_FETCH) {
    const album = await fetchAlbum(query, artist);
    if (album) {
      albums.push(album);
    }
    await sleep(1100);
  }

  const outputPath = join(process.cwd(), "data", "albums.json");
  writeFileSync(outputPath, JSON.stringify(albums, null, 2));

  console.log(`\nSaved ${albums.length} albums to ${outputPath}`);
}

main().catch(console.error);
