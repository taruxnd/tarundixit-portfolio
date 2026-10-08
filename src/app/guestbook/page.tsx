import Guestbook from '@/components/guestbook/Guestbook';
import { getEntries } from '@/lib/guestbook/entries';

export const metadata={title:'Guestbook — Tarun Dixit',description:'Leave a face, a name, a little hello in my garden.'};

export default async function GuestbookPage(){
  // null = storage not configured (local dev without keys): the demo wall shows instead.
  const entries=await getEntries();
  return <Guestbook initialEntries={entries}/>;
}
