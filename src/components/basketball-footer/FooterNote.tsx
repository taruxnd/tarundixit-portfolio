"use client";
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import './footer-note.css';
const email='hello@example.com';
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
      <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn<Arrow/></a>
    </div>
    <Link className="footer-note-about" href="/more-about-me">More about me<Arrow/></Link>
    <Link className="footer-note-guestbook" href="/guestbook">Leave a little hello<Arrow/></Link>
    <span className="footer-note-status" role="status">{status}</span>
  </div>;
}
