// ── Tome Author Database ──
// Comprehensive biographical data for classical literature authors.
// Scholarly but accessible — the kind of introduction a great literature
// professor gives on the first day covering each writer.

export interface Author {
  id: string               // kebab-case slug: "homer", "jane-austen"
  name: string             // display name: "Homer"
  fullName?: string        // "Jane Austen" if different from display name
  birthYear?: number       // negative for BCE: -800
  deathYear?: number       // negative for BCE: -701
  birthPlace?: string      // "Ionia, Ancient Greece"
  nationality: string      // "Greek"
  era: string              // "Ancient" | "Medieval" | "Renaissance" | "Enlightenment" | "19th Century" | "Early 20th Century"
  traditions: string[]     // subset of recognized literary traditions
  bio: string              // 2-3 paragraphs, separated by \n\n
  notableWorks: string[]   // top 3-5 works
  themes: string[]         // 5-8 thematic keywords
  influence: string        // 1-2 sentences on literary legacy
  funFact?: string         // interesting fact about the author
  quotes: string[]         // 2-3 short famous quotes (under 15 words each)
  virgilNote?: string      // genuine literary connection to Virgil the Roman poet
  bookAuthorNames?: string[] // variants of the author's name as they appear in book records
  worksInLibrary?: string[]      // book IDs from books.ts: ["the-iliad", "the-odyssey"]
  portraitPlaceholder?: string;   // CSS gradient: "linear-gradient(135deg, #3B82F6, #1E40AF)"
}

