import { writeFileSync, readFileSync } from "fs";

interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  releaseYear?: number;
  isAnswer?: boolean;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, init?: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, init);
    } catch (e) {
      if (i === retries - 1) throw e;
      console.log(`    retrying request...`);
      await delay(2000);
    }
  }
  throw new Error("unreachable");
}

async function findReleaseWithCover(title: string, artist: string, existingIds: Set<string>): Promise<{ id: string; year?: number } | null> {
  const query = encodeURIComponent(`release:"${title}" AND artist:"${artist}"`);
  const url = `https://musicbrainz.org/ws/2/release?query=${query}&fmt=json&limit=10`;
  const res = await fetchWithRetry(url, { headers: { "User-Agent": "Vinydle/1.0" } });
  if (!res.ok) return null;
  const data = await res.json();
  const releases = data.releases || [];
  if (releases.length === 0) return null;
  for (const release of releases) {
    if (existingIds.has(release.id)) return { id: release.id, year: release.date ? parseInt(release.date.split("-")[0]) : undefined };
    await delay(1100);
    const coverRes = await fetchWithRetry(`https://coverartarchive.org/release/${release.id}`, { method: "HEAD" });
    if (coverRes.ok) {
      return { id: release.id, year: release.date ? parseInt(release.date.split("-")[0]) : undefined };
    }
    console.log(`    trying another release...`);
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.length % 2 !== 0) {
    console.error("Usage: npx tsx scripts/add-album.ts <title> <artist> [title artist ...]");
    process.exit(1);
  }

  const pairs: { title: string; artist: string }[] = [];
  for (let i = 0; i < args.length; i += 2) {
    pairs.push({ title: args[i], artist: args[i + 1] });
  }

  const albums: Album[] = JSON.parse(readFileSync("data/albums.json", "utf-8"));
  const existingIds = new Set(albums.map((a) => a.id));
  const existingKeys = new Set(albums.map((a) => `${a.title.toLowerCase()}::${a.artist.toLowerCase()}`));

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const { title, artist } of pairs) {
    const key = `${title.toLowerCase()}::${artist.toLowerCase()}`;
    if (existingKeys.has(key)) {
      console.log(`  - Already exists: ${title} - ${artist}`);
      skipped++;
      continue;
    }

    await delay(1100);
    console.log(`Searching: ${title} - ${artist}`);
    const result = await findReleaseWithCover(title, artist, existingIds);
    if (!result) {
      console.log("  x Not found or no cover art");
      failed++;
      continue;
    }
    if (existingIds.has(result.id)) {
      console.log("  - Already exists (by ID)");
      skipped++;
      continue;
    }

    albums.push({
      id: result.id,
      title,
      artist,
      coverUrl: `https://coverartarchive.org/release/${result.id}/front-500`,
      releaseYear: result.year,
    });
    existingIds.add(result.id);
    existingKeys.add(key);
    added++;
    writeFileSync("data/albums.json", JSON.stringify(albums, null, 2));
    console.log(`  + Added (${result.year || "?"})`);
  }

  console.log(`\nDone: ${added} added, ${skipped} skipped, ${failed} failed`);
}

main();
