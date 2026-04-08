import type { Language, Difficulty, CoverStyle } from "@/types";

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

export type NodeStatus = "completed" | "current" | "locked" | "premium";

export interface MockBook {
  id: string;
  title: string;
  author: string;
  language: Language;
  difficulty: Difficulty;
  genre: string;
  wordCount: number;
  chapterCount: number;
  synopsis: string;
  coverStyle: CoverStyle;
  pathOrder: number;
  isLocked: boolean;
  isPremium: boolean;
}

export interface MockChapter {
  id: string;
  bookId: string;
  number: number;
  title: string;
  wordCount: number;
  estimatedMinutes: number;
  completed: boolean;
}

export interface Paragraph {
  id: string;
  chapterId: string;
  order: number;
  original: string;
  translation: string;
}

export interface VocabWord {
  id: string;
  word: string;
  translation: string;
  language: Language;
  partOfSpeech: string;
  context: string;
  mastery: "NEW" | "LEARNING" | "MASTERED";
  book: string;
  timesReviewed: number;
  timesCorrect: number;
  nextReviewAt: string;
}

export interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "fill-blank" | "match-pairs";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  bookId: string;
}

export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  iconEmoji: string;
  xpAwarded: number;
  earned: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  weeklyXp: number;
  level: number;
  avatarSeed: number;
}

export interface ProgressData {
  bookId: string;
  chaptersCompleted: number;
  totalChapters: number;
  percentComplete: number;
  lastReadAt: string;
  currentChapterId: string;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  preferredLanguages: Language[];
  dailyGoalChapters: number;
  currentLevel: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  hearts: number;
  coins: number;
  streakFreezes: number;
  memberSince: string;
}

// ---------------------------------------------------------------------------
// MOCK_BOOKS (25 books)
// ---------------------------------------------------------------------------

export const MOCK_BOOKS: MockBook[] = [
  {
    id: "1",
    title: "De Bello Gallico",
    author: "Caesar",
    language: "LATIN",
    difficulty: "A2",
    genre: "Military",
    wordCount: 3420,
    chapterCount: 8,
    synopsis:
      "Caesar's firsthand account of the Gallic Wars, chronicling eight years of military campaigns across Gaul. Written in clear, direct Latin prose, it remains one of the most accessible entry points into classical literature.",
    coverStyle: { palette: ["#3B82F6", "#F59E0B"], seed: 42, shapes: ["column", "wave"] },
    pathOrder: 1,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "2",
    title: "In Catilinam I",
    author: "Cicero",
    language: "LATIN",
    difficulty: "B1",
    genre: "Oratory",
    wordCount: 2680,
    chapterCount: 6,
    synopsis:
      "Cicero's thundering oration against Lucius Sergius Catilina, delivered before the Roman Senate. This speech exposes a conspiracy to overthrow the Republic and showcases Cicero at the height of his rhetorical power.",
    coverStyle: { palette: ["#3B82F6", "#EF4444"], seed: 73, shapes: ["arc", "circle"] },
    pathOrder: 2,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "3",
    title: "Aeneid Book I",
    author: "Virgil",
    language: "LATIN",
    difficulty: "B2",
    genre: "Epic Poetry",
    wordCount: 4100,
    chapterCount: 12,
    synopsis:
      "Virgil's epic poem traces the journey of Aeneas from the ruins of Troy to the shores of Italy. Book I opens with a great storm at sea and the hero's arrival at Carthage, where Queen Dido offers hospitality.",
    coverStyle: { palette: ["#3B82F6", "#8B5CF6"], seed: 15, shapes: ["wave", "column"] },
    pathOrder: 3,
    isLocked: true,
    isPremium: false,
  },
  {
    id: "4",
    title: "Metamorphoses I",
    author: "Ovid",
    language: "LATIN",
    difficulty: "B1",
    genre: "Mythology",
    wordCount: 3750,
    chapterCount: 10,
    synopsis:
      "Ovid's grand mythological poem weaving together tales of transformation from the creation of the world through the deification of Julius Caesar. Book I opens with chaos becoming cosmos and includes beloved stories of Daphne, Io, and Phaethon.",
    coverStyle: { palette: ["#3B82F6", "#10B981"], seed: 88, shapes: ["circle", "dot-grid"] },
    pathOrder: 4,
    isLocked: true,
    isPremium: false,
  },
  {
    id: "5",
    title: "Ab Urbe Condita I",
    author: "Livy",
    language: "LATIN",
    difficulty: "C1",
    genre: "History",
    wordCount: 5200,
    chapterCount: 8,
    synopsis:
      "Livy's monumental history of Rome from its founding. Book I covers the legendary period from Romulus and Remus through the expulsion of the kings, blending myth and history into a compelling narrative of Rome's origins.",
    coverStyle: { palette: ["#3B82F6", "#F59E0B"], seed: 31, shapes: ["column", "arc"] },
    pathOrder: 5,
    isLocked: true,
    isPremium: true,
  },
  {
    id: "6",
    title: "Anabasis Book I",
    author: "Xenophon",
    language: "GREEK",
    difficulty: "A2",
    genre: "Military",
    wordCount: 3100,
    chapterCount: 10,
    synopsis:
      "Xenophon's account of the march of ten thousand Greek mercenaries through hostile Persian territory. Book I describes the expedition's genesis and the fateful Battle of Cunaxa that left the Greeks stranded deep in enemy land.",
    coverStyle: { palette: ["#8B5CF6", "#10B981"], seed: 55, shapes: ["wave", "circle"] },
    pathOrder: 6,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "7",
    title: "Apology",
    author: "Plato",
    language: "GREEK",
    difficulty: "B1",
    genre: "Philosophy",
    wordCount: 2900,
    chapterCount: 8,
    synopsis:
      "Plato's account of the trial of Socrates, in which the philosopher defends himself against charges of impiety and corrupting the youth of Athens. A foundational text of Western philosophy and a portrait of intellectual courage.",
    coverStyle: { palette: ["#8B5CF6", "#F59E0B"], seed: 22, shapes: ["arc", "dot-grid"] },
    pathOrder: 7,
    isLocked: true,
    isPremium: false,
  },
  {
    id: "8",
    title: "Iliad Book I",
    author: "Homer",
    language: "GREEK",
    difficulty: "B2",
    genre: "Epic Poetry",
    wordCount: 4500,
    chapterCount: 12,
    synopsis:
      "Homer's great epic of the Trojan War. Book I opens with the wrath of Achilles after Agamemnon takes his war prize, setting in motion a chain of events that will reshape the course of the conflict.",
    coverStyle: { palette: ["#8B5CF6", "#EF4444"], seed: 67, shapes: ["column", "wave"] },
    pathOrder: 8,
    isLocked: true,
    isPremium: true,
  },
  {
    id: "9",
    title: "Nicomachean Ethics I",
    author: "Aristotle",
    language: "GREEK",
    difficulty: "C1",
    genre: "Philosophy",
    wordCount: 3800,
    chapterCount: 7,
    synopsis:
      "Aristotle's inquiry into the nature of the good life and human flourishing. Book I establishes that happiness (eudaimonia) is the highest good and examines the relationship between virtue, reason, and the soul.",
    coverStyle: { palette: ["#8B5CF6", "#06B6D4"], seed: 38, shapes: ["arc", "column"] },
    pathOrder: 9,
    isLocked: true,
    isPremium: true,
  },
  {
    id: "10",
    title: "Gospel of Matthew 1-7",
    author: "Peshitta",
    language: "ARAMAIC",
    difficulty: "B1",
    genre: "Sacred",
    wordCount: 2400,
    chapterCount: 7,
    synopsis:
      "The opening chapters of Matthew's Gospel in the Aramaic Peshitta translation, covering the genealogy and birth of Jesus, the Sermon on the Mount, and foundational ethical teachings. A key text for understanding early Syriac Christianity.",
    coverStyle: { palette: ["#EC4899", "#F59E0B"], seed: 44, shapes: ["arc", "circle"] },
    pathOrder: 10,
    isLocked: true,
    isPremium: false,
  },
  {
    id: "11",
    title: "Selected Surahs",
    author: "Quran",
    language: "ARABIC",
    difficulty: "B1",
    genre: "Sacred",
    wordCount: 2100,
    chapterCount: 5,
    synopsis:
      "A curated selection beginning with Al-Fatiha and an excerpt of Al-Baqarah, chosen for their linguistic beauty and accessibility to intermediate learners. These passages introduce core Arabic vocabulary and grammatical structures through sacred text.",
    coverStyle: { palette: ["#06B6D4", "#F59E0B"], seed: 99, shapes: ["wave", "dot-grid"] },
    pathOrder: 11,
    isLocked: true,
    isPremium: false,
  },
  {
    id: "12",
    title: "Mu'allaqat Selections",
    author: "Pre-Islamic Poets",
    language: "ARABIC",
    difficulty: "B2",
    genre: "Poetry",
    wordCount: 1800,
    chapterCount: 6,
    synopsis:
      "Selections from the legendary 'Suspended Odes' of pre-Islamic Arabia, showcasing the rich oral poetic tradition. These qasidas explore themes of desert life, love, tribal pride, and the transience of existence.",
    coverStyle: { palette: ["#06B6D4", "#EF4444"], seed: 77, shapes: ["circle", "arc"] },
    pathOrder: 12,
    isLocked: true,
    isPremium: true,
  },
  // ── Old English (Saffron) ───────────────────────────────────────────────
  {
    id: "13",
    title: "Hamlet Act I",
    author: "Shakespeare",
    language: "OLD_ENGLISH",
    difficulty: "B2",
    genre: "Drama",
    wordCount: 4800,
    chapterCount: 5,
    synopsis:
      "The opening act of Shakespeare's greatest tragedy introduces Prince Hamlet, grieving for his dead father and disgusted by his mother's hasty remarriage. A ghostly visitation on the battlements of Elsinore sets in motion a devastating chain of revenge.",
    coverStyle: { palette: ["#F59E0B", "#8B5CF6"], seed: 101, shapes: ["column", "arc"] },
    pathOrder: 13,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "14",
    title: "Paradise Lost Book I",
    author: "Milton",
    language: "OLD_ENGLISH",
    difficulty: "C1",
    genre: "Epic Poetry",
    wordCount: 6200,
    chapterCount: 8,
    synopsis:
      "Milton's epic opens with Satan and his fallen angels cast into Hell after their failed rebellion against Heaven. From the burning lake, Satan rallies his forces and begins to plot mankind's downfall, building the infernal palace of Pandemonium.",
    coverStyle: { palette: ["#F59E0B", "#EF4444"], seed: 114, shapes: ["wave", "temple"] },
    pathOrder: 14,
    isLocked: true,
    isPremium: false,
  },
  {
    id: "15",
    title: "Don Juan Canto I",
    author: "Byron",
    language: "OLD_ENGLISH",
    difficulty: "B2",
    genre: "Satirical Poetry",
    wordCount: 4100,
    chapterCount: 6,
    synopsis:
      "Byron's irreverent masterpiece reimagines the Don Juan legend as a picaresque comedy. Canto I introduces young Juan in Seville, his precocious education, and his scandalous first love affair with the married Donna Julia.",
    coverStyle: { palette: ["#F59E0B", "#3B82F6"], seed: 115, shapes: ["ribbon", "wave"] },
    pathOrder: 15,
    isLocked: true,
    isPremium: false,
  },
  // ── French (Ocean) ──────────────────────────────────────────────────────
  {
    id: "16",
    title: "Les Mis\u00e9rables (excerpt)",
    author: "Hugo",
    language: "FRENCH",
    difficulty: "B1",
    genre: "Novel",
    wordCount: 5600,
    chapterCount: 8,
    synopsis:
      "Victor Hugo's monumental novel follows the ex-convict Jean Valjean as he seeks redemption in post-revolutionary France. This excerpt covers his encounter with Bishop Myriel, whose act of mercy transforms Valjean's life forever.",
    coverStyle: { palette: ["#3B82F6", "#EC4899"], seed: 116, shapes: ["column", "circle"] },
    pathOrder: 16,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "17",
    title: "Madame Bovary Part I",
    author: "Flaubert",
    language: "FRENCH",
    difficulty: "B2",
    genre: "Novel",
    wordCount: 7200,
    chapterCount: 9,
    synopsis:
      "Flaubert's landmark realist novel introduces Emma Rouault, a farmer's daughter raised on romantic novels, who marries the dull country doctor Charles Bovary. Part I traces her growing disillusionment with provincial married life in Normandy.",
    coverStyle: { palette: ["#3B82F6", "#10B981"], seed: 117, shapes: ["dot-grid", "arc"] },
    pathOrder: 17,
    isLocked: true,
    isPremium: false,
  },
  {
    id: "18",
    title: "Le Rouge et le Noir Part I",
    author: "Stendhal",
    language: "FRENCH",
    difficulty: "B2",
    genre: "Novel",
    wordCount: 7800,
    chapterCount: 10,
    synopsis:
      "Stendhal's psychological masterpiece follows Julien Sorel, an ambitious young man from the provinces torn between a military career (the red) and the clergy (the black). Part I chronicles his rise as tutor in the R\u00eanal household and his affair with Madame de R\u00eanal.",
    coverStyle: { palette: ["#3B82F6", "#EF4444"], seed: 118, shapes: ["ribbon", "column"] },
    pathOrder: 18,
    isLocked: true,
    isPremium: true,
  },
  // ── Italian (Clover) ────────────────────────────────────────────────────
  {
    id: "19",
    title: "Inferno Cantos I\u2013V",
    author: "Dante",
    language: "ITALIAN",
    difficulty: "B2",
    genre: "Epic Poetry",
    wordCount: 4500,
    chapterCount: 5,
    synopsis:
      "Dante's journey through Hell begins in a dark wood where the poet, lost and terrified, is guided by the shade of Virgil. Together they pass through the gates of Hell and descend through the first circles, encountering the lustful, the gluttonous, and the wrathful.",
    coverStyle: { palette: ["#10B981", "#EF4444"], seed: 119, shapes: ["wave", "temple"] },
    pathOrder: 19,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "20",
    title: "Orlando Furioso Canto I",
    author: "Ariosto",
    language: "ITALIAN",
    difficulty: "C1",
    genre: "Epic Poetry",
    wordCount: 3800,
    chapterCount: 6,
    synopsis:
      "Ariosto's Renaissance epic blends Carolingian legend with chivalric romance. Canto I plunges into the chaos of Charlemagne's war against the Saracens, as the knight Orlando's obsessive love for the pagan princess Angelica drives him to the brink of madness.",
    coverStyle: { palette: ["#10B981", "#8B5CF6"], seed: 120, shapes: ["ribbon", "arc"] },
    pathOrder: 20,
    isLocked: true,
    isPremium: true,
  },
  // ── German (Peony) ──────────────────────────────────────────────────────
  {
    id: "21",
    title: "Faust Part I Scene 1",
    author: "Goethe",
    language: "GERMAN",
    difficulty: "B2",
    genre: "Drama",
    wordCount: 3600,
    chapterCount: 5,
    synopsis:
      "Goethe's dramatic masterpiece opens with the scholar Heinrich Faust alone in his Gothic study, despairing that a lifetime of learning has brought him no closer to understanding the essence of existence. His spiritual crisis leads to a fateful bargain with Mephistopheles.",
    coverStyle: { palette: ["#EC4899", "#F59E0B"], seed: 121, shapes: ["circle", "column"] },
    pathOrder: 21,
    isLocked: false,
    isPremium: false,
  },
  // ── Spanish (Vermillion) ────────────────────────────────────────────────
  {
    id: "22",
    title: "Don Quijote Ch 1\u20138",
    author: "Cervantes",
    language: "SPANISH",
    difficulty: "B1",
    genre: "Novel",
    wordCount: 6400,
    chapterCount: 8,
    synopsis:
      "Cervantes' immortal novel introduces Alonso Quixano, a minor gentleman driven mad by reading too many chivalric romances. Renaming himself Don Quijote, he sets out with his squire Sancho Panza to right wrongs and revive knight-errantry, famously tilting at windmills.",
    coverStyle: { palette: ["#EF4444", "#F59E0B"], seed: 122, shapes: ["column", "wave"] },
    pathOrder: 22,
    isLocked: false,
    isPremium: false,
  },
  // ── Russian (Vermillion) ────────────────────────────────────────────────
  {
    id: "23",
    title: "Anna Karenina Part I",
    author: "Tolstoy",
    language: "RUSSIAN",
    difficulty: "B2",
    genre: "Novel",
    wordCount: 8200,
    chapterCount: 12,
    synopsis:
      "Tolstoy's sweeping novel opens with the Oblonsky household in turmoil after Stiva's infidelity is discovered. His sister Anna arrives from Petersburg to mend the marriage, but at the Moscow train station she encounters the dashing Count Vronsky, igniting a passion that will consume them both.",
    coverStyle: { palette: ["#EF4444", "#8B5CF6"], seed: 123, shapes: ["arc", "dot-grid"] },
    pathOrder: 23,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "24",
    title: "Crime and Punishment Part I",
    author: "Dostoevsky",
    language: "RUSSIAN",
    difficulty: "B2",
    genre: "Novel",
    wordCount: 7100,
    chapterCount: 7,
    synopsis:
      "Dostoevsky's psychological thriller follows the impoverished former student Raskolnikov through the stifling streets of St. Petersburg. Part I traces his tortured reasoning that an extraordinary man may transgress moral law, culminating in the murder of a pawnbroker.",
    coverStyle: { palette: ["#EF4444", "#06B6D4"], seed: 124, shapes: ["column", "wave"] },
    pathOrder: 24,
    isLocked: true,
    isPremium: false,
  },
  {
    id: "25",
    title: "Eugene Onegin Ch 1",
    author: "Pushkin",
    language: "RUSSIAN",
    difficulty: "B1",
    genre: "Verse Novel",
    wordCount: 3400,
    chapterCount: 6,
    synopsis:
      "Pushkin's novel in verse introduces the bored, world-weary Eugene Onegin as he travels from St. Petersburg to his uncle's country estate. Chapter One paints a vivid portrait of aristocratic Russian society and the ennui of its privileged young men.",
    coverStyle: { palette: ["#EF4444", "#10B981"], seed: 125, shapes: ["wave", "ribbon"] },
    pathOrder: 25,
    isLocked: true,
    isPremium: false,
  },
  // ── Sanskrit (Burnt Orange) ──────────────────────────────────────────────
  {
    id: "26",
    title: "Bhagavad Gita Chapters 1–4",
    author: "Vyasa",
    language: "SANSKRIT",
    difficulty: "B1",
    genre: "Sacred/Philosophy",
    wordCount: 4200,
    chapterCount: 4,
    synopsis:
      "The Bhagavad Gita opens on the battlefield of Kurukshetra, where Prince Arjuna faces a moral crisis about fighting his own kinsmen. Through dialogue with Lord Krishna, the text explores duty, righteousness, and the nature of the self across its first four chapters.",
    coverStyle: { palette: ["#EA580C", "#D97706"], seed: 126, shapes: ["lotus", "wave"] },
    pathOrder: 26,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "27",
    title: "Rigveda Selected Hymns",
    author: "Various Rishis",
    language: "SANSKRIT",
    difficulty: "B2",
    genre: "Sacred Poetry",
    wordCount: 3600,
    chapterCount: 5,
    synopsis:
      "The Rigveda is the oldest of the Vedas and among the oldest extant texts in any Indo-European language. These selected hymns address Agni, Indra, Varuna, and the cosmic order, showcasing the rich poetic tradition of Vedic Sanskrit.",
    coverStyle: { palette: ["#EA580C", "#7C3AED"], seed: 127, shapes: ["circle", "wave"] },
    pathOrder: 27,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "28",
    title: "Shakuntala Act I",
    author: "Kalidasa",
    language: "SANSKRIT",
    difficulty: "C1",
    genre: "Drama",
    wordCount: 3900,
    chapterCount: 4,
    synopsis:
      "Kalidasa's celebrated drama tells the story of King Dushyanta's encounter with Shakuntala in a forest hermitage. Act I establishes the idyllic setting and the king's fateful first glimpse of the beautiful young woman, widely regarded as the pinnacle of classical Sanskrit literature.",
    coverStyle: { palette: ["#EA580C", "#059669"], seed: 128, shapes: ["arc", "ribbon"] },
    pathOrder: 28,
    isLocked: false,
    isPremium: false,
  },
  // ── Hindi (Bright Orange) ────────────────────────────────────────────────
  {
    id: "29",
    title: "Godan (excerpt)",
    author: "Premchand",
    language: "HINDI",
    difficulty: "B1",
    genre: "Novel",
    wordCount: 6800,
    chapterCount: 6,
    synopsis:
      "Premchand's magnum opus follows the impoverished farmer Hori and his lifelong dream of owning a cow. Considered the greatest Hindi novel, Godan portrays the harsh realities of rural Indian life under colonial rule with deep compassion and unflinching social criticism.",
    coverStyle: { palette: ["#F97316", "#DC2626"], seed: 129, shapes: ["column", "dot-grid"] },
    pathOrder: 29,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "30",
    title: "Ramcharitmanas (excerpt)",
    author: "Tulsidas",
    language: "HINDI",
    difficulty: "B2",
    genre: "Epic Poetry",
    wordCount: 5200,
    chapterCount: 5,
    synopsis:
      "Tulsidas's retelling of the Ramayana in Awadhi Hindi is one of the most beloved works of Indian literature. These selected sections narrate key episodes from Rama's life, combining devotional fervor with sublime poetry that has shaped Hindi literary tradition for centuries.",
    coverStyle: { palette: ["#F97316", "#EA580C"], seed: 130, shapes: ["wave", "temple"] },
    pathOrder: 30,
    isLocked: false,
    isPremium: false,
  },
  // ── Tibetan (Dark Teal) ──────────────────────────────────────────────────
  {
    id: "31",
    title: "Heart Sutra",
    author: "Traditional",
    language: "TIBETAN",
    difficulty: "A2",
    genre: "Sacred",
    wordCount: 1200,
    chapterCount: 3,
    synopsis:
      "The Heart Sutra is one of the most important texts in Mahayana Buddhism, encapsulating the essence of the Prajnaparamita teachings on emptiness. Despite its brevity, it is chanted daily across Buddhist traditions and offers profound insight into the nature of reality.",
    coverStyle: { palette: ["#0D9488", "#7C3AED"], seed: 131, shapes: ["circle", "crescent"] },
    pathOrder: 31,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "32",
    title: "Selected Songs of Milarepa",
    author: "Milarepa",
    language: "TIBETAN",
    difficulty: "B2",
    genre: "Poetry/Philosophy",
    wordCount: 3400,
    chapterCount: 5,
    synopsis:
      "Milarepa is Tibet's most beloved poet-saint, whose songs of realization blend spiritual insight with lyrical beauty. These selections from his Hundred Thousand Songs describe his meditative experiences in mountain caves and his teachings to disciples on the Buddhist path.",
    coverStyle: { palette: ["#0D9488", "#D97706"], seed: 132, shapes: ["wave", "arc"] },
    pathOrder: 32,
    isLocked: false,
    isPremium: false,
  },
  // ── Scots Gaelic (Forest) ────────────────────────────────────────────────
  {
    id: "33",
    title: "Wealth of Nations Book I Ch 1–3",
    author: "Adam Smith",
    language: "SCOTS_GAELIC",
    difficulty: "B2",
    genre: "Philosophy/Economics",
    wordCount: 5800,
    chapterCount: 3,
    synopsis:
      "Adam Smith's foundational work of modern economics examines the division of labor, the origins of trade, and the extent of the market. These opening chapters of the Scottish Enlightenment's most influential text established the principles of classical political economy.",
    coverStyle: { palette: ["#16A34A", "#2563EB"], seed: 133, shapes: ["column", "dot-grid"] },
    pathOrder: 33,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "34",
    title: "Enquiry Concerning Human Understanding Ch 1–4",
    author: "David Hume",
    language: "SCOTS_GAELIC",
    difficulty: "C1",
    genre: "Philosophy",
    wordCount: 6200,
    chapterCount: 4,
    synopsis:
      "Hume's masterful inquiry into the limits of human knowledge examines the distinction between impressions and ideas, the association of thoughts, and the problem of induction. These chapters represent some of the most influential philosophical arguments of the Scottish Enlightenment.",
    coverStyle: { palette: ["#16A34A", "#7C3AED"], seed: 134, shapes: ["circle", "arc"] },
    pathOrder: 34,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "35",
    title: "Selected Poems",
    author: "Robert Burns",
    language: "SCOTS_GAELIC",
    difficulty: "B1",
    genre: "Poetry",
    wordCount: 3200,
    chapterCount: 6,
    synopsis:
      "Robert Burns, Scotland's national poet, wrote in both Scots dialect and English. This selection includes beloved works that celebrate rural life, love, and Scottish identity, capturing the warmth and wit that have made Burns a global literary icon.",
    coverStyle: { palette: ["#16A34A", "#DC2626"], seed: 135, shapes: ["wave", "ribbon"] },
    pathOrder: 35,
    isLocked: false,
    isPremium: false,
  },
  // ── Hebrew (Bronze) ──────────────────────────────────────────────────────
  {
    id: "36",
    title: "Genesis Chapters 1–11",
    author: "Torah",
    language: "HEBREW",
    difficulty: "B1",
    genre: "Sacred",
    wordCount: 7200,
    chapterCount: 11,
    synopsis:
      "The primeval history of Genesis covers creation, the Garden of Eden, Cain and Abel, the Flood, and the Tower of Babel. These foundational chapters of the Hebrew Bible establish the grand narrative arc from cosmic origins to the scattering of nations.",
    coverStyle: { palette: ["#854D0E", "#D97706"], seed: 136, shapes: ["temple", "arc"] },
    pathOrder: 36,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "37",
    title: "Psalms (Selected)",
    author: "Various / David",
    language: "HEBREW",
    difficulty: "A2",
    genre: "Sacred Poetry",
    wordCount: 4800,
    chapterCount: 10,
    synopsis:
      "The Psalms are the great hymnal and prayer book of ancient Israel, encompassing praise, lament, thanksgiving, and wisdom. These ten selected psalms showcase the poetic beauty and emotional range of biblical Hebrew at its finest.",
    coverStyle: { palette: ["#854D0E", "#2563EB"], seed: 137, shapes: ["wave", "laurel"] },
    pathOrder: 37,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "38",
    title: "Ecclesiastes",
    author: "Qoheleth",
    language: "HEBREW",
    difficulty: "B2",
    genre: "Wisdom Literature",
    wordCount: 4200,
    chapterCount: 6,
    synopsis:
      "Ecclesiastes is the Bible's most philosophically provocative book, exploring the meaning of life through the weary eyes of Qoheleth, 'the Teacher.' Its meditations on vanity, time, and the limits of wisdom have resonated with readers across millennia and cultures.",
    coverStyle: { palette: ["#854D0E", "#7C3AED"], seed: 138, shapes: ["circle", "dot-grid"] },
    pathOrder: 38,
    isLocked: false,
    isPremium: false,
  },
  // ── Latin (continued) ────────────────────────────────────────────────────
  {
    id: "39",
    title: "Letters to Lucilius 1–10",
    author: "Seneca",
    language: "LATIN",
    difficulty: "B1",
    genre: "Philosophy",
    wordCount: 5400,
    chapterCount: 10,
    synopsis:
      "Seneca's Moral Letters to his friend Lucilius offer practical Stoic wisdom on how to live well. These first ten letters address the value of time, the practice of philosophy, and the cultivation of inner tranquility amid the distractions of Roman life.",
    coverStyle: { palette: ["#2563EB", "#059669"], seed: 139, shapes: ["scroll", "dot-grid"] },
    pathOrder: 6,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "40",
    title: "Meditations Book I",
    author: "Marcus Aurelius",
    language: "LATIN",
    difficulty: "B2",
    genre: "Philosophy",
    wordCount: 4600,
    chapterCount: 8,
    synopsis:
      "Marcus Aurelius's private philosophical journal opens with a moving account of the debts he owes to his teachers and mentors. Book I of the Meditations reveals the character formation of the Stoic emperor through gratitude and self-examination.",
    coverStyle: { palette: ["#2563EB", "#9333EA"], seed: 140, shapes: ["circle", "column"] },
    pathOrder: 7,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "41",
    title: "De Rerum Natura I",
    author: "Lucretius",
    language: "LATIN",
    difficulty: "C1",
    genre: "Philosophy/Poetry",
    wordCount: 5800,
    chapterCount: 6,
    synopsis:
      "Lucretius's great didactic poem expounds Epicurean physics and philosophy in brilliant hexameter verse. Book I introduces atomic theory, arguing that nothing comes from nothing and that the universe operates through natural law rather than divine intervention.",
    coverStyle: { palette: ["#2563EB", "#0891B2"], seed: 141, shapes: ["wave", "circle"] },
    pathOrder: 8,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "42",
    title: "Confessions Book I",
    author: "Augustine",
    language: "LATIN",
    difficulty: "B2",
    genre: "Autobiography/Philosophy",
    wordCount: 5100,
    chapterCount: 8,
    synopsis:
      "Augustine's Confessions is the first great autobiography in Western literature. Book I recounts his infancy and boyhood in North Africa, reflecting on the nature of sin, memory, and divine grace with unparalleled psychological introspection.",
    coverStyle: { palette: ["#2563EB", "#DB2777"], seed: 142, shapes: ["arc", "scroll"] },
    pathOrder: 9,
    isLocked: false,
    isPremium: false,
  },
  // ── Ancient Greek (continued) ────────────────────────────────────────────
  {
    id: "43",
    title: "Enchiridion",
    author: "Epictetus",
    language: "GREEK",
    difficulty: "B1",
    genre: "Philosophy",
    wordCount: 3800,
    chapterCount: 8,
    synopsis:
      "The Enchiridion, or 'Handbook,' distills the Stoic teachings of the former slave Epictetus into a concise manual for living. Its central message — that we should focus only on what is within our power — has inspired readers from Marcus Aurelius to modern cognitive therapy.",
    coverStyle: { palette: ["#7C3AED", "#059669"], seed: 143, shapes: ["scroll", "column"] },
    pathOrder: 10,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "44",
    title: "Medea",
    author: "Euripides",
    language: "GREEK",
    difficulty: "B2",
    genre: "Drama",
    wordCount: 4200,
    chapterCount: 5,
    synopsis:
      "Euripides' searing tragedy follows Medea, the foreign sorceress abandoned by Jason for a Greek princess. Driven by rage and wounded pride, Medea plots a terrible revenge that remains one of the most psychologically complex portrayals of a woman in ancient literature.",
    coverStyle: { palette: ["#7C3AED", "#DC2626"], seed: 144, shapes: ["arc", "wave"] },
    pathOrder: 11,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "45",
    title: "History I.1–23",
    author: "Thucydides",
    language: "GREEK",
    difficulty: "C1",
    genre: "History",
    wordCount: 5600,
    chapterCount: 6,
    synopsis:
      "Thucydides' opening chapters establish the methodology and scope of his history of the Peloponnesian War. His 'Archaeology' traces Greek power from earliest times, while his famous declaration of writing 'a possession for all time' founded the discipline of critical history.",
    coverStyle: { palette: ["#7C3AED", "#0891B2"], seed: 145, shapes: ["column", "ribbon"] },
    pathOrder: 12,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "46",
    title: "Histories I.1–30",
    author: "Herodotus",
    language: "GREEK",
    difficulty: "B2",
    genre: "History",
    wordCount: 5400,
    chapterCount: 8,
    synopsis:
      "Herodotus, the 'Father of History,' opens his Histories with the legendary conflicts between East and West. These chapters cover the rise of Croesus of Lydia, his fateful encounter with Solon, and the origins of the Greek-Persian rivalry that shaped the ancient world.",
    coverStyle: { palette: ["#7C3AED", "#D97706"], seed: 146, shapes: ["temple", "wave"] },
    pathOrder: 13,
    isLocked: false,
    isPremium: false,
  },
  // ── French (continued) ───────────────────────────────────────────────────
  {
    id: "47",
    title: "Discourse on Method",
    author: "Descartes",
    language: "FRENCH",
    difficulty: "B2",
    genre: "Philosophy",
    wordCount: 6100,
    chapterCount: 6,
    synopsis:
      "Descartes' groundbreaking philosophical treatise, written in French rather than Latin to reach a wider audience, introduces his method of systematic doubt. Its famous conclusion 'I think, therefore I am' became the foundation of modern Western philosophy.",
    coverStyle: { palette: ["#4F46E5", "#059669"], seed: 147, shapes: ["circle", "dot-grid"] },
    pathOrder: 19,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "48",
    title: "Essays (Selections)",
    author: "Montaigne",
    language: "FRENCH",
    difficulty: "C1",
    genre: "Philosophy",
    wordCount: 5800,
    chapterCount: 5,
    synopsis:
      "Montaigne invented the essay as a literary form, using it to explore the full range of human experience. These selections showcase his distinctive voice — skeptical, humane, and endlessly curious — as he examines topics from cannibals to the education of children.",
    coverStyle: { palette: ["#4F46E5", "#D97706"], seed: 148, shapes: ["scroll", "arc"] },
    pathOrder: 20,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "49",
    title: "Candide",
    author: "Voltaire",
    language: "FRENCH",
    difficulty: "B1",
    genre: "Satire",
    wordCount: 5600,
    chapterCount: 8,
    synopsis:
      "Voltaire's razor-sharp satirical novella follows the naive young Candide through a series of catastrophic adventures that systematically demolish the optimistic philosophy that 'all is for the best in the best of all possible worlds.' A masterpiece of wit and social criticism.",
    coverStyle: { palette: ["#4F46E5", "#DC2626"], seed: 149, shapes: ["ribbon", "wave"] },
    pathOrder: 21,
    isLocked: false,
    isPremium: false,
  },
  // ── German (continued) ───────────────────────────────────────────────────
  {
    id: "50",
    title: "Thus Spoke Zarathustra (Prologue)",
    author: "Nietzsche",
    language: "GERMAN",
    difficulty: "C1",
    genre: "Philosophy",
    wordCount: 4800,
    chapterCount: 5,
    synopsis:
      "Nietzsche's most famous work opens with the prophet Zarathustra descending from his mountain solitude to teach mankind about the Overman. The Prologue's dramatic encounter with the townspeople and the tightrope walker introduces his radical philosophy of self-overcoming.",
    coverStyle: { palette: ["#9333EA", "#DC2626"], seed: 150, shapes: ["temple", "wave"] },
    pathOrder: 22,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "51",
    title: "Prolegomena (Introduction)",
    author: "Kant",
    language: "GERMAN",
    difficulty: "C2",
    genre: "Philosophy",
    wordCount: 4200,
    chapterCount: 4,
    synopsis:
      "Kant's Prolegomena to Any Future Metaphysics serves as an accessible introduction to his critical philosophy. The introduction poses the fundamental question of how synthetic a priori judgments are possible, laying the groundwork for his revolutionary theory of knowledge.",
    coverStyle: { palette: ["#9333EA", "#0891B2"], seed: 151, shapes: ["column", "circle"] },
    pathOrder: 23,
    isLocked: false,
    isPremium: false,
  },
  // ── Russian (continued) ──────────────────────────────────────────────────
  {
    id: "52",
    title: "The Cherry Orchard Act I",
    author: "Chekhov",
    language: "RUSSIAN",
    difficulty: "B1",
    genre: "Drama",
    wordCount: 3800,
    chapterCount: 4,
    synopsis:
      "Chekhov's final masterpiece portrays a Russian aristocratic family returning to their estate, which must be sold to pay debts. Act I captures the bittersweet reunion with its beloved cherry orchard, blending comedy and melancholy in Chekhov's signature style.",
    coverStyle: { palette: ["#E11D48", "#059669"], seed: 152, shapes: ["arc", "dot-grid"] },
    pathOrder: 26,
    isLocked: false,
    isPremium: false,
  },
  // ── Italian (continued) ──────────────────────────────────────────────────
  {
    id: "53",
    title: "The Prince Ch 1–10",
    author: "Machiavelli",
    language: "ITALIAN",
    difficulty: "B2",
    genre: "Political Philosophy",
    wordCount: 5600,
    chapterCount: 10,
    synopsis:
      "Machiavelli's infamous treatise on political power examines how principalities are won, maintained, and lost. These opening chapters analyze different types of states and the methods rulers use to acquire and hold power, written with a directness that shocked Renaissance Europe.",
    coverStyle: { palette: ["#059669", "#DC2626"], seed: 153, shapes: ["column", "ribbon"] },
    pathOrder: 21,
    isLocked: false,
    isPremium: false,
  },
  // ── Arabic (continued) ───────────────────────────────────────────────────
  {
    id: "54",
    title: "Muqaddimah (Introduction)",
    author: "Ibn Khaldun",
    language: "ARABIC",
    difficulty: "C1",
    genre: "Philosophy/History",
    wordCount: 5800,
    chapterCount: 5,
    synopsis:
      "Ibn Khaldun's Muqaddimah is considered one of the earliest works of historiography, sociology, and economics. The introduction lays out his revolutionary theory of civilization, examining the rise and fall of dynasties through the lens of social cohesion and group solidarity.",
    coverStyle: { palette: ["#0891B2", "#D97706"], seed: 154, shapes: ["temple", "scroll"] },
    pathOrder: 13,
    isLocked: false,
    isPremium: false,
  },
  {
    id: "55",
    title: "Selected Poems from Masnavi",
    author: "Rumi",
    language: "ARABIC",
    difficulty: "B1",
    genre: "Sufi Poetry",
    wordCount: 3600,
    chapterCount: 6,
    synopsis:
      "Rumi's Masnavi is one of the greatest works of mystical poetry, weaving together parables, stories, and ecstatic verse to illuminate the Sufi path of love. These selected poems explore themes of longing, divine union, and the transformation of the soul.",
    coverStyle: { palette: ["#0891B2", "#DB2777"], seed: 155, shapes: ["wave", "crescent"] },
    pathOrder: 14,
    isLocked: false,
    isPremium: false,
  },
];

