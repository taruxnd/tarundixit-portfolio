"use client";
import MoreAboutLink from "@/components/more-about/MoreAboutLink";
import dynamic from 'next/dynamic';
import {useEffect,useRef,useState} from 'react';
import {playfairDisplay} from '@/lib/heroFonts';
import './basketball-footer.css';
const TreeHouseScene=dynamic(()=>import('./TreeHouseScene'),{ssr:false});
const BasketballGame=dynamic(()=>import('./BasketballGame'),{ssr:false});
export default function BasketballFooter(){
  const email = "hello@example.com";
  const linkedIn = "https://www.linkedin.com/";
  const [copied,setCopied]=useState(false);
  const [copyError,setCopyError]=useState(false);
  const stage=useRef<HTMLDivElement>(null);
  const [ballSize,setBallSize]=useState(44);
  useEffect(()=>{const element=stage.current;if(!element)return;const observer=new ResizeObserver(()=>setBallSize(element.clientWidth<768?44:64));observer.observe(element);return()=>observer.disconnect();},[]);
  return <footer id="contact" className={`basketball-footer ${playfairDisplay.variable}`}>
    <div className="basketball-stage" ref={stage}>
      <div className="basketball-contact">
        <h2 className="basketball-heading">Shoot your shot, in the hoop or in my inbox.</h2>
        <p className="basketball-invitation">Got a curious idea, a design problem, or an unnecessarily good playlist? I’m listening.</p>
        <div className="basketball-contact-actions">
        <button className="basketball-glass basketball-email" disabled={!email} onClick={async()=>{try{await navigator.clipboard.writeText(email);setCopied(true);setCopyError(false);window.setTimeout(()=>setCopied(false),2000);}catch{setCopyError(true);}}} aria-label={copied?'Email copied':'Copy email address'}>
          <span>{email || 'Email'}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{copied?<path d="m5 12 4 4 10-10"/>:<><rect x="8" y="8" width="12" height="12" rx="3"/><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/></>}</svg>
        </button>
          <a className="basketball-glass basketball-linkedin" href={linkedIn || undefined} aria-disabled={!linkedIn} aria-label="LinkedIn profile" target="_blank" rel="noopener noreferrer"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3.5 9h3v12h-3ZM9 9h3v1.6c.7-1.1 1.8-1.9 3.5-1.9 3.3 0 4.5 2.1 4.5 5.3v7h-3v-6.2c0-1.9-.4-3.3-2.3-3.3-2 0-2.7 1.5-2.7 3.3V21H9Z"/></svg></a>
        </div>
        <span className="basketball-copy-status" role="status">{copied?'Email copied':copyError?'Could not copy email. Please try again.':''}</span>
      </div>
      <MoreAboutLink placement="footer" />
      <TreeHouseScene/>
      <div className="basketball-court"><BasketballGame ballCount={2} ballSize={ballSize} courtColor="transparent" throwPower={1} /></div>
    </div>
  </footer>;
}