export const AUTHORS: Author[] = [
  // ── ANCIENT ────────────────────────────────────────────────────────────────

  {
    id: "homer",
    name: "Homer",
    birthYear: -800,
    deathYear: -701,
    birthPlace: "Ionia, Ancient Greece (traditionally Chios or Smyrna)",
    nationality: "Greek",
    era: "Ancient",
    traditions: ["Ancient Greek"],
    bio: `Homer is the name ancient Greeks gave to the poet — or poets — who composed the Iliad and the Odyssey, two epics that stand at the very headwaters of Western literature. The "Homeric Question" has occupied scholars for over two centuries: whether a single blind bard named Homer was responsible for both poems, whether each has a different author, or whether both grew from generations of oral tradition before being written down around the 8th century BCE. What we can say with certainty is that the poems themselves are extraordinary achievements of the human imagination, shaped by the oral-formulaic tradition in which skilled bards memorized thousands of lines and recombined stock phrases — "rosy-fingered Dawn," "wine-dark sea," "swift-footed Achilles" — to compose epic poetry live before audiences.

The Iliad covers a narrow window near the end of the Trojan War and is, at its core, a devastating study of wrath. Achilles, the greatest warrior of the age, withdraws from battle after a quarrel with Agamemnon over honor and status. His choice — glory and early death versus a long obscure life — is the first great existential crisis in Western literature. But the poem does not celebrate war; it mourns it. The scenes between Achilles and the Trojan king Priam in the final book, where two enemies grieve together over irretrievable loss, remain among the most emotionally sophisticated passages ever written. The Odyssey is a different creature entirely — a story of homecoming (nostos), cunning over brute force, and the long patient work of reclaiming an identity. Odysseus's wanderings through lands of monsters and enchantresses read simultaneously as adventure, psychological allegory, and meditation on what it means to belong somewhere.

Together the poems defined the curriculum of ancient Greek education. Every literate Athenian had memorized large portions; Plato wrestled with Homer's authority even as he drew from him constantly. Alexander the Great slept with a copy of the Iliad under his pillow. Virgil, Dante, Milton, Joyce — the entire tradition of Western epic poetry is, in one way or another, a conversation with Homer.`,
    notableWorks: ["Iliad", "Odyssey"],
    themes: ["War and its costs", "Glory and mortality", "Homecoming", "Fate vs. free will", "Heroism", "Loyalty", "Divine intervention"],
    influence: "Homer is the foundational author of the entire Western literary tradition; every subsequent epic, from Virgil's Aeneid to Joyce's Ulysses, is in explicit dialogue with his work.",
    funFact: "The ancient Greeks so revered Homer that seven different cities claimed to be his birthplace, each hoping to secure the prestige.",
    quotes: [
      "Tell me, O muse, of that ingenious hero who travelled far and wide.",
      "Even his griefs are a joy long after to one that remembers all that he wrought.",
      "There is nothing more admirable than when two people see eye to eye.",
    ],
    bookAuthorNames: ["Homer"],
    worksInLibrary: ["the-iliad", "the-odyssey"],
    portraitPlaceholder: "linear-gradient(135deg, #1E3A8A, #1E40AF)",
  },

  {
    id: "sophocles",
    name: "Sophocles",
    birthYear: -496,
    deathYear: -406,
    birthPlace: "Colonus, near Athens, Ancient Greece",
    nationality: "Greek",
    era: "Ancient",
    traditions: ["Ancient Greek"],
    bio: `Sophocles lived through the full arc of Athens's golden age — he was born shortly before the Battle of Marathon and died just before Athens's final defeat in the Peloponnesian War — and his tragedies are inseparable from that context of civic greatness and impending catastrophe. He wrote approximately 123 plays, of which only seven survive complete, yet those seven include works that have never left the world stage. He won the City Dionysia festival at Athens at least eighteen times, defeating even Aeschylus in his first competition, and was never placed lower than second. Beyond his art, he served his city as a general and a diplomat; for Sophocles, the life of a citizen and the life of an artist were not separate vocations.

His central dramatic innovation was the introduction of a third actor (Aeschylus had used two), which allowed for far more complex human interaction on stage, and he also increased the chorus from twelve members to fifteen while diminishing its dominant role — shifting the weight of drama onto the characters themselves. This is precisely what makes Oedipus Rex feel so modern: its terror comes not from divine punishment but from the relentless logic of investigation, as Oedipus himself dismantles his own life in the act of seeking truth. Aristotle considered it the perfect tragedy in the Poetics, and Freud borrowed the plot to describe the most fundamental dynamic of human psychology. Antigone raises a political question that has never grown stale: when the law of the state conflicts with a higher moral duty, which obligation prevails?

Sophocles's dramatic world is one where human nobility and human limitation are inextricably bound together. His heroes are not simply punished for hubris in some mechanical way; they are undone by the very qualities — determination, intelligence, love — that make them great. The tragedy is not that they are bad, but that goodness itself is not enough to hold back suffering.`,
    notableWorks: ["Oedipus Rex", "Antigone", "Oedipus at Colonus", "Electra", "Ajax"],
    themes: ["Fate and free will", "Self-knowledge", "Civil vs. divine law", "Hubris", "Tragedy of the noble", "Family obligation", "The limits of intelligence"],
    influence: "Sophocles established the template for Western tragedy and gave Freud the central metaphor of psychoanalysis; his plays remain the most frequently performed classical dramas in the world.",
    funFact: "According to ancient sources, Sophocles was so beloved in Athens that the city postponed mourning and games during his death out of respect.",
    quotes: [
      "The greatest griefs are those we cause ourselves.",
      "To be doing good is man's most glorious task.",
      "Do nothing secretly; for Time sees and hears all things.",
    ],
    bookAuthorNames: ["Sophocles"],
    worksInLibrary: ["oedipus-rex", "antigone"],
    portraitPlaceholder: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
  },

  {
    id: "plato",
    name: "Plato",
    birthYear: -428,
    deathYear: -348,
    birthPlace: "Athens, Ancient Greece",
    nationality: "Greek",
    era: "Ancient",
    traditions: ["Ancient Greek"],
    bio: `Plato was born into an aristocratic Athenian family at a moment of supreme political crisis, came of age during the Peloponnesian War, and witnessed the trial and execution of his teacher Socrates in 399 BCE — an event that shaped everything he subsequently wrote. He founded the Academy in Athens around 387 BCE, arguably the first institution of higher learning in the Western world, and taught there for nearly four decades. His dialogues are the intellectual bedrock of Western philosophy: metaphysics, epistemology, political theory, aesthetics, ethics, philosophy of mind — every one of these disciplines traces its systematic origins to Plato, which is what prompted Alfred North Whitehead's famous remark that "the safest general characterization of the European philosophical tradition is that it consists of a series of footnotes to Plato."

What makes Plato extraordinary is that he chose drama as his philosophical medium. Rather than writing treatises, he wrote conversations — and the conversations are alive. Socrates is his chief interlocutor: ironic, self-deprecating, relentlessly probing, always claiming to know nothing while leading every discussion toward deeper truth. The Republic imagines an ideal state governed by philosopher-kings and introduces the Allegory of the Cave, one of the most powerful metaphors in intellectual history, in which prisoners mistake shadows on a wall for reality. The Symposium gathers a group of Athenian men at a dinner party to give competing speeches in praise of love, culminating in Socrates reporting the teachings of a wise woman named Diotima about love's ascent toward the Form of Beauty itself.

Plato's Theory of Forms — the idea that material objects are imperfect copies of eternal, perfect abstractions — has fascinated and frustrated philosophers ever since. His political thought is simultaneously visionary and troubling: the Republic that would produce the best citizens also requires censorship, a rigid class system, and the "noble lie." These tensions are features, not bugs; Plato's dialogues are designed to unsettle as much as to instruct.`,
    notableWorks: ["The Republic", "Symposium", "Phaedo", "The Apology", "Meno"],
    themes: ["The nature of justice", "The ideal state", "Love and beauty", "Knowledge vs. opinion", "The immortality of the soul", "The philosopher's duty", "Rhetoric vs. truth"],
    influence: "Plato's dialogues are the cornerstone of Western philosophy and theology; his concept of transcendent Forms shaped Christian Neoplatonism, and his political thought has fueled debates about democracy, education, and justice for two and a half millennia.",
    funFact: "\"Plato\" was likely a nickname meaning \"broad\" — possibly referring to his broad shoulders from his days as a wrestler.",
    quotes: [
      "The unexamined life is not worth living.",
      "At the touch of love, everyone becomes a poet.",
      "Wise men speak because they have something to say; fools because they have to say something.",
    ],
    bookAuthorNames: ["Plato"],
    worksInLibrary: ["the-republic", "symposium", "apology"],
    portraitPlaceholder: "linear-gradient(135deg, #1E40AF, #3B82F6)",
  },

  {
    id: "aristotle",
    name: "Aristotle",
    birthYear: -384,
    deathYear: -322,
    birthPlace: "Stagira, Macedonia, Ancient Greece",
    nationality: "Greek",
    era: "Ancient",
    traditions: ["Ancient Greek"],
    bio: `Aristotle arrived at Plato's Academy in Athens at seventeen and stayed for twenty years, first as a student and then as a teacher, until Plato's death. He was not merely Plato's student but also his most formidable critic — where Plato sought transcendent Forms beyond the material world, Aristotle insisted that truth was to be found in the careful observation of things as they actually are. He tutored the young Alexander the Great for three years, an arrangement that shaped both men; he then returned to Athens and founded his own school, the Lyceum, where he lectured while walking — giving rise to the term "Peripatetic" philosophy. His surviving works cover logic, biology, physics, metaphysics, ethics, politics, rhetoric, and poetics, and they amount to the first systematic organization of human knowledge.

The Nicomachean Ethics asks the question that underpins all of Aristotle's moral philosophy: what does it mean to live well? His answer centers on eudaimonia — usually translated as "happiness" but better rendered as "flourishing" — which he argues is achieved through the exercise of virtue in accordance with reason. Virtue itself, he maintains, is not a gift or a feeling but a habit: we become courageous by doing courageous things, just by doing just things, until right action becomes second nature. The Politics extends this analysis to the social sphere; his famous claim that "man is a political animal" means not that humans are combative but that we are, by nature, creatures who can only realize our full potential within a community ordered by law. The Poetics, fragmentary as it is, contains the most influential theory of literature ever written, including the concept of catharsis and the analysis of tragic structure that critics still invoke.

Medieval Islamic and Christian scholars — Averroes, Maimonides, Aquinas — treated Aristotle with such reverence that he was simply called "The Philosopher." His empirical approach to knowledge planted seeds that would flower, centuries later, in the Scientific Revolution.`,
    notableWorks: ["Nicomachean Ethics", "Poetics", "Politics", "Metaphysics", "On the Soul"],
    themes: ["Virtue and character", "Human flourishing", "The good life", "Form and matter", "Logic and reasoning", "The nature of tragedy", "Community and politics"],
    influence: "Aristotle's thought dominated Western intellectual life for nearly two millennia; his logical works shaped medieval scholasticism, his biological observations were unsurpassed until Darwin, and the Poetics remains the starting point for any serious study of literary form.",
    funFact: "Aristotle described the octopus with such anatomical accuracy in his History of Animals that marine biologists were still citing his observations in the 19th century.",
    quotes: [
      "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
      "The whole is greater than the sum of its parts.",
      "It is the mark of an educated mind to be able to entertain a thought without accepting it.",
    ],
    bookAuthorNames: ["Aristotle"],
    worksInLibrary: ["nicomachean-ethics"],
    portraitPlaceholder: "linear-gradient(135deg, #1D4ED8, #6366F1)",
  },

  {
    id: "virgil",
    name: "Virgil",
    fullName: "Publius Vergilius Maro",
    birthYear: -70,
    deathYear: -19,
    birthPlace: "Andes, near Mantua, Roman Republic (present-day Italy)",
    nationality: "Roman",
    era: "Ancient",
    traditions: ["Roman"],
    bio: `Virgil was born on the 15th of October, 70 BCE, in a small village near Mantua in what was then the Cisalpine region of the Roman Republic. He came of age during the catastrophic civil wars that tore Rome apart following the assassination of Julius Caesar, and all his major works are shaped by his desperate longing for — and measured hope in — a restored age of peace and order. Augustus Caesar recognized in Virgil the poet who could give his new imperial order not just propaganda but myth; the result was the Aeneid, an epic that took eleven years to compose and that Virgil considered unfinished when he died. He reportedly asked his literary executors to burn the manuscript, but Augustus intervened to ensure its preservation — one of the luckiest acts of literary patronage in history.

The Eclogues, Virgil's earliest major work, are ten short pastoral poems modeled on the Greek poet Theocritus but charged with contemporary political urgency — several deal obliquely with the forced confiscations of farmland to reward Caesar's veterans. The Georgics, four books on farming, beekeeping, and animal husbandry, are at once a practical manual, a meditation on human labor, and a dirge for the Italian landscape. But it is the Aeneid that secured Virgil's immortality: the story of Aeneas, a Trojan prince who flees the sack of Troy carrying his aged father on his back, wanders the Mediterranean, suffers a tragic love affair with the Carthaginian queen Dido, descends to the underworld to receive a prophetic vision of Rome's future greatness, and ultimately founds the line that will lead to Rome itself.

The Aeneid is the most consciously allusive poem ever written — almost every line echoes Homer — but Virgil uses his Homeric model to ask genuinely new questions: what does imperial destiny cost in human terms? Aeneas must suppress his desires, abandon love, kill a defeated enemy, and subordinate his entire personality to a political mission he did not choose. Dante's choice of Virgil as his guide through Hell and Purgatory in the Divine Comedy is not merely a tribute to a great predecessor; it reflects the medieval sense that Virgil's fourth Eclogue, with its prophecy of a miraculous birth ushering in a new golden age, had made him a proto-Christian prophet.`,
    notableWorks: ["Aeneid", "Georgics", "Eclogues"],
    themes: ["Duty (pietas) vs. desire", "The cost of empire", "Fate and human agency", "Founding myths", "War and peace", "Pastoral idealism", "Grief and exile"],
    influence: "Virgil is the supreme poet of the Latin West; the Aeneid defined Roman identity and became the central text of medieval European education, and his influence pervades Dante, Milton, and the entire tradition of epic poetry.",
    funFact: "Virgil was famously shy and reclusive; Neapolitan crowds who recognized him in the street would reportedly stand and stare as if he were a celebrity spectacle.",
    quotes: [
      "Fortune favors the bold.",
      "Love conquers all things; let us too surrender to Love.",
      "They can because they think they can.",
    ],
    virgilNote: "This is the historical Virgil — Publius Vergilius Maro — whose Aeneid Dante knew almost by heart. Dante chose him as his guide through Hell and Purgatorio in the Divine Comedy because Virgil represented the highest achievement of human reason and poetry without the light of Christian revelation. For Dante, Virgil was not merely a great poet but a spiritual predecessor: his famous fourth Eclogue, which prophecies the birth of a miraculous child who will inaugurate a golden age, was widely interpreted in the Middle Ages as an unwitting forecast of the coming of Christ.",
    bookAuthorNames: ["Virgil", "Vergil", "Publius Vergilius Maro"],
    worksInLibrary: ["the-aeneid"],
    portraitPlaceholder: "linear-gradient(135deg, #7F1D1D, #991B1B)",
  },

  {
    id: "ovid",
    name: "Ovid",
    fullName: "Publius Ovidius Naso",
    birthYear: -43,
    deathYear: 18,
    birthPlace: "Sulmo, Roman Republic (present-day Sulmona, Italy)",
    nationality: "Roman",
    era: "Ancient",
    traditions: ["Roman"],
    bio: `Ovid was born in 43 BCE, the year after Julius Caesar's assassination, and came of age in Augustus's newly stabilized Rome — a world of literary salons, aristocratic love affairs, and sophisticated urban leisure. Unlike Virgil and Horace, who were shaped by the trauma of civil war and responded with patriotic gravity, Ovid never knew the chaos and wrote from a position of cheerful urban privilege. His early love poetry — the Amores, the Ars Amatoria — is witty, transgressive, and explicitly erotic: a kind of rule-book for seduction that treats love as a game and women as equally cunning players. Augustus eventually exiled him to Tomis on the Black Sea coast, a barbaric outpost at the edge of the Roman world, ostensibly because of a "poem and a mistake." The poem was almost certainly the Ars Amatoria; the "mistake" has never been satisfactorily explained, though it likely involved some proximity to the scandal around the emperor's granddaughter Julia.

The Metamorphoses, completed just before his exile in 8 CE, is Ovid's masterpiece and one of the most influential books ever written. It is a continuous poem of fifteen books tracing the history of the world from creation to Julius Caesar's apotheosis, unified by a single theme: transformation. Everything changes, nothing is permanent — lovers become trees, warriors become birds, gods take human form, humans achieve starry immortality. The 250-odd myths Ovid weaves together are told with an ironic brilliance that is utterly unlike Virgil's gravitas: the gods are petty, the heroes are often ridiculous, and the most devastating transformations are psychological as much as physical. Ovid's Narcissus is the first great literary portrait of self-obsession; his Medea is a chilling study in wounded pride.

From the exile at Tomis, Ovid sent back despairing letters — the Tristia and Ex Ponto — begging Augustus and then Tiberius for recall. It never came; he died on the Black Sea in 17 or 18 CE. But his Metamorphoses survived to become the primary source through which medieval and Renaissance Europe learned classical mythology. Shakespeare, Chaucer, Dante, Titian, Botticelli, Bernini — the entire cultural tradition draws on Ovid for its mythological raw material.`,
    notableWorks: ["Metamorphoses", "Ars Amatoria", "Amores", "Tristia", "Heroides"],
    themes: ["Transformation and change", "Love and desire", "Power and its abuse", "Exile and loss", "Irony and wit", "Myth and meaning", "The instability of identity"],
    influence: "The Metamorphoses is the single most important source of classical mythology for Western art and literature; Shakespeare drew from it in nearly every play, and it shaped the visual culture of the Renaissance as profoundly as any painting.",
    funFact: "Ovid is the only major Roman poet whose exile was orchestrated by the emperor himself — a sign of just how threatening erotic poetry could be to a regime invested in moral reform.",
    quotes: [
      "Dripping water hollows out stone, not through force but through persistence.",
      "Whether you call my work poetry or not, it's the only thing keeping me sane.",
      "Love is a thing that is full of cares and fears.",
    ],
    bookAuthorNames: ["Ovid", "Publius Ovidius Naso"],
    worksInLibrary: ["metamorphoses"],
    portraitPlaceholder: "linear-gradient(135deg, #991B1B, #DC2626)",
  },

  // ── MEDIEVAL ───────────────────────────────────────────────────────────────

  {
    id: "dante-alighieri",
    name: "Dante Alighieri",
    birthYear: 1265,
    deathYear: 1321,
    birthPlace: "Florence, Republic of Florence (present-day Italy)",
    nationality: "Italian",
    era: "Medieval",
    traditions: ["Medieval European"],
    bio: `Dante Alighieri was born in Florence in 1265 into a moderately noble family and received a thorough education in the liberal arts and Scholastic theology. His life was defined by two catastrophic experiences: the death of Beatrice Portinari in 1290, the woman he had loved from a distance since childhood and whom he would transform into a symbol of divine grace and redemptive love; and his political exile from Florence in 1302, when the Black Guelf faction — supported by Pope Boniface VIII — seized power and condemned him, then absent on a diplomatic mission to Rome, to permanent banishment and eventual death if he returned. He never returned. He spent the last nineteen years of his life moving between the courts of northern Italy, working on the vast poem that would justify his existence and his suffering.

The Divine Comedy — which Dante called simply the Commedia, the "divine" being added by later admirers — is the supreme literary achievement of the Middle Ages and one of the most ambitious works of art ever conceived. It is simultaneously a theological treatise, a political polemic, a love poem, a work of autobiography, and an encyclopedia of medieval knowledge organized as a journey through Hell (Inferno), Purgatory (Purgatorio), and Heaven (Paradiso). Dante moves through these realms accompanied first by the Roman poet Virgil, then by Beatrice herself. The Inferno is the most read section, and rightly so: its topography of sinners arranged in graduated circles according to the nature of their transgression, each enduring a punishment that mirrors their crime, is one of the most morally imaginative structures in all of literature. But the Paradiso, harder and more radiant, is where Dante's deepest aspirations are expressed — a space of pure light and love where the soul finally apprehends God directly.

Dante wrote the Comedy in Tuscan vernacular rather than Latin, a choice that was itself a political and aesthetic manifesto. He wanted to reach readers beyond the clerically educated, and his poem effectively elevated Tuscan into the literary Italian language. His impact on Italian culture is comparable to Shakespeare's on English; the poet Alessandro Manzoni called him "the father of the Italian language."`,
    notableWorks: ["Divine Comedy (Inferno, Purgatorio, Paradiso)", "La Vita Nuova", "De Monarchia", "Convivio"],
    themes: ["Sin and redemption", "Divine love", "Political justice", "The nature of the afterlife", "Exile and longing", "Faith and reason", "The soul's journey to God"],
    influence: "Dante's Divine Comedy is the defining monument of medieval European literature, the foundation of literary Italian, and a touchstone for every subsequent Western poet who has tried to give artistic form to the deepest moral and spiritual questions.",
    funFact: "Dante placed his political enemies — including living popes — in Hell while still very much alive, effectively writing prophetic damnations; Pope Boniface VIII, Dante's great enemy, is assigned to Hell even though he was still alive when the Inferno was composed.",
    quotes: [
      "Abandon all hope, ye who enter here.",
      "The love that moves the sun and the other stars.",
      "There is no greater sorrow than to recall happiness in times of misery.",
    ],
    virgilNote: "Virgil is Dante's guide through Hell and Purgatory in the Divine Comedy. Dante chose the Roman poet deliberately and reverently: Virgil represented the pinnacle of human wisdom and poetic achievement attainable by reason alone, without the light of Christian faith. In Dante's theology, Virgil's soul dwells in Limbo — neither punished nor blessed — because he lived before Christ. His presence as guide is both a tribute to Virgil's greatness and a meditation on the limits of pagan wisdom. Dante had absorbed the Aeneid so thoroughly that it permeates the Comedy at the level of imagery, structure, and emotional register.",
    bookAuthorNames: ["Dante Alighieri", "Dante"],
    worksInLibrary: ["inferno", "purgatorio", "paradiso"],
    portraitPlaceholder: "linear-gradient(135deg, #78350F, #92400E)",
  },

  {
    id: "geoffrey-chaucer",
    name: "Geoffrey Chaucer",
    birthYear: 1343,
    deathYear: 1400,
    birthPlace: "London, England",
    nationality: "English",
    era: "Medieval",
    traditions: ["Medieval European"],
    bio: `Geoffrey Chaucer was a customs official, royal messenger, Member of Parliament, and occasional diplomat who happened to also be the greatest English poet of the Middle Ages. He was born around 1343 in London, the son of a wine merchant, and spent his career in the service of the English crown — traveling to France and Italy on royal business, witnessing the turbulent reigns of Edward III and Richard II, and surviving the political upheavals that swirled around him while steadily producing, in his spare moments, a body of poetry that transformed what English literature could be. His Italian trips brought him into contact with the work of Dante, Petrarch, and Boccaccio, and the influence of all three is visible in his mature writing.

The Canterbury Tales, left unfinished at his death, is his supreme achievement: a collection of stories told by a group of pilgrims traveling from London to the shrine of Thomas Becket at Canterbury. The frame device, borrowed from Boccaccio's Decameron, is simple enough, but what Chaucer does within it is startling. He creates a cross-section of medieval English society — a Knight, a Miller, a Wife of Bath, a Pardoner, a Prioress, a Cook — and gives each a voice, a vocabulary, a set of values, and a story shaped by who they are. The Knight's Tale is courtly romance; the Miller's Tale is bawdy farce; the Nun's Priest's Tale is mock-heroic beast fable; the Wife of Bath's Prologue is one of the most vivid and sympathetic portrayals of female experience in medieval literature. The range of styles and genres within a single work is astonishing.

Chaucer wrote in Middle English at a moment when English was not the prestige language of the English court — that was French — and Latin was the language of learning. His choice to take vernacular English seriously as a medium for sophisticated poetry was a cultural act of enormous consequence. He developed an elaborate stanzaic form, rhyme royal, and introduced iambic pentameter to English verse. The "Father of English Literature" is a cliché, but it is accurate: the history of English poetry begins with Chaucer.`,
    notableWorks: ["The Canterbury Tales", "Troilus and Criseyde", "The Book of the Duchess", "Parliament of Fowls"],
    themes: ["Class and social hierarchy", "Love and marriage", "Religious hypocrisy", "Fortune and fate", "Storytelling itself", "Gender and power", "The earthly vs. the divine"],
    influence: "Chaucer established English as a serious literary language and invented the narrative and prosodic forms that shaped English poetry for centuries; Shakespeare and Spenser both treated him as the founding father of their tradition.",
    funFact: "In 1380 Chaucer was party to a legal document in which a woman released him from claims arising from a \"raptus\" — a term whose ambiguous meaning (abduction or rape) has been debated by Chaucer scholars for decades.",
    quotes: [
      "The life so short, the craft so long to learn.",
      "Time and tide wait for no man.",
      "Trouthe is the hyeste thing that man may kepe.",
    ],
    bookAuthorNames: ["Geoffrey Chaucer", "Chaucer"],
    worksInLibrary: ["the-canterbury-tales"],
    portraitPlaceholder: "linear-gradient(135deg, #92400E, #B45309)",
  },

  {
    id: "rumi",
    name: "Rumi",
    fullName: "Jalāl al-Dīn Muḥammad Rūmī",
    birthYear: 1207,
    deathYear: 1273,
    birthPlace: "Wakhsh, Khurasan (present-day Tajikistan/Afghanistan)",
    nationality: "Persian",
    era: "Medieval",
    traditions: ["Eastern"],
    bio: `Jalāl al-Dīn Rūmī was born in 1207 in Wakhsh, a town in the region of Khurasan in the eastern Iranian world — an area that is now divided between Afghanistan and Tajikistan. His family fled westward ahead of the Mongol invasions when he was still a child, eventually settling in Konya, in present-day Turkey, where his father became a renowned religious teacher. Rumi was trained in Islamic jurisprudence, theology, and Sufi mysticism, and by his thirties he was an established scholar and teacher in Konya. Then, in 1244, he encountered a wandering dervish named Shams-i-Tabrizi, and everything changed. The intensity of his intellectual and spiritual friendship with Shams triggered an outpouring of lyric poetry unlike anything in the Persian tradition. When Shams mysteriously disappeared — possibly murdered by jealous disciples — Rumi's grief became the engine of his greatest work.

The Masnavi (or Mathnawi), composed in the final years of his life, is a six-volume rhyming poem of roughly 25,000 couplets that weaves together Sufi mystical teaching with parables, anecdotes from the Quran and Hadith, folk tales, and philosophical digressions. It begins with the famous reed flute allegory: the ney (reed flute) cries because it has been cut from the reed bed, and its cry is the longing of the soul separated from its divine origin. This image of separation, longing, and the desire for reunion — with God, with the beloved, with one's deepest self — runs through all of Rumi's poetry. The Divan-e Shams-e Tabrizi (Divan of Shams), named for his lost companion, is an enormous collection of ghazals and quatrains written in a state of mystical intoxication: love lyrics in which the beloved is simultaneously the human Shams and the divine absolute.

Rumi's influence on Persian and Turkish literature was immense, and he founded the Mevlevi Sufi order — the "Whirling Dervishes" — whose spinning meditation practice embodies his vision of the soul turning in longing toward God. In recent decades he has become the best-selling poet in the United States, though the translations most widely read there are extremely loose paraphrases rather than faithful renderings. The real Rumi is more philosophically dense and doctrinally Islamic than the greeting-card spirituality that bears his name — but the underlying themes of love, longing, and the divine within the human have clearly struck a universal chord.`,
    notableWorks: ["Masnavi (Mathnawi)", "Divan-e Shams-e Tabrizi", "Fihi Ma Fihi"],
    themes: ["Divine love and longing", "The soul's separation from God", "Sufi mysticism", "Joy in suffering", "Unity of existence", "The transformative power of music", "Inner spiritual journey"],
    influence: "Rumi is the most widely read poet in the Persian-speaking world and, in loose translation, one of the best-selling poets in North America; his Mevlevi order introduced whirling meditation to world spiritual practice.",
    funFact: "When Rumi died in 1273, his funeral was attended by representatives of all three Abrahamic faiths — Christians, Jews, and Muslims — a testament to his reputation for transcending sectarian boundaries.",
    quotes: [
      "Out beyond ideas of wrongdoing and rightdoing there is a field. I'll meet you there.",
      "The wound is the place where the Light enters you.",
      "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.",
    ],
    bookAuthorNames: ["Rumi", "Jalal al-Din Rumi", "Jalāl al-Dīn Rūmī", "Mevlana Rumi"],
    worksInLibrary: ["the-masnavi"],
    portraitPlaceholder: "linear-gradient(135deg, #7C2D12, #B45309)",
  },

  // ── RENAISSANCE / EARLY MODERN ─────────────────────────────────────────────

  {
    id: "william-shakespeare",
    name: "William Shakespeare",
    birthYear: 1564,
    deathYear: 1616,
    birthPlace: "Stratford-upon-Avon, Warwickshire, England",
    nationality: "English",
    era: "Renaissance",
    traditions: ["Renaissance"],
    bio: `William Shakespeare was born in Stratford-upon-Avon in April 1564, the son of a glove-maker and alderman, attended the local grammar school (which would have given him a solid grounding in Latin and classical rhetoric), married Anne Hathaway at eighteen, had three children, and then — sometime in the late 1580s — moved to London and became an actor and playwright. The biographical record is thin enough that anti-Stratfordians have argued, without convincing scholars, that he never existed or was a front for someone else. But the plays are real, and they were produced by a working professional in a commercial theater company, the Lord Chamberlain's Men (later the King's Men), who performed at the Globe Theatre on Bankside. Shakespeare wrote approximately 37 plays, 154 sonnets, and several long narrative poems between roughly 1590 and 1613.

What makes Shakespeare singular is not merely the quality of individual works but the sheer range of his imagination. The histories (Richard II, Henry IV Parts 1 and 2, Henry V) explore power, legitimacy, and the education of a king. The comedies (A Midsummer Night's Dream, Much Ado About Nothing, Twelfth Night) are not simply funny; they probe identity, desire, and the strange permissiveness of festive space. The tragedies are the summit of Western drama: Hamlet's paralysis before a corrupt world, Othello's manufactured jealousy, Lear's catastrophic self-dispossession, Macbeth's discovery that ambition is a form of suicide. The late romances (The Tempest, The Winter's Tale) circle back to loss and improbable recovery with the tone of a man who has seen everything and forgiven most of it. He also invented or popularized hundreds of English words and phrases still in common use.

The Sonnets, published in 1609, present a different, more intimate Shakespeare: 126 poems addressed to a mysterious young man, the "Fair Youth," and 28 to a "Dark Lady," together mapping a triangle of admiration, desire, rivalry, and reproach that has absorbed readers ever since. Whether they are autobiographical, fictional, or some mixture remains irresolvably open — which is itself very Shakespearean. He retired to Stratford around 1613 and died in 1616, leaving half his estate to his daughter Susanna and, famously, his second-best bed to his wife.`,
    notableWorks: ["Hamlet", "King Lear", "Macbeth", "A Midsummer Night's Dream", "The Tempest", "Sonnets"],
    themes: ["Power and corruption", "Appearance vs. reality", "Jealousy and betrayal", "Love in its many forms", "Identity and disguise", "Mortality and the tragic", "Language and performance"],
    influence: "Shakespeare is universally regarded as the greatest writer in the English language; he shaped the development of modern English, invented psychological complexity in literary character, and his plays have been performed continuously for four centuries on every continent.",
    funFact: "Shakespeare's famously thin biographical record includes one document from his Stratford years recording a complaint about him hoarding grain during a local shortage — suggesting that even great poets had to worry about the harvest.",
    quotes: [
      "To be or not to be, that is the question.",
      "All the world's a stage, and all the men and women merely players.",
      "We know what we are, but know not what we may be.",
    ],
    bookAuthorNames: ["William Shakespeare", "Shakespeare"],
    worksInLibrary: ["hamlet", "macbeth", "othello", "the-tempest"],
    portraitPlaceholder: "linear-gradient(135deg, #1C1917, #292524)",
  },

  {
    id: "miguel-de-cervantes",
    name: "Miguel de Cervantes",
    fullName: "Miguel de Cervantes Saavedra",
    birthYear: 1547,
    deathYear: 1616,
    birthPlace: "Alcalá de Henares, Crown of Castile (present-day Spain)",
    nationality: "Spanish",
    era: "Renaissance",
    traditions: ["Renaissance"],
    bio: `Miguel de Cervantes had one of the most eventful lives in literary history, and much of it was catastrophic. Born in 1547 in Alcalá de Henares, he served as a soldier at the Battle of Lepanto in 1571, where he was shot three times — twice in the chest and once in the left hand, which was permanently maimed — and which he later called "the finest occasion that past or future ages have seen." While sailing home to Spain in 1575, he was captured by Barbary pirates and spent five years as a slave in Algiers before being ransomed. Back in Spain, he worked as a tax collector, was repeatedly imprisoned (at least once falsely), and lived in poverty for most of his life. By the time Don Quixote appeared in 1605, Cervantes was fifty-eight years old and had achieved nothing of lasting note.

Don Quixote de la Mancha is simultaneously the first modern novel and a parody of the chivalric romances that had flooded the Spanish book market in the preceding century. An aging gentleman from La Mancha has read so many tales of knights, ladies, giants, and enchantments that he loses his grip on reality and sets out on horseback, with a neighbor named Sancho Panza as his squire, to enact the adventures he has read about. The joke is that the "giants" are windmills and the "castles" are inns — but Cervantes does something far more sophisticated than mere parody. Don Quixote develops genuine dignity through his delusions; Sancho, initially a cynical peasant, is gradually infected by his master's idealism; and the novel's second part (1615) grows self-referential and philosophically vertiginous, with characters who have read the first part confronting the protagonist and debating whether he is real. The question of whether noble illusion or harsh reality is preferable, and whether literature makes us more or less able to live in the world, is never resolved.

Cervantes died in Madrid on April 22, 1616 — within days of Shakespeare's death in Stratford. He died poor and largely unrecognized; within decades his novel would be recognized as one of the greatest ever written, and it is frequently voted the most important work of world literature in polls of international writers.`,
    notableWorks: ["Don Quixote", "Novelas Ejemplares", "La Galatea", "Los trabajos de Persiles y Sigismunda"],
    themes: ["Illusion vs. reality", "The power of literature", "Idealism and practicality", "Identity and madness", "Social class", "Honor and dignity", "The nature of fiction"],
    influence: "Don Quixote is widely considered the first modern novel and the most influential work of prose fiction ever written; it established the novel form's capacity for irony, self-reflection, and psychological depth.",
    funFact: "Cervantes and Shakespeare died within days of each other in April 1616 — though the two countries used different calendar systems, so the dates don't precisely align — prompting literary historians to speak of a remarkable generational passing.",
    quotes: [
      "Too much sanity may be madness, and the maddest of all is to see life as it is rather than as it should be.",
      "Never stand begging for that which you have the power to earn.",
      "The pen is the tongue of the mind.",
    ],
    bookAuthorNames: ["Miguel de Cervantes", "Cervantes", "Miguel de Cervantes Saavedra"],
    worksInLibrary: ["don-quixote"],
    portraitPlaceholder: "linear-gradient(135deg, #292524, #44403C)",
  },

  {
    id: "john-milton",
    name: "John Milton",
    birthYear: 1608,
    deathYear: 1674,
    birthPlace: "London, England",
    nationality: "English",
    era: "Renaissance",
    traditions: ["Renaissance"],
    bio: `John Milton was a man of daunting erudition, fierce political convictions, and iron moral purpose. Born in London in 1608, he was educated at Cambridge, spent six years after graduation in private reading and study at his father's house in preparation for a great literary career, and then — after meeting Galileo in Florence in 1638 — was pulled by the English Civil War into two decades of political pamphleteering on behalf of the Parliamentary and Puritan cause. He served as Secretary for Foreign Tongues under Oliver Cromwell, defending the execution of Charles I in Latin texts addressed to a European audience. When the monarchy was restored in 1660, Milton was briefly imprisoned, lost much of his fortune, and — having been going blind since the early 1650s, almost certainly from glaucoma — was by this point completely sightless. He composed Paradise Lost by dictating it to secretaries and to his daughters, in a small house in Bunhill Fields, completing it by 1665.

Paradise Lost is the last great attempt to write a classical epic in English and the most ambitious work of religious poetry in the language. Its subject is nothing less than the Fall of Man: Satan's rebellion in Heaven, his expulsion with the other fallen angels into Hell, his journey through Chaos to the newly created Earth, his temptation of Eve and Adam in the Garden of Eden, and their loss of Paradise. Milton draws on Virgil, Homer, and the entire classical tradition while insisting on the superiority of his "higher argument" — Christian redemption — to any pagan subject. What he did not entirely intend, and what William Blake, Percy Bysshe Shelley, and Philip Pullman have all argued, is that Satan emerges as the poem's most compelling character: magnificent in his defiance, convinced of his own nobility, devastated by his own corruption. "Better to reign in Hell than serve in Heaven" is simultaneously a statement Milton intends us to recognize as damnable and one that readers have found disturbingly attractive.

Milton had enormous influence on the political as well as literary imagination of subsequent centuries. Areopagitica (1644), his argument against prior censorship, is the founding text of Anglo-American free speech theory. Paradise Regained and Samson Agonistes, both published in 1671, are tighter, harsher works in which the themes of trial, temptation, and spiritual endurance are revisited through the figures of Christ in the desert and the blinded captive Samson — a figure with whom the blind, defeated Milton clearly identified.`,
    notableWorks: ["Paradise Lost", "Paradise Regained", "Samson Agonistes", "Areopagitica", "Lycidas"],
    themes: ["Free will and obedience", "The nature of evil", "The Fall and redemption", "Political freedom", "Temptation and choice", "Blindness and inner vision", "Epic ambition"],
    influence: "Paradise Lost is the supreme achievement of English epic poetry and one of the most theologically and politically consequential poems ever written; Milton's Satan became the template for every subsequent literary figure of rebel grandeur.",
    funFact: "Milton dictated Paradise Lost — 10,565 lines of blank verse — to secretaries and family members after going completely blind, reportedly composing in his head overnight and then dictating in the morning.",
    quotes: [
      "The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.",
      "Give me the liberty to know, to utter, and to argue freely according to conscience, above all liberties.",
      "Long is the way and hard, that out of Hell leads up to light.",
    ],
    virgilNote: "Milton explicitly models Paradise Lost on the Aeneid, opening with a formal invocation of his Muse as Virgil invokes his, and throughout the epic he uses Virgilian epic machinery — the journey through Hell, the prophetic vision of future history — while insisting that his subject surpasses Virgil's in grandeur. The debate between Belial, Moloch, and Beelzebub in Hell's council echoes Virgil's underworld scenes; Satan's epic similes consistently recall Aeneas. Milton's admiration for Virgil was combined with a Protestant need to supersede him.",
    bookAuthorNames: ["John Milton", "Milton"],
    worksInLibrary: ["paradise-lost"],
    portraitPlaceholder: "linear-gradient(135deg, #292524, #1C1917)",
  },

  // ── ENLIGHTENMENT ──────────────────────────────────────────────────────────

  {
    id: "voltaire",
    name: "Voltaire",
    fullName: "François-Marie Arouet",
    birthYear: 1694,
    deathYear: 1778,
    birthPlace: "Paris, France",
    nationality: "French",
    era: "Enlightenment",
    traditions: ["Enlightenment", "French"],
    bio: `Voltaire — the pen name of François-Marie Arouet — was the most celebrated and dangerous writer of the French Enlightenment: a man whose wit could make absolute monarchs nervous and whose campaigning on behalf of victims of religious persecution helped lay the moral groundwork for the French Revolution, which broke out eleven years after his death. Born in Paris in 1694, he was educated by the Jesuits, then spent his twenties accumulating literary fame, aristocratic enemies, and two stints in the Bastille. An altercation with the Chevalier de Rohan led to his exile in England from 1726 to 1729, where he encountered the works of Locke and Newton and the practice of English religious toleration — all of which he imported to France in his Lettres philosophiques (1733), a book so radical that it was publicly burned.

Voltaire's productivity was staggering: plays, poems, history, philosophical tales, correspondence (over 20,000 surviving letters), and the massive Dictionnaire philosophique. But the work that has survived best is Candide (1759), a satirical novella written in a few days as an immediate response to the Lisbon earthquake of 1755 and to the philosophical optimism of Leibniz, which had argued that we live in "the best of all possible worlds." Candide, a naïve young man, travels through a world of earthquake, shipwreck, Inquisition, war, slavery, and casual cruelty in the company of the philosopher Dr. Pangloss, who continues to assert Leibnizian optimism in the face of each catastrophe. The satire is so perfectly calibrated — deadpan, relentless, and formally elegant — that it makes the suffering land with the force of argument rather than sentiment.

Voltaire spent the last years of his life at his estate at Ferney, near the Swiss border, where he was effectively beyond the reach of French censorship. From there he conducted a series of famous interventions in judicial scandals involving Protestant victims of Catholic bigotry — the Calas affair, the Sirven affair — and became the prototype of the modern intellectual as public advocate. His final triumph was returning to Paris in 1778 to see the premiere of his last play; the ovation was so overwhelming it may have contributed to his death. The phrase most associated with him — "cultivate your garden" — is the anticlimactic conclusion of Candide, but its meaning is not quietism; it is the insistence on practical, local, improvable action in the face of a world that cannot be philosophically redeemed.`,
    notableWorks: ["Candide", "Zadig", "Lettres philosophiques", "Dictionnaire philosophique", "L'Ingénu"],
    themes: ["Religious intolerance", "Philosophical optimism vs. harsh reality", "Political tyranny", "The absurdity of war", "Practical action vs. grand theory", "Freedom of thought", "Social satire"],
    influence: "Voltaire is the defining figure of Enlightenment satire and religious criticism; his campaigns against judicial persecution established the template for modern intellectual advocacy, and Candide remains the most perfectly constructed philosophical satire in Western literature.",
    funFact: "Voltaire drank between 40 and 50 cups of coffee a day and reportedly defended the habit to his doctor by pointing to the fact that he had been doing it for seventy years.",
    quotes: [
      "We must cultivate our garden.",
      "God is a comedian playing to an audience afraid to laugh.",
      "I disapprove of what you say, but I will defend to the death your right to say it.",
    ],
    bookAuthorNames: ["Voltaire", "François-Marie Arouet"],
    worksInLibrary: ["candide"],
    portraitPlaceholder: "linear-gradient(135deg, #164E63, #0E7490)",
  },

  {
    id: "jonathan-swift",
    name: "Jonathan Swift",
    birthYear: 1667,
    deathYear: 1745,
    birthPlace: "Dublin, Ireland",
    nationality: "Irish",
    era: "Enlightenment",
    traditions: ["Enlightenment"],
    bio: `Jonathan Swift was born in Dublin in 1667, the posthumous son of an English father who had come to Ireland as a lawyer, and he spent most of his life caught between two worlds — an Irishman in England, an Englishman in Ireland, a churchman who spent much of his energy on secular satire, a misanthrope capable of deep tenderness toward particular individuals. He was ordained as an Anglican priest in 1695 and eventually became Dean of St. Patrick's Cathedral in Dublin, a position of respectable clerical comfort that also gave him a platform from which to champion the cause of Irish economic independence. His Drapier's Letters (1724), written in the persona of a Dublin draper, successfully organized public resistance to a corrupt English currency scheme and made Swift a national hero in Ireland.

Gulliver's Travels (1726), published under the pseudonym "Lemuel Gulliver," is the most savage and multi-layered satirical work in English literature. On its surface it is an adventure story in the mode of the popular travel narratives of its day; beneath that, it is a systematic anatomization of human folly, pride, and political corruption. In Lilliput, England and France are mocked through their miniature equivalents — wars fought over the proper end from which to open an egg, political advancement gained by rope-dancing. In Brobdingnag, Gulliver is the tiny one, and the giant king's conclusion that European politicians are "the most pernicious race of little odious vermin that nature ever suffered to crawl upon the surface of the earth" registers as considered judgment rather than rage. The fourth voyage, to the land of the Houyhnhnms (rational horses) and the Yahoos (degraded humans), is the culmination of Swift's misanthropy: the Yahoos are recognizably us, in all our greed, filth, and political savagery.

Swift's other masterpiece, "A Modest Proposal" (1729), is a short essay proposing that Irish babies be raised and sold as food for the English landlord class — a solution to Irish poverty so logically argued in the manner of Enlightenment economic discourse that early readers were sometimes genuinely uncertain whether it was a joke. It is the most perfect piece of irony in English prose, and it works because Swift's fury at English exploitation of Ireland is so cold and controlled.`,
    notableWorks: ["Gulliver's Travels", "A Modest Proposal", "A Tale of a Tub", "Drapier's Letters", "The Battle of the Books"],
    themes: ["Political corruption", "Human pride and folly", "Colonialism and exploitation", "The misuse of reason", "Religion and hypocrisy", "The limits of rationalism", "Satire as moral correction"],
    influence: "Swift is the master of English irony and the patron saint of political satire; Gulliver's Travels established the form of the satirical utopian/dystopian voyage that runs from Voltaire through Orwell to the present day.",
    funFact: "Swift left the bulk of his estate to found a hospital for 'fools and mad' people in Dublin — St. Patrick's Hospital, still operating — prompting his own ironic epitaph that Ireland could spare enough money to endow a home for lunatics because 'no nation needed it so much.'",
    quotes: [
      "Vision is the art of seeing what is invisible to others.",
      "May you live all the days of your life.",
      "Satire is a sort of glass wherein beholders do generally discover everybody's face but their own.",
    ],
    bookAuthorNames: ["Jonathan Swift", "Swift"],
    worksInLibrary: ["gullivers-travels"],
    portraitPlaceholder: "linear-gradient(135deg, #0E7490, #0891B2)",
  },

  // ── 19TH CENTURY ───────────────────────────────────────────────────────────

  {
    id: "jane-austen",
    name: "Jane Austen",
    birthYear: 1775,
    deathYear: 1817,
    birthPlace: "Steventon, Hampshire, England",
    nationality: "English",
    era: "19th Century",
    traditions: ["Romantic"],
    bio: `Jane Austen was born in 1775 in a Hampshire rectory, the seventh of eight children of a country clergyman and his wife, and she lived and died within a narrow geographic and social world — the villages, drawing rooms, and country houses of southern England's gentry class. She never married, traveled little, held no public office, and published her novels anonymously ("By a Lady"). By the conventions of her time, her life appears to be nothing but limitation. Her novels, however, are the most precise and psychologically penetrating studies of social life in the English language, and they were produced, according to family legend, on small pieces of paper that could be hidden under a blotter when visitors arrived.

The six completed novels — Sense and Sensibility, Pride and Prejudice, Mansfield Park, Emma, Northanger Abbey, and Persuasion — are comedy in the deepest classical sense: stories of young women negotiating the social machinery of matrimony who nonetheless arrive at matches that are genuinely based on understanding and mutual respect. But the surface comedy conceals structural ironies of extraordinary subtlety. Austen's free indirect discourse — the technique of narrating from inside a character's consciousness without using first-person, so that the narrative voice is contaminated by the character's own biases — was a formal innovation of enormous consequence for the history of the novel. We experience Emma Woodhouse's misjudgments from inside her misjudging mind; only in retrospect, following her, do we understand how wrong she has been.

Pride and Prejudice (first drafted as "First Impressions" in 1796–97) is the most beloved of the novels, centered on the contest of wits and wills between Elizabeth Bennet and the proud, rich, ultimately vulnerable Mr. Darcy. Its famous opening line — "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife" — announces its irony in the first breath: the "universal truth" is a social convention masquerading as nature. Austen died in 1817 at forty-one, almost certainly of Addison's disease, leaving two novels to be published posthumously. In the century after her death she was patronizingly admired as a minor domestic chronicler; since the twentieth century she has been recognized as one of the greatest novelists who ever lived.`,
    notableWorks: ["Pride and Prejudice", "Emma", "Sense and Sensibility", "Persuasion", "Mansfield Park"],
    themes: ["Marriage and social expectation", "Class and money", "Female intelligence in confined spaces", "The comedy of manners", "First impressions vs. true knowledge", "Irony as moral vision", "Self-deception"],
    influence: "Austen perfected the technique of free indirect discourse that became the central instrument of the modern novel; her influence on the novel of manners, psychological realism, and female literary consciousness is immeasurable.",
    funFact: "Austen's portrait has appeared on the British £10 note since 2017 — chosen by public vote — though the image used is the only authenticated likeness of her, a small pencil-and-watercolor sketch by her sister Cassandra.",
    quotes: [
      "It is a truth universally acknowledged, that a single man in possession of a good fortune must be in want of a wife.",
      "I declare after all there is no enjoyment like reading!",
      "There is nothing I would not do for those who are really my friends.",
    ],
    bookAuthorNames: ["Jane Austen", "Austen"],
    worksInLibrary: ["pride-and-prejudice"],
    portraitPlaceholder: "linear-gradient(135deg, #831843, #9D174D)",
  },

  {
    id: "charles-dickens",
    name: "Charles Dickens",
    birthYear: 1812,
    deathYear: 1870,
    birthPlace: "Portsmouth, Hampshire, England",
    nationality: "English",
    era: "19th Century",
    traditions: ["Victorian"],
    bio: `Charles Dickens was born in 1812 in Portsmouth to a family perpetually on the edge of financial disaster. The decisive trauma of his childhood came at twelve when his father was imprisoned for debt in the Marshalsea, and Dickens himself was withdrawn from school and put to work in a blacking factory pasting labels on pots of shoe polish. He was there for only a few months, but he never forgot the humiliation and abandonment; the experience fed directly into David Copperfield, Great Expectations, and Little Dorrit, and it generated his lifelong obsession with the cruelties visited on children by social indifference. He educated himself at the British Museum, became a court stenographer and then a parliamentary reporter, and burst into literary fame with The Pickwick Papers (1836–37), serialized in monthly installments and read by an audience that cut across all social classes.

Serial publication was the key to Dickens's relationship with his public, and it shaped his narrative methods: he had to end each installment on a note that would compel readers to come back, he could respond to reader feedback in real time, and he maintained a level of popular involvement with his characters that has no parallel in literary history. When Little Nell died in The Old Curiosity Shop, crowds gathered at New York docks waiting for the ship carrying the next installment. He gave public readings from his work that became theatrical events of extraordinary power — the murder of Nancy from Oliver Twist was so intense that doctors warned him it was damaging his health, and indeed he suffered a stroke while on his American reading tour and died in 1870 at fifty-eight.

Dickens's novels combine comic genius — his grotesque gallery of characters, from Micawber to Uriah Heep to Mrs. Jellyby, are among the most memorable in fiction — with systematic social criticism. He almost single-handedly turned English public opinion against the workhouses, the Yorkshire schools, the debtors' prisons, and the Chancery courts he anatomized. Great Expectations (1860–61), his most perfectly constructed novel, is a Bildungsroman about class, snobbery, and the corrupting effect of money on a naturally decent boy — and one of the great studies of disappointed illusion in English literature.`,
    notableWorks: ["Great Expectations", "A Tale of Two Cities", "Oliver Twist", "David Copperfield", "Bleak House"],
    themes: ["Class inequality", "The exploitation of children", "Social reform", "The corrupting power of money", "Charity and cruelty", "Crime and guilt", "Comic grotesque"],
    influence: "Dickens reshaped public attitudes toward poverty, child labor, and institutional cruelty more directly than any other literary writer, and his serial narrative techniques established the conventions of popular fiction that run directly into television drama.",
    funFact: "Dickens walked as many as twenty miles through the streets of London at night, often after midnight, observing the city's underworld, which he then translated into the nocturnal landscape of his fiction.",
    quotes: [
      "It was the best of times, it was the worst of times.",
      "No one is useless in this world who lightens the burdens of another.",
      "We forge the chains we wear in life.",
    ],
    bookAuthorNames: ["Charles Dickens", "Dickens"],
    worksInLibrary: ["great-expectations", "a-tale-of-two-cities"],
    portraitPlaceholder: "linear-gradient(135deg, #4C1D95, #5B21B6)",
  },

  {
    id: "fyodor-dostoevsky",
    name: "Fyodor Dostoevsky",
    fullName: "Fyodor Mikhailovich Dostoevsky",
    birthYear: 1821,
    deathYear: 1881,
    birthPlace: "Moscow, Russian Empire",
    nationality: "Russian",
    era: "19th Century",
    traditions: ["Russian"],
    bio: `On December 22, 1849, Fyodor Dostoevsky stood in the Semenovsky Square in St. Petersburg, convicted of involvement with a socialist reading circle, and waited to be shot. The execution had been ordered by Tsar Nicholas I; the firing squad raised its rifles. Then a rider galloped across the square with a last-minute reprieve: commutation to four years' hard labor in Siberia, followed by compulsory military service. The mock execution was deliberate theater, designed to break the prisoners psychologically, and in some ways it did — but it also gave Dostoevsky a subject and a perspective that would define his greatest work: the experience of standing at the absolute edge of existence and looking back at life with sudden, terrifying clarity about its value.

Dostoevsky spent four years in the Omsk prison camp, among murderers and common criminals, and the experience is recorded in Notes from the House of the Dead — a fictionalized memoir that is one of the first and most pitiless accounts of incarceration in world literature. He returned from Siberia with epilepsy (which may have predated his imprisonment but became severe thereafter), gambling addiction, crushing financial debt, and the raw material for the psychological novels that would make him one of the dominant figures of nineteenth-century literature. Crime and Punishment (1866) was largely dictated to a stenographer in a desperate race against a predatory publishing contract and was written partly to pay gambling debts; it is the story of a brilliant student who kills a pawnbroker to prove a theory about the rights of extraordinary individuals — and then is dismantled, not by external law, but by the inward logic of his own consciousness.

The Brothers Karamazov (1880), written in the last year of his life, is his masterpiece: a murder mystery, a family tragedy, a debate about God, free will, and the suffering of children, and a gallery of Russian types — the sensualist Fyodor Karamazov, the passionate Dmitri, the intellectual Ivan, the saintly Alyosha — each representing a different response to the central problem of the novel. Ivan's "Grand Inquisitor" chapter is the most devastating argument against God ever made by a believer: a prose poem in which the returned Christ is arrested by the Church he founded, and the Inquisitor explains that humanity chose bread, miracle, and authority over the unbearable gift of freedom. Dostoevsky never resolved the tension; he was constitutionally incapable of writing a novel that didn't contain its own most powerful counter-argument.`,
    notableWorks: ["Crime and Punishment", "The Brothers Karamazov", "The Idiot", "Notes from Underground", "Demons"],
    themes: ["Guilt and redemption", "Free will and suffering", "Faith and atheism", "The psychology of crime", "The 'extraordinary man' theory", "Compassion for the downtrodden", "Russian society and identity"],
    influence: "Dostoevsky is the supreme psychologist of modern fiction; his exploration of guilt, freedom, and the underground self shaped Nietzsche, Kafka, Freud, and virtually every twentieth-century novelist concerned with the inner life.",
    funFact: "Dostoevsky gambled away his wife's wedding ring and nearly all their money on a single trip to the roulette tables in Wiesbaden, forcing her to pawn her earrings to pay the hotel bill — an experience he transformed into The Gambler, dictated in twenty-six days to meet a contract deadline.",
    quotes: [
      "Beauty will save the world.",
      "The darker the night, the brighter the stars.",
      "To love someone means to see them as God intended them.",
    ],
    bookAuthorNames: ["Fyodor Dostoevsky", "Fyodor Dostoyevsky", "Dostoevsky", "Dostoyevsky", "F.M. Dostoevsky"],
    worksInLibrary: ["crime-and-punishment", "the-brothers-karamazov", "notes-from-underground"],
    portraitPlaceholder: "linear-gradient(135deg, #1E3A5F, #1E3A8A)",
  },

  {
    id: "leo-tolstoy",
    name: "Leo Tolstoy",
    fullName: "Count Lev Nikolayevich Tolstoy",
    birthYear: 1828,
    deathYear: 1910,
    birthPlace: "Yasnaya Polyana, Tula Province, Russian Empire",
    nationality: "Russian",
    era: "19th Century",
    traditions: ["Russian"],
    bio: `Leo Tolstoy was born in 1828 on his family's estate at Yasnaya Polyana, south of Moscow, into the Russian aristocracy, and he lived there for most of his eighty-two years — one of the most turbulent and self-contradictory lives in literary history. He served as an artillery officer in the Crimean War, traveled in Europe, gambled badly, visited brothels freely, married Sophia Behrs in 1862 and had thirteen children with her, ran a school for peasant children on his estate, and in between these activities produced the two longest and greatest novels in the Russian language. The account of his marriage in his diaries — and Sophia's diaries, kept in parallel — is itself a document of extraordinary psychological acuity about the damage that genius and ego can inflict on the people nearest to them.

War and Peace (1869) is the Himalaya of the novel form: 580 characters, four major families, the Napoleonic invasion of Russia from 1805 to 1812, and a philosophical meditation on the nature of historical causation that occupies two extended essays embedded in the narrative itself. What is most astonishing is how alive it feels: Pierre Bezukhov stumbling toward meaning, Natasha Rostova's disastrous near-elopement, Prince Andrei on the field of Austerlitz looking up at the "lofty sky." Anna Karenina (1878) is by contrast a focused masterpiece of tragic inevitability: a married aristocratic woman takes a lover, society destroys her, and the novel frames her story against the parallel story of Levin, a landowner who is essentially Tolstoy himself finding meaning in simple agricultural work and the community of peasants.

In the 1880s, following a spiritual crisis described in A Confession, Tolstoy repudiated his earlier novels as immoral vanities, converted to a form of anarchist Christian pacifism, gave away most of his property, dressed as a peasant, and became the most famous moral authority in the world — Gandhi, whom he corresponded with, called him his greatest influence. He spent the last decades of his life at war with the Russian Orthodox Church (which excommunicated him), the Tsarist state, and his own family. In November 1910, at the age of eighty-two, he fled Yasnaya Polyana in the middle of the night, caught pneumonia, and died at a remote railway station at Astapovo.`,
    notableWorks: ["War and Peace", "Anna Karenina", "The Death of Ivan Ilyich", "Resurrection", "The Kreutzer Sonata"],
    themes: ["History and the individual", "Moral integrity vs. social convention", "Death and the meaning of life", "Spiritual awakening", "War and its cost", "Marriage and infidelity", "The aristocracy's spiritual emptiness"],
    influence: "Tolstoy's two great novels set the outer boundary of what the realist novel can achieve, and his moral influence extended far beyond literature to shape Gandhi's nonviolence movement and the tradition of Christian anarchism.",
    funFact: "Tolstoy's wife Sophia hand-copied the manuscript of War and Peace seven times, including all his revisions — an act of labor that took years and that their marriage never entirely recovered from.",
    quotes: [
      "All happy families are alike; each unhappy family is unhappy in its own way.",
      "Everyone thinks of changing the world, but no one thinks of changing himself.",
      "If you want to be happy, be.",
    ],
    bookAuthorNames: ["Leo Tolstoy", "Count Leo Tolstoy", "Lev Tolstoy", "L.N. Tolstoy"],
    worksInLibrary: ["war-and-peace", "anna-karenina"],
    portraitPlaceholder: "linear-gradient(135deg, #1E3A8A, #1E40AF)",
  },

  {
    id: "herman-melville",
    name: "Herman Melville",
    birthYear: 1819,
    deathYear: 1891,
    birthPlace: "New York City, New York, USA",
    nationality: "American",
    era: "19th Century",
    traditions: ["American"],
    bio: `Herman Melville was born in New York City in 1819 into a family that was comfortably middle-class until his father's death when Herman was twelve left them in genteel poverty. He received a limited formal education and went to sea at nineteen, first on a merchant ship to Liverpool, then in 1841 on the whaling ship Acushnet, bound for the Pacific. He jumped ship in the Marquesas Islands, spent time among the Typee people (whom he found more civilized than the "civilized" world he had left), served briefly on an Australian ship, was imprisoned in Tahiti for participating in a mutiny, and eventually joined the crew of the whaling frigate United States. These four years in the Pacific gave him the raw material for his first five books, all lightly fictionalized adventure narratives that sold well and established him as an entertaining travel writer.

Moby-Dick (1851) is something altogether different: one of the most ambitious, philosophically dense, and formally eccentric novels ever written in English. On one level it is an account of the voyage of the Pequod, a Nantucket whaling ship, under the obsessed Captain Ahab, who has lost his leg to a white sperm whale and dedicated his life and his crew's lives to revenge. On another level it is an encyclopedic meditation on whales, whaling, cetology, and the culture of the American maritime industry. On a third level it is a sustained philosophical inquiry into the nature of obsession, evil, and the inscrutability of the universe, conducted through a vocabulary drawn from Shakespeare, the Bible, and the German Romantics. Ishmael, the narrator, is the survivor — the sole witness — and his survival is a kind of philosophical rescue: the novel ends in catastrophe, but the act of narration itself asserts the possibility of meaning.

Moby-Dick sold poorly on publication; reviewers found it formless and excessive. Melville's later work — Pierre, The Confidence-Man — sold even worse, and he spent the last decades of his life in obscurity as a customs inspector on the New York waterfront. He died in 1891 with almost no public recognition. The Melville revival began in the 1920s, led by British critics; by mid-century he had been installed as one of the supreme figures of American literature.`,
    notableWorks: ["Moby-Dick", "Bartleby the Scrivener", "Billy Budd", "Typee", "Pierre"],
    themes: ["Obsession and destruction", "The inscrutability of nature and God", "Democracy and authority", "The individual vs. the collective", "Race and American society", "The limits of knowledge", "Maritime adventure"],
    influence: "Moby-Dick is the great American epic — a novel whose formal ambition, philosophical depth, and symbolic richness defined what American literature could aspire to, and it has never been out of the conversation about the greatest novel in English.",
    funFact: "Moby-Dick was dedicated to Nathaniel Hawthorne, with whom Melville had an intense intellectual friendship; after reading Hawthorne's work, Melville reportedly said it had 'dropped germinous seeds' into his soul and expanded the scope of the novel he was already writing.",
    quotes: [
      "I would prefer not to.",
      "It is not down on any map; true places never are.",
      "We cannot live only for ourselves. A thousand fibers connect us to our fellow men.",
    ],
    bookAuthorNames: ["Herman Melville", "Melville"],
    worksInLibrary: ["moby-dick"],
    portraitPlaceholder: "linear-gradient(135deg, #14532D, #166534)",
  },

  {
    id: "victor-hugo",
    name: "Victor Hugo",
    birthYear: 1802,
    deathYear: 1885,
    birthPlace: "Besançon, France",
    nationality: "French",
    era: "19th Century",
    traditions: ["Romantic", "French"],
    bio: `Victor Hugo was born in Besançon in 1802, the son of one of Napoleon's generals, and he became the dominant literary, moral, and political figure in France for most of the nineteenth century — a man of such enormous talent and even more enormous self-regard that his life is inseparable from the history of France itself. He published his first collection of poetry at nineteen, was elected to the Académie française at thirty-nine, and was made a Peer of France by King Louis-Philippe. His theatrical manifesto, the preface to the play Cromwell (1827), was the founding document of French Romanticism. Notre-Dame de Paris (1831), which we know in English as The Hunchback of Notre-Dame, created the Gothic Quasimodo and the seductive Esmeralda while simultaneously making the case for the preservation of medieval architecture — Hugo's novel was so influential that it helped stop the demolition of the actual cathedral.

When Napoleon III seized power in the coup d'état of December 1851, Hugo — by then a republican deputy in the National Assembly — went into exile rather than accept the new regime. He spent nineteen years in exile, first in Brussels, then in Jersey and Guernsey, returning to France only after the fall of the Second Empire in 1870. It was during this exile that he wrote Les Misérables (1862), the novel that has outlasted everything he produced. Its subject is justice — the systematic injustice of a society that brands convicts forever, that criminalizes poverty, that grinds the innocent to dust — and its hero, Jean Valjean, is the closest thing in French literature to a figure of pure moral transformation: a man who spends the novel escaping not just the policeman Javert but his own former self.

Hugo returned to France in triumph in 1870 and spent his final fifteen years as the republic's living monument. When he died in 1885 at eighty-three, two million people attended his funeral procession from the Arc de Triomphe to the Panthéon. He had asked to be buried in a pauper's coffin, but the state gave him a state funeral. He would have appreciated the irony; it was exactly the kind of thing he would have written.`,
    notableWorks: ["Les Misérables", "Notre-Dame de Paris", "The Toilers of the Sea", "Ninety-Three", "Hernani"],
    themes: ["Social justice and poverty", "Moral redemption", "Political tyranny", "The law vs. conscience", "Romantic love and sacrifice", "The Catholic Church and society", "Revolution"],
    influence: "Hugo is the supreme figure of French Romanticism and social literature; Les Misérables permanently shaped French political culture's identification with the poor, and its adaptation for musical theater made it one of the most-performed works in the world.",
    funFact: "When Hugo wanted to know how Les Misérables was selling, he sent his publisher the shortest telegram in history: just '?' — and received the reply '!'",
    quotes: [
      "Even the darkest night will end and the sun will rise.",
      "He who opens a school door, closes a prison.",
      "To love another person is to see the face of God.",
    ],
    bookAuthorNames: ["Victor Hugo", "Hugo"],
    worksInLibrary: ["les-miserables"],
    portraitPlaceholder: "linear-gradient(135deg, #2E1065, #4C1D95)",
  },

  {
    id: "mary-shelley",
    name: "Mary Shelley",
    fullName: "Mary Wollstonecraft Shelley",
    birthYear: 1797,
    deathYear: 1851,
    birthPlace: "London, England",
    nationality: "English",
    era: "19th Century",
    traditions: ["Romantic"],
    bio: `Mary Shelley was born in 1797 into the most radical intellectual household in England: her father was William Godwin, the anarchist philosopher, and her mother was Mary Wollstonecraft, author of A Vindication of the Rights of Woman, who died ten days after Mary's birth. She grew up among the most radical thinkers in Britain, eloped at sixteen with the poet Percy Bysshe Shelley (who was still married to another woman), and by the time she was nineteen had written one of the most consequential novels in literary history. The circumstances of Frankenstein's composition are famous: in the summer of 1816, a volcanic winter caused by the eruption of Mount Tambora in Indonesia plunged Europe into cold and gloom; Mary, Percy, and Lord Byron were at the Villa Diodati by Lake Geneva, holding a ghost story competition. Mary had a dream — she described it in her 1831 preface — about a "pale student of unhallowed arts" who, kneeling beside his creation, "sees the hideous phantasm of a man stretched out." She wrote the dream down, and it became Frankenstein; or, The Modern Prometheus.

The novel is simultaneously a Gothic horror story, a Romantic meditation on creation and responsibility, and a philosophical inquiry into what it means to be human. Victor Frankenstein assembles his creature from charnel house materials and galvanic electricity — Shelley was drawing on real experiments by Luigi Galvani and Erasmus Darwin — and then, horrified by what he has made, abandons it. The creature, rejected at every turn by the human society he craves, becomes a monster not through nature but through experience. The most radical move in the novel is giving the creature's own voice nearly a third of its pages: we hear his account of his self-education through reading Milton, Plutarch, and Goethe, his discovery of his own origin in Victor's journal, his growing despair. Who is the real monster? The novel leaves the question inescapably open.

Mary Shelley outlived her husband (who drowned in 1822), three of her four children, and most of her intimate circle. She edited Percy's works for posthumous publication, and her own later novels — particularly The Last Man (1826), a novel of apocalypse — are strange, under-read works that deserve more attention than they receive. But Frankenstein is her monument, and it has generated more direct cultural offspring — scientific, cinematic, and philosophical — than any other novel of its era.`,
    notableWorks: ["Frankenstein; or, The Modern Prometheus", "The Last Man", "Valperga", "Mathilda"],
    themes: ["Creation and responsibility", "Rejection and monstrosity", "Forbidden knowledge", "The ethics of science", "Nature vs. nurture", "Isolation and belonging", "Romantic and Gothic"],
    influence: "Frankenstein is widely considered the founding text of science fiction and the first sustained literary exploration of the ethics of scientific creation; its creature is the template for every subsequent meditation on what humanity creates and then cannot control.",
    funFact: "Mary Shelley was only eighteen when she began writing Frankenstein, and it was originally published anonymously in 1818; many early readers assumed the author must be her husband Percy, and some reviews praised 'him' accordingly.",
    quotes: [
      "Beware; for I am fearless, and therefore powerful.",
      "Nothing is so painful to the human mind as a great and sudden change.",
      "I, the miserable and the abandoned, am an abortion, to be spurned at, and kicked, and trampled on.",
    ],
    bookAuthorNames: ["Mary Shelley", "Mary Wollstonecraft Shelley"],
    worksInLibrary: ["frankenstein"],
    portraitPlaceholder: "linear-gradient(135deg, #831843, #BE185D)",
  },

  {
    id: "emily-bronte",
    name: "Emily Brontë",
    birthYear: 1818,
    deathYear: 1848,
    birthPlace: "Thornton, Bradford, Yorkshire, England",
    nationality: "English",
    era: "19th Century",
    traditions: ["Romantic", "Victorian"],
    bio: `Emily Brontë was born in 1818 in Thornton, the fifth of six children of an Irish clergyman, Patrick Brontë, and she spent most of her short life on the Yorkshire moors at Haworth, one of the most desolate and beautiful landscapes in England. She was, by almost every account, the most reclusive and internally intense of the remarkable Brontë siblings. She attended school briefly in Brussels with her sister Charlotte but grew so physically ill from homesickness — or from something more fundamental, an inability to survive in the world — that she had to return to Haworth. She published a collection of poetry in 1846 under the pseudonym Ellis Bell, which sold two copies. She died in 1848 at thirty, of tuberculosis, having refused medical treatment almost to the end.

Wuthering Heights (1847) is the only novel she published, and it is one of the most violent, passionate, and formally innovative novels in the English language. Its structure alone is remarkable: the story is narrated by the lodger Lockwood, who is told the story by the housekeeper Nelly Dean, who is herself a participant in the events — a double-frame device that keeps the central characters, Heathcliff and Catherine, always slightly at a distance, filtered through observers who do not fully understand what they are seeing. Heathcliff, a dark-skinned foundling brought to Wuthering Heights by old Mr. Earnshaw, grows up alongside the Earnshaw children, forms an absolute bond with Catherine that transcends social convention and possibly mortality, is humiliated and driven away by her marriage to the respectable Edgar Linton, returns as a wealthy man bent on systematic revenge, and degrades the next generation as he degraded himself. The love between Heathcliff and Catherine is not romantic in any conventional sense; it is more like two halves of a single being that cannot fully coexist in the social world.

Victorian reviewers found the novel disturbing and morally incomprehensible, and Charlotte Brontë's defensive preface to the posthumous second edition attempted to explain her sister's "rusticity" as an effect of environment. Later critics have seen it differently: as a proto-modernist text, a study in narrative unreliability, and one of the most uncompromising depictions of destructive passion in fiction.`,
    notableWorks: ["Wuthering Heights", "Poems by Currer, Ellis, and Acton Bell"],
    themes: ["Destructive passion", "Class and social exclusion", "Revenge and its costs", "Nature vs. civilization", "Narrative unreliability", "The moors as psychological landscape", "Love beyond death"],
    influence: "Wuthering Heights permanently expanded the emotional and formal range of the English novel; its dark Byronic hero and its refusal of moral tidiness influenced the Gothic tradition, and Heathcliff became the template for the transgressive, socially excluded Romantic hero.",
    funFact: "Emily Brontë's famous reserve extended even to her illness: she refused to see a doctor until the very morning of her death, and reportedly insisted on getting up and dressing herself even on that last day.",
    quotes: [
      "Whatever our souls are made of, his and mine are the same.",
      "I am Heathcliff! He's always, always in my mind.",
      "If all else perished, and he remained, I should still continue to be.",
    ],
    bookAuthorNames: ["Emily Brontë", "Emily Bronte", "Ellis Bell"],
    worksInLibrary: ["wuthering-heights"],
    portraitPlaceholder: "linear-gradient(135deg, #4C1D95, #6D28D9)",
  },

  {
    id: "mark-twain",
    name: "Mark Twain",
    fullName: "Samuel Langhorne Clemens",
    birthYear: 1835,
    deathYear: 1910,
    birthPlace: "Florida, Missouri, USA",
    nationality: "American",
    era: "19th Century",
    traditions: ["American"],
    bio: `Samuel Langhorne Clemens was born in 1835 in the tiny hamlet of Florida, Missouri, and grew up in Hannibal, a Mississippi River town that became the model for St. Petersburg in the Tom Sawyer and Huckleberry Finn novels. He worked as a printer, a riverboat pilot (the pen name "Mark Twain" is a leadsman's cry meaning two fathoms — safe water), a Confederate irregular (for about two weeks, an experience he fictionalized with grim comedy in "The Private History of a Campaign That Failed"), and a prospector in Nevada before finding his true vocation as a journalist and humorist in San Francisco. His 1865 story "The Celebrated Jumping Frog of Calaveras County" made him famous across America overnight.

Adventures of Huckleberry Finn (1884) is the most contested and most essential novel in American literature. Ernest Hemingway's claim that "all modern American literature comes from one book by Mark Twain called Huckleberry Finn" is both an exaggeration and a serious insight: the novel's first-person vernacular narrative voice — Huck's voice, ungrammatical, funny, morally earnest, utterly alive — created the template for American literary realism. The story follows Huck and Jim, an escaped slave, floating down the Mississippi on a raft in the years before the Civil War, and its central moral action is Huck's decision, against everything his society has taught him is right, to refuse to turn Jim in. "All right, then, I'll go to hell," Huck says — and in that sentence Twain encapsulates the deepest conflict in the American conscience.

The novel has been challenged and removed from curricula for generations, and the debate about it is itself a kind of education in American literature's relationship to race. Twain uses the word "nigger" over two hundred times; Jim is initially depicted through the conventions of minstrel comedy; the novel's ending, in which Tom Sawyer reduces Jim's freedom to a series of elaborate games, is a problem that critics have argued about since the book appeared. What remains undeniable is the moral clarity of the raft episodes, the beauty of the river passages, and the devastating irony of a novel in which the character with the worst education and the lowest social position consistently makes the most humane moral judgments.`,
    notableWorks: ["Adventures of Huckleberry Finn", "The Adventures of Tom Sawyer", "The Prince and the Pauper", "A Connecticut Yankee in King Arthur's Court", "Life on the Mississippi"],
    themes: ["Race and slavery in America", "Social hypocrisy and conformity", "The Mississippi as American Eden", "Childhood and moral awakening", "Satire of civilization", "Freedom and captivity", "The vernacular voice"],
    influence: "Twain established the American vernacular novel and the tradition of social satire through comedy; Hemingway's and Faulkner's prose styles, and the entire tradition of American comic writing, begin with the voice of Huck Finn.",
    funFact: "Twain was born in 1835, the year Halley's Comet appeared, and he predicted he would die when it came again. He died on April 21, 1910 — one day after Halley's Comet made its closest approach to Earth.",
    quotes: [
      "The reports of my death are greatly exaggerated.",
      "All right, then, I'll go to Hell.",
      "The secret of getting ahead is getting started.",
    ],
    bookAuthorNames: ["Mark Twain", "Samuel Clemens", "Samuel L. Clemens"],
    worksInLibrary: ["adventures-of-huckleberry-finn", "the-adventures-of-tom-sawyer"],
    portraitPlaceholder: "linear-gradient(135deg, #14532D, #166534)",
  },

  {
    id: "oscar-wilde",
    name: "Oscar Wilde",
    fullName: "Oscar Fingal O'Flahertie Wills Wilde",
    birthYear: 1854,
    deathYear: 1900,
    birthPlace: "Dublin, Ireland",
    nationality: "Irish",
    era: "19th Century",
    traditions: ["Victorian"],
    bio: `Oscar Wilde was born in Dublin in 1854 to a remarkable family: his father, Sir William Wilde, was the leading ophthalmologist and aural surgeon in Ireland, a distinguished antiquarian, and a man of considerable sexual scandal; his mother, Jane Francesca Elgee, wrote nationalist poetry under the pen name Speranza and hosted one of Dublin's most celebrated literary salons. Oscar won a scholarship to Trinity College Dublin, then another to Magdalen College Oxford, where he studied classics and developed the philosophy of aesthetic excess that would define his public persona. He won the Newdigate Prize for poetry in 1878, moved to London, and proceeded to make himself the most talked-about man in England — not yet through his writing, but through the performance of himself: his long hair, his velvet breeches, his sunflower and lily, his epigrams delivered in a voice of baroque elaboration.

The creative explosion of the 1890s produced Wilde's major works in rapid succession: The Picture of Dorian Gray (1890/1891), the only novel, in which a beautiful young man sells his soul to remain young while his portrait ages and degrades; the society comedies Lady Windermere's Fan, A Woman of No Importance, An Ideal Husband, and the pinnacle of English comic drama, The Importance of Being Earnest (1895); and the prose poem in French, Salomé, illustrated by Aubrey Beardsley. The Picture of Dorian Gray is simultaneously an aestheticist manifesto (art is amoral, beauty is the only absolute value), a Gothic novel, a decadent fable, and a coded meditation on homosexual desire — its villain, Lord Henry Wotton, is the most brilliant spokesman for a philosophy Wilde both was drawn to and knew was damning.

In 1895, at the summit of his fame, Wilde made the catastrophic decision to sue the Marquess of Queensberry — the father of his lover, Lord Alfred Douglas — for criminal libel. He lost, and the evidence produced in his defense led to his own prosecution for "gross indecency" (homosexual acts). He was convicted and sentenced to two years' hard labor. The sentence destroyed his health and ended his writing career. He was released in 1897, wrote De Profundis — a long letter to Douglas, combining recrimination and spiritual meditation — and The Ballad of Reading Gaol, a poem about the prison experience. He died in Paris in 1900, aged forty-six, in a cheap hotel, reportedly saying, "My wallpaper and I are fighting a duel to the death. One or the other of us has to go."`,
    notableWorks: ["The Picture of Dorian Gray", "The Importance of Being Earnest", "De Profundis", "The Ballad of Reading Gaol", "Salomé"],
    themes: ["Art for art's sake", "The corruption of beauty", "Social hypocrisy", "The double life", "Wit as moral vision", "Punishment and shame", "The mask and the soul"],
    influence: "Wilde is the defining figure of aesthetic decadence and the master of English comic epigram; his fate became a symbol of society's persecution of homosexuality, and his wit — endlessly quotable — remains the most quoted in the English language after Shakespeare.",
    funFact: "Wilde reportedly spent several months perfecting the epigrams for The Importance of Being Earnest — polishing what appear to be spontaneous witticisms until they achieved their effortless perfection.",
    quotes: [
      "To live is the rarest thing in the world. Most people exist, that is all.",
      "Be yourself; everyone else is already taken.",
      "I can resist everything except temptation.",
    ],
    bookAuthorNames: ["Oscar Wilde", "Wilde"],
    worksInLibrary: ["the-picture-of-dorian-gray", "the-importance-of-being-earnest"],
    portraitPlaceholder: "linear-gradient(135deg, #4C1D95, #7C3AED)",
  },

  {
    id: "edgar-allan-poe",
    name: "Edgar Allan Poe",
    birthYear: 1809,
    deathYear: 1849,
    birthPlace: "Boston, Massachusetts, USA",
    nationality: "American",
    era: "19th Century",
    traditions: ["American"],
    bio: `Edgar Allan Poe was born in Boston in 1809 to traveling actors; his father abandoned the family, his mother died of tuberculosis when he was two, and he was taken in — never formally adopted — by John and Frances Allan of Richmond, Virginia. His relationship with John Allan, a prosperous tobacco merchant, was one of mutual disappointment: Allan refused to pay Poe's gambling debts at the University of Virginia, leading to Poe's withdrawal; Poe enlisted in the army under a false name; a brief reconciliation got him into West Point, which he deliberately got himself expelled from. He moved to Baltimore, where he lived with his aunt Maria Clemm and eventually married her thirteen-year-old daughter Virginia, who died of tuberculosis in 1847. Poverty, alcoholism (probably complicated by other neurological conditions), and personal tragedy were the constants of his life; he died in Baltimore in October 1849 under circumstances that remain mysterious — possibly rabies, possibly cooping (electoral fraud involving forced drinking), possibly plain alcohol poisoning.

Poe invented, or effectively founded, the short story as a recognized literary form and within it invented two of its most durable genres: the psychological horror story and the detective story. "The Murders in the Rue Morgue" (1841) introduced C. Auguste Dupin, the brilliant eccentric detective who reasons from observation — the direct ancestor of Sherlock Holmes, Hercule Poirot, and every subsequent detective fiction. "The Tell-Tale Heart," "The Fall of the House of Usher," "Ligeia," "The Masque of the Red Death," "The Cask of Amontillado" — these stories defined the grammar of Gothic horror: the unreliable narrator consumed by guilt or obsession, the crumbling ancestral house mirroring the crumbling mind, death returning from beyond its proper boundary. His poem "The Raven" (1845) made him the most famous poet in America overnight and introduced the incantatory repetition — "Nevermore" — that became one of poetry's most recognizable rhetorical effects.

Poe also wrote serious literary criticism and theoretical essays — "The Philosophy of Composition," "The Poetic Principle," "Eureka" — that influenced the French Symbolist poets, particularly Baudelaire, who translated and championed him. In France he became the founding figure of literary Symbolism; in America he was long dismissed as a minor, dissolute talent. The French understanding has largely prevailed.`,
    notableWorks: ["The Raven", "The Tell-Tale Heart", "The Fall of the House of Usher", "The Murders in the Rue Morgue", "The Cask of Amontillado"],
    themes: ["Guilt and psychological collapse", "Death and mourning", "Madness and obsession", "The Gothic and the uncanny", "Beauty and horror", "The doppelgänger", "The unreliable mind"],
    influence: "Poe invented the detective story and the modern psychological horror tale, and his theory of the short story's 'unity of effect' shaped the development of the form globally; Baudelaire's translations made him the godfather of French Symbolism and, through it, of literary Modernism.",
    funFact: "Poe entered a short story competition in the Southern Literary Messenger in 1835 and won all five prizes — the judges had no idea the same author had submitted all five winning entries.",
    quotes: [
      "Quoth the Raven, 'Nevermore.'",
      "I became insane, with long intervals of horrible sanity.",
      "All that we see or seem is but a dream within a dream.",
    ],
    bookAuthorNames: ["Edgar Allan Poe", "Poe", "E.A. Poe"],
    worksInLibrary: [],
    portraitPlaceholder: "linear-gradient(135deg, #111827, #1F2937)",
  },

  // ── EARLY 20TH CENTURY ─────────────────────────────────────────────────────

  {
    id: "james-joyce",
    name: "James Joyce",
    birthYear: 1882,
    deathYear: 1941,
    birthPlace: "Dublin, Ireland",
    nationality: "Irish",
    era: "Early 20th Century",
    traditions: ["Modernist"],
    bio: `James Joyce was born in Dublin in 1882, the eldest of ten surviving children of a charming, improvident father and a pious Catholic mother, and he spent his life in voluntary exile from the city he never stopped writing about. He attended Jesuit schools, studied modern languages at University College Dublin, and left Ireland in 1904 with Nora Barnacle — a woman from Galway he had known for four months — to whom he remained devoted for the rest of his life. They lived in Trieste, Zurich, and Paris, in chronic poverty and then, after the success of Ulysses, in comparative comfort, raising two children while Joyce's eyesight progressively failed through a series of over twenty eye operations that never fully resolved his condition. He wrote, famously, with a white crayon on large sheets of paper, and toward the end he could barely read what he had written.

Dubliners (1914), his short story collection, is the most perfectly constructed such collection in English: fifteen stories arranged to move from childhood through adolescence, maturity, and public life, all set in the paralysis and stagnation of early twentieth-century Dublin, all ending in the epiphanic moment Joyce described as the sudden revelation of a thing's whatness — the recognition of a pattern that had been invisible. The final story, "The Dead," is among the greatest short stories ever written, and its closing passage — "His soul swooned slowly as he heard the snow falling faintly through the universe and faintly falling, like the descent of their last end, upon all the living and the dead" — is among the most beautiful in the language. A Portrait of the Artist as a Young Man (1916) traces the intellectual and spiritual development of Stephen Dedalus, Joyce's artistic alter ego, through Catholic guilt, nationalist pressure, and adolescent yearning, to the moment of artistic vocation and departure from Ireland.

Ulysses (1922), published in Paris by Sylvia Beach after serial publication in The Little Review had been suppressed on obscenity grounds in the United States, transposes Homer's Odyssey to a single day in Dublin — June 16, 1904 — following Leopold Bloom (Ulysses), his wife Molly (Penelope), and Stephen Dedalus (Telemachus) through eighteen episodes, each with its own narrative technique, its own bodily organ, its own color and art. Stream of consciousness, parody, pastiche, catechism, operatic aria — each chapter is written in a different style, at different scales of difficulty. Finnegans Wake (1939) takes this further into a dream-language that incorporates fragments of dozens of languages in a cyclical structure where the last sentence continues into the first. Joyce spent seventeen years on it and was largely misunderstood; he reportedly said, with some satisfaction, that it would keep the scholars busy for centuries. He was right.`,
    notableWorks: ["Ulysses", "Dubliners", "A Portrait of the Artist as a Young Man", "Finnegans Wake"],
    themes: ["The paralysis of Irish society", "Artistic exile and vocation", "Memory and identity", "The ordinary as epic", "Stream of consciousness", "Catholicism and its afterlife in the secular mind", "The body and the mind"],
    influence: "Joyce is the supreme technician of Modernist prose fiction; his development of stream of consciousness, his mythic structuring of everyday life, and his experiments with language in Finnegans Wake defined the outer boundary of what the novel could attempt.",
    funFact: "Bloomsday — June 16th, the date on which the entirety of Ulysses is set — is now celebrated annually in Dublin with readings, walks along the novel's routes, and a great deal of food and drink, attracting tens of thousands of visitors.",
    quotes: [
      "Think you're escaping and run into yourself. Longest way round is the shortest way home.",
      "He was soon the foremost in his class. His father was proud and often spoke of him to a friend.",
      "I will not serve that in which I no longer believe.",
    ],
    bookAuthorNames: ["James Joyce", "Joyce"],
    worksInLibrary: ["ulysses"],
    portraitPlaceholder: "linear-gradient(135deg, #111827, #1F2937)",
  },

  {
    id: "franz-kafka",
    name: "Franz Kafka",
    birthYear: 1883,
    deathYear: 1924,
    birthPlace: "Prague, Austro-Hungarian Empire (present-day Czech Republic)",
    nationality: "Czech",
    era: "Early 20th Century",
    traditions: ["Modernist"],
    bio: `Franz Kafka was born in 1883 in Prague into a German-speaking Jewish family, and his life was a study in contradictions. By day he worked as a lawyer in accident insurance, assessing workmen's compensation claims with such efficiency that he was repeatedly promoted; he came, he said, to know bureaucracy from the inside, and that knowledge saturates his fiction. By night he wrote — but writing was less a pleasure than a compulsion, an act of impossible necessity. He suffered from insomnia, from hypochondria, from a relationship with his father that he analyzed in a famous 80-page letter (never delivered) as the source of all his psychological damage. He was engaged three times and never married. He contracted tuberculosis in 1917 and spent the last seven years of his life in a state of managed decline.

Kafka's literary output was relatively small: three unfinished novels and a collection of shorter works, most of them published in small journals or not at all during his lifetime. Before he died in 1924 at forty, he asked his closest friend, Max Brod, to burn all his manuscripts and letters. Brod agreed, then immediately began preparing them for publication. Without that act of betrayal, we would have none of the major work: The Trial, The Castle, Amerika are all posthumous, all unfinished, all essential. The Metamorphosis (1915), published in his lifetime, is the one major exception: the story of a traveling salesman who wakes one morning to find himself transformed into a gigantic insect, and whose family gradually adjusts to his presence, exploits his passivity, and ultimately wishes him dead. In fifteen thousand words it captures something definitive about alienation, utility, and the family's management of inconvenient humanity.

Kafka's fiction predicted, with uncanny accuracy, the mechanisms of twentieth-century totalitarianism before it had fully arrived: the opaque bureaucracy, the accusation without specific charge, the tribunal that combines formal procedure with complete arbitrariness, the individual crushed not by any particular malice but by the impersonal functioning of the system. Josef K., the protagonist of The Trial, is arrested one morning, never told what he is accused of, and spends the novel attempting to navigate a legal apparatus that is designed to be unnavigable. The word "Kafkaesque" entered the English language as the only adequate description of a type of institutional absurdity that Kafka had diagnosed before it became universal.`,
    notableWorks: ["The Metamorphosis", "The Trial", "The Castle", "In the Penal Colony", "Amerika"],
    themes: ["Bureaucracy and the individual", "Alienation and transformation", "The absurdity of authority", "Guilt without cause", "The family as institution", "Language and power", "Jewish identity in Central Europe"],
    influence: "Kafka is the defining literary prophet of twentieth-century totalitarianism and bureaucratic alienation; 'Kafkaesque' is one of the few literary adjectives to enter everyday speech, and his work influenced every major post-war novelist dealing with authority and absurdity.",
    funFact: "Kafka reportedly laughed out loud when he read The Metamorphosis aloud to his friends — he found it genuinely funny — suggesting his famous darkness was never without a dark comic awareness of its own absurdity.",
    quotes: [
      "Someone must have slandered Josef K., for one morning, without having done anything wrong, he was arrested.",
      "There is infinite hope, but not for us.",
      "A book must be the axe for the frozen sea within us.",
    ],
    bookAuthorNames: ["Franz Kafka", "Kafka"],
    worksInLibrary: ["the-metamorphosis", "the-trial"],
    portraitPlaceholder: "linear-gradient(135deg, #1F2937, #374151)",
  },

  {
    id: "virginia-woolf",
    name: "Virginia Woolf",
    fullName: "Adeline Virginia Woolf",
    birthYear: 1882,
    deathYear: 1941,
    birthPlace: "London, England",
    nationality: "English",
    era: "Early 20th Century",
    traditions: ["Modernist"],
    bio: `Virginia Woolf was born in 1882 in Kensington into one of the most intellectually distinguished families in Victorian England. Her father, Leslie Stephen, was the editor of the Dictionary of National Biography and a prominent man of letters; her mother, Julia Duckworth, was a famous Pre-Raphaelite beauty. The deaths of her mother (when Virginia was thirteen), her half-sister Stella, and her father (in 1904) triggered the first of the mental breakdowns that punctuated her life. Woolf was never formally educated — the boys in her family went to Cambridge, the girls were taught at home — and the injustice of that exclusion runs through A Room of One's Own (1929), her extended essay on women and fiction, which remains one of the foundational texts of feminist literary criticism. She and her husband Leonard Woolf founded the Hogarth Press in 1917, initially as a therapeutic project, which became one of the most significant literary publishers of the twentieth century, publishing T. S. Eliot, Katherine Mansfield, and the first English translations of Freud.

Mrs Dalloway (1925) and To the Lighthouse (1927) are her two supreme achievements in fiction. Mrs Dalloway compresses an entire day in London — Clarissa Dalloway preparing for a party, Septimus Warren Smith moving through the city toward his suicide — into a continuous stream of consciousness that moves between characters without announcing the transitions, making interior and exterior experience indistinguishable. To the Lighthouse has even less conventional plot: the first section covers a single afternoon at a house in the Scottish Hebrides as Mrs. Ramsay presides over her family and guests; a single haunting middle section, "Time Passes," covers ten years and three deaths in a few impressionistic pages; the third section, set after the war, resolves the emotional tensions of the first. The novel's famous last sentence — "Yes, she thought, laying down her brush in extreme fatigue, I have had my vision" — is the most quietly triumphant affirmation in Modernist literature.

Woolf drowned herself in the River Ouse on March 28, 1941, weighting her pockets with stones, fearing the onset of another incapacitating breakdown and the prospect of not surviving another war. She was fifty-nine. The letter she left for Leonard is among the most moving documents in literary history. Her diaries and letters, published posthumously, have become texts in their own right — a continuous record of a mind of extraordinary sensitivity attempting to live and write in a world that was not designed to accommodate it.`,
    notableWorks: ["Mrs Dalloway", "To the Lighthouse", "The Waves", "A Room of One's Own", "Orlando"],
    themes: ["The flow of consciousness", "Time and mortality", "Women's creative life", "The nature of the self", "War and its aftermath", "Art and vision", "Social class and exclusion"],
    influence: "Woolf perfected the stream-of-consciousness technique in the English novel and, through A Room of One's Own, founded modern feminist literary criticism; her formal experiments influenced every subsequent novelist who has taken the representation of interiority seriously.",
    funFact: "Woolf wrote her novels standing at a writing desk in her lodge at Monk's House, producing roughly 500 words a day in the mornings — a disciplined output that belies the supposed chaos of her mental life.",
    quotes: [
      "A woman must have money and a room of her own if she is to write fiction.",
      "You cannot find peace by avoiding life.",
      "I thought how unpleasant it is to be locked out; and I thought how it is worse, perhaps, to be locked in.",
    ],
    bookAuthorNames: ["Virginia Woolf", "V. Woolf", "Woolf"],
    worksInLibrary: ["mrs-dalloway", "to-the-lighthouse"],
    portraitPlaceholder: "linear-gradient(135deg, #111827, #374151)",
  },

  {
    id: "f-scott-fitzgerald",
    name: "F. Scott Fitzgerald",
    fullName: "Francis Scott Key Fitzgerald",
    birthYear: 1896,
    deathYear: 1940,
    birthPlace: "Saint Paul, Minnesota, USA",
    nationality: "American",
    era: "Early 20th Century",
    traditions: ["American", "Modernist"],
    bio: `F. Scott Fitzgerald was born in 1896 in Saint Paul, Minnesota, to a father whose genteel Catholic family had fallen on hard times and a mother who was the heiress to a small grocery fortune. The combination — social aspiration, financial precariousness, Catholic guilt, and Midwestern outsider status in the face of East Coast wealth — generated the central tensions of his fiction. He attended Princeton but left without graduating when the United States entered the First World War; he was commissioned as an officer and stationed in Alabama, where he met Zelda Sayre, the beautiful, brilliant, and already unstable daughter of a prominent family. Their courtship and marriage became the central drama of his life, at least as he narrated it: Zelda, who would eventually be institutionalized for schizophrenia, later claimed that Scott had stolen her diaries for his fiction and stolen her life for his metaphors.

This Side of Paradise (1920), published when Fitzgerald was twenty-three, made him the literary voice of the Jazz Age overnight — a role he embraced and that eventually consumed him. The Great Gatsby (1925), written in a burst of intense effort while he and Zelda were living lavishly in France, is his masterpiece: the story of James Gatz, a poor boy from North Dakota who reinvents himself as Jay Gatsby, makes a fortune through bootlegging, and throws extravagant parties at his West Egg mansion in the hope that his former lover Daisy Buchanan — married to the brutish Tom, living across the water on the more established East Egg — will notice and return to him. The novel is narrated by Nick Carraway, Daisy's cousin, who watches the tragedy unfold with a mixture of complicity and moral judgment. Its last lines, among the most celebrated in American literature, locate the tragedy in the structure of the American dream itself: "So we beat on, boats against the current, borne back ceaselessly into the past."

Fitzgerald's subsequent career was a long decline into alcoholism, financial desperation, and Hollywood screenwriting. Tender Is the Night (1934), a flawed and brilliant novel drawing directly on his and Zelda's experience of the expatriate Riviera life, was received with disappointment. He died in 1940 at forty-four, believing himself a failure, in the apartment of a gossip columnist in Hollywood, working on a novel about the film industry. The Crack-Up, his essays about his own psychological collapse, are among the most honest and self-lacerating documents in American literary journalism.`,
    notableWorks: ["The Great Gatsby", "Tender Is the Night", "This Side of Paradise", "The Beautiful and Damned", "The Crack-Up"],
    themes: ["The American Dream and its corruption", "Class aspiration and social exclusion", "The Jazz Age and its moral emptiness", "Romantic idealization", "Self-reinvention", "Money and spiritual vacancy", "The past that cannot be recovered"],
    influence: "The Great Gatsby is the defining American novel of the twentieth century; its meditation on wealth, aspiration, and the corruption of the American Dream set the terms for a century of American literary and cultural self-examination.",
    funFact: "The Great Gatsby sold modestly on first publication and Fitzgerald died believing it had been a failure; it was included in the Army's 'Armed Services Editions' distributed to soldiers during World War II, where it was read by hundreds of thousands of men, and the post-war paperback edition ignited the classic's modern reputation.",
    quotes: [
      "So we beat on, boats against the current, borne back ceaselessly into the past.",
      "The test of a first-rate intelligence is the ability to hold two opposed ideas in mind at the same time.",
      "Show me a hero and I'll write you a tragedy.",
    ],
    bookAuthorNames: ["F. Scott Fitzgerald", "F. Scott Fitzgerald", "Francis Scott Fitzgerald", "Fitzgerald"],
    worksInLibrary: ["the-great-gatsby"],
    portraitPlaceholder: "linear-gradient(135deg, #14532D, #166534)",
  },

  // ── ANCIENT (ADDITIONAL) ───────────────────────────────────────────────────

  {
    id: "euripides",
    name: "Euripides",
    birthYear: -480,
    deathYear: -406,
    birthPlace: "Salamis (or Athens), Ancient Greece",
    nationality: "Greek",
    era: "Ancient",
    traditions: ["Ancient Greek"],
    bio: `Euripides was the youngest of the three great Athenian tragedians and, in many ways, the most modern. Born around 480 BCE — possibly on the island of Salamis, on the very day of the famous naval battle there — he won the City Dionysia festival only five times during his lifetime, far fewer than Sophocles or Aeschylus, yet he was also the most frequently performed tragedian in antiquity after his death. His relative unpopularity with Athenian juries reflects what made him revolutionary: he pushed drama toward psychological realism, moral ambiguity, and a skepticism about the gods that his audiences found unsettling. Where Sophocles's heroes fall through a conjunction of fate and noble character, Euripides's characters are driven by passion, resentment, and wounded pride — emotions that feel embarrassingly contemporary.

His Medea (431 BCE) is his greatest surviving work and one of the most radical plays in the Western canon. Medea, a foreign sorceress who abandoned her homeland and family to follow the Greek hero Jason, discovers that he plans to abandon her for a politically convenient marriage. Her response — to murder her own children in order to deprive Jason of his legacy and ensure his perpetual grief — is not presented as pure monstrosity but as the logical endpoint of a woman who has been stripped of everything that gave her existence meaning in a patriarchal Greek world that never accepted her. The famous monologue in which Medea deliberates between maternal love and destructive fury is the first sustained psychological self-examination in Western drama.

Euripides was also unusual in giving his female characters real interiority and moral agency — both Medea and Phaedra in the Hippolytus are more fully realized psychological presences than their male counterparts. His last plays, including The Bacchae and Iphigenia at Aulis, written in Macedonia after he had left Athens in voluntary or involuntary exile, take on an even darker tone. The Bacchae, his strangest and greatest late work, dramatizes the god Dionysus's revenge on the city of Thebes in terms that suggest a profound reckoning with religion, ecstasy, and the irreducible power of the irrational.`,
    notableWorks: ["Medea", "The Bacchae", "Electra", "Iphigenia at Aulis", "Alcestis"],
    themes: ["Women's suffering", "Barbarian vs. Greek", "Passion and reason", "Divine cruelty", "Political tyranny"],
    influence: "Euripides effectively invented the tradition of psychological tragedy — drama driven by inner states rather than fate — and his rehabilitation of outcasts and victims set a template that runs through Shakespeare's complex villains to modern drama; his influence on Roman tragedy and through it on Renaissance theater was decisive.",
    funFact: "Ancient sources claim Euripides was friends with the philosopher Socrates, who rarely attended plays but made an exception for Euripides's work — the two shared a restless, questioning spirit that made them both unpopular with the Athenian establishment.",
    quotes: [
      "No act of kindness, no matter how small, is ever wasted.",
      "Question everything.",
      "The wisest men follow their own direction.",
    ],
    bookAuthorNames: ["Euripides"],
    worksInLibrary: ["medea"],
    portraitPlaceholder: "linear-gradient(135deg, #1E3A8A, #2563EB)",
  },

  {
    id: "herodotus",
    name: "Herodotus",
    birthYear: -484,
    deathYear: -425,
    birthPlace: "Halicarnassus, Caria (modern Turkey)",
    nationality: "Greek",
    era: "Ancient",
    traditions: ["Ancient Greek"],
    bio: `Herodotus of Halicarnassus — Cicero would later call him "the Father of History" — was the first writer to make the systematic investigation of past events and their causes a literary project in its own right. Born around 484 BCE in Halicarnassus, a Greek city on the southwestern coast of what is now Turkey, he was a man of the borderlands from the start: Greek in language and culture but living in a region where Greek, Persian, Lydian, and Carian civilizations intersected. This liminal position gave him the curiosity and the method that define the Histories: an insatiable interest in what different peoples believe, how they live, and why they fight, combined with a willingness to report conflicting accounts without always resolving them.

The Histories covers the wars between Greece and Persia — above all Xerxes's great invasion of 480 BCE and its defeat at Salamis, Thermopylae, and Plataea — but it begins far earlier, in the distant causes and the long prehistory of the conflict, and it constantly expands into ethnographic digressions about Egypt, Babylon, Scythia, Libya, and India. Herodotus traveled extensively, probably to Egypt, the Black Sea coast, and Babylon, collecting stories, interviewing priests and local authorities, and recording what he heard. He was not credulous — he often reports traditions with explicit skepticism ("I am not obliged to believe this, though I report it") — but he was also not a modern empiricist; he included divine oracles, miraculous events, and folktales alongside political and military analysis. The result is something between history, anthropology, travel writing, and prose epic.

His great theme is the hubris of great powers — the fatal overreach of those who cannot recognize the limits of human ambition. Xerxes, who whips the sea for destroying his bridge of boats, is his supreme example; but the theme recurs across the whole sweep of the work, from Croesus's failure to understand the ambiguous oracle to the repeated downfalls of the mighty. Herodotus's prose, translated well, has a kind of enchanted quality — the sense of a world simultaneously wonderful, dangerous, and impossible to fully comprehend — that no subsequent historian has quite replicated.`,
    notableWorks: ["The Histories"],
    themes: ["War and empire", "Cultural diversity", "Divine justice", "Hubris of great powers", "Memory and tradition"],
    influence: "Herodotus invented the discipline of history as a mode of literary inquiry, established the method of investigating human causes alongside divine ones, and created the ethnographic curiosity that runs through all subsequent anthropology and travel writing.",
    funFact: "Herodotus describes the Persian messenger system — with relay riders stationed at intervals who could carry dispatches across the empire at astonishing speed — in terms that led to its famous motto: 'Neither snow nor rain nor heat nor gloom of night stays these couriers from the swift completion of their appointed rounds,' which was later adapted for the US Postal Service.",
    quotes: [
      "Call no man happy until he is dead.",
      "Great deeds are usually wrought at great risks.",
      "Of all men's miseries the bitterest is this: to know so much and to have control over nothing.",
    ],
    bookAuthorNames: ["Herodotus"],
    worksInLibrary: ["the-histories"],
    portraitPlaceholder: "linear-gradient(135deg, #1D4ED8, #2563EB)",
  },

  {
    id: "marcus-aurelius",
    name: "Marcus Aurelius",
    birthYear: 121,
    deathYear: 180,
    birthPlace: "Rome, Roman Empire",
    nationality: "Roman",
    era: "Ancient",
    traditions: ["Roman"],
    bio: `Marcus Aurelius Antoninus was born in Rome in 121 CE into a family of Spanish origin that had risen to the heights of Roman aristocracy. He was adopted by the Emperor Antoninus Pius, trained exhaustively in rhetoric and philosophy, and ascended to the imperial throne in 161 CE — becoming, in Plato's famous phrase, the closest thing the world had yet seen to a philosopher-king. He reigned for nearly two decades, spending much of that time on military campaigns against Germanic tribes on the Danube frontier and against the Parthians in the east, while simultaneously managing plagues, rebellions, and the constant administrative demands of the largest empire in the Western world. He was, by every account, a conscientious and humane ruler who freed slaves, reformed gladiatorial combat, and tried to govern according to Stoic principles of reason and duty.

The Meditations — written in Greek, not Latin — were never intended for publication. They are private notebooks, a record of Marcus's ongoing dialogue with himself as he tried, on campaign, in the palace, in the middle of the night, to practice the Stoic philosophy he had been taught and to hold himself to its austere demands. The entries have no dates, no narrative arc, and no consistent structure: they are reminders, admonitions, reflections, and meditations in the original sense — exercises in turning the mind toward what matters. Recurring themes include the brevity and insignificance of human life in cosmic perspective, the futility of seeking fame or pleasure, the sovereignty of the rational will over external events, and the Stoic duty to serve others without attachment to the outcome. "You have power over your mind, not outside events" is perhaps the most famous formulation of the Stoic insight that has made the Meditations a perennial self-help text.

What makes the Meditations moving rather than merely instructive is the evidence of struggle. Marcus is not a serene sage dispensing wisdom; he is a tired emperor who finds court life disgusting, who must remind himself daily not to be impatient with fools, who is clearly fighting his own tendencies toward bitterness, laziness, and despair. The gap between the ideal he articulates and the human difficulty of living it gives the text its peculiar intimacy — a kind of honesty available only in writing meant for no one else.`,
    notableWorks: ["Meditations"],
    themes: ["Stoic philosophy", "Duty and service", "Impermanence", "Rational mind", "Control over self"],
    influence: "The Meditations is the most widely read work of Stoic philosophy and has had a continuous influence on Western ethics, leadership literature, and secular spirituality; its themes of rational self-governance and equanimity in adversity have been adopted by military leaders, executives, and ordinary readers for nearly two millennia.",
    funFact: "Marcus Aurelius never gave his private journal a title — the name 'Meditations' (or in Greek, 'Ta Eis Heauton,' meaning 'To Himself') was supplied by later editors; the manuscript was discovered after his death and its survival into the modern era is largely due to a single Byzantine manuscript tradition.",
    quotes: [
      "You have power over your mind, not outside events.",
      "The impediment to action advances action.",
      "Waste no more time arguing what a good man should be. Be one.",
    ],
    bookAuthorNames: ["Marcus Aurelius"],
    worksInLibrary: ["meditations"],
    portraitPlaceholder: "linear-gradient(135deg, #7F1D1D, #B91C1C)",
  },

  {
    id: "seneca",
    name: "Seneca",
    fullName: "Lucius Annaeus Seneca",
    birthYear: -4,
    deathYear: 65,
    birthPlace: "Corduba, Hispania (modern Córdoba, Spain)",
    nationality: "Roman",
    era: "Ancient",
    traditions: ["Roman"],
    bio: `Lucius Annaeus Seneca was born around 4 BCE in Corduba (modern Córdoba) in the Roman province of Hispania, came to Rome as a young man, and rose through the legal and political ranks to become one of the most prominent figures of the first century CE. His life was marked by dramatic reversals: he was nearly executed by the Emperor Caligula, exiled to Corsica by Claudius on dubious charges of adultery, recalled to Rome to serve as tutor and then chief minister to the young Nero, and finally, accused of involvement in the Pisonian conspiracy against Nero in 65 CE, forced to commit suicide. He opened his veins in his bath, in deliberate imitation of Socrates's death — a conscious performance of the Stoic dying well that he had written about at length.

The tension between Seneca's philosophical ideals and his political life has fascinated and troubled readers ever since antiquity. He preached the Stoic virtues of simplicity, detachment from wealth, and indifference to worldly power while accumulating one of the largest fortunes in Rome, owning villas across the empire, and lending money at usurious rates in Britain. His contemporary critics, and many subsequent ones, have accused him of hypocrisy. Seneca's own answer — articulated most fully in the essay On the Shortness of Life and in the Letters to Lucilius — is that the philosopher is not already wise but is engaged in the unfinished work of becoming so, and that the very awareness of one's failures is evidence of moral progress. Whether this is wisdom or sophisticated self-justification is left to the reader.

The Letters to Lucilius — 124 letters addressed to a friend in Sicily, covering topics from how to spend the morning to how to face death — are his most accessible and psychologically rich work. They are not really personal correspondence but literary essays in epistolary form, and they represent the fullest expression of Seneca's Stoicism: the insistence that time is the most precious thing we have and that most of us waste it in distraction, social performance, and the pursuit of things that do not satisfy. His tragedies — Medea, Thyestes, Phaedra — written for private reading rather than stage performance, influenced Renaissance dramatists from Marlowe to Shakespeare in ways that shaped the entire tradition of revenge tragedy.`,
    notableWorks: ["Letters to Lucilius", "On the Shortness of Life", "Medea (play)", "Thyestes"],
    themes: ["Time and mortality", "Stoic virtue", "Wealth and simplicity", "Friendship", "Facing death"],
    influence: "Seneca's prose style — dense, epigrammatic, and psychologically penetrating — influenced every subsequent Latin writer and, through Renaissance translations, shaped Shakespeare's rhetoric and the entire tradition of English moral essay writing; his tragedies gave European Renaissance drama its taste for elaborate rhetoric and extravagant revenge.",
    funFact: "Seneca's tragedies were almost certainly never performed on stage during his lifetime — they were composed as 'closet dramas' for private reading — yet they had a more direct influence on Renaissance theater than any ancient works actually written for performance.",
    quotes: [
      "We suffer more in imagination than in reality.",
      "Life is long, if you know how to use it.",
      "Nusquam est qui ubique est — he who is everywhere is nowhere.",
    ],
    bookAuthorNames: ["Seneca", "Lucius Annaeus Seneca"],
    worksInLibrary: ["letters-to-lucilius"],
    portraitPlaceholder: "linear-gradient(135deg, #991B1B, #DC2626)",
  },

  {
    id: "julius-caesar",
    name: "Julius Caesar",
    fullName: "Gaius Julius Caesar",
    birthYear: -100,
    deathYear: -44,
    birthPlace: "Rome, Roman Republic",
    nationality: "Roman",
    era: "Ancient",
    traditions: ["Roman"],
    bio: `Gaius Julius Caesar was born in Rome in 100 BCE into a patrician family of the gens Julia, which claimed descent from the goddess Venus through the Trojan hero Aeneas. He was one of the most brilliant generals, most skillful politicians, and most gifted writers of the ancient world — a combination that made him the dominant figure of the late Roman Republic and ultimately the man whose career ended the Republic itself. His military campaigns spanned from Spain to Egypt to Britain; his political innovations and constitutional manipulations set the template for autocratic rule in the Roman world; and his assassination in the Theatre of Pompey on March 15, 44 BCE, ignited the final civil wars that would produce the Roman Empire under his adopted heir Octavian.

Caesar's literary works are few but extraordinary. The Commentarii de Bello Gallico — the account of his Gallic Wars from 58 to 50 BCE — was written in seven books during or immediately after the campaigns themselves, ostensibly as dispatches to the Roman public but actually as masterpieces of self-promotion disguised as military reportage. They are written in the third person — "Caesar did this, Caesar decided that" — a device that creates a peculiar effect of objectivity and cool competence while placing Caesar unambiguously at the center of everything. The prose is famously clear and direct, a model of Latin style that generations of students have been set to translate precisely because of its transparency. Yet the clarity serves a purpose: Caesar is always decisive, always right, always merciful when mercy is politic and firm when firmness is required.

The De Bello Civili, covering the civil war against Pompey and the Senate, is slightly less polished but equally calculated — Caesar again the protagonist, again presented as reluctant, reasonable, repeatedly provoked, and ultimately victorious. Together the Commentarii are the most sophisticated piece of political communication to survive from the ancient world: the record of a man who understood that history is written by winners, and who had no intention of leaving the writing to others.`,
    notableWorks: ["De Bello Gallico", "De Bello Civili"],
    themes: ["Conquest and empire", "Military strategy", "Roman virtue", "Political power", "Rhetoric"],
    influence: "Caesar's Commentarii established the model of the first-person military memoir as political self-justification, a genre that runs through Napoleon's bulletins to Winston Churchill's war memoirs; his clear Latin prose became the standard for generations of language students, and his political career effectively ended the Roman Republic.",
    funFact: "Caesar is said to have been captured by pirates as a young man; he cheerfully spent his captivity improving the ransom they demanded (he felt they had undervalued him), promised to crucify them all when he was free, and kept his word — though he reportedly cut their throats first as a gesture of mercy.",
    quotes: [
      "Veni, vidi, vici.",
      "The die is cast.",
      "Men willingly believe what they wish.",
    ],
    bookAuthorNames: ["Julius Caesar", "Gaius Julius Caesar", "Caesar"],
    worksInLibrary: ["de-bello-gallico"],
    portraitPlaceholder: "linear-gradient(135deg, #7F1D1D, #991B1B)",
  },

  {
    id: "cicero",
    name: "Cicero",
    fullName: "Marcus Tullius Cicero",
    birthYear: -106,
    deathYear: -43,
    birthPlace: "Arpinum, Roman Republic",
    nationality: "Roman",
    era: "Ancient",
    traditions: ["Roman"],
    bio: `Marcus Tullius Cicero was born in 106 BCE in Arpinum, a small town southeast of Rome, into an equestrian family of no particular distinction. By force of his extraordinary rhetorical talent, relentless political ambition, and astonishing capacity for work, he rose to become the dominant figure in Roman public life in the last generation of the Republic — consul in 63 BCE, champion of the Senate against Julius Caesar, and ultimately a martyr to the republican cause. He was proscribed by Mark Antony after Caesar's assassination and murdered in December 43 BCE; Antony reportedly had his hands as well as his head cut off and nailed to the rostra in the Roman Forum — the platform from which Cicero had spoken. It was a political statement about oratory's power.

Cicero was the greatest orator of the ancient world by nearly universal ancient testimony, and his speeches — the Catilinarian orations, the defense of Milo, the Philippics against Antony — survive as masterpieces of Latin rhetoric that shaped the stylistic ideals of Western prose for two millennia. But his philosophical works, written in a burst of productivity after his political exclusion in the late 40s BCE, are arguably equally important: De Amicitia (On Friendship), De Senectute (On Old Age), De Officiis (On Duties), De Re Publica, and the Tusculan Disputations are all adaptations and syntheses of Greek philosophical ideas — primarily Stoic and Academic — into Latin form. Cicero's stated purpose was to give Rome a philosophical literature that would match its political and literary achievements, and he succeeded: through his translations and adaptations, Greek philosophy entered the Latin West and, through Latin, the entire subsequent European tradition.

De Amicitia, composed in 44 BCE after the death of his close friend Atticus, remains one of the most beautiful meditations on friendship ever written. For Cicero, true friendship — as opposed to the political alliances and social ties that Romans usually called by that name — requires complete mutual knowledge, shared virtue, and a willingness to speak truth even when it hurts. His public career, full of political compromises and strategic relationships, stands in ironic contrast to this ideal, which gives the essay a poignant quality it would not otherwise have.`,
    notableWorks: ["De Amicitia", "De Republica", "Philippics", "On Duties"],
    themes: ["Friendship and virtue", "Republican government", "Oratory", "Moral philosophy", "Death and exile"],
    influence: "Cicero's Latin prose style became the canonical model for educated writing throughout Europe from the Renaissance through the eighteenth century; his transmission of Greek philosophy into Latin gave the Western Middle Ages and Renaissance their primary access to Stoic and Academic thought, and his political speeches defined the rhetorical tradition of democratic deliberation.",
    funFact: "Cicero's correspondence — over 900 surviving letters to and from friends, family, and political allies — is the most extensive body of private letters to survive from the ancient world; they reveal a man very different from the composed orator of the public speeches: anxious, vain, funny, and perpetually uncertain about his choices.",
    quotes: [
      "A room without books is like a body without a soul.",
      "If you have a garden and a library, you have everything you need.",
      "The higher we are placed, the more humbly we should walk.",
    ],
    bookAuthorNames: ["Cicero", "Marcus Tullius Cicero"],
    worksInLibrary: ["on-friendship"],
    portraitPlaceholder: "linear-gradient(135deg, #B91C1C, #DC2626)",
  },

  // ── MEDIEVAL (ADDITIONAL) ──────────────────────────────────────────────────

  {
    id: "augustine",
    name: "Augustine",
    fullName: "Augustine of Hippo",
    birthYear: 354,
    deathYear: 430,
    birthPlace: "Thagaste, Numidia (modern Algeria)",
    nationality: "Berber-Roman",
    era: "Medieval",
    traditions: ["Medieval European"],
    bio: `Aurelius Augustinus was born in 354 CE in Thagaste, a small town in Roman North Africa in what is now northeastern Algeria. His mother Monica was a devout Christian; his father Patricius was a pagan who converted only on his deathbed. Augustine received an excellent classical education, moved to Carthage to study rhetoric, took a concubine with whom he lived for fifteen years and had a son, and embraced Manichaeism — a dualist religion that divided the world between good and evil forces — as an intellectual answer to the problem of evil that Christianity had failed to resolve for him. He moved to Rome, then to Milan, where he came under the influence of Bishop Ambrose; there he read the Neoplatonists, underwent a slow intellectual conversion to Christianity, and in a garden in Milan in 386 CE — hearing a child's voice saying "take up and read" — experienced the spiritual conversion that he describes as the turning point of his life.

The Confessions, written around 397-400 CE, is one of the most remarkable books in the history of world literature: the first autobiography in the Western tradition, and possibly the first sustained work of introspective prose anywhere. It is addressed directly to God — "Thou madest us for Thyself, and our heart is restless, until it repose in Thee" — and it traces Augustine's intellectual and spiritual journey from his childhood in Thagaste through his years of sexual pleasure, philosophical searching, and religious error to his conversion and the death of his mother Monica, which he describes with devastating grief. What makes it simultaneously a work of theology and of literature is the quality of Augustine's self-examination: he is trying to understand how God has been present in his life even when he was farthest from God, and the attempt requires an analysis of memory, time, desire, and the self's relation to its own past that has never been surpassed.

As Bishop of Hippo from 395 CE until his death in 430 — dying as the Vandals besieged the city — Augustine was the most influential theologian in Western Christianity. The City of God, written in response to the sack of Rome by Alaric in 410, is his great political theology: a distinction between the earthly city (organized around the love of self) and the heavenly city (organized around the love of God) that shaped Christian political thought for a millennium. His doctrines of original sin, predestination, and grace — developed in the controversies against the Pelagians — defined the parameters of Western Christian theology in ways that are still debated today.`,
    notableWorks: ["Confessions", "City of God", "On the Trinity"],
    themes: ["Conversion and grace", "Memory and time", "Sin and redemption", "The nature of God", "Restless heart"],
    influence: "Augustine is the most influential Christian theologian after Paul; his Confessions invented the autobiography as a literary form, his doctrine of grace and original sin shaped both Catholic and Protestant theology, and his synthesis of Platonism with Christianity defined the intellectual framework of the Latin Middle Ages.",
    funFact: "Augustine's mother Monica pursued him across the Mediterranean from North Africa to Italy in her determination to see him converted — a pursuit that lasted years and required extraordinary persistence; she died shortly after his conversion, apparently content that her life's work was complete.",
    quotes: [
      "Our heart is restless, until it repose in Thee.",
      "Love, and do what you will.",
      "Thou hast made us for thyself, O Lord, and our heart is restless until it finds its rest in thee.",
    ],
    bookAuthorNames: ["Augustine", "Saint Augustine", "Augustine of Hippo"],
    worksInLibrary: ["confessions"],
    portraitPlaceholder: "linear-gradient(135deg, #78350F, #92400E)",
  },

  // ── RENAISSANCE (ADDITIONAL) ───────────────────────────────────────────────

  {
    id: "niccolo-machiavelli",
    name: "Niccolò Machiavelli",
    birthYear: 1469,
    deathYear: 1527,
    birthPlace: "Florence, Republic of Florence",
    nationality: "Italian",
    era: "Renaissance",
    traditions: ["Renaissance"],
    bio: `Niccolò Machiavelli was born in Florence in 1469 into a family of modest means but ancient lineage, received a humanist education in Latin literature and history, and entered the service of the Florentine Republic in 1498 as Second Chancellor — a senior diplomatic and administrative position that took him on missions to Louis XII of France, the Holy Roman Emperor, Pope Julius II, and Cesare Borgia. His fourteen years of active public service gave him an education in practical politics that he drew on for the rest of his life. When the Medici returned to Florence in 1512 with Spanish military support and restored their autocratic rule, Machiavelli was dismissed, briefly imprisoned and tortured under suspicion of conspiracy, and then exiled to his farm at Sant'Andrea in Percussina, south of Florence. It was there, in compelled leisure and wounded ambition, that he wrote his major works.

The Prince, written in 1513 as a kind of job application addressed to Lorenzo de' Medici — Machiavelli wanted his old position back — is the most notorious political treatise ever written and one of the most misunderstood. Its central argument is not that rulers should be cruel or dishonest, but that the effective exercise of political power requires a clear-eyed understanding of how the world actually operates rather than how moral philosophy says it should operate. A ruler must know how to use both law (the human way) and force (the animal way); must be simultaneously lion and fox; must learn how not to be good when goodness would be self-defeating. The question Machiavelli asks — whether it is better to be loved or feared — is not answered with the cynicism popularly attributed to him but with a realistic analysis of human nature under political stress.

The Discourses on Livy, his longer and more republican work, reveals that Machiavelli's political ideal was not actually the strong prince but the Roman Republic — a well-ordered state in which civic virtue, distributed power, and popular participation could sustain liberty across generations. The Prince was written for a specific historical crisis; the Discourses represent his deeper convictions. Both books share the fundamental methodological innovation that defines Machiavelli's importance: the separation of political analysis from theology and moral philosophy, treating politics as a domain with its own laws, its own virtues, and its own necessities.`,
    notableWorks: ["The Prince", "Discourses on Livy", "The Art of War", "Mandragola"],
    themes: ["Political power", "Fortune and virtue", "Ends vs. means", "Republicanism", "Human nature"],
    influence: "Machiavelli invented modern political science by separating political analysis from moral theology; The Prince established the vocabulary and the analytical framework for thinking about power that every subsequent political theorist, from Hobbes to Gramsci, has had to engage with.",
    funFact: "Machiavelli wrote Mandragola — a brilliant, bawdy comedy still performed today — while simultaneously working on the serious political treatises; it was so successful that Pope Leo X reportedly laughed until he cried at a performance of it in Rome.",
    quotes: [
      "It is better to be feared than loved, if you cannot be both.",
      "Never was anything great achieved without danger.",
      "The lion cannot protect himself from traps, and the fox cannot defend himself from wolves.",
    ],
    bookAuthorNames: ["Niccolò Machiavelli", "Machiavelli", "Niccolo Machiavelli"],
    worksInLibrary: ["the-prince"],
    portraitPlaceholder: "linear-gradient(135deg, #1C1917, #292524)",
  },

  // ── ENLIGHTENMENT (ADDITIONAL) ─────────────────────────────────────────────

  {
    id: "jean-jacques-rousseau",
    name: "Jean-Jacques Rousseau",
    birthYear: 1712,
    deathYear: 1778,
    birthPlace: "Geneva, Republic of Geneva",
    nationality: "Genevan-French",
    era: "Enlightenment",
    traditions: ["Enlightenment"],
    bio: `Jean-Jacques Rousseau was born in Geneva in 1712 to a watchmaker father and a mother who died shortly after his birth. His early life was itinerant and disorderly: he worked as an engraver's apprentice, a lackey, a music teacher, and a secretary, moving through Turin, Annecy, Paris, and Venice before settling in Paris in the 1740s. There he became a contributor to Diderot's Encyclopédie, struck up friendships with the philosophes, and then — in a famous moment of illumination on the road to Vincennes in 1749 — had what he described as a sudden vision in which he saw that civilization and human progress were not synonymous: that the arts and sciences had corrupted humanity rather than elevated it, and that man was naturally good but had been made wicked by social institutions. This insight drove everything he subsequently wrote.

The Discourse on the Sciences and the Arts (1750) and the Discourse on the Origin of Inequality (1755) set out his central diagnosis: natural man — the "noble savage," a term Rousseau himself never used — existed in a state of innocent self-sufficiency, neither virtuous nor vicious, because virtue and vice are social categories. The inequality that organizes all human societies was not natural but artificially created by the first man who enclosed a piece of ground and said "this is mine." The Social Contract (1762), his most systematic political work, attempts to answer the question of how human beings, once irreversibly in society, can organize themselves without sacrificing their freedom: his answer, the "general will," is a collective sovereignty that represents not the will of all (the sum of particular interests) but the common good — and to which each citizen must submit absolutely, since to obey the general will is to obey one's own truest self. This argument has been read both as the foundation of modern democracy and as a blueprint for totalitarianism.

Émile (1762), published in the same year as the Social Contract and immediately condemned and burned alongside it, is Rousseau's treatise on education: the account of how a hypothetical child named Émile should be raised in accordance with nature rather than social convention, learning through experience rather than books until he is old enough to receive moral and civic education. The Confessions, written in his final years, are the first great modern autobiography and a deliberate response to Augustine: where Augustine confessed his sins to God and the reader, Rousseau confessed himself to the public with an unprecedented frankness about sexuality, petty theft, cruelty, and the deep inconsistency between his ideals and his behavior — he had five children with his companion Thérèse Levasseur and sent all of them to foundling hospitals.`,
    notableWorks: ["The Social Contract", "Emile", "Confessions", "Discourse on Inequality"],
    themes: ["Natural goodness", "Social corruption", "General will", "Education", "Freedom and equality"],
    influence: "Rousseau is the intellectual father of both the French Revolution and Romanticism; his critique of civilization as corrupting natural goodness established the framework for modern political radicalism, and his autobiographical writings invented the confessional mode of self-exploration that runs through the entire Romantic tradition.",
    funFact: "Rousseau's Confessions, which he intended as the most honest self-portrait in literary history, actually contains several documented falsehoods and selective omissions — a fact that has made the book simultaneously the most important autobiography ever written and a cautionary case study in the limits of self-knowledge.",
    quotes: [
      "Man is born free, and everywhere he is in chains.",
      "The world of reality has its limits; the world of imagination is boundless.",
      "Patience is bitter, but its fruit is sweet.",
    ],
    bookAuthorNames: ["Jean-Jacques Rousseau", "Rousseau"],
    worksInLibrary: ["the-social-contract"],
    portraitPlaceholder: "linear-gradient(135deg, #164E63, #0E7490)",
  },

  // ── 19TH CENTURY (ADDITIONAL) ─────────────────────────────────────────────

  {
    id: "charlotte-bronte",
    name: "Charlotte Brontë",
    birthYear: 1816,
    deathYear: 1855,
    birthPlace: "Thornton, Yorkshire, England",
    nationality: "British",
    era: "Modern",
    traditions: ["Victorian"],
    bio: `Charlotte Brontë was born in 1816 in Thornton, Yorkshire, the third of Patrick Brontë's six children, and grew up at Haworth Parsonage on the edge of the moors after the family moved there in 1820. The deaths of her two eldest sisters, Maria and Elizabeth, at the Clergy Daughters' School at Cowan Bridge — an experience she would fictionally recreate as Lowood in Jane Eyre — scarred her childhood. She and her siblings, isolated by their situation and stimulated by their father's library and the wild landscape, created elaborate fantasy worlds in childhood: Charlotte and Branwell invented the kingdom of Angria, with its Byronic heroes and political intrigues, and produced hundreds of thousands of words of tiny handwritten fiction in miniature books. This early apprenticeship in romantic excess gave Charlotte both the material and the habits she would spend her adult career disciplining into art.

She worked as a governess, briefly attended school in Brussels with her sister Emily, and fell into an unrequited attachment to her teacher there, Constantin Heger — an experience that surfaces in the intensity of Jane Eyre and in the more openly autobiographical Villette. Her first serious attempt at publication was a poetry collection produced jointly with Emily and Anne under the pseudonyms Currer, Ellis, and Acton Bell (they retained initials to avoid the dismissal of female authorship while not definitively claiming maleness). Jane Eyre (1847), published the same year as Wuthering Heights, was an immediate sensation — Victorian readers responded to its first-person female narrator's insistence on her own feelings and dignity with a mixture of excitement and unease. The novel's famous declaration — "I am no bird; and no net ensnares me" — announced a new kind of heroine: poor, plain, morally fierce, and absolutely unwilling to accept inferior treatment as natural or deserved.

Shirley (1849) and Villette (1853) are less read but equally remarkable works that show Charlotte extending her range: Shirley engages directly with Luddite labor unrest and the position of women in industrial England; Villette — her darkest and most psychologically acute novel — draws deeply on the Brussels experience and her unreciprocated love for Heger, presenting loneliness, repression, and female desire with a frankness that troubled even her publisher. She died in 1855 at thirty-eight, having recently married her father's curate, Arthur Bell Nicholls, possibly of complications from pregnancy.`,
    notableWorks: ["Jane Eyre", "Villette", "Shirley"],
    themes: ["Independence and self-respect", "Love and morality", "Class and gender", "Passion vs. reason", "Female autonomy"],
    influence: "Charlotte Brontë's Jane Eyre established the template for the independent female narrator who refuses to subordinate her inner life to social expectation, creating a model for the feminist novel that extends from George Eliot through the twentieth century; her influence on popular romance and Gothic fiction is incalculable.",
    funFact: "When Charlotte Brontë first sent Jane Eyre to her publisher, she was so anxious about its reception that she told no one, including her sisters, that she had submitted it; she received the acceptance letter alone in the dining room at Haworth and was so moved that she could barely tell her sisters what had happened.",
    quotes: [
      "I am no bird; and no net ensnares me.",
      "I would always rather be happy than dignified.",
      "Life is so constructed that the event does not, cannot, will not, match the expectation.",
    ],
    bookAuthorNames: ["Charlotte Brontë", "Charlotte Bronte", "Currer Bell"],
    worksInLibrary: ["jane-eyre"],
    portraitPlaceholder: "linear-gradient(135deg, #4C1D95, #6D28D9)",
  },

  {
    id: "alexandre-dumas",
    name: "Alexandre Dumas",
    birthYear: 1802,
    deathYear: 1870,
    birthPlace: "Villers-Cotterêts, France",
    nationality: "French",
    era: "Modern",
    traditions: ["Romantic"],
    bio: `Alexandre Dumas was born in 1802 in Villers-Cotterêts, a small town north of Paris, the son of Thomas-Alexandre Dumas Davy de la Pailleterie — a general in Napoleon's army who was the son of a French nobleman and an enslaved Haitian woman named Marie-Cessette Dumas. Thomas-Alexandre was one of the most brilliant and physically formidable officers in Napoleon's army, commanding cavalry in some of the most dangerous actions of the Revolutionary and Napoleonic Wars; Napoleon eventually turned against him, partly from racism, and left him to rot in a Neapolitan prison. He died when Alexandre was three. The mixed-race heritage and his father's extraordinary story haunted Alexandre his whole life, feeding his taste for adventure, his instinct for the romantically dispossessed hero, and his complicated relationship with the French establishment that both celebrated and condescended to him.

Dumas's output was prodigious and collaborative — he employed a team of researchers and co-writers, most famously Auguste Maquet, who helped with the historical research and plotting for his major novels. This has sometimes been used to diminish him, but the best of Dumas — the narrative momentum, the dialogue, the characterization, the sheer pleasure of the adventure — are unmistakably his. The Three Musketeers (1844), serialized in Le Siècle, introduced Athos, Porthos, Aramis, and the young d'Artagnan to the world: a romance of friendship, loyalty, and sword-fighting set in the reign of Louis XIII that remains one of the most purely entertaining novels ever written. Its motto — "All for one, one for all" — became a byword for solidarity across cultures and languages.

The Count of Monte Cristo (1844-46), serialized at the same time, is even more ambitious: the story of Edmond Dantès, a sailor falsely imprisoned in the Château d'If who escapes after fourteen years, discovers a fabulous treasure on the island of Monte Cristo, and returns to Paris in disguise as the fabulously wealthy Count to take methodical revenge on those who destroyed his life. The novel is simultaneously a revenge fantasy, a meditation on justice and its corruption, and a study in the psychological costs of living for vengeance alone. Its plot of false imprisonment and engineered downfall drew on Dumas's father's story, and its hero's transformation from innocent victim to calculating avenger explores questions about identity and moral corruption that give it depths beyond its adventure surface.`,
    notableWorks: ["The Three Musketeers", "The Count of Monte Cristo", "Twenty Years After"],
    themes: ["Adventure and honor", "Revenge and justice", "Friendship", "Social injustice", "Transformation"],
    influence: "Dumas perfected the serialized adventure novel and established the swashbuckling romance as a major literary genre; his influence on popular fiction — adventure, crime, historical romance — is enormous, and the Count of Monte Cristo in particular has generated more adaptations than almost any other nineteenth-century novel.",
    funFact: "Dumas was so prolific and successful that he built a fantasy chateau near Paris he called Monte-Cristo, with elaborate Gothic towers and Renaissance wings — and almost immediately went bankrupt trying to maintain it, forcing him to write even faster to pay the bills.",
    quotes: [
      "All human wisdom is summed up in two words: wait and hope.",
      "Nothing succeeds like success.",
      "How is it that little children are so intelligent and men so stupid? It must be education that does it.",
    ],
    bookAuthorNames: ["Alexandre Dumas", "Dumas"],
    worksInLibrary: ["the-three-musketeers", "the-count-of-monte-cristo"],
    portraitPlaceholder: "linear-gradient(135deg, #2E1065, #4C1D95)",
  },

  // ── EARLY 20TH CENTURY (ADDITIONAL) ───────────────────────────────────────

  {
    id: "joseph-conrad",
    name: "Joseph Conrad",
    birthYear: 1857,
    deathYear: 1924,
    birthPlace: "Berdychiv, Russian Empire (modern Ukraine)",
    nationality: "Polish-British",
    era: "Modern",
    traditions: ["Modernist"],
    bio: `Joseph Conrad was born Józef Teodor Konrad Korzeniowski in 1857 in Berdychiv, in the Russian-controlled part of what had been Poland, to a family of patriotic Polish gentry. His father was a poet and translator who was exiled to northern Russia for anti-Tsarist activities when Conrad was four; both parents died of tuberculosis before he was twelve. He went to sea at seventeen, worked his way up in the French and then British merchant marine, became a British subject in 1886, obtained his master's certificate, and commanded his own ship on the Congo River in 1890 — an experience that destroyed his health, gave him the material for Heart of Darkness, and left a mark on him that he spent the rest of his literary career trying to understand. He published his first novel in 1895 at the age of thirty-eight and spent the next three decades producing a body of fiction that permanently changed what the English novel could do, despite — or because of — the fact that English was his third language after Polish and French.

Heart of Darkness (1899) is his most compressed and most debated work: Marlow's account of a journey up the Congo River to find Kurtz, a brilliant ivory trader and idealist who has "gone native" and established himself as a god among the Congolese, told retrospectively on a boat on the Thames. The novella simultaneously indicts Belgian colonial brutality with unsparing specificity and presents the African continent through a narrative perspective that many contemporary critics — above all Chinua Achebe in his famous 1975 essay — have condemned as itself a vehicle of racial dehumanization. Both things are true: Conrad was both a genuine critic of imperialism and a writer whose imagination remained shaped by the racist assumptions of his era. The resulting tension is not a flaw to be explained away but the central condition of engaging with the text.

Lord Jim (1900) and Nostromo (1904) are his major novels. Lord Jim explores the psychology of shame and self-deception through the story of a merchant officer who abandons a ship he believed was sinking, leaving hundreds of pilgrims to what he expected to be their deaths; the ship didn't sink, the passengers survived, and Jim spends the rest of his life in exile from the maritime world, searching for a chance at redemption. The Secret Agent (1907) and Under Western Eyes (1911) are his political novels, both dealing with revolutionary conspiracies and secret service operations in a world where idealism routinely destroys those who hold it.`,
    notableWorks: ["Heart of Darkness", "Lord Jim", "Nostromo", "The Secret Agent"],
    themes: ["Colonialism and its horrors", "Moral ambiguity", "Identity and belonging", "Darkness within civilization", "Loyalty and betrayal"],
    influence: "Conrad established the morally ambiguous, unreliable narrator at the center of Modernist fiction and provided the definitive literary account of imperialism's psychological costs; T.S. Eliot borrowed the epigraph of Heart of Darkness for The Hollow Men, and his narrative techniques directly influenced Ford Madox Ford, Graham Greene, and the entire tradition of the political thriller.",
    funFact: "Conrad learned English as an adult from reading newspapers, Shakespeare, and the sea — and never lost his heavily accented spoken English, which visitors found incongruous with the precision and beauty of his written prose; Henry James reportedly said that Conrad talked like a foreign count, but wrote like an English gentleman.",
    quotes: [
      "The mind of man is capable of anything.",
      "We live as we dream—alone.",
      "I don't like work... but I like what is in the work—the chance to find yourself.",
    ],
    bookAuthorNames: ["Joseph Conrad", "Conrad"],
    worksInLibrary: ["heart-of-darkness"],
    portraitPlaceholder: "linear-gradient(135deg, #111827, #1F2937)",
  },

  {
    id: "anton-chekhov",
    name: "Anton Chekhov",
    birthYear: 1860,
    deathYear: 1904,
    birthPlace: "Taganrog, Russian Empire",
    nationality: "Russian",
    era: "Modern",
    traditions: ["Russian"],
    bio: `Anton Pavlovich Chekhov was born in 1860 in Taganrog, a provincial town on the Sea of Azov, the third of six children of a grocer whose business eventually failed, leaving the family in poverty. He worked his way through medical school in Moscow by writing comic sketches and short stories for popular magazines, supporting not only himself but his mother, his brothers, and sister. He was both doctor and writer for his entire adult life, practicing medicine in Moscow and later on his estate at Melikhovo, and treating his writing with the same diagnostic precision he brought to his patients. He died of tuberculosis in 1904 at forty-four in a German spa, a disease he had known about for years and characterized with typical ironic understatement: "I feel fine, except for those minor symptoms of approaching death."

Chekhov is the supreme short story writer in any language — a judgment held by nearly all the major writers who came after him. He transformed the form by removing virtually everything that had previously been considered essential: plot, decisive action, redemptive conclusion, clearly articulated theme. A Chekhov story presents a moment or a series of moments in which nothing much happens, except that something is permanently revealed about the nature of the characters' lives — the gap between what they want and what they have, between what they say and what they mean, between the life they imagined and the one they are living. "The Lady with the Dog," "Ward No. 6," "The Bishop," "Gooseberries," "The Kiss" — the stories are inexhaustible and each reading changes them.

His plays — The Seagull, Uncle Vanya, Three Sisters, The Cherry Orchard — gave the same treatment to drama. They are plays in which characters discuss their desire to go to Moscow, to be free, to begin their lives properly, while continuing to sit in their armchairs doing nothing; in which the important events happen offstage or in the interval between acts; in which the poignancy of ordinary existence — its repetitions, its missed connections, its beauty and its waste — is the only subject. The Cherry Orchard (1904), his last play, premiered just weeks before his death: a comedy about an aristocratic family losing their estate, played by Stanislavski as tragedy, which Chekhov protested was wrong. Both were right.`,
    notableWorks: ["The Cherry Orchard", "Three Sisters", "Uncle Vanya", "The Seagull"],
    themes: ["Passage of time", "Decline and change", "Unfulfilled longing", "Communication failure", "Ordinary life as tragedy"],
    influence: "Chekhov reinvented both the short story and stage drama, establishing an aesthetic of indirection, understatement, and the pressure of the unspoken that influenced virtually every serious writer of the twentieth century; his techniques of subtext and ambiguity became the grammar of modern fiction.",
    funFact: "Chekhov invented what became known as 'Chekhov's Gun' — his principle that every element in a story must be necessary, so that if a gun appears in the first act, it must be fired by the last — a principle so influential it is now a standard rule of storytelling taught in writing programs worldwide.",
    quotes: [
      "Any idiot can face a crisis; it's this day-to-day living that wears you out.",
      "Don't tell me the moon is shining; show me the glint of light on broken glass.",
      "If you cry 'Forward!', you must make plain in what direction.",
    ],
    bookAuthorNames: ["Anton Chekhov", "Chekhov"],
    worksInLibrary: ["the-cherry-orchard"],
    portraitPlaceholder: "linear-gradient(135deg, #1E3A5F, #1E40AF)",
  },

  // ── CONTEMPORARY ──────────────────────────────────────────────────────────

  {
    id: "albert-camus",
    name: "Albert Camus",
    birthYear: 1913,
    deathYear: 1960,
    birthPlace: "Dréan, French Algeria",
    nationality: "French-Algerian",
    era: "Contemporary",
    traditions: ["French", "Modernist"],
    bio: `Albert Camus was born in 1913 in Dréan (then Mondovi), a small town in French Algeria, to a French-Algerian (pied-noir) family of very modest means. His father was killed at the Battle of the Marne when Camus was less than a year old; he grew up in poverty in Algiers with his mother, who was largely deaf and barely literate, and his grandmother. A tuberculosis diagnosis at seventeen threatened his education and health for the rest of his life, but he won a scholarship to study philosophy in Algiers and, under the mentorship of his teacher Jean Grenier, developed the philosophical sensibility that would define his work: a confrontation with the fundamental absurdity of human existence — the gap between the human need for meaning, clarity, and justice and the universe's absolute silence on all these questions.

The Stranger (L'Étranger, 1942) and The Myth of Sisyphus (1942), published in the same year, establish the twin poles of Camus's early thought. The Stranger is the story of Meursault, a French-Algerian clerk who kills an Arab on a beach in Algiers, apparently without motive, and is tried and convicted not for the murder but for his failure to grieve at his mother's funeral and his general emotional non-conformity. The novel's famous opening — "Mother died today. Or maybe yesterday; I can't be sure" — announces a narrator whose relationship to conventional feeling is radically disengaged, and the novel's power comes from the reader's gradual uncertainty about whether Meursault is a monster, a saint, or simply honest. The Myth of Sisyphus, the philosophical companion, argues that the only serious philosophical question is suicide: whether, given the absurdity of existence, life is worth living. Camus's answer is yes — one must imagine Sisyphus happy.

The Plague (La Peste, 1947), set in Oran, Algeria during a bubonic plague epidemic, is his most explicitly humanist and politically engaged novel: an allegory of the Nazi occupation of France written as a chronicle of a doctor's moral duty in the face of catastrophe. Camus broke with Sartre and the French left in 1951 over The Rebel, his critique of revolutionary violence and totalitarian logic, and spent the final decade of his life as the most controversial intellectual in France — criticized by Sartrean existentialists for insufficient political engagement and by the French right for his support of Algerian rights. He received the Nobel Prize in Literature in 1957. He died in a car accident in January 1960, aged forty-six, with an unfinished novel manuscript in his briefcase.`,
    notableWorks: ["The Stranger", "The Plague", "The Myth of Sisyphus", "The Fall"],
    themes: ["The absurd", "Alienation", "Revolt and freedom", "Mortality", "Colonial Algeria"],
    influence: "Camus is the defining philosopher of the absurd and one of the central figures of twentieth-century European humanism; The Stranger became the essential text of postwar alienation and has sold over ten million copies, and his distinction between absurdism and existentialism opened a philosophical conversation that continues today.",
    funFact: "Camus was the second-youngest Nobel laureate in Literature when he received the prize in 1957 at age forty-four, and his acceptance speech — in which he described the writer's obligation to serve truth and freedom — is still considered one of the finest Nobel addresses ever delivered.",
    quotes: [
      "In the depth of winter, I finally learned that within me there lay an invincible summer.",
      "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.",
      "You will never be happy if you continue to search for what happiness consists of.",
    ],
    bookAuthorNames: ["Albert Camus", "Camus"],
    worksInLibrary: ["the-stranger"],
    portraitPlaceholder: "linear-gradient(135deg, #2E1065, #5B21B6)",
  },
]

