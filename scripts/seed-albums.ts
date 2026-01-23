import { writeFileSync, existsSync, readFileSync } from "fs";

// Albums organized by category for easier maintenance
// Each category aims for balanced representation across eras and genres

const CLASSIC_ROCK_60S_70S = [
  // Already in list: Led Zeppelin IV, The Wall, Wish You Were Here, Animals, etc.
  { title: "Who's Next", artist: "The Who" },
  { title: "Tommy", artist: "The Who" },
  { title: "Quadrophenia", artist: "The Who" },
  { title: "Physical Graffiti", artist: "Led Zeppelin" },
  { title: "Houses of the Holy", artist: "Led Zeppelin" },
  { title: "Led Zeppelin II", artist: "Led Zeppelin" },
  { title: "Aqualung", artist: "Jethro Tull" },
  { title: "The Yes Album", artist: "Yes" },
  { title: "Close to the Edge", artist: "Yes" },
  { title: "Fragile", artist: "Yes" },
  { title: "Selling England by the Pound", artist: "Genesis" },
  { title: "The Lamb Lies Down on Broadway", artist: "Genesis" },
  { title: "Foxtrot", artist: "Genesis" },
  { title: "Paranoid", artist: "Black Sabbath" },
  { title: "Master of Reality", artist: "Black Sabbath" },
  { title: "Black Sabbath", artist: "Black Sabbath" },
  { title: "Machine Head", artist: "Deep Purple" },
  { title: "Made in Japan", artist: "Deep Purple" },
  { title: "II", artist: "Led Zeppelin" },
  { title: "Layla and Other Assorted Love Songs", artist: "Derek and the Dominos" },
  { title: "Abraxas", artist: "Santana" },
  { title: "Boston", artist: "Boston" },
  { title: "Van Halen", artist: "Van Halen" },
  { title: "1984", artist: "Van Halen" },
  { title: "Moving Pictures", artist: "Rush" },
  { title: "2112", artist: "Rush" },
  { title: "Permanent Waves", artist: "Rush" },
  { title: "Hemispheres", artist: "Rush" },
  { title: "Crime of the Century", artist: "Supertramp" },
  { title: "Breakfast in America", artist: "Supertramp" },
];

const SOUL_FUNK_RNB = [
  // Already in list: What's Going On, Songs in the Key of Life, Purple Rain
  { title: "Off the Wall", artist: "Michael Jackson" },
  { title: "Superfly", artist: "Curtis Mayfield" },
  { title: "There's a Riot Goin' On", artist: "Sly & the Family Stone" },
  { title: "Stand!", artist: "Sly & the Family Stone" },
  { title: "I Never Loved a Man the Way I Love You", artist: "Aretha Franklin" },
  { title: "Lady Soul", artist: "Aretha Franklin" },
  { title: "I Want You", artist: "Marvin Gaye" },
  { title: "Let's Get It On", artist: "Marvin Gaye" },
  { title: "Talking Book", artist: "Stevie Wonder" },
  { title: "Sign 'O' the Times", artist: "Prince" },
  { title: "1999", artist: "Prince" },
  { title: "Dirty Mind", artist: "Prince" },
  { title: "Voodoo", artist: "D'Angelo" },
  { title: "Brown Sugar", artist: "D'Angelo" },
  { title: "Black Messiah", artist: "D'Angelo" },
  { title: "Baduizm", artist: "Erykah Badu" },
  { title: "Mama's Gun", artist: "Erykah Badu" },
  { title: "Maxwell's Urban Hang Suite", artist: "Maxwell" },
  { title: "The Essential Sly & the Family Stone", artist: "Sly & the Family Stone" },
  { title: "Curtis", artist: "Curtis Mayfield" },
];

