"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import type { Language } from "@/types";
import { LANGUAGE_LABELS, LANGUAGE_HEX } from "@/types";
import GrammarSection from "./grammar/GrammarSection";
import DeclensionTable, {
  type DeclensionData,
} from "./grammar/DeclensionTable";
import ConjugationTable, {
  type ConjugationData,
} from "./grammar/ConjugationTable";

/* ================================================================== */
/*  Latin Grammar Data                                                  */
/* ================================================================== */

const LATIN_NOUN_DECLENSIONS: DeclensionData[] = [
  {
    title: "1st Declension",
    exampleWord: "puella, puellae",
    meaning: "girl",
    gender: "f.",
    headers: ["Singular", "Plural"],
    rows: [
      { label: "Nominative", cells: ["puella", "puellae"], examples: ["Puella cantat. (The girl sings.)", "Puellae cantant. (The girls sing.)"] },
      { label: "Genitive", cells: ["puellae", "puell\u0101rum"], examples: ["Liber puellae. (The girl's book.)", "Liber puell\u0101rum. (The girls' book.)"] },
      { label: "Dative", cells: ["puellae", "puell\u012Bs"], examples: ["D\u014Dnum puellae d\u014D. (I give a gift to the girl.)", "D\u014Dna puell\u012Bs d\u014D. (I give gifts to the girls.)"] },
      { label: "Accusative", cells: ["puellam", "puell\u0101s"], examples: ["Puellam vide\u014D. (I see the girl.)", "Puell\u0101s vide\u014D. (I see the girls.)"] },
      { label: "Ablative", cells: ["puell\u0101", "puell\u012Bs"], examples: ["Cum puell\u0101. (With the girl.)", "Cum puell\u012Bs. (With the girls.)"] },
      { label: "Vocative", cells: ["puella", "puellae"], examples: ["Puella, ven\u012B! (Girl, come!)", "Puellae, ven\u012Bte! (Girls, come!)"] },
    ],
  },
  {
    title: "2nd Declension",
    exampleWord: "dominus, domin\u012B",
    meaning: "master, lord",
    gender: "m.",
    headers: ["Singular", "Plural"],
    rows: [
      { label: "Nominative", cells: ["dominus", "domin\u012B"], examples: ["Dominus venit. (The master comes.)", "Domin\u012B veniunt. (The masters come.)"] },
      { label: "Genitive", cells: ["domin\u012B", "domin\u014Drum"], examples: ["Servus domin\u012B. (The master's slave.)", "Serv\u012B domin\u014Drum. (The masters' slaves.)"] },
      { label: "Dative", cells: ["domin\u014D", "domin\u012Bs"], examples: ["Domin\u014D p\u0101re\u014D. (I obey the master.)", "Domin\u012Bs p\u0101r\u0113mus. (We obey the masters.)"] },
      { label: "Accusative", cells: ["dominum", "domin\u014Ds"], examples: ["Dominum vid\u0113. (See the master.)", "Domin\u014Ds vid\u0113te. (See the masters.)"] },
      { label: "Ablative", cells: ["domin\u014D", "domin\u012Bs"], examples: ["\u0100 domin\u014D. (From the master.)", "\u0100 domin\u012Bs. (From the masters.)"] },
      { label: "Vocative", cells: ["domine", "domin\u012B"], examples: ["Domine, audi! (Master, listen!)", "Domin\u012B, aud\u012Bte! (Masters, listen!)"] },
    ],
  },
  {
    title: "3rd Declension",
    exampleWord: "r\u0113x, r\u0113gis",
    meaning: "king",
    gender: "m.",
    headers: ["Singular", "Plural"],
    rows: [
      { label: "Nominative", cells: ["r\u0113x", "r\u0113g\u0113s"], examples: ["R\u0113x imperat. (The king commands.)", "R\u0113g\u0113s imperant. (The kings command.)"] },
      { label: "Genitive", cells: ["r\u0113gis", "r\u0113gum"], examples: ["Aula r\u0113gis. (The king's court.)", "Aulae r\u0113gum. (The kings' courts.)"] },
      { label: "Dative", cells: ["r\u0113g\u012B", "r\u0113gibus"], examples: ["R\u0113g\u012B fid\u0113lis. (Faithful to the king.)", "R\u0113gibus fid\u0113l\u0113s. (Faithful to the kings.)"] },
      { label: "Accusative", cells: ["r\u0113gem", "r\u0113g\u0113s"], examples: ["R\u0113gem colunt. (They honor the king.)", "R\u0113g\u0113s colunt. (They honor the kings.)"] },
      { label: "Ablative", cells: ["r\u0113ge", "r\u0113gibus"], examples: ["Sub r\u0113ge. (Under the king.)", "Sub r\u0113gibus. (Under the kings.)"] },
      { label: "Vocative", cells: ["r\u0113x", "r\u0113g\u0113s"], examples: ["R\u0113x, aud\u012B! (King, listen!)", "R\u0113g\u0113s, aud\u012Bte! (Kings, listen!)"] },
    ],
  },
  {
    title: "4th Declension",
    exampleWord: "manus, man\u016Bs",
    meaning: "hand",
    gender: "f.",
    headers: ["Singular", "Plural"],
    rows: [
      { label: "Nominative", cells: ["manus", "man\u016Bs"], examples: ["Manus fortis est. (The hand is strong.)", "Man\u016Bs fort\u0113s sunt. (The hands are strong.)"] },
      { label: "Genitive", cells: ["man\u016Bs", "manuum"], examples: ["Opus man\u016Bs. (The work of the hand.)", "Opus manuum. (The work of hands.)"] },
      { label: "Dative", cells: ["manu\u012B", "manibus"], examples: ["Manu\u012B trad\u014D. (I hand over to the hand.)", "Manibus trad\u014D. (I hand over to the hands.)"] },
      { label: "Accusative", cells: ["manum", "man\u016Bs"], examples: ["Manum tene\u014D. (I hold the hand.)", "Man\u016Bs tene\u014D. (I hold the hands.)"] },
      { label: "Ablative", cells: ["man\u016B", "manibus"], examples: ["Man\u016B d\u0113xtr\u0101. (With the right hand.)", "Manibus amb\u0101bus. (With both hands.)"] },
      { label: "Vocative", cells: ["manus", "man\u016Bs"], examples: ["", ""] },
    ],
  },
  {
    title: "5th Declension",
    exampleWord: "di\u0113s, di\u0113\u012B",
    meaning: "day",
    gender: "m./f.",
    headers: ["Singular", "Plural"],
    rows: [
      { label: "Nominative", cells: ["di\u0113s", "di\u0113s"], examples: ["Di\u0113s longus est. (The day is long.)", "Di\u0113s long\u012B sunt. (The days are long.)"] },
      { label: "Genitive", cells: ["di\u0113\u012B", "di\u0113rum"], examples: ["L\u016Bx di\u0113\u012B. (The light of the day.)", "L\u016Bx di\u0113rum. (The light of days.)"] },
      { label: "Dative", cells: ["di\u0113\u012B", "di\u0113bus"], examples: ["Di\u0113\u012B proxim\u014D. (On the next day.)", "Di\u0113bus fest\u012Bs. (On festival days.)"] },
      { label: "Accusative", cells: ["diem", "di\u0113s"], examples: ["Per diem. (Through the day.)", "Per di\u0113s. (Through the days.)"] },
      { label: "Ablative", cells: ["di\u0113", "di\u0113bus"], examples: ["Di\u0113 tertio. (On the third day.)", "Di\u0113bus proxim\u012Bs. (In the next days.)"] },
      { label: "Vocative", cells: ["di\u0113s", "di\u0113s"], examples: ["", ""] },
    ],
  },
];

