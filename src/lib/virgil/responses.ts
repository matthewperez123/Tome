// ── Virgil Mock Response System ──
// This is the ONLY file that changes when the real Claude API ships.
// All 15 anchor passages use Samuel Butler's public-domain prose translation.
//
// Architecture: components call streamVirgilResponse(), which is an async generator.
// Today it yields from hand-written data. Tomorrow it wraps Anthropic's messages.stream().

import type { AnchorResponse, QuestionIntent, StreamInput } from "./types"

// ────────────────────────────────────────────────
// ANCHOR PASSAGES — The Odyssey (Butler translation)
// ────────────────────────────────────────────────

const ANCHORS: AnchorResponse[] = [
  // ── 1. Book I: The Invocation ──
  {
    passageId: "odyssey-1-invocation",
    passageText: "Tell me, O Muse, of that ingenious hero who travelled far and wide after he had sacked the famous town of Troy.",
    passageReference: "Book I, opening lines",
    triggers: ["muse", "ingenious hero", "tell me", "invocation", "opening", "first line", "beginning"],
    firstMessage: `You've stopped at the very first breath of the poem. There's something worth noticing in Butler's choice of "ingenious" for polytropos — a word that has been translated as "many-turning," "much-wandering," "of many devices." Each translation tells you what the translator thinks the poem is about.\n\nWhat drew you here — the prayer to the Muse, or the way Odysseus is introduced?`,
    responses: [
      {
        intent: "meaning",
        text: `The word Butler translates as "ingenious" is polytropos in the Greek — literally "of many turns." It's the first thing Homer tells us about Odysseus, before his name, before Troy, before anything. That's a choice.\n\n> "Tell me, O Muse, of that ingenious hero who travelled far and wide after he had sacked the famous town of Troy."\n> — Book I, opening lines\n\nSome translators render polytropos as "much-wandering," making it about the journey. Others choose "many-minded" or "of many devices," making it about character. Homer, I think, means both — the turns of the road and the turns of the mind are the same thing in this poem.\n\nCompare this to the Iliad's opening: "Sing, O goddess, the anger of Achilles." Achilles is defined by one emotion. Odysseus is defined by multiplicity. What does that tell you about what kind of hero Homer is building here?`
      },
      {
        intent: "why",
        text: `Homer begins with the Muse because the poet doesn't claim to own the story. This isn't autobiography — it's channeled memory, the collective voice of a tradition speaking through one mouth.\n\n> "Tell me, O Muse, of that ingenious hero who travelled far and wide after he had sacked the famous town of Troy."\n> — Book I, opening lines\n\nBut notice what Homer asks the Muse to tell: not the war, not the victory, but the journey home. The Iliad is about what happens at Troy. The Odyssey is about what happens after. It's the first sequel in Western literature, and also the first poem to say: the interesting part isn't the triumph. It's the cost.\n\nDo you think Homer is telling us something about what matters more — glory or homecoming?`
      },
      {
        intent: "context",
        text: `This invocation follows a formula as old as oral poetry itself — the poet calls on divine memory because mortal memory isn't enough. In a culture without writing (Homer composed before widespread Greek literacy), the Muse is not a metaphor. She is the technology of recall.\n\n> "Tell me, O Muse, of that ingenious hero who travelled far and wide after he had sacked the famous town of Troy."\n> — Book I, opening lines\n\nThe Iliad begins with "Sing" (aeide) — a command. The Odyssey begins with "Tell" (ennepe) — a request. It's a subtler, more intimate opening. The poet isn't demanding performance; he's asking for a conversation. Some scholars read this as a signal that the Odyssey is a more personal, more interior poem than the Iliad.\n\nDoes the tone here feel different to you than the Iliad's opening? What does that difference suggest about the kind of story we're entering?`
      },
    ],
  },

  // ── 2. Book I: Athena visits Telemachus ──
  {
    passageId: "odyssey-1-athena-telemachus",
    passageText: "Fly home, and bear in mind that you must never again be a child. You are now a man.",
    passageReference: "Book I",
    triggers: ["telemachus", "athena", "mentes", "child", "man", "coming of age", "grow up"],
    firstMessage: `Athena's visit to Telemachus is the beginning of a parallel story — the son's journey to manhood happening alongside the father's journey home. Homer gives us two odysseys, braided together.\n\nWhat strikes you about this moment — the directness of Athena's charge, or the fact that Telemachus needs a goddess to tell him what he already knows?`,
    responses: [
      {
        intent: "meaning",
        text: `Athena doesn't comfort Telemachus — she confronts him. She arrives disguised as Mentes, a family friend, and essentially says: your father may be dead, your house is overrun, and you are behaving like a boy in a man's body.\n\n> "Fly home, and bear in mind that you must never again be a child. You are now a man."\n> — Book I\n\nWhat makes this brilliant is the dramatic irony. We know Odysseus is alive. Telemachus doesn't. Athena doesn't tell him — she gives him something harder than information. She gives him a mandate. "Act as if your father's worth demanded it," she's saying, "whether he returns or not."\n\nDo you think Telemachus rises to this? Or does he spend the next several books still struggling to believe he's capable of what she asks?`
      },
      {
        intent: "why",
        text: `Homer opens the poem not with Odysseus but with his son because the Odyssey is about what absence costs. Twenty years without a father, twenty years without a king — Ithaca has decayed from the inside, and Telemachus is the visible wound.\n\n> "Fly home, and bear in mind that you must never again be a child. You are now a man."\n> — Book I\n\nAthena intervenes because the gods have decided Odysseus should come home — but home needs to be worth coming home to. Telemachus must become a man not for his own sake but so that the father has something to recognize when he arrives. The son is being forged into a mirror.\n\nWhat do you make of the idea that homecoming requires preparation on both ends — the traveler and the place?`
      },
    ],
  },

  // ── 3. Book V: Calypso releases Odysseus ──
  {
    passageId: "odyssey-5-calypso",
    passageText: "I too know well enough that my wife Penelope is nothing like so tall or so beautiful as yourself. She is only a woman, whereas you are an immortal. Nevertheless, I want to get home, and can think of nothing else.",
    passageReference: "Book V",
    triggers: ["calypso", "immortal", "penelope", "nothing else", "get home", "mortality", "immortality", "ogygia"],
    firstMessage: `This is one of the great declarations in all of literature — Odysseus choosing mortality, old age, and a human wife over eternal youth with a goddess. It's the thesis statement of the entire poem, if poems had thesis statements.\n\nWhat made you stop here?`,
    responses: [
      {
        intent: "why",
        text: `Calypso offers Odysseus what every mortal wants: eternal life, eternal youth, an existence without suffering. He turns it down. Not because he doesn't understand the offer — he explicitly admits Penelope is "nothing like so tall or so beautiful." He knows what he's giving up.\n\n> "She is only a woman, whereas you are an immortal. Nevertheless, I want to get home, and can think of nothing else."\n> — Book V\n\nThat "nevertheless" carries the weight of the entire poem. Homer is saying that meaning lives in limitation. A life without death is a life without stakes, and a life without stakes is not a story. Odysseus chooses the story.\n\nI've always read this as Homer's answer to the Iliad's question. Achilles chose glory and died young. Odysseus chooses home and grows old. Which choice does Homer admire more, do you think?`
      },
      {
        intent: "meaning",
        text: `The surface meaning is straightforward: Odysseus misses his wife and wants to go home. But Homer is doing something much more radical. He's making a philosophical argument through narrative.\n\n> "I too know well enough that my wife Penelope is nothing like so tall or so beautiful as yourself. She is only a woman, whereas you are an immortal. Nevertheless, I want to get home, and can think of nothing else."\n> — Book V\n\nOdysseus is choosing time over eternity, the particular over the universal, the flawed over the perfect. Penelope will age. Their reunion will be brief against the span of the cosmos. And that brevity is precisely what makes it matter.\n\nThis is, I think, the first articulation of what we'd now call existentialism — the idea that meaning comes not despite mortality but because of it. Do you read it that way, or does something else pull you toward this passage?`
      },
    ],
  },

  // ── 4. Book IX: Entering the Cyclops cave ──
  {
    passageId: "odyssey-9-cave-entry",
    passageText: "My men begged me to let them first take some of the cheeses, get the kids and lambs on board, and then sail away, but I would not listen to them, for I wanted to see the owner of the cave.",
    passageReference: "Book IX",
    triggers: ["cave", "cheese", "enter", "curiosity", "wanted to see", "wouldn't listen"],
    firstMessage: `Ah — the moment they enter the cave. This is one of those passages where you can feel Homer setting the trap before Odysseus does. The cave is full of cheese and lambs and order, and Odysseus's men want to grab what they can and run. He won't let them.\n\nWhat made you stop here? Is it the choice he makes, or something about the place itself?`,
    responses: [
      {
        intent: "why",
        text: `Odysseus's men have the right instinct — take what you can and leave before the owner returns. It's the practical move, the safe move. But Odysseus can't help himself. He wants to know.\n\n> "My men begged me to let them first take some of the cheeses, get the kids and lambs on board, and then sail away, but I would not listen to them, for I wanted to see the owner of the cave."\n> — Book IX\n\nThis is the same curiosity that defines him throughout the poem — the same impulse that made him listen to the Sirens, the same need to understand that makes him polytropos, "much-turning." But here it will cost him six men, eaten alive.\n\nHomer is remarkably honest about his hero. The quality that makes Odysseus extraordinary — his relentless need to know — is also the quality that gets people killed. Is that a flaw, or is Homer saying that curiosity always has a price?`
      },
      {
        intent: "context",
        text: `The Cyclops episode is told in flashback — Odysseus is narrating this to the Phaeacians at a feast. He knows how the story ends. He knows his curiosity cost lives. And he tells it anyway, without softening it.\n\n> "My men begged me to let them first take some of the cheeses, get the kids and lambs on board, and then sail away, but I would not listen to them, for I wanted to see the owner of the cave."\n> — Book IX\n\nThere's something disarming about a hero who admits his own mistakes while telling the story of his greatest adventures. He doesn't say "I made a tactical decision." He says "I wanted to see." Pure curiosity. The Greek word is idein — to see, to know. It's the same root as "idea."\n\nDoes it change how you read this moment, knowing that Odysseus is telling it about himself, after the fact, to an audience?`
      },
    ],
  },

  // ── 5. Book IX: "My name is Nobody" ──
  {
    passageId: "odyssey-9-nobody",
    passageText: "My name is Nobody: mother and father call me Nobody, and so do all the other people who are my companions.",
    passageReference: "Book IX",
    triggers: ["nobody", "no one", "outis", "name", "noman", "my name is"],
    firstMessage: `The Outis moment — one of the most famous lines in all of Homer. Odysseus transforms his own identity into a weapon, and the wordplay runs deeper than most readers catch on a first read.\n\nWhat are you seeing in this passage?`,
    responses: [
      {
        intent: "meaning",
        text: `The Outis pun is one of the most delicious moments in all of Homer. Odysseus tells Polyphemus his name is Outis — "Nobody" — and when the Cyclops later cries out that "Nobody is killing me!", his neighbors naturally assume he's gone mad and leave him to it.\n\n> "My name is Nobody: mother and father call me Nobody, and so do all the other people who are my companions."\n> — Book IX\n\nBut the joke runs deeper than wordplay. Odysseus is the man defined by his metis — his cunning intelligence — and here he weaponizes language itself. He becomes nothing in order to remain something. What I find haunting is what comes a few lines later, when he can't resist boasting his real name as he sails away. He gives back the identity he just hid, and Poseidon hears him, and the journey home stretches on for ten more years.\n\nWhat do you make of that pattern — the cleverness that saves him and the pride that costs him? Does Homer admire it, or is he warning us?`
      },
      {
        intent: "why",
        text: `Odysseus says his name is Nobody because he understands something fundamental about power: sometimes the strongest move is to disappear. The Cyclops can't take revenge on someone who doesn't exist.\n\n> "My name is Nobody: mother and father call me Nobody, and so do all the other people who are my companions."\n> — Book IX\n\nIt's a masterclass in strategic thinking. Identity is currency in the Homeric world — your name carries your lineage, your reputation, your honor. To surrender your name is to become invisible to the systems of obligation and revenge. Odysseus trades his name for survival.\n\nBut here's what I keep coming back to: he can't sustain it. A few lines later, he shouts his real name across the water to the blinded Cyclops. He needs to be known. The anonymity that saved his life is unbearable to his ego.\n\nWhy do you think he does that? Is it pride, or something else?`
      },
      {
        intent: "context",
        text: `In Greek, Outis ("Nobody") sounds very close to metis ("cunning" or "intelligence"). Homer's original audience would have heard both words simultaneously — "My name is Cunning" hiding inside "My name is Nobody." It's a pun that works on the level of theme.\n\n> "My name is Nobody: mother and father call me Nobody, and so do all the other people who are my companions."\n> — Book IX\n\nThe Cyclops, who relies on brute strength, is defeated by a man whose greatest weapon is his mind. The blinding itself is almost secondary — the real victory is linguistic. Odysseus doesn't just escape; he engineers a situation where calling for help makes Polyphemus sound insane.\n\nThis moment resonates through all of Western literature. Joyce named his modern Odysseus "Bloom" — a man who is, in a sense, Nobody in Dublin. What do you think it means that the greatest Greek hero wins his most famous battle by erasing himself?`
      },
      {
        intent: "compare",
        text: `Compare this moment to Achilles in the Iliad. Achilles' entire arc is about his name — his kleos, his glory. He fights so that his name will live forever. He would rather die young and be remembered than live long and be forgotten.\n\n> "My name is Nobody: mother and father call me Nobody, and so do all the other people who are my companions."\n> — Book IX\n\nOdysseus does the opposite. He throws his name away. He says, in effect: I would rather be nothing and survive than be someone and die. It's a fundamentally different theory of heroism.\n\nAnd yet — Homer won't let him be that simple. Odysseus can't help himself. He shouts his real name as he sails away, inviting divine punishment, because even the cleverest man in the world needs to be known. Homer seems to be saying: you can choose survival or glory, but you can't fully inhabit either choice.\n\nWhich hero do you find more compelling — Achilles who chooses glory, or Odysseus who tries to choose survival but keeps reaching for glory?`
      },
    ],
  },

  // ── 6. Book IX: Blinding of Polyphemus ──
  {
    passageId: "odyssey-9-blinding",
    passageText: "I drove it full into his eye while my men stood round me and heaven inspired them with a more than human courage.",
    passageReference: "Book IX",
    triggers: ["blinding", "blind", "eye", "stake", "olive", "polyphemus", "cyclops"],
    firstMessage: `The blinding of the Cyclops — one of the most visceral scenes in ancient literature. Homer doesn't flinch from the physical horror of it, and the detail about the olive-wood stake hissing like hot metal in water is unforgettable.\n\nWhat draws you to this moment?`,
    responses: [
      {
        intent: "meaning",
        text: `The blinding is simultaneously an act of survival, an act of cunning, and an act of sacrilege. Polyphemus is Poseidon's son, and Odysseus doesn't know that yet — or if he does, he doesn't care.\n\n> "I drove it full into his eye while my men stood round me and heaven inspired them with a more than human courage."\n> — Book IX\n\nNotice "heaven inspired them." Even in this brutal act, Homer attributes the courage to the gods. The Greeks didn't separate human will from divine influence the way we do. Odysseus is both agent and instrument — he acts, and the gods act through him.\n\nThe olive-wood stake is also symbolically loaded. The olive tree is Athena's gift to Athens, her sacred tree. Odysseus uses Athena's tree to defeat Poseidon's son. The divine politics are embedded in the props.\n\nDoes the violence here bother you, or does it feel justified by what Polyphemus has done?`
      },
    ],
  },

  // ── 7. Book IX: Odysseus reveals his name ──
  {
    passageId: "odyssey-9-hubris",
    passageText: "Cyclops, if anyone asks you who put out your eye, tell them it was Odysseus, the sacker of cities, son of Laertes, who lives in Ithaca.",
    passageReference: "Book IX",
    triggers: ["reveal", "real name", "boast", "hubris", "sacker of cities", "pride", "shout"],
    firstMessage: `And here is the moment that costs Odysseus everything. He's safe. He's escaped. Nobody knows who he is. And he can't bear it.\n\nThis is arguably the pivotal moment of the entire poem. Why do you think you stopped here?`,
    responses: [
      {
        intent: "why",
        text: `Odysseus has won. He's on his ship, sailing away from the island. The Nobody trick worked perfectly. And then he ruins it — he shouts his real name across the water to a blinded, enraged son of Poseidon.\n\n> "Cyclops, if anyone asks you who put out your eye, tell them it was Odysseus, the sacker of cities, son of Laertes, who lives in Ithaca."\n> — Book IX\n\nWhy? Because being Nobody is intolerable to him. The anonymity that saved his life is worse, to Odysseus, than the danger of being known. He needs the Cyclops to know who defeated him. He needs the story to have his name in it.\n\nThis is the moment that triggers Poseidon's curse and extends the journey by years. Every storm, every shipwreck, every lost companion after this point traces back to these four lines. Homer is brutally clear: the hero's greatest strength — his intelligence — is inseparable from his greatest weakness — his pride.\n\nDo you think Homer forgives him for this? Or is the rest of the poem the punishment?`
      },
    ],
  },

  // ── 8. Book XI: Achilles in the Underworld ──
  {
    passageId: "odyssey-11-achilles",
    passageText: "I would rather be a paid servant in a poor man's house and be above ground than king of kings among the dead.",
    passageReference: "Book XI",
    triggers: ["achilles", "underworld", "dead", "servant", "slave", "king of kings", "hades", "nekyia"],
    firstMessage: `Achilles, the greatest warrior who ever lived, telling Odysseus that he'd trade all his glory to be alive again — even as a servant. This is Homer rewriting his own other poem.\n\nWhat do you hear in this?`,
    responses: [
      {
        intent: "meaning",
        text: `In the Iliad, Achilles chose glory over long life. It was the defining choice of the poem — he knew he would die at Troy, and he chose to fight anyway, because his name would live forever. The Iliad treats this as heroic.\n\n> "I would rather be a paid servant in a poor man's house and be above ground than king of kings among the dead."\n> — Book XI\n\nNow, in the Odyssey, Homer lets Achilles recant. The dead hero says, in effect: I was wrong. Glory is nothing. Being alive — even as the lowest person on earth — is better than being dead and famous.\n\nThis is a staggering moment. Homer is either contradicting his own earlier poem or deepening it. I read it as the latter. The Iliad asked what glory costs. The Odyssey answers: everything. And the cost is too high.\n\nBut consider — is Achilles' regret the final word, or is it the natural despair of someone who can't undo their choice? Does Homer agree with him, or just let him speak?`
      },
      {
        intent: "compare",
        text: `Put this line next to Odysseus's refusal of Calypso's immortality, and you get the philosophical architecture of the whole poem.\n\n> "I would rather be a paid servant in a poor man's house and be above ground than king of kings among the dead."\n> — Book XI\n\nAchilles chose glory and got death. He regrets it. Odysseus is offered immortality and refuses it. He chooses mortality deliberately. Between the two of them, Homer has mapped out the entire question: what is a human life for?\n\nThe answer the Odyssey gives is radical for its time: a human life is for living. Not for glory, not for eternity, but for the particular, limited, mortal experience of being in the world — eating bread, sleeping beside your wife, watching your son grow up.\n\nDante puts Odysseus in Hell for his restless curiosity. Homer, I think, would disagree. But what do you think — does the poem reward Odysseus for choosing home, or does it punish him for taking so long to get there?`
      },
    ],
  },

  // ── 9. Book XII: The Sirens ──
  {
    passageId: "odyssey-12-sirens",
    passageText: "I told my men to bind me hand and foot to the mast, and if I begged them to release me, they were to tighten my bonds still further.",
    passageReference: "Book XII",
    triggers: ["siren", "sirens", "mast", "bind", "song", "wax", "ears"],
    firstMessage: `The Sirens — one of the most interpreted episodes in all of literature. Odysseus finds a way to hear the song that kills everyone who hears it. He engineers his own temptation.\n\nWhat catches you about this passage?`,
    responses: [
      {
        intent: "meaning",
        text: `Most readers focus on the danger — the Sirens' song lures sailors to their death. But the deeper question is: why does Odysseus need to hear it at all? His men have their ears plugged with wax. They'll sail past safely. He could plug his ears too.\n\n> "I told my men to bind me hand and foot to the mast, and if I begged them to release me, they were to tighten my bonds still further."\n> — Book XII\n\nBut he doesn't. He arranges to experience the temptation without being destroyed by it. This is Odysseus at his most essential — he refuses to not know. He will hear the song, feel its pull, and survive by constraining his own freedom in advance.\n\nThis is, incidentally, exactly what behavioral economists now call a "commitment device" — a pre-arranged constraint that your future self can't undo. Homer invented the concept three thousand years before the term existed.\n\nWhat do you think the Sirens actually sing about? Homer tells us, and the answer might surprise you.`
      },
    ],
  },

  // ── 10. Book XII: Scylla and Charybdis ──
  {
    passageId: "odyssey-12-scylla-charybdis",
    passageText: "I chose to pass by Scylla and lose some of my men rather than have the whole ship swallowed by Charybdis.",
    passageReference: "Book XII",
    triggers: ["scylla", "charybdis", "monster", "whirlpool", "sacrifice", "impossible choice", "six men"],
    firstMessage: `The impossible choice — lose some men to Scylla, or risk losing everyone to Charybdis. Odysseus chooses the certain small loss over the possible total loss. It's leadership at its most brutal.\n\nWhat draws you to this moment?`,
    responses: [
      {
        intent: "why",
        text: `Circe tells Odysseus in advance what will happen: Scylla will take six men. There is no way to prevent it. He can only choose whether six die or all die.\n\n> "I chose to pass by Scylla and lose some of my men rather than have the whole ship swallowed by Charybdis."\n> — Book XII\n\nWhat makes this devastating is that Odysseus doesn't tell his crew. He can't. If they knew that six of them were going to die, they'd refuse to row. So he carries the knowledge alone, watches six men get snatched from the deck, and keeps sailing.\n\nThis is Homer's most unflinching portrait of command. Leadership, the poem says, sometimes means choosing who dies and not being able to explain why. The men who die never know they were sacrificed deliberately.\n\nDoes this make Odysseus admirable or monstrous? I think Homer wants you to feel both.`
      },
    ],
  },

  // ── 11. Book XIX: Eurycleia recognizes the scar ──
  {
    passageId: "odyssey-19-scar",
    passageText: "As soon as Eurycleia had got the scarred limb in her hands and had well hold of it, she recognized it and let the foot fall.",
    passageReference: "Book XIX",
    triggers: ["scar", "eurycleia", "recognize", "foot", "washing", "nurse", "old woman"],
    firstMessage: `The recognition through the scar — Homer's most celebrated narrative technique. The old nurse touches the scar and the truth arrives through the body, not through words.\n\nWhat stopped you here?`,
    responses: [
      {
        intent: "meaning",
        text: `This scene is famous in literary criticism because of the way Homer handles time. Eurycleia touches the scar, recognizes Odysseus — and then Homer pauses the action for nearly a hundred lines to tell us how Odysseus got the scar as a young man, hunting boar on Mount Parnassus.\n\n> "As soon as Eurycleia had got the scarred limb in her hands and had well hold of it, she recognized it and let the foot fall."\n> — Book XIX\n\nThe critic Erich Auerbach wrote an entire chapter about this moment — it's the opening of his masterwork, Mimesis. His argument: Homer leaves nothing in shadow. Every detail is brought into the foreground, fully illuminated. There is no mystery, no hidden depth — only presence. The scar is not a symbol. It is a scar.\n\nI find that reading compelling but incomplete. The scar IS a symbol — it's the mark of Odysseus's first encounter with danger, his initiation into the world of risk and pain. The body remembers what the disguise tries to hide.\n\nWhat do you think — is the scar just a physical identifier, or does it carry meaning beyond recognition?`
      },
    ],
  },

  // ── 12. Book XXII: Slaughter of the suitors ──
  {
    passageId: "odyssey-22-suitors",
    passageText: "You dogs, you never thought I should come back from Troy. You have wasted my substance, have forced my women servants to lie with you, and have wooed my wife while I was still living.",
    passageReference: "Book XXII",
    triggers: ["suitor", "slaughter", "dogs", "bow", "revenge", "kill", "justice", "vengeance"],
    firstMessage: `The slaughter of the suitors — the moment the disguised beggar reveals himself as the king and takes his revenge. Homer has been building to this for twenty-three books.\n\nHow does this moment land for you?`,
    responses: [
      {
        intent: "opinion",
        text: `I've always been troubled by this scene. The suitors have behaved badly — they've consumed Odysseus's wealth, pressured his wife, mistreated his household. They deserve consequences. But do they deserve this?\n\n> "You dogs, you never thought I should come back from Troy. You have wasted my substance, have forced my women servants to lie with you, and have wooed my wife while I was still living."\n> — Book XXII\n\nOdysseus kills them all. Not just the ringleaders — all of them. Including those who were merely following along, and including, in the lines that follow, the servant women who slept with the suitors. The violence is systematic and total.\n\nHomer presents this as justice — the restoration of order, the king reclaiming his house. But the scale of the killing has disturbed readers for centuries. Is it justice? Or is it the same pride that made Odysseus shout his name at the Cyclops, now armed with a bow?\n\nWhat do you think Homer wants you to feel here — satisfaction or unease?`
      },
    ],
  },

  // ── 13. Book XXIII: The bed and the olive tree ──
  {
    passageId: "odyssey-23-bed",
    passageText: "There is a secret about the bed which only he and I know. I built the room round a great olive tree, and I made the bed from the tree itself, so that it could not be moved.",
    passageReference: "Book XXIII",
    triggers: ["bed", "olive tree", "secret", "built", "cannot be moved", "immovable", "rooted"],
    firstMessage: `The secret of the bed — the test that finally confirms Odysseus's identity. Not strength, not appearance, not even the scar. Knowledge. A shared secret that no one else in the world could know.\n\nThis is the emotional climax of the entire poem. What are you feeling here?`,
    responses: [
      {
        intent: "meaning",
        text: `Penelope's test is extraordinary. She tells a servant to move the bed. Odysseus erupts — who could move it? He built it himself, around a living olive tree. The bed is rooted in the earth. It cannot be moved without destroying it.\n\n> "There is a secret about the bed which only he and I know. I built the room round a great olive tree, and I made the bed from the tree itself, so that it could not be moved."\n> — Book XXIII\n\nThe bed is the metaphor that holds the poem together. It is marriage — rooted, immovable, built around something living. It is Ithaca — the fixed point that gives the wandering its meaning. It is identity — the thing about Odysseus that cannot be faked or stolen.\n\nAnd Penelope is the one who knows this. She matches his cunning with her own. She doesn't ask him to prove himself through strength or combat. She asks him to prove himself through intimacy — through the knowledge that only a husband would have.\n\nDo you think this is the real homecoming — not the arrival at Ithaca, but this moment of mutual recognition?`
      },
      {
        intent: "why",
        text: `Penelope tests Odysseus because twenty years of absence have made trust impossible. She's been surrounded by liars, pretenders, and suitors claiming to be what they're not. Even if the man standing before her looks like Odysseus, she needs proof that goes deeper than appearance.\n\n> "There is a secret about the bed which only he and I know. I built the room round a great olive tree, and I made the bed from the tree itself, so that it could not be moved."\n> — Book XXIII\n\nThe genius is in what she chooses as the test. Not "what's my favorite color" or "what did you say on our wedding night." She tests his knowledge of something he made with his own hands. The bed is not a memory — it's a fact. An olive tree either grows through your bedroom floor or it doesn't.\n\nAnd Odysseus's reaction — his outrage at the suggestion that someone moved the bed — is itself the proof. Only the man who built it would react with that specific, almost injured possessiveness.\n\nWhat does it say about their marriage that this is how they find each other again?`
      },
    ],
  },

  // ── 14. Book XXIII: Penelope's test ──
  {
    passageId: "odyssey-23-penelope-test",
    passageText: "Penelope was very much moved. She ran to Odysseus, threw her arms about his neck, and kissed him.",
    passageReference: "Book XXIII",
    triggers: ["penelope", "test", "recognition", "kiss", "arms", "threw her arms", "reunion"],
    firstMessage: `After twenty years, after all the wandering, after the test of the bed — Penelope finally lets herself believe. Homer gives us this reunion in a single, understated sentence.\n\nWhat do you feel in this moment?`,
    responses: [
      {
        intent: "meaning",
        text: `Homer has spent twenty-three books building to this moment, and when it arrives, he gives it one sentence. No speeches. No dramatic declarations. Just a woman running to her husband and putting her arms around his neck.\n\n> "Penelope was very much moved. She ran to Odysseus, threw her arms about his neck, and kissed him."\n> — Book XXIII\n\nAfter all the elaborate cunning, all the disguises and tricks and tests — the reunion is physical, immediate, and wordless. Homer seems to be saying: this is what all the cleverness was for. Not glory, not revenge, not the slaughter of the suitors. This.\n\nThe Iliad ends with a funeral. The Odyssey ends with an embrace. I think that says everything about the difference between the two poems.\n\nDoes this ending satisfy you? Or do you want more from it — more words, more explanation, more ceremony?`
      },
    ],
  },

  // ── 15. The poem's overall structure: Nostos ──
  {
    passageId: "odyssey-structure-nostos",
    passageText: "The poem begins with absence and ends with presence. The journey is not from Troy to Ithaca. It is from Nobody to Odysseus.",
    passageReference: "The Odyssey as a whole",
    triggers: ["nostos", "structure", "journey home", "homecoming", "theme", "overall", "whole poem", "meaning of"],
    firstMessage: `You're thinking about the poem as a whole — its shape, its meaning, what it adds up to. That's the question every reader of Homer eventually arrives at.\n\nWhat's on your mind about the structure?`,
    responses: [
      {
        intent: "meaning",
        text: `The Greek word for the Odyssey's central idea is nostos — the journey home. It gives us our word "nostalgia," literally "the pain of return." But Homer's nostos is not sentimental. It's structural.\n\nThe poem moves through three great arcs: the Telemachy (Books I–IV), where the son searches for the father; the Wanderings (Books V–XII), where the father tries to reach home; and the Homecoming (Books XIII–XXIV), where the father must prove he is who he claims to be.\n\nWhat holds all three together is a single question: what does it mean to be home? For Telemachus, it means having a father. For Odysseus, it means being recognized — not as a hero, but as a husband, a father, a king. For Penelope, it means knowing the truth.\n\nThe bed rooted in the olive tree is the poem's final image of home: something alive, unmovable, and shared. Do you think Odysseus deserves what he finds there?`
      },
      {
        intent: "opinion",
        text: `I've read the Odyssey many times, and each time I come away with a slightly different sense of what Homer is saying. In my twenties I read it as an adventure story. In my thirties as a meditation on marriage. Now I read it as a poem about identity — how we lose ourselves, how we find ourselves, and whether the self that returns is the same self that left.\n\nOdysseus leaves Ithaca as a young king. He returns as a beggar. Between those two points, he has been a warrior, a castaway, a lover, a liar, a Nobody. The question the poem asks is: which of those is the real Odysseus? And is there a real Odysseus, or only the roles he plays?\n\nPenelope's test of the bed suggests there is — that beneath all the disguises, there's a man who built a bed around a living tree. That core doesn't change.\n\nBut I'm not sure Homer is that reassuring. What do you think — does the poem believe in a stable self, or does it celebrate the man of many turns precisely because he has no fixed center?`
      },
    ],
  },
]