const NEW_WAVE_80S = [
  // Already in list: Violator, Unknown Pleasures, Closer
  { title: "Remain in Light", artist: "Talking Heads" },
  { title: "Fear of Music", artist: "Talking Heads" },
  { title: "Speaking in Tongues", artist: "Talking Heads" },
  { title: "Stop Making Sense", artist: "Talking Heads" },
  { title: "More Songs About Buildings and Food", artist: "Talking Heads" },
  { title: "Parallel Lines", artist: "Blondie" },
  { title: "The Pleasure Principle", artist: "Gary Numan" },
  { title: "Synchronicity", artist: "The Police" },
  { title: "Regatta de Blanc", artist: "The Police" },
  { title: "Ghost in the Machine", artist: "The Police" },
  { title: "Power, Corruption & Lies", artist: "New Order" },
  { title: "Technique", artist: "New Order" },
  { title: "Substance", artist: "New Order" },
  { title: "The Head on the Door", artist: "The Cure" },
  { title: "Kiss Me, Kiss Me, Kiss Me", artist: "The Cure" },
  { title: "Music for the Masses", artist: "Depeche Mode" },
  { title: "Black Celebration", artist: "Depeche Mode" },
  { title: "Songs of Faith and Devotion", artist: "Depeche Mode" },
  { title: "Rio", artist: "Duran Duran" },
  { title: "Seven and the Ragged Tiger", artist: "Duran Duran" },
  { title: "Hounds of Love", artist: "Kate Bush" },
  { title: "The Dreaming", artist: "Kate Bush" },
  { title: "Dare", artist: "The Human League" },
  { title: "Upstairs at Eric's", artist: "Yazoo" },
  { title: "Tin Drum", artist: "Japan" },
];

const POP_80S_90S = [
  // Already in list: True Blue, Like a Virgin, Baby One More Time
  { title: "Ray of Light", artist: "Madonna" },
  { title: "The Immaculate Collection", artist: "Madonna" },
  { title: "Confessions on a Dance Floor", artist: "Madonna" },
  { title: "Like a Prayer", artist: "Madonna" },
  { title: "Janet Jackson's Rhythm Nation 1814", artist: "Janet Jackson" },
  { title: "Control", artist: "Janet Jackson" },
  { title: "The Velvet Rope", artist: "Janet Jackson" },
  { title: "Whitney Houston", artist: "Whitney Houston" },
  { title: "I Wanna Dance with Somebody", artist: "Whitney Houston" },
  { title: "Faith", artist: "George Michael" },
  { title: "Listen Without Prejudice Vol. 1", artist: "George Michael" },
  { title: "So", artist: "Peter Gabriel" },
  { title: "Invisible Touch", artist: "Genesis" },
  { title: "No Jacket Required", artist: "Phil Collins" },
  { title: "...But Seriously", artist: "Phil Collins" },
  { title: "Oops!... I Did It Again", artist: "Britney Spears" },
  { title: "In the Zone", artist: "Britney Spears" },
  { title: "Spice", artist: "Spice Girls" },
  { title: "The Sign", artist: "Ace of Base" },
  { title: "Tragic Kingdom", artist: "No Doubt" },
];

const METAL = [
  // Already in list: Metallica, Appetite for Destruction, Paranoid
  { title: "Master of Puppets", artist: "Metallica" },
  { title: "Ride the Lightning", artist: "Metallica" },
  { title: "...And Justice for All", artist: "Metallica" },
  { title: "Kill 'Em All", artist: "Metallica" },
  { title: "The Number of the Beast", artist: "Iron Maiden" },
  { title: "Powerslave", artist: "Iron Maiden" },
  { title: "Piece of Mind", artist: "Iron Maiden" },
  { title: "Seventh Son of a Seventh Son", artist: "Iron Maiden" },
  { title: "Reign in Blood", artist: "Slayer" },
  { title: "South of Heaven", artist: "Slayer" },
  { title: "Seasons in the Abyss", artist: "Slayer" },
  { title: "Among the Living", artist: "Anthrax" },
  { title: "Peace Sells... but Who's Buying?", artist: "Megadeth" },
  { title: "Rust in Peace", artist: "Megadeth" },
  { title: "Countdown to Extinction", artist: "Megadeth" },
  { title: "Ace of Spades", artist: "Motörhead" },
  { title: "Screaming for Vengeance", artist: "Judas Priest" },
  { title: "British Steel", artist: "Judas Priest" },
  { title: "Painkiller", artist: "Judas Priest" },
  { title: "Vulgar Display of Power", artist: "Pantera" },
  { title: "Cowboys from Hell", artist: "Pantera" },
  { title: "Far Beyond Driven", artist: "Pantera" },
];

