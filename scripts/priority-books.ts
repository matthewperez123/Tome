export interface PriorityBook {
  order: number;
  title: string;
  author: string;
  standardEbooksSlug: string | null;
  gutenbergId?: number;
  tradition: string;
  era: 'Ancient' | 'Medieval' | 'Renaissance' | 'Enlightenment' | 'Modern' | 'Contemporary';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Scholar';
  genres: string[];
  year: number;
  isTier1: boolean;
  painting: {
    title: string;
    artist: string;
    year: string;
    source: string;
  };
  /** Optional: regex pattern to filter EPUB files when the source contains multiple works (e.g., "inferno" for Divine Comedy) */
  epubFileFilter?: string;
}

export const PRIORITY_BOOKS: PriorityBook[] = [
  // TIER 1 — The Demo Five
  { order: 1, title: "The Odyssey", author: "Homer",
    standardEbooksSlug: "homer/the-odyssey/samuel-butler", gutenbergId: 1727,
    tradition: "Ancient Greek", era: "Ancient", difficulty: "Intermediate",
    genres: ["Epic Poetry", "Mythology"], year: -800, isTier1: true,
    painting: { title: "Ulysses and the Sirens", artist: "J.W. Waterhouse", year: "1891", source: "Public Domain" }},
  { order: 2, title: "Inferno", author: "Dante Alighieri",
    standardEbooksSlug: "dante-alighieri/the-divine-comedy/henry-wadsworth-longfellow", gutenbergId: 1001,
    tradition: "Medieval European", era: "Medieval", difficulty: "Advanced",
    genres: ["Epic Poetry"], year: 1320, isTier1: true,
    painting: { title: "The Barque of Dante", artist: "Eugène Delacroix", year: "1822", source: "Louvre PD" },
    epubFileFilter: "^inferno$" },
  { order: 3, title: "Pride and Prejudice", author: "Jane Austen",
    standardEbooksSlug: "jane-austen/pride-and-prejudice", gutenbergId: 1342,
    tradition: "Romantic", era: "Modern", difficulty: "Beginner",
    genres: ["Novel"], year: 1813, isTier1: true,
    painting: { title: "Madame X", artist: "John Singer Sargent", year: "1884", source: "Met CC0" }},
  { order: 4, title: "Frankenstein", author: "Mary Shelley",
    standardEbooksSlug: "mary-shelley/frankenstein", gutenbergId: 84,
    tradition: "Romantic", era: "Modern", difficulty: "Intermediate",
    genres: ["Novel"], year: 1818, isTier1: true,
    painting: { title: "Wanderer Above the Sea of Fog", artist: "Caspar David Friedrich", year: "c.1818", source: "PD" }},
  { order: 5, title: "Meditations", author: "Marcus Aurelius",
    standardEbooksSlug: "marcus-aurelius/meditations/george-long", gutenbergId: 2680,
    tradition: "Roman", era: "Ancient", difficulty: "Beginner",
    genres: ["Philosophy", "Essay / Memoir"], year: 180, isTier1: true,
    painting: { title: "The Death of Socrates", artist: "Jacques-Louis David", year: "1787", source: "Met CC0" }},

  // TIER 2 — Library Depth
  { order: 6, title: "The Iliad", author: "Homer",
    standardEbooksSlug: "homer/the-iliad/samuel-butler", gutenbergId: 2199,
    tradition: "Ancient Greek", era: "Ancient", difficulty: "Advanced",
    genres: ["Epic Poetry", "Mythology"], year: -750, isTier1: false,
    painting: { title: "A Reading from Homer", artist: "Lawrence Alma-Tadema", year: "1885", source: "PD" }},
  { order: 7, title: "Moby-Dick", author: "Herman Melville",
    standardEbooksSlug: "herman-melville/moby-dick", gutenbergId: 2701,
    tradition: "American", era: "Modern", difficulty: "Advanced",
    genres: ["Novel"], year: 1851, isTier1: false,
    painting: { title: "The Slave Ship", artist: "J.M.W. Turner", year: "1840", source: "PD" }},
  { order: 8, title: "Crime and Punishment", author: "Fyodor Dostoevsky",
    standardEbooksSlug: "fyodor-dostoevsky/crime-and-punishment/constance-garnett", gutenbergId: 2554,
    tradition: "Russian", era: "Modern", difficulty: "Advanced",
    genres: ["Novel"], year: 1866, isTier1: false,
    painting: { title: "Ivan the Terrible and His Son", artist: "Ilya Repin", year: "1885", source: "Tretyakov PD" }},
  { order: 9, title: "The Republic", author: "Plato",
    standardEbooksSlug: "plato/the-republic/benjamin-jowett", gutenbergId: 1497,
    tradition: "Ancient Greek", era: "Ancient", difficulty: "Advanced",
    genres: ["Philosophy", "Political Theory"], year: -375, isTier1: false,
    painting: { title: "The School of Athens", artist: "Raphael", year: "1511", source: "Vatican PD" }},
  { order: 10, title: "Jane Eyre", author: "Charlotte Brontë",
    standardEbooksSlug: "charlotte-bronte/jane-eyre", gutenbergId: 1260,
    tradition: "Victorian", era: "Modern", difficulty: "Intermediate",
    genres: ["Novel"], year: 1847, isTier1: false,
    painting: { title: "The Oxbow", artist: "Thomas Cole", year: "1836", source: "Met CC0" }},
  { order: 11, title: "Walden", author: "Henry David Thoreau",
    standardEbooksSlug: "henry-david-thoreau/walden", gutenbergId: 205,
    tradition: "American", era: "Modern", difficulty: "Intermediate",
    genres: ["Essay / Memoir", "Philosophy"], year: 1854, isTier1: false,
    painting: { title: "Heart of the Andes", artist: "Frederic Edwin Church", year: "1859", source: "Met CC0" }},
  { order: 12, title: "The Aeneid", author: "Virgil",
    standardEbooksSlug: "virgil/the-aeneid/john-dryden", gutenbergId: 228,
    tradition: "Roman", era: "Ancient", difficulty: "Advanced",
    genres: ["Epic Poetry", "Mythology"], year: -19, isTier1: false,
    painting: { title: "Aeneas Presenting Cupid to Dido", artist: "Giovanni Battista Tiepolo", year: "c.1757", source: "PD" }},
  { order: 13, title: "Wuthering Heights", author: "Emily Brontë",
    standardEbooksSlug: "emily-bronte/wuthering-heights", gutenbergId: 768,
    tradition: "Romantic", era: "Modern", difficulty: "Intermediate",
    genres: ["Novel"], year: 1847, isTier1: false,
    painting: { title: "Abbey in the Oakwood", artist: "Caspar David Friedrich", year: "1810", source: "PD" }},
  { order: 14, title: "The Art of War", author: "Sun Tzu",
    standardEbooksSlug: "sun-tzu/the-art-of-war/lionel-giles", gutenbergId: 132,
    tradition: "Eastern", era: "Ancient", difficulty: "Beginner",
    genres: ["Philosophy", "Political Theory"], year: -500, isTier1: false,
    painting: { title: "The Great Wave off Kanagawa", artist: "Katsushika Hokusai", year: "c.1831", source: "Met CC0" }},
  { order: 15, title: "Metamorphoses", author: "Ovid",
    standardEbooksSlug: "ovid/metamorphoses/brookes-more", gutenbergId: 26073,
    tradition: "Roman", era: "Ancient", difficulty: "Advanced",
    genres: ["Epic Poetry", "Mythology"], year: 8, isTier1: false,
    painting: { title: "Perseus and Andromeda", artist: "Titian", year: "c.1555", source: "PD" }},

  // TIER 3 — Extended
  { order: 16, title: "Hamlet", author: "William Shakespeare",
    standardEbooksSlug: "william-shakespeare/hamlet", gutenbergId: 1524,
    tradition: "Renaissance", era: "Renaissance", difficulty: "Advanced",
    genres: ["Drama / Play"], year: 1603, isTier1: false,
    painting: { title: "Ophelia", artist: "John Everett Millais", year: "1852", source: "Tate PD" }},
  { order: 17, title: "Les Misérables", author: "Victor Hugo",
    standardEbooksSlug: "victor-hugo/les-miserables/isabel-f-hapgood", gutenbergId: 135,
    tradition: "French", era: "Modern", difficulty: "Advanced",
    genres: ["Novel"], year: 1862, isTier1: false,
    painting: { title: "Liberty Leading the People", artist: "Eugène Delacroix", year: "1830", source: "Louvre PD" }},
  { order: 18, title: "Don Quixote", author: "Miguel de Cervantes",
    standardEbooksSlug: "miguel-de-cervantes-saavedra/don-quixote/john-ormsby", gutenbergId: 996,
    tradition: "Renaissance", era: "Renaissance", difficulty: "Intermediate",
    genres: ["Novel", "Satire"], year: 1605, isTier1: false,
    painting: { title: "Don Quixote and Sancho Panza", artist: "Gustave Doré", year: "1863", source: "PD" }},
  { order: 19, title: "War and Peace", author: "Leo Tolstoy",
    standardEbooksSlug: "leo-tolstoy/war-and-peace/louise-maude_aylmer-maude", gutenbergId: 2600,
    tradition: "Russian", era: "Modern", difficulty: "Advanced",
    genres: ["Novel"], year: 1869, isTier1: false,
    painting: { title: "Napoleon near Borodino", artist: "Vasily Vereshchagin", year: "1897", source: "PD" }},
  { order: 20, title: "The Great Gatsby", author: "F. Scott Fitzgerald",
    standardEbooksSlug: "f-scott-fitzgerald/the-great-gatsby", gutenbergId: 64317,
    tradition: "American", era: "Modern", difficulty: "Beginner",
    genres: ["Novel"], year: 1925, isTier1: false,
    painting: { title: "Nocturne in Blue and Gold", artist: "James McNeill Whistler", year: "c.1872", source: "PD" }},
];
