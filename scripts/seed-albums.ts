import { writeFileSync } from "fs";

// MusicBrainz doesn't have a "top albums" endpoint, so we use a curated list
// and look up each on MusicBrainz to get proper IDs and cover art
const TOP_ALBUMS = [
  { title: "Thriller", artist: "Michael Jackson" },
  { title: "Back in Black", artist: "AC/DC" },
  { title: "The Bodyguard", artist: "Whitney Houston" },
  { title: "Bat Out of Hell", artist: "Meat Loaf" },
  { title: "Their Greatest Hits (1971–1975)", artist: "Eagles" },
  { title: "Dirty Dancing", artist: "Various Artists" },
  { title: "Let's Talk About Love", artist: "Celine Dion" },
  { title: "Rumours", artist: "Fleetwood Mac" },
  { title: "Saturday Night Fever", artist: "Bee Gees" },
  { title: "Come On Over", artist: "Shania Twain" },
  { title: "Led Zeppelin IV", artist: "Led Zeppelin" },
  { title: "The Wall", artist: "Pink Floyd" },
  { title: "Brothers in Arms", artist: "Dire Straits" },
  { title: "Bad", artist: "Michael Jackson" },
  { title: "Dangerous", artist: "Michael Jackson" },
  { title: "1", artist: "The Beatles" },
  { title: "Born in the U.S.A.", artist: "Bruce Springsteen" },
  { title: "Jagged Little Pill", artist: "Alanis Morissette" },
  { title: "Sgt. Pepper's Lonely Hearts Club Band", artist: "The Beatles" },
  { title: "21", artist: "Adele" },
  { title: "Fall Out Boy: Infinity on High", artist: "Fall Out Boy" },
  { title: "Appetite for Destruction", artist: "Guns N' Roses" },
  { title: "Hotel California", artist: "Eagles" },
  { title: "Nevermind", artist: "Nirvana" },
  { title: "The Joshua Tree", artist: "U2" },
  { title: "Purple Rain", artist: "Prince" },
  { title: "Hysteria", artist: "Def Leppard" },
  { title: "Like a Virgin", artist: "Madonna" },
  { title: "True Blue", artist: "Madonna" },
  { title: "Legend", artist: "Bob Marley and the Wailers" },
  { title: "Baby One More Time", artist: "Britney Spears" },
  { title: "No Fences", artist: "Garth Brooks" },
  { title: "Supernatural", artist: "Santana" },
  { title: "Metallica", artist: "Metallica" },
  { title: "Unplugged", artist: "Eric Clapton" },
  { title: "Ten", artist: "Pearl Jam" },
  { title: "Californication", artist: "Red Hot Chili Peppers" },
  { title: "Stadium Arcadium", artist: "Red Hot Chili Peppers" },
  { title: "Blood Sugar Sex Magik", artist: "Red Hot Chili Peppers" },
  { title: "In Utero", artist: "Nirvana" },
  { title: "Nevermind the Bollocks", artist: "Sex Pistols" },
  { title: "London Calling", artist: "The Clash" },
  { title: "The Bends", artist: "Radiohead" },
  { title: "Kid A", artist: "Radiohead" },
  { title: "In Rainbows", artist: "Radiohead" },
  { title: "Blue", artist: "Joni Mitchell" },
  { title: "Tapestry", artist: "Carole King" },
  { title: "Graceland", artist: "Paul Simon" },
  { title: "Bridge Over Troubled Water", artist: "Simon & Garfunkel" },
  { title: "Pet Sounds", artist: "The Beach Boys" },
  { title: "What's Going On", artist: "Marvin Gaye" },
  { title: "Songs in the Key of Life", artist: "Stevie Wonder" },
  { title: "Innervisions", artist: "Stevie Wonder" },
  { title: "Kind of Blue", artist: "Miles Davis" },
  { title: "A Love Supreme", artist: "John Coltrane" },
  { title: "Are You Experienced", artist: "Jimi Hendrix" },
  { title: "Electric Ladyland", artist: "Jimi Hendrix" },
  { title: "Wish You Were Here", artist: "Pink Floyd" },
  { title: "Animals", artist: "Pink Floyd" },
  { title: "The Rise and Fall of Ziggy Stardust", artist: "David Bowie" },
  { title: "Low", artist: "David Bowie" },
  { title: "Heroes", artist: "David Bowie" },
  { title: "Station to Station", artist: "David Bowie" },
  { title: "Revolver", artist: "The Beatles" },
  { title: "Rubber Soul", artist: "The Beatles" },
  { title: "The White Album", artist: "The Beatles" },
  { title: "Let It Be", artist: "The Beatles" },
  { title: "Please Please Me", artist: "The Beatles" },
  { title: "Exile on Main St.", artist: "The Rolling Stones" },
  { title: "Let It Bleed", artist: "The Rolling Stones" },
  { title: "Sticky Fingers", artist: "The Rolling Stones" },
  { title: "Beggars Banquet", artist: "The Rolling Stones" },
  { title: "The Velvet Underground & Nico", artist: "The Velvet Underground" },
  { title: "Unknown Pleasures", artist: "Joy Division" },
  { title: "Closer", artist: "Joy Division" },
  { title: "The Queen Is Dead", artist: "The Smiths" },
  { title: "Meat Is Murder", artist: "The Smiths" },
  { title: "Disintegration", artist: "The Cure" },
  { title: "Violator", artist: "Depeche Mode" },
  { title: "Achtung Baby", artist: "U2" },
  { title: "The Unforgettable Fire", artist: "U2" },
  { title: "Automatic for the People", artist: "R.E.M." },
  { title: "Murmur", artist: "R.E.M." },
  { title: "Doolittle", artist: "Pixies" },
  { title: "Surfer Rosa", artist: "Pixies" },
  { title: "Loveless", artist: "My Bloody Valentine" },
  { title: "Dummy", artist: "Portishead" },
  { title: "The Miseducation of Lauryn Hill", artist: "Lauryn Hill" },
  { title: "Ready to Die", artist: "The Notorious B.I.G." },
  { title: "Illmatic", artist: "Nas" },
  { title: "Enter the Wu-Tang (36 Chambers)", artist: "Wu-Tang Clan" },
  { title: "The Low End Theory", artist: "A Tribe Called Quest" },
  { title: "Straight Outta Compton", artist: "N.W.A." },
  { title: "The Chronic", artist: "Dr. Dre" },
  { title: "To Pimp a Butterfly", artist: "Kendrick Lamar" },
  { title: "good kid, m.A.A.d city", artist: "Kendrick Lamar" },
  { title: "My Beautiful Dark Twisted Fantasy", artist: "Kanye West" },
  { title: "The College Dropout", artist: "Kanye West" },
  { title: "Channel Orange", artist: "Frank Ocean" },
  { title: "Blonde", artist: "Frank Ocean" },
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
  const albums: Album[] = [];
  const existing = await import("../data/albums.json");
  const existingIds = new Set(existing.default.map((a: Album) => a.id));

  console.log(`Fetching ${TOP_ALBUMS.length} albums...`);

  for (const { title, artist } of TOP_ALBUMS) {
    await delay(1100); // MusicBrainz rate limit: 1 req/sec

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

    const hasCover = await hasCoverArt(result.id);
    await delay(1100);

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

  // Merge with existing
  const merged = [...existing.default, ...albums];
  writeFileSync("data/albums.json", JSON.stringify(merged, null, 2));

  console.log(`\nDone! Added ${albums.length} new albums.`);
  console.log(`Total: ${merged.length} albums`);
}

main().catch(console.error);
