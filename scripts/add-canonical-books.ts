#!/usr/bin/env npx tsx
/**
 * add-canonical-books.ts
 *
 * Adds 95 canonical books to the Tome app library.
 * Reads meta.json for chapter data, generates TomeBook & TomeChapter entries,
 * and appends them to src/data/books.ts and src/data/chapters.ts.
 *
 * Run: npx tsx scripts/add-canonical-books.ts
 */

import * as fs from "fs";
import * as path from "path";

// ── Paths ──────────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "..");
const BOOKS_FILE = path.join(ROOT, "src/data/books.ts");
const CHAPTERS_FILE = path.join(ROOT, "src/data/chapters.ts");
const CONTENT_DIR = path.join(ROOT, "public/content");

// ── Tradition → Cover Colors ───────────────────────────────────────────────────

const TRADITION_COLORS: Record<string, { primary: string; secondary: string; accent: string }> = {
  Victorian:            { primary: "#2D1B5E", secondary: "#1E1145", accent: "#8B5CF6" },
  Russian:              { primary: "#5C1A1A", secondary: "#3D1010", accent: "#DC2626" },
  American:             { primary: "#143220", secondary: "#0A1F14", accent: "#22C55E" },
  French:               { primary: "#0A1F3D", secondary: "#061428", accent: "#EC4899" },
  Modernist:            { primary: "#111827", secondary: "#0A0F1A", accent: "#14B8A6" },
  Romantic:             { primary: "#4A0E2D", secondary: "#2D0819", accent: "#F43F5E" },
  Renaissance:          { primary: "#3D1A6E", secondary: "#2A1050", accent: "#D97706" },
  Enlightenment:        { primary: "#0F2744", secondary: "#091A2E", accent: "#06B6D4" },
  "Ancient Greek":      { primary: "#1E3A5F", secondary: "#0F2744", accent: "#0EA5E9" },
  "Medieval European":  { primary: "#1B4332", secondary: "#0F2B20", accent: "#F59E0B" },
  Eastern:              { primary: "#5C2800", secondary: "#3D1A00", accent: "#F97316" },
  "Post-Colonial":      { primary: "#065F46", secondary: "#034335", accent: "#10B981" },
  Contemporary:         { primary: "#1A1A2E", secondary: "#111122", accent: "#A78BFA" },
  Scandinavian:         { primary: "#1E293B", secondary: "#0F172A", accent: "#38BDF8" },
  Germanic:             { primary: "#1F2937", secondary: "#111827", accent: "#10B981" },
};

// ── Book Config Interface ──────────────────────────────────────────────────────

interface BookConfig {
  id: string;
  title: string;
  author: string;
  year: number;
  tradition: string;
  era: string;
  genres: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Scholar";
  synopsis: string;
  themes: string[];
  country: string;
  language?: string;
  readingLanguage?: string;
}

// ── Meta.json shape ────────────────────────────────────────────────────────────

interface MetaJson {
  bookId: string;
  title: string;
  author: string;
  chapterCount: number;
  totalWordCount: number;
  totalMinutes: number;
  chapters: Array<{
    index: number;
    title: string;
    wordCount: number;
    estimatedMinutes: number;
  }>;
}

// ── Helper: author → authorId ──────────────────────────────────────────────────