const LATIN_VERB_CONJUGATIONS: ConjugationData[] = [
  {
    title: "1st Conjugation (-\u0101re)",
    exampleVerb: "am\u014D, am\u0101re",
    meaning: "to love",
    tenses: [
      {
        name: "Present",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["am\u014D", "am\u0101mus"], examples: ["I love.", "We love."] },
          { label: "2nd", cells: ["am\u0101s", "am\u0101tis"], examples: ["You love.", "You (pl.) love."] },
          { label: "3rd", cells: ["amat", "amant"], examples: ["He/she loves.", "They love."] },
        ],
      },
      {
        name: "Imperfect",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["am\u0101bam", "am\u0101b\u0101mus"], examples: ["I was loving.", "We were loving."] },
          { label: "2nd", cells: ["am\u0101b\u0101s", "am\u0101b\u0101tis"], examples: ["You were loving.", "You (pl.) were loving."] },
          { label: "3rd", cells: ["am\u0101bat", "am\u0101bant"], examples: ["He/she was loving.", "They were loving."] },
        ],
      },
      {
        name: "Future",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["am\u0101b\u014D", "am\u0101bimus"], examples: ["I will love.", "We will love."] },
          { label: "2nd", cells: ["am\u0101bis", "am\u0101bitis"], examples: ["You will love.", "You (pl.) will love."] },
          { label: "3rd", cells: ["am\u0101bit", "am\u0101bunt"], examples: ["He/she will love.", "They will love."] },
        ],
      },
      {
        name: "Perfect",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["am\u0101v\u012B", "am\u0101vimus"], examples: ["I have loved.", "We have loved."] },
          { label: "2nd", cells: ["am\u0101vist\u012B", "am\u0101vistis"], examples: ["You have loved.", "You (pl.) have loved."] },
          { label: "3rd", cells: ["am\u0101vit", "am\u0101v\u0113runt"], examples: ["He/she has loved.", "They have loved."] },
        ],
      },
      {
        name: "Pluperfect",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["am\u0101veram", "am\u0101ver\u0101mus"], examples: ["I had loved.", "We had loved."] },
          { label: "2nd", cells: ["am\u0101ver\u0101s", "am\u0101ver\u0101tis"], examples: ["You had loved.", "You (pl.) had loved."] },
          { label: "3rd", cells: ["am\u0101verat", "am\u0101verant"], examples: ["He/she had loved.", "They had loved."] },
        ],
      },
      {
        name: "Future Perfect",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["am\u0101ver\u014D", "am\u0101verimus"], examples: ["I will have loved.", "We will have loved."] },
          { label: "2nd", cells: ["am\u0101veris", "am\u0101veritis"], examples: ["You will have loved.", "You (pl.) will have loved."] },
          { label: "3rd", cells: ["am\u0101verit", "am\u0101verint"], examples: ["He/she will have loved.", "They will have loved."] },
        ],
      },
    ],
  },
  {
    title: "2nd Conjugation (-\u0113re)",
    exampleVerb: "mone\u014D, mon\u0113re",
    meaning: "to advise, warn",
    tenses: [
      {
        name: "Present",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["mone\u014D", "mon\u0113mus"], examples: ["I advise.", "We advise."] },
          { label: "2nd", cells: ["mon\u0113s", "mon\u0113tis"], examples: ["You advise.", "You (pl.) advise."] },
          { label: "3rd", cells: ["monet", "monent"], examples: ["He/she advises.", "They advise."] },
        ],
      },
      {
        name: "Imperfect",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["mon\u0113bam", "mon\u0113b\u0101mus"], examples: ["I was advising.", "We were advising."] },
          { label: "2nd", cells: ["mon\u0113b\u0101s", "mon\u0113b\u0101tis"], examples: ["You were advising.", "You (pl.) were advising."] },
          { label: "3rd", cells: ["mon\u0113bat", "mon\u0113bant"], examples: ["He/she was advising.", "They were advising."] },
        ],
      },
      {
        name: "Perfect",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["monu\u012B", "monuimus"], examples: ["I have advised.", "We have advised."] },
          { label: "2nd", cells: ["monuist\u012B", "monuistis"], examples: ["You have advised.", "You (pl.) have advised."] },
          { label: "3rd", cells: ["monuit", "monu\u0113runt"], examples: ["He/she has advised.", "They have advised."] },
        ],
      },
    ],
  },
  {
    title: "3rd Conjugation (-ere)",
    exampleVerb: "d\u016Bc\u014D, d\u016Bcere",
    meaning: "to lead",
    tenses: [
      {
        name: "Present",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["d\u016Bc\u014D", "d\u016Bcimus"], examples: ["I lead.", "We lead."] },
          { label: "2nd", cells: ["d\u016Bcis", "d\u016Bcitis"], examples: ["You lead.", "You (pl.) lead."] },
          { label: "3rd", cells: ["d\u016Bcit", "d\u016Bcunt"], examples: ["He/she leads.", "They lead."] },
        ],
      },
      {
        name: "Imperfect",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["d\u016Bc\u0113bam", "d\u016Bc\u0113b\u0101mus"], examples: ["I was leading.", "We were leading."] },
          { label: "2nd", cells: ["d\u016Bc\u0113b\u0101s", "d\u016Bc\u0113b\u0101tis"], examples: ["You were leading.", "You (pl.) were leading."] },
          { label: "3rd", cells: ["d\u016Bc\u0113bat", "d\u016Bc\u0113bant"], examples: ["He/she was leading.", "They were leading."] },
        ],
      },
      {
        name: "Perfect",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["d\u016Bx\u012B", "d\u016Bximus"], examples: ["I have led.", "We have led."] },
          { label: "2nd", cells: ["d\u016Bxist\u012B", "d\u016Bxistis"], examples: ["You have led.", "You (pl.) have led."] },
          { label: "3rd", cells: ["d\u016Bxit", "d\u016Bx\u0113runt"], examples: ["He/she has led.", "They have led."] },
        ],
      },
    ],
  },
  {
    title: "4th Conjugation (-\u012Bre)",
    exampleVerb: "audi\u014D, aud\u012Bre",
    meaning: "to hear",
    tenses: [
      {
        name: "Present",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["audi\u014D", "aud\u012Bmus"], examples: ["I hear.", "We hear."] },
          { label: "2nd", cells: ["aud\u012Bs", "aud\u012Btis"], examples: ["You hear.", "You (pl.) hear."] },
          { label: "3rd", cells: ["audit", "audiunt"], examples: ["He/she hears.", "They hear."] },
        ],
      },
      {
        name: "Imperfect",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["audi\u0113bam", "audi\u0113b\u0101mus"], examples: ["I was hearing.", "We were hearing."] },
          { label: "2nd", cells: ["audi\u0113b\u0101s", "audi\u0113b\u0101tis"], examples: ["You were hearing.", "You (pl.) were hearing."] },
          { label: "3rd", cells: ["audi\u0113bat", "audi\u0113bant"], examples: ["He/she was hearing.", "They were hearing."] },
        ],
      },
      {
        name: "Perfect",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["aud\u012Bv\u012B", "aud\u012Bvimus"], examples: ["I have heard.", "We have heard."] },
          { label: "2nd", cells: ["aud\u012Bvist\u012B", "aud\u012Bvistis"], examples: ["You have heard.", "You (pl.) have heard."] },
          { label: "3rd", cells: ["aud\u012Bvit", "aud\u012Bv\u0113runt"], examples: ["He/she has heard.", "They have heard."] },
        ],
      },
    ],
  },
];

