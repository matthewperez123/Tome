import type { VocabWord } from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// Types for bookmarks / annotations
// ---------------------------------------------------------------------------

export interface Bookmark {
  id: string;
  bookTitle: string;
  chapterTitle: string;
  paragraphText: string;
  createdAt: string;
}

export interface Annotation {
  id: string;
  bookTitle: string;
  chapterTitle: string;
  selectedText: string;
  note: string;
  color: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Export as Anki-compatible .txt
// ---------------------------------------------------------------------------

export function exportAsAnki(vocab: VocabWord[]): string {
  // Anki format: front\tback\ttag1 tag2
  // We use: word\ttranslation\tcontext\tpart_of_speech
  const lines = vocab.map(
    (w) =>
      `${w.word}\t${w.translation}\t${w.context}\t${w.partOfSpeech}`
  );
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Export as CSV
// ---------------------------------------------------------------------------

export function exportAsCSV(vocab: VocabWord[]): string {
  const header =
    "Word,Translation,Language,Part of Speech,Context,Mastery,Times Reviewed";
  const rows = vocab.map((w) => {
    const escapeCsv = (s: string) => {
      if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };
    return [
      escapeCsv(w.word),
      escapeCsv(w.translation),
      w.language,
      escapeCsv(w.partOfSpeech),
      escapeCsv(w.context),
      w.mastery,
      w.timesReviewed.toString(),
    ].join(",");
  });
  return [header, ...rows].join("\n");
}

// ---------------------------------------------------------------------------
// Export reading notes as Markdown
// ---------------------------------------------------------------------------

export function exportNotesAsMarkdown(
  bookmarks: Bookmark[],
  annotations: Annotation[]
): string {
  const lines: string[] = [];

  lines.push("# Codex Reading Notes");
  lines.push("");
  lines.push(
    `*Exported on ${new Date().toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}*`
  );
  lines.push("");

  // Group bookmarks by book
  const bookmarksByBook = new Map<string, Bookmark[]>();
  for (const b of bookmarks) {
    const existing = bookmarksByBook.get(b.bookTitle) || [];
    existing.push(b);
    bookmarksByBook.set(b.bookTitle, existing);
  }

  // Group annotations by book
  const annotationsByBook = new Map<string, Annotation[]>();
  for (const a of annotations) {
    const existing = annotationsByBook.get(a.bookTitle) || [];
    existing.push(a);
    annotationsByBook.set(a.bookTitle, existing);
  }

  // Combine all book titles
  const allBooks = new Set([
    ...bookmarksByBook.keys(),
    ...annotationsByBook.keys(),
  ]);

  for (const bookTitle of allBooks) {
    lines.push(`## ${bookTitle}`);
    lines.push("");

    const bms = bookmarksByBook.get(bookTitle) || [];
    if (bms.length > 0) {
      lines.push("### Bookmarks");
      lines.push("");

      // Group by chapter
      const byChapter = new Map<string, Bookmark[]>();
      for (const b of bms) {
        const existing = byChapter.get(b.chapterTitle) || [];
        existing.push(b);
        byChapter.set(b.chapterTitle, existing);
      }

      for (const [chapter, items] of byChapter) {
        lines.push(`#### ${chapter}`);
        lines.push("");
        for (const item of items) {
          lines.push(`> ${item.paragraphText}`);
          lines.push("");
        }
      }
    }

    const anns = annotationsByBook.get(bookTitle) || [];
    if (anns.length > 0) {
      lines.push("### Annotations");
      lines.push("");

      const byChapter = new Map<string, Annotation[]>();
      for (const a of anns) {
        const existing = byChapter.get(a.chapterTitle) || [];
        existing.push(a);
        byChapter.set(a.chapterTitle, existing);
      }

      for (const [chapter, items] of byChapter) {
        lines.push(`#### ${chapter}`);
        lines.push("");
        for (const item of items) {
          lines.push(`> "${item.selectedText}"`);
          lines.push(`>`);
          lines.push(`> **Note:** ${item.note}`);
          lines.push("");
        }
      }
    }
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Download helper
// ---------------------------------------------------------------------------

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
