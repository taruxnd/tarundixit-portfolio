import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { geist, playfairDisplay } from '@/lib/heroFonts';
import '@/components/guestbook/guestbook.css';

// Shown the instant the footer link is clicked (and prefetched with it), while
// the hellos are fetched and the garden script loads. Mirrors the real header.
export default function GuestbookLoading(){
  return <main className={`guestbook-page ${geist.variable} ${playfairDisplay.variable}`} aria-busy="true">
    <header className="guestbook-header">
      <Link href="/#contact" className="guestbook-back"><ArrowLeft size={15}/>Back to garden</Link>
      <h1>Messages</h1>
      <p className="guestbook-loading-line">Loading messages…</p>
    </header>
  </main>;
}
