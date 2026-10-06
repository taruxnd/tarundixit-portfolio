import Link from 'next/link';
import './more-about.css';
export default function MoreAboutLink({placement}:{placement:'top'|'timeline'|'footer'}){
  return <Link href="/more-about-me" className={`more-about-link more-about-link--${placement}`} data-cursor="interactive">More about me<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></Link>;
}
