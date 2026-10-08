import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import NoteList from "@/components/notes/NoteList";
import ReactionBar from "@/components/notes/ReactionBar";
import { formatNoteDate, getNote, getNotes } from "@/lib/notes/notes";
import { getAllReactionCounts, totalReactions } from "@/lib/notes/reactions";
import { stripFontClassName } from "@/lib/heroFonts";
import "@/components/notes/notes.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const note = getNote((await params).slug);
  if (!note) return {};
  return { title: `${note.title} — Tarun Dixit`, description: note.summary };
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  const counts = await getAllReactionCounts();
  const others = getNotes().filter((other) => other.slug !== slug).slice(0, 5);
  const totals = Object.fromEntries(others.map((other) => [other.slug, totalReactions(counts[other.slug])]));

  return (
    <main className={`notes-page note-page ${stripFontClassName}`}>
      <article className="notes-column">
        <Link href="/notes" className="note-back" data-cursor="interactive">
          <ArrowLeft size={14} />
          All notes
        </Link>
        <header className="note-header">
          <h1 className="notes-title">{note.title}</h1>
          <p className="note-meta">
            <span className="note-tag" data-category={note.category.toLowerCase()}>
              {note.category}
            </span>
            <span>{formatNoteDate(note.date)}</span>
          </p>
        </header>

        <div className="note-body" dangerouslySetInnerHTML={{ __html: note.html }} />

        {others.length > 0 && (
          <section className="note-more" aria-labelledby="note-more-title">
            <div className="note-divider" aria-hidden="true">
              <span>✿</span>
            </div>
            <h2 id="note-more-title" className="notes-section-title">
              Read more
            </h2>
            <NoteList notes={others} totals={totals} />
          </section>
        )}
      </article>
      <ReactionBar slug={slug} initialCounts={counts[slug] ?? {}} />
    </main>
  );
}