const GRUNGE_ALT_90S = [
  // Already in list: Nevermind, In Utero, Ten, Dirt
  { title: "Superunknown", artist: "Soundgarden" },
  { title: "Badmotorfinger", artist: "Soundgarden" },
  { title: "Down on the Upside", artist: "Soundgarden" },
  { title: "Core", artist: "Stone Temple Pilots" },
  { title: "Purple", artist: "Stone Temple Pilots" },
  { title: "Tiny Music... Songs from the Vatican Gift Shop", artist: "Stone Temple Pilots" },
  { title: "Facelift", artist: "Alice in Chains" },
  { title: "Siamese Dream", artist: "Smashing Pumpkins" },
  { title: "Mellon Collie and the Infinite Sadness", artist: "Smashing Pumpkins" },
  { title: "Gish", artist: "Smashing Pumpkins" },
  { title: "August and Everything After", artist: "Counting Crows" },
  { title: "Throwing Copper", artist: "Live" },
  { title: "Vs.", artist: "Pearl Jam" },
  { title: "Vitalogy", artist: "Pearl Jam" },
  { title: "No Code", artist: "Pearl Jam" },
  { title: "Yield", artist: "Pearl Jam" },
  { title: "Blue", artist: "Third Eye Blind" },
  { title: "Frogstomp", artist: "Silverchair" },
];

const HIP_HOP_GOLDEN_AGE = [
  // Already in list: Illmatic, Ready to Die, 36 Chambers, The Low End Theory, Straight Outta Compton, The Chronic
  { title: "Paid in Full", artist: "Eric B. & Rakim" },
  { title: "It Takes a Nation of Millions to Hold Us Back", artist: "Public Enemy" },
  { title: "Fear of a Black Planet", artist: "Public Enemy" },
  { title: "Raising Hell", artist: "Run-DMC" },
  { title: "Licensed to Ill", artist: "Beastie Boys" },
  { title: "Paul's Boutique", artist: "Beastie Boys" },
  { title: "Check Your Head", artist: "Beastie Boys" },
  { title: "Ill Communication", artist: "Beastie Boys" },
  { title: "Criminal Minded", artist: "Boogie Down Productions" },
  { title: "By All Means Necessary", artist: "Boogie Down Productions" },
  { title: "Midnight Marauders", artist: "A Tribe Called Quest" },
  { title: "The Score", artist: "Fugees" },
  { title: "Me Against the World", artist: "2Pac" },
  { title: "All Eyez on Me", artist: "2Pac" },
  { title: "Life After Death", artist: "The Notorious B.I.G." },
  { title: "Doggystyle", artist: "Snoop Dogg" },
  { title: "Only Built 4 Cuban Linx...", artist: "Raekwon" },
  { title: "Liquid Swords", artist: "GZA" },
  { title: "Tical", artist: "Method Man" },
  { title: "Reasonable Doubt", artist: "Jay-Z" },
];

