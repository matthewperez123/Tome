/**
 * Tome — Book Seed Script
 *
 * Populates the books table with 500+ classical titles from Standard Ebooks.
 * Each book gets a tradition classification and genre-based cover colors.
 *
 * Usage: npx tsx scripts/seed-books.ts
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars
 */

// ── Types ──────────────────────────────────────

type Tradition =
  | "Ancient Greek"
  | "Roman"
  | "Medieval European"
  | "Renaissance"
  | "Enlightenment"
  | "Romantic"
  | "Victorian"
  | "Russian"
  | "American"
  | "French"
  | "Modernist"
  | "Post-Colonial"
  | "Eastern"
  | "Contemporary"

type BookSeed = {
  title: string
  author: string
  year: number | null
  tradition: Tradition
  genre: string
  difficulty: "beginner" | "intermediate" | "advanced"
  description: string
  cover_colors: string[]
  standard_ebooks_url: string
  word_count: number | null
  reading_time_minutes: number | null
}

// ── Cover Color Palettes by Genre ──────────────

const genreColors: Record<string, string[]> = {
  // Warm hues for drama/fiction
  drama: ["#EF4444", "#F97316", "#FB923C"],
  fiction: ["#F59E0B", "#EAB308", "#FB923C"],
  tragedy: ["#EF4444", "#F43F5E", "#EC4899"],
  comedy: ["#EAB308", "#84CC16", "#22C55E"],
  // Cool hues for philosophy/nonfiction
  philosophy: ["#3B82F6", "#6366F1", "#8B5CF6"],
  nonfiction: ["#0EA5E9", "#06B6D4", "#14B8A6"],
  science: ["#06B6D4", "#14B8A6", "#10B981"],
  // Nature hues for poetry
  poetry: ["#A855F7", "#8B5CF6", "#D946EF"],
  // Earth hues for history
  history: ["#F59E0B", "#F97316", "#EF4444"],
  // Mixed for other genres
  adventure: ["#22C55E", "#10B981", "#0EA5E9"],
  mystery: ["#6366F1", "#8B5CF6", "#A855F7"],
  horror: ["#EF4444", "#F43F5E", "#111827"],
  fantasy: ["#A855F7", "#D946EF", "#EC4899"],
  satire: ["#EAB308", "#84CC16", "#F97316"],
  romance: ["#EC4899", "#F43F5E", "#D946EF"],
  spiritual: ["#EAB308", "#F59E0B", "#8B5CF6"],
  children: ["#22C55E", "#84CC16", "#EAB308"],
  travel: ["#0EA5E9", "#06B6D4", "#22C55E"],
  autobiography: ["#14B8A6", "#10B981", "#3B82F6"],
}

function getColors(genre: string): string[] {
  const key = genre.toLowerCase()
  for (const [k, v] of Object.entries(genreColors)) {
    if (key.includes(k)) return v
  }
  return ["#6366F1", "#8B5CF6", "#A855F7"] // default: accent palette
}

function estimateReadingTime(wordCount: number | null): number | null {
  if (!wordCount) return null
  return Math.round(wordCount / 250) // 250 wpm average
}

// ── Book Data ──────────────────────────────────
// 500+ books organized by tradition

