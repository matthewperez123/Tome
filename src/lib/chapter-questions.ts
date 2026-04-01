// ─────────────────────────────────────────────
// Tome Chapter Question Bank
// ─────────────────────────────────────────────

export type QuestionType = 'multiple_choice' | 'true_false' | 'passage_id'

export interface ChapterQuestion {
  id: string
  type: QuestionType
  text: string
  options?: string[]        // for multiple_choice and passage_id
  correctIndex?: number     // 0-based index into options[] for MC/passage_id
  correctBool?: boolean     // for true_false
  explanation: string
}

// ── Question Bank ──────────────────────────────

const QUESTION_BANK: Record<string, Record<number, ChapterQuestion[]>> = {
  iliad: {
    0: [
      {
        id: 'iliad-0-1',
        type: 'multiple_choice',
        text: 'What is the immediate cause of the quarrel between Achilles and Agamemnon in Book 1?',
        options: [
          'Agamemnon refuses to return Chryseis to her father, a priest of Apollo',
          'Achilles refuses to fight in the Trojan War',
          'Agamemnon takes credit for a victory won by Achilles',
          'Apollo demands that Achilles be sacrificed to end a plague',
        ],
        correctIndex: 0,
        explanation:
          'Chryses, priest of Apollo, offers ransom for his daughter Chryseis, whom Agamemnon holds as a war prize. Agamemnon refuses, Apollo sends a plague, and when Achilles calls an assembly to address the plague Agamemnon is forced to return her — but compensates himself by taking Achilles\' prize, Briseis, triggering the central conflict of the epic.',
      },
      {
        id: 'iliad-0-2',
        type: 'true_false',
        text: 'Apollo sends a plague upon the Greek army because Agamemnon dishonored his priest by refusing to accept ransom for Chryseis.',
        correctBool: true,
        explanation:
          'Apollo, angered on behalf of his priest Chryses, shoots plague arrows into the Greek camp for nine days until Achilles calls an assembly to find the cause.',
      },
      {
        id: 'iliad-0-3',
        type: 'multiple_choice',
        text: 'After Achilles withdraws from battle, his mother Thetis asks Zeus to grant what favor?',
        options: [
          'That Achilles be made immortal and invulnerable',
          'That the Trojans gain the upper hand until the Greeks honor Achilles',
          'That Apollo lift the plague from the Greek camp',
          'That Achilles be allowed to return home to Phthia safely',
        ],
        correctIndex: 1,
        explanation:
          'Thetis appeals to Zeus, asking him to let the Trojans prevail so the Greeks will feel the loss of Achilles keenly and Agamemnon will be compelled to honor her son. Zeus reluctantly agrees.',
      },
      {
        id: 'iliad-0-4',
        type: 'passage_id',
        text: 'The opening word of the Iliad — "Sing, O goddess, the anger of Achilles" — establishes what as the epic\'s central theme?',
        options: [
          'The glory of war and the inevitable triumph of Greece',
          'The wrath (menis) of Achilles and the suffering it causes',
          'The will of Zeus and the fate of Troy',
          'The rivalry between Achilles and Hector',
        ],
        correctIndex: 1,
        explanation:
          'The poem announces its subject in its first word: "menis" (wrath). The entire narrative flows from Achilles\' fury — first at Agamemnon, later at Hector — and the catastrophic consequences that anger brings to both sides.',
      },
    ],
    1: [
      {
        id: 'iliad-1-1',
        type: 'multiple_choice',
        text: 'In Book 2, Zeus sends a deceptive dream to Agamemnon suggesting he should do what?',
        options: [
          'Make peace with Achilles immediately',
          'Launch a full assault on Troy, promising him victory',
          'Withdraw the Greek fleet and abandon the war',
          'Challenge Hector to single combat',
        ],
        correctIndex: 1,
        explanation:
          'Zeus sends a false Dream in the shape of the elder Nestor, telling Agamemnon to arm the Greeks and attack Troy now, claiming the gods have agreed to give him victory. This is Zeus fulfilling his promise to Thetis — he deceives Agamemnon into an engagement that will go badly without Achilles.',
      },
      {
        id: 'iliad-1-2',
        type: 'true_false',
        text: 'When Agamemnon tests his troops by suggesting they sail home, the Greeks immediately and enthusiastically rush to the ships, demonstrating their eagerness to abandon the war.',
        correctBool: true,
        explanation:
          'Agamemnon "tests" the army by proposing retreat, expecting the men to insist on fighting. Instead they stampede toward the ships. Only the intervention of Odysseus, sent by Athena, stops the rout by rallying the troops.',
      },
      {
        id: 'iliad-1-3',
        type: 'multiple_choice',
        text: 'Thersites, who speaks out against Agamemnon in the assembly, is significant because he represents what social group?',
        options: [
          'The Trojan perspective on the war',
          'Common soldiers with no noble lineage',
          'Priests who oppose the continuation of the war',
          'Veterans too old to fight who counsel wisdom',
        ],
        correctIndex: 1,
        explanation:
          'Thersites is the only common, non-noble soldier given a speaking role in the Iliad. His ugly appearance and insolent speech contrast sharply with the heroic ideal; Odysseus silences him with a blow, reinforcing the poem\'s aristocratic social hierarchy.',
      },
      {
        id: 'iliad-1-4',
        type: 'passage_id',
        text: 'The lengthy Catalogue of Ships in Book 2 serves primarily what narrative purpose?',
        options: [
          'To show that Achilles\' absence removes the entire Greek force from battle',
          'To establish the vast scale of the Greek coalition and give weight to what is at stake',
          'To introduce the Trojan heroes who will oppose each Greek champion',
          'To demonstrate Zeus\'s foreknowledge of every warrior\'s fate',
        ],
        correctIndex: 1,
        explanation:
          'The Catalogue lists the contingents and leaders from across Greece, making the army\'s size and diversity vivid. It gives the war epic scope and reminds the audience how many lives hang on the conflict — which makes Achilles\' withdrawal and the Trojan resurgence all the more consequential.',
      },
    ],
    2: [
      {
        id: 'iliad-2-1',
        type: 'multiple_choice',
        text: 'In Book 3, Paris and Menelaus agree to single combat to settle the war. What is the agreed outcome if Menelaus wins?',
        options: [
          'Paris must fight Achilles next',
          'Helen and all her treasure are returned and the Greeks sail home',
          'Troy pays a ransom but Helen stays',
          'The Trojans surrender the city immediately',
        ],
        correctIndex: 1,
        explanation:
          'The terms are clear: the winner takes Helen and her possessions, and the other side goes home. Menelaus is winning when Aphrodite whisks Paris away to his bedroom in Troy, nullifying the duel and preventing a clean resolution to the war.',
      },
      {
        id: 'iliad-2-2',
        type: 'true_false',
        text: 'Helen feels no remorse or conflict about her role in causing the Trojan War; she fully embraces life with Paris and despises Menelaus.',
        correctBool: false,
        explanation:
          'Homer\'s Helen is deeply ambivalent. She watches the battle from the walls with visible sorrow, speaks of herself with self-reproach, and reluctantly obeys Aphrodite\'s command to return to Paris — even rebuking the goddess when ordered. Her complex guilt and longing complicate any simple reading of her character.',
      },
      {
        id: 'iliad-2-3',
        type: 'multiple_choice',
        text: 'The scene on the walls of Troy where Helen identifies Greek heroes for King Priam is known as what?',
        options: [
          'The Teichoscopia, or "viewing from the walls"',
          'The Aristeia of Helen',
          'The Ekphrasis of the battlefield',
          'The Nekuia of the living',
        ],
        correctIndex: 0,
        explanation:
          'This passage — Helen naming Agamemnon, Odysseus, and Ajax for Priam — is traditionally called the Teichoscopia ("wall-gazing"). It serves as a late but effective introduction of key Greek heroes ten years into the war.',
      },
      {
        id: 'iliad-2-4',
        type: 'passage_id',
        text: 'When Aphrodite rescues Paris from the duel and deposits him in his bedroom, what does this moment reveal about the gods\' relationship to the war?',
        options: [
          'The gods are impartial arbiters who enforce the agreed terms of combat',
          'Divine favor can override mortal agreements and deny humans the consequences of their actions',
          'Aphrodite opposes the Trojan War and wants it to end quickly',
          'The gods intervene only when a hero prays directly to them for help',
        ],
        correctIndex: 1,
        explanation:
          'Aphrodite\'s rescue of Paris shows the gods undermining the very oath sworn before both armies. Divine patronage can suspend justice for a favorite, denying resolution and prolonging suffering. This divine capriciousness is a source of tragic irony throughout the Iliad.',
      },
    ],
    3: [
      {
        id: 'iliad-3-1',
        type: 'multiple_choice',
        text: 'In Book 4, which god pressures Zeus to allow the truce to be broken, restarting the war after Paris and Menelaus\'s inconclusive duel?',
        options: [
          'Apollo, wanting to protect Troy',
          'Hera, determined to see Troy destroyed',
          'Ares, eager for bloodshed',
          'Poseidon, supporting the Greeks',
        ],
        correctIndex: 1,
        explanation:
          'Hera hates Troy and cannot accept a truce that might end the war with Troy intact. She convinces Zeus to send Athena to provoke a Trojan violation of the oath. Athena persuades the Trojan Pandarus to shoot at Menelaus, wounding him and breaking the truce.',
      },
      {
        id: 'iliad-3-2',
        type: 'true_false',
        text: 'The wounding of Menelaus by Pandarus is portrayed as entirely Pandarus\'s own initiative, driven by greed for gifts from Paris.',
        correctBool: false,
        explanation:
          'Pandarus acts because Athena (disguised) convinces him, promising him glory if he wounds Menelaus. The mortal act is shaped by divine manipulation — a recurring pattern in the Iliad that raises questions about human agency and divine causation.',
      },
      {
        id: 'iliad-3-3',
        type: 'multiple_choice',
        text: 'Agamemnon\'s review of the troops before battle in Book 4 shows his leadership style through which contrasting moments?',
        options: [
          'He praises Odysseus warmly but sharply rebukes Diomedes, showing favoritism',
          'He encourages some commanders warmly and reproaches others, including Odysseus and Diomedes, for hanging back',
          'He appoints new commanders to replace those who were present at the failed duel',
          'He promises extraordinary rewards to whichever warrior kills Hector',
        ],
        correctIndex: 1,
        explanation:
          'Agamemnon walks the lines, praising Idomeneus and the Ajaxes, but sharply rebuking Odysseus and Diomedes for not pressing forward. Both men push back with dignity. The scene reveals Agamemnon\'s anxious, sometimes needlessly harsh leadership — a contrast to the more assured heroism of his subordinates.',
      },
    ],
    4: [
      {
        id: 'iliad-4-1',
        type: 'multiple_choice',
        text: 'Book 5 is largely the Aristeia (heroic rampage) of which Greek warrior, who even wounds two Olympian gods?',
        options: [
          'Ajax the Greater',
          'Odysseus',
          'Diomedes',
          'Menelaus',
        ],
        correctIndex: 2,
        explanation:
          'Diomedes\' Book 5 aristeia is one of the most sustained in the poem. Empowered by Athena, he wounds Aphrodite in the wrist when she tries to rescue Aeneas, then — guided by Athena — wounds Ares himself in the flank, sending the god of war shrieking back to Olympus.',
      },
      {
        id: 'iliad-4-2',
        type: 'true_false',
        text: 'Diomedes is given the rare ability to distinguish gods from mortals on the battlefield, which allows him to avoid attacking disguised Olympians.',
        correctBool: false,
        explanation:
          'Athena grants Diomedes the ability to see the gods clearly — but this is precisely so he can attack them when appropriate. She instructs him to avoid all gods except Aphrodite. He uses this sight to wound Aphrodite and, later, Ares.',
      },
      {
        id: 'iliad-4-3',
        type: 'multiple_choice',
        text: 'When Aphrodite is wounded by Diomedes and retreats to Olympus, how does Zeus respond?',
        options: [
          'He is furious and threatens to remove Diomedes\' divine protection',
          'He gently mocks her, saying war is not her domain, and suggests she stick to love',
          'He sends Apollo back to the battlefield to avenge the insult',
          'He condemns Athena for allowing a mortal to wound an immortal',
        ],
        correctIndex: 1,
        explanation:
          'Zeus smiles and tells Aphrodite that war is for Ares and Athena, and that she should concern herself with the works of marriage. The moment offers rare Olympian comedy but also reinforces divine spheres of power — and the idea that the gods\' meddling in war has consequences even for themselves.',
      },
      {
        id: 'iliad-4-4',
        type: 'passage_id',
        text: 'Sarpedon\'s speech to Glaucus in Book 5 — "So now let us go forward and win glory for ourselves, or yield it to others" — encapsulates what central heroic value of the poem?',
        options: [
          'Kleos (glory won through great deeds) justifies the privileges of the warrior aristocracy',
          'The gods determine all outcomes so mortal striving is ultimately futile',
          'Friendship (philia) between warriors is the highest bond',
          'Survival is the paramount duty of every soldier',
        ],
        correctIndex: 0,
        explanation:
          'Sarpedon argues that their honor and the estate they enjoy at home oblige them to fight in the front rank. This is the clearest articulation of the kleos-for-privilege exchange: the heroic aristocracy earns its status through conspicuous valor. The logic drives nearly every major warrior\'s behavior in the Iliad.',
      },
    ],
  },

  odyssey: {
    0: [
      {
        id: 'odyssey-0-1',
        type: 'multiple_choice',
        text: 'At the opening of the Odyssey, why has Odysseus not yet returned home to Ithaca ten years after the fall of Troy?',
        options: [
          'He chose to stay in Troy to help rebuild the city',
          'He is held on the island of Ogygia by the nymph Calypso',
          'He is imprisoned by Circe on the island of Aeaea',
          'Poseidon has destroyed his ship and he is stranded on a deserted island',
        ],
        correctIndex: 1,
        explanation:
          'Odysseus is stranded on Ogygia, where Calypso keeps him as a lover, promising immortality if he stays. He longs for home. The council of gods in Book 1 agrees to free him — all the gods except Poseidon, who is absent visiting the Ethiopians.',
      },
      {
        id: 'odyssey-0-2',
        type: 'true_false',
        text: 'Athena\'s primary concern at the opening of the Odyssey is the plight of Telemachus, not Odysseus himself.',
        correctBool: false,
        explanation:
          'Athena advocates first and most passionately for Odysseus at the divine council. She then disguises herself as Mentes and visits Telemachus to inspire the young man to action — but her ultimate goal is securing her favorite\'s return home.',
      },
      {
        id: 'odyssey-0-3',
        type: 'multiple_choice',
        text: 'The suitors occupy Odysseus\'s palace and court Penelope. What specific wrong, beyond eating his food and courting his wife, do they commit that most outrages the poem\'s sense of justice?',
        options: [
          'They have plotted to murder Telemachus',
          'They have sold Odysseus\'s servants into slavery',
          'They have desecrated the temple of Athena',
          'They have invited foreign kings to claim Ithaca',
        ],
        correctIndex: 0,
        explanation:
          'The suitors plan to ambush and kill Telemachus when he returns from his voyage seeking news of his father. This premeditated murder of the legitimate heir transforms them from boorish guests into criminal enemies deserving of the violent reckoning Odysseus will deliver.',
      },
      {
        id: 'odyssey-0-4',
        type: 'passage_id',
        text: 'Zeus opens the Odyssey\'s council by using Aegisthus as an example. What point is he making?',
        options: [
          'That mortals suffer because of divine hostility, not their own choices',
          'That mortals bring extra suffering on themselves by acting against divine warnings',
          'That the gods must intervene more actively to prevent human suffering',
          'That revenge is a sacred duty that even the gods respect',
        ],
        correctIndex: 1,
        explanation:
          'Zeus complains that mortals blame the gods for their troubles, but Aegisthus was warned by Hermes not to kill Agamemnon or take Clytemnestra — and did it anyway, dying as a result. The example frames the Odyssey\'s moral: characters who heed divine guidance survive; those who don\'t, like the suitors, are destroyed.',
      },
    ],
    1: [
      {
        id: 'odyssey-1-1',
        type: 'multiple_choice',
        text: 'What does Athena (as Mentes) advise Telemachus to do at the start of the Telemachy (Books 1–4)?',
        options: [
          'Challenge the leading suitor to single combat',
          'Call an assembly of Ithacans and voyage to seek news of his father',
          'Travel to Troy to find survivors who knew Odysseus',
          'Consult the oracle at Delphi about Odysseus\'s fate',
        ],
        correctIndex: 1,
        explanation:
          'Athena-as-Mentes counsels Telemachus to assert himself: call a public assembly, order the suitors to leave, then sail to Pylos and Sparta to ask Nestor and Menelaus for news of Odysseus. The journey is as much about Telemachus\'s coming-of-age as it is about gathering information.',
      },
      {
        id: 'odyssey-1-2',
        type: 'true_false',
        text: 'Penelope\'s stratagem of weaving and unraveling Laertes\' shroud successfully delays the suitors for nearly three years.',
        correctBool: true,
        explanation:
          'Penelope promises to choose a husband once she finishes weaving a funeral shroud for her father-in-law Laertes. She weaves by day and secretly unravels by night, buying three years before a treacherous maidservant betrays the trick to the suitors.',
      },
      {
        id: 'odyssey-1-3',
        type: 'multiple_choice',
        text: 'When Telemachus calls an assembly in Book 2, what is the reaction of the leading suitor Antinous?',
        options: [
          'He agrees to leave the palace if Penelope makes a choice within a year',
          'He blames Penelope entirely, saying she deceived them, and refuses to leave',
          'He challenges Telemachus to prove his lineage before the assembly',
          'He proposes arbitration by the elders of Ithaca',
        ],
        correctIndex: 1,
        explanation:
          'Antinous places all blame on Penelope\'s deception with the shroud and demands she pick a husband from among her father\'s choice. He refuses to leave, insisting the suitors will stay until Penelope makes a decision. His response shows the suitors have no intention of respecting Telemachus\'s authority.',
      },
      {
        id: 'odyssey-1-4',
        type: 'passage_id',
        text: 'In Book 2, the omen of two eagles fighting over the assembly is interpreted by the seer Halitherses as meaning what?',
        options: [
          'A great sea storm will destroy the suitors\' ships',
          'Odysseus is near and will return to punish the suitors',
          'Telemachus will find his father dead in a foreign land',
          'The gods have abandoned Ithaca because of the suitors\' impiety',
        ],
        correctIndex: 1,
        explanation:
          'Halitherses reads the omen and warns that Odysseus will return and bring destruction on the suitors. His warning is dismissed by the suitor Eurymachus, who threatens the seer. The ignored omen foreshadows the massacre and implicates the suitors in willful blindness.',
      },
    ],
    2: [
      {
        id: 'odyssey-2-1',
        type: 'multiple_choice',
        text: 'In Book 3, Telemachus visits Nestor at Pylos. What primary virtue does Nestor embody in the poem?',
        options: [
          'Martial ferocity and physical strength',
          'Cunning intelligence and deception',
          'Age, memory, and the wisdom to honor the gods properly',
          'Loyalty and willingness to sacrifice for friends',
        ],
        correctIndex: 2,
        explanation:
          'Nestor exemplifies piety, memory, and the proper order of things. He insists on sacrifices, recounts the aftermath of Troy at length, and urges Telemachus to honor his father\'s memory through action. He offers a counterexample to the suitors\'s impiety.',
      },
      {
        id: 'odyssey-2-2',
        type: 'true_false',
        text: 'Nestor is able to give Telemachus direct, recent news about Odysseus\'s whereabouts.',
        correctBool: false,
        explanation:
          'Nestor knows nothing definite about Odysseus after Troy. He can speak at length about the fates of other returning heroes — Menelaus\'s wandering, Agamemnon\'s murder — but has heard nothing of Odysseus. He sends Telemachus on to Sparta and Menelaus.',
      },
      {
        id: 'odyssey-2-3',
        type: 'multiple_choice',
        text: 'The story of Agamemnon\'s murder by Aegisthus and Clytemnestra, which Nestor tells Telemachus, functions as what kind of narrative device?',
        options: [
          'A direct parallel warning Telemachus of danger from his own mother',
          'A foil and cautionary contrast for Odysseus — showing what happens when a husband does not return promptly and a wife is disloyal',
          'A model of heroic revenge that Telemachus should emulate immediately',
          'A digression establishing the wider political instability in Greece after Troy',
        ],
        correctIndex: 1,
        explanation:
          'The Agamemnon myth serves as a dark mirror throughout the Odyssey. It shows the worst outcome: a wandering husband, a faithless wife, and a son who cannot act. This is precisely what Odysseus and Telemachus must avoid. Penelope\'s loyalty and Telemachus\'s growing assertiveness are the Odyssey\'s corrective to Agamemnon\'s tragedy.',
      },
    ],
    3: [
      {
        id: 'odyssey-3-1',
        type: 'multiple_choice',
        text: 'At Sparta, Menelaus tells Telemachus how he learned Odysseus\'s fate. How did he get this information?',
        options: [
          'From a Trojan prisoner who had traded with Calypso\'s island',
          'From the sea-god Proteus, whom Menelaus wrestled into submission on the shore of Egypt',
          'From a prophecy of Apollo delivered at Delphi after the war',
          'From Circe\'s messenger, who contacted Menelaus on Odysseus\'s behalf',
        ],
        correctIndex: 1,
        explanation:
          'Menelaus recounts how, stranded in Egypt, he captured the shape-shifting Old Man of the Sea Proteus and held him through his many transformations until Proteus told him the truth: Odysseus is alive but stranded on Calypso\'s island, longing for home.',
      },
      {
        id: 'odyssey-3-2',
        type: 'true_false',
        text: 'Helen\'s role in Book 4 is purely passive and mournful; she says nothing and merely weeps at the mention of Odysseus.',
        correctBool: false,
        explanation:
          'Helen actively contributes a drug to the wine to suppress grief during the feast, and she tells a story about Odysseus\'s daring spy mission into Troy — praising his cunning and self-control. She is a full participant in the evening\'s storytelling, not a silent mourner.',
      },
      {
        id: 'odyssey-3-3',
        type: 'multiple_choice',
        text: 'In Book 4, the suitors discover Telemachus has sailed away and hatch a plan. What do they decide to do?',
        options: [
          'Leave the palace and return to their own estates until Penelope chooses',
          'Ambush Telemachus at sea when he returns and kill him',
          'Send a messenger to Sparta asking Menelaus to expel Telemachus',
          'Petition Zeus by sacrifice to curse the ship carrying Telemachus',
        ],
        correctIndex: 1,
        explanation:
          'The suitors are furious that Telemachus has acted independently. Antinous proposes stationing a ship at the straits between Ithaca and Same to ambush and kill Telemachus on his return. This plan to murder the prince confirms their villainy and raises the stakes for Odysseus\'s homecoming.',
      },
    ],
    4: [
      {
        id: 'odyssey-4-1',
        type: 'multiple_choice',
        text: 'In Book 5, when Hermes delivers Zeus\'s command to release Odysseus, how does Calypso respond initially?',
        options: [
          'She obeys immediately and cheerfully, relieved to be rid of the obligation',
          'She protests the injustice of gods breaking up divine-mortal relationships, then reluctantly complies',
          'She offers Zeus a counter-proposal that Odysseus stay as a guest for one more year',
          'She tries to make Odysseus choose to stay of his own free will by offering renewed immortality',
        ],
        correctIndex: 1,
        explanation:
          'Calypso complains bitterly about the double standard — male gods take mortal lovers without censure, but goddesses are forbidden. She then complies with Hermes\'s instruction and goes to tell Odysseus. Her bitterness adds depth to her character and critiques Olympian power dynamics.',
      },
      {
        id: 'odyssey-4-2',
        type: 'true_false',
        text: 'When Calypso offers Odysseus immortality if he stays with her, he accepts her offer before reconsidering when the ship is ready.',
        correctBool: false,
        explanation:
          'Odysseus refuses immortality. He weeps daily on the shore for Ithaca, and when offered the choice by Calypso he confirms he prefers mortal Penelope and his rocky homeland to eternal life with a goddess. This choice defines him as the hero who values nostos (homecoming) and human bonds above all.',
      },
      {
        id: 'odyssey-4-3',
        type: 'multiple_choice',
        text: 'Odysseus builds a raft to leave Calypso\'s island. What does the detailed description of his raft-building emphasize about his character?',
        options: [
          'His dependence on divine assistance for even basic survival tasks',
          'His practical intelligence and self-sufficiency — he is a hero of craft as well as combat',
          'The superior technology of the gods compared to mortal capability',
          'His haste and carelessness, foreshadowing the storm that shatters the raft',
        ],
        correctIndex: 1,
        explanation:
          'Homer describes Odysseus felling timber, shaping planks, and rigging the raft with care and skill. This emphasis on craftsmanship reinforces that Odysseus is a polytropos ("many-skilled") hero — his intelligence and practical competence are as heroic as his fighting ability.',
      },
    ],
  },

  inferno: {
    0: [
      {
        id: 'inferno-0-1',
        type: 'multiple_choice',
        text: 'In Canto I of the Inferno, Dante finds himself lost in a dark wood. What do most commentators interpret the dark wood to symbolize?',
        options: [
          'The forest surrounding Florence, where Dante was physically lost during his exile',
          'A state of spiritual crisis, moral confusion, and deviation from the right path',
          'Purgatory, through which souls must pass before ascending to Heaven',
          'The unconscious mind, filled with the fears Dante must confront',
        ],
        correctIndex: 1,
        explanation:
          '"Nel mezzo del cammin di nostra vita" — in the middle of our life\'s journey — Dante is midway through life (approximately 35, half of the biblical 70 years) and lost in a wood "savage, rough, and stern." The wood is widely read as spiritual disorder and the loss of moral direction that the journey will correct.',
      },
      {
        id: 'inferno-0-2',
        type: 'true_false',
        text: 'The three beasts Dante encounters at the foot of the sunlit hill in Canto I represent sins he personally has committed.',
        correctBool: false,
        explanation:
          'The leopard, lion, and she-wolf symbolize categories of sin (traditionally lust/fraud, pride/violence, and avarice/incontinence) that block human progress toward God. They are not exclusively Dante\'s personal sins but obstacles facing humanity — and specifically the corruption Dante saw in Florence and Italy.',
      },
      {
        id: 'inferno-0-3',
        type: 'multiple_choice',
        text: 'Virgil appears as Dante\'s guide through Hell and Purgatory. What is Virgil\'s primary limitation as a guide?',
        options: [
          'He can only speak Latin, so he cannot communicate with the souls of medieval sinners',
          'He is a shade from Limbo who lacks divine grace and cannot enter the higher reaches of Paradise',
          'He is biased toward Roman heroes and gives misleading accounts of non-Roman sinners',
          'He must rest every four hours, slowing the journey through Hell considerably',
        ],
        correctIndex: 1,
        explanation:
          'Virgil is a virtuous pagan who lived before Christ and was never baptized. He dwells in Limbo (the first circle) without torment but also without God\'s light. He can guide Dante through Hell and Purgatory using reason, but cannot enter Paradise — that requires divine grace, which is why Beatrice will eventually replace him.',
      },
      {
        id: 'inferno-0-4',
        type: 'passage_id',
        text: 'Virgil tells Dante in Canto II that he was sent to help him by a lady in Heaven. Who is this lady, and why does it matter?',
        options: [
          'The Virgin Mary, showing that Dante\'s journey has the highest possible divine sanction',
          'Beatrice, the woman Dante loved, who descended from Heaven to ask Virgil for help on Dante\'s behalf',
          'Lucia, representing illuminating grace, acting on direct orders from God',
          'St. Clare, patron of poets, interceding for Dante\'s poetic mission',
        ],
        correctIndex: 1,
        explanation:
          'Beatrice, Dante\'s idealized beloved who died in 1290, descends from Heaven to Virgil in Limbo and begs him to rescue her friend from his spiritual crisis. She is moved by the Virgin Mary through Lucia. The chain — Mary, Lucia, Beatrice — establishes that Dante\'s journey is divinely ordained at the highest level.',
      },
    ],
    1: [
      {
        id: 'inferno-1-1',
        type: 'multiple_choice',
        text: 'Canto III bears the famous inscription "Abandon all hope, ye who enter here." What else does the Gate of Hell\'s inscription say that reveals how Dante views Hell\'s creation?',
        options: [
          'That Hell was created before the universe, as sin is older than creation',
          'That Hell was made by divine Power, highest Wisdom, and primal Love — i.e., by the Trinity',
          'That Hell is temporary and will be dissolved at the Last Judgment',
          'That only those who chose evil freely are here, absolving God of all responsibility',
        ],
        correctIndex: 1,
        explanation:
          'The inscription states Hell was made by "Justice of the Supreme Creator" through divine power, wisdom, and love. For Dante, Hell is not a failure of God\'s goodness but an expression of divine justice. This challenges readers to understand punishment as the necessary consequence of freely chosen sin.',
      },
      {
        id: 'inferno-1-2',
        type: 'true_false',
        text: 'The souls in Limbo (Canto IV) suffer active torment — wailing and fire — because they rejected Christ.',
        correctBool: false,
        explanation:
          'Limbo is characterized by "sighs, not torments." The virtuous pagans and unbaptized infants there suffer only the deprivation of God\'s presence — a perpetual sense of incompleteness — not physical pain. Dante shows them in a noble castle, dwelling in honorable sadness.',
      },
      {
        id: 'inferno-1-3',
        type: 'multiple_choice',
        text: 'In Limbo, Dante meets Homer, Horace, Ovid, and Lucan. How does Homer greet Dante, and what is the significance of this scene?',
        options: [
          'Homer rebukes Dante for writing in Italian rather than the universal language of Latin',
          'Homer admits Dante into their company as a sixth great poet, an act of extraordinary self-placement by Dante',
          'Homer speaks only in Greek, which Dante cannot understand, emphasizing the distance of antiquity',
          'Homer prophesies that Dante\'s journey will result in the greatest poem ever written',
        ],
        correctIndex: 1,
        explanation:
          'Homer (the "sovereign poet") leads the group, and they include Dante in their circle with a nod. Dante is calling himself the worthy successor to the classical tradition — an act of audacious literary self-confidence that announces his epic ambitions.',
      },
      {
        id: 'inferno-1-4',
        type: 'passage_id',
        text: 'Why does Dante place Francesca da Rimini and Paolo in the second circle (lust) rather than in a lower, more severe circle of Hell?',
        options: [
          'Because they sinned only once and immediately regretted it',
          'Because lust is the least severe of the sins of incontinence — they were overwhelmed by passion rather than acting with cold deliberate malice',
          'Because Francesca\'s family was allied with Dante\'s political faction, so he showed them mercy',
          'Because their sin caused no harm to others, only to themselves',
        ],
        correctIndex: 1,
        explanation:
          'Dante\'s Hell is structured by the severity of sin: sins of incontinence (passion overwhelming reason) are higher up and less severely punished than sins of violence or fraud. Lust is the first circle of actual punishment, showing that Dante views passion-driven sin as grave but less culpable than calculated betrayal.',
      },
    ],
    2: [
      {
        id: 'inferno-2-1',
        type: 'multiple_choice',
        text: 'In Cantos V–VII, Dante encounters sinners of lust, gluttony, and avarice/prodigality. What structural principle governs the punishments in Hell?',
        options: [
          'Punishments are assigned by lot with no relationship to the sin committed',
          'The punishment mirrors or inverts the sin — the contrapasso — connecting the soul\'s eternal state to its earthly choice',
          'All punishments involve fire in some form, symbolizing God\'s purifying justice',
          'Punishments grow more severe at random to remind sinners that suffering is not earned but given',
        ],
        correctIndex: 1,
        explanation:
          'Dante\'s contrapasso (counter-suffering) means each punishment reflects the nature of the sin. The lustful are whirled in endless storm as they were blown by passion. The gluttonous wallow in filth as they indulged appetite. The hoarders and squanderers push weights against each other for eternity. The punishment enacts the sin\'s inner logic.',
      },
      {
        id: 'inferno-2-2',
        type: 'true_false',
        text: 'Plutus, guardian of the fourth circle, speaks intelligibly to Dante and demands a toll before allowing passage.',
        correctBool: false,
        explanation:
          'Plutus shouts "Pape Satàn, pape Satàn aleppe!" — a cry no one has ever conclusively decoded — before Virgil silences him with a word. He collapses like a sail in a broken mast. His incoherence signals the degradation of the avaricious: wealth-worship destroys the capacity for meaningful speech.',
      },
      {
        id: 'inferno-2-3',
        type: 'multiple_choice',
        text: 'Dante cannot recognize any of the souls in the fourth circle (avarice/prodigality) as individuals. What does this inability to recognize them imply?',
        options: [
          'Dante is too frightened to look at them closely',
          'Their total absorption in material things in life has stripped them of individual identity in death',
          'The souls are moving too quickly for Dante to observe their faces',
          'Virgil prevents Dante from interacting with souls who lived after Dante\'s time',
        ],
        correctIndex: 1,
        explanation:
          'Virgil explains that the souls\' undiscriminating pursuit of wealth in life — either hoarding or wasting without discrimination — has made them indistinguishable in death. The sin that denied the individual worth of persons (seeing only money) has denied these souls their own individuality. This is one of Dante\'s most pointed moral observations.',
      },
    ],
    3: [
      {
        id: 'inferno-3-1',
        type: 'multiple_choice',
        text: 'The river Styx in Canto VIII surrounds what part of Hell, and what do the souls do in its swamp?',
        options: [
          'It encircles Dis, the lower city of Hell; souls of the wrathful fight on the surface while the sullen gurgle beneath',
          'It encircles Limbo; souls swim across it as their first act of entering Hell',
          'It encircles the eighth circle; souls are boiled in it for sins of fraud',
          'It encircles the ninth circle; souls are frozen in it for sins of treachery',
        ],
        correctIndex: 0,
        explanation:
          'The Styx forms the fifth circle. The actively wrathful tear at each other on the muddy surface. Beneath the surface, the sullen (passive anger/acedia) bubble and sigh, unable even to express themselves above water. Both forms of wrath are punished in the same swamp, contrasting noisy and silent failure to love.',
      },
      {
        id: 'inferno-3-2',
        type: 'true_false',
        text: 'Dante feels sympathy and compassion for Filippo Argenti, the soul who grabs the boat in the Styx, and asks Virgil to help him.',
        correctBool: false,
        explanation:
          'Dante actively wishes Argenti harmed, telling Virgil he would like to see him further tormented — and Virgil praises Dante for the response. Argenti was a political enemy of Dante\'s in Florence. This is one of the most contested moments in the Inferno: Dante\'s pleasure in an enemy\'s suffering sits uneasily with Christian mercy.',
      },
      {
        id: 'inferno-3-3',
        type: 'multiple_choice',
        text: 'The city of Dis marks a major structural boundary in Hell. What distinguishes the sins punished inside Dis from those in the upper circles?',
        options: [
          'Inside Dis, sins are punished by fire rather than water or wind',
          'Inside Dis, the sins are those of deliberate malice — violence and fraud — rather than weakness of will (incontinence)',
          'Inside Dis, only souls from the Christian era are punished, while pagans remain in the upper circles',
          'Inside Dis, Virgil\'s guidance is no longer valid and Dante must find his own way',
        ],
        correctIndex: 1,
        explanation:
          'Following Aristotle\'s ethical framework, Dante divides Hell at the walls of Dis: the upper circles hold the incontinent (those overcome by passion), while Dis contains the malicious — those who chose evil deliberately through violence or fraud. The moral distinction is between weakness and wickedness.',
      },
    ],
    4: [
      {
        id: 'inferno-4-1',
        type: 'multiple_choice',
        text: 'An angel opens the gates of Dis after the demons refuse to let Dante and Virgil pass. What does the angel\'s effortless arrival suggest about the journey\'s authority?',
        options: [
          'That Dante possesses magical powers strong enough to summon angels at will',
          'That Virgil alone, as a pagan, cannot force entry, proving the limits of reason without grace',
          'That the journey has divine sanction that Hell itself cannot ultimately resist',
          'That Dante is already spiritually pure enough to command heavenly messengers',
        ],
        correctIndex: 2,
        explanation:
          'The demons\' resistance emphasizes that reason (Virgil) alone cannot overcome certain obstacles — but the angel\'s easy arrival with a wand shows that Dante\'s mission has divine backing. Hell cannot permanently obstruct a journey that Heaven has authorized. The episode reinforces the poem\'s theodicy: divine will prevails.',
      },
      {
        id: 'inferno-4-2',
        type: 'true_false',
        text: 'The heretics in Canto X are punished in burning tombs that will be sealed shut forever after the Last Judgment.',
        correctBool: true,
        explanation:
          'The heretics lie in burning open sarcophagi. Virgil explains that after the Last Judgment, when souls are reunited with their bodies, the lids will be sealed permanently — eternal entombment being the punishment for those who denied the soul\'s immortality in life.',
      },
      {
        id: 'inferno-4-3',
        type: 'multiple_choice',
        text: 'Farinata degli Uberti in Canto X can predict the future but cannot know the present. What irony does this create for the souls in Hell?',
        options: [
          'They can foresee their own eventual release from Hell but cannot enjoy the present moment',
          'They know the future of the living world but are entirely cut off from current events, so their knowledge becomes useless as time passes',
          'They can see Dante\'s future death but are powerless to warn him',
          'They have perfect knowledge of God\'s plan but cannot understand why they are being punished',
        ],
        correctIndex: 1,
        explanation:
          'Farinata explains that damned souls have a cone of prophetic vision extending into the future but a blind spot in the present. After the Last Judgment, when there is no more future to see, they will be in total ignorance. The heretics who denied the soul\'s eternity are condemned to an eternity of increasingly useless foresight — they can see everything except what is happening now.',
      },
    ],
  },

  hamlet: {
    0: [
      {
        id: 'hamlet-0-1',
        type: 'multiple_choice',
        text: 'The ghost of King Hamlet appears in Act 1 and reveals the truth of his death. What does he claim happened to him?',
        options: [
          'He was bitten by a serpent while sleeping in his garden, as officially reported',
          'He was poisoned by Claudius, who poured hebona in his ear while he slept',
          'He was pushed from the battlements by Claudius during a nighttime argument',
          'He was poisoned by Gertrude, who acted at Claudius\'s urging',
        ],
        correctIndex: 1,
        explanation:
          'The ghost tells Hamlet that while he slept in his garden, Claudius crept in and poured the juice of cursed hebenon ("hebona") into his ear. The poison curdled his blood, killed him, and sent him to his death "with all my imperfections on my head" — unabsolved, unable to receive last rites.',
      },
      {
        id: 'hamlet-0-2',
        type: 'true_false',
        text: 'Hamlet greets the news of his father\'s ghost with immediate, uncomplicated belief and resolution to act at once.',
        correctBool: false,
        explanation:
          'Hamlet\'s response is intense but conflicted. He demands to speak with the ghost alone, but later admits he must have "grounds more relative" than a ghost\'s word — spirits can be devils in pleasing shapes tempting him to damnation. His epistemic doubt is one of the play\'s central engines.',
      },
      {
        id: 'hamlet-0-3',
        type: 'multiple_choice',
        text: 'Before the ghost appears, Hamlet\'s first soliloquy ("O, that this too, too solid flesh") reveals the primary source of his initial despair. What is it?',
        options: [
          'Grief over his father\'s death and his inability to avenge it',
          'Moral revulsion at his mother\'s rapid remarriage to Claudius',
          'Resentment that he was passed over for the throne in favor of Claudius',
          'Fear that Denmark is about to be invaded by Fortinbras',
        ],
        correctIndex: 1,
        explanation:
          'Before Hamlet knows anything about murder, his anguish centers on Gertrude: she married Claudius within two months of his father\'s death. "Frailty, thy name is woman" is directed at her. His grief for his father is real, but the thing that most wounds him is his mother\'s apparent erasure of a marriage he idealized.',
      },
      {
        id: 'hamlet-0-4',
        type: 'passage_id',
        text: 'Claudius\'s opening speech in Act 1, Scene 2 — balancing mourning and celebration — is a masterpiece of rhetoric. What does it reveal about his political ability?',
        options: [
          'He is an incoherent speaker whose guilt makes him contradict himself publicly',
          'He is a skilled manipulator who can frame usurpation and incest as natural transitions requiring collective support',
          'He is a weak king who relies on Gertrude\'s authority to legitimize his rule',
          'He is genuinely remorseful and uses the speech to signal his awareness of wrongdoing',
        ],
        correctIndex: 1,
        explanation:
          'Claudius opens by holding two contradictory ideas — grief and joy, death and marriage — simultaneously, presenting them as harmonious. The speech enlists the court in normalizing what has happened. He is formidably intelligent and politically skilled, which makes him a worthy antagonist and Hamlet\'s delay more understandable.',
      },
    ],
    1: [
      {
        id: 'hamlet-1-1',
        type: 'multiple_choice',
        text: 'Polonius gives Laertes a famous string of maxims as Laertes departs for France. What is the dramatic irony of this scene?',
        options: [
          'Polonius himself violates nearly every piece of advice he gives his son',
          'Laertes will die precisely because he follows one of his father\'s maxims too literally',
          'The maxims are secretly coded messages warning Laertes about Hamlet\'s madness',
          'Ophelia listens from behind a curtain and will use the advice to manipulate Hamlet',
        ],
        correctIndex: 0,
        explanation:
          'Polonius\'s advice — be true to yourself, give your thoughts no tongue, beware of entrance to a quarrel — is sound in the abstract. But Polonius himself is a busybody who gives voice to every thought, meddles constantly, and creates the fatal quarrel (by eavesdropping behind the arras) that results in Hamlet killing him. His death is caused by his own principles\' opposite.',
      },
      {
        id: 'hamlet-1-2',
        type: 'true_false',
        text: 'Polonius instructs Ophelia to stop seeing Hamlet because he is genuinely convinced Hamlet is dangerously unstable and poses a physical risk to her.',
        correctBool: false,
        explanation:
          'Polonius instructs Ophelia to avoid Hamlet primarily because he fears Hamlet — a prince who cannot marry beneath his station — is merely toying with her affections and that it will embarrass Polonius politically if she is seen as naive. His concern is social and political, not protective.',
      },
      {
        id: 'hamlet-1-3',
        type: 'multiple_choice',
        text: 'Hamlet\'s "To be, or not to be" soliloquy raises a central philosophical question. What specifically is Hamlet debating?',
        options: [
          'Whether to confess his knowledge of his father\'s murder to Gertrude',
          'Whether to endure life\'s suffering passively or to act against it — with suicide as one form of action — and why "the dread of something after death" prevents decisive action',
          'Whether the ghost is a devil or truly his father\'s spirit',
          'Whether to kill Claudius now or wait until he can be damned rather than saved',
        ],
        correctIndex: 1,
        explanation:
          '"To be or not to be" is not simply about suicide but about the general human question of whether to suffer passively or to take action against suffering. The soliloquy identifies "conscience" — the moral uncertainty about what follows death — as the force that makes "cowards of us all," paralyzing decisive action. It is a meditation on Hamlet\'s own predicament.',
      },
      {
        id: 'hamlet-1-4',
        type: 'passage_id',
        text: 'Hamlet\'s instruction to the players to "hold the mirror up to nature" articulates what theory of dramatic art?',
        options: [
          'That plays should flatter their audiences with an idealized image of human greatness',
          'That the purpose of theater is realistic representation of human behavior that reveals truth and corrects vice',
          'That actors should suppress their own emotions entirely and mimic only the surface of behavior',
          'That plays derive their power from supernatural subject matter, not realistic depiction',
        ],
        correctIndex: 1,
        explanation:
          'Hamlet\'s speech to the players is Shakespeare\'s own artistic credo embedded in the play. Theater should show "virtue her own feature, scorn her own image, and the very age and body of the time his form and pressure" — meaning drama reflects reality faithfully enough to expose hypocrisy and vice, which is exactly what The Mousetrap is designed to do.',
      },
    ],
    2: [
      {
        id: 'hamlet-2-1',
        type: 'multiple_choice',
        text: 'The "play within a play" (The Mousetrap) confirms Hamlet\'s suspicions. How does Claudius react, and what does this prove or fail to prove?',
        options: [
          'Claudius laughs at the play, proving his innocence, which sends Hamlet into deeper doubt',
          'Claudius rises and calls for light, which Hamlet and Horatio both read as a sign of guilty conscience, though it doesn\'t constitute legal or certain proof',
          'Claudius breaks down and confesses publicly, ending the play\'s central mystery',
          'Claudius recognizes the trap and has Hamlet arrested immediately after the performance',
        ],
        correctIndex: 1,
        explanation:
          'Claudius does abruptly call for light and leaves. Hamlet is jubilant and Horatio agrees the king "blench\'d." But rising at a distressing scene is not confession — it\'s at best circumstantial evidence of guilt. Hamlet\'s certainty may be psychologically real but remains philosophically shaky, and he still doesn\'t act immediately.',
      },
      {
        id: 'hamlet-2-2',
        type: 'true_false',
        text: 'When Hamlet finds Claudius praying in Act 3 and chooses not to kill him, his reasoning is that killing a man in prayer would send him to Heaven rather than Hell.',
        correctBool: true,
        explanation:
          'Hamlet reasons that killing Claudius during prayer would send him to Heaven in a state of grace — a better fate than his father, who was killed without last rites. He will wait for a moment when Claudius is sinning. This is either a genuine theological concern or an unconscious rationalization of delay — critics disagree sharply.',
      },
      {
        id: 'hamlet-2-3',
        type: 'multiple_choice',
        text: 'Hamlet accidentally kills Polonius, mistaking him for Claudius hiding behind the arras. What are the major consequences of this accident for the play\'s final acts?',
        options: [
          'It gives Claudius the pretext to send Hamlet to England and arrange his execution',
          'It causes Gertrude to confess to Claudius that she suspects Hamlet knows the truth',
          'It directly causes Ophelia\'s madness and death, and it gives Laertes personal motivation to kill Hamlet',
          'Both A and C',
        ],
        correctIndex: 3,
        explanation:
          'Polonius\'s death cascades. It gives Claudius legitimate cause to exile Hamlet and arrange his murder in England. It drives Ophelia to madness (her father killed by the man she loves) and her subsequent drowning. And it transforms Laertes from a peripheral character to Claudius\'s willing instrument of vengeance — the man who actually kills Hamlet.',
      },
    ],
    3: [
      {
        id: 'hamlet-3-1',
        type: 'multiple_choice',
        text: 'Ophelia\'s mad scenes (Act 4) are powerful partly because of the songs she sings. What do the content of her songs suggest about what has most damaged her?',
        options: [
          'Her fear of Hamlet\'s madness, which she attributes to dark spirits',
          'Grief over both her father\'s death and sexual betrayal — the songs suggest she and Hamlet were intimate, and he abandoned her',
          'Guilt over having been used by Polonius to spy on Hamlet',
          'Religious terror that her father died without last rites and is damned',
        ],
        correctIndex: 1,
        explanation:
          'Ophelia\'s songs are startlingly explicit. The Valentine\'s Day song is about a young woman seduced and abandoned after sleeping with a man. Whether the relationship with Hamlet was consummated is deliberately ambiguous, but Shakespeare uses the songs to suggest Ophelia\'s madness is driven by both grief and erotic betrayal — not just filial loss.',
      },
      {
        id: 'hamlet-3-2',
        type: 'true_false',
        text: 'Laertes immediately accepts Claudius\'s account of Hamlet\'s guilt in Polonius\'s death without any apparent skepticism.',
        correctBool: true,
        explanation:
          'Laertes arrives in Denmark furious and credulous. Claudius manipulates him masterfully — pointing the blame entirely at Hamlet. Laertes\' passionate grief makes him easy to weaponize. He never seriously questions Claudius\'s narrative, making him a tragic contrast to Hamlet\'s obsessive need for certainty before action.',
      },
      {
        id: 'hamlet-3-3',
        type: 'multiple_choice',
        text: 'Hamlet returns from the sea voyage having discovered Claudius\'s plot to have him killed in England. What does his return and his behavior in Act 5 (especially at Ophelia\'s grave) suggest has changed in him?',
        options: [
          'He has become cold and calculating, focused purely on revenge with no emotional investment',
          'He has reached a kind of existential acceptance — "the readiness is all" — and acts with less tortured deliberation',
          'He now believes Gertrude was complicit in his father\'s murder and plans to kill her too',
          'He is more paralyzed than ever, weeping continuously and unable to resolve on action',
        ],
        correctIndex: 1,
        explanation:
          'The Hamlet of Act 5 is noticeably different: more at peace, less overwrought. "There\'s a divinity that shapes our ends" and "the readiness is all" suggest he has surrendered some of his anxious need for control, accepting that he will act when the moment comes. His explosive grief at Ophelia\'s grave is real but brief; the agonized paralysis of Acts 2–4 has loosened.',
      },
    ],
    4: [
      {
        id: 'hamlet-4-1',
        type: 'multiple_choice',
        text: 'At the final duel, four characters die. What does the sequence of deaths — Gertrude, Laertes, Claudius, Hamlet — reveal about the play\'s moral accounting?',
        options: [
          'All deaths are equally accidental, showing fate is random and moral distinctions are meaningless',
          'The innocent die first, then the complicit, showing that corruption contaminates even the virtuous',
          'Each character dies in direct consequence of their own moral failures or the plots they set in motion',
          'Only Claudius and Laertes deserve their deaths; Gertrude and Hamlet are tragic victims of circumstances entirely outside their control',
        ],
        correctIndex: 2,
        explanation:
          'Gertrude drinks the poison Claudius prepared as a backup to kill Hamlet — she dies of Claudius\'s treachery toward her own son. Laertes is cut by the poisoned blade he prepared to commit premeditated murder — he dies by his own weapon. Claudius is killed with both the poisoned sword and the poisoned cup he arranged. Hamlet dies of the wound from the blade he chose to fight with, which was already poisoned by the time he picked it up. Justice is not tidy, but each death connects to choices made.',
      },
      {
        id: 'hamlet-4-2',
        type: 'true_false',
        text: 'Horatio survives the final scene, and Hamlet\'s dying request is for Horatio to remain alive and tell Hamlet\'s story to the world.',
        correctBool: true,
        explanation:
          'Horatio tries to drink the remaining poison to die with Hamlet, but Hamlet stops him: "Absent thee from felicity awhile" and tell my story. Horatio\'s survival — and the arrival of Fortinbras to restore political order — means the play ends with the possibility of meaning being made from the carnage.',
      },
      {
        id: 'hamlet-4-3',
        type: 'passage_id',
        text: '"The rest is silence." Why are these Hamlet\'s last words particularly resonant given the play\'s central preoccupations?',
        options: [
          'They confirm Hamlet\'s belief in an afterlife of peaceful quiet, contrasting the ghost\'s tormented state',
          'A play obsessed with words, self-expression, and the inadequacy of language ends with the protagonist falling silent — suggesting that ultimate truth lies beyond what can be articulated',
          'They are addressed to Horatio, instructing him not to speak of what he has witnessed',
          'They ironically echo Claudius\'s own dying words, showing Hamlet has become what he fought against',
        ],
        correctIndex: 1,
        explanation:
          'Hamlet is, above all else, a play about language — soliloquies, plays, letters, rhetoric, silence. Hamlet talks incessantly, trying to think his way to action and truth. "The rest is silence" is the final, unanswerable response to all of that: death renders words superfluous. The hero who lived through language dies into wordlessness.',
      },
    ],
  },

  pride: {
    0: [
      {
        id: 'pride-0-1',
        type: 'multiple_choice',
        text: 'The famous opening line of Pride and Prejudice — "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife" — is best understood as what?',
        options: [
          'A sincere statement of Austen\'s belief in the natural pairing of wealth and marriage',
          'Free indirect discourse presenting the social consensus ironically, revealing how society projects desires onto wealthy men',
          'Mrs. Bennet\'s internal monologue, establishing her as the novel\'s narrator',
          'A direct quotation from a contemporary conduct manual that Austen is endorsing',
        ],
        correctIndex: 1,
        explanation:
          'The sentence is arch. It presents a social "truth" that is actually society\'s convenient projection — wealthy men don\'t necessarily want wives, but the community around them certainly wants to provide them with one. Austen immediately establishes the gap between social reality and social performance that the novel will explore.',
      },
      {
        id: 'pride-0-2',
        type: 'true_false',
        text: 'Mr. Bennet is portrayed as an entirely sympathetic and responsible father who is simply overwhelmed by his wife\'s silliness.',
        correctBool: false,
        explanation:
          'Mr. Bennet is witty and likable, but Austen is critical of him. He retreats into ironic detachment rather than guiding his daughters or managing the family\'s situation. He married Mrs. Bennet for her looks, recognized the mistake, and withdrew — his failure to secure the entail or save money has left his daughters genuinely vulnerable. His humor is a defense mechanism, not virtue.',
      },
      {
        id: 'pride-0-3',
        type: 'multiple_choice',
        text: 'Bingley\'s arrival at Netherfield Park sets the plot in motion. How does his first interaction with the Bennet family proceed at the Meryton ball?',
        options: [
          'He dances exclusively with Jane, immediately declaring a preference that shocks the neighborhood',
          'He dances with Jane twice, singles her out for attention, and makes a generally excellent impression on the whole neighborhood',
          'He initially mistakes Elizabeth for Jane and pays Elizabeth special attention before being corrected',
          'He comes with Darcy, who quickly overshadows him and draws all the attention away from Bingley',
        ],
        correctIndex: 1,
        explanation:
          'Bingley dances with Jane twice — the marker of serious interest — and is generally charming and admired. Darcy is also present but creates an entirely different impression by refusing to dance with anyone not already in his party and making a dismissive remark about Elizabeth, which she overhears.',
      },
      {
        id: 'pride-0-4',
        type: 'passage_id',
        text: 'Darcy\'s famous remark that Elizabeth is "tolerable, but not handsome enough to tempt me" shapes Elizabeth\'s initial feelings toward him. What does Austen suggest about first impressions through this exchange?',
        options: [
          'That first impressions are reliable guides to character and Elizabeth is right to distrust Darcy',
          'That both Elizabeth and Darcy form snap judgments from limited information — Elizabeth from a single overheard slight, Darcy from social circumstance — and both will need to revise them',
          'That Darcy\'s remark is entirely accurate and he later falls for Elizabeth despite his better judgment',
          'That social rudeness always reflects deep moral deficiency and cannot be explained by context',
        ],
        correctIndex: 1,
        explanation:
          'The novel\'s original title was "First Impressions." Both protagonists are initially wrong about each other: Elizabeth\'s prejudice against Darcy (formed from one remark and Wickham\'s lies) and Darcy\'s pride (formed from the Bennets\' vulgarity and his class assumptions) both need correcting. The novel is a mutual education.',
      },
    ],
    1: [
      {
        id: 'pride-1-1',
        type: 'multiple_choice',
        text: 'Mr. Collins visits Longbourn with a specific purpose. What is his intention, and what has prompted it?',
        options: [
          'He comes to apologize for the entail that will deprive the Bennet daughters of their home',
          'He comes to court one of the Bennet daughters as a way of making amends for inheriting the estate, acting on Lady Catherine\'s advice to marry',
          'He comes to assess the estate\'s value before claiming it on Mr. Bennet\'s death',
          'He comes seeking Elizabeth specifically, having heard of her from a mutual acquaintance in Kent',
        ],
        correctIndex: 1,
        explanation:
          'Collins explains his logic with painful precision: Lady Catherine advised him to marry; the entail means he will inherit from the Bennets; marrying a Bennet daughter seems a just remedy. He arrives intending to propose to Jane, then shifts to Elizabeth on learning Jane may be taken. His reasoning is entirely transactional.',
      },
      {
        id: 'pride-1-2',
        type: 'true_false',
        text: 'Charlotte Lucas accepts Mr. Collins\'s proposal because she is in love with him.',
        correctBool: false,
        explanation:
          'Charlotte accepts Collins as a "purely" practical matter. At 27, with no fortune and few prospects, she chooses security over affection. Austen presents this choice without full condemnation — the social system leaves Charlotte little alternative — but Elizabeth\'s horror at the match is also validated. Charlotte and Collins represent the marriage of convenience the novel critiques.',
      },
      {
        id: 'pride-1-3',
        type: 'multiple_choice',
        text: 'Wickham\'s account of his history with Darcy is received enthusiastically by Elizabeth and the neighborhood. What rhetorical technique makes his story so persuasive?',
        options: [
          'He produces documents proving his claims against Darcy',
          'He presents himself as reluctant to speak ill of Darcy while providing a damning narrative — apparent generosity that signals hidden virtue',
          'He gains credibility by accurately predicting how Darcy will behave at future social occasions',
          'His military uniform and rank give him institutional authority Elizabeth automatically respects',
        ],
        correctIndex: 1,
        explanation:
          'Wickham is a skilled social performer. He says repeatedly that he doesn\'t want to speak ill of Darcy even as he thoroughly blackens his reputation — performing magnanimity while doing the opposite. Elizabeth, already primed against Darcy, doesn\'t question the inconsistency. Austen is showing how charisma and flattery can subvert honest judgment.',
      },
    ],
    2: [
      {
        id: 'pride-2-1',
        type: 'multiple_choice',
        text: 'Darcy\'s first proposal to Elizabeth is remarkable in the history of literary proposals. What makes it so unusual?',
        options: [
          'It is delivered in a letter rather than face-to-face, showing Darcy\'s cowardice',
          'He declares his love while simultaneously expressing his reservations about her family\'s inferiority and his struggle against his own feelings',
          'It is witnessed by multiple people, making Elizabeth\'s refusal a public humiliation for Darcy',
          'He proposes through an intermediary — Bingley — rather than directly',
        ],
        correctIndex: 1,
        explanation:
          'Darcy\'s proposal is a masterpiece of self-sabotage. He speaks at length about the inferiority of Elizabeth\'s connections, his own pride in overcoming his better judgment, and his long resistance to the attachment. He is genuinely surprised by her refusal — he expected the advantageous offer to override any objections. The proposal reveals exactly what Elizabeth objects to.',
      },
      {
        id: 'pride-2-2',
        type: 'true_false',
        text: 'Elizabeth\'s refusal of Darcy\'s first proposal is based solely on the false information she received from Wickham about Darcy\'s treatment of him.',
        correctBool: false,
        explanation:
          'Elizabeth refuses for two reasons: Wickham\'s account of Darcy\'s cruelty, and Darcy\'s own behavior — specifically his interference in Bingley and Jane\'s relationship, which he partially admits during the proposal. Even without Wickham\'s lies, the latter charge would be a substantial objection. Her refusal is partly wrong and partly justified.',
      },
      {
        id: 'pride-2-3',
        type: 'multiple_choice',
        text: 'Darcy\'s letter after the failed proposal is a turning point for Elizabeth. What does it change in her understanding?',
        options: [
          'She learns that Darcy and Wickham were actually close friends who had a minor financial dispute',
          'She realizes that her judgment of both men has been inverted — Wickham is the deceiver, Darcy the one who acted justly if harshly',
          'She discovers that Jane had secretly encouraged Bingley and that Darcy was right to separate them',
          'She accepts that all her objections to Darcy were based on pride and resolves to encourage him',
        ],
        correctIndex: 1,
        explanation:
          'The letter reveals Wickham\'s attempted elopement with Georgiana Darcy for her fortune, and explains Darcy\'s intervention between Bingley and Jane in terms Elizabeth can partly understand even if she objects to it. "Till this moment I never knew myself," she says — recognizing that her vaunted perceptiveness has been blind to the truth about both men.',
      },
    ],
    3: [
      {
        id: 'pride-3-1',
        type: 'multiple_choice',
        text: 'Lydia\'s elopement with Wickham has consequences beyond her own life. What does it threaten for her sisters?',
        options: [
          'It threatens to expose Jane\'s secret correspondence with Bingley',
          'It threatens the social ruin of the entire Bennet family, making respectable marriages for the remaining sisters much harder',
          'It forces Mr. Bennet to reveal the true state of the family finances to all his daughters',
          'It causes Lady Catherine to withdraw Darcy from the marriage market entirely',
        ],
        correctIndex: 1,
        explanation:
          'In Regency society, a young woman who eloped without marriage would have brought deep shame on her entire family. Even if regularized by a hasty wedding, Lydia\'s behavior attaches scandal to the Bennet name. This is the crisis that proves Darcy\'s character when Elizabeth later learns he secretly arranged and funded Wickham and Lydia\'s marriage to protect the family.',
      },
      {
        id: 'pride-3-2',
        type: 'true_false',
        text: 'Mrs. Bennet is pleased and excited by Lydia\'s marriage to Wickham, apparently unaware that the situation is deeply scandalous.',
        correctBool: true,
        explanation:
          'Mrs. Bennet\'s reaction to Lydia\'s marriage is jubilation: a daughter married! The first to be married! She is entirely oblivious to the circumstances that made the marriage necessary and the cost — financial and moral — at which it was secured. Her reaction is one of the novel\'s sharpest satirical moments.',
      },
      {
        id: 'pride-3-3',
        type: 'multiple_choice',
        text: 'Lady Catherine de Bourgh visits Longbourn to demand that Elizabeth promise not to marry Darcy. How does Elizabeth respond?',
        options: [
          'She promises nothing, refusing to be bullied into a denial, and says she will act according to her own happiness',
          'She tells Lady Catherine that Darcy has never proposed and the rumor is entirely unfounded',
          'She agrees to write to Darcy asking him to release her from any informal understanding',
          'She appeals to Mr. Bennet, deferring the decision to her father\'s authority',
        ],
        correctIndex: 0,
        explanation:
          'Elizabeth meets Lady Catherine\'s grandeur with perfect calm and refuses to make any promise. "I am only resolved to act in that manner, which will, in my own opinion, constitute my happiness, without reference to you, or to any person so wholly unconnected with me." The scene is Elizabeth\'s finest moment of self-definition against social pressure.',
      },
    ],
    4: [
      {
        id: 'pride-4-1',
        type: 'multiple_choice',
        text: 'Darcy\'s second proposal succeeds. What has changed in him since the first proposal that makes him a more deserving suitor?',
        options: [
          'He has acquired more money, making the Bennet family connection less of a social liability',
          'He has acted to save Lydia and the Bennet family from ruin, demonstrating that his love translates into genuine care for Elizabeth\'s entire family',
          'He has abandoned his pride entirely and now considers himself Elizabeth\'s social equal',
          'He has learned from Lady Catherine that Elizabeth refused him, which removed his excessive pride by humbling him',
        ],
        correctIndex: 1,
        explanation:
          'Darcy\'s intervention in the Wickham-Lydia crisis — finding them, paying Wickham\'s debts, arranging the marriage — goes far beyond what any man in love needs to do. He does it primarily for Elizabeth\'s sake, at real cost and with no expectation of credit. This act proves the transformation the first proposal demanded: his love has become generous rather than condescending.',
      },
      {
        id: 'pride-4-2',
        type: 'true_false',
        text: 'At the end of the novel, Jane and Bingley marry first, before Elizabeth and Darcy.',
        correctBool: true,
        explanation:
          'Jane and Bingley\'s engagement comes slightly before Elizabeth and Darcy\'s. Bingley returns to Netherfield and proposes to Jane, and it is in the happy atmosphere of that engagement that Darcy makes his second proposal to Elizabeth. The Bennet daughters\' romances conclude in the order the novel began them.',
      },
      {
        id: 'pride-4-3',
        type: 'passage_id',
        text: 'The novel ends with Elizabeth and Darcy\'s happy marriage, but what does Austen suggest about the Bennet family situation that prevents an entirely uncomplicated ending?',
        options: [
          'Kitty and Mary remain unmarried and their prospects are described as bleak',
          'The entail still stands and Mr. Collins will inherit Longbourn; the Bennet parents\' marriage has not improved; Lydia and Wickham are imprudent and will always need money',
          'Mr. Bennet refuses to acknowledge Darcy as a son-in-law because of the proud way the courtship began',
          'Lady Catherine\'s enmity means the Darcys must leave England for the continent',
        ],
        correctIndex: 1,
        explanation:
          'Austen\'s ending is happy but clear-eyed. Elizabeth and Darcy\'s marriage is a triumph of genuine understanding. But the entail remains unsolved, Lydia and Wickham continue their dissolute ways and require financial rescue, and Mr. and Mrs. Bennet\'s incompatibility is permanent. Individual happiness is possible within a flawed social structure, but the structure itself is not transformed.',
      },
    ],
  },

  crime: {
    0: [
      {
        id: 'crime-0-1',
        type: 'multiple_choice',
        text: 'At the beginning of Crime and Punishment, Raskolnikov is preoccupied with a "theory." What does this theory hold?',
        options: [
          'That poverty justifies theft as a form of redistributive justice',
          'That extraordinary individuals — Napoleonic figures — are above conventional moral law and may commit crimes to achieve great ends',
          'That the tsarist state is so corrupt that any act against its servants is morally justified',
          'That suffering purifies the soul and therefore one should seek out painful experiences',
        ],
        correctIndex: 1,
        explanation:
          'Raskolnikov divides humanity into "ordinary" and "extraordinary" people. Ordinary people must obey the law; extraordinary men — like Napoleon — have a right to transgress moral boundaries if their purposes are great enough. The pawnbroker murder is meant to prove to himself that he belongs to the second category.',
      },
      {
        id: 'crime-0-2',
        type: 'true_false',
        text: 'Raskolnikov kills Alyona Ivanovna, the pawnbroker, because he urgently needs money and knows she has a large sum at home.',
        correctBool: false,
        explanation:
          'While Raskolnikov is desperately poor, the murder is not primarily motivated by financial need. He frames it as an ideological experiment — proving his theory and ridding society of a "louse" who exploits the poor. He despises himself for even considering a base motive like greed. The money from the murder is never even properly used.',
      },
      {
        id: 'crime-0-3',
        type: 'multiple_choice',
        text: 'Raskolnikov kills not just the pawnbroker but also her half-sister Lizaveta. Why is Lizaveta\'s murder particularly significant?',
        options: [
          'Lizaveta was a police informant who would have identified Raskolnikov',
          'Lizaveta is described as gentle, pure, and innocent — her murder directly refutes Raskolnikov\'s theory that only a "louse" dies, exposing the theory\'s murderous incoherence',
          'Lizaveta had previously witnessed Raskolnikov planning the murder',
          'Lizaveta is the pawnbroker\'s business partner and equally guilty of exploiting the poor',
        ],
        correctIndex: 1,
        explanation:
          'Raskolnikov justified the murder by framing the pawnbroker as a parasite deserving death. But Lizaveta — a meek, exploited innocent — returns home unexpectedly and must be silenced. Her death destroys the theory\'s internal logic: the "extraordinary" act has killed the very type of person it was supposed to benefit.',
      },
      {
        id: 'crime-0-4',
        type: 'passage_id',
        text: 'Raskolnikov has a dream before the murder in which he watches a crowd of drunken peasants beat an old mare to death. What does this dream reveal about his psychological state?',
        options: [
          'It reveals his suppressed desire to commit violence and his need to overcome squeamishness',
          'It reveals his horror at cruelty and the compassion at war with his intellectual theory — he weeps bitterly, showing the moral self he is trying to suppress',
          'It is a symbolic preview of Lizaveta\'s murder, which he unconsciously anticipates',
          'It reflects his contempt for ordinary people who are incapable of extraordinary acts',
        ],
        correctIndex: 1,
        explanation:
          'In the dream, young Raskolnikov cries and tries to protect the dying horse. He wakes in anguish. The dream shows his deep moral sensitivity — the same sensitivity that makes the idea of murder unbearable — which his waking "theory" is trying to reason away. The horse dream is Dostoevsky showing us the soul Raskolnikov is about to wound.',
      },
    ],
    1: [
      {
        id: 'crime-1-1',
        type: 'multiple_choice',
        text: 'After the murder, Raskolnikov falls into a prolonged feverish illness. What does this illness primarily represent?',
        options: [
          'Physical infection contracted from the crime scene',
          'The psychological collapse of a self that cannot sustain the theory it acted on — the punishment following almost immediately from the crime',
          'Divine retribution manifesting as physical suffering',
          'Strategic feigned illness to avoid police questioning while he plans his next steps',
        ],
        correctIndex: 1,
        explanation:
          'The illness is psychological in origin. Raskolnikov\'s theory asserted that extraordinary men act without remorse; his immediate mental and physical breakdown proves the opposite. The novel\'s title announces that crime and punishment are inseparable — the punishment is not external but internal, nearly simultaneous with the act.',
      },
      {
        id: 'crime-1-2',
        type: 'true_false',
        text: 'Razumikhin, Raskolnikov\'s friend, abandons him when he discovers Raskolnikov is in a disturbed state after the murder.',
        correctBool: false,
        explanation:
          'Razumikhin is one of the novel\'s most loyal characters. He nurses Raskolnikov through his illness, advocates for him with the police, and remains his friend despite Raskolnikov\'s erratic behavior. He eventually marries Raskolnikov\'s sister Dunya. He represents healthy, practical humanity as a counterpoint to Raskolnikov\'s solipsistic theorizing.',
      },
      {
        id: 'crime-1-3',
        type: 'multiple_choice',
        text: 'Porfiry Petrovich, the investigating magistrate, conducts his interrogations of Raskolnikov in an unusual way. What is his technique?',
        options: [
          'He uses formal procedures, presenting hard evidence and demanding direct answers',
          'He engages Raskolnikov in extended philosophical discussions, uses apparent rambling and apparent doubt, and observes Raskolnikov\'s psychological reactions',
          'He assigns police informants to follow Raskolnikov and report his movements to build a case',
          'He presents Raskolnikov with false confessions from other suspects to provoke a denial',
        ],
        correctIndex: 1,
        explanation:
          'Porfiry is a psychological detective, not a procedural one. He probes Raskolnikov\'s ideas — even referencing his article about "extraordinary men" — and watches his reactions with sharp ironic interest. He already suspects Raskolnikov but lacks physical evidence; he tries to drive him to confession by pressure on the psychological wound the crime has opened.',
      },
      {
        id: 'crime-1-4',
        type: 'passage_id',
        text: 'Raskolnikov reads a published article he wrote before the murder about "extraordinary men." How does Porfiry use this article?',
        options: [
          'He uses it as a legal exhibit demonstrating premeditated intent to commit murder',
          'He uses it as an intellectual provocation — discussing it admiringly while signaling he understands exactly what it implies about Raskolnikov\'s self-image and potential motivation',
          'He publishes a rebuttal in the same journal to draw Raskolnikov into public debate',
          'He shares it with Sonya to warn her that Raskolnikov has dangerous philosophical views',
        ],
        correctIndex: 1,
        explanation:
          'Porfiry\'s discussion of the article is one of the novel\'s great cat-and-mouse scenes. He praises it, asks probing questions about its logic, and watches Raskolnikov squirm. He is telling Raskolnikov: I know your theory, I know what it implies, and I am giving you the opportunity to confess. The article is not evidence — it\'s a mirror Porfiry holds up.',
      },
    ],
    2: [
      {
        id: 'crime-2-1',
        type: 'multiple_choice',
        text: 'Sonya Marmeladova has become a prostitute. How does Dostoevsky present her relationship to this fact?',
        options: [
          'As someone degraded and spiritually broken by her circumstances, representing the corruption of the poor',
          'As a deeply religious figure whose inner purity and self-sacrifice are intensified rather than destroyed by her suffering — a Christ-figure',
          'As a pragmatic survivor who feels no shame about her profession since she does it for her family',
          'As someone whose religious faith is destroyed by her experience and must be rebuilt through Raskolnikov\'s philosophy',
        ],
        correctIndex: 1,
        explanation:
          'Sonya is one of Dostoevsky\'s most important creations: a meek, pure soul who has accepted profound degradation to feed her family, whose faith in God is absolute and unshaken. She does not represent corruption but its opposite — self-abnegating love and suffering that points toward resurrection. Her relationship with Raskolnikov is the spiritual counterweight to his theory.',
      },
      {
        id: 'crime-2-2',
        type: 'true_false',
        text: 'Raskolnikov confesses the murder to Sonya largely because he wants her to report him to the police.',
        correctBool: false,
        explanation:
          'Raskolnikov confesses to Sonya out of a complex need for human contact and perhaps unconscious desire for the path back to humanity she represents. He does not confess expecting or primarily wanting her to inform on him — he wants to share the unbearable secret, to be understood. Sonya responds with grief and urges him to confess publicly to release himself from his suffering.',
      },
      {
        id: 'crime-2-3',
        type: 'multiple_choice',
        text: 'What passage does Sonya read to Raskolnikov from the Bible, and why is this choice significant?',
        options: [
          'The Sermon on the Mount, because Raskolnikov needs to hear the core of Christian moral teaching',
          'The story of the raising of Lazarus, because it addresses the possibility of spiritual resurrection from death — the exact journey Raskolnikov must make',
          'The parable of the Prodigal Son, because Raskolnikov must return to his family and community',
          'The crucifixion narrative, because Raskolnikov must understand that suffering is redemptive',
        ],
        correctIndex: 1,
        explanation:
          'Sonya reads the raising of Lazarus — dead four days, raised by Christ\'s command. The passage speaks directly to Raskolnikov\'s condition: he is spiritually dead, and the novel\'s trajectory is toward his resurrection. The choice signals Dostoevsky\'s theological framework: the possibility of genuine renewal even from complete moral death.',
      },
    ],
    3: [
      {
        id: 'crime-3-1',
        type: 'multiple_choice',
        text: 'Svidrigailov, who pursues Dunya and has a sinister history, functions in the novel as what kind of figure in relation to Raskolnikov?',
        options: [
          'A red herring who draws police attention away from Raskolnikov by committing crimes of his own',
          'A dark double — someone who has acted on similar principles to Raskolnikov\'s theory without internal conflict, and who shows what Raskolnikov could become without remorse',
          'A genuinely reformed sinner whose example inspires Raskolnikov to confess',
          'A representative of the tsarist system whose corruption justifies Raskolnikov\'s revolutionary ideals',
        ],
        correctIndex: 1,
        explanation:
          'Svidrigailov has apparently committed serious crimes — possibly including his wife\'s death — without suffering Raskolnikov\'s psychological breakdown. He is unprincipled, nihilistic, and cynical. He represents the logical endpoint of Raskolnikov\'s theory applied without moral residue: a human being completely detached from conscience. His fate — suicide — is Dostoevsky\'s verdict on that path.',
      },
      {
        id: 'crime-3-2',
        type: 'true_false',
        text: 'Svidrigailov ultimately uses his money to do several acts of genuine charity before killing himself.',
        correctBool: true,
        explanation:
          'Before his suicide, Svidrigailov arranges for the care of Sonya\'s younger siblings, gives money to his fiancée\'s family, and performs several other acts of quiet generosity. His final hours are deeply ambiguous: a man without apparent faith or repentance who nonetheless acts charitably at the end. Dostoevsky gives him no tidy resolution.',
      },
      {
        id: 'crime-3-3',
        type: 'multiple_choice',
        text: 'Raskolnikov\'s mother and sister Dunya arrive in Petersburg. What does Raskolnikov\'s treatment of them during this period reveal about his psychology?',
        options: [
          'He is warm and attentive, concealing his guilt by focusing on their needs',
          'He is cold, erratic, and eventually drives them away, showing that the crime has severed his capacity for normal human connection',
          'He confesses to Dunya and begs her to intercede with the police on his behalf',
          'He focuses on protecting Dunya from Svidrigailov, suggesting his protective instincts are intact',
        ],
        correctIndex: 1,
        explanation:
          'Raskolnikov cannot sustain normal warmth with his own family. He is irritable, cold, and self-isolating. The theory that told him he was acting for humanity\'s benefit has in practice cut him off from particular human beings — the very people who love him. His alienation from his mother and sister dramatizes the theory\'s human cost.',
      },
    ],
    4: [
      {
        id: 'crime-4-1',
        type: 'multiple_choice',
        text: 'What finally causes Raskolnikov to go to the police station and confess?',
        options: [
          'Porfiry presents him with irrefutable physical evidence, leaving confession as his only option',
          'A combination of Sonya\'s continued presence and witness, and a chance encounter with a workman named Nikolai who falsely confessed — which paradoxically makes Raskolnikov feel more compelled to confess truly',
          'Dunya threatens to inform the police herself if he does not confess',
          'He has a religious vision while reading the Bible Sonya gave him',
        ],
        correctIndex: 1,
        explanation:
          'Nikolai\'s false confession throws the investigation into confusion and removes the immediate legal pressure on Raskolnikov — but paradoxically this makes him more, not less, compelled to confess. Porfiry privately tells Raskolnikov he knows the truth and advises confession. Sonya\'s silent presence and suffering wear down his resistance. The confession is not coerced but chosen — partly.',
      },
      {
        id: 'crime-4-2',
        type: 'true_false',
        text: 'At the moment of his confession, Raskolnikov has fully repented and accepted Christian faith.',
        correctBool: false,
        explanation:
          'This is one of Dostoevsky\'s most careful points. At the moment of his confession, Raskolnikov has not yet genuinely repented. He still thinks his crime was a mistake of execution rather than principle — he believes he is confessing because he is weak, not because the act was wrong. Genuine spiritual transformation comes only in the Epilogue, after years in Siberia, when he finally breaks down weeping over the New Testament.',
      },
      {
        id: 'crime-4-3',
        type: 'passage_id',
        text: 'The Epilogue of Crime and Punishment, set in Siberia, has been called both essential and anticlimactic. What does it accomplish that the main narrative cannot?',
        options: [
          'It describes the political reforms that make Raskolnikov\'s punishment less severe than expected',
          'It shows Sonya\'s death, which becomes the final catalyst for Raskolnikov\'s spiritual conversion',
          'It completes the arc from crime through psychological torment to genuine spiritual renewal — showing that resurrection from moral death is possible, even if the novel cannot portray the inner process in real time',
          'It establishes that Porfiry was wrong about Raskolnikov\'s guilt and that the true killer was Nikolai',
        ],
        correctIndex: 2,
        explanation:
          'The Epilogue is brief but necessary. The main novel shows crime and psychological punishment; the Epilogue shows the first stirring of genuine rebirth. Raskolnikov weeps over Sonya\'s Bible and sees life stretching ahead. Dostoevsky cannot dramatize the full process of spiritual regeneration — it would require another novel — but he points toward it, fulfilling the Lazarus promise.',
      },
    ],
  },
}

