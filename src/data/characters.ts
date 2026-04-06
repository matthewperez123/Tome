export interface Character {
  name: string
  role: "protagonist" | "antagonist" | "supporting" | "narrator"
  bookId: string
  bookTitle: string
  author: string
  description: string
}

export const CHARACTERS: Character[] = [
  { name: "Odysseus", role: "protagonist", bookId: "the-odyssey", bookTitle: "The Odyssey", author: "Homer", description: "King of Ithaca, hero of the Trojan War" },
  { name: "Penelope", role: "supporting", bookId: "the-odyssey", bookTitle: "The Odyssey", author: "Homer", description: "Wife of Odysseus, faithful through his absence" },
  { name: "Telemachus", role: "supporting", bookId: "the-odyssey", bookTitle: "The Odyssey", author: "Homer", description: "Son of Odysseus, coming of age" },
  { name: "Achilles", role: "protagonist", bookId: "the-iliad", bookTitle: "The Iliad", author: "Homer", description: "Greatest Greek warrior, undone by pride" },
  { name: "Hector", role: "antagonist", bookId: "the-iliad", bookTitle: "The Iliad", author: "Homer", description: "Trojan prince and noblest warrior" },
  { name: "Dante", role: "protagonist", bookId: "the-inferno", bookTitle: "Inferno", author: "Dante Alighieri", description: "The pilgrim, lost in a dark wood" },
  { name: "Virgil", role: "supporting", bookId: "the-inferno", bookTitle: "Inferno", author: "Dante Alighieri", description: "Roman poet, Dante's guide through Hell" },
  { name: "Beatrice", role: "supporting", bookId: "the-inferno", bookTitle: "Inferno", author: "Dante Alighieri", description: "Dante's beloved, guide through Paradise" },
  { name: "Elizabeth Bennet", role: "protagonist", bookId: "pride-and-prejudice", bookTitle: "Pride and Prejudice", author: "Jane Austen", description: "Sharp-witted, independent, misjudges Darcy" },
  { name: "Mr. Darcy", role: "protagonist", bookId: "pride-and-prejudice", bookTitle: "Pride and Prejudice", author: "Jane Austen", description: "Proud, wealthy, learns to be worthy of Elizabeth" },
  { name: "Victor Frankenstein", role: "protagonist", bookId: "frankenstein", bookTitle: "Frankenstein", author: "Mary Shelley", description: "The creator who cannot face his creation" },
  { name: "The Creature", role: "antagonist", bookId: "frankenstein", bookTitle: "Frankenstein", author: "Mary Shelley", description: "Intelligent, articulate, monstrous only by rejection" },
  { name: "Hamlet", role: "protagonist", bookId: "hamlet", bookTitle: "Hamlet", author: "Shakespeare", description: "Prince of Denmark, paralyzed by doubt" },
  { name: "Ophelia", role: "supporting", bookId: "hamlet", bookTitle: "Hamlet", author: "Shakespeare", description: "Hamlet's beloved, destroyed by the men around her" },
  { name: "Claudius", role: "antagonist", bookId: "hamlet", bookTitle: "Hamlet", author: "Shakespeare", description: "The usurping king, Hamlet's uncle" },
  { name: "Romeo", role: "protagonist", bookId: "romeo-and-juliet", bookTitle: "Romeo and Juliet", author: "Shakespeare", description: "Young Montague, reckless in love" },
  { name: "Juliet", role: "protagonist", bookId: "romeo-and-juliet", bookTitle: "Romeo and Juliet", author: "Shakespeare", description: "Young Capulet, braver than Romeo" },
  { name: "Captain Ahab", role: "protagonist", bookId: "moby-dick", bookTitle: "Moby-Dick", author: "Herman Melville", description: "Monomaniac captain hunting the white whale" },
  { name: "Ishmael", role: "narrator", bookId: "moby-dick", bookTitle: "Moby-Dick", author: "Herman Melville", description: "Sailor and sole survivor" },
  { name: "Raskolnikov", role: "protagonist", bookId: "crime-and-punishment", bookTitle: "Crime and Punishment", author: "Dostoevsky", description: "Student who commits murder to test a theory" },
  { name: "Sonya", role: "supporting", bookId: "crime-and-punishment", bookTitle: "Crime and Punishment", author: "Dostoevsky", description: "The moral compass, redemption through suffering" },
  { name: "Jean Valjean", role: "protagonist", bookId: "les-miserables", bookTitle: "Les Mis\u00e9rables", author: "Victor Hugo", description: "Convict redeemed, pursued by justice" },
  { name: "Javert", role: "antagonist", bookId: "les-miserables", bookTitle: "Les Mis\u00e9rables", author: "Victor Hugo", description: "Inspector, law without mercy" },
  { name: "Jay Gatsby", role: "protagonist", bookId: "the-great-gatsby", bookTitle: "The Great Gatsby", author: "F. Scott Fitzgerald", description: "Self-invented millionaire chasing a green light" },
  { name: "Nick Carraway", role: "narrator", bookId: "the-great-gatsby", bookTitle: "The Great Gatsby", author: "F. Scott Fitzgerald", description: "The witness, drawn into Gatsby's orbit" },
  { name: "Jane Eyre", role: "protagonist", bookId: "jane-eyre", bookTitle: "Jane Eyre", author: "Charlotte Bront\u00eb", description: "Orphan, governess, unbreakable will" },
  { name: "Mr. Rochester", role: "protagonist", bookId: "jane-eyre", bookTitle: "Jane Eyre", author: "Charlotte Bront\u00eb", description: "Byronic master of Thornfield Hall" },
  { name: "Heathcliff", role: "protagonist", bookId: "wuthering-heights", bookTitle: "Wuthering Heights", author: "Emily Bront\u00eb", description: "Foundling turned vengeful force of nature" },
  { name: "Catherine", role: "protagonist", bookId: "wuthering-heights", bookTitle: "Wuthering Heights", author: "Emily Bront\u00eb", description: "Wild spirit torn between love and class" },
  { name: "Don Quixote", role: "protagonist", bookId: "don-quixote", bookTitle: "Don Quixote", author: "Cervantes", description: "Knight of the woeful countenance, tilting at windmills" },
  { name: "Sancho Panza", role: "supporting", bookId: "don-quixote", bookTitle: "Don Quixote", author: "Cervantes", description: "The loyal squire, grounded in reality" },
  { name: "Socrates", role: "protagonist", bookId: "the-republic", bookTitle: "The Republic", author: "Plato", description: "The gadfly of Athens, questioning everything" },
  { name: "Oedipus", role: "protagonist", bookId: "oedipus-rex", bookTitle: "Oedipus Rex", author: "Sophocles", description: "King who solves the riddle and damns himself" },
  { name: "Antigone", role: "protagonist", bookId: "antigone", bookTitle: "Antigone", author: "Sophocles", description: "Defies the state to bury her brother" },
  { name: "Medea", role: "protagonist", bookId: "medea", bookTitle: "Medea", author: "Euripides", description: "Sorceress betrayed, terrifying in revenge" },
  { name: "Count Dracula", role: "antagonist", bookId: "dracula", bookTitle: "Dracula", author: "Bram Stoker", description: "The ancient undead count of Transylvania" },
  { name: "Prospero", role: "protagonist", bookId: "the-tempest", bookTitle: "The Tempest", author: "Shakespeare", description: "The exiled duke, master of storms and spirits" },
  { name: "Aeneas", role: "protagonist", bookId: "the-aeneid", bookTitle: "The Aeneid", author: "Virgil", description: "Trojan refugee, destined to found Rome" },
  { name: "Dorian Gray", role: "protagonist", bookId: "the-picture-of-dorian-gray", bookTitle: "The Picture of Dorian Gray", author: "Oscar Wilde", description: "Beautiful youth, corrupted by a portrait" },
]
