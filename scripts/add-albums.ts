import { writeFileSync, readFileSync } from "fs";

const ALBUMS_TO_ADD = [
  { title: "Thick as a Brick", artist: "Jethro Tull" },
  { title: "Ten", artist: "Pearl Jam" },
  { title: "Paranoid", artist: "Black Sabbath" },
  { title: "The Stranger", artist: "Billy Joel" },
  { title: "Gateway", artist: "Dimmu Borgir" },
  { title: "Dopesmoker", artist: "Sleep" },
  { title: "Brothers in Arms", artist: "Dire Straits" },
  { title: "The Nightfly", artist: "Donald Fagen" },
  { title: "Oh, No! It's Devo", artist: "Devo" },
  { title: "Q: Are We Not Men? A: We Are Devo!", artist: "Devo" },
  { title: "In the Court of the Crimson King", artist: "King Crimson" },
  { title: "The Monitor", artist: "Titus Andronicus" },
  { title: "Danzig", artist: "Danzig" },
  { title: "Welcome to Sky Valley", artist: "Kyuss" },
  { title: "Dire Straits", artist: "Dire Straits" },
  { title: "F♯ A♯ ∞", artist: "Godspeed You! Black Emperor" },
  { title: "Mother Earth's Plantasia", artist: "Mort Garson" },
  { title: "Dopethrone", artist: "Electric Wizard" },
  { title: "Ashes Against the Grain", artist: "Agalloch" },
  { title: "The Mantle", artist: "Agalloch" },
];

interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  releaseYear?: number;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<Response | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (e) {
      console.log(`  Retry ${i + 1}/${retries}...`);
      await delay(2000);
    }
  }
  return null;
}

async function searchMusicBrainz(
  title: string,
  artist: string
): Promise<{ id: string; year?: number } | null> {
  const query = encodeURIComponent(`release:"${title}" AND artist:"${artist}"`);
  const url = `https://musicbrainz.org/ws/2/release?query=${query}&fmt=json&limit=1`;

  const res = await fetchWithRetry(url, {
    headers: { "User-Agent": "Vinydle/1.0 (album guessing game)" },
  });

  if (!res || !res.ok) return null;

  const data = await res.json();
  const release = data.releases?.[0];

  if (!release) return null;

  return {
    id: release.id,
    year: release.date ? parseInt(release.date.split("-")[0]) : undefined,
  };
}

async function hasCoverArt(releaseId: string): Promise<boolean> {
  const url = `https://coverartarchive.org/release/${releaseId}`;
  const res = await fetchWithRetry(url, { method: "HEAD" });
  return res?.ok ?? false;
}

async function main() {
  const existing = JSON.parse(readFileSync("data/albums.json", "utf-8"));
  const existingIds = new Set(existing.map((a: Album) => a.id));
  const albums: Album[] = [];

  console.log(`Adding ${ALBUMS_TO_ADD.length} albums...\n`);

  for (const { title, artist } of ALBUMS_TO_ADD) {
    await delay(1100);

    console.log(`Searching: ${title} - ${artist}`);
    const result = await searchMusicBrainz(title, artist);

    if (!result) {
      console.log(`  ✗ Not found`);
      continue;
    }

    if (existingIds.has(result.id)) {
      console.log(`  ⊘ Already exists`);
      continue;
    }

    await delay(1100);
    const hasCover = await hasCoverArt(result.id);

    if (!hasCover) {
      console.log(`  ✗ No cover art`);
      continue;
    }

    albums.push({
      id: result.id,
      title,
      artist,
      coverUrl: `https://coverartarchive.org/release/${result.id}/front-500`,
      releaseYear: result.year,
    });

    console.log(`  ✓ Added (${result.year || "unknown year"})`);
  }

  const merged = [...existing, ...albums];
  writeFileSync("data/albums.json", JSON.stringify(merged, null, 2));

  console.log(`\nDone! Added ${albums.length} new albums.`);
  console.log(`Total: ${merged.length} albums`);
}

main().catch(console.error);
