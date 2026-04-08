"use client";

import { useState, useRef } from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Share2,
  BookMarked,
  Copy,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_VOCAB, type VocabWord } from "@/lib/mock-data";
import { LANGUAGE_LABELS, LANGUAGE_HEX, type Language } from "@/types";
import {
  exportAsAnki,
  exportAsCSV,
  exportNotesAsMarkdown,
  downloadFile,
  type Bookmark,
  type Annotation,
} from "@/lib/export";

// ---------------------------------------------------------------------------
// Mock bookmarks / annotations for export demo
// ---------------------------------------------------------------------------

const MOCK_BOOKMARKS: Bookmark[] = [
  {
    id: "bm1",
    bookTitle: "De Bello Gallico",
    chapterTitle: "Chapter 1: All Gaul is Divided",
    paragraphText:
      "Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.",
    createdAt: "2026-03-05",
  },
  {
    id: "bm2",
    bookTitle: "De Bello Gallico",
    chapterTitle: "Chapter 2: The Helvetii",
    paragraphText:
      "Apud Helvetios longe nobilissimus fuit et ditissimus Orgetorix.",
    createdAt: "2026-03-07",
  },
  {
    id: "bm3",
    bookTitle: "Anabasis",
    chapterTitle: "Chapter 1: The March Up Country",
    paragraphText:
      "Dareios kai Parysatidos gignontai paides duo, presbyteros men Artaxerxes, neoteros de Kyros.",
    createdAt: "2026-03-12",
  },
];

