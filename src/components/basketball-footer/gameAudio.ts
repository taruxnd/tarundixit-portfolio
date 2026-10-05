// Synthesized locally: no audio downloads or autoplay before interaction.
let context: AudioContext | undefined;
const last:Record<string,number>={};
export function unlockGameAudio(){
  if(typeof window==='undefined')return;
  try{context??=new AudioContext();if(context.state==='suspended')void context.resume().catch(()=>{});}catch{}
}
export function playGameSound(kind:'bounce'|'rim'|'basket', strength=1){
  if(!context||context.state!=='running')return;
  const now=context.currentTime;
  if(now-(last[kind]??-1)<(kind==='bounce'?.08:.12))return;
  last[kind]=now;
  try{
    const gain=context.createGain();gain.connect(context.destination);
    const volume=Math.min(1,Math.max(0,strength));
    if(kind==='basket'){
      const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*.3),context.sampleRate);
      const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1);
      const source=context.createBufferSource();source.buffer=buffer;
      const filter=context.createBiquadFilter();filter.type='bandpass';filter.frequency.value=2200;filter.Q.value=.7;
      source.connect(filter);filter.connect(gain);gain.gain.setValueAtTime(.001,now);gain.gain.linearRampToValueAtTime(.2,now+.03);gain.gain.exponentialRampToValueAtTime(.001,now+.28);source.start(now);source.stop(now+.3);
    }else{
      const oscillator=context.createOscillator();oscillator.type='sine';
      oscillator.frequency.setValueAtTime(kind==='bounce'?155:720,now);oscillator.frequency.exponentialRampToValueAtTime(kind==='bounce'?55:360,now+.12);
      gain.gain.setValueAtTime(Math.max(.001,(kind==='bounce'?.5:.24)*volume),now);gain.gain.exponentialRampToValueAtTime(.001,now+.17);
      oscillator.connect(gain);oscillator.start(now);oscillator.stop(now+.18);
    }
  }catch{}
}