// ---------------------------------------------------------------------------
// MOCK_CHAPTERS
// ---------------------------------------------------------------------------

export const MOCK_CHAPTERS: Record<string, MockChapter[]> = {
  // Caesar — De Bello Gallico
  "1": [
    { id: "1-ch-1", bookId: "1", number: 1, title: "The Geography of Gaul", wordCount: 420, estimatedMinutes: 8, completed: true },
    { id: "1-ch-2", bookId: "1", number: 2, title: "The Helvetii Migration", wordCount: 480, estimatedMinutes: 10, completed: true },
    { id: "1-ch-3", bookId: "1", number: 3, title: "Caesar's Response", wordCount: 390, estimatedMinutes: 8, completed: true },
    { id: "1-ch-4", bookId: "1", number: 4, title: "The Battle at the Saone", wordCount: 450, estimatedMinutes: 9, completed: true },
    { id: "1-ch-5", bookId: "1", number: 5, title: "Negotiations with Divico", wordCount: 410, estimatedMinutes: 8, completed: true },
    { id: "1-ch-6", bookId: "1", number: 6, title: "The March to Bibracte", wordCount: 370, estimatedMinutes: 7, completed: false },
    { id: "1-ch-7", bookId: "1", number: 7, title: "The Battle of Bibracte", wordCount: 510, estimatedMinutes: 10, completed: false },
    { id: "1-ch-8", bookId: "1", number: 8, title: "Aftermath and Settlement", wordCount: 390, estimatedMinutes: 8, completed: false },
  ],
  // Cicero — In Catilinam I
  "2": [
    { id: "2-ch-1", bookId: "2", number: 1, title: "How Long, Catiline?", wordCount: 460, estimatedMinutes: 9, completed: true },
    { id: "2-ch-2", bookId: "2", number: 2, title: "The Senate Knows", wordCount: 430, estimatedMinutes: 9, completed: true },
    { id: "2-ch-3", bookId: "2", number: 3, title: "The Night Meeting", wordCount: 480, estimatedMinutes: 10, completed: true },
    { id: "2-ch-4", bookId: "2", number: 4, title: "Catiline's Isolation", wordCount: 410, estimatedMinutes: 8, completed: false },
    { id: "2-ch-5", bookId: "2", number: 5, title: "A Call to Exile", wordCount: 450, estimatedMinutes: 9, completed: false },
    { id: "2-ch-6", bookId: "2", number: 6, title: "Jupiter Will Prevail", wordCount: 390, estimatedMinutes: 8, completed: false },
  ],
  // Virgil — Aeneid Book I
  "3": [
    { id: "3-ch-1", bookId: "3", number: 1, title: "Arms and the Man", wordCount: 340, estimatedMinutes: 7, completed: false },
    { id: "3-ch-2", bookId: "3", number: 2, title: "Juno's Wrath", wordCount: 360, estimatedMinutes: 7, completed: false },
    { id: "3-ch-3", bookId: "3", number: 3, title: "The Storm at Sea", wordCount: 380, estimatedMinutes: 8, completed: false },
    { id: "3-ch-4", bookId: "3", number: 4, title: "Neptune Calms the Waters", wordCount: 320, estimatedMinutes: 6, completed: false },
    { id: "3-ch-5", bookId: "3", number: 5, title: "Landfall in Libya", wordCount: 340, estimatedMinutes: 7, completed: false },
    { id: "3-ch-6", bookId: "3", number: 6, title: "Venus and Jupiter", wordCount: 360, estimatedMinutes: 7, completed: false },
    { id: "3-ch-7", bookId: "3", number: 7, title: "Aeneas Meets His Mother", wordCount: 330, estimatedMinutes: 7, completed: false },
    { id: "3-ch-8", bookId: "3", number: 8, title: "The Hidden City of Carthage", wordCount: 350, estimatedMinutes: 7, completed: false },
    { id: "3-ch-9", bookId: "3", number: 9, title: "Dido's Welcome", wordCount: 340, estimatedMinutes: 7, completed: false },
    { id: "3-ch-10", bookId: "3", number: 10, title: "The Banquet Begins", wordCount: 320, estimatedMinutes: 6, completed: false },
    { id: "3-ch-11", bookId: "3", number: 11, title: "Cupid's Disguise", wordCount: 330, estimatedMinutes: 7, completed: false },
    { id: "3-ch-12", bookId: "3", number: 12, title: "Tell Us Your Story", wordCount: 350, estimatedMinutes: 7, completed: false },
  ],
  // Ovid — Metamorphoses I
  "4": [
    { id: "4-ch-1", bookId: "4", number: 1, title: "Chaos and Creation", wordCount: 380, estimatedMinutes: 8, completed: false },
    { id: "4-ch-2", bookId: "4", number: 2, title: "The Four Ages", wordCount: 360, estimatedMinutes: 7, completed: false },
    { id: "4-ch-3", bookId: "4", number: 3, title: "The Giants' Assault", wordCount: 340, estimatedMinutes: 7, completed: false },
    { id: "4-ch-4", bookId: "4", number: 4, title: "Lycaon the Wolf", wordCount: 370, estimatedMinutes: 7, completed: false },
    { id: "4-ch-5", bookId: "4", number: 5, title: "The Great Flood", wordCount: 400, estimatedMinutes: 8, completed: false },
    { id: "4-ch-6", bookId: "4", number: 6, title: "Deucalion and Pyrrha", wordCount: 350, estimatedMinutes: 7, completed: false },
    { id: "4-ch-7", bookId: "4", number: 7, title: "Apollo and the Python", wordCount: 330, estimatedMinutes: 7, completed: false },
    { id: "4-ch-8", bookId: "4", number: 8, title: "Apollo and Daphne", wordCount: 420, estimatedMinutes: 9, completed: false },
    { id: "4-ch-9", bookId: "4", number: 9, title: "Io and Jupiter", wordCount: 390, estimatedMinutes: 8, completed: false },
    { id: "4-ch-10", bookId: "4", number: 10, title: "Phaethon's Request", wordCount: 360, estimatedMinutes: 7, completed: false },
  ],
  // Livy — Ab Urbe Condita I
  "5": [
    { id: "5-ch-1", bookId: "5", number: 1, title: "The Arrival of Aeneas", wordCount: 650, estimatedMinutes: 13, completed: false },
    { id: "5-ch-2", bookId: "5", number: 2, title: "Romulus and Remus", wordCount: 680, estimatedMinutes: 14, completed: false },
    { id: "5-ch-3", bookId: "5", number: 3, title: "The Founding of Rome", wordCount: 620, estimatedMinutes: 12, completed: false },
    { id: "5-ch-4", bookId: "5", number: 4, title: "The Rape of the Sabines", wordCount: 700, estimatedMinutes: 14, completed: false },
    { id: "5-ch-5", bookId: "5", number: 5, title: "Numa Pompilius", wordCount: 640, estimatedMinutes: 13, completed: false },
    { id: "5-ch-6", bookId: "5", number: 6, title: "Tullus Hostilius", wordCount: 610, estimatedMinutes: 12, completed: false },
    { id: "5-ch-7", bookId: "5", number: 7, title: "Servius Tullius", wordCount: 660, estimatedMinutes: 13, completed: false },
    { id: "5-ch-8", bookId: "5", number: 8, title: "The Fall of the Kings", wordCount: 640, estimatedMinutes: 13, completed: false },
  ],
  // Xenophon — Anabasis Book I
  "6": [
    { id: "6-ch-1", bookId: "6", number: 1, title: "Cyrus and Artaxerxes", wordCount: 310, estimatedMinutes: 6, completed: true },
    { id: "6-ch-2", bookId: "6", number: 2, title: "Gathering the Army", wordCount: 330, estimatedMinutes: 7, completed: true },
    { id: "6-ch-3", bookId: "6", number: 3, title: "The March from Sardis", wordCount: 290, estimatedMinutes: 6, completed: true },
    { id: "6-ch-4", bookId: "6", number: 4, title: "Crossing the Meander", wordCount: 310, estimatedMinutes: 6, completed: false },
    { id: "6-ch-5", bookId: "6", number: 5, title: "Through Phrygia", wordCount: 340, estimatedMinutes: 7, completed: false },
    { id: "6-ch-6", bookId: "6", number: 6, title: "Cilician Gates", wordCount: 300, estimatedMinutes: 6, completed: false },
    { id: "6-ch-7", bookId: "6", number: 7, title: "Dissent in the Ranks", wordCount: 320, estimatedMinutes: 6, completed: false },
    { id: "6-ch-8", bookId: "6", number: 8, title: "The Plains of Babylon", wordCount: 350, estimatedMinutes: 7, completed: false },
    { id: "6-ch-9", bookId: "6", number: 9, title: "The Battle of Cunaxa", wordCount: 380, estimatedMinutes: 8, completed: false },
    { id: "6-ch-10", bookId: "6", number: 10, title: "The Death of Cyrus", wordCount: 310, estimatedMinutes: 6, completed: false },
  ],
  // Plato — Apology
  "7": [
    { id: "7-ch-1", bookId: "7", number: 1, title: "Socrates Addresses the Jury", wordCount: 360, estimatedMinutes: 7, completed: false },
    { id: "7-ch-2", bookId: "7", number: 2, title: "The Oracle at Delphi", wordCount: 380, estimatedMinutes: 8, completed: false },
    { id: "7-ch-3", bookId: "7", number: 3, title: "Examining the Politicians", wordCount: 350, estimatedMinutes: 7, completed: false },
    { id: "7-ch-4", bookId: "7", number: 4, title: "The Poets and Craftsmen", wordCount: 340, estimatedMinutes: 7, completed: false },
    { id: "7-ch-5", bookId: "7", number: 5, title: "Cross-Examining Meletus", wordCount: 390, estimatedMinutes: 8, completed: false },
    { id: "7-ch-6", bookId: "7", number: 6, title: "The Gadfly of Athens", wordCount: 370, estimatedMinutes: 7, completed: false },
    { id: "7-ch-7", bookId: "7", number: 7, title: "The Verdict", wordCount: 340, estimatedMinutes: 7, completed: false },
    { id: "7-ch-8", bookId: "7", number: 8, title: "Death Is Not to Be Feared", wordCount: 370, estimatedMinutes: 7, completed: false },
  ],
  // Homer — Iliad Book I
  "8": [
    { id: "8-ch-1", bookId: "8", number: 1, title: "The Wrath of Achilles", wordCount: 370, estimatedMinutes: 7, completed: false },
    { id: "8-ch-2", bookId: "8", number: 2, title: "Agamemnon's Insult", wordCount: 380, estimatedMinutes: 8, completed: false },
    { id: "8-ch-3", bookId: "8", number: 3, title: "Achilles' Prayer to Thetis", wordCount: 360, estimatedMinutes: 7, completed: false },
    { id: "8-ch-4", bookId: "8", number: 4, title: "Chryses and Apollo's Plague", wordCount: 390, estimatedMinutes: 8, completed: false },
    { id: "8-ch-5", bookId: "8", number: 5, title: "The Assembly of the Greeks", wordCount: 400, estimatedMinutes: 8, completed: false },
    { id: "8-ch-6", bookId: "8", number: 6, title: "Athena Stays Achilles' Hand", wordCount: 350, estimatedMinutes: 7, completed: false },
    { id: "8-ch-7", bookId: "8", number: 7, title: "Nestor's Counsel", wordCount: 370, estimatedMinutes: 7, completed: false },
    { id: "8-ch-8", bookId: "8", number: 8, title: "Briseis Is Taken", wordCount: 340, estimatedMinutes: 7, completed: false },
    { id: "8-ch-9", bookId: "8", number: 9, title: "Thetis and Zeus", wordCount: 380, estimatedMinutes: 8, completed: false },
    { id: "8-ch-10", bookId: "8", number: 10, title: "Hera's Suspicion", wordCount: 360, estimatedMinutes: 7, completed: false },
    { id: "8-ch-11", bookId: "8", number: 11, title: "Hephaestus Makes Peace", wordCount: 330, estimatedMinutes: 7, completed: false },
    { id: "8-ch-12", bookId: "8", number: 12, title: "The Gods at Feast", wordCount: 350, estimatedMinutes: 7, completed: false },
  ],
  // Aristotle — Nicomachean Ethics I
  "9": [
    { id: "9-ch-1", bookId: "9", number: 1, title: "Every Art Aims at Some Good", wordCount: 540, estimatedMinutes: 11, completed: false },
    { id: "9-ch-2", bookId: "9", number: 2, title: "The Science of the Good", wordCount: 560, estimatedMinutes: 11, completed: false },
    { id: "9-ch-3", bookId: "9", number: 3, title: "The Nature of Happiness", wordCount: 530, estimatedMinutes: 11, completed: false },
    { id: "9-ch-4", bookId: "9", number: 4, title: "Popular Views of Happiness", wordCount: 550, estimatedMinutes: 11, completed: false },
    { id: "9-ch-5", bookId: "9", number: 5, title: "Against the Platonic Form", wordCount: 580, estimatedMinutes: 12, completed: false },
    { id: "9-ch-6", bookId: "9", number: 6, title: "Function of a Human Being", wordCount: 520, estimatedMinutes: 10, completed: false },
    { id: "9-ch-7", bookId: "9", number: 7, title: "Happiness and Virtue", wordCount: 520, estimatedMinutes: 10, completed: false },
  ],
  // Gospel of Matthew 1-7 (Peshitta)
  "10": [
    { id: "10-ch-1", bookId: "10", number: 1, title: "The Genealogy of Jesus", wordCount: 340, estimatedMinutes: 7, completed: false },
    { id: "10-ch-2", bookId: "10", number: 2, title: "The Birth of the Messiah", wordCount: 360, estimatedMinutes: 7, completed: false },
    { id: "10-ch-3", bookId: "10", number: 3, title: "The Magi and the Flight", wordCount: 350, estimatedMinutes: 7, completed: false },
    { id: "10-ch-4", bookId: "10", number: 4, title: "John the Baptist", wordCount: 330, estimatedMinutes: 7, completed: false },
    { id: "10-ch-5", bookId: "10", number: 5, title: "The Temptation", wordCount: 310, estimatedMinutes: 6, completed: false },
    { id: "10-ch-6", bookId: "10", number: 6, title: "Blessed Are the Poor", wordCount: 370, estimatedMinutes: 7, completed: false },
    { id: "10-ch-7", bookId: "10", number: 7, title: "Salt, Light, and the Law", wordCount: 340, estimatedMinutes: 7, completed: false },
  ],
  // Selected Surahs
  "11": [
    { id: "11-ch-1", bookId: "11", number: 1, title: "Al-Fatiha: The Opening", wordCount: 180, estimatedMinutes: 4, completed: false },
    { id: "11-ch-2", bookId: "11", number: 2, title: "Al-Baqarah: The Cow (1-20)", wordCount: 520, estimatedMinutes: 10, completed: false },
    { id: "11-ch-3", bookId: "11", number: 3, title: "Al-Baqarah: Parable of Light", wordCount: 480, estimatedMinutes: 10, completed: false },
    { id: "11-ch-4", bookId: "11", number: 4, title: "Al-Baqarah: Adam and the Angels", wordCount: 510, estimatedMinutes: 10, completed: false },
    { id: "11-ch-5", bookId: "11", number: 5, title: "Al-Baqarah: Abraham's Trial", wordCount: 410, estimatedMinutes: 8, completed: false },
  ],
  // Mu'allaqat Selections
  "12": [
    { id: "12-ch-1", bookId: "12", number: 1, title: "Imru' al-Qais: The Abandoned Camp", wordCount: 300, estimatedMinutes: 6, completed: false },
    { id: "12-ch-2", bookId: "12", number: 2, title: "Imru' al-Qais: The Night Ride", wordCount: 310, estimatedMinutes: 6, completed: false },
    { id: "12-ch-3", bookId: "12", number: 3, title: "Tarafa: Youth and Wine", wordCount: 290, estimatedMinutes: 6, completed: false },
    { id: "12-ch-4", bookId: "12", number: 4, title: "Zuhayr: War and Peace", wordCount: 320, estimatedMinutes: 6, completed: false },
    { id: "12-ch-5", bookId: "12", number: 5, title: "Labid: The Ruined Dwelling", wordCount: 280, estimatedMinutes: 6, completed: false },
    { id: "12-ch-6", bookId: "12", number: 6, title: "Antara: The Warrior Poet", wordCount: 300, estimatedMinutes: 6, completed: false },
  ],
  // Shakespeare — Hamlet Act I
  "13": [
    { id: "13-ch-1", bookId: "13", number: 1, title: "Scene 1: The Battlements", wordCount: 960, estimatedMinutes: 12, completed: false },
    { id: "13-ch-2", bookId: "13", number: 2, title: "Scene 2: The Court", wordCount: 1100, estimatedMinutes: 14, completed: false },
    { id: "13-ch-3", bookId: "13", number: 3, title: "Scene 3: Laertes' Farewell", wordCount: 880, estimatedMinutes: 11, completed: false },
    { id: "13-ch-4", bookId: "13", number: 4, title: "Scene 4: The Ghost Appears", wordCount: 920, estimatedMinutes: 12, completed: false },
    { id: "13-ch-5", bookId: "13", number: 5, title: "Scene 5: The Ghost Speaks", wordCount: 940, estimatedMinutes: 12, completed: false },
  ],
  // Milton — Paradise Lost Book I
  "14": [
    { id: "14-ch-1", bookId: "14", number: 1, title: "Invocation to the Muse", wordCount: 780, estimatedMinutes: 10, completed: false },
    { id: "14-ch-2", bookId: "14", number: 2, title: "Satan on the Burning Lake", wordCount: 800, estimatedMinutes: 10, completed: false },
    { id: "14-ch-3", bookId: "14", number: 3, title: "Satan Rallies Beelzebub", wordCount: 760, estimatedMinutes: 10, completed: false },
    { id: "14-ch-4", bookId: "14", number: 4, title: "The Fallen Host Rises", wordCount: 790, estimatedMinutes: 10, completed: false },
    { id: "14-ch-5", bookId: "14", number: 5, title: "Catalogue of Devils", wordCount: 810, estimatedMinutes: 10, completed: false },
    { id: "14-ch-6", bookId: "14", number: 6, title: "Satan's Address", wordCount: 770, estimatedMinutes: 10, completed: false },
    { id: "14-ch-7", bookId: "14", number: 7, title: "Building Pandemonium", wordCount: 750, estimatedMinutes: 10, completed: false },
    { id: "14-ch-8", bookId: "14", number: 8, title: "The Infernal Council", wordCount: 740, estimatedMinutes: 9, completed: false },
  ],
  // Byron — Don Juan Canto I
  "15": [
    { id: "15-ch-1", bookId: "15", number: 1, title: "The Poet's Declaration", wordCount: 680, estimatedMinutes: 9, completed: false },
    { id: "15-ch-2", bookId: "15", number: 2, title: "Juan's Parents", wordCount: 700, estimatedMinutes: 9, completed: false },
    { id: "15-ch-3", bookId: "15", number: 3, title: "Juan's Education", wordCount: 690, estimatedMinutes: 9, completed: false },
    { id: "15-ch-4", bookId: "15", number: 4, title: "Donna Julia", wordCount: 710, estimatedMinutes: 9, completed: false },
    { id: "15-ch-5", bookId: "15", number: 5, title: "The Affair Discovered", wordCount: 660, estimatedMinutes: 8, completed: false },
    { id: "15-ch-6", bookId: "15", number: 6, title: "Juan Sent Abroad", wordCount: 660, estimatedMinutes: 8, completed: false },
  ],
  // Hugo — Les Mis\u00e9rables (excerpt)
  "16": [
    { id: "16-ch-1", bookId: "16", number: 1, title: "Monsieur Myriel", wordCount: 700, estimatedMinutes: 9, completed: false },
    { id: "16-ch-2", bookId: "16", number: 2, title: "The Bishop's Household", wordCount: 720, estimatedMinutes: 9, completed: false },
    { id: "16-ch-3", bookId: "16", number: 3, title: "The Fall of 1815", wordCount: 680, estimatedMinutes: 9, completed: false },
    { id: "16-ch-4", bookId: "16", number: 4, title: "Jean Valjean's Arrival", wordCount: 740, estimatedMinutes: 9, completed: false },
    { id: "16-ch-5", bookId: "16", number: 5, title: "The Theft of Silver", wordCount: 690, estimatedMinutes: 9, completed: false },
    { id: "16-ch-6", bookId: "16", number: 6, title: "The Bishop's Mercy", wordCount: 710, estimatedMinutes: 9, completed: false },
    { id: "16-ch-7", bookId: "16", number: 7, title: "Valjean's Transformation", wordCount: 680, estimatedMinutes: 9, completed: false },
    { id: "16-ch-8", bookId: "16", number: 8, title: "Petit-Gervais", wordCount: 680, estimatedMinutes: 9, completed: false },
  ],
  // Flaubert — Madame Bovary Part I
  "17": [
    { id: "17-ch-1", bookId: "17", number: 1, title: "Charles Bovary's Youth", wordCount: 800, estimatedMinutes: 10, completed: false },
    { id: "17-ch-2", bookId: "17", number: 2, title: "The Rouault Farm", wordCount: 820, estimatedMinutes: 10, completed: false },
    { id: "17-ch-3", bookId: "17", number: 3, title: "The Marriage", wordCount: 780, estimatedMinutes: 10, completed: false },
    { id: "17-ch-4", bookId: "17", number: 4, title: "The House at Tostes", wordCount: 810, estimatedMinutes: 10, completed: false },
    { id: "17-ch-5", bookId: "17", number: 5, title: "Emma's Dreams", wordCount: 790, estimatedMinutes: 10, completed: false },
    { id: "17-ch-6", bookId: "17", number: 6, title: "The Ball at Vaubyessard", wordCount: 840, estimatedMinutes: 11, completed: false },
    { id: "17-ch-7", bookId: "17", number: 7, title: "The Cigar Case", wordCount: 760, estimatedMinutes: 10, completed: false },
    { id: "17-ch-8", bookId: "17", number: 8, title: "Growing Disillusion", wordCount: 800, estimatedMinutes: 10, completed: false },
    { id: "17-ch-9", bookId: "17", number: 9, title: "The Move to Yonville", wordCount: 800, estimatedMinutes: 10, completed: false },
  ],
  // Stendhal — Le Rouge et le Noir Part I
  "18": [
    { id: "18-ch-1", bookId: "18", number: 1, title: "A Small Town", wordCount: 780, estimatedMinutes: 10, completed: false },
    { id: "18-ch-2", bookId: "18", number: 2, title: "A Mayor", wordCount: 790, estimatedMinutes: 10, completed: false },
    { id: "18-ch-3", bookId: "18", number: 3, title: "The Poor Fund", wordCount: 760, estimatedMinutes: 10, completed: false },
    { id: "18-ch-4", bookId: "18", number: 4, title: "Father and Son", wordCount: 800, estimatedMinutes: 10, completed: false },
    { id: "18-ch-5", bookId: "18", number: 5, title: "Negotiation", wordCount: 770, estimatedMinutes: 10, completed: false },
    { id: "18-ch-6", bookId: "18", number: 6, title: "Ennui", wordCount: 810, estimatedMinutes: 10, completed: false },
    { id: "18-ch-7", bookId: "18", number: 7, title: "Elective Affinities", wordCount: 790, estimatedMinutes: 10, completed: false },
    { id: "18-ch-8", bookId: "18", number: 8, title: "Small Events", wordCount: 780, estimatedMinutes: 10, completed: false },
    { id: "18-ch-9", bookId: "18", number: 9, title: "An Evening in the Country", wordCount: 760, estimatedMinutes: 10, completed: false },
    { id: "18-ch-10", bookId: "18", number: 10, title: "A Great Heart", wordCount: 760, estimatedMinutes: 10, completed: false },
  ],
  // Dante — Inferno Cantos I\u2013V
  "19": [
    { id: "19-ch-1", bookId: "19", number: 1, title: "Canto I: The Dark Wood", wordCount: 900, estimatedMinutes: 11, completed: false },
    { id: "19-ch-2", bookId: "19", number: 2, title: "Canto II: The Descent Begins", wordCount: 920, estimatedMinutes: 12, completed: false },
    { id: "19-ch-3", bookId: "19", number: 3, title: "Canto III: The Gate of Hell", wordCount: 880, estimatedMinutes: 11, completed: false },
    { id: "19-ch-4", bookId: "19", number: 4, title: "Canto IV: Limbo", wordCount: 910, estimatedMinutes: 11, completed: false },
    { id: "19-ch-5", bookId: "19", number: 5, title: "Canto V: Paolo and Francesca", wordCount: 890, estimatedMinutes: 11, completed: false },
  ],
  // Ariosto — Orlando Furioso Canto I
  "20": [
    { id: "20-ch-1", bookId: "20", number: 1, title: "The Invocation", wordCount: 630, estimatedMinutes: 8, completed: false },
    { id: "20-ch-2", bookId: "20", number: 2, title: "Angelica's Flight", wordCount: 650, estimatedMinutes: 8, completed: false },
    { id: "20-ch-3", bookId: "20", number: 3, title: "The Forest Pursuit", wordCount: 620, estimatedMinutes: 8, completed: false },
    { id: "20-ch-4", bookId: "20", number: 4, title: "Rinaldo and Ferr\u00e0u", wordCount: 640, estimatedMinutes: 8, completed: false },
    { id: "20-ch-5", bookId: "20", number: 5, title: "Sacripante's Lament", wordCount: 630, estimatedMinutes: 8, completed: false },
    { id: "20-ch-6", bookId: "20", number: 6, title: "Bradamante's Arrival", wordCount: 630, estimatedMinutes: 8, completed: false },
  ],
  // Goethe — Faust Part I Scene 1
  "21": [
    { id: "21-ch-1", bookId: "21", number: 1, title: "Night: Faust's Study", wordCount: 720, estimatedMinutes: 9, completed: false },
    { id: "21-ch-2", bookId: "21", number: 2, title: "The Sign of the Macrocosm", wordCount: 740, estimatedMinutes: 9, completed: false },
    { id: "21-ch-3", bookId: "21", number: 3, title: "The Earth Spirit", wordCount: 700, estimatedMinutes: 9, completed: false },
    { id: "21-ch-4", bookId: "21", number: 4, title: "Wagner's Visit", wordCount: 720, estimatedMinutes: 9, completed: false },
    { id: "21-ch-5", bookId: "21", number: 5, title: "Faust's Despair", wordCount: 720, estimatedMinutes: 9, completed: false },
  ],
  // Cervantes — Don Quijote Ch 1\u20138
  "22": [
    { id: "22-ch-1", bookId: "22", number: 1, title: "The Gentleman of La Mancha", wordCount: 800, estimatedMinutes: 10, completed: false },
    { id: "22-ch-2", bookId: "22", number: 2, title: "The First Sally", wordCount: 820, estimatedMinutes: 10, completed: false },
    { id: "22-ch-3", bookId: "22", number: 3, title: "The Dubbing", wordCount: 780, estimatedMinutes: 10, completed: false },
    { id: "22-ch-4", bookId: "22", number: 4, title: "The Adventure of the Merchants", wordCount: 810, estimatedMinutes: 10, completed: false },
    { id: "22-ch-5", bookId: "22", number: 5, title: "The Return Home", wordCount: 790, estimatedMinutes: 10, completed: false },
    { id: "22-ch-6", bookId: "22", number: 6, title: "The Inquisition of the Library", wordCount: 800, estimatedMinutes: 10, completed: false },
    { id: "22-ch-7", bookId: "22", number: 7, title: "The Second Sally with Sancho", wordCount: 820, estimatedMinutes: 10, completed: false },
    { id: "22-ch-8", bookId: "22", number: 8, title: "The Adventure of the Windmills", wordCount: 780, estimatedMinutes: 10, completed: false },
  ],
  // Tolstoy — Anna Karenina Part I
  "23": [
    { id: "23-ch-1", bookId: "23", number: 1, title: "The Oblonsky Household", wordCount: 680, estimatedMinutes: 9, completed: false },
    { id: "23-ch-2", bookId: "23", number: 2, title: "Stiva's Morning", wordCount: 690, estimatedMinutes: 9, completed: false },
    { id: "23-ch-3", bookId: "23", number: 3, title: "Dolly's Grief", wordCount: 670, estimatedMinutes: 8, completed: false },
    { id: "23-ch-4", bookId: "23", number: 4, title: "Levin in Moscow", wordCount: 700, estimatedMinutes: 9, completed: false },
    { id: "23-ch-5", bookId: "23", number: 5, title: "The Skating Rink", wordCount: 680, estimatedMinutes: 9, completed: false },
    { id: "23-ch-6", bookId: "23", number: 6, title: "Dinner at the Club", wordCount: 690, estimatedMinutes: 9, completed: false },
    { id: "23-ch-7", bookId: "23", number: 7, title: "The Shcherbatsky Salon", wordCount: 670, estimatedMinutes: 8, completed: false },
    { id: "23-ch-8", bookId: "23", number: 8, title: "Levin's Rejection", wordCount: 680, estimatedMinutes: 9, completed: false },
    { id: "23-ch-9", bookId: "23", number: 9, title: "The Ball", wordCount: 700, estimatedMinutes: 9, completed: false },
    { id: "23-ch-10", bookId: "23", number: 10, title: "Anna at the Station", wordCount: 690, estimatedMinutes: 9, completed: false },
    { id: "23-ch-11", bookId: "23", number: 11, title: "Vronsky's Pursuit", wordCount: 680, estimatedMinutes: 9, completed: false },
    { id: "23-ch-12", bookId: "23", number: 12, title: "Anna's Departure", wordCount: 670, estimatedMinutes: 8, completed: false },
  ],
  // Dostoevsky — Crime and Punishment Part I
  "24": [
    { id: "24-ch-1", bookId: "24", number: 1, title: "Raskolnikov's Garret", wordCount: 1010, estimatedMinutes: 13, completed: false },
    { id: "24-ch-2", bookId: "24", number: 2, title: "The Letter from Mother", wordCount: 1040, estimatedMinutes: 13, completed: false },
    { id: "24-ch-3", bookId: "24", number: 3, title: "Marmeladov's Confession", wordCount: 1020, estimatedMinutes: 13, completed: false },
    { id: "24-ch-4", bookId: "24", number: 4, title: "The Drunken Girl", wordCount: 990, estimatedMinutes: 12, completed: false },
    { id: "24-ch-5", bookId: "24", number: 5, title: "The Dream of the Horse", wordCount: 1030, estimatedMinutes: 13, completed: false },
    { id: "24-ch-6", bookId: "24", number: 6, title: "The Preparation", wordCount: 1000, estimatedMinutes: 13, completed: false },
    { id: "24-ch-7", bookId: "24", number: 7, title: "The Murder", wordCount: 1010, estimatedMinutes: 13, completed: false },
  ],
  // Pushkin — Eugene Onegin Ch 1
  "25": [
    { id: "25-ch-1", bookId: "25", number: 1, title: "Onegin's Education", wordCount: 570, estimatedMinutes: 7, completed: false },
    { id: "25-ch-2", bookId: "25", number: 2, title: "A Day in Petersburg", wordCount: 580, estimatedMinutes: 7, completed: false },
    { id: "25-ch-3", bookId: "25", number: 3, title: "The Theatre", wordCount: 560, estimatedMinutes: 7, completed: false },
    { id: "25-ch-4", bookId: "25", number: 4, title: "The Ball", wordCount: 570, estimatedMinutes: 7, completed: false },
    { id: "25-ch-5", bookId: "25", number: 5, title: "Ennui Sets In", wordCount: 560, estimatedMinutes: 7, completed: false },
    { id: "25-ch-6", bookId: "25", number: 6, title: "The Country Estate", wordCount: 560, estimatedMinutes: 7, completed: false },
  ],
  // ── Sanskrit ─────────────────────────────────────────────────────────────
  // Bhagavad Gita Chapters 1–4
  "26": [
    { id: "26-ch-1", bookId: "26", number: 1, title: "Arjuna's Dilemma (Arjuna Vishada Yoga)", wordCount: 1050, estimatedMinutes: 13, completed: false },
    { id: "26-ch-2", bookId: "26", number: 2, title: "The Yoga of Knowledge (Sankhya Yoga)", wordCount: 1100, estimatedMinutes: 14, completed: false },
    { id: "26-ch-3", bookId: "26", number: 3, title: "The Yoga of Action (Karma Yoga)", wordCount: 1000, estimatedMinutes: 13, completed: false },
    { id: "26-ch-4", bookId: "26", number: 4, title: "The Yoga of Renunciation of Action (Jnana Karma Sanyasa Yoga)", wordCount: 1050, estimatedMinutes: 13, completed: false },
  ],
  // Rigveda Selected Hymns
  "27": [
    { id: "27-ch-1", bookId: "27", number: 1, title: "Hymn to Agni (I.1)", wordCount: 720, estimatedMinutes: 9, completed: false },
    { id: "27-ch-2", bookId: "27", number: 2, title: "Hymn to Indra (I.32)", wordCount: 740, estimatedMinutes: 9, completed: false },
    { id: "27-ch-3", bookId: "27", number: 3, title: "Hymn to Varuna (V.85)", wordCount: 700, estimatedMinutes: 9, completed: false },
    { id: "27-ch-4", bookId: "27", number: 4, title: "Hymn of Creation (X.129)", wordCount: 720, estimatedMinutes: 9, completed: false },
    { id: "27-ch-5", bookId: "27", number: 5, title: "Hymn to Dawn (I.113)", wordCount: 720, estimatedMinutes: 9, completed: false },
  ],
  // Kalidasa — Shakuntala Act I
  "28": [
    { id: "28-ch-1", bookId: "28", number: 1, title: "The Royal Hunt", wordCount: 980, estimatedMinutes: 12, completed: false },
    { id: "28-ch-2", bookId: "28", number: 2, title: "The Hermitage Garden", wordCount: 1000, estimatedMinutes: 13, completed: false },
    { id: "28-ch-3", bookId: "28", number: 3, title: "First Sight of Shakuntala", wordCount: 960, estimatedMinutes: 12, completed: false },
    { id: "28-ch-4", bookId: "28", number: 4, title: "The King's Resolve", wordCount: 960, estimatedMinutes: 12, completed: false },
  ],
  // ── Hindi ────────────────────────────────────────────────────────────────
  // Premchand — Godan
  "29": [
    { id: "29-ch-1", bookId: "29", number: 1, title: "Hori's Village", wordCount: 1130, estimatedMinutes: 14, completed: false },
    { id: "29-ch-2", bookId: "29", number: 2, title: "The Dream of a Cow", wordCount: 1150, estimatedMinutes: 14, completed: false },
    { id: "29-ch-3", bookId: "29", number: 3, title: "The Moneylender's Visit", wordCount: 1100, estimatedMinutes: 14, completed: false },
    { id: "29-ch-4", bookId: "29", number: 4, title: "Dhania's Strength", wordCount: 1140, estimatedMinutes: 14, completed: false },
    { id: "29-ch-5", bookId: "29", number: 5, title: "The Landlord's Demand", wordCount: 1120, estimatedMinutes: 14, completed: false },
    { id: "29-ch-6", bookId: "29", number: 6, title: "A Glimmer of Hope", wordCount: 1160, estimatedMinutes: 15, completed: false },
  ],
  // Tulsidas — Ramcharitmanas
  "30": [
    { id: "30-ch-1", bookId: "30", number: 1, title: "Invocation and Praise of Rama", wordCount: 1040, estimatedMinutes: 13, completed: false },
    { id: "30-ch-2", bookId: "30", number: 2, title: "The Birth of Rama", wordCount: 1060, estimatedMinutes: 13, completed: false },
    { id: "30-ch-3", bookId: "30", number: 3, title: "Rama's Childhood", wordCount: 1020, estimatedMinutes: 13, completed: false },
    { id: "30-ch-4", bookId: "30", number: 4, title: "The Bow of Shiva", wordCount: 1040, estimatedMinutes: 13, completed: false },
    { id: "30-ch-5", bookId: "30", number: 5, title: "Sita's Swayamvara", wordCount: 1040, estimatedMinutes: 13, completed: false },
  ],
  // ── Tibetan ──────────────────────────────────────────────────────────────
  // Heart Sutra
  "31": [
    { id: "31-ch-1", bookId: "31", number: 1, title: "Setting and Invocation", wordCount: 400, estimatedMinutes: 5, completed: false },
    { id: "31-ch-2", bookId: "31", number: 2, title: "Form Is Emptiness", wordCount: 420, estimatedMinutes: 5, completed: false },
    { id: "31-ch-3", bookId: "31", number: 3, title: "The Great Mantra", wordCount: 380, estimatedMinutes: 5, completed: false },
  ],
  // Milarepa — Selected Songs
  "32": [
    { id: "32-ch-1", bookId: "32", number: 1, title: "Song of the Snow Mountain", wordCount: 680, estimatedMinutes: 9, completed: false },
    { id: "32-ch-2", bookId: "32", number: 2, title: "Song of Impermanence", wordCount: 700, estimatedMinutes: 9, completed: false },
    { id: "32-ch-3", bookId: "32", number: 3, title: "Song to the Young Shepherdess", wordCount: 660, estimatedMinutes: 8, completed: false },
    { id: "32-ch-4", bookId: "32", number: 4, title: "Song of Realization in the Cave", wordCount: 680, estimatedMinutes: 9, completed: false },
    { id: "32-ch-5", bookId: "32", number: 5, title: "Song of the Six Perfections", wordCount: 680, estimatedMinutes: 9, completed: false },
  ],
  // ── Scots Gaelic ─────────────────────────────────────────────────────────
  // Adam Smith — Wealth of Nations
  "33": [
    { id: "33-ch-1", bookId: "33", number: 1, title: "Of the Division of Labour", wordCount: 1930, estimatedMinutes: 24, completed: false },
    { id: "33-ch-2", bookId: "33", number: 2, title: "Of the Principle Which Gives Occasion to the Division of Labour", wordCount: 1920, estimatedMinutes: 24, completed: false },
    { id: "33-ch-3", bookId: "33", number: 3, title: "That the Division of Labour Is Limited by the Extent of the Market", wordCount: 1950, estimatedMinutes: 24, completed: false },
  ],
  // David Hume — Enquiry Concerning Human Understanding
  "34": [
    { id: "34-ch-1", bookId: "34", number: 1, title: "Of the Different Species of Philosophy", wordCount: 1550, estimatedMinutes: 19, completed: false },
    { id: "34-ch-2", bookId: "34", number: 2, title: "Of the Origin of Ideas", wordCount: 1540, estimatedMinutes: 19, completed: false },
    { id: "34-ch-3", bookId: "34", number: 3, title: "Of the Association of Ideas", wordCount: 1560, estimatedMinutes: 20, completed: false },
    { id: "34-ch-4", bookId: "34", number: 4, title: "Sceptical Doubts Concerning the Operations of the Understanding", wordCount: 1550, estimatedMinutes: 19, completed: false },
  ],
  // Robert Burns — Selected Poems
  "35": [
    { id: "35-ch-1", bookId: "35", number: 1, title: "To a Mouse", wordCount: 530, estimatedMinutes: 7, completed: false },
    { id: "35-ch-2", bookId: "35", number: 2, title: "To a Louse", wordCount: 540, estimatedMinutes: 7, completed: false },
    { id: "35-ch-3", bookId: "35", number: 3, title: "A Red, Red Rose", wordCount: 520, estimatedMinutes: 7, completed: false },
    { id: "35-ch-4", bookId: "35", number: 4, title: "Auld Lang Syne", wordCount: 540, estimatedMinutes: 7, completed: false },
    { id: "35-ch-5", bookId: "35", number: 5, title: "Tam o' Shanter", wordCount: 560, estimatedMinutes: 7, completed: false },
    { id: "35-ch-6", bookId: "35", number: 6, title: "Address to the Deil", wordCount: 510, estimatedMinutes: 6, completed: false },
  ],
  // ── Hebrew ───────────────────────────────────────────────────────────────
  // Genesis 1–11
  "36": [
    { id: "36-ch-1", bookId: "36", number: 1, title: "Bereshit: In the Beginning", wordCount: 650, estimatedMinutes: 8, completed: false },
    { id: "36-ch-2", bookId: "36", number: 2, title: "The Garden of Eden", wordCount: 660, estimatedMinutes: 8, completed: false },
    { id: "36-ch-3", bookId: "36", number: 3, title: "The Fall", wordCount: 640, estimatedMinutes: 8, completed: false },
    { id: "36-ch-4", bookId: "36", number: 4, title: "Cain and Abel", wordCount: 660, estimatedMinutes: 8, completed: false },
    { id: "36-ch-5", bookId: "36", number: 5, title: "The Generations of Adam", wordCount: 650, estimatedMinutes: 8, completed: false },
    { id: "36-ch-6", bookId: "36", number: 6, title: "The Corruption of Mankind", wordCount: 660, estimatedMinutes: 8, completed: false },
    { id: "36-ch-7", bookId: "36", number: 7, title: "The Flood", wordCount: 670, estimatedMinutes: 8, completed: false },
    { id: "36-ch-8", bookId: "36", number: 8, title: "The Waters Recede", wordCount: 650, estimatedMinutes: 8, completed: false },
    { id: "36-ch-9", bookId: "36", number: 9, title: "The Covenant with Noah", wordCount: 660, estimatedMinutes: 8, completed: false },
    { id: "36-ch-10", bookId: "36", number: 10, title: "The Table of Nations", wordCount: 650, estimatedMinutes: 8, completed: false },
    { id: "36-ch-11", bookId: "36", number: 11, title: "The Tower of Babel", wordCount: 650, estimatedMinutes: 8, completed: false },
  ],
  // Psalms (Selected)
  "37": [
    { id: "37-ch-1", bookId: "37", number: 1, title: "Psalm 1: The Two Ways", wordCount: 480, estimatedMinutes: 6, completed: false },
    { id: "37-ch-2", bookId: "37", number: 2, title: "Psalm 8: The Majesty of God", wordCount: 480, estimatedMinutes: 6, completed: false },
    { id: "37-ch-3", bookId: "37", number: 3, title: "Psalm 19: The Heavens Declare", wordCount: 490, estimatedMinutes: 6, completed: false },
    { id: "37-ch-4", bookId: "37", number: 4, title: "Psalm 23: The Lord Is My Shepherd", wordCount: 470, estimatedMinutes: 6, completed: false },
    { id: "37-ch-5", bookId: "37", number: 5, title: "Psalm 42: As a Deer Pants", wordCount: 480, estimatedMinutes: 6, completed: false },
    { id: "37-ch-6", bookId: "37", number: 6, title: "Psalm 51: Create in Me a Clean Heart", wordCount: 490, estimatedMinutes: 6, completed: false },
    { id: "37-ch-7", bookId: "37", number: 7, title: "Psalm 90: Lord, You Have Been Our Dwelling", wordCount: 480, estimatedMinutes: 6, completed: false },
    { id: "37-ch-8", bookId: "37", number: 8, title: "Psalm 104: Bless the Lord, O My Soul", wordCount: 490, estimatedMinutes: 6, completed: false },
    { id: "37-ch-9", bookId: "37", number: 9, title: "Psalm 137: By the Rivers of Babylon", wordCount: 470, estimatedMinutes: 6, completed: false },
    { id: "37-ch-10", bookId: "37", number: 10, title: "Psalm 150: Let Everything Praise the Lord", wordCount: 470, estimatedMinutes: 6, completed: false },
  ],
  // Ecclesiastes
  "38": [
    { id: "38-ch-1", bookId: "38", number: 1, title: "Vanity of Vanities", wordCount: 700, estimatedMinutes: 9, completed: false },
    { id: "38-ch-2", bookId: "38", number: 2, title: "The Futility of Pleasure and Toil", wordCount: 710, estimatedMinutes: 9, completed: false },
    { id: "38-ch-3", bookId: "38", number: 3, title: "A Time for Everything", wordCount: 690, estimatedMinutes: 9, completed: false },
    { id: "38-ch-4", bookId: "38", number: 4, title: "The Oppressed and the Lonely", wordCount: 700, estimatedMinutes: 9, completed: false },
    { id: "38-ch-5", bookId: "38", number: 5, title: "Fear God and Keep Your Vows", wordCount: 700, estimatedMinutes: 9, completed: false },
    { id: "38-ch-6", bookId: "38", number: 6, title: "The Limits of Wealth", wordCount: 700, estimatedMinutes: 9, completed: false },
  ],
  // ── Latin (continued) ────────────────────────────────────────────────────
  // Seneca — Letters to Lucilius 1–10
  "39": [
    { id: "39-ch-1", bookId: "39", number: 1, title: "Letter 1: On Saving Time", wordCount: 540, estimatedMinutes: 7, completed: false },
    { id: "39-ch-2", bookId: "39", number: 2, title: "Letter 2: On Discursiveness in Reading", wordCount: 540, estimatedMinutes: 7, completed: false },
    { id: "39-ch-3", bookId: "39", number: 3, title: "Letter 3: On True and False Friendship", wordCount: 540, estimatedMinutes: 7, completed: false },
    { id: "39-ch-4", bookId: "39", number: 4, title: "Letter 4: On the Terrors of Death", wordCount: 540, estimatedMinutes: 7, completed: false },
    { id: "39-ch-5", bookId: "39", number: 5, title: "Letter 5: On the Philosopher's Mean", wordCount: 540, estimatedMinutes: 7, completed: false },
    { id: "39-ch-6", bookId: "39", number: 6, title: "Letter 6: On Sharing Knowledge", wordCount: 540, estimatedMinutes: 7, completed: false },
    { id: "39-ch-7", bookId: "39", number: 7, title: "Letter 7: On Crowds", wordCount: 540, estimatedMinutes: 7, completed: false },
    { id: "39-ch-8", bookId: "39", number: 8, title: "Letter 8: On the Philosopher's Seclusion", wordCount: 540, estimatedMinutes: 7, completed: false },
    { id: "39-ch-9", bookId: "39", number: 9, title: "Letter 9: On Philosophy and Friendship", wordCount: 540, estimatedMinutes: 7, completed: false },
    { id: "39-ch-10", bookId: "39", number: 10, title: "Letter 10: On Living to Oneself", wordCount: 540, estimatedMinutes: 7, completed: false },
  ],
  // Marcus Aurelius — Meditations Book I
  "40": [
    { id: "40-ch-1", bookId: "40", number: 1, title: "Debts to My Grandfather", wordCount: 580, estimatedMinutes: 7, completed: false },
    { id: "40-ch-2", bookId: "40", number: 2, title: "Debts to My Mother", wordCount: 570, estimatedMinutes: 7, completed: false },
    { id: "40-ch-3", bookId: "40", number: 3, title: "Lessons from My Tutors", wordCount: 580, estimatedMinutes: 7, completed: false },
    { id: "40-ch-4", bookId: "40", number: 4, title: "From Diognetus", wordCount: 570, estimatedMinutes: 7, completed: false },
    { id: "40-ch-5", bookId: "40", number: 5, title: "From Rusticus", wordCount: 580, estimatedMinutes: 7, completed: false },
    { id: "40-ch-6", bookId: "40", number: 6, title: "From Apollonius", wordCount: 570, estimatedMinutes: 7, completed: false },
    { id: "40-ch-7", bookId: "40", number: 7, title: "From Sextus", wordCount: 580, estimatedMinutes: 7, completed: false },
    { id: "40-ch-8", bookId: "40", number: 8, title: "From the Gods", wordCount: 570, estimatedMinutes: 7, completed: false },
  ],
  // Lucretius — De Rerum Natura I
  "41": [
    { id: "41-ch-1", bookId: "41", number: 1, title: "Invocation to Venus", wordCount: 970, estimatedMinutes: 12, completed: false },
    { id: "41-ch-2", bookId: "41", number: 2, title: "Praise of Epicurus", wordCount: 960, estimatedMinutes: 12, completed: false },
    { id: "41-ch-3", bookId: "41", number: 3, title: "Nothing Comes from Nothing", wordCount: 980, estimatedMinutes: 12, completed: false },
    { id: "41-ch-4", bookId: "41", number: 4, title: "Nothing Returns to Nothing", wordCount: 960, estimatedMinutes: 12, completed: false },
    { id: "41-ch-5", bookId: "41", number: 5, title: "The Atoms and the Void", wordCount: 970, estimatedMinutes: 12, completed: false },
    { id: "41-ch-6", bookId: "41", number: 6, title: "Against the Stoics", wordCount: 960, estimatedMinutes: 12, completed: false },
  ],
  // Augustine — Confessions Book I
  "42": [
    { id: "42-ch-1", bookId: "42", number: 1, title: "Invocation and Praise", wordCount: 640, estimatedMinutes: 8, completed: false },
    { id: "42-ch-2", bookId: "42", number: 2, title: "Infancy", wordCount: 630, estimatedMinutes: 8, completed: false },
    { id: "42-ch-3", bookId: "42", number: 3, title: "Learning to Speak", wordCount: 640, estimatedMinutes: 8, completed: false },
    { id: "42-ch-4", bookId: "42", number: 4, title: "Boyhood and School", wordCount: 650, estimatedMinutes: 8, completed: false },
    { id: "42-ch-5", bookId: "42", number: 5, title: "The Hatred of Greek", wordCount: 630, estimatedMinutes: 8, completed: false },
    { id: "42-ch-6", bookId: "42", number: 6, title: "The Pear Tree", wordCount: 640, estimatedMinutes: 8, completed: false },
    { id: "42-ch-7", bookId: "42", number: 7, title: "Childish Sins", wordCount: 630, estimatedMinutes: 8, completed: false },
    { id: "42-ch-8", bookId: "42", number: 8, title: "Thanksgiving", wordCount: 640, estimatedMinutes: 8, completed: false },
  ],
  // ── Ancient Greek (continued) ────────────────────────────────────────────
  // Epictetus — Enchiridion
  "43": [
    { id: "43-ch-1", bookId: "43", number: 1, title: "What Is Up to Us", wordCount: 480, estimatedMinutes: 6, completed: false },
    { id: "43-ch-2", bookId: "43", number: 2, title: "Desire and Aversion", wordCount: 470, estimatedMinutes: 6, completed: false },
    { id: "43-ch-3", bookId: "43", number: 3, title: "Appearances and Judgment", wordCount: 480, estimatedMinutes: 6, completed: false },
    { id: "43-ch-4", bookId: "43", number: 4, title: "Dealing with Hardship", wordCount: 470, estimatedMinutes: 6, completed: false },
    { id: "43-ch-5", bookId: "43", number: 5, title: "Social Relations", wordCount: 480, estimatedMinutes: 6, completed: false },
    { id: "43-ch-6", bookId: "43", number: 6, title: "The Philosopher's Practice", wordCount: 470, estimatedMinutes: 6, completed: false },
    { id: "43-ch-7", bookId: "43", number: 7, title: "On Freedom", wordCount: 480, estimatedMinutes: 6, completed: false },
    { id: "43-ch-8", bookId: "43", number: 8, title: "The Socratic Model", wordCount: 470, estimatedMinutes: 6, completed: false },
  ],
  // Euripides — Medea
  "44": [
    { id: "44-ch-1", bookId: "44", number: 1, title: "Prologue: The Nurse's Lament", wordCount: 840, estimatedMinutes: 11, completed: false },
    { id: "44-ch-2", bookId: "44", number: 2, title: "Parodos: The Chorus of Corinthian Women", wordCount: 840, estimatedMinutes: 11, completed: false },
    { id: "44-ch-3", bookId: "44", number: 3, title: "First Episode: Medea and Creon", wordCount: 860, estimatedMinutes: 11, completed: false },
    { id: "44-ch-4", bookId: "44", number: 4, title: "Second Episode: Medea and Jason", wordCount: 840, estimatedMinutes: 11, completed: false },
    { id: "44-ch-5", bookId: "44", number: 5, title: "Third Episode: Aegeus and the Plan", wordCount: 820, estimatedMinutes: 10, completed: false },
  ],
  // Thucydides — History I.1–23
  "45": [
    { id: "45-ch-1", bookId: "45", number: 1, title: "The Opening Statement", wordCount: 930, estimatedMinutes: 12, completed: false },
    { id: "45-ch-2", bookId: "45", number: 2, title: "The Archaeology: Earliest Greece", wordCount: 940, estimatedMinutes: 12, completed: false },
    { id: "45-ch-3", bookId: "45", number: 3, title: "The Growth of Naval Power", wordCount: 930, estimatedMinutes: 12, completed: false },
    { id: "45-ch-4", bookId: "45", number: 4, title: "The Rise of Athens and Sparta", wordCount: 940, estimatedMinutes: 12, completed: false },
    { id: "45-ch-5", bookId: "45", number: 5, title: "Methodology: A Possession for All Time", wordCount: 930, estimatedMinutes: 12, completed: false },
    { id: "45-ch-6", bookId: "45", number: 6, title: "The True Cause of the War", wordCount: 930, estimatedMinutes: 12, completed: false },
  ],
  // Herodotus — Histories I.1–30
  "46": [
    { id: "46-ch-1", bookId: "46", number: 1, title: "The Abduction of Io", wordCount: 680, estimatedMinutes: 9, completed: false },
    { id: "46-ch-2", bookId: "46", number: 2, title: "Europa and Medea", wordCount: 670, estimatedMinutes: 8, completed: false },
    { id: "46-ch-3", bookId: "46", number: 3, title: "The Abduction of Helen", wordCount: 680, estimatedMinutes: 9, completed: false },
    { id: "46-ch-4", bookId: "46", number: 4, title: "Croesus of Lydia", wordCount: 690, estimatedMinutes: 9, completed: false },
    { id: "46-ch-5", bookId: "46", number: 5, title: "Solon Visits Croesus", wordCount: 670, estimatedMinutes: 8, completed: false },
    { id: "46-ch-6", bookId: "46", number: 6, title: "The Story of Tellus", wordCount: 680, estimatedMinutes: 9, completed: false },
    { id: "46-ch-7", bookId: "46", number: 7, title: "Cleobis and Biton", wordCount: 660, estimatedMinutes: 8, completed: false },
    { id: "46-ch-8", bookId: "46", number: 8, title: "The Fate of Atys", wordCount: 670, estimatedMinutes: 8, completed: false },
  ],
  // ── French (continued) ───────────────────────────────────────────────────
  // Descartes — Discourse on Method
  "47": [
    { id: "47-ch-1", bookId: "47", number: 1, title: "Various Considerations on the Sciences", wordCount: 1020, estimatedMinutes: 13, completed: false },
    { id: "47-ch-2", bookId: "47", number: 2, title: "The Principal Rules of the Method", wordCount: 1010, estimatedMinutes: 13, completed: false },
    { id: "47-ch-3", bookId: "47", number: 3, title: "Some Moral Rules from the Method", wordCount: 1020, estimatedMinutes: 13, completed: false },
    { id: "47-ch-4", bookId: "47", number: 4, title: "Proofs of God and the Soul", wordCount: 1010, estimatedMinutes: 13, completed: false },
    { id: "47-ch-5", bookId: "47", number: 5, title: "Questions of Physics", wordCount: 1020, estimatedMinutes: 13, completed: false },
    { id: "47-ch-6", bookId: "47", number: 6, title: "Prerequisites for Further Advancement", wordCount: 1020, estimatedMinutes: 13, completed: false },
  ],
  // Montaigne — Essays (Selections)
  "48": [
    { id: "48-ch-1", bookId: "48", number: 1, title: "Of Idleness", wordCount: 1160, estimatedMinutes: 15, completed: false },
    { id: "48-ch-2", bookId: "48", number: 2, title: "Of Cannibals", wordCount: 1180, estimatedMinutes: 15, completed: false },
    { id: "48-ch-3", bookId: "48", number: 3, title: "Of the Education of Children", wordCount: 1160, estimatedMinutes: 15, completed: false },
    { id: "48-ch-4", bookId: "48", number: 4, title: "Of Solitude", wordCount: 1140, estimatedMinutes: 14, completed: false },
    { id: "48-ch-5", bookId: "48", number: 5, title: "Of Experience", wordCount: 1160, estimatedMinutes: 15, completed: false },
  ],
  // Voltaire — Candide
  "49": [
    { id: "49-ch-1", bookId: "49", number: 1, title: "The Castle of Thunder-ten-Tronckh", wordCount: 700, estimatedMinutes: 9, completed: false },
    { id: "49-ch-2", bookId: "49", number: 2, title: "Among the Bulgarians", wordCount: 700, estimatedMinutes: 9, completed: false },
    { id: "49-ch-3", bookId: "49", number: 3, title: "The Storm and the Earthquake", wordCount: 700, estimatedMinutes: 9, completed: false },
    { id: "49-ch-4", bookId: "49", number: 4, title: "Pangloss and the Inquisition", wordCount: 700, estimatedMinutes: 9, completed: false },
    { id: "49-ch-5", bookId: "49", number: 5, title: "Cunégonde's Story", wordCount: 700, estimatedMinutes: 9, completed: false },
    { id: "49-ch-6", bookId: "49", number: 6, title: "Eldorado", wordCount: 700, estimatedMinutes: 9, completed: false },
    { id: "49-ch-7", bookId: "49", number: 7, title: "Martin the Pessimist", wordCount: 700, estimatedMinutes: 9, completed: false },
    { id: "49-ch-8", bookId: "49", number: 8, title: "We Must Cultivate Our Garden", wordCount: 700, estimatedMinutes: 9, completed: false },
  ],
  // ── German (continued) ───────────────────────────────────────────────────
  // Nietzsche — Thus Spoke Zarathustra
  "50": [
    { id: "50-ch-1", bookId: "50", number: 1, title: "Zarathustra's Descent", wordCount: 960, estimatedMinutes: 12, completed: false },
    { id: "50-ch-2", bookId: "50", number: 2, title: "The Saint in the Forest", wordCount: 960, estimatedMinutes: 12, completed: false },
    { id: "50-ch-3", bookId: "50", number: 3, title: "The Overman and the Last Man", wordCount: 980, estimatedMinutes: 12, completed: false },
    { id: "50-ch-4", bookId: "50", number: 4, title: "The Tightrope Walker", wordCount: 960, estimatedMinutes: 12, completed: false },
    { id: "50-ch-5", bookId: "50", number: 5, title: "The Companions of the Living", wordCount: 940, estimatedMinutes: 12, completed: false },
  ],
  // Kant — Prolegomena
  "51": [
    { id: "51-ch-1", bookId: "51", number: 1, title: "Preliminary Remark on the Peculiarity of Metaphysics", wordCount: 1050, estimatedMinutes: 13, completed: false },
    { id: "51-ch-2", bookId: "51", number: 2, title: "The General Question: Is Metaphysics Possible?", wordCount: 1050, estimatedMinutes: 13, completed: false },
    { id: "51-ch-3", bookId: "51", number: 3, title: "The General Problem: How Is Knowledge from Pure Reason Possible?", wordCount: 1060, estimatedMinutes: 13, completed: false },
    { id: "51-ch-4", bookId: "51", number: 4, title: "The Distinction Between Analytic and Synthetic Judgments", wordCount: 1040, estimatedMinutes: 13, completed: false },
  ],
  // ── Russian (continued) ──────────────────────────────────────────────────
  // Chekhov — The Cherry Orchard
  "52": [
    { id: "52-ch-1", bookId: "52", number: 1, title: "The Homecoming", wordCount: 950, estimatedMinutes: 12, completed: false },
    { id: "52-ch-2", bookId: "52", number: 2, title: "Memories and the Nursery", wordCount: 960, estimatedMinutes: 12, completed: false },
    { id: "52-ch-3", bookId: "52", number: 3, title: "Lopakhin's Proposal", wordCount: 940, estimatedMinutes: 12, completed: false },
    { id: "52-ch-4", bookId: "52", number: 4, title: "The Orchard at Dawn", wordCount: 950, estimatedMinutes: 12, completed: false },
  ],
  // ── Italian (continued) ──────────────────────────────────────────────────
  // Machiavelli — The Prince
  "53": [
    { id: "53-ch-1", bookId: "53", number: 1, title: "How Many Kinds of Principalities There Are", wordCount: 560, estimatedMinutes: 7, completed: false },
    { id: "53-ch-2", bookId: "53", number: 2, title: "Of Hereditary Principalities", wordCount: 560, estimatedMinutes: 7, completed: false },
    { id: "53-ch-3", bookId: "53", number: 3, title: "Of Mixed Principalities", wordCount: 560, estimatedMinutes: 7, completed: false },
    { id: "53-ch-4", bookId: "53", number: 4, title: "Why the Kingdom of Darius Did Not Rebel", wordCount: 560, estimatedMinutes: 7, completed: false },
    { id: "53-ch-5", bookId: "53", number: 5, title: "How Cities Should Be Governed", wordCount: 560, estimatedMinutes: 7, completed: false },
    { id: "53-ch-6", bookId: "53", number: 6, title: "Of New Principalities Won by Arms", wordCount: 560, estimatedMinutes: 7, completed: false },
    { id: "53-ch-7", bookId: "53", number: 7, title: "Of New Principalities Won by Fortune", wordCount: 560, estimatedMinutes: 7, completed: false },
    { id: "53-ch-8", bookId: "53", number: 8, title: "Of Those Who Have Attained Principality Through Wickedness", wordCount: 560, estimatedMinutes: 7, completed: false },
    { id: "53-ch-9", bookId: "53", number: 9, title: "Of the Civil Principality", wordCount: 560, estimatedMinutes: 7, completed: false },
    { id: "53-ch-10", bookId: "53", number: 10, title: "How the Strength of Principalities Should Be Measured", wordCount: 560, estimatedMinutes: 7, completed: false },
  ],
  // ── Arabic (continued) ───────────────────────────────────────────────────
  // Ibn Khaldun — Muqaddimah
  "54": [
    { id: "54-ch-1", bookId: "54", number: 1, title: "The Nature of Civilization", wordCount: 1160, estimatedMinutes: 15, completed: false },
    { id: "54-ch-2", bookId: "54", number: 2, title: "Bedouin and Settled Life", wordCount: 1160, estimatedMinutes: 15, completed: false },
    { id: "54-ch-3", bookId: "54", number: 3, title: "Asabiyyah: Group Solidarity", wordCount: 1180, estimatedMinutes: 15, completed: false },
    { id: "54-ch-4", bookId: "54", number: 4, title: "The Rise of Dynasties", wordCount: 1150, estimatedMinutes: 14, completed: false },
    { id: "54-ch-5", bookId: "54", number: 5, title: "The Fall of Dynasties", wordCount: 1150, estimatedMinutes: 14, completed: false },
  ],
  // Rumi — Selected Poems from Masnavi
  "55": [
    { id: "55-ch-1", bookId: "55", number: 1, title: "The Song of the Reed", wordCount: 600, estimatedMinutes: 8, completed: false },
    { id: "55-ch-2", bookId: "55", number: 2, title: "The Parrot and the Merchant", wordCount: 600, estimatedMinutes: 8, completed: false },
    { id: "55-ch-3", bookId: "55", number: 3, title: "Moses and the Shepherd", wordCount: 600, estimatedMinutes: 8, completed: false },
    { id: "55-ch-4", bookId: "55", number: 4, title: "The Elephant in the Dark Room", wordCount: 600, estimatedMinutes: 8, completed: false },
    { id: "55-ch-5", bookId: "55", number: 5, title: "The Guest House", wordCount: 600, estimatedMinutes: 8, completed: false },
    { id: "55-ch-6", bookId: "55", number: 6, title: "Love Is the Astrolabe of God's Mysteries", wordCount: 600, estimatedMinutes: 8, completed: false },
  ],
};