const HIP_HOP_2000S = [
  // Already in list: MBDTF, College Dropout, good kid m.A.A.d city, To Pimp a Butterfly
  { title: "The Blueprint", artist: "Jay-Z" },
  { title: "The Black Album", artist: "Jay-Z" },
  { title: "Stankonia", artist: "OutKast" },
  { title: "Speakerboxxx/The Love Below", artist: "OutKast" },
  { title: "ATLiens", artist: "OutKast" },
  { title: "Aquemini", artist: "OutKast" },
  { title: "The Marshall Mathers LP", artist: "Eminem" },
  { title: "The Slim Shady LP", artist: "Eminem" },
  { title: "The Eminem Show", artist: "Eminem" },
  { title: "Get Rich or Die Tryin'", artist: "50 Cent" },
  { title: "Late Registration", artist: "Kanye West" },
  { title: "Graduation", artist: "Kanye West" },
  { title: "808s & Heartbreak", artist: "Kanye West" },
  { title: "Madvillainy", artist: "Madvillain" },
  { title: "Mm..Food", artist: "MF DOOM" },
  { title: "Operation: Doomsday", artist: "MF DOOM" },
  { title: "Tha Carter III", artist: "Lil Wayne" },
  { title: "Tha Carter II", artist: "Lil Wayne" },
];

const INDIE_ROCK_2000S = [
  // Already in list: Is This It
  { title: "Room on Fire", artist: "The Strokes" },
  { title: "First Impressions of Earth", artist: "The Strokes" },
  { title: "Turn On the Bright Lights", artist: "Interpol" },
  { title: "Antics", artist: "Interpol" },
  { title: "Funeral", artist: "Arcade Fire" },
  { title: "Neon Bible", artist: "Arcade Fire" },
  { title: "The Suburbs", artist: "Arcade Fire" },
  { title: "Silent Alarm", artist: "Bloc Party" },
  { title: "A Weekend in the City", artist: "Bloc Party" },
  { title: "Franz Ferdinand", artist: "Franz Ferdinand" },
  { title: "You Could Have It So Much Better", artist: "Franz Ferdinand" },
  { title: "Employment", artist: "Kaiser Chiefs" },
  { title: "Oracular Spectacular", artist: "MGMT" },
  { title: "Congratulations", artist: "MGMT" },
  { title: "Wolfgang Amadeus Phoenix", artist: "Phoenix" },
  { title: "It's Blitz!", artist: "Yeah Yeah Yeahs" },
  { title: "Fever to Tell", artist: "Yeah Yeah Yeahs" },
  { title: "For Emma, Forever Ago", artist: "Bon Iver" },
  { title: "Bon Iver", artist: "Bon Iver" },
  { title: "22, A Million", artist: "Bon Iver" },
  { title: "Give Up", artist: "The Postal Service" },
  { title: "Transatlanticism", artist: "Death Cab for Cutie" },
  { title: "Plans", artist: "Death Cab for Cutie" },
  { title: "Narrow Stairs", artist: "Death Cab for Cutie" },
];

const ELECTRONIC_DANCE = [
  { title: "Discovery", artist: "Daft Punk" },
  { title: "Homework", artist: "Daft Punk" },
  { title: "Random Access Memories", artist: "Daft Punk" },
  { title: "Human After All", artist: "Daft Punk" },
  { title: "Dig Your Own Hole", artist: "The Chemical Brothers" },
  { title: "Surrender", artist: "The Chemical Brothers" },
  { title: "Exit Planet Dust", artist: "The Chemical Brothers" },
  { title: "Selected Ambient Works 85-92", artist: "Aphex Twin" },
  { title: "Richard D. James Album", artist: "Aphex Twin" },
  { title: "...I Care Because You Do", artist: "Aphex Twin" },
  { title: "Music Has the Right to Children", artist: "Boards of Canada" },
  { title: "Geogaddi", artist: "Boards of Canada" },
  { title: "Play", artist: "Moby" },
  { title: "18", artist: "Moby" },
  { title: "Cross", artist: "Justice" },
  { title: "In Colour", artist: "Jamie xx" },
  { title: "xx", artist: "The xx" },
  { title: "Coexist", artist: "The xx" },
  { title: "I See You", artist: "The xx" },
  { title: "Mezzanine", artist: "Massive Attack" },
  { title: "Blue Lines", artist: "Massive Attack" },
  { title: "Protection", artist: "Massive Attack" },
  { title: "Third", artist: "Portishead" },
  { title: "Maxinquaye", artist: "Tricky" },
];