function toAuthorId(author: string): string {
  return author
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Helper: format reading time ────────────────────────────────────────────────

function formatReadingTime(minutes: number): string {
  const hours = Math.round(minutes / 60);
  if (hours < 1) return `~${minutes} minutes`;
  return `~${hours} hour${hours !== 1 ? "s" : ""}`;
}

// ── All 95 Book Configs ────────────────────────────────────────────────────────

const BOOK_CONFIGS: BookConfig[] = [
  {
    id: "the-adventures-of-huckleberry-finn",
    title: "The Adventures of Huckleberry Finn",
    author: "Mark Twain",
    year: 1884,
    tradition: "American",
    era: "Romantic",
    genres: ["Novel", "Satire", "Adventure"],
    difficulty: "Intermediate",
    synopsis: "A runaway boy and an escaped slave float down the Mississippi on a raft, encountering the best and worst of antebellum America in a journey that questions every social convention of the age.",
    themes: ["Freedom", "Race", "Morality", "Coming of age", "Social criticism"],
    country: "USA",
  },
  {
    id: "the-scarlet-pimpernel",
    title: "The Scarlet Pimpernel",
    author: "Baroness Orczy",
    year: 1905,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Adventure", "Historical Fiction", "Romance"],
    difficulty: "Beginner",
    synopsis: "During the French Revolution's Reign of Terror, an English aristocrat leads a double life as the daring Scarlet Pimpernel, secretly rescuing condemned French nobles from the guillotine.",
    themes: ["Heroism", "Disguise", "Revolution", "Love", "Sacrifice"],
    country: "England",
  },
  {
    id: "dracula",
    title: "Dracula",
    author: "Bram Stoker",
    year: 1897,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Gothic", "Horror", "Epistolary Novel"],
    difficulty: "Intermediate",
    synopsis: "An ancient Transylvanian vampire descends upon Victorian England, and a band of determined men and women must hunt him across Europe before his plague of the undead can spread.",
    themes: ["Good vs. evil", "Sexuality", "Modernity", "Imperialism", "Death"],
    country: "Ireland",
  },
  {
    id: "emma",
    title: "Emma",
    author: "Jane Austen",
    year: 1815,
    tradition: "Victorian",
    era: "Romantic",
    genres: ["Novel", "Comedy of Manners", "Romance"],
    difficulty: "Intermediate",
    synopsis: "The handsome, clever, and rich Emma Woodhouse amuses herself by matchmaking among her neighbors, only to discover that the heart she most misunderstands is her own.",
    themes: ["Self-knowledge", "Social class", "Marriage", "Deception", "Growth"],
    country: "England",
  },
  {
    id: "sense-and-sensibility",
    title: "Sense and Sensibility",
    author: "Jane Austen",
    year: 1811,
    tradition: "Victorian",
    era: "Romantic",
    genres: ["Novel", "Romance", "Comedy of Manners"],
    difficulty: "Intermediate",
    synopsis: "Two sisters embody opposing temperaments — one governed by sense, the other by sensibility — as they navigate love, heartbreak, and reduced circumstances in Georgian England.",
    themes: ["Reason vs. emotion", "Love", "Social class", "Resilience", "Sisterhood"],
    country: "England",
  },
  {
    id: "persuasion",
    title: "Persuasion",
    author: "Jane Austen",
    year: 1817,
    tradition: "Victorian",
    era: "Romantic",
    genres: ["Novel", "Romance"],
    difficulty: "Intermediate",
    synopsis: "Eight years after being persuaded to break off an engagement, Anne Elliot encounters Captain Wentworth again and must discover whether second chances at love are possible.",
    themes: ["Constancy", "Regret", "Social pressure", "Maturity", "Second chances"],
    country: "England",
  },
  {
    id: "mansfield-park",
    title: "Mansfield Park",
    author: "Jane Austen",
    year: 1814,
    tradition: "Victorian",
    era: "Romantic",
    genres: ["Novel", "Comedy of Manners"],
    difficulty: "Intermediate",
    synopsis: "Shy Fanny Price is sent to live with wealthy relatives at Mansfield Park, where her quiet virtue is tested by the glamorous Crawford siblings and the moral failings of those around her.",
    themes: ["Morality", "Social class", "Duty", "Home", "Integrity"],
    country: "England",
  },
  {
    id: "northanger-abbey",
    title: "Northanger Abbey",
    author: "Jane Austen",
    year: 1817,
    tradition: "Victorian",
    era: "Romantic",
    genres: ["Novel", "Satire", "Gothic Parody"],
    difficulty: "Beginner",
    synopsis: "A young woman's overactive imagination, fed by Gothic novels, leads her into comic misadventures during a stay at the mysterious Northanger Abbey.",
    themes: ["Imagination vs. reality", "Reading", "Social satire", "Coming of age"],
    country: "England",
  },
  {
    id: "the-turn-of-the-screw",
    title: "The Turn of the Screw",
    author: "Henry James",
    year: 1898,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Gothic", "Novella", "Psychological Horror"],
    difficulty: "Intermediate",
    synopsis: "A governess becomes convinced that the two children in her care are being haunted — or corrupted — by the ghosts of former servants, but the true nature of the threat remains terrifyingly ambiguous.",
    themes: ["Ambiguity", "Innocence", "Corruption", "Perception", "The supernatural"],
    country: "USA",
  },
  {
    id: "the-portrait-of-a-lady",
    title: "The Portrait of a Lady",
    author: "Henry James",
    year: 1881,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Psychological Fiction"],
    difficulty: "Advanced",
    synopsis: "Isabel Archer, a spirited young American abroad, insists on choosing her own destiny, only to find that the freedom she cherishes can become its own kind of prison.",
    themes: ["Freedom", "Marriage", "Identity", "American vs. European values", "Betrayal"],
    country: "USA",
  },
  {
    id: "david-copperfield",
    title: "David Copperfield",
    author: "Charles Dickens",
    year: 1850,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Bildungsroman"],
    difficulty: "Intermediate",
    synopsis: "From an abused childhood through youthful misadventures to literary success, David Copperfield narrates his own coming-of-age in a panoramic portrait of Victorian society.",
    themes: ["Growth", "Memory", "Social class", "Resilience", "Love"],
    country: "England",
  },
  {
    id: "oliver-twist",
    title: "Oliver Twist",
    author: "Charles Dickens",
    year: 1838,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Social Criticism"],
    difficulty: "Beginner",
    synopsis: "An orphan boy escapes the workhouse only to fall into the clutches of a gang of pickpockets in London's criminal underworld, yet his innate goodness refuses to be extinguished.",
    themes: ["Poverty", "Crime", "Innocence", "Social justice", "Identity"],
    country: "England",
  },
  {
    id: "a-christmas-carol",
    title: "A Christmas Carol",
    author: "Charles Dickens",
    year: 1843,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novella", "Fantasy", "Social Criticism"],
    difficulty: "Beginner",
    synopsis: "On Christmas Eve, the miserly Ebenezer Scrooge is visited by three ghosts who force him to confront his past, present, and future — and the possibility of redemption.",
    themes: ["Redemption", "Generosity", "Social responsibility", "Memory", "Transformation"],
    country: "England",
  },
  {
    id: "bleak-house",
    title: "Bleak House",
    author: "Charles Dickens",
    year: 1853,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Social Criticism", "Mystery"],
    difficulty: "Advanced",
    synopsis: "The interminable case of Jarndyce and Jarndyce in the Court of Chancery blights the lives of all it touches, while a secret connects the novel's heroine to a hidden past.",
    themes: ["Justice", "Bureaucracy", "Social class", "Secrets", "Responsibility"],
    country: "England",
  },
  {
    id: "hard-times",
    title: "Hard Times",
    author: "Charles Dickens",
    year: 1854,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Social Criticism"],
    difficulty: "Intermediate",
    synopsis: "In the industrial town of Coketown, the utilitarian philosophy of Mr. Gradgrind crushes imagination and feeling until reality forces a reckoning with what facts alone cannot teach.",
    themes: ["Industrialization", "Education", "Imagination", "Social class", "Compassion"],
    country: "England",
  },
  {
    id: "the-strange-case-of-dr-jekyll-and-mr-hyde",
    title: "The Strange Case of Dr. Jekyll and Mr. Hyde",
    author: "Robert Louis Stevenson",
    year: 1886,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Gothic", "Novella", "Psychological Horror"],
    difficulty: "Beginner",
    synopsis: "A respected London doctor's experiments with a mysterious potion unleash a murderous alter ego, exposing the beast that lurks beneath Victorian respectability.",
    themes: ["Duality", "Good vs. evil", "Repression", "Science", "Identity"],
    country: "Scotland",
  },
  {
    id: "treasure-island",
    title: "Treasure Island",
    author: "Robert Louis Stevenson",
    year: 1883,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Adventure", "Novel"],
    difficulty: "Beginner",
    synopsis: "Young Jim Hawkins discovers a pirate's treasure map and sets sail on a perilous voyage, only to find that the charming ship's cook Long John Silver is the most dangerous man aboard.",
    themes: ["Adventure", "Greed", "Loyalty", "Coming of age", "Deception"],
    country: "Scotland",
  },
  {
    id: "the-hound-of-the-baskervilles",
    title: "The Hound of the Baskervilles",
    author: "Arthur Conan Doyle",
    year: 1902,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Mystery", "Gothic", "Detective Fiction"],
    difficulty: "Beginner",
    synopsis: "Sherlock Holmes investigates the legend of a spectral hound that haunts the Baskerville family on the fog-shrouded moors of Devonshire.",
    themes: ["Mystery", "Reason vs. superstition", "Deception", "Fear", "Justice"],
    country: "England",
  },
  {
    id: "a-study-in-scarlet",
    title: "A Study in Scarlet",
    author: "Arthur Conan Doyle",
    year: 1887,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Mystery", "Detective Fiction"],
    difficulty: "Beginner",
    synopsis: "Dr. Watson meets Sherlock Holmes and is drawn into a baffling murder case that leads from a London boarding house to the Mormon settlements of the American West.",
    themes: ["Deduction", "Justice", "Revenge", "Friendship", "Mystery"],
    country: "England",
  },
  {
    id: "the-sign-of-the-four",
    title: "The Sign of the Four",
    author: "Arthur Conan Doyle",
    year: 1890,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Mystery", "Detective Fiction", "Adventure"],
    difficulty: "Beginner",
    synopsis: "A young woman receives a mysterious pearl each year, and Holmes traces the trail to a stolen Indian treasure, a one-legged convict, and a deadly pact sworn decades ago.",
    themes: ["Mystery", "Greed", "Colonialism", "Justice", "Loyalty"],
    country: "England",
  },
  {
    id: "the-time-machine",
    title: "The Time Machine",
    author: "H. G. Wells",
    year: 1895,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Science Fiction", "Novella"],
    difficulty: "Beginner",
    synopsis: "A Victorian inventor travels to the year 802,701 to discover that humanity has split into two species — the gentle Eloi and the predatory Morlocks — in a chilling vision of evolution's end.",
    themes: ["Time", "Evolution", "Class warfare", "Entropy", "Science"],
    country: "England",
  },
  {
    id: "the-war-of-the-worlds",
    title: "The War of the Worlds",
    author: "H. G. Wells",
    year: 1898,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Science Fiction", "Invasion Novel"],
    difficulty: "Intermediate",
    synopsis: "Martian war machines descend on Victorian England, reducing civilization to rubble and its inhabitants to refugees, in a searing allegory of imperial conquest turned inward.",
    themes: ["Imperialism", "Survival", "Science", "Hubris", "Civilization"],
    country: "England",
  },
  {
    id: "the-invisible-man",
    title: "The Invisible Man",
    author: "H. G. Wells",
    year: 1897,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Science Fiction", "Horror"],
    difficulty: "Beginner",
    synopsis: "A scientist discovers the secret of invisibility, but his growing madness and isolation transform what should be a triumph into a reign of terror across the English countryside.",
    themes: ["Science", "Isolation", "Power", "Madness", "Morality"],
    country: "England",
  },
  {
    id: "the-jungle-book",
    title: "The Jungle Book",
    author: "Rudyard Kipling",
    year: 1894,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Short Stories", "Fable", "Children's Literature"],
    difficulty: "Beginner",
    synopsis: "Mowgli, a boy raised by wolves in the Indian jungle, must navigate the laws of the wild and the threat of the tiger Shere Khan to find his place between two worlds.",
    themes: ["Nature vs. civilization", "Law", "Belonging", "Coming of age", "Courage"],
    country: "England",
  },
  {
    id: "kim",
    title: "Kim",
    author: "Rudyard Kipling",
    year: 1901,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Adventure", "Spy Fiction"],
    difficulty: "Intermediate",
    synopsis: "An Irish orphan raised in the streets of Lahore becomes caught between espionage in the Great Game and spiritual pilgrimage with a Tibetan lama across the Indian subcontinent.",
    themes: ["Identity", "Imperialism", "Spirituality", "Coming of age", "East meets West"],
    country: "England",
  },
  {
    id: "siddhartha",
    title: "Siddhartha",
    author: "Hermann Hesse",
    year: 1922,
    tradition: "Germanic",
    era: "Modern",
    genres: ["Novel", "Philosophical Fiction"],
    difficulty: "Beginner",
    synopsis: "A young Brahmin abandons privilege to seek enlightenment, passing through asceticism, sensual pleasure, and despair before discovering that wisdom cannot be taught — only lived.",
    themes: ["Enlightenment", "Self-discovery", "Spirituality", "Experience", "Unity"],
    country: "Germany",
    language: "German",
    readingLanguage: "English",
  },
  {
    id: "a-room-with-a-view",
    title: "A Room with a View",
    author: "E. M. Forster",
    year: 1908,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Comedy of Manners", "Romance"],
    difficulty: "Intermediate",
    synopsis: "A young Englishwoman must choose between the passionate, unconventional George Emerson and the cultured but stifling Cecil Vyse, in a story about breaking free of social constraint.",
    themes: ["Freedom", "Convention", "Passion", "Class", "Italy vs. England"],
    country: "England",
  },
  {
    id: "howards-end",
    title: "Howards End",
    author: "E. M. Forster",
    year: 1910,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Social Commentary"],
    difficulty: "Advanced",
    synopsis: "Three families — the intellectual Schlegels, the commercial Wilcoxes, and the aspirational Basts — collide around a country house that becomes a symbol of England's fractured soul.",
    themes: ["Connection", "Class", "Inheritance", "Culture vs. commerce", "England"],
    country: "England",
  },
  {
    id: "the-age-of-innocence",
    title: "The Age of Innocence",
    author: "Edith Wharton",
    year: 1920,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Social Satire"],
    difficulty: "Intermediate",
    synopsis: "In 1870s New York, a conventional young lawyer finds his carefully ordered life disrupted when his fiancée's scandalous cousin returns from Europe and awakens desires that threaten everything.",
    themes: ["Convention", "Desire", "Social pressure", "Sacrifice", "Nostalgia"],
    country: "USA",
  },
  {
    id: "ethan-frome",
    title: "Ethan Frome",
    author: "Edith Wharton",
    year: 1911,
    tradition: "American",
    era: "Modern",
    genres: ["Novella", "Tragedy"],
    difficulty: "Intermediate",
    synopsis: "In a bleak New England winter, a poor farmer is trapped between his sickly wife and a passionate attachment to her young cousin, with devastating consequences for all three.",
    themes: ["Entrapment", "Desire", "Poverty", "Fate", "Isolation"],
    country: "USA",
  },
  {
    id: "main-street",
    title: "Main Street",
    author: "Sinclair Lewis",
    year: 1920,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Social Satire"],
    difficulty: "Intermediate",
    synopsis: "An idealistic young woman marries a small-town doctor and attempts to bring culture and reform to the stifling conformity of Gopher Prairie, Minnesota.",
    themes: ["Conformity", "Idealism", "Small-town life", "Gender", "American identity"],
    country: "USA",
  },
  {
    id: "arrowsmith",
    title: "Arrowsmith",
    author: "Sinclair Lewis",
    year: 1925,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Social Satire"],
    difficulty: "Intermediate",
    synopsis: "A young doctor struggles between the pure pursuit of medical research and the compromises demanded by commercial medicine, academic politics, and public health bureaucracy.",
    themes: ["Science vs. commerce", "Idealism", "Ambition", "Integrity", "American society"],
    country: "USA",
  },
  {
    id: "babbitt",
    title: "Babbitt",
    author: "Sinclair Lewis",
    year: 1922,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Social Satire"],
    difficulty: "Intermediate",
    synopsis: "A prosperous real-estate broker in a Midwestern city experiences a crisis of conformity, briefly rebels against the emptiness of middle-class life, then retreats to its comfortable certainties.",
    themes: ["Conformity", "Materialism", "Identity", "American Dream", "Rebellion"],
    country: "USA",
  },
  {
    id: "the-sun-also-rises",
    title: "The Sun Also Rises",
    author: "Ernest Hemingway",
    year: 1926,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Modernist Fiction"],
    difficulty: "Intermediate",
    synopsis: "A group of expatriate Americans and British drift through 1920s Paris and Spain, drinking and loving and watching bullfights, while the war's invisible wounds shape everything they cannot say.",
    themes: ["Lost generation", "Masculinity", "Disillusionment", "Love", "War's aftermath"],
    country: "USA",
  },
  {
    id: "this-side-of-paradise",
    title: "This Side of Paradise",
    author: "F. Scott Fitzgerald",
    year: 1920,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Bildungsroman"],
    difficulty: "Intermediate",
    synopsis: "A young Princeton man navigates the heady years of World War I-era America, searching for identity, love, and purpose in a world where the old certainties have shattered.",
    themes: ["Youth", "Ambition", "Disillusionment", "Identity", "American society"],
    country: "USA",
  },
  {
    id: "the-beautiful-and-damned",
    title: "The Beautiful and Damned",
    author: "F. Scott Fitzgerald",
    year: 1922,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Social Satire"],
    difficulty: "Intermediate",
    synopsis: "A handsome young heir and his beautiful wife descend into alcoholism and dissolution while waiting for an enormous inheritance, wasting their youth and promise in the process.",
    themes: ["Wealth", "Decay", "Marriage", "American Dream", "Self-destruction"],
    country: "USA",
  },
  {
    id: "look-homeward-angel",
    title: "Look Homeward, Angel",
    author: "Thomas Wolfe",
    year: 1929,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Autobiographical Fiction"],
    difficulty: "Advanced",
    synopsis: "Eugene Gant grows up in a small Southern town, struggling to escape his eccentric family and provincial surroundings to find his voice as an artist.",
    themes: ["Coming of age", "Family", "Artistic ambition", "Memory", "American South"],
    country: "USA",
  },
  {
    id: "sons-and-lovers",
    title: "Sons and Lovers",
    author: "D. H. Lawrence",
    year: 1913,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Autobiographical Fiction"],
    difficulty: "Intermediate",
    synopsis: "In a Nottinghamshire mining town, a sensitive young man struggles to free himself from the possessive love of his mother and find his own way to manhood.",
    themes: ["Mother-son bond", "Class", "Sexuality", "Industrialization", "Artistic awakening"],
    country: "England",
  },
  {
    id: "women-in-love",
    title: "Women in Love",
    author: "D. H. Lawrence",
    year: 1920,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Psychological Fiction"],
    difficulty: "Advanced",
    synopsis: "Two sisters pursue radically different paths in love — one seeking spiritual communion, the other sensual fulfillment — while the industrial Midlands crumble around them.",
    themes: ["Love", "Sexuality", "Industrialization", "Death drive", "Modern consciousness"],
    country: "England",
  },
  {
    id: "the-rainbow",
    title: "The Rainbow",
    author: "D. H. Lawrence",
    year: 1915,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Family Saga"],
    difficulty: "Advanced",
    synopsis: "Three generations of the Brangwen family evolve from rural rootedness to modern restlessness, as the women especially struggle toward self-realization against the constraints of their age.",
    themes: ["Generational change", "Sexuality", "Spirituality", "Modernity", "Women's liberation"],
    country: "England",
  },
  {
    id: "the-sound-and-the-fury",
    title: "The Sound and the Fury",
    author: "William Faulkner",
    year: 1929,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Modernist Fiction"],
    difficulty: "Scholar",
    synopsis: "The decline of a once-proud Southern family is told through four voices, including the stream of consciousness of a man with an intellectual disability, in Faulkner's most formally daring novel.",
    themes: ["Decline", "Time", "Memory", "Race", "Southern identity", "Loss"],
    country: "USA",
  },
  {
    id: "the-good-soldier",
    title: "The Good Soldier",
    author: "Ford Madox Ford",
    year: 1915,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Psychological Fiction"],
    difficulty: "Advanced",
    synopsis: "A seemingly perfect friendship between two couples unravels as the narrator discovers a web of adultery, deception, and madness stretching back nine years.",
    themes: ["Deception", "Appearances", "Passion", "English society", "Unreliable narration"],
    country: "England",
  },
  {
    id: "lord-jim",
    title: "Lord Jim",
    author: "Joseph Conrad",
    year: 1900,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Psychological Fiction", "Adventure"],
    difficulty: "Advanced",
    synopsis: "A young officer's moment of cowardice on a sinking ship haunts him across the seas, until he finds a chance at redemption in a remote trading post — at a terrible cost.",
    themes: ["Honor", "Cowardice", "Redemption", "Colonialism", "Self-knowledge"],
    country: "Poland",
  },
  {
    id: "the-secret-agent",
    title: "The Secret Agent",
    author: "Joseph Conrad",
    year: 1907,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Political Thriller"],
    difficulty: "Advanced",
    synopsis: "A seedy London shopkeeper who doubles as a spy is pressured by a foreign embassy to commit a terrorist bombing, setting off a chain of events that destroys everyone around him.",
    themes: ["Terrorism", "Betrayal", "Anarchy", "Domestic life", "Political violence"],
    country: "Poland",
  },
  {
    id: "nostromo",
    title: "Nostromo",
    author: "Joseph Conrad",
    year: 1904,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Political Fiction"],
    difficulty: "Scholar",
    synopsis: "In the fictional South American republic of Costaguana, a legendary Italian boatswain's incorruptible reputation is tested when he is entrusted with a vast treasure during a revolution.",
    themes: ["Corruption", "Idealism", "Imperialism", "Material interests", "Revolution"],
    country: "Poland",
  },
  {
    id: "a-passage-to-india",
    title: "A Passage to India",
    author: "E. M. Forster",
    year: 1924,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Political Fiction"],
    difficulty: "Advanced",
    synopsis: "An alleged assault in the mysterious Marabar Caves exposes the unbridgeable gulf between the British rulers and Indian subjects in colonial India.",
    themes: ["Colonialism", "Race", "Friendship", "Mystery", "Cultural misunderstanding"],
    country: "England",
  },
  {
    id: "middlemarch",
    title: "Middlemarch",
    author: "George Eliot",
    year: 1871,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Social Commentary"],
    difficulty: "Advanced",
    synopsis: "In a provincial English town, the idealistic Dorothea Brooke and the ambitious doctor Lydgate each make disastrous marriages while the community around them buzzes with Reform-era politics and scandal.",
    themes: ["Ambition", "Marriage", "Society", "Idealism", "Reform"],
    country: "England",
  },
  {
    id: "the-mill-on-the-floss",
    title: "The Mill on the Floss",
    author: "George Eliot",
    year: 1860,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Bildungsroman"],
    difficulty: "Intermediate",
    synopsis: "Maggie Tulliver's passionate, intelligent nature clashes with the narrow expectations of her provincial family and community, leading to heartbreak and a devastating climax.",
    themes: ["Gender", "Family duty", "Passion", "Social constraint", "Nature"],
    country: "England",
  },
  {
    id: "silas-marner",
    title: "Silas Marner",
    author: "George Eliot",
    year: 1861,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Fable"],
    difficulty: "Beginner",
    synopsis: "A weaver unjustly exiled from his community becomes a miser until a golden-haired orphan appears at his hearth, teaching him that human connection is the only true treasure.",
    themes: ["Redemption", "Community", "Gold vs. love", "Faith", "Isolation"],
    country: "England",
  },
  {
    id: "tess-of-the-durbervilles",
    title: "Tess of the d'Urbervilles",
    author: "Thomas Hardy",
    year: 1891,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Tragedy"],
    difficulty: "Intermediate",
    synopsis: "A young woman of humble origins discovers she descends from an ancient family, but her encounters with two very different men seal a fate shaped by Victorian hypocrisy and an indifferent universe.",
    themes: ["Fate", "Injustice", "Sexuality", "Social class", "Nature"],
    country: "England",
  },
  {
    id: "far-from-the-madding-crowd",
    title: "Far from the Madding Crowd",
    author: "Thomas Hardy",
    year: 1874,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Pastoral", "Romance"],
    difficulty: "Intermediate",
    synopsis: "The independent Bathsheba Everdene inherits a farm and must navigate the attentions of three very different suitors — the steadfast shepherd, the reckless soldier, and the obsessive landowner.",
    themes: ["Independence", "Love", "Rural life", "Fate", "Choice"],
    country: "England",
  },
  {
    id: "the-mayor-of-casterbridge",
    title: "The Mayor of Casterbridge",
    author: "Thomas Hardy",
    year: 1886,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Tragedy"],
    difficulty: "Intermediate",
    synopsis: "A man who drunkenly sells his wife at a fair rises to become mayor of a market town, only to have his past return with devastating force.",
    themes: ["Pride", "Fate", "Redemption", "Character", "Consequence"],
    country: "England",
  },
  {
    id: "the-moonstone",
    title: "The Moonstone",
    author: "Wilkie Collins",
    year: 1868,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Mystery", "Detective Fiction", "Novel"],
    difficulty: "Intermediate",
    synopsis: "A fabulous Indian diamond is stolen from a young woman's birthday party, and the investigation — told through multiple narrators — becomes the blueprint for the modern detective novel.",
    themes: ["Mystery", "Colonialism", "Multiple perspectives", "Justice", "Obsession"],
    country: "England",
  },
  {
    id: "the-woman-in-white",
    title: "The Woman in White",
    author: "Wilkie Collins",
    year: 1859,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Gothic", "Mystery", "Sensation Novel"],
    difficulty: "Intermediate",
    synopsis: "A drawing master encounters a mysterious woman in white on a moonlit road, beginning a labyrinthine tale of identity theft, madness, and conspiracy against a vulnerable heiress.",
    themes: ["Identity", "Madness", "Conspiracy", "Gender", "Justice"],
    country: "England",
  },
  {
    id: "vanity-fair",
    title: "Vanity Fair",
    author: "William Makepeace Thackeray",
    year: 1848,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Social Satire"],
    difficulty: "Advanced",
    synopsis: "The scheming Becky Sharp and the gentle Amelia Sedley navigate Regency and early Victorian society in a sprawling satirical panorama that Thackeray called 'a novel without a hero.'",
    themes: ["Ambition", "Vanity", "Social climbing", "War", "Morality"],
    country: "England",
  },
  {
    id: "north-and-south",
    title: "North and South",
    author: "Elizabeth Gaskell",
    year: 1854,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Social Commentary", "Romance"],
    difficulty: "Intermediate",
    synopsis: "A Southern clergyman's daughter moves to a Northern industrial town, where her clashes with a mill owner force both to confront their prejudices about class, labor, and each other.",
    themes: ["Industrialization", "Class", "Pride", "Social justice", "Love"],
    country: "England",
  },
  {
    id: "dead-souls",
    title: "Dead Souls",
    author: "Nikolai Gogol",
    year: 1842,
    tradition: "Russian",
    era: "Romantic",
    genres: ["Novel", "Satire"],
    difficulty: "Intermediate",
    synopsis: "A charming swindler travels through rural Russia buying up the ownership papers of dead serfs in an elaborate fraud that exposes the absurdity and corruption of the entire social order.",
    themes: ["Corruption", "Russian society", "Greed", "Absurdity", "Identity"],
    country: "Russia",
    language: "Russian",
    readingLanguage: "English",
  },
  {
    id: "fathers-and-children",
    title: "Fathers and Children",
    author: "Ivan Turgenev",
    year: 1862,
    tradition: "Russian",
    era: "Victorian",
    genres: ["Novel", "Philosophical Fiction"],
    difficulty: "Intermediate",
    synopsis: "A young nihilist doctor returns to his father's estate and clashes with the older generation, until love and death force him to confront the limits of his own philosophy.",
    themes: ["Generational conflict", "Nihilism", "Love", "Russian society", "Change"],
    country: "Russia",
    language: "Russian",
    readingLanguage: "English",
  },
  {
    id: "the-idiot",
    title: "The Idiot",
    author: "Fyodor Dostoevsky",
    year: 1869,
    tradition: "Russian",
    era: "Victorian",
    genres: ["Novel", "Psychological Fiction"],
    difficulty: "Advanced",
    synopsis: "A Christ-like prince returns to Russia from a Swiss sanatorium and is drawn into the passions, rivalries, and cruelties of Petersburg society, where his very goodness becomes his undoing.",
    themes: ["Innocence", "Madness", "Beauty", "Good vs. evil", "Russian soul"],
    country: "Russia",
    language: "Russian",
    readingLanguage: "English",
  },
  {
    id: "resurrection",
    title: "Resurrection",
    author: "Leo Tolstoy",
    year: 1899,
    tradition: "Russian",
    era: "Victorian",
    genres: ["Novel", "Philosophical Fiction"],
    difficulty: "Advanced",
    synopsis: "A nobleman recognizes among prisoners a woman he seduced and abandoned years ago, and his attempt to atone leads him on a journey through Russia's brutal prison system to moral awakening.",
    themes: ["Redemption", "Justice", "Social inequality", "Moral awakening", "Love"],
    country: "Russia",
    language: "Russian",
    readingLanguage: "English",
  },
  {
    id: "uncle-toms-cabin",
    title: "Uncle Tom's Cabin",
    author: "Harriet Beecher Stowe",
    year: 1852,
    tradition: "American",
    era: "Victorian",
    genres: ["Novel", "Social Criticism", "Abolitionist Literature"],
    difficulty: "Intermediate",
    synopsis: "A faithful slave is sold away from his family and passes through the hands of various owners, while another slave family makes a desperate bid for freedom across the frozen Ohio River.",
    themes: ["Slavery", "Faith", "Family", "Injustice", "Compassion"],
    country: "USA",
  },
  {
    id: "narrative-of-the-life-of-frederick-douglass",
    title: "Narrative of the Life of Frederick Douglass",
    author: "Frederick Douglass",
    year: 1845,
    tradition: "American",
    era: "Romantic",
    genres: ["Autobiography", "Slave Narrative"],
    difficulty: "Intermediate",
    synopsis: "Born into slavery, Frederick Douglass teaches himself to read, endures brutal masters, and escapes to freedom — a firsthand account that became one of the most powerful weapons in the fight against slavery.",
    themes: ["Freedom", "Education", "Resistance", "Identity", "Injustice"],
    country: "USA",
  },
  {
    id: "the-souls-of-black-folk",
    title: "The Souls of Black Folk",
    author: "W. E. B. Du Bois",
    year: 1903,
    tradition: "American",
    era: "Modern",
    genres: ["Essays", "Social Criticism", "Autobiography"],
    difficulty: "Intermediate",
    synopsis: "In a landmark collection of essays, Du Bois articulates the concept of double consciousness and charts the interior life of Black Americans at the turn of the twentieth century.",
    themes: ["Race", "Double consciousness", "Education", "History", "American identity"],
    country: "USA",
  },
  {
    id: "up-from-slavery",
    title: "Up from Slavery",
    author: "Booker T. Washington",
    year: 1901,
    tradition: "American",
    era: "Modern",
    genres: ["Autobiography"],
    difficulty: "Intermediate",
    synopsis: "From his birth in slavery to the founding of the Tuskegee Institute, Washington chronicles his rise through hard work and education, advocating a pragmatic path to Black advancement.",
    themes: ["Education", "Self-improvement", "Race", "Industry", "American Dream"],
    country: "USA",
  },
  {
    id: "twelve-years-a-slave",
    title: "Twelve Years a Slave",
    author: "Solomon Northup",
    year: 1853,
    tradition: "American",
    era: "Victorian",
    genres: ["Autobiography", "Slave Narrative"],
    difficulty: "Intermediate",
    synopsis: "A free Black man from New York is kidnapped and sold into slavery in Louisiana, enduring twelve years of bondage before being rescued — a harrowing firsthand account of the institution's cruelty.",
    themes: ["Freedom", "Injustice", "Survival", "Identity", "Resilience"],
    country: "USA",
  },
  {
    id: "the-autobiography-of-benjamin-franklin",
    title: "The Autobiography of Benjamin Franklin",
    author: "Benjamin Franklin",
    year: 1791,
    tradition: "American",
    era: "Enlightenment",
    genres: ["Autobiography"],
    difficulty: "Intermediate",
    synopsis: "America's quintessential self-made man recounts his rise from a Boston printer's apprentice to scientist, diplomat, and founding father, codifying the virtues that shaped the national character.",
    themes: ["Self-improvement", "Industry", "Innovation", "Virtue", "American identity"],
    country: "USA",
  },
  {
    id: "leaves-of-grass",
    title: "Leaves of Grass",
    author: "Walt Whitman",
    year: 1855,
    tradition: "American",
    era: "Romantic",
    genres: ["Poetry"],
    difficulty: "Advanced",
    synopsis: "Whitman's revolutionary collection celebrates the body, democracy, nature, and the American spirit in sprawling free verse that shattered poetic convention and created a new literary voice.",
    themes: ["Democracy", "The body", "Nature", "Identity", "America"],
    country: "USA",
  },
  {
    id: "the-house-of-mirth",
    title: "The House of Mirth",
    author: "Edith Wharton",
    year: 1905,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Social Satire"],
    difficulty: "Intermediate",
    synopsis: "A beautiful but unmarried woman navigates the treacherous waters of New York high society, where a single misstep can mean social death — and where the cost of independence is ruinous.",
    themes: ["Social class", "Gender", "Money", "Beauty", "Destruction"],
    country: "USA",
  },
  {
    id: "my-antonia",
    title: "My Antonia",
    author: "Willa Cather",
    year: 1918,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Pastoral"],
    difficulty: "Intermediate",
    synopsis: "A man recalls his childhood friendship with Antonia, a spirited Bohemian immigrant girl on the Nebraska prairie, in an elegy for the pioneer spirit and the landscapes it transformed.",
    themes: ["Pioneer life", "Memory", "Immigration", "Landscape", "Resilience"],
    country: "USA",
  },
  {
    id: "o-pioneers",
    title: "O Pioneers!",
    author: "Willa Cather",
    year: 1913,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Pastoral"],
    difficulty: "Intermediate",
    synopsis: "After her father's death, Alexandra Bergson transforms the harsh Nebraska Divide into a prosperous farm through sheer determination, even as love and tragedy reshape her family.",
    themes: ["Land", "Pioneer spirit", "Family", "Independence", "Nature"],
    country: "USA",
  },
  {
    id: "the-awakening",
    title: "The Awakening",
    author: "Kate Chopin",
    year: 1899,
    tradition: "American",
    era: "Victorian",
    genres: ["Novel", "Feminist Fiction"],
    difficulty: "Intermediate",
    synopsis: "A young married woman in New Orleans gradually awakens to desires and ambitions that the conventions of Creole society cannot contain, with radical consequences.",
    themes: ["Female autonomy", "Desire", "Convention", "Identity", "Freedom"],
    country: "USA",
  },
  {
    id: "the-phantom-of-the-opera",
    title: "The Phantom of the Opera",
    author: "Gaston Leroux",
    year: 1910,
    tradition: "French",
    era: "Modern",
    genres: ["Gothic", "Mystery", "Romance"],
    difficulty: "Beginner",
    synopsis: "Beneath the Paris Opera House lurks a masked genius who controls the theater through terror and illusion, until his obsessive love for a young soprano threatens to destroy them both.",
    themes: ["Obsession", "Beauty and ugliness", "Art", "Isolation", "Love"],
    country: "France",
    language: "French",
    readingLanguage: "English",
  },
  {
    id: "around-the-world-in-eighty-days",
    title: "Around the World in Eighty Days",
    author: "Jules Verne",
    year: 1873,
    tradition: "French",
    era: "Victorian",
    genres: ["Adventure", "Science Fiction"],
    difficulty: "Beginner",
    synopsis: "An unflappable English gentleman wagers that he can circumnavigate the globe in eighty days, embarking on a breathless journey by steamship, railway, elephant, and sheer determination.",
    themes: ["Adventure", "Progress", "Determination", "Cultural encounter", "Time"],
    country: "France",
    language: "French",
    readingLanguage: "English",
  },
  {
    id: "journey-to-the-center-of-the-earth",
    title: "Journey to the Center of the Earth",
    author: "Jules Verne",
    year: 1864,
    tradition: "French",
    era: "Victorian",
    genres: ["Science Fiction", "Adventure"],
    difficulty: "Beginner",
    synopsis: "A German professor and his nephew descend through an Icelandic volcano into a vast subterranean world of prehistoric creatures, underground seas, and geological wonders.",
    themes: ["Exploration", "Science", "Courage", "Wonder", "Nature"],
    country: "France",
    language: "French",
    readingLanguage: "English",
  },
  {
    id: "the-prince-and-the-pauper",
    title: "The Prince and the Pauper",
    author: "Mark Twain",
    year: 1881,
    tradition: "American",
    era: "Victorian",
    genres: ["Historical Fiction", "Novel", "Children's Literature"],
    difficulty: "Beginner",
    synopsis: "A prince and a pauper who look identical switch places, each discovering the world from the other's perspective in Tudor England.",
    themes: ["Social class", "Identity", "Justice", "Compassion", "Power"],
    country: "USA",
  },
  {
    id: "a-connecticut-yankee-in-king-arthurs-court",
    title: "A Connecticut Yankee in King Arthur's Court",
    author: "Mark Twain",
    year: 1889,
    tradition: "American",
    era: "Victorian",
    genres: ["Satire", "Science Fiction", "Adventure"],
    difficulty: "Intermediate",
    synopsis: "A nineteenth-century American engineer is transported to Arthurian England, where he attempts to modernize the medieval world with hilarious and ultimately tragic results.",
    themes: ["Progress", "Satire", "Technology", "Power", "Democracy"],
    country: "USA",
  },
  {
    id: "the-wonderful-wizard-of-oz",
    title: "The Wonderful Wizard of Oz",
    author: "L. Frank Baum",
    year: 1900,
    tradition: "American",
    era: "Modern",
    genres: ["Fantasy", "Children's Literature"],
    difficulty: "Beginner",
    synopsis: "A Kansas girl and her dog are swept by a tornado to the magical Land of Oz, where she and three unlikely companions journey to the Emerald City to ask the Wizard for help.",
    themes: ["Home", "Courage", "Friendship", "Self-discovery", "Adventure"],
    country: "USA",
  },
  {
    id: "peter-and-wendy",
    title: "Peter and Wendy",
    author: "J. M. Barrie",
    year: 1911,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Fantasy", "Children's Literature"],
    difficulty: "Beginner",
    synopsis: "Three London children fly to Neverland with the eternal boy Peter Pan, encountering pirates, fairies, and the bittersweet truth that growing up is the one adventure Peter will never have.",
    themes: ["Childhood", "Growing up", "Imagination", "Motherhood", "Adventure"],
    country: "Scotland",
  },
  {
    id: "alices-adventures-in-wonderland",
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    year: 1865,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Fantasy", "Children's Literature", "Satire"],
    difficulty: "Beginner",
    synopsis: "A girl falls down a rabbit hole into a world where logic is inverted, cats disappear, queens demand beheadings, and nothing is quite what it seems.",
    themes: ["Logic", "Identity", "Nonsense", "Growing up", "Language"],
    country: "England",
  },
  {
    id: "through-the-looking-glass",
    title: "Through the Looking-Glass",
    author: "Lewis Carroll",
    year: 1871,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Fantasy", "Children's Literature", "Satire"],
    difficulty: "Beginner",
    synopsis: "Alice steps through a mirror into a world organized like a chess game, encountering Tweedledee and Tweedledum, Humpty Dumpty, and the puzzling logic of mirror-reversed reality.",
    themes: ["Logic", "Language", "Games", "Identity", "Mirrors"],
    country: "England",
  },
  {
    id: "the-wind-in-the-willows",
    title: "The Wind in the Willows",
    author: "Kenneth Grahame",
    year: 1908,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Children's Literature", "Fantasy", "Pastoral"],
    difficulty: "Beginner",
    synopsis: "Mole, Rat, Badger, and the irrepressible Toad enjoy adventures along the riverbank, culminating in the heroic recapture of Toad Hall from a band of marauding weasels.",
    themes: ["Friendship", "Nature", "Home", "Adventure", "English countryside"],
    country: "England",
  },
  {
    id: "the-secret-garden",
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    year: 1911,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Children's Literature", "Novel"],
    difficulty: "Beginner",
    synopsis: "A spoiled, sickly girl discovers a hidden garden on the Yorkshire moors and, in restoring it to life, restores herself and a bedridden cousin to health and happiness.",
    themes: ["Healing", "Nature", "Transformation", "Childhood", "Neglect"],
    country: "England",
  },
  {
    id: "anne-of-green-gables",
    title: "Anne of Green Gables",
    author: "L. M. Montgomery",
    year: 1908,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Children's Literature", "Novel"],
    difficulty: "Beginner",
    synopsis: "An imaginative, red-haired orphan is sent by mistake to an elderly brother and sister who wanted a boy, and proceeds to charm, scandalize, and transform the community of Avonlea.",
    themes: ["Imagination", "Belonging", "Coming of age", "Kindred spirits", "Home"],
    country: "Canada",
  },
  {
    id: "black-beauty",
    title: "Black Beauty",
    author: "Anna Sewell",
    year: 1877,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Children's Literature"],
    difficulty: "Beginner",
    synopsis: "A horse narrates his own life story, from a happy youth through various owners kind and cruel, advocating through his experiences for the humane treatment of animals.",
    themes: ["Compassion", "Justice", "Treatment of animals", "Class", "Kindness"],
    country: "England",
  },
  {
    id: "heidi",
    title: "Heidi",
    author: "Johanna Spyri",
    year: 1881,
    tradition: "Germanic",
    era: "Victorian",
    genres: ["Children's Literature", "Novel"],
    difficulty: "Beginner",
    synopsis: "A young Swiss orphan finds joy living with her gruff grandfather in the Alps, but is taken to the city to be a companion for a wealthy invalid girl — pining always for the mountains.",
    themes: ["Nature", "Home", "Healing", "Innocence", "Belonging"],
    country: "Switzerland",
    language: "German",
    readingLanguage: "English",
  },
  {
    id: "romeo-and-juliet",
    title: "Romeo and Juliet",
    author: "William Shakespeare",
    year: 1597,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Tragedy", "Drama", "Romance"],
    difficulty: "Intermediate",
    synopsis: "Two young lovers from feuding Verona families defy their world for a few stolen days of passion, only to find that their love is shadowed from the start by fate and fury.",
    themes: ["Love", "Fate", "Family conflict", "Youth", "Death"],
    country: "England",
  },
  {
    id: "king-lear",
    title: "King Lear",
    author: "William Shakespeare",
    year: 1606,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Tragedy", "Drama"],
    difficulty: "Advanced",
    synopsis: "An aging king divides his kingdom among his daughters based on their professions of love, unleashing a catastrophe of ingratitude, madness, and destruction.",
    themes: ["Power", "Madness", "Ingratitude", "Justice", "Family", "Aging"],
    country: "England",
  },
  {
    id: "a-midsummer-nights-dream",
    title: "A Midsummer Night's Dream",
    author: "William Shakespeare",
    year: 1596,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Comedy", "Drama", "Fantasy"],
    difficulty: "Beginner",
    synopsis: "Lovers, fairies, and a troupe of bumbling actors collide in an enchanted forest outside Athens, where Puck's mischief turns the course of love into glorious chaos.",
    themes: ["Love", "Magic", "Illusion", "Transformation", "Dreams"],
    country: "England",
  },
  {
    id: "julius-caesar",
    title: "Julius Caesar",
    author: "William Shakespeare",
    year: 1599,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Tragedy", "Drama", "Historical"],
    difficulty: "Intermediate",
    synopsis: "The assassination of Rome's most powerful man by his closest allies sets off a chain of civil war, as honor, ambition, and rhetoric clash with devastating force.",
    themes: ["Power", "Betrayal", "Honor", "Rhetoric", "Republic vs. tyranny"],
    country: "England",
  },
  {
    id: "the-merchant-of-venice",
    title: "The Merchant of Venice",
    author: "William Shakespeare",
    year: 1596,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Comedy", "Drama"],
    difficulty: "Intermediate",
    synopsis: "A merchant's friend borrows money from a Jewish moneylender to woo a wealthy heiress, agreeing to forfeit a pound of flesh if the loan is not repaid — a bargain that becomes terrifyingly literal.",
    themes: ["Justice", "Mercy", "Prejudice", "Friendship", "Appearances"],
    country: "England",
  },
  {
    id: "the-taming-of-the-shrew",
    title: "The Taming of the Shrew",
    author: "William Shakespeare",
    year: 1593,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Comedy", "Drama"],
    difficulty: "Beginner",
    synopsis: "A fortune-hunter takes on the challenge of wooing the sharp-tongued Katherina, while her gentle sister Bianca attracts a crowd of rival suitors in disguise.",
    themes: ["Gender", "Marriage", "Power", "Deception", "Wit"],
    country: "England",
  },
  {
    id: "twelfth-night",
    title: "Twelfth Night",
    author: "William Shakespeare",
    year: 1601,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Comedy", "Drama", "Romance"],
    difficulty: "Intermediate",
    synopsis: "Shipwrecked Viola disguises herself as a man and enters the service of Duke Orsino, creating a love triangle complicated by mistaken identity, revelry, and a pompous steward's downfall.",
    themes: ["Disguise", "Love", "Identity", "Folly", "Gender"],
    country: "England",
  },
  {
    id: "as-you-like-it",
    title: "As You Like It",
    author: "William Shakespeare",
    year: 1599,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Comedy", "Drama", "Pastoral"],
    difficulty: "Beginner",
    synopsis: "Exiled to the Forest of Arden, a duke's daughter disguises herself as a shepherd boy and presides over a cascade of courtships that celebrate the transformative madness of love.",
    themes: ["Love", "Nature", "Disguise", "Freedom", "Pastoral"],
    country: "England",
  },
  {
    id: "much-ado-about-nothing",
    title: "Much Ado About Nothing",
    author: "William Shakespeare",
    year: 1598,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Comedy", "Drama", "Romance"],
    difficulty: "Beginner",
    synopsis: "The witty war of words between Beatrice and Benedick masks a growing attraction, while a more sinister deception threatens the happiness of the sweeter lovers Hero and Claudio.",
    themes: ["Love", "Deception", "Wit", "Honor", "Appearances"],
    country: "England",
  },
  {
    id: "the-scarlet-letter",
    title: "The Scarlet Letter",
    author: "Nathaniel Hawthorne",
    year: 1850,
    tradition: "American",
    era: "Romantic",
    genres: ["Novel", "Historical Fiction"],
    difficulty: "Intermediate",
    synopsis: "In Puritan Boston, a woman branded with a scarlet 'A' for adultery refuses to name the father of her child, bearing her shame with a dignity that exposes the hypocrisy of the entire community.",
    themes: ["Sin", "Guilt", "Hypocrisy", "Identity", "Puritan society", "Redemption"],
    country: "USA",
  },
];

// ── Main ───────────────────────────────────────────────────────────────────────

function main() {
  // Read existing files
  let booksContent = fs.readFileSync(BOOKS_FILE, "utf-8");
  let chaptersContent = fs.readFileSync(CHAPTERS_FILE, "utf-8");

  // Extract existing book IDs from books.ts
  const existingBookIds = new Set<string>();
  const bookIdRegex = /id:\s*"([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = bookIdRegex.exec(booksContent)) !== null) {
    existingBookIds.add(match[1]);
  }

  // Extract existing chapter IDs from chapters.ts
  const existingChapterIds = new Set<string>();
  const chapterIdRegex = /id:\s*"([^"]+)"/g;
  while ((match = chapterIdRegex.exec(chaptersContent)) !== null) {
    existingChapterIds.add(match[1]);
  }

  console.log(`Found ${existingBookIds.size} existing books in books.ts`);
  console.log(`Found ${existingChapterIds.size} existing chapters in chapters.ts`);

  let booksAdded = 0;
  let chaptersAdded = 0;
  let booksSkipped = 0;

  const newBookEntries: string[] = [];
  const newChapterEntries: string[] = [];

  for (const config of BOOK_CONFIGS) {
    // Skip if book already exists
    if (existingBookIds.has(config.id)) {
      console.log(`  SKIP: ${config.id} (already exists)`);
      booksSkipped++;
      continue;
    }

    // Read meta.json for chapter data
    const metaPath = path.join(CONTENT_DIR, config.id, "meta.json");
    if (!fs.existsSync(metaPath)) {
      console.log(`  SKIP: ${config.id} (no meta.json found at ${metaPath})`);
      booksSkipped++;
      continue;
    }

    const meta: MetaJson = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

    // Get cover colors from tradition
    const colors = TRADITION_COLORS[config.tradition] || TRADITION_COLORS["Victorian"];

    // Build book entry
    const authorId = toAuthorId(config.author);
    const readingTime = formatReadingTime(meta.totalMinutes);

    let bookEntry = `  {\n`;
    bookEntry += `    id: "${config.id}",\n`;
    bookEntry += `    title: "${config.title.replace(/"/g, '\\"')}",\n`;
    bookEntry += `    author: "${config.author.replace(/"/g, '\\"')}",\n`;
    bookEntry += `    authorId: "${authorId}",\n`;
    bookEntry += `    year: ${config.year},\n`;
    if (config.language) {
      bookEntry += `    language: "${config.language}",\n`;
    }
    if (config.readingLanguage) {
      bookEntry += `    readingLanguage: "${config.readingLanguage}",\n`;
    }
    bookEntry += `    tradition: "${config.tradition}",\n`;
    bookEntry += `    era: "${config.era}",\n`;
    bookEntry += `    genres: [${config.genres.map(g => `"${g}"`).join(", ")}],\n`;
    bookEntry += `    difficulty: "${config.difficulty}",\n`;
    bookEntry += `    chapters: ${meta.chapterCount},\n`;
    bookEntry += `    estimatedReadingTime: "${readingTime}",\n`;
    bookEntry += `    wordCount: ${meta.totalWordCount},\n`;
    bookEntry += `    synopsis: "${config.synopsis.replace(/"/g, '\\"')}",\n`;
    bookEntry += `    themes: [${config.themes.map(t => `"${t}"`).join(", ")}],\n`;
    bookEntry += `    country: "${config.country}",\n`;
    bookEntry += `    coverColors: { primary: "${colors.primary}", secondary: "${colors.secondary}", accent: "${colors.accent}" },\n`;
    bookEntry += `    featured: false,\n`;
    bookEntry += `    source: "standard-ebooks",\n`;
    bookEntry += `  }`;

    newBookEntries.push(bookEntry);
    booksAdded++;

    // Build chapter entries
    for (const ch of meta.chapters) {
      const chapterId = `${config.id}-ch-${ch.index}`;
      if (existingChapterIds.has(chapterId)) {
        continue;
      }

      let chapterEntry = `  {\n`;
      chapterEntry += `    id: "${chapterId}",\n`;
      chapterEntry += `    bookId: "${config.id}",\n`;
      chapterEntry += `    number: ${ch.index},\n`;
      chapterEntry += `    title: "${ch.title.replace(/"/g, '\\"')}",\n`;
      chapterEntry += `    wordCount: ${ch.wordCount},\n`;
      chapterEntry += `    estimatedMinutes: ${ch.estimatedMinutes},\n`;
      chapterEntry += `    summary: "",\n`;
      chapterEntry += `    quizAvailable: false,\n`;
      chapterEntry += `  }`;

      newChapterEntries.push(chapterEntry);
      chaptersAdded++;
    }
  }

  // Append new book entries before the final `];`
  if (newBookEntries.length > 0) {
    const booksInsert = "\n\n  // ── CANONICAL ADDITIONS (auto-generated) ──────────────────────────────────\n\n" +
      newBookEntries.join(",\n") + ",";

    // Find the last `];` in books.ts and insert before it
    const booksCloseIdx = booksContent.lastIndexOf("];");
    if (booksCloseIdx === -1) {
      console.error("ERROR: Could not find closing `];` in books.ts");
      process.exit(1);
    }
    booksContent = booksContent.slice(0, booksCloseIdx) + booksInsert + "\n" + booksContent.slice(booksCloseIdx);
    fs.writeFileSync(BOOKS_FILE, booksContent, "utf-8");
    console.log(`\nWrote ${booksAdded} new books to books.ts`);
  }

  // Append new chapter entries before the final `]`
  if (newChapterEntries.length > 0) {
    const chaptersInsert = "\n\n  // ── CANONICAL ADDITIONS (auto-generated) ──────────────────────────────────\n\n" +
      newChapterEntries.join(",\n") + ",";

    // Find the last `]` in chapters.ts and insert before it
    const chaptersCloseIdx = chaptersContent.lastIndexOf("]");
    if (chaptersCloseIdx === -1) {
      console.error("ERROR: Could not find closing `]` in chapters.ts");
      process.exit(1);
    }
    chaptersContent = chaptersContent.slice(0, chaptersCloseIdx) + chaptersInsert + "\n" + chaptersContent.slice(chaptersCloseIdx);
    fs.writeFileSync(CHAPTERS_FILE, chaptersContent, "utf-8");
    console.log(`Wrote ${chaptersAdded} new chapters to chapters.ts`);
  }

  // Summary
  console.log("\n══════════════════════════════════════════════════════");
  console.log(`  SUMMARY`);
  console.log(`  Books added:   ${booksAdded}`);
  console.log(`  Books skipped: ${booksSkipped} (already existed)`);
  console.log(`  Chapters added: ${chaptersAdded}`);
  console.log("══════════════════════════════════════════════════════\n");
}

main();