const LATIN_ADJECTIVE_DECLENSION: DeclensionData = {
  title: "1st/2nd Declension Adjectives",
  exampleWord: "bonus, bona, bonum",
  meaning: "good",
  headers: ["Masc. Sg.", "Fem. Sg.", "Neut. Sg.", "Masc. Pl.", "Fem. Pl.", "Neut. Pl."],
  rows: [
    { label: "Nom.", cells: ["bonus", "bona", "bonum", "bon\u012B", "bonae", "bona"], examples: ["Vir bonus. (A good man.)", "Puella bona. (A good girl.)", "Bellum bonum. (A good war.)", "Vir\u012B bon\u012B. (Good men.)", "Puellae bonae. (Good girls.)", "Bella bona. (Good wars.)"] },
    { label: "Gen.", cells: ["bon\u012B", "bonae", "bon\u012B", "bon\u014Drum", "bon\u0101rum", "bon\u014Drum"], examples: ["Vir\u012B bon\u012B. (Of the good man.)", "Puellae bonae. (Of the good girl.)", "Bell\u012B bon\u012B. (Of the good war.)", "", "", ""] },
    { label: "Dat.", cells: ["bon\u014D", "bonae", "bon\u014D", "bon\u012Bs", "bon\u012Bs", "bon\u012Bs"], examples: ["Vir\u014D bon\u014D. (To the good man.)", "Puellae bonae. (To the good girl.)", "", "", "", ""] },
    { label: "Acc.", cells: ["bonum", "bonam", "bonum", "bon\u014Ds", "bon\u0101s", "bona"], examples: ["Virum bonum. (The good man.)", "Puellam bonam. (The good girl.)", "Bellum bonum. (The good war.)", "", "", ""] },
    { label: "Abl.", cells: ["bon\u014D", "bon\u0101", "bon\u014D", "bon\u012Bs", "bon\u012Bs", "bon\u012Bs"], examples: ["Cum vir\u014D bon\u014D. (With the good man.)", "Cum puell\u0101 bon\u0101. (With the good girl.)", "", "", "", ""] },
  ],
};