const COUNTRY = [
  { title: "No Fences", artist: "Garth Brooks" },
  { title: "Ropin' the Wind", artist: "Garth Brooks" },
  { title: "The Chase", artist: "Garth Brooks" },
  { title: "At Folsom Prison", artist: "Johnny Cash" },
  { title: "At San Quentin", artist: "Johnny Cash" },
  { title: "American Recordings", artist: "Johnny Cash" },
  { title: "American IV: The Man Comes Around", artist: "Johnny Cash" },
  { title: "Coat of Many Colors", artist: "Dolly Parton" },
  { title: "Jolene", artist: "Dolly Parton" },
  { title: "9 to 5 and Odd Jobs", artist: "Dolly Parton" },
  { title: "The Red Headed Stranger", artist: "Willie Nelson" },
  { title: "Stardust", artist: "Willie Nelson" },
  { title: "Shotgun Willie", artist: "Willie Nelson" },
  { title: "Guitar Town", artist: "Steve Earle" },
  { title: "Copperhead Road", artist: "Steve Earle" },
  { title: "Car Wheels on a Gravel Road", artist: "Lucinda Williams" },
  { title: "Wrecking Ball", artist: "Emmylou Harris" },
  { title: "Trio", artist: "Dolly Parton, Emmylou Harris & Linda Ronstadt" },
];

const JAZZ = [
  // Already in list: Kind of Blue, A Love Supreme
  { title: "Bitches Brew", artist: "Miles Davis" },
  { title: "In a Silent Way", artist: "Miles Davis" },
  { title: "Sketches of Spain", artist: "Miles Davis" },
  { title: "Milestones", artist: "Miles Davis" },
  { title: "Blue Train", artist: "John Coltrane" },
  { title: "Giant Steps", artist: "John Coltrane" },
  { title: "My Favorite Things", artist: "John Coltrane" },
  { title: "Brilliant Corners", artist: "Thelonious Monk" },
  { title: "Monk's Dream", artist: "Thelonious Monk" },
  { title: "Mingus Ah Um", artist: "Charles Mingus" },
  { title: "The Black Saint and the Sinner Lady", artist: "Charles Mingus" },
  { title: "Time Out", artist: "Dave Brubeck Quartet" },
  { title: "Saxophone Colossus", artist: "Sonny Rollins" },
  { title: "Maiden Voyage", artist: "Herbie Hancock" },
  { title: "Head Hunters", artist: "Herbie Hancock" },
  { title: "Somethin' Else", artist: "Cannonball Adderley" },
  { title: "The Shape of Jazz to Come", artist: "Ornette Coleman" },
  { title: "Sunday at the Village Vanguard", artist: "Bill Evans Trio" },
];

const WORLD_MUSIC = [
  { title: "Buena Vista Social Club", artist: "Buena Vista Social Club" },
  { title: "Zombie", artist: "Fela Kuti" },
  { title: "Expensive Shit", artist: "Fela Kuti" },
  { title: "Talking Timbuktu", artist: "Ali Farka Touré and Ry Cooder" },
  { title: "Manu Chao", artist: "Clandestino" },
  { title: "Rhythm of the Saints", artist: "Paul Simon" },
  { title: "Paris Combo", artist: "Paris Combo" },
  { title: "Miriam Makeba", artist: "Miriam Makeba" },
  { title: "Cesaria", artist: "Cesária Évora" },
  { title: "Clube da Esquina", artist: "Milton Nascimento" },
  { title: "Construção", artist: "Chico Buarque" },
];

