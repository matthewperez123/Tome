"use client";

import { useState } from "react";
import {
  Users,
  MessageCircle,
  BookOpen,
  Plus,
  ChevronRight,
  Crown,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LANGUAGE_LABELS, LANGUAGE_HEX, type Language } from "@/types";

interface ReadingCircleMember {
  id: string;
  name: string;
  avatar: string; // initials
  color: string; // avatar bg color
  currentChapter: number;
  isOnline: boolean;
}

interface ReadingCircle {
  id: string;
  name: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  language: Language;
  members: ReadingCircleMember[];
  maxMembers: number;
  currentChapter: number;
  totalChapters: number;
  nextSessionAt: string;
  isHost: boolean;
  recentMessages: number;
}

// Mock reading circles
const MOCK_CIRCLES: ReadingCircle[] = [
  {
    id: "rc-1",
    name: "Caesar's Cohort",
    bookId: "1",
    bookTitle: "De Bello Gallico",
    bookAuthor: "Caesar",
    language: "LATIN",
    members: [
      { id: "u1", name: "Marcus P", avatar: "MP", color: "#3B82F6", currentChapter: 5, isOnline: true },
      { id: "u2", name: "Sarah K", avatar: "SK", color: "#8B5CF6", currentChapter: 4, isOnline: true },
      { id: "u3", name: "Alex T", avatar: "AT", color: "#10B981", currentChapter: 5, isOnline: false },
      { id: "u4", name: "Jordan M", avatar: "JM", color: "#F59E0B", currentChapter: 3, isOnline: false },
    ],
    maxMembers: 8,
    currentChapter: 5,
    totalChapters: 8,
    nextSessionAt: "Tomorrow, 7:00 PM",
    isHost: true,
    recentMessages: 12,
  },
  {
    id: "rc-2",
    name: "Homer's Heroes",
    bookId: "8",
    bookTitle: "Iliad Book I",
    bookAuthor: "Homer",
    language: "GREEK",
    members: [
      { id: "u5", name: "Elena V", avatar: "EV", color: "#EC4899", currentChapter: 2, isOnline: true },
      { id: "u6", name: "David R", avatar: "DR", color: "#06B6D4", currentChapter: 2, isOnline: false },
      { id: "u1", name: "Marcus P", avatar: "MP", color: "#3B82F6", currentChapter: 1, isOnline: true },
    ],
    maxMembers: 6,
    currentChapter: 2,
    totalChapters: 12,
    nextSessionAt: "Friday, 6:30 PM",
    isHost: false,
    recentMessages: 5,
  },
];

interface BookRecommendation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  language: Language;
  recommenderName: string;
  recommenderAvatar: string;
  recommenderColor: string;
  note: string;
  upvotes: number;
  hasUpvoted: boolean;
}

const MOCK_RECOMMENDATIONS: BookRecommendation[] = [
  {
    id: "rec-1",
    bookId: "7",
    bookTitle: "Apology",
    bookAuthor: "Plato",
    language: "GREEK",
    recommenderName: "Sarah K",
    recommenderAvatar: "SK",
    recommenderColor: "#8B5CF6",
    note: "If you loved Caesar's clarity, Plato's Apology is the perfect next step in Greek. Socrates' defense is gripping!",
    upvotes: 24,
    hasUpvoted: false,
  },
  {
    id: "rec-2",
    bookId: "19",
    bookTitle: "Inferno",
    bookAuthor: "Dante",
    language: "ITALIAN",
    recommenderName: "Alex T",
    recommenderAvatar: "AT",
    recommenderColor: "#10B981",
    note: "After finishing the Aeneid, Dante's Inferno is the natural continuation. Virgil himself is your guide!",
    upvotes: 18,
    hasUpvoted: true,
  },
  {
    id: "rec-3",
    bookId: "2",
    bookTitle: "In Catilinam I",
    bookAuthor: "Cicero",
    language: "LATIN",
    recommenderName: "Elena V",
    recommenderAvatar: "EV",
    recommenderColor: "#EC4899",
    note: "The most exciting speech in Latin literature. Every sentence is a masterclass in rhetoric.",
    upvotes: 31,
    hasUpvoted: false,
  },
];

function MemberAvatarStack({ members }: { members: ReadingCircleMember[] }) {
  const shown = members.slice(0, 4);
  const overflow = members.length - 4;

  return (
    <div className="flex -space-x-2">
      {shown.map((member) => (
        <div
          key={member.id}
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white border-2 border-snow",
            member.isOnline && "ring-2 ring-clover ring-offset-1"
          )}
          style={{ backgroundColor: member.color }}
          title={member.name}
        >
          {member.avatar}
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold bg-stone text-graphite border-2 border-snow">
          +{overflow}
        </div>
      )}
    </div>
  );
}