const LATIN_PRONOUN_TABLE: DeclensionData = {
  title: "Personal Pronouns",
  exampleWord: "ego, t\u016B, is/ea/id",
  meaning: "I, you, he/she/it",
  headers: ["1st Sg.", "2nd Sg.", "3rd Sg. (m.)", "1st Pl.", "2nd Pl.", "3rd Pl. (m.)"],
  rows: [
    { label: "Nom.", cells: ["ego", "t\u016B", "is", "n\u014Ds", "v\u014Ds", "e\u012B"], examples: ["Ego sum. (I am.)", "T\u016B es. (You are.)", "Is est. (He is.)", "N\u014Ds sumus. (We are.)", "V\u014Ds estis. (You are.)", "E\u012B sunt. (They are.)"] },
    { label: "Gen.", cells: ["me\u012B", "tu\u012B", "eius", "nostr\u012B", "vestr\u012B", "e\u014Drum"], examples: ["Memor me\u012B. (Mindful of me.)", "Memor tu\u012B. (Mindful of you.)", "Amicus eius. (His friend.)", "", "", ""] },
    { label: "Dat.", cells: ["mihi", "tibi", "e\u012B", "n\u014Db\u012Bs", "v\u014Db\u012Bs", "e\u012Bs"], examples: ["Mihi d\u0101. (Give to me.)", "Tibi d\u014D. (I give to you.)", "E\u012B d\u014D. (I give to him.)", "", "", ""] },
    { label: "Acc.", cells: ["m\u0113", "t\u0113", "eum", "n\u014Ds", "v\u014Ds", "e\u014Ds"], examples: ["M\u0113 videt. (He sees me.)", "T\u0113 vide\u014D. (I see you.)", "Eum vide\u014D. (I see him.)", "", "", ""] },
    { label: "Abl.", cells: ["m\u0113", "t\u0113", "e\u014D", "n\u014Db\u012Bs", "v\u014Db\u012Bs", "e\u012Bs"], examples: ["M\u0113cum. (With me.)", "T\u0113cum. (With you.)", "Cum e\u014D. (With him.)", "", "", ""] },
  ],
};

