import Link from "next/link";
import NoteList from "@/components/notes/NoteList";
import { getNotes } from "@/lib/notes/notes";
import { getAllReactionCounts, totalReactions } from "@/lib/notes/reactions";
import { stripFontClassName } from "@/lib/heroFonts";
import "@/components/notes/notes.css";

export const metadata = {
  title: "Notes — Tarun Dixit",
  description: "Notes on design, craft, and whatever else is on my mind.",
};

export default async function NotesPage() {
  const notes = getNotes();
  const counts = await getAllReactionCounts();
  const totals = Object.fromEntries(notes.map((note) => [note.slug, totalReactions(counts[note.slug])]));

  return (
    <main className={`notes-page ${stripFontClassName}`}>
      <article className="notes-column">
        <h1 className="notes-title">Notes</h1>
        <p className="notes-intro">
          A loose, semi-regular journal. Things I&apos;ve noticed while designing, building, and generally paying
          attention. Mostly about design, sometimes about anything at all.
        </p>
        <p className="notes-intro">
          Disagree with something? I&apos;d love to hear it. <Link href="/#contact">Say hello</Link>.
        </p>

        <h2 className="notes-section-title">Start reading here</h2>
        {notes.length ? <NoteList notes={notes} totals={totals} /> : <p className="notes-intro">Nothing here yet. Soon.</p>}
      </article>
    </main>
  );
}
