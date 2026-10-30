import {TEMPLATES,spellNote} from './music.js';
export {TEMPLATES,spellNote};
export const FLATS=['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
export const SHARPS=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
export const FAMILIES={major:'Majeur',minor:'Mineur',dominant:'Dominante',halfdim:'Demi-diminué',diminished:'Diminué',sus:'Suspendu'};
export const STYLES={shell:'Coquille',rootless:'Sans fondamentale',quartal:'Quartal',upper:'Superstructure',spread:'Ouvert',close:'Rapproché',block:'Block chord'};
export const LEVELS={essentiel:'Essentiel',intermediaire:'Intermédiaire',avance:'Avancé'};
export const uid=()=>globalThis.crypto?.randomUUID?.()||'p-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,12);
export const byId=Object.fromEntries(TEMPLATES.map(t=>[t.id,t]));
export const pc=n=>((n%12)+12)%12;
export const rootName=(n,flats=true)=>(flats?FLATS:SHARPS)[pc(n)];
export const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const sickRefFor=item=>byId[item.id]?.sickRefs?.find(s=>s.number===item.sickNumber);
export const sourceOctFor=item=>(sickRefFor(item)?.oct??0)+(item.root>=9?-1:0);
export const handSplitFor=item=>sickRefFor(item)?.handSplit??byId[item.id]?.handSplit;
export const labelFor=item=>{const s=sickRefFor(item);return s?`Sick Chords Vol. 1 · position ${s.number}`:byId[item.id].label;};
export function chordName(item,flats=true,globalBass=false){const t=byId[item.id];return rootName(item.root,flats)+(sickRefFor(item)?.suffix||t.suffix)+(item.id==='M22'&&!item.sickNumber&&!item.bass&&!globalBass?'/'+spellNote(item.root,4,'3',false,flats):'');}
export function notesFor(item,globalBass=false){
 const t=byId[item.id];if(!t)throw Error('Voicing inconnu');
 const base=48+item.root+(item.oct||0)*12;
 const notes=t.intervals.map(i=>base+i);
 if(item.bass||globalBass){let bass=base-12;while(bass>=notes[0])bass-=12;if(!notes.includes(bass))notes.unshift(bass);}
 return notes;
}
export function inRange(item,globalBass=false){return notesFor(item,globalBass).every(n=>n>=21&&n<=108);}
export function describeNotes(item,solfege=false,flats=true){const t=byId[item.id];const notes=notesFor({...item,bass:false});return notes.map((m,i)=>{const name=spellNote(item.root,t.intervals[i],t.degrees[i],solfege,flats),letter=spellNote(item.root,t.intervals[i],t.degrees[i],false,flats),acc=[...letter].reduce((n,c)=>n+(c==='♯'?1:c==='♭'?-1:0),0);return {midi:m,degree:t.degrees[i],name,oct:Math.floor((m-acc)/12)-1};});}
export function keyboardSvg(item,{small=false,solfege=false,flats=true,globalBass=false}={}){
 const notes=notesFor(item,globalBass),meta=describeNotes(item,solfege,flats),active=new Map(meta.map(n=>[n.midi,n.name]));
 if(notes.length>meta.length)active.set(notes[0],rootName(item.root,flats));
 const low=small?Math.max(21,Math.floor((notes[0]-2)/12)*12):Math.min(48,Math.max(21,Math.floor((notes[0]-3)/12)*12));
 const high=Math.min(108,Math.max(small?0:83,Math.ceil((notes.at(-1)+2)/12)*12-1));
 const whites=[];for(let m=low;m<=high;m++)if(![1,3,6,8,10].includes(pc(m)))whites.push(m);
 const split=handSplitFor(item);
 const w=22,h=110, blackw=13, blackh=67,cut=Number.isInteger(split)?split+(notes.length>meta.length?1:0):(notes.length>=5?2:1);
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" class="keyboard" viewBox="0 0 ${whites.length*w} ${h+20}" role="group" aria-label="${esc(chordName(item,flats))} : ${esc(meta.map(x=>x.name).join(', '))}">`;
 const color=m=>notes.includes(m)?(notes.indexOf(m)<cut?' key-note-lh':' key-note'):'';
 for(let i=0;i<whites.length;i++){const m=whites[i];svg+=`<rect role="button" tabindex="0" aria-label="Jouer ${esc(rootName(m,flats))}${Math.floor(m/12)-1}" data-midi="${m}" x="${i*w}" y="0" width="${w}" height="${h}" rx="2" class="key-white${color(m)}"/>`;if(active.has(m))svg+=`<text x="${i*w+w/2}" y="${h-12}" text-anchor="middle">${esc(active.get(m))}</text>`;if(pc(m)===0)svg+=`<text class="white-label" x="${i*w+w/2}" y="${h+12}" text-anchor="middle">C${Math.floor(m/12)-1}</text>`;}
 for(let m=low;m<=high;m++){if(![1,3,6,8,10].includes(pc(m)))continue;const i=whites.findIndex(v=>v>m);if(i<0)continue;const x=i*w-blackw/2;svg+=`<rect role="button" tabindex="0" aria-label="Jouer ${esc(rootName(m,flats))}${Math.floor(m/12)-1}" data-midi="${m}" x="${x}" y="0" width="${blackw}" height="${blackh}" rx="1.5" class="key-black${color(m)}"/>`;if(active.has(m))svg+=`<text x="${x+blackw/2}" y="${blackh-8}" text-anchor="middle" fill="${notes.includes(m)?'#193a3b':'white'}" style="font-size:6px">${esc(active.get(m))}</text>`;}
 return svg+'</svg>';
}
export function makeItem(id,root,extra={}){return {id,root,oct:0,bass:false,beats:4,...extra};}
export function makeSickItem(number,root){const t=TEMPLATES.find(t=>t.sickRefs.some(s=>s.number===number));if(!t)throw Error('Position Sick Chords inconnue.');const s=t.sickRefs.find(s=>s.number===number);return makeItem(t.id,root,{oct:s.oct+(root>=9?-1:0),sickNumber:number});}
export const PRESETS=[
 {name:'II–V–I · les rootless essentiels',detail:'Dm9 → G13 → Cmaj9 · formes A et B, 80 BPM',tempo:80,items:[makeItem('m08',2),makeItem('D09',7,{oct:-1}),makeItem('M08',0)]},
 {name:'II–V–I mineur · tension et résolution',detail:'Dm7♭5 → G7(♭9,♭13) → Cm6/9 · 72 BPM',tempo:72,items:[makeItem('H01',2),makeItem('D34',7,{oct:-1}),makeItem('m17',0)]},
 {name:'Blues en Do · les coquilles',detail:'12 mesures · C7, F7 et G7 · 80 BPM',tempo:80,items:[0,5,0,0,5,5,0,0,7,5,0,7].map(root=>makeItem('D02',root))},
 {name:'Gospel & soul · accords suspendus',detail:'Cmaj9 → A13sus → Dm9 → G13sus · 76 BPM',tempo:76,items:[makeItem('M08',0),makeItem('S05',9,{oct:-1}),makeItem('m08',2),makeItem('S05',7,{oct:-1})]},
 {name:'Couleur modale · des quartes',detail:'Dm11 → E♭m11 → Dm11 → Dm9 · 90 BPM',tempo:90,items:[makeItem('m15',2,{oct:-1}),makeItem('m15',3,{oct:-1}),makeItem('m15',2,{oct:-1}),makeItem('m08',2)]}
];
export function cleanItem(x){if(!x||typeof x!=='object'||!Object.hasOwn(byId,x.id)||!Number.isInteger(x.root)||x.root<0||x.root>11)throw Error('Un accord est invalide.');const y={id:x.id,root:x.root,oct:Number.isInteger(x.oct)?x.oct:0,bass:!!x.bass,beats:typeof x.beats==='number'?x.beats:4};if(x.sickNumber!==undefined){if(!Number.isInteger(x.sickNumber)||!byId[y.id].sickRefs.some(s=>s.number===x.sickNumber))throw Error('Référence Sick Chords invalide.');y.sickNumber=x.sickNumber;}if(!(y.beats>=.5&&y.beats<=8&&Number.isInteger(y.beats*2))||y.oct< -8||y.oct>8||!inRange(y))throw Error('Registre ou durée invalide.');return y;}
export function cleanProject(p){if(!p||typeof p!=='object'||!Array.isArray(p.items)||p.items.length>256)throw Error('Progression invalide (256 accords maximum).');return {id:typeof p.id==='string'?p.id.slice(0,80):uid(),name:String(p.name||'Sans titre').slice(0,90),tempo:Math.min(240,Math.max(30,Number(p.tempo)||80)),globalBass:!!p.globalBass,loop:!!p.loop,items:p.items.map(x=>{const n=cleanItem(x);if(!inRange(n,!!p.globalBass))throw Error('Basse hors du registre.');return n;}),updated:typeof p.updated==='string'?p.updated:new Date().toISOString()};}
export function midiBytes(items,tempo,globalBass=false){
 const vlq=n=>{const out=[n&127];while((n>>=7)>0)out.unshift((n&127)|128);return out;};
 const be=(n,len)=>Array.from({length:len},(_,i)=>(n>>((len-1-i)*8))&255);
 const events=[{at:0,data:[0xff,0x51,3,...be(Math.round(60000000/tempo),3)]},{at:0,data:[0xc0,0]},{at:0,data:[0xc1,0]}];let tick=0;
 for(const item of items){const start=Number.isFinite(item.start)?item.start*480:tick,channel=item.channel===1?1:0;for(const n of (item.notes||notesFor(item,globalBass))){events.push({at:start,data:[0x90+channel,n,channel?65:90]});events.push({at:start+item.beats*480,data:[0x80+channel,n,0]});}tick=Math.max(tick,start+item.beats*480);}
 const priority=e=>e.data[0]>=128&&e.data[0]<144?0:e.data[0]>=144&&e.data[0]<160?2:1;events.sort((a,b)=>a.at-b.at||priority(a)-priority(b));let last=0,track=[];for(const e of events){track.push(...vlq(e.at-last),...e.data);last=e.at;}track.push(...vlq(tick-last),0xff,0x2f,0);
 return new Uint8Array([77,84,104,100,0,0,0,6,0,0,0,1,1,224,77,84,114,107,...be(track.length,4),...track]);
}