// ---------------------------------------------------------------------------
// MOCK_PARAGRAPHS  (real classical text for first 3 priority books;
//                   sample content for the rest)
// ---------------------------------------------------------------------------

export const MOCK_PARAGRAPHS: Record<string, Paragraph[]> = {
  // ── Caesar, De Bello Gallico I.1-I.3 ──────────────────────────────────
  "1-ch-1": [
    { id: "p-1-1-1", chapterId: "1-ch-1", order: 1, original: "Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.", translation: "All Gaul is divided into three parts, one of which the Belgae inhabit, another the Aquitani, and the third those who in their own language are called Celts, in ours Gauls." },
    { id: "p-1-1-2", chapterId: "1-ch-1", order: 2, original: "Hi omnes lingua, institutis, legibus inter se differunt. Gallos ab Aquitanis Garumna flumen, a Belgis Matrona et Sequana dividit.", translation: "All these differ from one another in language, customs, and laws. The river Garonne separates the Gauls from the Aquitani; the Marne and the Seine separate them from the Belgae." },
    { id: "p-1-1-3", chapterId: "1-ch-1", order: 3, original: "Horum omnium fortissimi sunt Belgae, propterea quod a cultu atque humanitate provinciae longissime absunt, minimeque ad eos mercatores saepe commeant atque ea quae ad effeminandos animos pertinent important.", translation: "Of all these, the Belgae are the bravest, because they are farthest from the civilization and refinement of our Province, and merchants least frequently resort to them and import those things which tend to make the spirit weak." },
    { id: "p-1-1-4", chapterId: "1-ch-1", order: 4, original: "Proximique sunt Germanis, qui trans Rhenum incolunt, quibuscum continenter bellum gerunt. Qua de causa Helvetii quoque reliquos Gallos virtute praecedunt, quod fere cotidianis proeliis cum Germanis contendunt.", translation: "They are the nearest to the Germans, who dwell beyond the Rhine, with whom they are continually waging war. For this reason the Helvetii also surpass the rest of the Gauls in valor, as they contend with the Germans in almost daily battles." },
  ],
  "1-ch-2": [
    { id: "p-1-2-1", chapterId: "1-ch-2", order: 1, original: "Apud Helvetios longe nobilissimus fuit et ditissimus Orgetorix. Is M. Messala, M. Pisone consulibus regni cupiditate inductus coniurationem nobilitatis fecit.", translation: "Among the Helvetii, Orgetorix was by far the most noble and wealthy. He, when Marcus Messala and Marcus Piso were consuls, was induced by desire for kingship and formed a conspiracy among the nobility." },
    { id: "p-1-2-2", chapterId: "1-ch-2", order: 2, original: "Et civitati persuasit ut de finibus suis cum omnibus copiis exirent: perfacile esse, cum virtute omnibus praestarent, totius Galliae imperio potiri.", translation: "He persuaded the community to leave their territory with all their forces: since they excelled all in valor, it would be very easy to gain dominion over all of Gaul." },
    { id: "p-1-2-3", chapterId: "1-ch-2", order: 3, original: "Id hoc facilius iis persuasit, quod undique loci natura Helvetii continentur: una ex parte flumine Rheno latissimo atque altissimo, qui agrum Helvetium a Germanis dividit.", translation: "He the more easily persuaded them of this, because the Helvetii are confined on every side by the nature of their territory: on one side by the Rhine, a very broad and deep river, which separates the Helvetian territory from the Germans." },
    { id: "p-1-2-4", chapterId: "1-ch-2", order: 4, original: "Altera ex parte monte Iura altissimo, qui est inter Sequanos et Helvetios; tertia lacu Lemanno et flumine Rhodano, qui provinciam nostram ab Helvetiis dividit.", translation: "On a second side by the Jura mountains, which are very high and lie between the Sequani and the Helvetii; on the third side by Lake Geneva and by the river Rhone, which separates our Province from the Helvetii." },
  ],
  "1-ch-3": [
    { id: "p-1-3-1", chapterId: "1-ch-3", order: 1, original: "His rebus fiebat ut et minus late vagarentur et minus facile finitimis bellum inferre possent; qua ex parte homines bellandi cupidi magno dolore afficiebantur.", translation: "From these circumstances it resulted that they could range less widely and could less easily make war upon their neighbors; for which reason men who were desirous of war were greatly distressed." },
    { id: "p-1-3-2", chapterId: "1-ch-3", order: 2, original: "Pro multitudine autem hominum et pro gloria belli atque fortitudinis angustos se fines habere arbitrabantur, qui in longitudinem milia passuum CCXL, in latitudinem CLXXX patebant.", translation: "Moreover, in proportion to their population and their renown for warfare and bravery, they considered that their territory was narrow, since it extended 240 miles in length and 180 in breadth." },
    { id: "p-1-3-3", chapterId: "1-ch-3", order: 3, original: "His rebus adducti et auctoritate Orgetorigis permoti constituerunt ea quae ad proficiscendum pertinerent comparare, iumentorum et carrorum quam maximum numerum coemere.", translation: "Led by these considerations and influenced by the authority of Orgetorix, they determined to prepare everything necessary for their departure: to buy up as great a number of beasts of burden and carts as possible." },
    { id: "p-1-3-4", chapterId: "1-ch-3", order: 4, original: "Sementes quam maximas facere, ut in itinere copia frumenti suppeteret, cum proximis civitatibus pacem et amicitiam confirmare.", translation: "To make their sowings as large as possible so that an abundance of grain might be on hand during the march, and to establish peace and friendship with the neighboring communities." },
  ],

  // ── Cicero, In Catilinam I.1-I.3 ──────────────────────────────────────
  "2-ch-1": [
    { id: "p-2-1-1", chapterId: "2-ch-1", order: 1, original: "Quo usque tandem abutere, Catilina, patientia nostra? Quam diu etiam furor iste tuus nos eludet? Quem ad finem sese effrenata iactabit audacia?", translation: "How long, O Catiline, will you abuse our patience? How long will that madness of yours mock us? To what limit will your unbridled audacity hurl itself?" },
    { id: "p-2-1-2", chapterId: "2-ch-1", order: 2, original: "Nihilne te nocturnum praesidium Palati, nihil urbis vigiliae, nihil timor populi, nihil concursus bonorum omnium, nihil hic munitissimus habendi senatus locus, nihil horum ora voltusque moverunt?", translation: "Does not the night guard on the Palatine, do not the watches posted throughout the city, does not the alarm of the people, the gathering of all loyal citizens, this strongly fortified place for holding the Senate, do not the faces and expressions of these senators move you?" },
    { id: "p-2-1-3", chapterId: "2-ch-1", order: 3, original: "Patere tua consilia non sentis, constrictam iam horum omnium scientia teneri coniurationem tuam non vides? Quid proxima, quid superiore nocte egeris, ubi fueris, quos convocaveris, quid consilii ceperis, quem nostrum ignorare arbitraris?", translation: "Do you not feel that your plans are detected? Do you not see that your conspiracy is already arrested and held in check by the knowledge of all these men? What you did last night, what the night before, where you were, whom you summoned, what plan you adopted -- which of us do you think does not know?" },
    { id: "p-2-1-4", chapterId: "2-ch-1", order: 4, original: "O tempora, o mores! Senatus haec intellegit. Consul videt; hic tamen vivit. Vivit? Immo vero etiam in senatum venit, fit publici consilii particeps, notat et designat oculis ad caedem unum quemque nostrum.", translation: "O the times, O the customs! The Senate understands these things; the consul sees them; yet this man still lives. Lives? Indeed, he even comes into the Senate, takes part in public deliberation, and marks and designates with his eyes each one of us for slaughter." },
  ],
  "2-ch-2": [
    { id: "p-2-2-1", chapterId: "2-ch-2", order: 1, original: "Nos autem fortes viri satis facere rei publicae videmur, si istius furorem ac tela vitemus. Ad mortem te, Catilina, duci iussu consulis iam pridem oportebat, in te conferri pestem, quam tu in nos machinaris.", translation: "We, brave men that we are, think we are doing enough for the Republic if we merely keep out of the way of his frenzied attacks. You ought, O Catiline, long ago to have been led to death by the consul's command; that destruction which you have been long plotting against us ought to have been brought upon you." },
    { id: "p-2-2-2", chapterId: "2-ch-2", order: 2, original: "An vero vir amplissimus, P. Scipio, pontifex maximus, Ti. Gracchum mediocriter labefactantem statum rei publicae privatus interfecit; Catilinam orbem terrae caede atque incendiis vastare cupientem nos consules perferemus?", translation: "Did not that most eminent man, Publius Scipio, the Pontifex Maximus, as a private citizen put to death Tiberius Gracchus, though he was only slightly undermining the state? Shall we consuls tolerate Catiline, who desires to devastate the whole world with slaughter and fire?" },
    { id: "p-2-2-3", chapterId: "2-ch-2", order: 3, original: "Nam illa nimis antiqua praetereo, quod C. Servilius Ahala Sp. Maelium novis rebus studentem manu sua occidit. Fuit, fuit ista quondam in hac re publica virtus, ut viri fortes acrioribus suppliciis civem perniciosum quam acerbissimum hostem coercerent.", translation: "For I pass over those precedents too ancient to mention, how Gaius Servilius Ahala slew with his own hand Spurius Maelius who was plotting revolution. There was, there was once such virtue in this Republic, that brave men would repress a dangerous citizen with severer punishment than the bitterest enemy." },
  ],
  "2-ch-3": [
    { id: "p-2-3-1", chapterId: "2-ch-3", order: 1, original: "Castra sunt in Italia contra populum Romanum in Etruriae faucibus conlocata, crescit in dies singulos hostium numerus; eorum autem castrorum imperatorem ducemque hostium intra moenia atque adeo in senatu videtis intestinam aliquam cotidie perniciem rei publicae molientem.", translation: "A camp has been pitched in Italy against the Roman people in the passes of Etruria, the number of the enemy increases daily; but the commander of those camps and the leader of the enemy you see within the walls, and even in the Senate, devising some internal ruin for the Republic every day." },
    { id: "p-2-3-2", chapterId: "2-ch-3", order: 2, original: "Si te iam, Catilina, comprehendi, si interfici iussero, credo, erit verendum mihi, ne non potius hoc omnes boni serius a me quam quisquam crudelius factum esse dicat.", translation: "If I should now order you to be arrested, Catiline, or to be put to death, I should have to fear, I suppose, not that all good men would say I had acted too late, but that someone might say I had acted too cruelly." },
    { id: "p-2-3-3", chapterId: "2-ch-3", order: 3, original: "Verum ego hoc quod iam pridem factum esse oportuit certa de causa nondum adducor ut faciam. Tum denique interficiere, cum iam nemo tam improbus, tam perditus, tam tui similis inveniri poterit, qui id non iure factum esse fateatur.", translation: "But for a definite reason I am not yet induced to do what ought to have been done long ago. You shall be put to death only when there can be found no one so wicked, so abandoned, so like yourself, who will not admit that it was justly done." },
  ],

  // ── Xenophon, Anabasis I.1-I.3 ────────────────────────────────────────
  "6-ch-1": [
    { id: "p-6-1-1", chapterId: "6-ch-1", order: 1, original: "Δαρείου καὶ Παρυσάτιδος γίγνονται παῖδες δύο, πρεσβύτερος μὲν Ἀρταξέρξης, νεώτερος δὲ Κῦρος.", translation: "Darius and Parysatis had two sons, the elder Artaxerxes, the younger Cyrus." },
    { id: "p-6-1-2", chapterId: "6-ch-1", order: 2, original: "Ἐπεὶ δὲ ἠσθένει Δαρεῖος καὶ ὑπώπτευε τελευτὴν τοῦ βίου, ἐβούλετο τὼ παῖδε ἀμφοτέρω παρεῖναι.", translation: "When Darius fell sick and suspected that the end of his life was near, he wished to have both his sons with him." },
    { id: "p-6-1-3", chapterId: "6-ch-1", order: 3, original: "Ὁ μὲν οὖν πρεσβύτερος παρὼν ἐτύγχανε· Κῦρον δὲ μεταπέμπεται ἀπὸ τῆς ἀρχῆς ἧς αὐτὸν σατράπην ἐποίησε.", translation: "Now the elder happened to be present; but Cyrus he summoned from the province over which he had made him satrap." },
    { id: "p-6-1-4", chapterId: "6-ch-1", order: 4, original: "Ἀναβαίνει οὖν ὁ Κῦρος λαβὼν Τισσαφέρνην ὡς φίλον, καὶ τῶν Ἑλλήνων δὲ ἔχων ὁπλίτας ἀνέβη τριακοσίους, ἄρχοντα δὲ αὐτῶν Ξενίαν Παρράσιον.", translation: "So Cyrus went up, taking Tissaphernes with him as a friend, and accompanied also by three hundred Greek hoplites, under the command of Xenias of Parrhasia." },
  ],
  "6-ch-2": [
    { id: "p-6-2-1", chapterId: "6-ch-2", order: 1, original: "Ἐπεὶ δὲ ἐτελεύτησε Δαρεῖος καὶ κατέστη εἰς τὴν βασιλείαν Ἀρταξέρξης, Τισσαφέρνης διαβάλλει τὸν Κῦρον πρὸς τὸν ἀδελφὸν ὡς ἐπιβουλεύοι αὐτῷ.", translation: "When Darius died and Artaxerxes was established in the kingdom, Tissaphernes slandered Cyrus to his brother, saying that he was plotting against him." },
    { id: "p-6-2-2", chapterId: "6-ch-2", order: 2, original: "Ὁ δὲ πείθεται καὶ συλλαμβάνει Κῦρον ὡς ἀποκτενῶν· ἡ δὲ μήτηρ ἐξαιτησαμένη αὐτὸν ἀποπέμπει πάλιν ἐπὶ τὴν ἀρχήν.", translation: "And Artaxerxes believed him and arrested Cyrus, intending to put him to death; but their mother interceded for Cyrus and sent him back to his province." },
    { id: "p-6-2-3", chapterId: "6-ch-2", order: 3, original: "Ὁ δ᾽ ὡς ἀπῆλθε κινδυνεύσας καὶ ἀτιμασθείς, βουλεύεται ὅπως μήποτε ἔτι ἔσται ἐπὶ τῷ ἀδελφῷ, ἀλλά, ἢν δύνηται, βασιλεύσει ἀντ᾽ ἐκείνου.", translation: "But Cyrus, when he had departed, having been in danger and been dishonored, planned how he might never again be in his brother's power, but, if he could, might reign in his stead." },
    { id: "p-6-2-4", chapterId: "6-ch-2", order: 4, original: "Παρύσατις μὲν δὴ ἡ μήτηρ ὑπῆρχε τῷ Κύρῳ, φιλοῦσα αὐτὸν μᾶλλον ἢ τὸν βασιλεύοντα Ἀρταξέρξην.", translation: "Now his mother Parysatis supported Cyrus, for she loved him more than the reigning Artaxerxes." },
  ],
  "6-ch-3": [
    { id: "p-6-3-1", chapterId: "6-ch-3", order: 1, original: "Ὅστις δ᾽ ἀφικνεῖτο τῶν παρὰ βασιλέως πρὸς αὐτόν, πάντας οὕτω διατιθεὶς ἀπεπέμπετο ὥστε αὐτῷ μᾶλλον φίλους εἶναι ἢ βασιλεῖ.", translation: "And whoever came to him from the King, he treated them all in such a way before sending them back that they were more friendly to him than to the King." },
    { id: "p-6-3-2", chapterId: "6-ch-3", order: 2, original: "Καὶ τῶν παρ᾽ ἑαυτῷ δὲ βαρβάρων ἐπεμελεῖτο ὡς πολεμεῖν τε ἱκανοὶ εἶεν καὶ εὐνοϊκῶς ἔχοιεν αὐτῷ.", translation: "He also took care of the barbarians in his service, so that they should be able to fight and be well-disposed toward him." },
    { id: "p-6-3-3", chapterId: "6-ch-3", order: 3, original: "Τὴν δὲ Ἑλληνικὴν δύναμιν ἥθροιζεν ὡς μάλιστα ἐδύνατο ἐπικρυπτόμενος, ὅπως ὅτι ἀπαρασκευότατον λάβοι βασιλέα.", translation: "His Greek force he was gathering as secretly as he could, in order that he might catch the King as unprepared as possible." },
    { id: "p-6-3-4", chapterId: "6-ch-3", order: 4, original: "Ὧδε οὖν ἐποιεῖτο τὴν συλλογήν· ὁπόσας εἶχε φυλακὰς ἐν ταῖς πόλεσι, παρήγγειλε τοῖς φρουράρχοις ἑκάστοις λαμβάνειν ἄνδρας Πελοποννησίους ὅτι πλείστους καὶ βελτίστους.", translation: "He arranged the gathering of forces thus: he ordered each of his garrison commanders in the cities to recruit as many and as fine Peloponnesian soldiers as possible." },
  ],

  // ── Virgil — Aeneid I (sample paragraphs) ─────────────────────────────
  "3-ch-1": [
    { id: "p-3-1-1", chapterId: "3-ch-1", order: 1, original: "Arma virumque cano, Troiae qui primus ab oris Italiam, fato profugus, Laviniaque venit litora.", translation: "I sing of arms and the man, who first from the shores of Troy, exiled by fate, came to Italy and the Lavinian shores." },
    { id: "p-3-1-2", chapterId: "3-ch-1", order: 2, original: "Multum ille et terris iactatus et alto vi superum saevae memorem Iunonis ob iram.", translation: "Much buffeted on land and sea by the power of the gods above, on account of fierce Juno's unforgetting anger." },
    { id: "p-3-1-3", chapterId: "3-ch-1", order: 3, original: "Multa quoque et bello passus, dum conderet urbem, inferretque deos Latio, genus unde Latinum.", translation: "Having suffered much also in war, until he could found a city and bring his gods to Latium, whence the Latin race." },
  ],

  // ── Ovid — Metamorphoses I (sample) ────────────────────────────────────
  "4-ch-1": [
    { id: "p-4-1-1", chapterId: "4-ch-1", order: 1, original: "In nova fert animus mutatas dicere formas corpora; di, coeptis (nam vos mutastis et illas) adspirate meis primaque ab origine mundi ad mea perpetuum deducite tempora carmen.", translation: "My mind is bent to tell of forms changed into new bodies; O gods, since you have also changed these, inspire my undertakings, and from the first origin of the world lead down my unbroken song to my own times." },
    { id: "p-4-1-2", chapterId: "4-ch-1", order: 2, original: "Ante mare et terras et quod tegit omnia caelum unus erat toto naturae vultus in orbe, quem dixere chaos: rudis indigestaque moles.", translation: "Before the sea and lands and the sky that covers all, nature had one face throughout the whole world, which they called Chaos: a rough, unordered mass." },
    { id: "p-4-1-3", chapterId: "4-ch-1", order: 3, original: "Nec quicquam nisi pondus iners congestaque eodem non bene iunctarum discordia semina rerum.", translation: "Nor was it anything but a lifeless bulk, and heaped together in the same place the discordant seeds of things ill-joined." },
  ],

  // ── Livy — Ab Urbe Condita I (sample) ──────────────────────────────────
  "5-ch-1": [
    { id: "p-5-1-1", chapterId: "5-ch-1", order: 1, original: "Iam primum omnium satis constat Troia capta in ceteros saevitum esse Troianos; duobus, Aeneae Antenorique, et vetusti iure hospitii et quia pacis reddendaeque Helenae semper auctores fuerant, omne ius belli Achivos abstinuisse.", translation: "First of all it is generally agreed that when Troy was taken, cruelty was shown to all the other Trojans; but toward two, Aeneas and Antenor, the Achaeans abstained from all the rights of war, both on account of an old tie of hospitality and because they had always been advocates of peace and the restoration of Helen." },
    { id: "p-5-1-2", chapterId: "5-ch-1", order: 2, original: "Casibus deinde variis Antenorem cum multitudine Enetum, qui seditione ex Paphlagonia pulsi et sedes et ducem rege Pylaemene ad Troiam amisso quaerebant, venisse in intimum maris Hadriatici sinum.", translation: "Then by various adventures Antenor came with a multitude of the Eneti, who had been driven from Paphlagonia by revolution and were seeking a settlement and a leader, having lost their king Pylaemenes at Troy, to the innermost bay of the Adriatic Sea." },
    { id: "p-5-1-3", chapterId: "5-ch-1", order: 3, original: "Aeneam ab simili clade domo profugum sed ad maiora rerum initia ducentibus fatis, primo in Macedoniam venisse, inde in Siciliam quaerentem sedes delatum.", translation: "Aeneas, driven from home by a similar disaster, but led by fate to greater beginnings, first came to Macedonia, then was carried to Sicily in search of a settlement." },
  ],

  // ── Plato — Apology (sample) ───────────────────────────────────────────
  "7-ch-1": [
    { id: "p-7-1-1", chapterId: "7-ch-1", order: 1, original: "Ὅτι μὲν ὑμεῖς, ὦ ἄνδρες Ἀθηναῖοι, πεπόνθατε ὑπὸ τῶν ἐμῶν κατηγόρων, οὐκ οἶδα· ἐγὼ δ᾽ οὖν καὶ αὐτὸς ὑπ᾽ αὐτῶν ὀλίγου ἐμαυτοῦ ἐπελαθόμην, οὕτω πιθανῶς ἔλεγον.", translation: "How you, men of Athens, have been affected by my accusers, I do not know; but I, for my part, almost forgot my own identity, so persuasively did they speak." },
    { id: "p-7-1-2", chapterId: "7-ch-1", order: 2, original: "Καίτοι ἀληθές γε ὡς ἔπος εἰπεῖν οὐδὲν εἰρήκασιν. Μάλιστα δὲ αὐτῶν ἓν ἐθαύμασα τῶν πολλῶν ὧν ἐψεύσαντο.", translation: "And yet they have said, so to speak, nothing true. But of their many falsehoods, one especially astonished me." },
    { id: "p-7-1-3", chapterId: "7-ch-1", order: 3, original: "Τοῦτο ἐν ᾧ ἔλεγον ὡς χρῆν ὑμᾶς εὐλαβεῖσθαι μὴ ὑπ᾽ ἐμοῦ ἐξαπατηθῆτε ὡς δεινοῦ ὄντος λέγειν.", translation: "This was when they told you to be careful not to be deceived by me, as I was a clever speaker." },
  ],

  // ── Homer — Iliad I (sample) ───────────────────────────────────────────
  "8-ch-1": [
    { id: "p-8-1-1", chapterId: "8-ch-1", order: 1, original: "Μῆνιν ἄειδε, θεά, Πηληϊάδεω Ἀχιλῆος οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε.", translation: "Sing, O goddess, the anger of Achilles son of Peleus, that brought countless ills upon the Achaeans." },
    { id: "p-8-1-2", chapterId: "8-ch-1", order: 2, original: "Πολλὰς δ᾽ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν ἡρώων, αὐτοὺς δὲ ἑλώρια τεῦχε κύνεσσιν οἰωνοῖσί τε πᾶσι.", translation: "Many a brave soul did it send hurrying down to Hades, and many a hero did it yield a prey to dogs and vultures." },
    { id: "p-8-1-3", chapterId: "8-ch-1", order: 3, original: "Διὸς δ᾽ ἐτελείετο βουλή, ἐξ οὗ δὴ τὰ πρῶτα διαστήτην ἐρίσαντε Ἀτρεΐδης τε ἄναξ ἀνδρῶν καὶ δῖος Ἀχιλλεύς.", translation: "For so the will of Zeus was being fulfilled, from the time when first there stood in division of conflict Atreus' son, lord of men, and brilliant Achilles." },
  ],

  // ── Aristotle — Nicomachean Ethics I (sample) ──────────────────────────
  "9-ch-1": [
    { id: "p-9-1-1", chapterId: "9-ch-1", order: 1, original: "Πᾶσα τέχνη καὶ πᾶσα μέθοδος, ὁμοίως δὲ πρᾶξίς τε καὶ προαίρεσις, ἀγαθοῦ τινὸς ἐφίεσθαι δοκεῖ· διὸ καλῶς ἀπεφήναντο τἀγαθόν, οὗ πάντ᾽ ἐφίεται.", translation: "Every art and every inquiry, and similarly every action and pursuit, is thought to aim at some good; and for this reason the good has rightly been declared to be that at which all things aim." },
    { id: "p-9-1-2", chapterId: "9-ch-1", order: 2, original: "Διαφορὰ δέ τις φαίνεται τῶν τελῶν· τὰ μὲν γάρ εἰσιν ἐνέργειαι, τὰ δὲ παρ᾽ αὐτὰς ἔργα τινά.", translation: "But a certain difference is found among ends; some are activities, others are products apart from the activities that produce them." },
    { id: "p-9-1-3", chapterId: "9-ch-1", order: 3, original: "Ὅπου δ᾽ εἰσὶ τέλη τινὰ παρὰ τὰς πράξεις, ἐν τούτοις βελτίω πέφυκε τῶν ἐνεργειῶν τὰ ἔργα.", translation: "Where there are ends apart from the actions, it is the nature of the products to be better than the activities." },
  ],

  // ── Gospel of Matthew (Peshitta, sample) ───────────────────────────────
  "10-ch-1": [
    { id: "p-10-1-1", chapterId: "10-ch-1", order: 1, original: "\u071F\u072C\u0712\u0710 \u0715\u071D\u0720\u071D\u0715\u072C\u0710 \u0715\u071D\u072B\u0718\u0725 \u0721\u072B\u071D\u071A\u0710 \u0712\u072A\u0717 \u0715\u0715\u0718\u071D\u0715 \u0712\u072A\u0717 \u0715\u0710\u0712\u072A\u0717\u0721", translation: "The book of the genealogy of Jesus the Messiah, the son of David, the son of Abraham." },
    { id: "p-10-1-2", chapterId: "10-ch-1", order: 2, original: "\u0710\u0712\u072A\u0717\u0721 \u0710\u0718\u0720\u0715 \u0720\u0710\u071D\u0723\u071A\u0719 \u0710\u071D\u0723\u071A\u0719 \u0715\u071D\u0719 \u0710\u0718\u0720\u0715 \u0720\u071D\u0725\u0729\u0718\u0712", translation: "Abraham was the father of Isaac, and Isaac the father of Jacob." },
    { id: "p-10-1-3", chapterId: "10-ch-1", order: 3, original: "\u071D\u0725\u0729\u0718\u0712 \u0715\u071D\u0719 \u0710\u0718\u0720\u0715 \u0720\u071D\u0717\u0718\u0715\u0710 \u0718\u0720\u0710\u071A\u0718\u072C\u0717", translation: "And Jacob was the father of Judah and his brothers." },
  ],

  // ── Selected Surahs (sample) ───────────────────────────────────────────
  "11-ch-1": [
    { id: "p-11-1-1", chapterId: "11-ch-1", order: 1, original: "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u064A\u0645\u0650", translation: "In the name of God, the Most Gracious, the Most Merciful." },
    { id: "p-11-1-2", chapterId: "11-ch-1", order: 2, original: "\u0627\u0644\u0652\u062D\u064E\u0645\u0652\u062F\u064F \u0644\u0650\u0644\u0651\u0647\u0650 \u0631\u064E\u0628\u0651\u0650 \u0627\u0644\u0652\u0639\u064E\u0627\u0644\u064E\u0645\u064A\u0646\u064E", translation: "All praise is due to God, Lord of all the worlds." },
    { id: "p-11-1-3", chapterId: "11-ch-1", order: 3, original: "\u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u064A\u0645\u0650 \u0645\u064E\u0627\u0644\u0650\u0643\u0650 \u064A\u064E\u0648\u0652\u0645\u0650 \u0627\u0644\u062F\u0651\u064A\u0646\u0650", translation: "The Most Gracious, the Most Merciful. Master of the Day of Judgment." },
  ],

  // ── Mu'allaqat (sample) ────────────────────────────────────────────────
  "12-ch-1": [
    { id: "p-12-1-1", chapterId: "12-ch-1", order: 1, original: "\u0642\u0650\u0641\u064E\u0627 \u0646\u064E\u0628\u0652\u0643\u0650 \u0645\u0650\u0646\u0652 \u0630\u0650\u0643\u0652\u0631\u064E\u0649 \u062D\u064E\u0628\u064A\u0628\u064D \u0648\u064E\u0645\u064E\u0646\u0652\u0632\u0650\u0644\u0650", translation: "Stop, let us weep at the memory of a beloved and her dwelling." },
    { id: "p-12-1-2", chapterId: "12-ch-1", order: 2, original: "\u0628\u0650\u0633\u0650\u0642\u0652\u0637\u0650 \u0627\u0644\u0644\u0651\u0650\u0648\u064E\u0649 \u0628\u064E\u064A\u0652\u0646\u064E \u0627\u0644\u062F\u0651\u064E\u062E\u0648\u0644\u0650 \u0641\u064E\u062D\u064E\u0648\u0652\u0645\u064E\u0644\u0650", translation: "At the winding of the sands between Dakhul and Hawmal." },
    { id: "p-12-1-3", chapterId: "12-ch-1", order: 3, original: "\u0641\u064E\u062A\u0648\u0636\u0650\u062D\u064E \u0641\u064E\u0627\u0644\u0652\u0645\u0650\u0642\u0652\u0631\u064E\u0627\u062A\u0650 \u0644\u064E\u0645\u0652 \u064A\u064E\u0639\u0652\u0641\u064F \u0631\u064E\u0633\u0652\u0645\u064F\u0647\u064E\u0627", translation: "The traces have not been effaced by the south wind and the north." },
  ],

  // ── Shakespeare — Hamlet Act I, Scene 1 ─────────────────────────────────
  "13-ch-1": [
    { id: "p-13-1-1", chapterId: "13-ch-1", order: 1, original: "Who's there? Nay, answer me: stand, and unfold yourself. Long live the king! Bernardo? He.", translation: "The opening exchange between the sentinels Francisco and Bernardo on the battlements of Elsinore castle, establishing the tense, fearful atmosphere of the watch at midnight." },
    { id: "p-13-1-2", chapterId: "13-ch-1", order: 2, original: "In the most high and palmy state of Rome, A little ere the mightiest Julius fell, The graves stood tenantless and the sheeted dead Did squeak and gibber in the Roman streets.", translation: "Horatio recounts the supernatural omens that preceded the fall of Julius Caesar, drawing a parallel to the ghostly apparition they have witnessed on the battlements." },
    { id: "p-13-1-3", chapterId: "13-ch-1", order: 3, original: "But, look, the morn, in russet mantle clad, Walks o'er the dew of yon high eastward hill: Break we our watch up.", translation: "As dawn arrives, Horatio notes the morning light and suggests they end their watch and inform Prince Hamlet about the ghost of his father." },
  ],

  // ── Hugo — Les Mis\u00e9rables (excerpt) ──────────────────────────────────────
  "16-ch-1": [
    { id: "p-16-1-1", chapterId: "16-ch-1", order: 1, original: "En 1815, M. Charles-Fran\u00e7ois-Bienvenu Myriel \u00e9tait \u00e9v\u00eaque de Digne. C'\u00e9tait un vieillard d'environ soixante-quinze ans; il occupait le si\u00e8ge de Digne depuis 1806.", translation: "In 1815, Monsieur Charles-Fran\u00e7ois-Bienvenu Myriel was Bishop of Digne. He was an old man of about seventy-five years; he had occupied the see of Digne since 1806." },
    { id: "p-16-1-2", chapterId: "16-ch-1", order: 2, original: "M. Myriel \u00e9tait arriv\u00e9 \u00e0 Digne accompagn\u00e9 d'une vieille fille, mademoiselle Baptistine, qui \u00e9tait sa s\u0153ur et qui avait dix ans de moins que lui.", translation: "Monsieur Myriel had arrived at Digne accompanied by an elderly spinster, Mademoiselle Baptistine, who was his sister and ten years younger than he." },
    { id: "p-16-1-3", chapterId: "16-ch-1", order: 3, original: "Il n'avait pour tout domestique qu'une servante du m\u00eame \u00e2ge que mademoiselle Baptistine, et appel\u00e9e madame Magloire, laquelle, apr\u00e8s avoir \u00e9t\u00e9 la servante de M. le cur\u00e9, prenait maintenant le double titre de femme de chambre de mademoiselle et femme de charge de monseigneur.", translation: "His only domestic was a servant of the same age as Mademoiselle Baptistine, called Madame Magloire, who after having been the servant of the curate now assumed the double title of personal maid to Mademoiselle and housekeeper to Monseigneur." },
  ],

  // ── Dante — Inferno Canto I ─────────────────────────────────────────────
  "19-ch-1": [
    { id: "p-19-1-1", chapterId: "19-ch-1", order: 1, original: "Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura, ch\u00e9 la diritta via era smarrita.", translation: "Midway upon the journey of our life I found myself within a forest dark, for the straightforward path had been lost." },
    { id: "p-19-1-2", chapterId: "19-ch-1", order: 2, original: "Ahi quanto a dir qual era \u00e8 cosa dura esta selva selvaggia e aspra e forte che nel pensier rinova la paura!", translation: "Ah me! how hard a thing it is to say what was this forest savage, rough, and stern, which in the very thought renews the fear!" },
    { id: "p-19-1-3", chapterId: "19-ch-1", order: 3, original: "Tant'\u00e8 amara che poco \u00e8 pi\u00f9 morte; ma per trattar del ben ch'i' vi trovai, dir\u00f2 de l'altre cose ch'i' v'ho scorte.", translation: "So bitter is it, death is hardly more; but to treat of the good I there found, I will speak of the other things I saw there." },
  ],

  // ── Goethe — Faust Part I, Night ────────────────────────────────────────
  "21-ch-1": [
    { id: "p-21-1-1", chapterId: "21-ch-1", order: 1, original: "Habe nun, ach! Philosophie, Juristerei und Medizin, und leider auch Theologie durchaus studiert, mit hei\u00dfem Bem\u00fchn.", translation: "I have, alas! studied philosophy, jurisprudence, and medicine, and unfortunately also theology, with ardent effort through and through." },
    { id: "p-21-1-2", chapterId: "21-ch-1", order: 2, original: "Da steh ich nun, ich armer Tor! Und bin so klug als wie zuvor; hei\u00dfe Magister, hei\u00dfe Doktor gar.", translation: "Here now I stand, poor fool! and am as wise as I was before; I am called Master, even called Doctor." },
    { id: "p-21-1-3", chapterId: "21-ch-1", order: 3, original: "Und ziehe schon an die zehen Jahr herauf, herab und quer und krumm meine Sch\u00fcler an der Nase herum \u2014 und sehe, dass wir nichts wissen k\u00f6nnen!", translation: "And for these ten years have been leading my students by the nose, up and down and back and forth \u2014 and I see that we can know nothing!" },
  ],

  // ── Cervantes — Don Quijote Ch 1 ────────────────────────────────────────
  "22-ch-1": [
    { id: "p-22-1-1", chapterId: "22-ch-1", order: 1, original: "En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que viv\u00eda un hidalgo de los de lanza en astillero, adarga antigua, roc\u00edn flaco y galgo corredor.", translation: "In a village of La Mancha, the name of which I have no desire to recall, there lived not long ago one of those gentlemen that keep a lance in the lance-rack, an old buckler, a lean hack, and a greyhound for coursing." },
    { id: "p-22-1-2", chapterId: "22-ch-1", order: 2, original: "Frisaba la edad de nuestro hidalgo con los cincuenta a\u00f1os. Era de complexi\u00f3n recia, seco de carnes, enjuto de rostro, gran madrugador y amigo de la caza.", translation: "The age of our gentleman bordered on fifty years. He was of a hardy constitution, spare of flesh, lean of face, a great early riser, and a friend of the chase." },
    { id: "p-22-1-3", chapterId: "22-ch-1", order: 3, original: "Es, pues, de saber que este sobredicho hidalgo, los ratos que estaba ocioso \u2014 que eran los m\u00e1s del a\u00f1o \u2014, se daba a leer libros de caballer\u00edas, con tanta afici\u00f3n y gusto, que olvid\u00f3 casi de todo punto el ejercicio de la caza, y aun la administraci\u00f3n de su hacienda.", translation: "You must know, then, that the above-named gentleman, in his leisure moments \u2014 which were mostly the year round \u2014 gave himself up to reading books of chivalry with such ardor and avidity that he almost entirely neglected the pursuit of the chase, and even the management of his property." },
  ],

  // ── Tolstoy — Anna Karenina Part I, Ch 1 ────────────────────────────────
  "23-ch-1": [
    { id: "p-23-1-1", chapterId: "23-ch-1", order: 1, original: "\u0412\u0441\u0435 \u0441\u0447\u0430\u0441\u0442\u043b\u0438\u0432\u044b\u0435 \u0441\u0435\u043c\u044c\u0438 \u043f\u043e\u0445\u043e\u0436\u0438 \u0434\u0440\u0443\u0433 \u043d\u0430 \u0434\u0440\u0443\u0433\u0430, \u043a\u0430\u0436\u0434\u0430\u044f \u043d\u0435\u0441\u0447\u0430\u0441\u0442\u043b\u0438\u0432\u0430\u044f \u0441\u0435\u043c\u044c\u044f \u043d\u0435\u0441\u0447\u0430\u0441\u0442\u043b\u0438\u0432\u0430 \u043f\u043e-\u0441\u0432\u043e\u0435\u043c\u0443.", translation: "Happy families are all alike; every unhappy family is unhappy in its own way." },
    { id: "p-23-1-2", chapterId: "23-ch-1", order: 2, original: "\u0412\u0441\u0451 \u0441\u043c\u0435\u0448\u0430\u043b\u043e\u0441\u044c \u0432 \u0434\u043e\u043c\u0435 \u041e\u0431\u043b\u043e\u043d\u0441\u043a\u0438\u0445. \u0416\u0435\u043d\u0430 \u0443\u0437\u043d\u0430\u043b\u0430, \u0447\u0442\u043e \u043c\u0443\u0436 \u0431\u044b\u043b \u0432 \u0441\u0432\u044f\u0437\u0438 \u0441 \u0431\u044b\u0432\u0448\u0435\u044e \u0432 \u0438\u0445 \u0434\u043e\u043c\u0435 \u0444\u0440\u0430\u043d\u0446\u0443\u0436\u0435\u043d\u043a\u043e\u044e-\u0433\u0443\u0432\u0435\u0440\u043d\u0430\u043d\u0442\u043a\u043e\u044e.", translation: "Everything was in confusion in the Oblonsky household. The wife had discovered that the husband was carrying on an intrigue with the French governess who had formerly been in their household." },
    { id: "p-23-1-3", chapterId: "23-ch-1", order: 3, original: "\u0416\u0435\u043d\u0430 \u043d\u0435 \u0432\u044b\u0445\u043e\u0434\u0438\u043b\u0430 \u0438\u0437 \u0441\u0432\u043e\u0438\u0445 \u043a\u043e\u043c\u043d\u0430\u0442, \u043c\u0443\u0436\u0430 \u0442\u0440\u0435\u0442\u0438\u0439 \u0434\u0435\u043d\u044c \u043d\u0435 \u0431\u044b\u043b\u043e \u0434\u043e\u043c\u0430. \u0414\u0435\u0442\u0438 \u0431\u0435\u0433\u0430\u043b\u0438 \u043f\u043e \u0432\u0441\u0435\u043c\u0443 \u0434\u043e\u043c\u0443, \u043a\u0430\u043a \u043f\u043e\u0442\u0435\u0440\u044f\u043d\u043d\u044b\u0435.", translation: "The wife did not leave her own rooms; the husband had not been home for three days. The children ran all over the house as though they were lost." },
  ],
};