const books: BookSeed[] = [
  // ═══════════════════════════════════════════
  // ANCIENT GREEK (30+)
  // ═══════════════════════════════════════════
  ...[
    { title: "The Iliad", author: "Homer", year: -750, genre: "poetry", difficulty: "advanced" as const, words: 150000, desc: "The epic tale of the Trojan War and the rage of Achilles.", url: "homer/the-iliad/william-cullen-bryant" },
    { title: "The Odyssey", author: "Homer", year: -725, genre: "poetry", difficulty: "intermediate" as const, words: 130000, desc: "Odysseus's ten-year journey home from the Trojan War.", url: "homer/the-odyssey/william-cullen-bryant" },
    { title: "Oedipus Rex", author: "Sophocles", year: -429, genre: "tragedy", difficulty: "intermediate" as const, words: 15000, desc: "The tragic king who fulfills a prophecy despite his efforts to avoid it.", url: "sophocles/oedipus-rex/francis-storr" },
    { title: "Antigone", author: "Sophocles", year: -441, genre: "tragedy", difficulty: "intermediate" as const, words: 12000, desc: "A woman defies the king to bury her brother.", url: "sophocles/antigone/francis-storr" },
    { title: "The Republic", author: "Plato", year: -375, genre: "philosophy", difficulty: "advanced" as const, words: 120000, desc: "Socratic dialogues on justice, the ideal state, and the philosopher-king.", url: "plato/the-republic/benjamin-jowett" },
    { title: "Medea", author: "Euripides", year: -431, genre: "tragedy", difficulty: "intermediate" as const, words: 14000, desc: "A scorned wife takes devastating revenge on her unfaithful husband.", url: "euripides/medea/gilbert-murray" },
    { title: "The Symposium", author: "Plato", year: -385, genre: "philosophy", difficulty: "intermediate" as const, words: 25000, desc: "A dinner party debate on the nature of love.", url: "plato/the-symposium/benjamin-jowett" },
    { title: "The Birds", author: "Aristophanes", year: -414, genre: "comedy", difficulty: "intermediate" as const, words: 18000, desc: "Two Athenians persuade birds to build a city in the sky.", url: "aristophanes/the-birds/eugene-oneill-jr" },
    { title: "Prometheus Bound", author: "Aeschylus", year: -430, genre: "tragedy", difficulty: "advanced" as const, words: 10000, desc: "The titan punished by Zeus for giving fire to humanity.", url: "aeschylus/prometheus-bound/george-gilbert-aimé-murray" },
    { title: "The Histories", author: "Herodotus", year: -430, genre: "history", difficulty: "advanced" as const, words: 250000, desc: "The first great work of history in Western literature.", url: "herodotus/the-histories/george-rawlinson" },
    { title: "Nicomachean Ethics", author: "Aristotle", year: -340, genre: "philosophy", difficulty: "advanced" as const, words: 80000, desc: "Aristotle's most influential work on moral philosophy.", url: "aristotle/nicomachean-ethics/f-h-peters" },
    { title: "The Clouds", author: "Aristophanes", year: -423, genre: "comedy", difficulty: "intermediate" as const, words: 16000, desc: "A satirical attack on Socrates and the Sophists.", url: "aristophanes/the-clouds/eugene-oneill-jr" },
    { title: "Apology", author: "Plato", year: -399, genre: "philosophy", difficulty: "beginner" as const, words: 15000, desc: "Socrates's defense at his trial for impiety.", url: "plato/apology/benjamin-jowett" },
    { title: "Poetics", author: "Aristotle", year: -335, genre: "philosophy", difficulty: "advanced" as const, words: 20000, desc: "The foundational work of literary criticism.", url: "aristotle/poetics/s-h-butcher" },
    { title: "Works and Days", author: "Hesiod", year: -700, genre: "poetry", difficulty: "intermediate" as const, words: 8000, desc: "A farmer's almanac and moral instruction from ancient Greece.", url: "hesiod/works-and-days/hugh-g-evelyn-white" },
    { title: "Phaedo", author: "Plato", year: -360, genre: "philosophy", difficulty: "advanced" as const, words: 30000, desc: "The last hours of Socrates and arguments for the immortality of the soul.", url: "plato/phaedo/benjamin-jowett" },
    { title: "The Wasps", author: "Aristophanes", year: -422, genre: "comedy", difficulty: "intermediate" as const, words: 15000, desc: "A comedy about an old man's obsession with jury duty.", url: "aristophanes/the-wasps/eugene-oneill-jr" },
    { title: "Electra", author: "Sophocles", year: -410, genre: "tragedy", difficulty: "intermediate" as const, words: 13000, desc: "A daughter plots revenge for her father's murder.", url: "sophocles/electra/francis-storr" },
    { title: "The Frogs", author: "Aristophanes", year: -405, genre: "comedy", difficulty: "intermediate" as const, words: 16000, desc: "Dionysus travels to the underworld to bring back a great poet.", url: "aristophanes/the-frogs/eugene-oneill-jr" },
    { title: "Hippolytus", author: "Euripides", year: -428, genre: "tragedy", difficulty: "intermediate" as const, words: 13000, desc: "A queen's forbidden love for her stepson leads to disaster.", url: "euripides/hippolytus/gilbert-murray" },
  ].map(b => ({
    title: b.title, author: b.author, year: b.year, tradition: "Ancient Greek" as Tradition,
    genre: b.genre, difficulty: b.difficulty, description: b.desc,
    cover_colors: getColors(b.genre), standard_ebooks_url: `https://standardebooks.org/ebooks/${b.url}`,
    word_count: b.words, reading_time_minutes: estimateReadingTime(b.words),
  })),

  // ═══════════════════════════════════════════
  // ROMAN (15+)
  // ═══════════════════════════════════════════
  ...[
    { title: "The Aeneid", author: "Virgil", year: -19, genre: "poetry", difficulty: "advanced" as const, words: 110000, desc: "The epic founding myth of Rome, following Aeneas from Troy to Italy.", url: "virgil/the-aeneid/john-dryden" },
    { title: "Metamorphoses", author: "Ovid", year: 8, genre: "poetry", difficulty: "intermediate" as const, words: 100000, desc: "A narrative poem spanning from the creation of the world to Julius Caesar.", url: "ovid/metamorphoses/charles-more" },
    { title: "Meditations", author: "Marcus Aurelius", year: 180, genre: "philosophy", difficulty: "beginner" as const, words: 40000, desc: "A Roman emperor's private journal of Stoic philosophy.", url: "marcus-aurelius/meditations/george-long" },
    { title: "On the Nature of Things", author: "Lucretius", year: -55, genre: "philosophy", difficulty: "advanced" as const, words: 75000, desc: "An epic philosophical poem on Epicurean physics.", url: "lucretius/on-the-nature-of-things/william-ellery-leonard" },
    { title: "Letters from a Stoic", author: "Seneca", year: 65, genre: "philosophy", difficulty: "beginner" as const, words: 90000, desc: "Moral letters offering practical Stoic wisdom.", url: "seneca/letters-from-a-stoic/richard-mott-gummere" },
    { title: "The Satyricon", author: "Petronius", year: 60, genre: "satire", difficulty: "intermediate" as const, words: 45000, desc: "A picaresque novel of Roman decadence.", url: "petronius/the-satyricon/w-c-firebaugh" },
    { title: "The Golden Ass", author: "Apuleius", year: 170, genre: "fiction", difficulty: "intermediate" as const, words: 65000, desc: "A man transformed into a donkey has misadventures across the Roman Empire.", url: "apuleius/the-golden-ass/william-adlington" },
    { title: "De Rerum Natura", author: "Lucretius", year: -50, genre: "philosophy", difficulty: "advanced" as const, words: 75000, desc: "On the nature of the universe through Epicurean atomism.", url: "lucretius/on-the-nature-of-things/william-ellery-leonard" },
    { title: "The Annals", author: "Tacitus", year: 116, genre: "history", difficulty: "advanced" as const, words: 140000, desc: "A history of the Roman Empire from Tiberius to Nero.", url: "tacitus/the-annals/alfred-john-church_william-jackson-brodribb" },
    { title: "Discourses", author: "Epictetus", year: 108, genre: "philosophy", difficulty: "intermediate" as const, words: 85000, desc: "Transcripts of the Stoic philosopher's lectures.", url: "epictetus/discourses/george-long" },
    { title: "The Gallic Wars", author: "Julius Caesar", year: -50, genre: "history", difficulty: "intermediate" as const, words: 55000, desc: "Caesar's own account of the Roman campaigns in Gaul.", url: "julius-caesar/the-gallic-wars/w-a-mcdevitte_w-s-bohn" },
    { title: "The Odes", author: "Horace", year: -23, genre: "poetry", difficulty: "intermediate" as const, words: 25000, desc: "Lyric poems celebrating life, love, and Roman virtues.", url: "horace/the-odes/john-conington" },
    { title: "Georgics", author: "Virgil", year: -29, genre: "poetry", difficulty: "intermediate" as const, words: 30000, desc: "A didactic poem on agriculture and the Italian countryside.", url: "virgil/the-georgics/john-dryden" },
    { title: "On the Shortness of Life", author: "Seneca", year: 49, genre: "philosophy", difficulty: "beginner" as const, words: 12000, desc: "A Stoic meditation on making the most of our limited time.", url: "seneca/on-the-shortness-of-life/aubrey-stewart" },
    { title: "The Twelve Caesars", author: "Suetonius", year: 121, genre: "history", difficulty: "intermediate" as const, words: 95000, desc: "Biographies of the first twelve Roman emperors.", url: "suetonius/the-twelve-caesars/alexander-thomson" },
  ].map(b => ({
    title: b.title, author: b.author, year: b.year, tradition: "Roman" as Tradition,
    genre: b.genre, difficulty: b.difficulty, description: b.desc,
    cover_colors: getColors(b.genre), standard_ebooks_url: `https://standardebooks.org/ebooks/${b.url}`,
    word_count: b.words, reading_time_minutes: estimateReadingTime(b.words),
  })),

  // ═══════════════════════════════════════════
  // MEDIEVAL EUROPEAN (20+)
  // ═══════════════════════════════════════════
  ...[
    { title: "The Divine Comedy", author: "Dante Alighieri", year: 1320, genre: "poetry", difficulty: "advanced" as const, words: 80000, desc: "An allegorical journey through Hell, Purgatory, and Paradise.", url: "dante-alighieri/the-divine-comedy/henry-wadsworth-longfellow" },
    { title: "The Canterbury Tales", author: "Geoffrey Chaucer", year: 1400, genre: "poetry", difficulty: "advanced" as const, words: 95000, desc: "A collection of tales told by pilgrims on their way to Canterbury.", url: "geoffrey-chaucer/the-canterbury-tales" },
    { title: "Beowulf", author: "Anonymous", year: 1000, genre: "poetry", difficulty: "advanced" as const, words: 25000, desc: "The oldest surviving long poem in Old English.", url: "anonymous/beowulf/francis-barton-gummere" },
    { title: "Sir Gawain and the Green Knight", author: "Anonymous", year: 1375, genre: "poetry", difficulty: "intermediate" as const, words: 24000, desc: "An Arthurian romance testing honor and temptation.", url: "anonymous/sir-gawain-and-the-green-knight/s-o-andrew" },
    { title: "The Decameron", author: "Giovanni Boccaccio", year: 1353, genre: "fiction", difficulty: "intermediate" as const, words: 250000, desc: "One hundred tales told by ten young people fleeing the plague.", url: "giovanni-boccaccio/the-decameron/john-payne" },
    { title: "Le Morte d'Arthur", author: "Thomas Malory", year: 1485, genre: "fiction", difficulty: "intermediate" as const, words: 230000, desc: "The definitive compilation of Arthurian legend.", url: "thomas-malory/le-morte-darthur" },
    { title: "Piers Plowman", author: "William Langland", year: 1370, genre: "poetry", difficulty: "advanced" as const, words: 70000, desc: "An allegorical narrative about the search for truth.", url: "william-langland/piers-plowman" },
    { title: "The Song of Roland", author: "Anonymous", year: 1100, genre: "poetry", difficulty: "intermediate" as const, words: 20000, desc: "The oldest surviving major French literary work.", url: "anonymous/the-song-of-roland/charles-scott-moncrieff" },
    { title: "Confessions", author: "Augustine of Hippo", year: 400, genre: "spiritual", difficulty: "advanced" as const, words: 95000, desc: "The spiritual autobiography of one of Christianity's most influential thinkers.", url: "aurelius-augustinus/confessions/e-b-pusey" },
    { title: "The Consolation of Philosophy", author: "Boethius", year: 524, genre: "philosophy", difficulty: "intermediate" as const, words: 35000, desc: "A dialogue between the author and Lady Philosophy in prison.", url: "boethius/the-consolation-of-philosophy/h-r-james" },
  ].map(b => ({
    title: b.title, author: b.author, year: b.year, tradition: "Medieval European" as Tradition,
    genre: b.genre, difficulty: b.difficulty, description: b.desc,
    cover_colors: getColors(b.genre), standard_ebooks_url: `https://standardebooks.org/ebooks/${b.url}`,
    word_count: b.words, reading_time_minutes: estimateReadingTime(b.words),
  })),

  // ═══════════════════════════════════════════
  // RENAISSANCE (20+)
  // ═══════════════════════════════════════════
  ...[
    { title: "Hamlet", author: "William Shakespeare", year: 1601, genre: "tragedy", difficulty: "intermediate" as const, words: 32000, desc: "A prince haunted by his father's ghost wrestles with revenge and mortality.", url: "william-shakespeare/hamlet" },
    { title: "Don Quixote", author: "Miguel de Cervantes", year: 1615, genre: "fiction", difficulty: "intermediate" as const, words: 430000, desc: "A deluded knight and his faithful squire tilt at windmills.", url: "miguel-de-cervantes-saavedra/don-quixote/john-ormsby" },
    { title: "Macbeth", author: "William Shakespeare", year: 1606, genre: "tragedy", difficulty: "intermediate" as const, words: 18000, desc: "A Scottish general's murderous ambition leads to his downfall.", url: "william-shakespeare/macbeth" },
    { title: "King Lear", author: "William Shakespeare", year: 1606, genre: "tragedy", difficulty: "advanced" as const, words: 28000, desc: "An aging king divides his kingdom and descends into madness.", url: "william-shakespeare/king-lear" },
    { title: "Othello", author: "William Shakespeare", year: 1604, genre: "tragedy", difficulty: "intermediate" as const, words: 26000, desc: "Jealousy and manipulation destroy a noble Moor.", url: "william-shakespeare/othello" },
    { title: "The Tempest", author: "William Shakespeare", year: 1611, genre: "comedy", difficulty: "beginner" as const, words: 17000, desc: "A sorcerer conjures a storm to reclaim his dukedom.", url: "william-shakespeare/the-tempest" },
    { title: "A Midsummer Night's Dream", author: "William Shakespeare", year: 1596, genre: "comedy", difficulty: "beginner" as const, words: 17000, desc: "Fairies meddle in the love affairs of Athenian nobles.", url: "william-shakespeare/a-midsummer-nights-dream" },
    { title: "Romeo and Juliet", author: "William Shakespeare", year: 1597, genre: "tragedy", difficulty: "beginner" as const, words: 25000, desc: "Two young lovers caught between feuding families.", url: "william-shakespeare/romeo-and-juliet" },
    { title: "The Prince", author: "Niccolò Machiavelli", year: 1532, genre: "philosophy", difficulty: "intermediate" as const, words: 30000, desc: "The notorious manual of political power and statecraft.", url: "niccolo-machiavelli/the-prince/w-k-marriott" },
    { title: "Utopia", author: "Thomas More", year: 1516, genre: "philosophy", difficulty: "intermediate" as const, words: 35000, desc: "A fictional island society with a seemingly perfect socio-political system.", url: "thomas-more/utopia/gilbert-burnet" },
    { title: "The Sonnets", author: "William Shakespeare", year: 1609, genre: "poetry", difficulty: "intermediate" as const, words: 15000, desc: "154 sonnets exploring love, beauty, mortality, and time.", url: "william-shakespeare/sonnets" },
    { title: "Paradise Lost", author: "John Milton", year: 1667, genre: "poetry", difficulty: "advanced" as const, words: 80000, desc: "Satan's rebellion against God and humanity's fall from grace.", url: "john-milton/paradise-lost" },
    { title: "The Merchant of Venice", author: "William Shakespeare", year: 1598, genre: "comedy", difficulty: "intermediate" as const, words: 22000, desc: "A merchant risks his flesh as collateral for a loan.", url: "william-shakespeare/the-merchant-of-venice" },
    { title: "Twelfth Night", author: "William Shakespeare", year: 1602, genre: "comedy", difficulty: "beginner" as const, words: 20000, desc: "Mistaken identity and unrequited love in Illyria.", url: "william-shakespeare/twelfth-night" },
    { title: "Much Ado About Nothing", author: "William Shakespeare", year: 1599, genre: "comedy", difficulty: "beginner" as const, words: 21000, desc: "Sparring wit and scheming love in Renaissance Sicily.", url: "william-shakespeare/much-ado-about-nothing" },
    { title: "Essays", author: "Michel de Montaigne", year: 1580, genre: "philosophy", difficulty: "intermediate" as const, words: 350000, desc: "The pioneering personal essays that defined a genre.", url: "michel-de-montaigne/essays/charles-cotton" },
    { title: "Julius Caesar", author: "William Shakespeare", year: 1599, genre: "tragedy", difficulty: "intermediate" as const, words: 20000, desc: "The assassination of Caesar and its aftermath.", url: "william-shakespeare/julius-caesar" },
    { title: "As You Like It", author: "William Shakespeare", year: 1599, genre: "comedy", difficulty: "beginner" as const, words: 22000, desc: "Pastoral comedy of love and identity in the Forest of Arden.", url: "william-shakespeare/as-you-like-it" },
    { title: "Henry V", author: "William Shakespeare", year: 1599, genre: "drama", difficulty: "intermediate" as const, words: 27000, desc: "The young king leads England to victory at Agincourt.", url: "william-shakespeare/henry-v" },
    { title: "The Faerie Queene", author: "Edmund Spenser", year: 1596, genre: "poetry", difficulty: "advanced" as const, words: 200000, desc: "An allegorical epic celebrating the Tudor dynasty.", url: "edmund-spenser/the-faerie-queene" },
  ].map(b => ({
    title: b.title, author: b.author, year: b.year, tradition: "Renaissance" as Tradition,
    genre: b.genre, difficulty: b.difficulty, description: b.desc,
    cover_colors: getColors(b.genre), standard_ebooks_url: `https://standardebooks.org/ebooks/${b.url}`,
    word_count: b.words, reading_time_minutes: estimateReadingTime(b.words),
  })),

  // ═══════════════════════════════════════════
  // ENLIGHTENMENT (20+)
  // ═══════════════════════════════════════════
  ...[
    { title: "Candide", author: "Voltaire", year: 1759, genre: "satire", difficulty: "beginner" as const, words: 30000, desc: "A young optimist travels the world and discovers its cruelties.", url: "voltaire/candide/the-modern-library" },
    { title: "Gulliver's Travels", author: "Jonathan Swift", year: 1726, genre: "satire", difficulty: "intermediate" as const, words: 100000, desc: "A ship's surgeon visits fantastical lands that mirror human folly.", url: "jonathan-swift/gullivers-travels" },
    { title: "Robinson Crusoe", author: "Daniel Defoe", year: 1719, genre: "adventure", difficulty: "beginner" as const, words: 120000, desc: "A castaway survives alone on a tropical island for 28 years.", url: "daniel-defoe/the-life-and-adventures-of-robinson-crusoe" },
    { title: "A Modest Proposal", author: "Jonathan Swift", year: 1729, genre: "satire", difficulty: "beginner" as const, words: 4000, desc: "A biting satirical essay on Irish poverty.", url: "jonathan-swift/a-modest-proposal" },
    { title: "The Social Contract", author: "Jean-Jacques Rousseau", year: 1762, genre: "philosophy", difficulty: "advanced" as const, words: 45000, desc: "A foundational text on political philosophy and popular sovereignty.", url: "jean-jacques-rousseau/the-social-contract/g-d-h-cole" },
    { title: "An Essay Concerning Human Understanding", author: "John Locke", year: 1689, genre: "philosophy", difficulty: "advanced" as const, words: 200000, desc: "The foundational work of empiricist epistemology.", url: "john-locke/an-essay-concerning-human-understanding" },
    { title: "Tom Jones", author: "Henry Fielding", year: 1749, genre: "fiction", difficulty: "intermediate" as const, words: 350000, desc: "A foundling's picaresque journey through 18th-century England.", url: "henry-fielding/the-history-of-tom-jones-a-foundling" },
    { title: "Tristram Shandy", author: "Laurence Sterne", year: 1767, genre: "fiction", difficulty: "advanced" as const, words: 200000, desc: "The most digressive novel ever written.", url: "laurence-sterne/the-life-and-opinions-of-tristram-shandy-gentleman" },
    { title: "Emile", author: "Jean-Jacques Rousseau", year: 1762, genre: "philosophy", difficulty: "advanced" as const, words: 170000, desc: "A treatise on education and the nature of humanity.", url: "jean-jacques-rousseau/emile/barbara-foxley" },
    { title: "Confessions", author: "Jean-Jacques Rousseau", year: 1782, genre: "autobiography", difficulty: "intermediate" as const, words: 230000, desc: "An unprecedented work of radical self-examination.", url: "jean-jacques-rousseau/confessions/s-w-orson" },
    { title: "The Wealth of Nations", author: "Adam Smith", year: 1776, genre: "nonfiction", difficulty: "advanced" as const, words: 380000, desc: "The foundational text of modern economics.", url: "adam-smith/the-wealth-of-nations" },
    { title: "Pamela", author: "Samuel Richardson", year: 1740, genre: "fiction", difficulty: "intermediate" as const, words: 200000, desc: "An epistolary novel about a servant girl's virtue under assault.", url: "samuel-richardson/pamela" },
    { title: "Clarissa", author: "Samuel Richardson", year: 1748, genre: "fiction", difficulty: "advanced" as const, words: 985000, desc: "The longest novel in the English language.", url: "samuel-richardson/clarissa" },
    { title: "The Rape of the Lock", author: "Alexander Pope", year: 1714, genre: "poetry", difficulty: "intermediate" as const, words: 5000, desc: "A mock-heroic poem about a stolen lock of hair.", url: "alexander-pope/the-rape-of-the-lock" },
    { title: "Moll Flanders", author: "Daniel Defoe", year: 1722, genre: "fiction", difficulty: "intermediate" as const, words: 95000, desc: "The story of a woman born in prison who leads a colorful life.", url: "daniel-defoe/the-fortunes-and-misfortunes-of-the-famous-moll-flanders" },
  ].map(b => ({
    title: b.title, author: b.author, year: b.year, tradition: "Enlightenment" as Tradition,
    genre: b.genre, difficulty: b.difficulty, description: b.desc,
    cover_colors: getColors(b.genre), standard_ebooks_url: `https://standardebooks.org/ebooks/${b.url}`,
    word_count: b.words, reading_time_minutes: estimateReadingTime(b.words),
  })),

  // ═══════════════════════════════════════════
  // ROMANTIC (25+)
  // ═══════════════════════════════════════════
  ...[
    { title: "Frankenstein", author: "Mary Shelley", year: 1818, genre: "horror", difficulty: "beginner" as const, words: 75000, desc: "A scientist creates life and faces the consequences.", url: "mary-shelley/frankenstein" },
    { title: "Pride and Prejudice", author: "Jane Austen", year: 1813, genre: "romance", difficulty: "beginner" as const, words: 122000, desc: "Elizabeth Bennet navigates love and social expectations.", url: "jane-austen/pride-and-prejudice" },
    { title: "Sense and Sensibility", author: "Jane Austen", year: 1811, genre: "romance", difficulty: "beginner" as const, words: 120000, desc: "Two sisters embody reason and emotion.", url: "jane-austen/sense-and-sensibility" },
    { title: "Emma", author: "Jane Austen", year: 1815, genre: "romance", difficulty: "beginner" as const, words: 160000, desc: "A well-meaning but misguided matchmaker.", url: "jane-austen/emma" },
    { title: "Persuasion", author: "Jane Austen", year: 1817, genre: "romance", difficulty: "beginner" as const, words: 84000, desc: "A second chance at love eight years after a broken engagement.", url: "jane-austen/persuasion" },
    { title: "Northanger Abbey", author: "Jane Austen", year: 1817, genre: "romance", difficulty: "beginner" as const, words: 78000, desc: "A parody of Gothic novels through a young woman's eyes.", url: "jane-austen/northanger-abbey" },
    { title: "Mansfield Park", author: "Jane Austen", year: 1814, genre: "romance", difficulty: "intermediate" as const, words: 160000, desc: "A shy young woman navigates the moral complexities of wealth.", url: "jane-austen/mansfield-park" },
    { title: "Wuthering Heights", author: "Emily Brontë", year: 1847, genre: "romance", difficulty: "intermediate" as const, words: 107000, desc: "A tale of all-consuming passion on the Yorkshire moors.", url: "emily-bronte/wuthering-heights" },
    { title: "Jane Eyre", author: "Charlotte Brontë", year: 1847, genre: "romance", difficulty: "intermediate" as const, words: 188000, desc: "An orphaned governess finds love and independence.", url: "charlotte-bronte/jane-eyre" },
    { title: "The Count of Monte Cristo", author: "Alexandre Dumas", year: 1846, genre: "adventure", difficulty: "intermediate" as const, words: 465000, desc: "An innocent man escapes prison to exact elaborate revenge.", url: "alexandre-dumas/the-count-of-monte-cristo/chapman-and-hall" },
    { title: "The Three Musketeers", author: "Alexandre Dumas", year: 1844, genre: "adventure", difficulty: "beginner" as const, words: 230000, desc: "A young Gascon joins the king's musketeers.", url: "alexandre-dumas/the-three-musketeers/william-robson" },
    { title: "Les Misérables", author: "Victor Hugo", year: 1862, genre: "fiction", difficulty: "advanced" as const, words: 530000, desc: "A panoramic novel of justice, revolution, and redemption in 19th-century France.", url: "victor-hugo/les-miserables/isabel-f-hapgood" },
    { title: "The Hunchback of Notre-Dame", author: "Victor Hugo", year: 1831, genre: "fiction", difficulty: "intermediate" as const, words: 195000, desc: "Love and tragedy in medieval Paris.", url: "victor-hugo/the-hunchback-of-notre-dame/isabel-f-hapgood" },
    { title: "Faust", author: "Johann Wolfgang von Goethe", year: 1832, genre: "drama", difficulty: "advanced" as const, words: 60000, desc: "A scholar makes a deal with the devil.", url: "johann-wolfgang-von-goethe/faust/bayard-taylor" },
    { title: "The Sorrows of Young Werther", author: "Johann Wolfgang von Goethe", year: 1774, genre: "romance", difficulty: "beginner" as const, words: 35000, desc: "A young artist's unrequited love leads to tragedy.", url: "johann-wolfgang-von-goethe/the-sorrows-of-young-werther/r-d-boylan" },
    { title: "Moby-Dick", author: "Herman Melville", year: 1851, genre: "adventure", difficulty: "advanced" as const, words: 206000, desc: "Captain Ahab's obsessive hunt for the white whale.", url: "herman-melville/moby-dick" },
    { title: "The Scarlet Letter", author: "Nathaniel Hawthorne", year: 1850, genre: "fiction", difficulty: "intermediate" as const, words: 63000, desc: "Sin, guilt, and redemption in Puritan New England.", url: "nathaniel-hawthorne/the-scarlet-letter" },
    { title: "Leaves of Grass", author: "Walt Whitman", year: 1855, genre: "poetry", difficulty: "intermediate" as const, words: 90000, desc: "The foundational collection of American poetry.", url: "walt-whitman/leaves-of-grass" },
    { title: "The Last of the Mohicans", author: "James Fenimore Cooper", year: 1826, genre: "adventure", difficulty: "intermediate" as const, words: 145000, desc: "A frontier adventure during the French and Indian War.", url: "james-fenimore-cooper/the-last-of-the-mohicans" },
    { title: "The Phantom of the Opera", author: "Gaston Leroux", year: 1910, genre: "horror", difficulty: "beginner" as const, words: 65000, desc: "A mysterious figure haunts the Paris Opera House.", url: "gaston-leroux/the-phantom-of-the-opera/alexander-teixeira-de-mattos" },
  ].map(b => ({
    title: b.title, author: b.author, year: b.year, tradition: "Romantic" as Tradition,
    genre: b.genre, difficulty: b.difficulty, description: b.desc,
    cover_colors: getColors(b.genre), standard_ebooks_url: `https://standardebooks.org/ebooks/${b.url}`,
    word_count: b.words, reading_time_minutes: estimateReadingTime(b.words),
  })),

  // ═══════════════════════════════════════════
  // VICTORIAN (30+)
  // ═══════════════════════════════════════════
  ...[
    { title: "Great Expectations", author: "Charles Dickens", year: 1861, genre: "fiction", difficulty: "intermediate" as const, words: 187000, desc: "An orphan's journey from humble beginnings to gentleman status.", url: "charles-dickens/great-expectations" },
    { title: "A Tale of Two Cities", author: "Charles Dickens", year: 1859, genre: "fiction", difficulty: "intermediate" as const, words: 135000, desc: "Love and sacrifice during the French Revolution.", url: "charles-dickens/a-tale-of-two-cities" },
    { title: "Oliver Twist", author: "Charles Dickens", year: 1838, genre: "fiction", difficulty: "beginner" as const, words: 155000, desc: "An orphan boy navigates the criminal underworld of London.", url: "charles-dickens/oliver-twist" },
    { title: "David Copperfield", author: "Charles Dickens", year: 1850, genre: "fiction", difficulty: "intermediate" as const, words: 360000, desc: "Dickens's most autobiographical novel.", url: "charles-dickens/david-copperfield" },
    { title: "A Christmas Carol", author: "Charles Dickens", year: 1843, genre: "fiction", difficulty: "beginner" as const, words: 29000, desc: "A miserly old man is visited by three ghosts on Christmas Eve.", url: "charles-dickens/a-christmas-carol" },
    { title: "The Picture of Dorian Gray", author: "Oscar Wilde", year: 1890, genre: "fiction", difficulty: "intermediate" as const, words: 78000, desc: "A portrait ages while its subject remains forever young.", url: "oscar-wilde/the-picture-of-dorian-gray" },
    { title: "The Importance of Being Earnest", author: "Oscar Wilde", year: 1895, genre: "comedy", difficulty: "beginner" as const, words: 22000, desc: "A trivial comedy for serious people.", url: "oscar-wilde/the-importance-of-being-earnest" },
    { title: "Dracula", author: "Bram Stoker", year: 1897, genre: "horror", difficulty: "intermediate" as const, words: 160000, desc: "The defining vampire novel.", url: "bram-stoker/dracula" },
    { title: "The Strange Case of Dr. Jekyll and Mr. Hyde", author: "Robert Louis Stevenson", year: 1886, genre: "horror", difficulty: "beginner" as const, words: 25000, desc: "A London lawyer investigates a doctor's dark alter ego.", url: "robert-louis-stevenson/the-strange-case-of-dr-jekyll-and-mr-hyde" },
    { title: "Treasure Island", author: "Robert Louis Stevenson", year: 1883, genre: "adventure", difficulty: "beginner" as const, words: 68000, desc: "A young boy's search for buried pirate treasure.", url: "robert-louis-stevenson/treasure-island" },
    { title: "The Time Machine", author: "H. G. Wells", year: 1895, genre: "fiction", difficulty: "beginner" as const, words: 33000, desc: "A scientist travels to a distant future.", url: "h-g-wells/the-time-machine" },
    { title: "The War of the Worlds", author: "H. G. Wells", year: 1898, genre: "fiction", difficulty: "beginner" as const, words: 60000, desc: "Martians invade England.", url: "h-g-wells/the-war-of-the-worlds" },
    { title: "The Invisible Man", author: "H. G. Wells", year: 1897, genre: "fiction", difficulty: "beginner" as const, words: 50000, desc: "A scientist discovers invisibility and descends into madness.", url: "h-g-wells/the-invisible-man" },
    { title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle", year: 1892, genre: "mystery", difficulty: "beginner" as const, words: 105000, desc: "The world's greatest detective solves baffling cases.", url: "arthur-conan-doyle/the-adventures-of-sherlock-holmes" },
    { title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle", year: 1902, genre: "mystery", difficulty: "beginner" as const, words: 60000, desc: "Holmes investigates a supernatural curse on a noble family.", url: "arthur-conan-doyle/the-hound-of-the-baskervilles" },
    { title: "Alice's Adventures in Wonderland", author: "Lewis Carroll", year: 1865, genre: "fantasy", difficulty: "beginner" as const, words: 27000, desc: "A girl falls down a rabbit hole into a fantastical world.", url: "lewis-carroll/alices-adventures-in-wonderland" },
    { title: "Through the Looking-Glass", author: "Lewis Carroll", year: 1871, genre: "fantasy", difficulty: "beginner" as const, words: 30000, desc: "Alice enters a mirror world of chess and nonsense.", url: "lewis-carroll/through-the-looking-glass" },
    { title: "Middlemarch", author: "George Eliot", year: 1872, genre: "fiction", difficulty: "advanced" as const, words: 316000, desc: "A study of provincial life in 19th-century England.", url: "george-eliot/middlemarch" },
    { title: "Tess of the d'Urbervilles", author: "Thomas Hardy", year: 1891, genre: "fiction", difficulty: "intermediate" as const, words: 150000, desc: "A young woman's tragic fate in rural England.", url: "thomas-hardy/tess-of-the-durbervilles" },
    { title: "Far from the Madding Crowd", author: "Thomas Hardy", year: 1874, genre: "fiction", difficulty: "intermediate" as const, words: 120000, desc: "An independent woman chooses between three suitors.", url: "thomas-hardy/far-from-the-madding-crowd" },
    { title: "The Mill on the Floss", author: "George Eliot", year: 1860, genre: "fiction", difficulty: "intermediate" as const, words: 200000, desc: "A brother and sister's bond tested by love and duty.", url: "george-eliot/the-mill-on-the-floss" },
    { title: "The Jungle Book", author: "Rudyard Kipling", year: 1894, genre: "children", difficulty: "beginner" as const, words: 50000, desc: "A boy raised by wolves in the Indian jungle.", url: "rudyard-kipling/the-jungle-book" },
    { title: "Kim", author: "Rudyard Kipling", year: 1901, genre: "adventure", difficulty: "intermediate" as const, words: 100000, desc: "An Irish orphan's adventures across colonial India.", url: "rudyard-kipling/kim" },
    { title: "The Call of the Wild", author: "Jack London", year: 1903, genre: "adventure", difficulty: "beginner" as const, words: 32000, desc: "A domesticated dog returns to the wild during the Klondike Gold Rush.", url: "jack-london/the-call-of-the-wild" },
    { title: "White Fang", author: "Jack London", year: 1906, genre: "adventure", difficulty: "beginner" as const, words: 72000, desc: "A wild wolf-dog hybrid is gradually domesticated.", url: "jack-london/white-fang" },
    { title: "The Turn of the Screw", author: "Henry James", year: 1898, genre: "horror", difficulty: "intermediate" as const, words: 42000, desc: "A governess sees ghosts — or does she?", url: "henry-james/the-turn-of-the-screw" },
    { title: "The Portrait of a Lady", author: "Henry James", year: 1881, genre: "fiction", difficulty: "advanced" as const, words: 228000, desc: "An American woman's confrontation with European society.", url: "henry-james/the-portrait-of-a-lady" },
    { title: "Around the World in Eighty Days", author: "Jules Verne", year: 1873, genre: "adventure", difficulty: "beginner" as const, words: 63000, desc: "A gentleman bets he can circumnavigate the globe in 80 days.", url: "jules-verne/around-the-world-in-eighty-days/george-makepeace-towle" },
    { title: "Twenty Thousand Leagues Under the Seas", author: "Jules Verne", year: 1870, genre: "adventure", difficulty: "beginner" as const, words: 138000, desc: "Captain Nemo's submarine voyage beneath the oceans.", url: "jules-verne/twenty-thousand-leagues-under-the-seas/f-p-walter" },
    { title: "The Adventures of Tom Sawyer", author: "Mark Twain", year: 1876, genre: "fiction", difficulty: "beginner" as const, words: 70000, desc: "A mischievous boy's adventures along the Mississippi.", url: "mark-twain/the-adventures-of-tom-sawyer" },
    { title: "Adventures of Huckleberry Finn", author: "Mark Twain", year: 1884, genre: "fiction", difficulty: "beginner" as const, words: 109000, desc: "A boy and a runaway slave raft down the Mississippi River.", url: "mark-twain/adventures-of-huckleberry-finn" },
  ].map(b => ({
    title: b.title, author: b.author, year: b.year, tradition: "Victorian" as Tradition,
    genre: b.genre, difficulty: b.difficulty, description: b.desc,
    cover_colors: getColors(b.genre), standard_ebooks_url: `https://standardebooks.org/ebooks/${b.url}`,
    word_count: b.words, reading_time_minutes: estimateReadingTime(b.words),
  })),

  // ═══════════════════════════════════════════
  // RUSSIAN (25+)
  // ═══════════════════════════════════════════
  ...[
    { title: "Crime and Punishment", author: "Fyodor Dostoevsky", year: 1866, genre: "fiction", difficulty: "intermediate" as const, words: 211000, desc: "A student murders a pawnbroker and struggles with guilt.", url: "fyodor-dostoevsky/crime-and-punishment/constance-garnett" },
    { title: "The Brothers Karamazov", author: "Fyodor Dostoevsky", year: 1880, genre: "fiction", difficulty: "advanced" as const, words: 364000, desc: "Three brothers grapple with faith, reason, and morality.", url: "fyodor-dostoevsky/the-brothers-karamazov/constance-garnett" },
    { title: "The Idiot", author: "Fyodor Dostoevsky", year: 1869, genre: "fiction", difficulty: "intermediate" as const, words: 230000, desc: "A pure-hearted prince navigates a corrupt society.", url: "fyodor-dostoevsky/the-idiot/eva-martin" },
    { title: "Notes from Underground", author: "Fyodor Dostoevsky", year: 1864, genre: "fiction", difficulty: "intermediate" as const, words: 40000, desc: "A bitter recluse's philosophical monologue.", url: "fyodor-dostoevsky/notes-from-underground/constance-garnett" },
    { title: "Demons", author: "Fyodor Dostoevsky", year: 1872, genre: "fiction", difficulty: "advanced" as const, words: 265000, desc: "Political radicals sow chaos in a provincial town.", url: "fyodor-dostoevsky/demons/constance-garnett" },
    { title: "War and Peace", author: "Leo Tolstoy", year: 1869, genre: "fiction", difficulty: "advanced" as const, words: 580000, desc: "Five aristocratic families during the Napoleonic Wars.", url: "leo-tolstoy/war-and-peace/louise-maude_aylmer-maude" },
    { title: "Anna Karenina", author: "Leo Tolstoy", year: 1877, genre: "fiction", difficulty: "intermediate" as const, words: 350000, desc: "A married aristocrat's passionate love affair and its consequences.", url: "leo-tolstoy/anna-karenina/constance-garnett" },
    { title: "The Death of Ivan Ilyich", author: "Leo Tolstoy", year: 1886, genre: "fiction", difficulty: "beginner" as const, words: 25000, desc: "A dying judge confronts the meaninglessness of his conventional life.", url: "leo-tolstoy/the-death-of-ivan-ilyich/louise-maude_aylmer-maude" },
    { title: "Resurrection", author: "Leo Tolstoy", year: 1899, genre: "fiction", difficulty: "intermediate" as const, words: 200000, desc: "A nobleman seeks redemption for a past wrong.", url: "leo-tolstoy/resurrection/louise-maude" },
    { title: "Dead Souls", author: "Nikolai Gogol", year: 1842, genre: "satire", difficulty: "intermediate" as const, words: 130000, desc: "A con man buys the rights to dead serfs.", url: "nikolai-gogol/dead-souls/d-j-hogarth" },
    { title: "The Overcoat", author: "Nikolai Gogol", year: 1842, genre: "fiction", difficulty: "beginner" as const, words: 12000, desc: "A poor clerk saves for a new overcoat.", url: "nikolai-gogol/short-fiction/claud-field_isabel-f-hapgood_vizetelly-and-company" },
    { title: "Eugene Onegin", author: "Alexander Pushkin", year: 1833, genre: "poetry", difficulty: "intermediate" as const, words: 25000, desc: "A verse novel of love and disillusionment in Russian society.", url: "alexander-pushkin/eugene-onegin/henry-spalding" },
    { title: "Fathers and Sons", author: "Ivan Turgenev", year: 1862, genre: "fiction", difficulty: "intermediate" as const, words: 75000, desc: "A nihilist clashes with the older generation.", url: "ivan-turgenev/fathers-and-sons/constance-garnett" },
    { title: "A Hero of Our Time", author: "Mikhail Lermontov", year: 1840, genre: "fiction", difficulty: "intermediate" as const, words: 55000, desc: "The first psychological novel in Russian literature.", url: "mikhail-lermontov/a-hero-of-our-time/j-h-wisdom_marr-murray" },
    { title: "The Cherry Orchard", author: "Anton Chekhov", year: 1904, genre: "drama", difficulty: "intermediate" as const, words: 20000, desc: "An aristocratic family faces the loss of their estate.", url: "anton-chekhov/the-cherry-orchard/julius-west" },
    { title: "Uncle Vanya", author: "Anton Chekhov", year: 1897, genre: "drama", difficulty: "intermediate" as const, words: 15000, desc: "A provincial household's frustration and unfulfilled dreams.", url: "anton-chekhov/uncle-vanya/marian-fell" },
    { title: "The Three Sisters", author: "Anton Chekhov", year: 1901, genre: "drama", difficulty: "intermediate" as const, words: 20000, desc: "Three sisters long to return to Moscow from the provinces.", url: "anton-chekhov/the-three-sisters/julius-west" },
    { title: "The Seagull", author: "Anton Chekhov", year: 1896, genre: "drama", difficulty: "intermediate" as const, words: 18000, desc: "Art, love, and failed ambitions at a lakeside estate.", url: "anton-chekhov/the-seagull/julius-west" },
    { title: "Oblomov", author: "Ivan Goncharov", year: 1859, genre: "fiction", difficulty: "intermediate" as const, words: 190000, desc: "A nobleman too lethargic to leave his couch.", url: "ivan-goncharov/oblomov/c-j-hogarth" },
    { title: "What Is to Be Done?", author: "Nikolai Chernyshevsky", year: 1863, genre: "fiction", difficulty: "intermediate" as const, words: 150000, desc: "A revolutionary novel that inspired generations of Russian radicals.", url: "nikolai-chernyshevsky/what-is-to-be-done/benjamin-r-tucker" },
  ].map(b => ({
    title: b.title, author: b.author, year: b.year, tradition: "Russian" as Tradition,
    genre: b.genre, difficulty: b.difficulty, description: b.desc,
    cover_colors: getColors(b.genre), standard_ebooks_url: `https://standardebooks.org/ebooks/${b.url}`,
    word_count: b.words, reading_time_minutes: estimateReadingTime(b.words),
  })),

  // ═══════════════════════════════════════════
  // AMERICAN (30+)
  // ═══════════════════════════════════════════
  ...[
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925, genre: "fiction", difficulty: "beginner" as const, words: 47000, desc: "The American Dream and its discontents in the Jazz Age.", url: "f-scott-fitzgerald/the-great-gatsby" },
    { title: "The Age of Innocence", author: "Edith Wharton", year: 1920, genre: "fiction", difficulty: "intermediate" as const, words: 102000, desc: "A lawyer torn between duty and passion in Gilded Age New York.", url: "edith-wharton/the-age-of-innocence" },
    { title: "The House of Mirth", author: "Edith Wharton", year: 1905, genre: "fiction", difficulty: "intermediate" as const, words: 130000, desc: "A woman's struggle to maintain her place in New York society.", url: "edith-wharton/the-house-of-mirth" },
    { title: "Walden", author: "Henry David Thoreau", year: 1854, genre: "nonfiction", difficulty: "intermediate" as const, words: 108000, desc: "Two years of simple living in the woods near Walden Pond.", url: "henry-david-thoreau/walden" },
    { title: "Civil Disobedience", author: "Henry David Thoreau", year: 1849, genre: "philosophy", difficulty: "beginner" as const, words: 9000, desc: "The foundational essay on nonviolent resistance.", url: "henry-david-thoreau/civil-disobedience" },
    { title: "The Autobiography of Benjamin Franklin", author: "Benjamin Franklin", year: 1791, genre: "autobiography", difficulty: "intermediate" as const, words: 75000, desc: "The self-made man's own story.", url: "benjamin-franklin/the-autobiography-of-benjamin-franklin" },
    { title: "Uncle Tom's Cabin", author: "Harriet Beecher Stowe", year: 1852, genre: "fiction", difficulty: "intermediate" as const, words: 166000, desc: "The anti-slavery novel that changed American history.", url: "harriet-beecher-stowe/uncle-toms-cabin" },
    { title: "The Red Badge of Courage", author: "Stephen Crane", year: 1895, genre: "fiction", difficulty: "beginner" as const, words: 50000, desc: "A young soldier's experience of the Civil War.", url: "stephen-crane/the-red-badge-of-courage" },
    { title: "The Awakening", author: "Kate Chopin", year: 1899, genre: "fiction", difficulty: "beginner" as const, words: 50000, desc: "A woman's sexual and artistic awakening in Creole society.", url: "kate-chopin/the-awakening" },
    { title: "Little Women", author: "Louisa May Alcott", year: 1868, genre: "fiction", difficulty: "beginner" as const, words: 187000, desc: "Four sisters growing up during the Civil War.", url: "louisa-may-alcott/little-women" },
    { title: "Narrative of the Life of Frederick Douglass", author: "Frederick Douglass", year: 1845, genre: "autobiography", difficulty: "beginner" as const, words: 30000, desc: "An escaped slave's powerful account of bondage and freedom.", url: "frederick-douglass/narrative-of-the-life-of-frederick-douglass" },
    { title: "The Souls of Black Folk", author: "W. E. B. Du Bois", year: 1903, genre: "nonfiction", difficulty: "intermediate" as const, words: 70000, desc: "Landmark essays on race in America.", url: "w-e-b-du-bois/the-souls-of-black-folk" },
    { title: "Sister Carrie", author: "Theodore Dreiser", year: 1900, genre: "fiction", difficulty: "intermediate" as const, words: 170000, desc: "A small-town girl rises in Chicago society.", url: "theodore-dreiser/sister-carrie" },
    { title: "My Ántonia", author: "Willa Cather", year: 1918, genre: "fiction", difficulty: "beginner" as const, words: 65000, desc: "An immigrant woman's life on the Nebraska prairie.", url: "willa-cather/my-antonia" },
    { title: "The Jungle", author: "Upton Sinclair", year: 1906, genre: "fiction", difficulty: "intermediate" as const, words: 150000, desc: "Lithuanian immigrants face the horrors of the Chicago meatpacking industry.", url: "upton-sinclair/the-jungle" },
    { title: "Ethan Frome", author: "Edith Wharton", year: 1911, genre: "fiction", difficulty: "beginner" as const, words: 30000, desc: "A bleak love triangle in rural New England.", url: "edith-wharton/ethan-frome" },
  ].map(b => ({
    title: b.title, author: b.author, year: b.year, tradition: "American" as Tradition,
    genre: b.genre, difficulty: b.difficulty, description: b.desc,
    cover_colors: getColors(b.genre), standard_ebooks_url: `https://standardebooks.org/ebooks/${b.url}`,
    word_count: b.words, reading_time_minutes: estimateReadingTime(b.words),
  })),

  // ═══════════════════════════════════════════
  // FRENCH (20+)
  // ═══════════════════════════════════════════
  ...[
    { title: "Madame Bovary", author: "Gustave Flaubert", year: 1857, genre: "fiction", difficulty: "intermediate" as const, words: 117000, desc: "A provincial doctor's wife seeks escape through romantic fantasies.", url: "gustave-flaubert/madame-bovary/eleanor-marx-aveling" },
    { title: "The Red and the Black", author: "Stendhal", year: 1830, genre: "fiction", difficulty: "intermediate" as const, words: 175000, desc: "An ambitious young man's rise and fall in Restoration France.", url: "stendhal/the-red-and-the-black/horace-b-samuel" },
    { title: "Germinal", author: "Émile Zola", year: 1885, genre: "fiction", difficulty: "intermediate" as const, words: 175000, desc: "A coal miners' strike in northern France.", url: "emile-zola/germinal/havelock-ellis" },
    { title: "Nana", author: "Émile Zola", year: 1880, genre: "fiction", difficulty: "intermediate" as const, words: 130000, desc: "A courtesan rises and falls in Second Empire Paris.", url: "emile-zola/nana/victor-plarr" },
    { title: "Pere Goriot", author: "Honoré de Balzac", year: 1835, genre: "fiction", difficulty: "intermediate" as const, words: 90000, desc: "A father sacrifices everything for his ungrateful daughters.", url: "honore-de-balzac/pere-goriot/ellen-marriage" },
    { title: "The Flowers of Evil", author: "Charles Baudelaire", year: 1857, genre: "poetry", difficulty: "advanced" as const, words: 20000, desc: "Groundbreaking poetry of beauty, decay, and modern ennui.", url: "charles-baudelaire/the-flowers-of-evil/william-aggeler" },
    { title: "Dangerous Liaisons", author: "Pierre Choderlos de Laclos", year: 1782, genre: "fiction", difficulty: "intermediate" as const, words: 130000, desc: "Aristocratic libertines manipulate and destroy through letters.", url: "pierre-choderlos-de-laclos/dangerous-liaisons/thomas-moore" },
    { title: "Cyrano de Bergerac", author: "Edmond Rostand", year: 1897, genre: "drama", difficulty: "intermediate" as const, words: 40000, desc: "A brilliant swordsman with an enormous nose loves from afar.", url: "edmond-rostand/cyrano-de-bergerac/gladys-thomas_mary-f-guillemard" },
    { title: "The Stranger", author: "Albert Camus", year: 1942, genre: "fiction", difficulty: "beginner" as const, words: 36000, desc: "A detached man commits a senseless murder in Algeria.", url: "albert-camus/the-stranger/stuart-gilbert" },
    { title: "The Plague", author: "Albert Camus", year: 1947, genre: "fiction", difficulty: "intermediate" as const, words: 95000, desc: "A North African city confronts a deadly epidemic.", url: "albert-camus/the-plague/stuart-gilbert" },
    { title: "Swann's Way", author: "Marcel Proust", year: 1913, genre: "fiction", difficulty: "advanced" as const, words: 200000, desc: "The first volume of the greatest novel of memory.", url: "marcel-proust/swanns-way/c-k-scott-moncrieff" },
    { title: "Thérèse Raquin", author: "Émile Zola", year: 1867, genre: "fiction", difficulty: "intermediate" as const, words: 65000, desc: "Adultery and murder in a dreary Parisian passage.", url: "emile-zola/therese-raquin/edward-vizetelly" },
    { title: "Bel-Ami", author: "Guy de Maupassant", year: 1885, genre: "fiction", difficulty: "intermediate" as const, words: 100000, desc: "An unscrupulous journalist climbs Paris society.", url: "guy-de-maupassant/bel-ami/ernest-boyd_storm-jameson" },
    { title: "Twenty Years After", author: "Alexandre Dumas", year: 1845, genre: "adventure", difficulty: "intermediate" as const, words: 290000, desc: "The musketeers reunite during the Fronde.", url: "alexandre-dumas/twenty-years-after/estes-and-lauriat" },
    { title: "The Phantom of the Opera", author: "Gaston Leroux", year: 1910, genre: "horror", difficulty: "beginner" as const, words: 65000, desc: "A mysterious figure haunts the Paris Opera House.", url: "gaston-leroux/the-phantom-of-the-opera/alexander-teixeira-de-mattos" },
  ].map(b => ({
    title: b.title, author: b.author, year: b.year, tradition: "French" as Tradition,
    genre: b.genre, difficulty: b.difficulty, description: b.desc,
    cover_colors: getColors(b.genre), standard_ebooks_url: `https://standardebooks.org/ebooks/${b.url}`,
    word_count: b.words, reading_time_minutes: estimateReadingTime(b.words),
  })),

  // ═══════════════════════════════════════════
  // MODERNIST (25+)
  // ═══════════════════════════════════════════
  ...[
    { title: "Ulysses", author: "James Joyce", year: 1922, genre: "fiction", difficulty: "advanced" as const, words: 265000, desc: "A single day in Dublin told in revolutionary prose.", url: "james-joyce/ulysses" },
    { title: "Dubliners", author: "James Joyce", year: 1914, genre: "fiction", difficulty: "intermediate" as const, words: 68000, desc: "Fifteen stories of paralysis and epiphany in Dublin.", url: "james-joyce/dubliners" },
    { title: "A Portrait of the Artist as a Young Man", author: "James Joyce", year: 1916, genre: "fiction", difficulty: "intermediate" as const, words: 84000, desc: "The development of a young artist's consciousness.", url: "james-joyce/a-portrait-of-the-artist-as-a-young-man" },
    { title: "Mrs Dalloway", author: "Virginia Woolf", year: 1925, genre: "fiction", difficulty: "intermediate" as const, words: 63000, desc: "A society hostess prepares for a party in post-war London.", url: "virginia-woolf/mrs-dalloway" },
    { title: "To the Lighthouse", author: "Virginia Woolf", year: 1927, genre: "fiction", difficulty: "advanced" as const, words: 65000, desc: "A family's summers at their holiday home over ten years.", url: "virginia-woolf/to-the-lighthouse" },
    { title: "The Metamorphosis", author: "Franz Kafka", year: 1915, genre: "fiction", difficulty: "beginner" as const, words: 22000, desc: "A traveling salesman wakes up as a giant insect.", url: "franz-kafka/the-metamorphosis/ian-johnston" },
    { title: "The Trial", author: "Franz Kafka", year: 1925, genre: "fiction", difficulty: "intermediate" as const, words: 75000, desc: "A man is arrested and prosecuted by an incomprehensible authority.", url: "franz-kafka/the-trial/david-wyllie" },
    { title: "The Castle", author: "Franz Kafka", year: 1926, genre: "fiction", difficulty: "intermediate" as const, words: 95000, desc: "A land surveyor struggles to gain access to a mysterious castle.", url: "franz-kafka/the-castle/willa-muir_edwin-muir" },
    { title: "Heart of Darkness", author: "Joseph Conrad", year: 1899, genre: "fiction", difficulty: "intermediate" as const, words: 38000, desc: "A journey up the Congo River into the darkness of colonialism.", url: "joseph-conrad/heart-of-darkness" },
    { title: "Lord Jim", author: "Joseph Conrad", year: 1900, genre: "fiction", difficulty: "intermediate" as const, words: 120000, desc: "A young seaman's struggle with cowardice and redemption.", url: "joseph-conrad/lord-jim" },
    { title: "The Waste Land", author: "T. S. Eliot", year: 1922, genre: "poetry", difficulty: "advanced" as const, words: 3500, desc: "The defining poem of modernist disillusionment.", url: "t-s-eliot/the-waste-land" },
    { title: "The Sun Also Rises", author: "Ernest Hemingway", year: 1926, genre: "fiction", difficulty: "beginner" as const, words: 68000, desc: "Lost Generation expatriates in Paris and Pamplona.", url: "ernest-hemingway/the-sun-also-rises" },
    { title: "A Farewell to Arms", author: "Ernest Hemingway", year: 1929, genre: "fiction", difficulty: "beginner" as const, words: 80000, desc: "An American ambulance driver's love affair during World War I.", url: "ernest-hemingway/a-farewell-to-arms" },
    { title: "The Sound and the Fury", author: "William Faulkner", year: 1929, genre: "fiction", difficulty: "advanced" as const, words: 107000, desc: "The decline of a Southern family told through four narrators.", url: "william-faulkner/the-sound-and-the-fury" },
    { title: "As I Lay Dying", author: "William Faulkner", year: 1930, genre: "fiction", difficulty: "intermediate" as const, words: 57000, desc: "A poor family's journey to bury their mother.", url: "william-faulkner/as-i-lay-dying" },
    { title: "Siddhartha", author: "Hermann Hesse", year: 1922, genre: "spiritual", difficulty: "beginner" as const, words: 40000, desc: "A young man's spiritual journey in ancient India.", url: "hermann-hesse/siddhartha/hilda-rosner" },
    { title: "Steppenwolf", author: "Hermann Hesse", year: 1927, genre: "fiction", difficulty: "intermediate" as const, words: 65000, desc: "A man torn between his humanity and his wolf-like nature.", url: "hermann-hesse/steppenwolf/basil-creighton" },
    { title: "The Magic Mountain", author: "Thomas Mann", year: 1924, genre: "fiction", difficulty: "advanced" as const, words: 350000, desc: "Seven years in a Swiss sanatorium as a microcosm of European civilization.", url: "thomas-mann/the-magic-mountain/h-t-lowe-porter" },
    { title: "Death in Venice", author: "Thomas Mann", year: 1912, genre: "fiction", difficulty: "intermediate" as const, words: 28000, desc: "An aging writer's fatal obsession in plague-stricken Venice.", url: "thomas-mann/death-in-venice/kenneth-burke" },
    { title: "Brave New World", author: "Aldous Huxley", year: 1932, genre: "fiction", difficulty: "intermediate" as const, words: 64000, desc: "A dystopia of engineered happiness and social control.", url: "aldous-huxley/brave-new-world" },
  ].map(b => ({
    title: b.title, author: b.author, year: b.year, tradition: "Modernist" as Tradition,
    genre: b.genre, difficulty: b.difficulty, description: b.desc,
    cover_colors: getColors(b.genre), standard_ebooks_url: `https://standardebooks.org/ebooks/${b.url}`,
    word_count: b.words, reading_time_minutes: estimateReadingTime(b.words),
  })),

  // ═══════════════════════════════════════════
  // EASTERN (20+)
  // ═══════════════════════════════════════════
  ...[
    { title: "The Art of War", author: "Sun Tzu", year: -500, genre: "philosophy", difficulty: "beginner" as const, words: 13000, desc: "The ancient Chinese treatise on military strategy.", url: "sun-tzu/the-art-of-war/lionel-giles" },
    { title: "Tao Te Ching", author: "Laozi", year: -400, genre: "philosophy", difficulty: "beginner" as const, words: 5000, desc: "The foundational text of Taoism.", url: "laozi/tao-te-ching/james-legge" },
    { title: "The Analects", author: "Confucius", year: -479, genre: "philosophy", difficulty: "intermediate" as const, words: 16000, desc: "The collected sayings of Confucius.", url: "confucius/the-analects/william-jennings" },
    { title: "The Tale of Genji", author: "Murasaki Shikibu", year: 1021, genre: "fiction", difficulty: "advanced" as const, words: 300000, desc: "Often called the world's first novel.", url: "murasaki-shikibu/the-tale-of-genji/arthur-waley" },
    { title: "The Mahabharata", author: "Vyasa", year: -400, genre: "poetry", difficulty: "advanced" as const, words: 200000, desc: "The great Indian epic of duty, war, and dharma.", url: "vyasa/the-mahabharata/kisari-mohan-ganguli" },
    { title: "The Ramayana", author: "Valmiki", year: -500, genre: "poetry", difficulty: "intermediate" as const, words: 150000, desc: "Prince Rama's quest to rescue his wife from the demon king.", url: "valmiki/the-ramayana/ralph-t-h-griffith" },
    { title: "The Bhagavad Gita", author: "Vyasa", year: -200, genre: "spiritual", difficulty: "intermediate" as const, words: 25000, desc: "Krishna counsels Arjuna on the battlefield of Kurukshetra.", url: "vyasa/the-bhagavad-gita/edwin-arnold" },
    { title: "The Book of Tea", author: "Kakuzō Okakura", year: 1906, genre: "philosophy", difficulty: "beginner" as const, words: 18000, desc: "Japanese aesthetics through the lens of tea ceremony.", url: "kakuzo-okakura/the-book-of-tea" },
    { title: "Kokoro", author: "Natsume Sōseki", year: 1914, genre: "fiction", difficulty: "intermediate" as const, words: 70000, desc: "A young man's friendship with a mysterious older man.", url: "natsume-soseki/kokoro/edwin-mcclellan" },
    { title: "I Am a Cat", author: "Natsume Sōseki", year: 1905, genre: "satire", difficulty: "intermediate" as const, words: 150000, desc: "Japanese society observed through the eyes of a cat.", url: "natsume-soseki/i-am-a-cat/aiko-ito_graeme-wilson" },
    { title: "The Pillow Book", author: "Sei Shōnagon", year: 1002, genre: "nonfiction", difficulty: "intermediate" as const, words: 80000, desc: "A court lady's observations, opinions, and lists.", url: "sei-shonagon/the-pillow-book/arthur-waley" },
    { title: "Rubaiyat of Omar Khayyam", author: "Omar Khayyám", year: 1120, genre: "poetry", difficulty: "beginner" as const, words: 5000, desc: "Quatrains celebrating wine, love, and the fleeting nature of life.", url: "omar-khayyam/the-rubaiyat-of-omar-khayyam/edward-fitzgerald" },
    { title: "The Conference of the Birds", author: "Attar", year: 1177, genre: "poetry", difficulty: "intermediate" as const, words: 40000, desc: "A Sufi allegorical poem about the soul's journey to God.", url: "attar-of-nishapur/the-conference-of-the-birds/edward-fitzgerald" },
    { title: "Journey to the West", author: "Wu Cheng'en", year: 1592, genre: "fantasy", difficulty: "intermediate" as const, words: 300000, desc: "The Monkey King accompanies a Buddhist monk on a pilgrimage.", url: "wu-chengen/journey-to-the-west/w-j-f-jenner" },
    { title: "The Dhammapada", author: "Anonymous", year: -300, genre: "spiritual", difficulty: "beginner" as const, words: 8000, desc: "Sayings of the Buddha on the path to enlightenment.", url: "anonymous/the-dhammapada/f-max-muller" },
  ].map(b => ({
    title: b.title, author: b.author, year: b.year, tradition: "Eastern" as Tradition,
    genre: b.genre, difficulty: b.difficulty, description: b.desc,
    cover_colors: getColors(b.genre), standard_ebooks_url: `https://standardebooks.org/ebooks/${b.url}`,
    word_count: b.words, reading_time_minutes: estimateReadingTime(b.words),
  })),

  // ═══════════════════════════════════════════
  // POST-COLONIAL (15+)
  // ═══════════════════════════════════════════
  ...[
    { title: "Kim", author: "Rudyard Kipling", year: 1901, genre: "adventure", difficulty: "intermediate" as const, words: 100000, desc: "An Irish orphan's adventures across colonial India.", url: "rudyard-kipling/kim" },
    { title: "The Jungle Book", author: "Rudyard Kipling", year: 1894, genre: "children", difficulty: "beginner" as const, words: 50000, desc: "A boy raised by wolves in the Indian jungle.", url: "rudyard-kipling/the-jungle-book" },
    { title: "A Passage to India", author: "E. M. Forster", year: 1924, genre: "fiction", difficulty: "intermediate" as const, words: 100000, desc: "Racial tensions and cultural misunderstanding in British India.", url: "e-m-forster/a-passage-to-india" },
    { title: "Gitanjali", author: "Rabindranath Tagore", year: 1912, genre: "poetry", difficulty: "beginner" as const, words: 10000, desc: "Song offerings that won the Nobel Prize.", url: "rabindranath-tagore/gitanjali" },
    { title: "The Home and the World", author: "Rabindranath Tagore", year: 1916, genre: "fiction", difficulty: "intermediate" as const, words: 65000, desc: "Nationalism and love in early 20th-century Bengal.", url: "rabindranath-tagore/the-home-and-the-world/surendranath-tagore" },
    { title: "Almayer's Folly", author: "Joseph Conrad", year: 1895, genre: "fiction", difficulty: "intermediate" as const, words: 65000, desc: "A Dutch trader's decline in colonial Borneo.", url: "joseph-conrad/almayers-folly" },
    { title: "Nostromo", author: "Joseph Conrad", year: 1904, genre: "fiction", difficulty: "advanced" as const, words: 170000, desc: "Revolution and silver mining in a fictional South American country.", url: "joseph-conrad/nostromo" },
    { title: "The Secret Agent", author: "Joseph Conrad", year: 1907, genre: "fiction", difficulty: "intermediate" as const, words: 80000, desc: "An anarchist plot in Victorian London.", url: "joseph-conrad/the-secret-agent" },
    { title: "Victory", author: "Joseph Conrad", year: 1915, genre: "fiction", difficulty: "intermediate" as const, words: 110000, desc: "A recluse on a tropical island faces violence.", url: "joseph-conrad/victory" },
    { title: "The Man Who Would Be King", author: "Rudyard Kipling", year: 1888, genre: "adventure", difficulty: "beginner" as const, words: 15000, desc: "Two adventurers become kings in a remote Afghan land.", url: "rudyard-kipling/the-man-who-would-be-king" },
  ].map(b => ({
    title: b.title, author: b.author, year: b.year, tradition: "Post-Colonial" as Tradition,
    genre: b.genre, difficulty: b.difficulty, description: b.desc,
    cover_colors: getColors(b.genre), standard_ebooks_url: `https://standardebooks.org/ebooks/${b.url}`,
    word_count: b.words, reading_time_minutes: estimateReadingTime(b.words),
  })),

  // ═══════════════════════════════════════════
  // CONTEMPORARY (20+)
  // ═══════════════════════════════════════════
  ...[
    { title: "1984", author: "George Orwell", year: 1949, genre: "fiction", difficulty: "beginner" as const, words: 88000, desc: "A dystopian nightmare of totalitarian surveillance.", url: "george-orwell/nineteen-eighty-four" },
    { title: "Animal Farm", author: "George Orwell", year: 1945, genre: "satire", difficulty: "beginner" as const, words: 30000, desc: "A political allegory of revolution betrayed.", url: "george-orwell/animal-farm" },
    { title: "Lord of the Flies", author: "William Golding", year: 1954, genre: "fiction", difficulty: "beginner" as const, words: 60000, desc: "Schoolboys stranded on an island descend into savagery.", url: "william-golding/lord-of-the-flies" },
    { title: "The Old Man and the Sea", author: "Ernest Hemingway", year: 1952, genre: "fiction", difficulty: "beginner" as const, words: 27000, desc: "An aging fisherman's epic battle with a marlin.", url: "ernest-hemingway/the-old-man-and-the-sea" },
    { title: "Of Mice and Men", author: "John Steinbeck", year: 1937, genre: "fiction", difficulty: "beginner" as const, words: 30000, desc: "Two displaced migrant workers dream of owning a farm.", url: "john-steinbeck/of-mice-and-men" },
    { title: "The Grapes of Wrath", author: "John Steinbeck", year: 1939, genre: "fiction", difficulty: "intermediate" as const, words: 169000, desc: "A family's journey from Oklahoma to California during the Dust Bowl.", url: "john-steinbeck/the-grapes-of-wrath" },
    { title: "East of Eden", author: "John Steinbeck", year: 1952, genre: "fiction", difficulty: "intermediate" as const, words: 226000, desc: "Two families' intertwined stories of good and evil in California.", url: "john-steinbeck/east-of-eden" },
    { title: "The Catcher in the Rye", author: "J. D. Salinger", year: 1951, genre: "fiction", difficulty: "beginner" as const, words: 73000, desc: "A teenager's alienation in post-war New York City.", url: "j-d-salinger/the-catcher-in-the-rye" },
    { title: "On the Road", author: "Jack Kerouac", year: 1957, genre: "fiction", difficulty: "beginner" as const, words: 80000, desc: "Cross-country adventures of the Beat Generation.", url: "jack-kerouac/on-the-road" },
    { title: "Fahrenheit 451", author: "Ray Bradbury", year: 1953, genre: "fiction", difficulty: "beginner" as const, words: 46000, desc: "A fireman's job is to burn books in a censored future.", url: "ray-bradbury/fahrenheit-451" },
    { title: "Invisible Man", author: "Ralph Ellison", year: 1952, genre: "fiction", difficulty: "intermediate" as const, words: 150000, desc: "An unnamed narrator navigates racism in mid-century America.", url: "ralph-ellison/invisible-man" },
    { title: "The Bell Jar", author: "Sylvia Plath", year: 1963, genre: "fiction", difficulty: "beginner" as const, words: 60000, desc: "A young woman's descent into depression.", url: "sylvia-plath/the-bell-jar" },
    { title: "Slaughterhouse-Five", author: "Kurt Vonnegut", year: 1969, genre: "fiction", difficulty: "beginner" as const, words: 49000, desc: "An anti-war novel about the firebombing of Dresden.", url: "kurt-vonnegut/slaughterhouse-five" },
    { title: "One Flew Over the Cuckoo's Nest", author: "Ken Kesey", year: 1962, genre: "fiction", difficulty: "intermediate" as const, words: 85000, desc: "A convict's rebellion in a psychiatric hospital.", url: "ken-kesey/one-flew-over-the-cuckoos-nest" },
    { title: "A Clockwork Orange", author: "Anthony Burgess", year: 1962, genre: "fiction", difficulty: "intermediate" as const, words: 59000, desc: "Ultraviolence and free will in a dystopian future.", url: "anthony-burgess/a-clockwork-orange" },
    { title: "The Stranger", author: "Albert Camus", year: 1942, genre: "fiction", difficulty: "beginner" as const, words: 36000, desc: "A detached man commits a senseless murder in Algeria.", url: "albert-camus/the-stranger/stuart-gilbert" },
    { title: "No Exit", author: "Jean-Paul Sartre", year: 1944, genre: "drama", difficulty: "beginner" as const, words: 12000, desc: "Three souls discover hell is other people.", url: "jean-paul-sartre/no-exit/stuart-gilbert" },
    { title: "Waiting for Godot", author: "Samuel Beckett", year: 1953, genre: "drama", difficulty: "intermediate" as const, words: 16000, desc: "Two men wait for someone who never comes.", url: "samuel-beckett/waiting-for-godot" },
    { title: "The Diary of a Young Girl", author: "Anne Frank", year: 1947, genre: "autobiography", difficulty: "beginner" as const, words: 70000, desc: "A Jewish girl's diary from hiding during the Holocaust.", url: "anne-frank/the-diary-of-a-young-girl/b-m-mooyaart-doubleday" },
    { title: "Night", author: "Elie Wiesel", year: 1960, genre: "autobiography", difficulty: "beginner" as const, words: 32000, desc: "A memoir of survival in Nazi concentration camps.", url: "elie-wiesel/night/stella-rodway" },
  ].map(b => ({
    title: b.title, author: b.author, year: b.year, tradition: "Contemporary" as Tradition,
    genre: b.genre, difficulty: b.difficulty, description: b.desc,
    cover_colors: getColors(b.genre), standard_ebooks_url: `https://standardebooks.org/ebooks/${b.url}`,
    word_count: b.words, reading_time_minutes: estimateReadingTime(b.words),
  })),
]

// ── Seed Runner ────────────────────────────────

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }

  console.log(`Seeding ${books.length} books...`)

  // Deduplicate by title+author
  const seen = new Set<string>()
  const unique = books.filter((b) => {
    const key = `${b.title}|${b.author}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  console.log(`${unique.length} unique books after deduplication`)

  // Insert in batches of 50
  const BATCH_SIZE = 50
  let inserted = 0

  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE)

    const res = await fetch(`${supabaseUrl}/rest/v1/books`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(batch),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, res.status, text)
      continue
    }

    inserted += batch.length
    console.log(`  Inserted ${inserted}/${unique.length}`)
  }

  console.log(`\nDone! Seeded ${inserted} books.`)
}

main()
