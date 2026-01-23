import { writeFileSync, readFileSync } from "fs";

const ALBUMS_TO_ADD = [
  { title: "Weezer", artist: "Weezer" },
  { title: "Pinkerton", artist: "Weezer" },
  { title: "Maladroit", artist: "Weezer" },
  { title: "Make Believe", artist: "Weezer" },
  { title: "The Red Album", artist: "Weezer" },
  { title: "Raditude", artist: "Weezer" },
  { title: "Hurley", artist: "Weezer" },
  { title: "Everything Will Be Alright in the End", artist: "Weezer" },
  { title: "Pacific Daydream", artist: "Weezer" },
  { title: "OK Human", artist: "Weezer" },
  { title: "Van Weezer", artist: "Weezer" },
];

interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  releaseYear?: number;
  isAnswer?: boolean;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function searchMusicBrainz(title: string, artist: string): Promise<{ id: string; year?: number } | null> {
  const query = encodeURIComponent(`release:"${title}" AND artist:"${artist}"`);
  const url = `https://musicbrainz.org/ws/2/release?query=${query}&fmt=json&limit=5`;
  const res = await fetch(url, { headers: { "User-Agent": "Vinydle/1.0" } });
  if (!res.ok) return null;
  const data = await res.json();
  for (const release of data.releases || []) {
    return { id: release.id, year: release.date ? parseInt(release.date.split("-")[0]) : undefined };
  }
  return null;
}

async function hasCoverArt(releaseId: string): Promise<boolean> {
  const res = await fetch(`https://coverartarchive.org/release/${releaseId}`, { method: "HEAD" });
  return res.ok;
}

async function main() {
  const existingAlbums: Album[] = JSON.parse(readFileSync("data/albums.json", "utf-8"));
  const existingIds = new Set(existingAlbums.map((a) => a.id));
  console.log(`Adding ${ALBUMS_TO_ADD.length} albums...
`);
  let added = 0;

  for (const { title, artist } of ALBUMS_TO_ADD) {
    await delay(1100);
    console.log(`Searching: ${title} - ${artist}`);
    const result = await searchMusicBrainz(title, artist);
    if (!result) { console.log("  x Not found"); continue; }
    if (existingIds.has(result.id)) { console.log("  - Already exists"); continue; }
    await delay(1100);
    if (!(await hasCoverArt(result.id))) { console.log("  x No cover art"); continue; }
    existingAlbums.push({ id: result.id, title, artist, coverUrl: `https://coverartarchive.org/release/${result.id}/front-500`, releaseYear: result.year });
    existingIds.add(result.id);
    writeFileSync("data/albums.json", JSON.stringify(existingAlbums, null, 2));
    added++;
    console.log(`  + Added (${result.year || "?"})`);
  }
  console.log(`
Done! Added ${added} albums.`);
}
main();