// ── Helper Functions ────────────────────────────────────────────────────────

/**
 * Convert a display name to a kebab-case slug.
 * "Jane Austen" → "jane-austen"
 */
export function authorSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")   // remove non-alphanumeric except spaces and hyphens
    .trim()
    .replace(/\s+/g, "-")            // spaces → hyphens
    .replace(/-+/g, "-")             // collapse multiple hyphens
}

/**
 * Look up an author by their kebab-case id slug.
 */
export function getAuthorById(id: string): Author | undefined {
  return AUTHORS.find((a) => a.id === id)
}

/**
 * Look up an author by name. Tries exact match on `name` and `fullName` first,
 * then falls back to case-insensitive comparison, then tries matching against
 * `bookAuthorNames` variants.
 */
export function getAuthorByName(name: string): Author | undefined {
  // Exact match on display name or full name
  const exact = AUTHORS.find(
    (a) => a.name === name || a.fullName === name
  )
  if (exact) return exact

  // Case-insensitive match on display name or full name
  const lower = name.toLowerCase()
  const caseInsensitive = AUTHORS.find(
    (a) =>
      a.name.toLowerCase() === lower ||
      (a.fullName?.toLowerCase() ?? "") === lower
  )
  if (caseInsensitive) return caseInsensitive

  // Match against bookAuthorNames variants (case-insensitive)
  return AUTHORS.find((a) =>
    a.bookAuthorNames?.some((variant) => variant.toLowerCase() === lower)
  )
}

/**
 * Return all authors belonging to a given literary tradition.
 * Matches case-insensitively.
 */
export function getAuthorsByTradition(tradition: string): Author[] {
  const lower = tradition.toLowerCase()
  return AUTHORS.filter((a) =>
    a.traditions.some((t) => t.toLowerCase() === lower)
  )
}

/**
 * Return all authors belonging to a given era.
 * Matches case-insensitively.
 */
export function getAuthorsByEra(era: string): Author[] {
  const lower = era.toLowerCase()
  return AUTHORS.filter((a) => a.era.toLowerCase() === lower)
}

// Type alias for use in new code
export type TomeAuthor = Author