const MODERN_POP_2010S = [
  // Already in list: 21 (Adele), Channel Orange, Blonde
  { title: "25", artist: "Adele" },
  { title: "30", artist: "Adele" },
  { title: "1989", artist: "Taylor Swift" },
  { title: "Red", artist: "Taylor Swift" },
  { title: "Folklore", artist: "Taylor Swift" },
  { title: "Evermore", artist: "Taylor Swift" },
  { title: "Anti", artist: "Rihanna" },
  { title: "Loud", artist: "Rihanna" },
  { title: "Good Girl Gone Bad", artist: "Rihanna" },
  { title: "Lemonade", artist: "Beyoncé" },
  { title: "Beyoncé", artist: "Beyoncé" },
  { title: "The Fame Monster", artist: "Lady Gaga" },
  { title: "Born This Way", artist: "Lady Gaga" },
  { title: "Chromatica", artist: "Lady Gaga" },
  { title: "Future Nostalgia", artist: "Dua Lipa" },
  { title: "After Hours", artist: "The Weeknd" },
  { title: "Starboy", artist: "The Weeknd" },
  { title: "Beauty Behind the Madness", artist: "The Weeknd" },
  { title: "House of Balloons", artist: "The Weeknd" },
  { title: "Ctrl", artist: "SZA" },
  { title: "SOS", artist: "SZA" },
  { title: "When We All Fall Asleep, Where Do We Go?", artist: "Billie Eilish" },
  { title: "Happier Than Ever", artist: "Billie Eilish" },
  { title: "thank u, next", artist: "Ariana Grande" },
  { title: "Sweetener", artist: "Ariana Grande" },
  { title: "Positions", artist: "Ariana Grande" },
];

const MODERN_RAP_2010S_20S = [
  // Already in list: good kid m.A.A.d city, TPAB
  { title: "DAMN.", artist: "Kendrick Lamar" },
  { title: "Section.80", artist: "Kendrick Lamar" },
  { title: "Mr. Morale & The Big Steppers", artist: "Kendrick Lamar" },
  { title: "Yeezus", artist: "Kanye West" },
  { title: "The Life of Pablo", artist: "Kanye West" },
  { title: "Kids See Ghosts", artist: "Kids See Ghosts" },
  { title: "IGOR", artist: "Tyler, The Creator" },
  { title: "Flower Boy", artist: "Tyler, The Creator" },
  { title: "Call Me If You Get Lost", artist: "Tyler, The Creator" },
  { title: "Nothing Was the Same", artist: "Drake" },
  { title: "Take Care", artist: "Drake" },
  { title: "If You're Reading This It's Too Late", artist: "Drake" },
  { title: "Views", artist: "Drake" },
  { title: "Rodeo", artist: "Travis Scott" },
  { title: "Astroworld", artist: "Travis Scott" },
  { title: "DS2", artist: "Future" },
  { title: "4:44", artist: "Jay-Z" },
  { title: "Run the Jewels 2", artist: "Run the Jewels" },
  { title: "Run the Jewels 3", artist: "Run the Jewels" },
  { title: "Atrocity Exhibition", artist: "Danny Brown" },
  { title: "Some Rap Songs", artist: "Earl Sweatshirt" },
];

const MODERN_INDIE_ALT = [
  { title: "Currents", artist: "Tame Impala" },
  { title: "Lonerism", artist: "Tame Impala" },
  { title: "Innerspeaker", artist: "Tame Impala" },
  { title: "The Slow Rush", artist: "Tame Impala" },
  { title: "AM", artist: "Arctic Monkeys" },
  { title: "Favourite Worst Nightmare", artist: "Arctic Monkeys" },
  { title: "Whatever People Say I Am, That's What I'm Not", artist: "Arctic Monkeys" },
  { title: "Tranquility Base Hotel & Casino", artist: "Arctic Monkeys" },
  { title: "Hot Fuss", artist: "The Killers" },
  { title: "Sam's Town", artist: "The Killers" },
  { title: "An Awesome Wave", artist: "Alt-J" },
  { title: "This Is Happening", artist: "LCD Soundsystem" },
  { title: "Sound of Silver", artist: "LCD Soundsystem" },
  { title: "American Dream", artist: "LCD Soundsystem" },
  { title: "Hospice", artist: "The Antlers" },
  { title: "The Age of Adz", artist: "Sufjan Stevens" },
  { title: "Illinois", artist: "Sufjan Stevens" },
  { title: "Carrie & Lowell", artist: "Sufjan Stevens" },
  { title: "Teen Dream", artist: "Beach House" },
  { title: "Depression Cherry", artist: "Beach House" },
  { title: "7", artist: "Beach House" },
  { title: "Bloom", artist: "Beach House" },
  { title: "In the Aeroplane Over the Sea", artist: "Neutral Milk Hotel" },
  { title: "The Glow Pt. 2", artist: "The Microphones" },
];