// ────────────────────────────────────────────────
// FALLBACK RESPONSES
// ────────────────────────────────────────────────

const FALLBACKS: string[] = [
  `I want to give you a real answer to that, but I don't have the specific passage in front of me right now — and I'm not going to invent one. Can you share the lines you're looking at? Even a few words will help me find the moment you mean.`,

  `That's a question worth taking seriously. I'd rather wait until I can see the passage you're responding to than give you a generic answer. Could you highlight the lines and share them with me?`,

  `I have thoughts on that, but they'd be more useful anchored to specific lines. Homer's meaning lives in the details — the word choices, the images, the order of events. What passage are you reading?`,

  `Good question. Let me be honest: I work best when I can see the text you're reacting to. If you highlight a passage and send it to me, I can give you something much more useful than a general observation.`,

  `I'd love to dig into that with you. The challenge is that Homer says different things in different moments, and I don't want to guess which one you mean. Share the passage that sparked this question?`,

  `That's the kind of question that deserves a real conversation, not a quick answer. Point me to the specific lines — I'll read them with you and we can work through it together.`,

  `Homer would probably say that question needs its own book. I'll do my best with a few paragraphs, but I'll need you to show me the passage first. What are you reading?`,

  `I notice you're asking something I could answer in a general way, but I'd rather not. The Odyssey rewards close reading, and so does this conversation. Which lines have you been sitting with?`,

  `That touches on one of the deepest threads in the poem. Before I pull at it, though — are you thinking about a specific passage? I want to make sure we're reading the same moment.`,

  `The honest answer is: it depends on which part of the poem you're in. Homer is remarkably consistent in some ways and deliberately contradictory in others. Show me where you are in the text?`,
]

