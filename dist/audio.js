export class Piano {
 constructor(onStatus){this.ctx=null;this.samples=[];this.nodes=new Set();this.onStatus=onStatus;this.loading=null;}
 async init(){
  if(!this.ctx){this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=.65;const comp=this.ctx.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;this.master.connect(comp);comp.connect(this.ctx.destination);}
  if(this.ctx.state!=='running')await this.ctx.resume();
  if(!this.loading){this.onStatus?.('Chargement du piano…');this.loading=(async()=>{const out=await Promise.allSettled(Array.from({length:5},(_,j)=>j+2).flatMap(o=>['C','Ds','Fs','A'].map((n,i)=>({file:n+o,midi:(o+1)*12+i*3})) ).map(async x=>{const r=await fetch(`audio/${x.file}.mp3`);if(!r.ok)throw Error('sample');const buffer=await this.ctx.decodeAudioData(await r.arrayBuffer());return {...x,buffer};}));this.samples=out.filter(r=>r.status==='fulfilled').map(r=>r.value);this.onStatus?.(this.samples.length?'● Piano acoustique prêt':'● Piano de synthèse (échantillons indisponibles)');})();}
  await this.loading;
 }
 playNote(midi,at=this.ctx.currentTime,duration=1.7,velocity=.7){
  const ctx=this.ctx,gain=ctx.createGain();let src;
  if(this.samples.length){const sample=this.samples.reduce((a,b)=>Math.abs(a.midi-midi)<=Math.abs(b.midi-midi)?a:b);src=ctx.createBufferSource();src.buffer=sample.buffer;src.playbackRate.value=2**((midi-sample.midi)/12);}
  else{src=ctx.createOscillator();src.type='triangle';src.frequency.value=440*2**((midi-69)/12);}
  const t=Math.max(at,ctx.currentTime);gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(velocity*.38,t+.008);gain.gain.setTargetAtTime(velocity*.12,t+.06,.5);gain.gain.setTargetAtTime(0,t+Math.max(.08,duration),.07);src.connect(gain);gain.connect(this.master);src.start(t);src.stop(t+duration+.45);const n={src,gain};this.nodes.add(n);src.onended=()=>{this.nodes.delete(n);gain.disconnect();};return n;
 }
 playChord(notes,{at=this.ctx.currentTime,duration=1.8,arp=0}={}){const order=arp<0?[...notes].reverse():notes;order.forEach((m,i)=>this.playNote(m,at+i*Math.abs(arp),duration,.66));}
 hush(){if(!this.ctx)return;for(const n of this.nodes){try{n.gain.gain.cancelScheduledValues(this.ctx.currentTime);n.gain.gain.setTargetAtTime(0,this.ctx.currentTime,.015);n.src.stop(this.ctx.currentTime+.07);}catch{}}this.nodes.clear();}
}
export class SequencePlayer {
 constructor(piano,onIndex,onState,onPosition){this.onPosition=onPosition;this.piano=piano;this.onIndex=onIndex;this.onState=onState;this.offset=0;this.state='stopped';this.timer=null;this.last=-1;this.generation=0;}
 stop(){this.generation++;clearInterval(this.timer);this.piano.hush();this.offset=0;this.last=-1;this.state='stopped';this.onIndex(-1);this.onPosition?.(-1);this.onState(this.state);}
 pause(){if(this.state!=='playing')return;this.offset+=this.piano.ctx.currentTime-this.started;clearInterval(this.timer);this.piano.hush();this.state='paused';this.onState(this.state);}
 async play(items,tempo,bass,loop){
  if(!items.length)return;if(this.state==='playing')return;
  const generation=++this.generation;await this.piano.init();if(generation!==this.generation)return;this.piano.hush();const beat=60/tempo;let time=0;
  this.beat=beat;this.events=items.map((item,i)=>{const start=Number.isFinite(item.start)?item.start*beat:time;const e={i,time:start,end:start+item.beats*beat,notes:item.notes};time=Math.max(time,e.end);return e;}).sort((a,b)=>a.time-b.time);this.duration=time;this.loop=loop;
  if(this.offset>=time)this.offset=0;this.started=this.piano.ctx.currentTime+.05;this.cursor=this.events.findIndex(e=>e.end>this.offset);if(this.cursor<0)this.cursor=0;
  this.state='playing';this.onState(this.state);this.tick();this.timer=setInterval(()=>this.tick(),40);
 }
 tick(){if(this.state!=='playing')return;const ctx=this.piano.ctx,position=Math.max(0,this.offset+ctx.currentTime-this.started);
  if(position>=this.duration){if(this.loop){this.started=ctx.currentTime-(position-this.duration);this.offset=0;this.cursor=0;}else{this.stop();return;}}
  const pos=Math.max(0,this.offset+ctx.currentTime-this.started);
  while(this.cursor<this.events.length&&this.events[this.cursor].time<=pos+.12){const e=this.events[this.cursor++];if(e.end>pos){const when=this.started+Math.max(e.time,this.offset)-this.offset;this.piano.playChord(e.notes,{at:when,duration:Math.max(.08,e.end-Math.max(e.time,this.offset)-.08)});}}
  const current=this.events.findIndex(e=>pos>=e.time&&pos<e.end);if(current!==this.last){this.last=current;this.onIndex(current<0?-1:this.events[current].i);}this.onPosition?.(pos/this.beat);
 }
}
export function wavBytes(buffer){const channels=buffer.numberOfChannels,length=buffer.length,out=new ArrayBuffer(44+length*channels*2),v=new DataView(out),str=(at,s)=>[...s].forEach((c,i)=>v.setUint8(at+i,c.charCodeAt(0)));str(0,'RIFF');v.setUint32(4,36+length*channels*2,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,channels,true);v.setUint32(24,buffer.sampleRate,true);v.setUint32(28,buffer.sampleRate*channels*2,true);v.setUint16(32,channels*2,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,length*channels*2,true);const data=Array.from({length:channels},(_,i)=>buffer.getChannelData(i));let offset=44;for(let i=0;i<length;i++)for(let c=0;c<channels;c++){const n=Math.max(-1,Math.min(1,data[c][i]));v.setInt16(offset,Math.round(n*(n<0?32768:32767)),true);offset+=2;}return new Uint8Array(out);}
export async function renderWav(piano,items,tempo,volume=80){await piano.init();const seconds=Math.max(...items.map(i=>(i.start+i.beats)*60/tempo))+1,ctx=new OfflineAudioContext(2,Math.ceil(seconds*44100),44100),render=new Piano();render.ctx=ctx;render.samples=piano.samples;render.master=ctx.createGain();render.master.gain.value=.65*volume/100;render.master.connect(ctx.destination);for(const item of items){const at=item.start*60/tempo;render.playChord(item.notes,{at,duration:Math.max(.08,item.beats*60/tempo-.08)});}return wavBytes(await ctx.startRendering());}