// ---------------------------------------------------------------------------
// MOCK_VOCAB  (30+ words)
// ---------------------------------------------------------------------------

export const MOCK_VOCAB: VocabWord[] = [
  // ── Latin (Caesar) ─────────────────────────────────────────────────────
  { id: "v1",  word: "bellum",      translation: "war",              language: "LATIN",   partOfSpeech: "noun",      context: "De Bello Gallico — the war against the Gauls",                              mastery: "MASTERED",  book: "De Bello Gallico",  timesReviewed: 12, timesCorrect: 11, nextReviewAt: "2026-03-25T00:00:00Z" },
  { id: "v2",  word: "divisa",      translation: "divided",          language: "LATIN",   partOfSpeech: "participle", context: "Gallia est omnis divisa in partes tres.",                                    mastery: "MASTERED",  book: "De Bello Gallico",  timesReviewed: 10, timesCorrect: 9,  nextReviewAt: "2026-03-27T00:00:00Z" },
  { id: "v3",  word: "flumen",      translation: "river",            language: "LATIN",   partOfSpeech: "noun",      context: "Gallos ab Aquitanis Garumna flumen dividit.",                                mastery: "LEARNING",  book: "De Bello Gallico",  timesReviewed: 6,  timesCorrect: 4,  nextReviewAt: "2026-03-21T00:00:00Z" },
  { id: "v4",  word: "fortissimi",  translation: "bravest",          language: "LATIN",   partOfSpeech: "adjective", context: "Horum omnium fortissimi sunt Belgae.",                                       mastery: "LEARNING",  book: "De Bello Gallico",  timesReviewed: 5,  timesCorrect: 3,  nextReviewAt: "2026-03-21T00:00:00Z" },
  { id: "v5",  word: "cupiditate",  translation: "desire, greed",    language: "LATIN",   partOfSpeech: "noun",      context: "Regni cupiditate inductus coniurationem fecit.",                             mastery: "NEW",       book: "De Bello Gallico",  timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v6",  word: "imperium",    translation: "command, empire",   language: "LATIN",   partOfSpeech: "noun",      context: "Totius Galliae imperio potiri.",                                             mastery: "LEARNING",  book: "De Bello Gallico",  timesReviewed: 4,  timesCorrect: 3,  nextReviewAt: "2026-03-22T00:00:00Z" },
  // ── Latin (Cicero) ─────────────────────────────────────────────────────
  { id: "v7",  word: "patientia",   translation: "patience",         language: "LATIN",   partOfSpeech: "noun",      context: "Quo usque tandem abutere, Catilina, patientia nostra?",                      mastery: "MASTERED",  book: "In Catilinam I",    timesReviewed: 14, timesCorrect: 14, nextReviewAt: "2026-04-01T00:00:00Z" },
  { id: "v8",  word: "furor",       translation: "madness, frenzy",  language: "LATIN",   partOfSpeech: "noun",      context: "Quam diu etiam furor iste tuus nos eludet?",                                 mastery: "LEARNING",  book: "In Catilinam I",    timesReviewed: 7,  timesCorrect: 5,  nextReviewAt: "2026-03-22T00:00:00Z" },
  { id: "v9",  word: "audacia",     translation: "audacity, daring", language: "LATIN",   partOfSpeech: "noun",      context: "Quem ad finem sese effrenata iactabit audacia?",                             mastery: "LEARNING",  book: "In Catilinam I",    timesReviewed: 5,  timesCorrect: 3,  nextReviewAt: "2026-03-21T00:00:00Z" },
  { id: "v10", word: "senatus",     translation: "senate",           language: "LATIN",   partOfSpeech: "noun",      context: "Senatus haec intellegit. Consul videt.",                                     mastery: "MASTERED",  book: "In Catilinam I",    timesReviewed: 9,  timesCorrect: 9,  nextReviewAt: "2026-03-28T00:00:00Z" },
  { id: "v11", word: "interficere", translation: "to kill, destroy", language: "LATIN",   partOfSpeech: "verb",      context: "Ad mortem te duci iussero.",                                                 mastery: "NEW",       book: "In Catilinam I",    timesReviewed: 1,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v12", word: "coniuratio",  translation: "conspiracy",       language: "LATIN",   partOfSpeech: "noun",      context: "Constrictam iam horum omnium scientia teneri coniurationem tuam.",            mastery: "NEW",       book: "In Catilinam I",    timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  // ── Greek (Xenophon) ───────────────────────────────────────────────────
  { id: "v13", word: "βασιλεύς",    translation: "king",             language: "GREEK",   partOfSpeech: "noun",      context: "Κατέστη εἰς τὴν βασιλείαν Ἀρταξέρξης.",                                     mastery: "MASTERED",  book: "Anabasis Book I",   timesReviewed: 11, timesCorrect: 10, nextReviewAt: "2026-03-26T00:00:00Z" },
  { id: "v14", word: "στρατιώτης",  translation: "soldier",          language: "GREEK",   partOfSpeech: "noun",      context: "Ἑλληνικὴν δύναμιν ἥθροιζεν.",                                                mastery: "LEARNING",  book: "Anabasis Book I",   timesReviewed: 6,  timesCorrect: 4,  nextReviewAt: "2026-03-22T00:00:00Z" },
  { id: "v15", word: "ἀδελφός",     translation: "brother",          language: "GREEK",   partOfSpeech: "noun",      context: "Τισσαφέρνης διαβάλλει τὸν Κῦρον πρὸς τὸν ἀδελφόν.",                         mastery: "LEARNING",  book: "Anabasis Book I",   timesReviewed: 5,  timesCorrect: 3,  nextReviewAt: "2026-03-21T00:00:00Z" },
  { id: "v16", word: "πόλεμος",     translation: "war",              language: "GREEK",   partOfSpeech: "noun",      context: "Πολεμεῖν τε ἱκανοὶ εἶεν.",                                                  mastery: "MASTERED",  book: "Anabasis Book I",   timesReviewed: 10, timesCorrect: 9,  nextReviewAt: "2026-03-28T00:00:00Z" },
  { id: "v17", word: "δύναμις",     translation: "power, force",     language: "GREEK",   partOfSpeech: "noun",      context: "Τὴν Ἑλληνικὴν δύναμιν ἥθροιζεν.",                                           mastery: "NEW",       book: "Anabasis Book I",   timesReviewed: 1,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  // ── Greek (Plato) ──────────────────────────────────────────────────────
  { id: "v18", word: "ἀλήθεια",     translation: "truth",            language: "GREEK",   partOfSpeech: "noun",      context: "Ἀληθές γε ὡς ἔπος εἰπεῖν οὐδὲν εἰρήκασιν.",                                mastery: "LEARNING",  book: "Apology",           timesReviewed: 4,  timesCorrect: 2,  nextReviewAt: "2026-03-21T00:00:00Z" },
  { id: "v19", word: "σοφία",       translation: "wisdom",           language: "GREEK",   partOfSpeech: "noun",      context: "Socrates and the pursuit of wisdom.",                                        mastery: "LEARNING",  book: "Apology",           timesReviewed: 3,  timesCorrect: 2,  nextReviewAt: "2026-03-21T00:00:00Z" },
  { id: "v20", word: "ψυχή",        translation: "soul, life",       language: "GREEK",   partOfSpeech: "noun",      context: "Πολλὰς δ᾽ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν.",                                  mastery: "NEW",       book: "Iliad Book I",      timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v21", word: "ἀγαθόν",      translation: "good",             language: "GREEK",   partOfSpeech: "adjective", context: "Καλῶς ἀπεφήναντο τἀγαθόν, οὗ πάντ᾽ ἐφίεται.",                              mastery: "NEW",       book: "Nicomachean Ethics I", timesReviewed: 0, timesCorrect: 0, nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v22", word: "κατήγορος",   translation: "accuser",          language: "GREEK",   partOfSpeech: "noun",      context: "Πεπόνθατε ὑπὸ τῶν ἐμῶν κατηγόρων.",                                        mastery: "NEW",       book: "Apology",           timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  // ── Aramaic ────────────────────────────────────────────────────────────
  { id: "v23", word: "\u071F\u072C\u0712\u0710",   translation: "book, writing",  language: "ARAMAIC", partOfSpeech: "noun",      context: "The book of the genealogy.",                                              mastery: "NEW",       book: "Gospel of Matthew 1-7", timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v24", word: "\u0721\u072B\u071D\u071A\u0710", translation: "messiah, anointed one", language: "ARAMAIC", partOfSpeech: "noun", context: "Jesus the Messiah, son of David.", mastery: "NEW", book: "Gospel of Matthew 1-7", timesReviewed: 0, timesCorrect: 0, nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v25", word: "\u0712\u072A\u0710",         translation: "son",            language: "ARAMAIC", partOfSpeech: "noun",      context: "Son of David, son of Abraham.",                                           mastery: "LEARNING",  book: "Gospel of Matthew 1-7", timesReviewed: 2,  timesCorrect: 1,  nextReviewAt: "2026-03-21T00:00:00Z" },
  { id: "v26", word: "\u0710\u0712\u0710",         translation: "father",         language: "ARAMAIC", partOfSpeech: "noun",      context: "Abraham was the father of Isaac.",                                        mastery: "NEW",       book: "Gospel of Matthew 1-7", timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  // ── Arabic ─────────────────────────────────────────────────────────────
  { id: "v27", word: "\u0628\u0650\u0633\u0652\u0645\u0650", translation: "in the name of", language: "ARABIC", partOfSpeech: "preposition", context: "In the name of God, the Most Gracious.", mastery: "LEARNING", book: "Selected Surahs", timesReviewed: 3, timesCorrect: 2, nextReviewAt: "2026-03-21T00:00:00Z" },
  { id: "v28", word: "\u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0646", translation: "the Most Gracious", language: "ARABIC", partOfSpeech: "adjective", context: "In the name of God, the Most Gracious, the Most Merciful.", mastery: "NEW", book: "Selected Surahs", timesReviewed: 0, timesCorrect: 0, nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v29", word: "\u0627\u0644\u0652\u062D\u064E\u0645\u0652\u062F\u064F", translation: "praise",         language: "ARABIC",  partOfSpeech: "noun",      context: "All praise is due to God.",                                               mastery: "NEW",       book: "Selected Surahs",       timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v30", word: "\u062D\u064E\u0628\u064A\u0628",       translation: "beloved",         language: "ARABIC",  partOfSpeech: "noun",      context: "Stop, let us weep at the memory of a beloved.",                           mastery: "NEW",       book: "Mu'allaqat Selections", timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  // ── Old English (Shakespeare) ─────────────────────────────────────────────
  { id: "v31", word: "battlements",  translation: "fortified walls with openings", language: "OLD_ENGLISH", partOfSpeech: "noun",      context: "Upon the platform where we watched.",                                     mastery: "NEW",       book: "Hamlet Act I",          timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v32", word: "apparition",   translation: "ghostly figure",              language: "OLD_ENGLISH", partOfSpeech: "noun",      context: "This dreaded sight twice seen of us.",                                    mastery: "NEW",       book: "Hamlet Act I",          timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v33", word: "usurp",        translation: "to seize without right",      language: "OLD_ENGLISH", partOfSpeech: "verb",      context: "What art thou that usurp'st this time of night?",                         mastery: "NEW",       book: "Hamlet Act I",          timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  // ── French (Hugo) ───────────────────────────────────────────────────────────
  { id: "v34", word: "\u00e9v\u00eaque",       translation: "bishop",                   language: "FRENCH",     partOfSpeech: "noun",      context: "M. Myriel \u00e9tait \u00e9v\u00eaque de Digne.",                                           mastery: "NEW",       book: "Les Mis\u00e9rables (excerpt)", timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v35", word: "vieillard",    translation: "old man",                    language: "FRENCH",     partOfSpeech: "noun",      context: "C'\u00e9tait un vieillard d'environ soixante-quinze ans.",                      mastery: "NEW",       book: "Les Mis\u00e9rables (excerpt)", timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v36", word: "domestique",   translation: "servant",                    language: "FRENCH",     partOfSpeech: "noun",      context: "Il n'avait pour tout domestique qu'une servante.",                         mastery: "NEW",       book: "Les Mis\u00e9rables (excerpt)", timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v37", word: "mis\u00e9rable",    translation: "wretched, miserable",        language: "FRENCH",     partOfSpeech: "adjective", context: "Un mis\u00e9rable qui a vol\u00e9.",                                                    mastery: "NEW",       book: "Les Mis\u00e9rables (excerpt)", timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  // ── Italian (Dante) ──────────────────────────────────────────────────────────
  { id: "v38", word: "selva",         translation: "forest, wood",              language: "ITALIAN",    partOfSpeech: "noun",      context: "Mi ritrovai per una selva oscura.",                                        mastery: "NEW",       book: "Inferno Cantos I\u2013V",      timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v39", word: "paura",         translation: "fear",                      language: "ITALIAN",    partOfSpeech: "noun",      context: "Che nel pensier rinova la paura.",                                         mastery: "NEW",       book: "Inferno Cantos I\u2013V",      timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v40", word: "cammin",        translation: "journey, path",             language: "ITALIAN",    partOfSpeech: "noun",      context: "Nel mezzo del cammin di nostra vita.",                                     mastery: "NEW",       book: "Inferno Cantos I\u2013V",      timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  // ── German (Goethe) ──────────────────────────────────────────────────────────
  { id: "v41", word: "Philosophie",    translation: "philosophy",               language: "GERMAN",     partOfSpeech: "noun",      context: "Habe nun, ach! Philosophie ... durchaus studiert.",                        mastery: "NEW",       book: "Faust Part I Scene 1",  timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v42", word: "Tor",           translation: "fool",                     language: "GERMAN",     partOfSpeech: "noun",      context: "Da steh ich nun, ich armer Tor!",                                         mastery: "NEW",       book: "Faust Part I Scene 1",  timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v43", word: "Sch\u00fcler",       translation: "student, pupil",           language: "GERMAN",     partOfSpeech: "noun",      context: "Meine Sch\u00fcler an der Nase herum.",                                         mastery: "NEW",       book: "Faust Part I Scene 1",  timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  // ── Spanish (Cervantes) ──────────────────────────────────────────────────────
  { id: "v44", word: "hidalgo",        translation: "nobleman, gentleman",      language: "SPANISH",    partOfSpeech: "noun",      context: "Viv\u00eda un hidalgo de los de lanza en astillero.",                            mastery: "NEW",       book: "Don Quijote Ch 1\u20138",     timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v45", word: "caballer\u00eda",    translation: "chivalry, knighthood",     language: "SPANISH",    partOfSpeech: "noun",      context: "Se daba a leer libros de caballer\u00edas.",                                     mastery: "NEW",       book: "Don Quijote Ch 1\u20138",     timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v46", word: "roc\u00edn",         translation: "hack, workhorse",          language: "SPANISH",    partOfSpeech: "noun",      context: "Adarga antigua, roc\u00edn flaco y galgo corredor.",                              mastery: "NEW",       book: "Don Quijote Ch 1\u20138",     timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  // ── Russian (Tolstoy) ────────────────────────────────────────────────────────
  { id: "v47", word: "\u0441\u0447\u0430\u0441\u0442\u043b\u0438\u0432\u044b\u0439",   translation: "happy",                    language: "RUSSIAN",    partOfSpeech: "adjective", context: "\u0412\u0441\u0435 \u0441\u0447\u0430\u0441\u0442\u043b\u0438\u0432\u044b\u0435 \u0441\u0435\u043c\u044c\u0438 \u043f\u043e\u0445\u043e\u0436\u0438 \u0434\u0440\u0443\u0433 \u043d\u0430 \u0434\u0440\u0443\u0433\u0430.",                                mastery: "NEW",       book: "Anna Karenina Part I",  timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v48", word: "\u0441\u0435\u043c\u044c\u044f",          translation: "family",                   language: "RUSSIAN",    partOfSpeech: "noun",      context: "\u041a\u0430\u0436\u0434\u0430\u044f \u043d\u0435\u0441\u0447\u0430\u0441\u0442\u043b\u0438\u0432\u0430\u044f \u0441\u0435\u043c\u044c\u044f \u043d\u0435\u0441\u0447\u0430\u0441\u0442\u043b\u0438\u0432\u0430 \u043f\u043e-\u0441\u0432\u043e\u0435\u043c\u0443.",                           mastery: "NEW",       book: "Anna Karenina Part I",  timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v49", word: "\u0434\u043e\u043c",              translation: "house, home",              language: "RUSSIAN",    partOfSpeech: "noun",      context: "\u0412\u0441\u0451 \u0441\u043c\u0435\u0448\u0430\u043b\u043e\u0441\u044c \u0432 \u0434\u043e\u043c\u0435 \u041e\u0431\u043b\u043e\u043d\u0441\u043a\u0438\u0445.",                                          mastery: "NEW",       book: "Anna Karenina Part I",  timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v50", word: "\u0436\u0435\u043d\u0430",            translation: "wife",                     language: "RUSSIAN",    partOfSpeech: "noun",      context: "\u0416\u0435\u043d\u0430 \u0443\u0437\u043d\u0430\u043b\u0430, \u0447\u0442\u043e \u043c\u0443\u0436 \u0431\u044b\u043b \u0432 \u0441\u0432\u044f\u0437\u0438.",                                             mastery: "NEW",       book: "Anna Karenina Part I",  timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  // ── Sanskrit ─────────────────────────────────────────────────────────────
  { id: "v51", word: "dharma",       translation: "duty, righteousness",    language: "SANSKRIT",   partOfSpeech: "noun",      context: "Arjuna's conflict over dharma on the battlefield.",                        mastery: "NEW",       book: "Bhagavad Gita Chapters 1\u20134",  timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v52", word: "yoga",         translation: "union, discipline",      language: "SANSKRIT",   partOfSpeech: "noun",      context: "The yoga of action and the yoga of knowledge.",                            mastery: "NEW",       book: "Bhagavad Gita Chapters 1\u20134",  timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v53", word: "karma",        translation: "action, deed",           language: "SANSKRIT",   partOfSpeech: "noun",      context: "Karma yoga: the path of selfless action.",                                 mastery: "NEW",       book: "Bhagavad Gita Chapters 1\u20134",  timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v54", word: "atman",        translation: "self, soul",             language: "SANSKRIT",   partOfSpeech: "noun",      context: "The atman is eternal and indestructible.",                                  mastery: "NEW",       book: "Bhagavad Gita Chapters 1\u20134",  timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v55", word: "agni",         translation: "fire",                   language: "SANSKRIT",   partOfSpeech: "noun",      context: "Agni, the god of fire, invoked in the Rigveda.",                           mastery: "NEW",       book: "Rigveda Selected Hymns",           timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  // ── Hindi ────────────────────────────────────────────────────────────────
  { id: "v56", word: "\u0917\u093E\u092F",           translation: "cow",                     language: "HINDI",      partOfSpeech: "noun",      context: "Hori's lifelong dream of owning a cow.",                                   mastery: "NEW",       book: "Godan (excerpt)",                  timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v57", word: "\u0915\u093F\u0938\u093E\u0928",         translation: "farmer",                   language: "HINDI",      partOfSpeech: "noun",      context: "The life of a poor farmer in rural India.",                                mastery: "NEW",       book: "Godan (excerpt)",                  timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v58", word: "\u0927\u0930\u094D\u092E",          translation: "religion, duty",           language: "HINDI",      partOfSpeech: "noun",      context: "The concept of dharma in Ramcharitmanas.",                                 mastery: "NEW",       book: "Ramcharitmanas (excerpt)",          timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v59", word: "\u092A\u094D\u0930\u0947\u092E",          translation: "love",                     language: "HINDI",      partOfSpeech: "noun",      context: "Premchand's exploration of love and sacrifice.",                           mastery: "NEW",       book: "Godan (excerpt)",                  timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  // ── Tibetan ──────────────────────────────────────────────────────────────
  { id: "v60", word: "\u0F66\u0F9F\u0F7C\u0F44\u0F0B\u0F54\u0F0B\u0F49\u0F72\u0F51", translation: "emptiness",              language: "TIBETAN",    partOfSpeech: "noun",      context: "Form is emptiness, emptiness is form.",                                   mastery: "NEW",       book: "Heart Sutra",                      timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v61", word: "\u0F66\u0F44\u0F66\u0F0B\u0F62\u0F92\u0FB1\u0F66",       translation: "Buddha",                   language: "TIBETAN",    partOfSpeech: "noun",      context: "The Buddha's teaching on the perfection of wisdom.",                      mastery: "NEW",       book: "Heart Sutra",                      timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v62", word: "\u0F56\u0F51\u0F44\u0F0B\u0F54\u0F7C",       translation: "truth",                    language: "TIBETAN",    partOfSpeech: "noun",      context: "The four noble truths of Buddhist teaching.",                              mastery: "NEW",       book: "Heart Sutra",                      timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v63", word: "\u0F62\u0F72\u0F0B\u0F58\u0F7C",           translation: "mountain",                 language: "TIBETAN",    partOfSpeech: "noun",      context: "Milarepa's meditation in mountain caves.",                                 mastery: "NEW",       book: "Selected Songs of Milarepa",       timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  // ── Scots Gaelic ─────────────────────────────────────────────────────────
  { id: "v64", word: "braw",          translation: "fine, good",             language: "SCOTS_GAELIC", partOfSpeech: "adjective", context: "A braw bricht moonlicht nicht the nicht.",                                mastery: "NEW",       book: "Selected Poems",                   timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v65", word: "wee",           translation: "small, little",          language: "SCOTS_GAELIC", partOfSpeech: "adjective", context: "Wee, sleekit, cowrin, tim'rous beastie.",                                 mastery: "NEW",       book: "Selected Poems",                   timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v66", word: "ken",           translation: "to know",                language: "SCOTS_GAELIC", partOfSpeech: "verb",      context: "Ye ken what I mean, laddie.",                                             mastery: "NEW",       book: "Selected Poems",                   timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v67", word: "auld",          translation: "old",                    language: "SCOTS_GAELIC", partOfSpeech: "adjective", context: "Should auld acquaintance be forgot.",                                     mastery: "NEW",       book: "Selected Poems",                   timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v68", word: "loch",          translation: "lake",                   language: "SCOTS_GAELIC", partOfSpeech: "noun",      context: "The bonnie banks of the loch.",                                           mastery: "NEW",       book: "Selected Poems",                   timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  // ── Hebrew ───────────────────────────────────────────────────────────────
  { id: "v69", word: "\u05D1\u05E8\u05D0\u05E9\u05D9\u05EA",       translation: "in the beginning",        language: "HEBREW",     partOfSpeech: "noun",      context: "In the beginning God created the heavens and the earth.",                 mastery: "NEW",       book: "Genesis Chapters 1\u201311",          timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v70", word: "\u05E9\u05C1\u05B8\u05DE\u05B7\u05D9\u05B4\u05DD",       translation: "heavens, sky",            language: "HEBREW",     partOfSpeech: "noun",      context: "The heavens declare the glory of God.",                                   mastery: "NEW",       book: "Psalms (Selected)",                timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v71", word: "\u05D4\u05B6\u05D1\u05B6\u05DC",          translation: "vanity, futility",         language: "HEBREW",     partOfSpeech: "noun",      context: "Vanity of vanities, all is vanity.",                                      mastery: "NEW",       book: "Ecclesiastes",                     timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v72", word: "\u05EA\u05D5\u05B9\u05E8\u05B8\u05D4",         translation: "Torah, law, teaching",     language: "HEBREW",     partOfSpeech: "noun",      context: "The Torah of the Lord is perfect.",                                       mastery: "NEW",       book: "Psalms (Selected)",                timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
  { id: "v73", word: "\u05E2\u05B5\u05EA",           translation: "time, season",             language: "HEBREW",     partOfSpeech: "noun",      context: "To everything there is a season, and a time to every purpose.",           mastery: "NEW",       book: "Ecclesiastes",                     timesReviewed: 0,  timesCorrect: 0,  nextReviewAt: "2026-03-20T00:00:00Z" },
];

// ---------------------------------------------------------------------------
// MOCK_QUIZ_QUESTIONS
// ---------------------------------------------------------------------------

export const MOCK_QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  // Caesar — De Bello Gallico
  "1": [
    { id: "q-1-1", type: "multiple-choice", question: "Into how many parts does Caesar say Gaul is divided?", options: ["Two", "Three", "Four", "Five"], correctAnswer: "Three", explanation: "The famous opening line states 'Gallia est omnis divisa in partes tres' — All Gaul is divided into three parts.", bookId: "1" },
    { id: "q-1-2", type: "multiple-choice", question: "Which people does Caesar describe as the bravest of the Gauls?", options: ["The Aquitani", "The Helvetii", "The Belgae", "The Celts"], correctAnswer: "The Belgae", explanation: "Caesar writes 'Horum omnium fortissimi sunt Belgae' — Of all these, the Belgae are the bravest.", bookId: "1" },
    { id: "q-1-3", type: "fill-blank", question: "Complete: 'Gallia est omnis divisa in partes ___'", correctAnswer: "tres", explanation: "'Tres' means 'three' in Latin. This is the most famous opening line in Latin prose.", bookId: "1" },
    { id: "q-1-4", type: "multiple-choice", question: "Which river separates the Gauls from the Aquitani?", options: ["Rhine", "Rhone", "Garonne", "Seine"], correctAnswer: "Garonne", explanation: "Caesar states 'Gallos ab Aquitanis Garumna flumen dividit' — the Garonne (Garumna) separates them.", bookId: "1" },
    { id: "q-1-5", type: "multiple-choice", question: "Who was the wealthy Helvetian nobleman who planned the migration?", options: ["Divico", "Orgetorix", "Ariovistus", "Vercingetorix"], correctAnswer: "Orgetorix", explanation: "Caesar introduces Orgetorix as 'longe nobilissimus fuit et ditissimus' — by far the most noble and wealthy.", bookId: "1" },
  ],
  // Cicero — In Catilinam I
  "2": [
    { id: "q-2-1", type: "fill-blank", question: "Complete Cicero's opening: 'Quo usque tandem abutere, Catilina, ___ nostra?'", correctAnswer: "patientia", explanation: "'Patientia' means 'patience'. Cicero asks how long Catiline will abuse the Senate's patience.", bookId: "2" },
    { id: "q-2-2", type: "multiple-choice", question: "What Latin word does Cicero use to describe Catiline's madness?", options: ["audacia", "furor", "patientia", "bellum"], correctAnswer: "furor", explanation: "'Furor' means madness or frenzy. Cicero asks 'Quam diu etiam furor iste tuus nos eludet?'", bookId: "2" },
    { id: "q-2-3", type: "multiple-choice", question: "Where was the guard posted that Cicero mentions?", options: ["The Forum", "The Palatine", "The Campus Martius", "The Capitol"], correctAnswer: "The Palatine", explanation: "Cicero refers to 'nocturnum praesidium Palati' — the night guard on the Palatine Hill.", bookId: "2" },
    { id: "q-2-4", type: "multiple-choice", question: "What famous exclamation does Cicero make about Rome's morals?", options: ["O Roma!", "O patria!", "O tempora, o mores!", "O Catilina!"], correctAnswer: "O tempora, o mores!", explanation: "'O tempora, o mores!' — 'O the times, O the customs!' is one of Cicero's most quoted phrases.", bookId: "2" },
    { id: "q-2-5", type: "multiple-choice", question: "Where does Cicero say a hostile camp has been established?", options: ["In Gaul", "In Africa", "In the passes of Etruria", "In Greece"], correctAnswer: "In the passes of Etruria", explanation: "Cicero reveals 'Castra sunt in Italia contra populum Romanum in Etruriae faucibus conlocata.'", bookId: "2" },
  ],
  // Xenophon — Anabasis
  "6": [
    { id: "q-6-1", type: "multiple-choice", question: "Who were the two sons of Darius and Parysatis?", options: ["Cyrus and Xerxes", "Artaxerxes and Cyrus", "Cyrus and Tissaphernes", "Darius and Artaxerxes"], correctAnswer: "Artaxerxes and Cyrus", explanation: "The opening of the Anabasis identifies 'Ἀρταξέρξης' (Artaxerxes) as the elder and 'Κῦρος' (Cyrus) as the younger.", bookId: "6" },
    { id: "q-6-2", type: "multiple-choice", question: "Who slandered Cyrus to King Artaxerxes?", options: ["Xenias", "Parysatis", "Tissaphernes", "Clearchus"], correctAnswer: "Tissaphernes", explanation: "Xenophon writes that 'Τισσαφέρνης διαβάλλει τὸν Κῦρον' — Tissaphernes slandered Cyrus.", bookId: "6" },
    { id: "q-6-3", type: "fill-blank", question: "Complete: 'Δαρείου καὶ Παρυσάτιδος γίγνονται παῖδες ___'", correctAnswer: "δύο", explanation: "'Δύο' means 'two' in Greek. Darius and Parysatis had two sons.", bookId: "6" },
    { id: "q-6-4", type: "multiple-choice", question: "Who saved Cyrus from execution?", options: ["Tissaphernes", "Xenias", "His mother Parysatis", "The Greek mercenaries"], correctAnswer: "His mother Parysatis", explanation: "Xenophon says 'ἡ δὲ μήτηρ ἐξαιτησαμένη αὐτὸν ἀποπέμπει' — his mother interceded and sent him back.", bookId: "6" },
    { id: "q-6-5", type: "multiple-choice", question: "What kind of soldiers did Cyrus order his commanders to recruit?", options: ["Athenian hoplites", "Peloponnesian soldiers", "Spartan cavalry", "Cretan archers"], correctAnswer: "Peloponnesian soldiers", explanation: "Cyrus ordered 'λαμβάνειν ἄνδρας Πελοποννησίους ὅτι πλείστους καὶ βελτίστους' — as many Peloponnesian soldiers as possible.", bookId: "6" },
  ],
};

// ---------------------------------------------------------------------------
// MOCK_ACHIEVEMENTS
// ---------------------------------------------------------------------------

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: "ach-1",  type: "milestone",  title: "First Chapter",  description: "Complete your first chapter",               iconEmoji: "\u{1F4D6}", xpAwarded: 50,  earned: true },
  { id: "ach-2",  type: "milestone",  title: "First Book",     description: "Complete an entire book",                    iconEmoji: "\u{1F3C6}", xpAwarded: 200, earned: false },
  { id: "ach-3",  type: "vocabulary", title: "50 Words",       description: "Learn 50 vocabulary words",                  iconEmoji: "\u{1F4AC}", xpAwarded: 100, earned: true },
  { id: "ach-4",  type: "vocabulary", title: "100 Words",      description: "Learn 100 vocabulary words",                 iconEmoji: "\u{1F4DA}", xpAwarded: 150, earned: false },
  { id: "ach-5",  type: "vocabulary", title: "500 Words",      description: "Learn 500 vocabulary words",                 iconEmoji: "\u{1F9E0}", xpAwarded: 500, earned: false },
  { id: "ach-6",  type: "streak",     title: "7-Day Streak",   description: "Study for 7 consecutive days",               iconEmoji: "\u{1F525}", xpAwarded: 100, earned: true },
  { id: "ach-7",  type: "streak",     title: "30-Day Streak",  description: "Study for 30 consecutive days",              iconEmoji: "\u{2B50}",  xpAwarded: 300, earned: false },
  { id: "ach-8",  type: "language",   title: "Polyglot",       description: "Study texts in 2 or more languages",         iconEmoji: "\u{1F30D}", xpAwarded: 150, earned: true },
  { id: "ach-9",  type: "reading",    title: "Speed Reader",   description: "Complete a chapter in under 5 minutes",      iconEmoji: "\u{26A1}",  xpAwarded: 75,  earned: false },
  { id: "ach-10", type: "reading",    title: "Night Owl",      description: "Complete a reading session after midnight",   iconEmoji: "\u{1F989}", xpAwarded: 50,  earned: true },
  { id: "ach-11", type: "milestone",  title: "Completionist",  description: "Complete all chapters in a language track",  iconEmoji: "\u{1F451}", xpAwarded: 500, earned: false },
  { id: "ach-12", type: "milestone",  title: "Classicist",     description: "Complete at least one text in every language",iconEmoji: "\u{1F3DB}\uFE0F", xpAwarded: 1000, earned: false },
];

// ---------------------------------------------------------------------------
// MOCK_USER
// ---------------------------------------------------------------------------

export const MOCK_USER: MockUser = {
  id: "user1",
  name: "Marcus",
  email: "marcus@codex.app",
  preferredLanguages: ["LATIN", "GREEK"],
  dailyGoalChapters: 3,
  currentLevel: 3,
  totalXp: 1450,
  currentStreak: 12,
  longestStreak: 15,
  hearts: 4,
  coins: 320,
  streakFreezes: 1,
  memberSince: "2026-01-15",
};

// ---------------------------------------------------------------------------
// MOCK_LEADERBOARD
// ---------------------------------------------------------------------------

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: "lb-1", name: "Livia",     weeklyXp: 620, level: 5,  avatarSeed: 11 },
  { id: "lb-2", name: "Marcus",    weeklyXp: 540, level: 3,  avatarSeed: 42 },
  { id: "lb-3", name: "Helena",    weeklyXp: 480, level: 4,  avatarSeed: 77 },
  { id: "lb-4", name: "Gaius",     weeklyXp: 350, level: 2,  avatarSeed: 33 },
  { id: "lb-5", name: "Theodora",  weeklyXp: 290, level: 2,  avatarSeed: 58 },
];

// ---------------------------------------------------------------------------
// MOCK_READING_PROGRESS
// ---------------------------------------------------------------------------

export const MOCK_READING_PROGRESS: Record<string, ProgressData> = {
  "1": {
    bookId: "1",
    chaptersCompleted: 5,
    totalChapters: 8,
    percentComplete: 65,
    lastReadAt: "2026-03-19T22:30:00Z",
    currentChapterId: "1-ch-6",
  },
  "6": {
    bookId: "6",
    chaptersCompleted: 3,
    totalChapters: 10,
    percentComplete: 30,
    lastReadAt: "2026-03-18T20:15:00Z",
    currentChapterId: "6-ch-4",
  },
  "7": {
    bookId: "7",
    chaptersCompleted: 0,
    totalChapters: 8,
    percentComplete: 0,
    lastReadAt: "",
    currentChapterId: "7-ch-1",
  },
};

// ---------------------------------------------------------------------------
// MOCK_SYNOPSIS (kept for backward compat — now also in book.synopsis)
// ---------------------------------------------------------------------------

export const MOCK_SYNOPSIS: Record<string, string> = Object.fromEntries(
  MOCK_BOOKS.map((b) => [b.id, b.synopsis]),
);

// ---------------------------------------------------------------------------
// MOCK_PREVIEW_PARAGRAPHS (backward compat)
// ---------------------------------------------------------------------------

export const MOCK_PREVIEW_PARAGRAPHS: Record<string, { original: string; translation: string }[]> = {
  "1": [
    { original: "Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.", translation: "All Gaul is divided into three parts, one of which the Belgae inhabit, another the Aquitani, and the third those who in their own language are called Celts, in ours Gauls." },
    { original: "Hi omnes lingua, institutis, legibus inter se differunt.", translation: "All these differ from each other in language, customs, and laws." },
  ],
  "2": [
    { original: "Quo usque tandem abutere, Catilina, patientia nostra?", translation: "How long, O Catiline, will you abuse our patience?" },
    { original: "Quam diu etiam furor iste tuus nos eludet?", translation: "How long will that madness of yours mock us?" },
  ],
  "3": [
    { original: "Arma virumque cano, Troiae qui primus ab oris Italiam, fato profugus, Laviniaque venit litora.", translation: "I sing of arms and the man, who first from the shores of Troy, exiled by fate, came to Italy and the Lavinian shores." },
    { original: "Multum ille et terris iactatus et alto vi superum saevae memorem Iunonis ob iram.", translation: "Much buffeted on land and sea by the power of the gods above, on account of fierce Juno's unforgetting anger." },
  ],
  "13": [
    { original: "Who's there? Nay, answer me: stand, and unfold yourself.", translation: "The sentinels challenge each other on the cold battlements of Elsinore castle at the stroke of midnight." },
    { original: "In the most high and palmy state of Rome, A little ere the mightiest Julius fell, The graves stood tenantless and the sheeted dead Did squeak and gibber in the Roman streets.", translation: "Horatio recalls the supernatural omens before Julius Caesar's assassination, drawing a parallel to the ghost they have just seen." },
  ],
  "16": [
    { original: "En 1815, M. Charles-Fran\u00e7ois-Bienvenu Myriel \u00e9tait \u00e9v\u00eaque de Digne.", translation: "In 1815, Monsieur Charles-Fran\u00e7ois-Bienvenu Myriel was Bishop of Digne." },
    { original: "Il n'avait pour tout domestique qu'une servante du m\u00eame \u00e2ge que mademoiselle Baptistine.", translation: "His only domestic was a servant of the same age as Mademoiselle Baptistine." },
  ],
  "19": [
    { original: "Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura.", translation: "Midway upon the journey of our life I found myself within a forest dark." },
    { original: "Ahi quanto a dir qual era \u00e8 cosa dura esta selva selvaggia e aspra e forte.", translation: "Ah me! how hard a thing it is to say what was this forest savage, rough, and stern." },
  ],
  "21": [
    { original: "Habe nun, ach! Philosophie, Juristerei und Medizin, und leider auch Theologie durchaus studiert.", translation: "I have, alas! studied philosophy, jurisprudence, and medicine, and unfortunately also theology." },
    { original: "Da steh ich nun, ich armer Tor! Und bin so klug als wie zuvor.", translation: "Here now I stand, poor fool! and am as wise as I was before." },
  ],
  "22": [
    { original: "En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que viv\u00eda un hidalgo.", translation: "In a village of La Mancha, the name of which I have no desire to recall, there lived not long ago a gentleman." },
    { original: "Se daba a leer libros de caballer\u00edas, con tanta afici\u00f3n y gusto.", translation: "He gave himself up to reading books of chivalry with such ardor and avidity." },
  ],
  "23": [
    { original: "\u0412\u0441\u0435 \u0441\u0447\u0430\u0441\u0442\u043b\u0438\u0432\u044b\u0435 \u0441\u0435\u043c\u044c\u0438 \u043f\u043e\u0445\u043e\u0436\u0438 \u0434\u0440\u0443\u0433 \u043d\u0430 \u0434\u0440\u0443\u0433\u0430, \u043a\u0430\u0436\u0434\u0430\u044f \u043d\u0435\u0441\u0447\u0430\u0441\u0442\u043b\u0438\u0432\u0430\u044f \u0441\u0435\u043c\u044c\u044f \u043d\u0435\u0441\u0447\u0430\u0441\u0442\u043b\u0438\u0432\u0430 \u043f\u043e-\u0441\u0432\u043e\u0435\u043c\u0443.", translation: "Happy families are all alike; every unhappy family is unhappy in its own way." },
    { original: "\u0412\u0441\u0451 \u0441\u043c\u0435\u0448\u0430\u043b\u043e\u0441\u044c \u0432 \u0434\u043e\u043c\u0435 \u041e\u0431\u043b\u043e\u043d\u0441\u043a\u0438\u0445.", translation: "Everything was in confusion in the Oblonsky household." },
  ],
};

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

export function getBookById(id: string): MockBook | undefined {
  return MOCK_BOOKS.find((b) => b.id === id);
}

export function getChaptersByBookId(bookId: string): MockChapter[] {
  return MOCK_CHAPTERS[bookId] ?? [];
}

export function getParagraphsByChapterId(chapterId: string): Paragraph[] {
  return MOCK_PARAGRAPHS[chapterId] ?? [];
}

export function getVocabByLanguage(language: string): VocabWord[] {
  return MOCK_VOCAB.filter((v) => v.language === language);
}

export function getVocabByBook(bookTitle: string): VocabWord[] {
  return MOCK_VOCAB.filter((v) => v.book === bookTitle);
}

export function getQuizByBookId(bookId: string): QuizQuestion[] {
  return MOCK_QUIZ_QUESTIONS[bookId] ?? [];
}

export function getBooksByLanguage(language: Language): MockBook[] {
  return MOCK_BOOKS.filter((b) => b.language === language);
}

// ---------------------------------------------------------------------------
// Legacy compat helpers (used by existing pages)
// ---------------------------------------------------------------------------

export function getMockChapters(bookId: string): MockChapter[] {
  return getChaptersByBookId(bookId);
}

export function getBookProgress(bookId: string): { completed: number; total: number } {
  const progress = MOCK_READING_PROGRESS[bookId];
  if (progress) {
    return { completed: progress.chaptersCompleted, total: progress.totalChapters };
  }
  const book = getBookById(bookId);
  if (!book) return { completed: 0, total: 0 };
  return { completed: 0, total: book.chapterCount };
}

export function getNodeStatus(bookId: string): NodeStatus {
  const book = getBookById(bookId);
  if (!book) return "locked";
  if (book.isPremium) return "premium";

  const progress = MOCK_READING_PROGRESS[bookId];
  if (progress && progress.percentComplete === 100) return "completed";
  if (progress && progress.percentComplete > 0) return "current";
  if (!book.isLocked) return "current";
  return "locked";
}

export function getPreviewParagraphs(bookId: string) {
  return MOCK_PREVIEW_PARAGRAPHS[bookId] ?? [
    { original: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", translation: "Sample translation text. The original passage would appear here in the source language with its English translation side by side." },
    { original: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", translation: "A second sample passage demonstrates how the bilingual reading experience works, with each sentence carefully aligned." },
  ];
}