// ── Fallback Questions ─────────────────────────

const FALLBACK_QUESTIONS: ChapterQuestion[] = [
  {
    id: 'fallback-1',
    type: 'true_false',
    text: 'Close reading requires attending to specific word choices, structural patterns, and narrative perspective — not just summarizing events.',
    correctBool: true,
    explanation:
      'Literary comprehension means noticing how a text is constructed, not merely what happens in it. Diction, syntax, point of view, and structure are as meaningful as plot.',
  },
  {
    id: 'fallback-2',
    type: 'multiple_choice',
    text: 'When a literary critic analyzes a character\'s motivation, they primarily look at which of the following?',
    options: [
      'The author\'s biography and personal experiences',
      'The character\'s words, actions, and the context the author provides through other characters and events',
      'Whether the character\'s decisions would be considered rational in the modern world',
      'The historical period in which the book was published',
    ],
    correctIndex: 1,
    explanation:
      'Motivation is revealed through the text itself: what a character says, does, omits, and how other elements of the narrative contextualize those choices. Biography and history can be supplementary, but the primary evidence is always in the text.',
  },
  {
    id: 'fallback-3',
    type: 'passage_id',
    text: 'When a narrator describes events from inside one character\'s thoughts and feelings but uses the third person ("he," "she"), this technique is called:',
    options: [
      'First-person omniscient narration',
      'Second-person narration',
      'Third-person limited narration',
      'Epistolary narration',
    ],
    correctIndex: 2,
    explanation:
      'Third-person limited narration gives the intimacy of access to one character\'s inner life while maintaining the grammatical distance of "he" or "she." It is distinct from first-person (where the narrator is "I") and from third-person omniscient (where the narrator moves freely among all characters\' inner lives).',
  },
]

// ── Lookup Function ────────────────────────────

export function getQuestionsForChapter(
  bookTitle: string,
  chapterIndex: number
): ChapterQuestion[] {
  const title = bookTitle.toLowerCase()

  let bankKey: string | null = null

  if (title.includes('iliad')) {
    bankKey = 'iliad'
  } else if (title.includes('odyssey')) {
    bankKey = 'odyssey'
  } else if (title.includes('inferno')) {
    bankKey = 'inferno'
  } else if (title.includes('hamlet')) {
    bankKey = 'hamlet'
  } else if (title.includes('pride')) {
    bankKey = 'pride'
  } else if (title.includes('crime')) {
    bankKey = 'crime'
  } else if (title.includes('moby')) {
    bankKey = null
  } else if (title.includes('quixote')) {
    bankKey = null
  }

  if (bankKey !== null) {
    const bookBank = QUESTION_BANK[bankKey]
    if (bookBank) {
      const chapterQuestions = bookBank[chapterIndex]
      if (chapterQuestions && chapterQuestions.length > 0) {
        return chapterQuestions
      }
    }
  }

  return FALLBACK_QUESTIONS
}