/* ================================================================== */
/*  Greek Grammar Data                                                  */
/* ================================================================== */

const GREEK_NOUN_DECLENSIONS: DeclensionData[] = [
  {
    title: "1st Declension (feminine)",
    exampleWord: "\u03C4\u03B9\u03BC\u03AE, \u03C4\u03B9\u03BC\u1FC6\u03C2",
    meaning: "honor",
    gender: "f.",
    headers: ["Singular", "Plural"],
    rows: [
      { label: "Nominative", cells: ["\u1F21 \u03C4\u03B9\u03BC\u03AE", "\u03B1\u1F31 \u03C4\u03B9\u03BC\u03B1\u03AF"], examples: ["\u1F21 \u03C4\u03B9\u03BC\u1F74 \u03BC\u03B5\u03B3\u03AC\u03BB\u03B7 \u1F10\u03C3\u03C4\u03AF\u03BD. (The honor is great.)", "\u03B1\u1F31 \u03C4\u03B9\u03BC\u03B1\u1F76 \u03BC\u03B5\u03B3\u03AC\u03BB\u03B1\u03B9 \u03B5\u1F30\u03C3\u03AF\u03BD. (The honors are great.)"] },
      { label: "Genitive", cells: ["\u03C4\u1FC6\u03C2 \u03C4\u03B9\u03BC\u1FC6\u03C2", "\u03C4\u1FF6\u03BD \u03C4\u03B9\u03BC\u1FF6\u03BD"], examples: ["\u1F04\u03BE\u03B9\u03BF\u03C2 \u03C4\u03B9\u03BC\u1FC6\u03C2. (Worthy of honor.)", ""] },
      { label: "Dative", cells: ["\u03C4\u1FC7 \u03C4\u03B9\u03BC\u1FC7", "\u03C4\u03B1\u1FD6\u03C2 \u03C4\u03B9\u03BC\u03B1\u1FD6\u03C2"], examples: ["\u03C3\u1F7A\u03BD \u03C4\u03B9\u03BC\u1FC7. (With honor.)", ""] },
      { label: "Accusative", cells: ["\u03C4\u1F74\u03BD \u03C4\u03B9\u03BC\u03AE\u03BD", "\u03C4\u1F70\u03C2 \u03C4\u03B9\u03BC\u03AC\u03C2"], examples: ["\u03C4\u1F74\u03BD \u03C4\u03B9\u03BC\u1F74\u03BD \u1F14\u03C7\u03B5\u03B9. (He/she has the honor.)", ""] },
      { label: "Vocative", cells: ["\u03C4\u03B9\u03BC\u03AE", "\u03C4\u03B9\u03BC\u03B1\u03AF"], examples: ["", ""] },
    ],
  },
  {
    title: "2nd Declension (masculine)",
    exampleWord: "\u03BB\u03CC\u03B3\u03BF\u03C2, \u03BB\u03CC\u03B3\u03BF\u03C5",
    meaning: "word, reason",
    gender: "m.",
    headers: ["Singular", "Plural"],
    rows: [
      { label: "Nominative", cells: ["\u1F41 \u03BB\u03CC\u03B3\u03BF\u03C2", "\u03BF\u1F31 \u03BB\u03CC\u03B3\u03BF\u03B9"], examples: ["\u1F41 \u03BB\u03CC\u03B3\u03BF\u03C2 \u03BA\u03B1\u03BB\u03CC\u03C2 \u1F10\u03C3\u03C4\u03B9\u03BD. (The word is beautiful.)", "\u03BF\u1F31 \u03BB\u03CC\u03B3\u03BF\u03B9 \u03BA\u03B1\u03BB\u03BF\u03AF \u03B5\u1F30\u03C3\u03B9\u03BD. (The words are beautiful.)"] },
      { label: "Genitive", cells: ["\u03C4\u03BF\u1FE6 \u03BB\u03CC\u03B3\u03BF\u03C5", "\u03C4\u1FF6\u03BD \u03BB\u03CC\u03B3\u03C9\u03BD"], examples: ["\u1F41 \u03C4\u03BF\u1FE6 \u03BB\u03CC\u03B3\u03BF\u03C5 \u03B4\u03CD\u03BD\u03B1\u03BC\u03B9\u03C2. (The power of the word.)", ""] },
      { label: "Dative", cells: ["\u03C4\u1FF7 \u03BB\u03CC\u03B3\u1FF3", "\u03C4\u03BF\u1FD6\u03C2 \u03BB\u03CC\u03B3\u03BF\u03B9\u03C2"], examples: ["\u03C4\u1FF7 \u03BB\u03CC\u03B3\u1FF3 \u03C0\u03B9\u03C3\u03C4\u03B5\u03CD\u03C9. (I trust the word.)", ""] },
      { label: "Accusative", cells: ["\u03C4\u1F78\u03BD \u03BB\u03CC\u03B3\u03BF\u03BD", "\u03C4\u03BF\u1F7A\u03C2 \u03BB\u03CC\u03B3\u03BF\u03C5\u03C2"], examples: ["\u03C4\u1F78\u03BD \u03BB\u03CC\u03B3\u03BF\u03BD \u03BB\u03AD\u03B3\u03C9. (I speak the word.)", ""] },
      { label: "Vocative", cells: ["\u03BB\u03CC\u03B3\u03B5", "\u03BB\u03CC\u03B3\u03BF\u03B9"], examples: ["", ""] },
    ],
  },
  {
    title: "3rd Declension (consonant stem)",
    exampleWord: "\u03C6\u03CD\u03BB\u03B1\u03BE, \u03C6\u03CD\u03BB\u03B1\u03BA\u03BF\u03C2",
    meaning: "guard",
    gender: "m.",
    headers: ["Singular", "Plural"],
    rows: [
      { label: "Nominative", cells: ["\u1F41 \u03C6\u03CD\u03BB\u03B1\u03BE", "\u03BF\u1F31 \u03C6\u03CD\u03BB\u03B1\u03BA\u03B5\u03C2"], examples: ["\u1F41 \u03C6\u03CD\u03BB\u03B1\u03BE \u03C4\u1F74\u03BD \u03C0\u03CC\u03BB\u03B9\u03BD \u03C6\u03C5\u03BB\u03AC\u03C4\u03C4\u03B5\u03B9. (The guard watches the city.)", ""] },
      { label: "Genitive", cells: ["\u03C4\u03BF\u1FE6 \u03C6\u03CD\u03BB\u03B1\u03BA\u03BF\u03C2", "\u03C4\u1FF6\u03BD \u03C6\u03C5\u03BB\u03AC\u03BA\u03C9\u03BD"], examples: ["\u1F41 \u03C4\u03BF\u1FE6 \u03C6\u03CD\u03BB\u03B1\u03BA\u03BF\u03C2 \u03BF\u1F36\u03BA\u03BF\u03C2. (The guard's house.)", ""] },
      { label: "Dative", cells: ["\u03C4\u1FF7 \u03C6\u03CD\u03BB\u03B1\u03BA\u03B9", "\u03C4\u03BF\u1FD6\u03C2 \u03C6\u03CD\u03BB\u03B1\u03BE\u03B9(\u03BD)"], examples: ["", ""] },
      { label: "Accusative", cells: ["\u03C4\u1F78\u03BD \u03C6\u03CD\u03BB\u03B1\u03BA\u03B1", "\u03C4\u03BF\u1F7A\u03C2 \u03C6\u03CD\u03BB\u03B1\u03BA\u03B1\u03C2"], examples: ["\u03C4\u1F78\u03BD \u03C6\u03CD\u03BB\u03B1\u03BA\u03B1 \u1F41\u03C1\u1FF6. (I see the guard.)", ""] },
      { label: "Vocative", cells: ["\u03C6\u03CD\u03BB\u03B1\u03BE", "\u03C6\u03CD\u03BB\u03B1\u03BA\u03B5\u03C2"], examples: ["", ""] },
    ],
  },
];

