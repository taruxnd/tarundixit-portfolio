import Guestbook from '@/components/guestbook/Guestbook';
import { getEntries } from '@/lib/guestbook/entries';

export const metadata={title:'Messages — Tarun Dixit',description:'Leave me a message: thoughts on my work, honest feedback, or just a hello.'};

export default async function GuestbookPage(){
  // null = storage not configured (local dev without keys): the demo wall shows instead.
  const entries=await getEntries();
  return <Guestbook initialEntries={entries}/>;
}
