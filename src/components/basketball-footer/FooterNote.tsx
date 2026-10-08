"use client";
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import './footer-note.css';
const email='hello@example.com';
function LinkedInIcon(){return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>;}
function Arrow(){return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>;}
export default function FooterNote(){
  const [status,setStatus]=useState('');
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
  async function copy(){
    try{await navigator.clipboard.writeText(email);setStatus('Email copied');}
    catch{setStatus('Could not copy. You can use the email link.');}
    if(timer.current)clearTimeout(timer.current);
    timer.current=setTimeout(()=>setStatus(''),2500);
  }
  return <div className="footer-note">
    <div className="footer-note-identity">
      <span className="footer-note-portrait"><img src="/profile/tarun-avatar.jpg" alt="Tarun Dixit" width="68" height="78"/></span>
      <span className="footer-note-portrait footer-note-portrait--second"><img src="/profile/life-lately.jpg" alt="A moment at Design Samvaad" width="68" height="78"/></span>
      <span className="footer-note-portrait footer-note-portrait--third"><img src="/profile/tarun-dixit.jpg" alt="Tarun Dixit portrait" width="68" height="78"/></span>
      <span className="footer-note-portrait footer-note-portrait--fourth"><img src="/profile/tarun-namaste.jpg" alt="Tarun saying namaste" width="68" height="78"/></span>
    </div>
    <h2>Shoot your shot.</h2>
    <p>In my hoop. Or my inbox.</p>
    <div className="footer-note-links">
      <span className="footer-note-email"><a href={`mailto:${email}`}>{email}</a><button type="button" onClick={copy} aria-label="Copy email address"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{status==='Email copied'?<path d="m5 12 4 4 10-10"/>:<><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/></>}</svg></button></span>
      <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"><LinkedInIcon/>LinkedIn</a>
    </div>
    <div className="footer-note-more">
      <Link href="/more-about-me">More about me<Arrow/></Link>
      <Link href="/guestbook">Leave a little hello<Arrow/></Link>
    </div>
    <span className="footer-note-status" role="status">{status}</span>
  </div>;
}