const GREEK_VERB_CONJUGATIONS: ConjugationData[] = [
  {
    title: "Thematic Verbs (-\u03C9)",
    exampleVerb: "\u03BB\u03CD\u03C9",
    meaning: "to loose, release",
    tenses: [
      {
        name: "Present Active",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["\u03BB\u03CD\u03C9", "\u03BB\u03CD\u03BF\u03BC\u03B5\u03BD"], examples: ["I loose.", "We loose."] },
          { label: "2nd", cells: ["\u03BB\u03CD\u03B5\u03B9\u03C2", "\u03BB\u03CD\u03B5\u03C4\u03B5"], examples: ["You loose.", "You (pl.) loose."] },
          { label: "3rd", cells: ["\u03BB\u03CD\u03B5\u03B9", "\u03BB\u03CD\u03BF\u03C5\u03C3\u03B9(\u03BD)"], examples: ["He/she looses.", "They loose."] },
        ],
      },
      {
        name: "Aorist Active",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["\u1F14\u03BB\u03C5\u03C3\u03B1", "\u1F10\u03BB\u03CD\u03C3\u03B1\u03BC\u03B5\u03BD"], examples: ["I loosed.", "We loosed."] },
          { label: "2nd", cells: ["\u1F14\u03BB\u03C5\u03C3\u03B1\u03C2", "\u1F10\u03BB\u03CD\u03C3\u03B1\u03C4\u03B5"], examples: ["You loosed.", "You (pl.) loosed."] },
          { label: "3rd", cells: ["\u1F14\u03BB\u03C5\u03C3\u03B5(\u03BD)", "\u1F14\u03BB\u03C5\u03C3\u03B1\u03BD"], examples: ["He/she loosed.", "They loosed."] },
        ],
      },
      {
        name: "Perfect Active",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["\u03BB\u03AD\u03BB\u03C5\u03BA\u03B1", "\u03BB\u03B5\u03BB\u03CD\u03BA\u03B1\u03BC\u03B5\u03BD"], examples: ["I have loosed.", "We have loosed."] },
          { label: "2nd", cells: ["\u03BB\u03AD\u03BB\u03C5\u03BA\u03B1\u03C2", "\u03BB\u03B5\u03BB\u03CD\u03BA\u03B1\u03C4\u03B5"], examples: ["You have loosed.", "You (pl.) have loosed."] },
          { label: "3rd", cells: ["\u03BB\u03AD\u03BB\u03C5\u03BA\u03B5(\u03BD)", "\u03BB\u03B5\u03BB\u03CD\u03BA\u03B1\u03C3\u03B9(\u03BD)"], examples: ["He/she has loosed.", "They have loosed."] },
        ],
      },
    ],
  },
  {
    title: "Contract Verbs (-\u03AD\u03C9)",
    exampleVerb: "\u03C0\u03BF\u03B9\u03AD\u03C9",
    meaning: "to make, do",
    tenses: [
      {
        name: "Present Active",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["\u03C0\u03BF\u03B9\u1FF6", "\u03C0\u03BF\u03B9\u03BF\u1FE6\u03BC\u03B5\u03BD"], examples: ["I make.", "We make."] },
          { label: "2nd", cells: ["\u03C0\u03BF\u03B9\u03B5\u1FD6\u03C2", "\u03C0\u03BF\u03B9\u03B5\u1FD6\u03C4\u03B5"], examples: ["You make.", "You (pl.) make."] },
          { label: "3rd", cells: ["\u03C0\u03BF\u03B9\u03B5\u1FD6", "\u03C0\u03BF\u03B9\u03BF\u1FE6\u03C3\u03B9(\u03BD)"], examples: ["He/she makes.", "They make."] },
        ],
      },
      {
        name: "Aorist Active",
        headers: ["Singular", "Plural"],
        rows: [
          { label: "1st", cells: ["\u1F10\u03C0\u03BF\u03AF\u03B7\u03C3\u03B1", "\u1F10\u03C0\u03BF\u03B9\u03AE\u03C3\u03B1\u03BC\u03B5\u03BD"], examples: ["I made.", "We made."] },
          { label: "2nd", cells: ["\u1F10\u03C0\u03BF\u03AF\u03B7\u03C3\u03B1\u03C2", "\u1F10\u03C0\u03BF\u03B9\u03AE\u03C3\u03B1\u03C4\u03B5"], examples: ["You made.", "You (pl.) made."] },
          { label: "3rd", cells: ["\u1F10\u03C0\u03BF\u03AF\u03B7\u03C3\u03B5(\u03BD)", "\u1F10\u03C0\u03BF\u03AF\u03B7\u03C3\u03B1\u03BD"], examples: ["He/she made.", "They made."] },
        ],
      },
    ],
  },
];

