import {byId,chordName,notesFor,describeNotes,handSplitFor,rootName,pc,labelFor} from './core.js';
// PDF vectoriel autonome : aucune fenêtre d’impression ni service externe.
const ascii=s=>String(s).replace(/♭/g,'b').replace(/♯/g,'#').replace(/[–—]/g,'-').replace(/→/g,'>').replace(/·/g,' / ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7e]/g,'');
const safe=s=>ascii(s).replace(/[\\()]/g,'\\$&');
const W=595.28,H=841.89;
export function progressionPdf({name='Ma réharmonisation',tempo=60,items=[],melody=null,globalBass=false,flats=true}){
 const pages=[];let commands=[];
 const text=(s,x,y,size=9,bold=false)=>commands.push(`BT /${bold?'F2':'F1'} ${size} Tf 0.08 0.2 0.2 rg 1 0 0 1 ${x} ${H-y} Tm (${safe(s)}) Tj ET`);
 const rect=(x,y,w,h,color=[1,1,1],border=true)=>commands.push(`${color.join(' ')} rg 0.65 0.69 0.64 RG .5 w ${x} ${H-y-h} ${w} ${h} re ${border?'B':'f'}`);
 const line=(x,y,x2,y2)=>commands.push(`0.3 0.4 0.35 RG .6 w ${x} ${H-y} m ${x2} ${H-y2} l S`);
 function header(page){text(name,30,40,17,true);text(`Atelier Reharmonisation / 4/4 / ${tempo} BPM`,30,58,9);text(`Page ${page}`,520,58,8);line(30,70,565,70);}
 function flush(){pages.push(commands.join('\n'));commands=[];}
 header(1);let startY=90;
 if(melody){text('MELODIE / RYTHME DES NOTES',30,90,8,true);const barW=535/melody.measures;
  for(let m=0;m<melody.measures;m++){
   rect(30+m*barW,100,barW,66,[.96,.97,.93]);text(`MESURE ${m+1}`,36+m*barW,113,7,true);
   for(let b=1;b<4;b++)line(30+m*barW+b*barW/4,118,30+m*barW+b*barW/4,166);
  }
  for(const e of melody.events){const x=30+e.start/4*barW+5;const width=e.duration/4*barW-7;text(rootName(e.midi,flats)+(Math.floor(e.midi/12)-1),x,133,Math.min(10,width/2.7),true);text(`${e.duration} t`,x,148,7);}
  if(melody.harmonies){
   text('ACCORDS / RYTHME INDEPENDANT',30,182,8,true);
   for(const h of melody.harmonies){const x=30+h.start/4*barW,width=h.duration/4*barW;rect(x,190,width,38,[.96,.91,.77]);text(chordName(h.chord,flats),x+4,204,Math.min(10,(width-8)/(ascii(chordName(h.chord,flats)).length*.58)),true);text(`${h.duration} t`,x+4,218,7);}
   text('Une attaque par accord. La melodie evolue pendant sa tenue. Espaces vides = silences.',30,241,7);startY=263;
  }else{text('Espaces non saisis = silences. Ronde 4 t / blanche 2 t / noire 1 t / croche 0.5 t.',30,180,7);startY=202;}
 }
 const rows=melody?.harmonies?melody.harmonies.map((h,i)=>({item:{...h.chord,beats:h.duration},index:i,event:h})):items.map((item,i)=>({item,index:i,event:melody?.events[i]}));
 for(let i=0;i<rows.length;i++){
  const row=Math.floor(i/2),col=i%2;let y=startY+row*181;
  if(y+170>795){flush();header(pages.length+1);startY=90-row*181;y=90;}
  const {item,event}=rows[i],x=30+col*273,cw=262;
  rect(x,y,cw,169,[1,1,1]);
  text(event?`MESURE ${Math.floor(event.start/4)+1} / TEMPS ${event.start%4+1} / ${event.duration} t`:`ACCORD ${i+1} / ${item.beats} temps`,x+9,y+15,7,true);
  if(!item){text('Melodie seule / aucun accord choisi',x+9,y+40,10);continue;}
  const title=chordName(item,flats,globalBass),meta=describeNotes(item,false,flats),ns=notesFor(item,globalBass),top=meta.at(-1),split=handSplitFor(item)??(ns.length>=5?2:1),cut=split+(ns.length>meta.length?1:0);
  text(title,x+9,y+34,Math.min(15,230/(title.length*.56)),true);text(`TOP ${top.name}${top.oct} (${top.degree})`,x+9,y+48,8);
  const low=Math.max(21,Math.floor((ns[0]-1)/12)*12),high=Math.min(108,Math.ceil((ns.at(-1)+2)/12)*12-1),white=[];
  for(let n=low;n<=high;n++)if(![1,3,6,8,10].includes(pc(n)))white.push(n);
  const kw=244/white.length,kh=63,ky=y+57,kx=x+9,labels=new Map(meta.map(n=>[n.midi,n.name]));if(ns.length>meta.length)labels.set(ns[0],rootName(item.root,flats));
  const color=n=>ns.includes(n)?ns.indexOf(n)<cut?[.42,.66,.7]:[.96,.73,.3]:[1,1,1];
  for(let j=0;j<white.length;j++){const n=white[j];rect(kx+j*kw,ky,kw,kh,color(n));if(labels.has(n))text(labels.get(n),kx+j*kw+1,ky+kh-6,Math.min(6,kw/Math.max(1,ascii(labels.get(n)).length)*1.5),true);}
  for(let n=low;n<=high;n++)if([1,3,6,8,10].includes(pc(n))){const j=white.findIndex(v=>v>n);if(j<0)continue;const bx=kx+j*kw-kw*.3;rect(bx,ky,kw*.6,kh*.61,ns.includes(n)?color(n):[.09,.12,.12]);if(labels.has(n))text(labels.get(n),bx+.5,ky+kh*.61-5,Math.min(5,kw*.6/ascii(labels.get(n)).length*1.4),true);}
  text(meta.map(n=>`${n.name}${n.oct}`).join(' - '),x+9,y+135,7);
  text(byId[item.id].degrees.join(' - '),x+9,y+147,7);const covered=melody?.harmonies?melody.events.filter(e=>e.start>=event.start&&e.start<event.start+event.duration).map(e=>rootName(e.midi,flats)+(Math.floor(e.midi/12)-1)).join(' - '):'';text(covered?'Melodie : '+covered:labelFor(item),x+9,y+159,6.5);
 }
 if(!items.length)text('Aucun accord dans cette progression.',30,startY,12);
 flush();
 const objects=['<< /Type /Catalog /Pages 2 0 R >>','', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'];
 const kids=[];for(const p of pages){const pageId=objects.length+1,streamId=pageId+1;kids.push(`${pageId} 0 R`);objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${streamId} 0 R >>`);objects.push(`<< /Length ${p.length} >>\nstream\n${p}\nendstream`);}
 objects[1]=`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pages.length} >>`;
 let out='%PDF-1.4\n',offsets=[0];for(let i=0;i<objects.length;i++){offsets.push(out.length);out+=`${i+1} 0 obj\n${objects[i]}\nendobj\n`;}
 const xref=out.length;out+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
 return new TextEncoder().encode(out);
}