const MOCK_ANNOTATIONS: Annotation[] = [
  {
    id: "an1",
    bookTitle: "De Bello Gallico",
    chapterTitle: "Chapter 1: All Gaul is Divided",
    selectedText: "Gallia est omnis divisa in partes tres",
    note: "Famous opening line. Note the use of 'omnis' as an adjective modifying 'Gallia'.",
    color: "ocean",
    createdAt: "2026-03-05",
  },
  {
    id: "an2",
    bookTitle: "Anabasis",
    chapterTitle: "Chapter 1: The March Up Country",
    selectedText: "presbyteros men... neoteros de",
    note: "men...de construction: typical Greek correlative ('on the one hand... on the other').",
    color: "iris",
    createdAt: "2026-03-12",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ExportTools() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | "ALL">(
    "ALL"
  );
  const cardRef = useRef<HTMLDivElement>(null);

  const filteredVocab: VocabWord[] =
    selectedLanguage === "ALL"
      ? MOCK_VOCAB
      : MOCK_VOCAB.filter((v) => v.language === selectedLanguage);

  const availableLanguages = Array.from(
    new Set(MOCK_VOCAB.map((v) => v.language))
  );

  function handleAnkiExport() {
    const content = exportAsAnki(filteredVocab);
    const langLabel =
      selectedLanguage === "ALL"
        ? "all"
        : selectedLanguage.toLowerCase();
    const date = new Date().toISOString().slice(0, 10);
    downloadFile(
      content,
      `codex-vocabulary-${langLabel}-${date}.txt`,
      "text/plain;charset=utf-8"
    );
  }

  function handleCSVExport() {
    const content = exportAsCSV(filteredVocab);
    const langLabel =
      selectedLanguage === "ALL"
        ? "all"
        : selectedLanguage.toLowerCase();
    const date = new Date().toISOString().slice(0, 10);
    downloadFile(
      content,
      `codex-vocabulary-${langLabel}-${date}.csv`,
      "text/csv;charset=utf-8"
    );
  }

  function handleNotesExport() {
    const content = exportNotesAsMarkdown(MOCK_BOOKMARKS, MOCK_ANNOTATIONS);
    const date = new Date().toISOString().slice(0, 10);
    downloadFile(
      content,
      `codex-reading-notes-${date}.md`,
      "text/markdown;charset=utf-8"
    );
  }

  function handleCopyLink() {
    const shareUrl = `${window.location.origin}/profile/shared`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  }

  async function handleDownloadCard() {
    // Use html2canvas-like approach: render card to canvas via SVG foreignObject
    if (!cardRef.current) return;
    const cardEl = cardRef.current;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 340;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw gradient background
      const grad = ctx.createLinearGradient(0, 0, 600, 340);
      grad.addColorStop(0, "#3B82F6");
      grad.addColorStop(1, "#8B5CF6");
      ctx.fillStyle = grad;
      ctx.roundRect(0, 0, 600, 340, 20);
      ctx.fill();

      // Draw text
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "bold 28px serif";
      ctx.fillText("Codex", 40, 56);

      ctx.fillStyle = "white";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("Marcus Perez", 40, 110);

      ctx.font = "14px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText("1,285 XP  |  12-day streak  |  1 book  |  142 words", 40, 140);

      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "italic 14px serif";
      ctx.fillText(
        '"The beginning of wisdom is the definition of terms." — Socrates',
        40,
        200
      );

      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "12px sans-serif";
      ctx.fillText("codex.app", 40, 300);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "codex-progress-card.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: just show an alert
      alert("Image download is not supported in this browser.");
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-ink">Tools</h2>

      {/* Language filter for vocabulary exports */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-graphite">Vocabulary language:</span>
        <button
          onClick={() => setSelectedLanguage("ALL")}
          className={cn(
            "text-xs px-2.5 py-1 rounded-full transition-colors",
            selectedLanguage === "ALL"
              ? "bg-ocean text-white"
              : "bg-stone text-graphite hover:bg-stone/80"
          )}
        >
          All
        </button>
        {availableLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLanguage(lang)}
            className={cn(
              "text-xs px-2.5 py-1 rounded-full transition-colors",
              selectedLanguage === lang
                ? "text-white"
                : "bg-stone text-graphite hover:bg-stone/80"
            )}
            style={
              selectedLanguage === lang
                ? { backgroundColor: LANGUAGE_HEX[lang] }
                : undefined
            }
          >
            {LANGUAGE_LABELS[lang]}
          </button>
        ))}
      </div>

      {/* Export buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <ExportButton
          icon={FileText}
          label="Export as Anki Deck"
          description={`${filteredVocab.length} cards`}
          onClick={handleAnkiExport}
        />
        <ExportButton
          icon={FileSpreadsheet}
          label="Export as CSV"
          description={`${filteredVocab.length} words`}
          onClick={handleCSVExport}
        />
        <ExportButton
          icon={BookMarked}
          label="Export Reading Notes"
          description={`${MOCK_BOOKMARKS.length} bookmarks, ${MOCK_ANNOTATIONS.length} notes`}
          onClick={handleNotesExport}
        />
        <ExportButton
          icon={Download}
          label="Download Progress Card"
          description="Shareable image"
          onClick={handleDownloadCard}
        />
      </div>

      {/* Share Progress Card preview */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-ink">Progress Card</h3>
        <div
          ref={cardRef}
          className="rounded-xl overflow-hidden p-6"
          style={{
            background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
          }}
        >
          <p className="font-serif text-lg font-semibold text-white/90 mb-4">
            Codex
          </p>
          <p className="text-white font-semibold text-base">Marcus Perez</p>
          <p className="text-white/85 text-xs mt-1">
            1,285 XP &middot; 12-day streak &middot; 1 book &middot; 142 words
          </p>
          <p className="text-white/70 text-xs font-serif italic mt-4">
            &ldquo;The beginning of wisdom is the definition of terms.&rdquo;
            &mdash; Socrates
          </p>
          <p className="text-white/50 text-[10px] mt-6">codex.app</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-xs font-medium text-ocean hover:text-ocean/80 transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Link
              </>
            )}
          </button>
          <button
            onClick={handleDownloadCard}
            className="flex items-center gap-1.5 text-xs font-medium text-ocean hover:text-ocean/80 transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Download Image
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ExportButton({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 bg-linen rounded-xl text-left hover:bg-stone/50 transition-colors group"
    >
      <div className="w-9 h-9 rounded-lg bg-ocean/10 flex items-center justify-center shrink-0 group-hover:bg-ocean/20 transition-colors">
        <Icon className="w-4 h-4 text-ocean" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-[10px] text-graphite">{description}</p>
      </div>
    </button>
  );
}