const GREEK_PARTICIPLE_DATA: DeclensionData = {
  title: "Present Active Participle",
  exampleWord: "\u03BB\u03CD\u03C9\u03BD, \u03BB\u03CD\u03BF\u03C5\u03C3\u03B1, \u03BB\u1FE6\u03BF\u03BD",
  meaning: "loosing",
  headers: ["Masc. Sg.", "Fem. Sg.", "Neut. Sg.", "Masc. Pl.", "Fem. Pl.", "Neut. Pl."],
  rows: [
    { label: "Nom.", cells: ["\u03BB\u03CD\u03C9\u03BD", "\u03BB\u03CD\u03BF\u03C5\u03C3\u03B1", "\u03BB\u1FE6\u03BF\u03BD", "\u03BB\u03CD\u03BF\u03BD\u03C4\u03B5\u03C2", "\u03BB\u03CD\u03BF\u03C5\u03C3\u03B1\u03B9", "\u03BB\u03CD\u03BF\u03BD\u03C4\u03B1"], examples: ["\u1F41 \u03BB\u03CD\u03C9\u03BD (the one loosing)", "\u1F21 \u03BB\u03CD\u03BF\u03C5\u03C3\u03B1 (the one loosing)", "\u03C4\u1F78 \u03BB\u1FE6\u03BF\u03BD (the thing loosing)", "", "", ""] },
    { label: "Gen.", cells: ["\u03BB\u03CD\u03BF\u03BD\u03C4\u03BF\u03C2", "\u03BB\u03C5\u03BF\u03CD\u03C3\u03B7\u03C2", "\u03BB\u03CD\u03BF\u03BD\u03C4\u03BF\u03C2", "\u03BB\u03C5\u03CC\u03BD\u03C4\u03C9\u03BD", "\u03BB\u03C5\u03BF\u03C5\u03C3\u1FF6\u03BD", "\u03BB\u03C5\u03CC\u03BD\u03C4\u03C9\u03BD"], examples: ["", "", "", "", "", ""] },
    { label: "Dat.", cells: ["\u03BB\u03CD\u03BF\u03BD\u03C4\u03B9", "\u03BB\u03C5\u03BF\u03CD\u03C3\u1FC3", "\u03BB\u03CD\u03BF\u03BD\u03C4\u03B9", "\u03BB\u03CD\u03BF\u03C5\u03C3\u03B9(\u03BD)", "\u03BB\u03C5\u03BF\u03CD\u03C3\u03B1\u03B9\u03C2", "\u03BB\u03CD\u03BF\u03C5\u03C3\u03B9(\u03BD)"], examples: ["", "", "", "", "", ""] },
    { label: "Acc.", cells: ["\u03BB\u03CD\u03BF\u03BD\u03C4\u03B1", "\u03BB\u03CD\u03BF\u03C5\u03C3\u03B1\u03BD", "\u03BB\u1FE6\u03BF\u03BD", "\u03BB\u03CD\u03BF\u03BD\u03C4\u03B1\u03C2", "\u03BB\u03C5\u03BF\u03CD\u03C3\u03B1\u03C2", "\u03BB\u03CD\u03BF\u03BD\u03C4\u03B1"], examples: ["", "", "", "", "", ""] },
  ],
};