// Combine all albums
const TOP_ALBUMS = [
  ...CLASSIC_ROCK_60S_70S,
  ...SOUL_FUNK_RNB,
  ...NEW_WAVE_80S,
  ...POP_80S_90S,
  ...METAL,
  ...GRUNGE_ALT_90S,
  ...HIP_HOP_GOLDEN_AGE,
  ...HIP_HOP_2000S,
  ...INDIE_ROCK_2000S,
  ...ELECTRONIC_DANCE,
  ...COUNTRY,
  ...JAZZ,
  ...WORLD_MUSIC,
  ...MODERN_POP_2010S,
  ...MODERN_RAP_2010S_20S,
  ...MODERN_INDIE_ALT,
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

function loadExistingAlbums(): Album[] {
  const path = "data/albums.json";
  if (existsSync(path)) {
    const content = readFileSync(path, "utf-8");
    return JSON.parse(content);
  }
  return [];
}

function saveAlbums(albums: Album[]) {
  writeFileSync("data/albums.json", JSON.stringify(albums, null, 2));
}

async function main() {
  const existingAlbums = loadExistingAlbums();
  const existingTitles = new Set(
    existingAlbums.map((a) => `${a.title.toLowerCase()}|${a.artist.toLowerCase()}`)
  );

  // Filter out albums that already exist (by title+artist combo)
  const albumsToProcess = TOP_ALBUMS.filter(
    (a) => !existingTitles.has(`${a.title.toLowerCase()}|${a.artist.toLowerCase()}`)
  );

  console.log(`\n📀 Vinydle Album Seeder`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Existing albums: ${existingAlbums.filter((a) => a.isAnswer !== false).length} answer albums`);
  console.log(`Albums to process: ${albumsToProcess.length}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━\n`);

  if (albumsToProcess.length === 0) {
    console.log("✓ All albums already in database!");
    return;
  }

  let added = 0;
  let failed = 0;
  let noCover = 0;

  for (let i = 0; i < albumsToProcess.length; i++) {
    const { title, artist } = albumsToProcess[i];
    const progress = `[${i + 1}/${albumsToProcess.length}]`;

    await delay(1100); // MusicBrainz rate limit: 1 req/sec

    console.log(`${progress} Searching: ${title} - ${artist}`);
    const result = await searchMusicBrainz(title, artist);

    if (!result) {
      console.log(`  ✗ Not found on MusicBrainz`);
      failed++;
      continue;
    }

    // Check if this ID already exists
    if (existingAlbums.some((a) => a.id === result.id)) {
      console.log(`  ⊘ Already exists (different title/artist match)`);
      continue;
    }

    await delay(1100);
    const hasCover = await hasCoverArt(result.id);

    if (!hasCover) {
      console.log(`  ✗ No cover art available`);
      noCover++;
      continue;
    }

    const newAlbum: Album = {
      id: result.id,
      title,
      artist,
      coverUrl: `https://coverartarchive.org/release/${result.id}/front-500`,
      releaseYear: result.year,
    };

    // Add to existing albums and save incrementally
    existingAlbums.push(newAlbum);
    saveAlbums(existingAlbums);

    added++;
    console.log(`  ✓ Added (${result.year || "unknown year"}) - Total: ${existingAlbums.filter((a) => a.isAnswer !== false).length}`);
  }

  // Final summary
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 Summary`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✓ Added: ${added}`);
  console.log(`✗ Not found: ${failed}`);
  console.log(`✗ No cover: ${noCover}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Total answer albums: ${existingAlbums.filter((a) => a.isAnswer !== false).length}`);
}

main().catch(console.error);
