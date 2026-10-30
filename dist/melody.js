import {TEMPLATES,byId,pc,notesFor,inRange,makeItem,cleanItem} from './core.js';
export const DURATIONS=[4,2,1,.5];
export const durationName=n=>({4:'Ronde',2:'Blanche',1:'Noire','0.5':'Croche'}[n]||`${n} temps`);
export const atLabel=start=>`M${Math.floor(start/4)+1} · temps ${Math.floor(start%4)+1}${start%1?' et':''}`;
const fits=(e,measures)=>Number.isInteger(e.start*2)&&Number.isInteger(e.duration*2)&&e.duration>=.5&&e.start>=0&&e.start+e.duration<=measures*4&&e.start%4+e.duration<=4;
const overlaps=(a,b)=>a.start<b.start+b.duration&&b.start<a.start+a.duration;
export const harmonyAt=(state,at)=>state.harmonies.find(h=>at>=h.start&&at<h.start+h.duration);
export function cleanMelody(raw){
 if(!raw||![1,2].includes(raw.measures)||!Array.isArray(raw.events)||raw.events.length>16)throw Error('Mélodie invalide.');
 const events=raw.events.map(e=>{
  if(!Number.isInteger(e.midi)||e.midi<48||e.midi>96||!DURATIONS.includes(e.duration)||!fits(e,raw.measures))throw Error('Une note dépasse la mesure ou sa durée est invalide.');
  return {midi:e.midi,start:e.start,duration:e.duration,chord:null};
 }).sort((a,b)=>a.start-b.start);
 for(let i=1;i<events.length;i++)if(overlaps(events[i-1],events[i]))throw Error('Deux notes se chevauchent.');
 const legacy=raw.harmonies===undefined;
 const input=legacy?raw.events.filter(e=>e.chord).map(e=>{const chord=cleanItem(e.chord);if(notesFor(chord).at(-1)!==e.midi)throw Error('L’accord ne conserve pas la note supérieure.');return {start:e.start,duration:e.duration,chord};}):raw.harmonies;
 if(!Array.isArray(input)||input.length>16)throw Error('Ligne d’accords invalide.');
 const bass=!!raw.bass,harmonies=input.map(h=>{if(!fits(h,raw.measures))throw Error('Un accord dépasse la mesure ou sa durée est invalide.');const chord=cleanItem(h.chord);if(!inRange(chord,bass))throw Error('Basse hors du piano.');return {start:h.start,duration:h.duration,chord};}).sort((a,b)=>a.start-b.start);
 for(let i=1;i<harmonies.length;i++)if(overlaps(harmonies[i-1],harmonies[i]))throw Error('Deux accords se chevauchent.');
 // Le champ chord reste dérivé pour lire les anciens projets et vues ; le rythme est porté par harmonies.
 for(const e of events)e.chord=harmonies.find(h=>e.start>=h.start&&e.start<h.start+h.duration)?.chord??null;
 return {name:String(raw.name||'Ma réharmonisation').slice(0,90),measures:raw.measures,tempo:Math.min(240,Math.max(30,Number(raw.tempo)||60)),volume:Math.min(100,Math.max(0,Number.isFinite(raw.volume)?raw.volume:80)),loop:!!raw.loop,bass,events,harmonies};
}
export function setHarmony(state,start,duration,chord){
 const next={start,duration,chord},end=start+duration;
 const harmonies=state.harmonies.flatMap(h=>{if(!overlaps(h,next))return [h];const pieces=[];if(h.start<start)pieces.push({...h,duration:start-h.start});if(h.start+h.duration>end)pieces.push({...h,start:end,duration:h.start+h.duration-end});return pieces;});
 return cleanMelody({...state,harmonies:[...harmonies,next]});
}
export function candidates(midi,{family='',root=null,source='',style='',free=false}={}){
 const list=[];for(const t of TEMPLATES){
  if(family&&t.family!==family||style&&t.style!==style||source==='schneider1'&&!t.sickRefs.length)continue;
  const roots=free?(root===null?Array.from({length:12},(_,i)=>i):[Number(root)]):[pc(midi-t.intervals.at(-1))];
  for(const r of roots){if(root!==null&&r!==Number(root))continue;const oct=Math.round((midi-48-r-t.intervals.at(-1))/12),item=makeItem(t.id,r,{oct});if(!inRange(item))continue;if(source==='schneider1')item.sickNumber=t.sickRefs[0].number;list.push(item);}
 }return list;
}
export function propose(state,options={}){
 let prev=null;const ranges=state.harmonies.length?state.harmonies:state.events;
 return cleanMelody({...state,harmonies:ranges.map(h=>{
  const e=state.events.find(e=>h.start>=e.start&&h.start<e.start+e.duration)||state.events.find(e=>e.start>=h.start&&e.start<h.start+h.duration),midi=e?.midi??(h.chord?notesFor(h.chord).at(-1):60);
  const cs=candidates(midi,options).filter(i=>inRange(i,state.bass));if(!cs.length)throw Error('Aucun voicing avec ces filtres pour une des plages.');
  const score=i=>{const ns=notesFor(i),t=byId[i.id];return (prev?ns.reduce((s,n)=>s+Math.min(...prev.map(p=>Math.abs(p-n))),0)/ns.length:Math.abs(ns[0]-48)/4)+Math.abs(ns.length-4)*.7+(t.level==='avance'?.8:0);};
  cs.sort((a,b)=>score(a)-score(b));const chord=cs[0];prev=notesFor(chord);return {start:h.start,duration:h.duration,chord};
 })});
}
export function timeline(state,mode='harmony'){
 const notes=state.events.map((e,eventIndex)=>({start:e.start,beats:e.duration,notes:[e.midi],channel:0,eventIndex,harmonyIndex:-1}));
 const chords=mode==='melody'?[]:state.harmonies.map((h,harmonyIndex)=>({start:h.start,beats:h.duration,notes:notesFor(h.chord,state.bass),channel:1,eventIndex:-1,harmonyIndex}));
 return [...notes,...chords,{start:state.measures*4-.5,beats:.5,notes:[],eventIndex:-1,harmonyIndex:-1}].sort((a,b)=>a.start-b.start);
}
export const demoMelody=()=>cleanMelody({name:'Une mélodie, trois couleurs',measures:1,tempo:60,events:[{midi:62,start:0,duration:2,chord:makeItem('m06',11,{oct:-1})},{midi:64,start:2,duration:1,chord:candidates(64,{family:'minor',root:4}).find(i=>byId[i.id].suffix==='m9')},{midi:69,start:3,duration:1,chord:makeItem('D19',6)}]});
export const groupedDemo=()=>{const events=[{midi:62,start:0,duration:1},{midi:64,start:1,duration:1},{midi:67,start:2,duration:1},{midi:69,start:3,duration:1}];return cleanMelody({name:'Deux noires, un accord en blanche',measures:1,tempo:60,events,harmonies:[{start:0,duration:2,chord:makeItem('m06',11,{oct:-1})},{start:2,duration:2,chord:candidates(67,{family:'major',root:0})[0]}]});};