let fallbackIndex = 0

// ────────────────────────────────────────────────
// TRIGGER MATCHING
// ────────────────────────────────────────────────

function findAnchor(
  highlightedText?: string,
  userMessage?: string
): AnchorResponse | null {
  const searchText = [highlightedText, userMessage]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  if (!searchText) return null

  // Score each anchor by how many triggers match
  let bestAnchor: AnchorResponse | null = null
  let bestScore = 0

  for (const anchor of ANCHORS) {
    let score = 0

    // Check if the highlighted text overlaps with the passage text
    if (highlightedText) {
      const highlightLower = highlightedText.toLowerCase()
      const passageLower = anchor.passageText.toLowerCase()
      const words = highlightLower.split(/\s+/)
      const matchingWords = words.filter((w) => passageLower.includes(w))
      if (matchingWords.length >= 3) score += 10
    }

    // Check triggers
    for (const trigger of anchor.triggers) {
      if (searchText.includes(trigger.toLowerCase())) {
        score += 2
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestAnchor = anchor
    }
  }

  return bestScore >= 2 ? bestAnchor : null
}

function classifyIntent(message: string): QuestionIntent {
  const lower = message.toLowerCase()
  if (lower.includes("why") || lower.includes("how come") || lower.includes("reason")) return "why"
  if (lower.includes("compare") || lower.includes("similar") || lower.includes("different from") || lower.includes("iliad")) return "compare"
  if (lower.includes("think") || lower.includes("opinion") || lower.includes("feel") || lower.includes("your view")) return "opinion"
  if (lower.includes("context") || lower.includes("history") || lower.includes("greek") || lower.includes("background")) return "context"
  return "meaning"
}

function pickResponse(anchor: AnchorResponse, intent: QuestionIntent): string {
  // Try exact intent match first
  const match = anchor.responses.find((r) => r.intent === intent)
  if (match) return match.text

  // Fall back to first response
  return anchor.responses[0].text
}

function getNextFallback(): string {
  const response = FALLBACKS[fallbackIndex % FALLBACKS.length]
  fallbackIndex++
  return response
}

// ────────────────────────────────────────────────
// STREAMING GENERATOR — The swap layer
// ────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function* streamVirgilResponse(
  input: StreamInput
): AsyncGenerator<string, void, unknown> {
  const { conversationHistory, highlightedPassage } = input

  const lastUserMessage = conversationHistory
    .filter((m) => m.role === "user")
    .pop()?.content

  // Determine which response to use
  let fullResponse: string

  // If this is a first message (no user message, just highlighted passage)
  if (!lastUserMessage && highlightedPassage) {
    const anchor = findAnchor(highlightedPassage.text)
    fullResponse = anchor?.firstMessage ?? getNextFallback()
  } else {
    const anchor = findAnchor(highlightedPassage?.text, lastUserMessage)
    if (anchor && lastUserMessage) {
      const intent = classifyIntent(lastUserMessage)
      fullResponse = pickResponse(anchor, intent)
    } else {
      fullResponse = getNextFallback()
    }
  }

  // Split into chunks and stream with realistic timing
  // Handle blockquotes specially — yield them as complete units
  const lines = fullResponse.split("\n")

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx]

    // Blockquote lines: yield entire line at once
    if (line.startsWith(">") || line.startsWith("— ")) {
      if (lineIdx > 0) yield "\n"
      yield line
      await sleep(80)
      continue
    }

    // Regular text: yield word by word
    if (lineIdx > 0 && line.length > 0) yield "\n"

    const words = line.split(" ")
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      if (!word) continue

      // Yield 1-2 words at a time
      const chunk = i < words.length - 1 && Math.random() > 0.6
        ? word + " " + words[++i]
        : word

      yield (i > 1 ? " " : "") + chunk

      // Base delay with randomization
      let delay = 30 + Math.random() * 50

      // Slow down at punctuation
      if (chunk.endsWith(".") || chunk.endsWith("?") || chunk.endsWith("!")) {
        delay += 120
      } else if (chunk.endsWith(",") || chunk.endsWith(";") || chunk.endsWith(":")) {
        delay += 50
      } else if (chunk.endsWith("—")) {
        delay += 80
      }

      await sleep(delay)
    }
  }
}

export { ANCHORS, findAnchor, classifyIntent }