export function ReadingCircles() {
  const [activeTab, setActiveTab] = useState<"circles" | "recommendations">(
    "circles"
  );

  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-iris" />
          <h2 className="font-serif text-xl font-bold text-ink">Community</h2>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 bg-linen rounded-xl p-1 mb-4">
        <button
          onClick={() => setActiveTab("circles")}
          className={cn(
            "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "circles"
              ? "bg-snow shadow-sm text-ink"
              : "text-graphite hover:text-ink"
          )}
        >
          Reading Circles
        </button>
        <button
          onClick={() => setActiveTab("recommendations")}
          className={cn(
            "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "recommendations"
              ? "bg-snow shadow-sm text-ink"
              : "text-graphite hover:text-ink"
          )}
        >
          Recommendations
        </button>
      </div>

      {activeTab === "circles" ? (
        <div className="space-y-3">
          {MOCK_CIRCLES.map((circle) => (
            <div
              key={circle.id}
              className="bg-snow border border-stone/30 rounded-xl p-4 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-ink">
                      {circle.name}
                    </h3>
                    {circle.isHost && (
                      <Crown className="w-3.5 h-3.5 text-saffron" />
                    )}
                  </div>
                  <p className="text-xs text-graphite">
                    Reading{" "}
                    <span className="font-medium">{circle.bookTitle}</span> by{" "}
                    {circle.bookAuthor}
                  </p>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: `${LANGUAGE_HEX[circle.language]}15`,
                    color: LANGUAGE_HEX[circle.language],
                  }}
                >
                  {LANGUAGE_LABELS[circle.language]}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-graphite mb-1">
                  <span>
                    Chapter {circle.currentChapter}/{circle.totalChapters}
                  </span>
                  <span>
                    {Math.round(
                      (circle.currentChapter / circle.totalChapters) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="h-1.5 bg-stone/30 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(circle.currentChapter / circle.totalChapters) * 100}%`,
                      backgroundColor: LANGUAGE_HEX[circle.language],
                    }}
                  />
                </div>
              </div>

              {/* Members + actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MemberAvatarStack members={circle.members} />
                  <span className="text-xs text-graphite">
                    {circle.members.length}/{circle.maxMembers}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {circle.recentMessages > 0 && (
                    <div className="flex items-center gap-1 text-xs text-graphite">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {circle.recentMessages}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-graphite">
                    <Clock className="w-3.5 h-3.5" />
                    {circle.nextSessionAt}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Create circle CTA */}
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-stone rounded-xl text-sm text-graphite hover:text-ink hover:border-graphite transition-all">
            <Plus className="w-4 h-4" />
            Start a Reading Circle
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {MOCK_RECOMMENDATIONS.map((rec) => (
            <Link key={rec.id} href={`/stories/${rec.bookId}`}>
              <div className="bg-snow border border-stone/30 rounded-xl p-4 hover:shadow-sm transition-all">
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0"
                    style={{ backgroundColor: rec.recommenderColor }}
                  >
                    {rec.recommenderAvatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ink">
                        {rec.recommenderName}
                      </span>
                      <span className="text-xs text-graphite">recommends</span>
                    </div>
                    <p className="text-sm text-graphite mt-1 leading-relaxed">
                      &ldquo;{rec.note}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between ml-11">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-graphite" />
                    <span className="text-xs font-medium text-ink">
                      {rec.bookTitle}
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${LANGUAGE_HEX[rec.language]}15`,
                        color: LANGUAGE_HEX[rec.language],
                      }}
                    >
                      {LANGUAGE_LABELS[rec.language]}
                    </span>
                  </div>
                  <button
                    className={cn(
                      "flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-all",
                      rec.hasUpvoted
                        ? "bg-iris/10 text-iris"
                        : "bg-stone/20 text-graphite hover:bg-iris/10 hover:text-iris"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      // Toggle upvote
                    }}
                  >
                    ▲ {rec.upvotes}
                  </button>
                </div>
              </div>
            </Link>
          ))}

          {/* Recommend button */}
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-stone rounded-xl text-sm text-graphite hover:text-ink hover:border-graphite transition-all">
            <Plus className="w-4 h-4" />
            Recommend a Book
          </button>
        </div>
      )}
    </section>
  );
}