/* ================================================================== */
/*  Main Component                                                      */
/* ================================================================== */

const GRAMMAR_LANGUAGES: Language[] = ["LATIN", "GREEK"];

export default function GrammarReference() {
  const [language, setLanguage] = useState<Language>("LATIN");
  const [copied, setCopied] = useState(false);

  const accentColor = language === "LATIN" ? "ocean" : "iris";
  const hex = LANGUAGE_HEX[language];

  const handleCopyTable = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-4">
      {/* Language pills */}
      <div className="flex gap-2 mb-6">
        {GRAMMAR_LANGUAGES.map((lang) => {
          const active = language === lang;
          const langHex = LANGUAGE_HEX[lang];
          return (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold transition-all",
                active ? "text-white shadow-sm" : "text-graphite hover:text-ink"
              )}
              style={
                active
                  ? { backgroundColor: langHex }
                  : { backgroundColor: `${langHex}15` }
              }
            >
              {LANGUAGE_LABELS[lang]}
            </button>
          );
        })}
      </div>

      {/* Copy button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCopyTable}
          className="flex items-center gap-1.5 text-xs font-medium text-graphite hover:text-ink transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-clover" />
              <span className="text-clover">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy table
            </>
          )}
        </button>
      </div>

      {/* Latin Grammar */}
      {language === "LATIN" && (
        <>
          <GrammarSection
            title="Noun Declensions"
            subtitle="5 declension patterns for Latin nouns"
            defaultOpen
          >
            <div className="space-y-8">
              {LATIN_NOUN_DECLENSIONS.map((dec) => (
                <DeclensionTable
                  key={dec.title}
                  data={dec}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </GrammarSection>

          <GrammarSection
            title="Verb Conjugations"
            subtitle="4 conjugation patterns across 6 tenses"
          >
            <div className="space-y-8">
              {LATIN_VERB_CONJUGATIONS.map((conj) => (
                <ConjugationTable
                  key={conj.title}
                  data={conj}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </GrammarSection>

          <GrammarSection
            title="Adjective Declensions"
            subtitle="1st/2nd declension adjectives"
          >
            <DeclensionTable
              data={LATIN_ADJECTIVE_DECLENSION}
              accentColor={accentColor}
            />
          </GrammarSection>

          <GrammarSection
            title="Pronoun Tables"
            subtitle="Personal pronouns across all cases"
          >
            <DeclensionTable
              data={LATIN_PRONOUN_TABLE}
              accentColor={accentColor}
            />
          </GrammarSection>
        </>
      )}

      {/* Greek Grammar */}
      {language === "GREEK" && (
        <>
          <GrammarSection
            title="Article + Noun Declensions"
            subtitle="3 declension patterns with definite article"
            defaultOpen
          >
            <div className="space-y-8">
              {GREEK_NOUN_DECLENSIONS.map((dec) => (
                <DeclensionTable
                  key={dec.title}
                  data={dec}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </GrammarSection>

          <GrammarSection
            title="Verb Conjugations"
            subtitle="Thematic and contract verbs: present, aorist, perfect"
          >
            <div className="space-y-8">
              {GREEK_VERB_CONJUGATIONS.map((conj) => (
                <ConjugationTable
                  key={conj.title}
                  data={conj}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </GrammarSection>

          <GrammarSection
            title="Participle Forms"
            subtitle="Present active participle declension"
          >
            <DeclensionTable
              data={GREEK_PARTICIPLE_DATA}
              accentColor={accentColor}
            />
          </GrammarSection>
        </>
      )}
    </div>
  );
}
