"use client";
import dynamic from 'next/dynamic';
import {useEffect,useRef,useState} from 'react';
import HeroGarden from '@/components/hero-garden/HeroGarden';
import './basketball-footer.css';
import FooterNote from './FooterNote';
import {geist,playfairDisplay} from '@/lib/heroFonts';
const GardenBee=dynamic(()=>import("@/components/hero-bee/HeroBee"),{ssr:false});
const TreeHouseScene=dynamic(()=>import('./TreeHouseScene'),{ssr:false});
const BasketballGame=dynamic(()=>import('./BasketballGame'),{ssr:false});
export default function BasketballFooter(){
  const stage=useRef<HTMLDivElement>(null);
  const [ballSize,setBallSize]=useState(44);
  useEffect(()=>{
    const element=stage.current;
    if(!element)return;
    const update=()=>{
      const width=element.clientWidth;
      setBallSize(width<768?44:64);
    };
    update();
    const observer=new ResizeObserver(update);
    observer.observe(element);
    return()=>observer.disconnect();
  },[]);
  return <footer id="contact" className={`basketball-footer ${geist.variable} ${playfairDisplay.variable}`}>
    <div className="basketball-stage" ref={stage}>
      <FooterNote/>
      <TreeHouseScene/>
      <div className="basketball-garden"><HeroGarden placement="court" /></div>
      <div className="basketball-garden-bee"><GardenBee placement="footer" /></div>
      <div className="basketball-court"><BasketballGame ballCount={2} ballSize={ballSize} courtColor="transparent" throwPower={1} /></div>
    </div>
  </footer>;
}
