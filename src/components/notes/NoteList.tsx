import Link from "next/link";
import type { NoteMeta } from "@/lib/notes/notes";

/** The table-of-contents list used on /notes and under "Read more". */
export default function NoteList({ notes, totals }: { notes: NoteMeta[]; totals: Record<string, number> }) {
  return (
    <ol className="note-list">
      {notes.map((note) => (
        <li key={note.slug}>
          <Link href={`/notes/${note.slug}`} className="note-list__title" data-cursor="interactive">
            {note.title}
          </Link>
          <span className="note-list__meta">
            <span className="note-tag" data-category={note.category.toLowerCase()}>
              {note.category}
            </span>
            {totals[note.slug] > 0 && (
              <span className="note-list__count" aria-label={`${totals[note.slug]} reactions`}>
                <span aria-hidden="true">🌱</span> {totals[note.slug]}
              </span>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}
