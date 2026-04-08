import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import './se-semantic.css';

async function getBookWithChapters(slug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: book } = await supabase
    .from('books')
    .select('*')
    .eq('id', slug)
    .single();

  if (!book) return null;

  const { data: chapters } = await supabase
    .from('chapters')
    .select('*')
    .eq('book_id', slug)
    .order('chapter_index', { ascending: true });

  return { book, chapters: chapters || [] };
}

export default async function ScrollReaderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getBookWithChapters(slug);

  if (!data) notFound();

  const { book, chapters } = data;

  // Skip front/back matter to find first real content chapter
  const skipTitles = ['titlepage', 'colophon', 'imprint', 'uncopyright', 'endnotes', 'dramatis personae'];
  const mainChapters = chapters.filter(
    (ch: any) =>
      ch.content_html &&
      ch.word_count > 200 &&
      !skipTitles.some(skip => ch.title?.toLowerCase().includes(skip))
  );

  const firstChapter = mainChapters[0] || chapters[0];

  return (
    <div className="-mx-4 -my-6" style={{ background: 'var(--reader-bg)' }}>
      {/* Back nav */}
      <div className="max-w-[680px] mx-auto px-4 pt-4">
        <Link
          href="/stories"
          className="inline-flex items-center gap-1.5 text-sm opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: 'var(--reader-text)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Library
        </Link>
      </div>

      <div className="tome-reader">
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1
            style={{
              fontFamily: 'var(--font-playfair), Playfair Display, serif',
              fontSize: '2.25rem',
              marginBottom: '0.5rem',
              color: 'var(--reader-text)',
              lineHeight: 1.2,
            }}
          >
            {book.title}
          </h1>
          {book.subtitle && (
            <p style={{ fontSize: '1.2rem', opacity: 0.6, marginBottom: '0.5rem' }}>
              {book.subtitle}
            </p>
          )}
          <p
            style={{
              fontSize: '1.1rem',
              opacity: 0.7,
              fontStyle: 'italic',
            }}
          >
            {book.author}
          </p>
          <div
            style={{
              marginTop: '1rem',
              fontSize: '0.8rem',
              opacity: 0.4,
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
            }}
          >
            <span>{book.chapter_count} chapters</span>
            <span>{book.word_count?.toLocaleString()} words</span>
            <span>~{book.reading_time_minutes} min</span>
          </div>
        </header>

        {firstChapter?.content_html && (
          <article
            dangerouslySetInnerHTML={{ __html: firstChapter.content_html }}
          />
        )}

        {/* Chapter navigation */}
        {mainChapters.length > 1 && (
          <nav style={{ marginTop: '3rem', borderTop: '1px solid var(--reader-gold)', paddingTop: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-playfair), serif', textAlign: 'center', marginBottom: '1rem', opacity: 0.6, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Table of Contents
            </h3>
            <ol style={{ listStyle: 'none', padding: 0 }}>
              {mainChapters.map((ch: any, i: number) => (
                <li key={ch.id} style={{ padding: '0.4rem 0', borderBottom: '1px solid rgba(212, 160, 76, 0.15)' }}>
                  <span style={{ opacity: 0.5, fontSize: '0.85rem', marginRight: '0.75rem' }}>{i + 1}.</span>
                  <span style={{ fontSize: '0.95rem' }}>{ch.title}</span>
                  <span style={{ opacity: 0.3, fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                    {ch.word_count?.toLocaleString()} words
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </div>
  );
}
