import { notFound } from 'next/navigation';
import { MORE_ABOUT_VISIBLE } from '@/lib/workInProgress';
import AboutPageHero from '@/components/about-page/AboutPageHero';
import '@/components/about-page/about-page.css';
import '@/components/about-page/about-page-road.css';
import '@/components/more-about/more-about.css';
export const metadata={title:'More about me — Tarun Dixit'};
export default function MoreAboutPage(){
  if (!MORE_ABOUT_VISIBLE) notFound();
  return <main className="more-about-story"><AboutPageHero story /></main>;
}
