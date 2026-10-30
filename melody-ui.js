import {FLATS,SHARPS,FAMILIES,STYLES,byId,rootName,chordName,labelFor,keyboardSvg,notesFor,describeNotes,esc,midiBytes,cleanProject} from './core.js';
import {DURATIONS,durationName,atLabel,candidates,cleanMelody,propose,timeline,demoMelody,groupedDemo,setHarmony,harmonyAt} from './melody.js';
import {SequencePlayer,renderWav} from './audio.js';
import {progressionPdf} from './pdf-export.js';
export function initMelody({piano,stopOther,toast,download,settings,loadProgression}){
 const $=id=>document.getElementById(id),key='atelier-melodie-v1';let state;try{state=cleanMelody(JSON.parse(localStorage.getItem(key)));}catch{state=demoMelody();}
 let pdfUrl=null,wavUrl=null;let selected=state.events[0]?.start??0,undo=[],redo=[],limit=16,options={family:'',root:null,source:'',style:''};
 let playingKey='';
 const player=new SequencePlayer(piano,()=>{},s=>{$('mel-play').disabled=s==='playing';$('mel-pause').disabled=s!=='playing';},beat=>{
  const event=state.events.findIndex(e=>beat>=e.start&&beat<e.start+e.duration),hi=state.harmonies.findIndex(h=>beat>=h.start&&beat<h.start+h.duration),key=event+':'+hi;
  document.querySelectorAll('[data-mel-event]').forEach(n=>n.classList.toggle('playing',Number(n.dataset.melEvent)===event&&event>=0));document.querySelectorAll('[data-harm-index]').forEach(n=>n.classList.toggle('playing',Number(n.dataset.harmIndex)===hi&&hi>=0));
  if(key===playingKey)return;playingKey=key;const e=state.events[event],h=state.harmonies[hi];$('mel-current').textContent=beat<0?'Lecture arrêtée':`Mélodie : ${e?noteName(e.midi):'silence'} · Accord : ${h?chordName(h.chord,settings().flats):'silence'}`;
  if(h)$('mel-live').innerHTML=keyboardSvg(h.chord,{...settings(),globalBass:state.bass});else $('mel-live').innerHTML=e?`<p>Note ${noteName(e.midi)}</p>`:'<p>Silence</p>';
 });
 const noteName=m=>rootName(m,settings().flats)+(Math.floor(m/12)-1);
 const save=()=>{try{localStorage.setItem(key,JSON.stringify(state));}catch{toast('Mémoire locale pleine. Téléchargez le projet JSON.');}};
 function change(next){next=cleanMelody(next);player.stop();undo.push(structuredClone(state));if(undo.length>50)undo.shift();redo=[];state=next;save();render();}
 function controls(){
  $('mel-name').value=state.name;$('mel-measures').value=state.measures;$('mel-tempo').value=state.tempo;$('mel-volume').value=state.volume;$('mel-loop').checked=state.loop;$('mel-bass').checked=state.bass;
  $('mel-pitch').innerHTML=(settings().flats?FLATS:SHARPS).map((n,i)=>`<option value="${i}">${n}</option>`).join('');
  $('mel-octave').innerHTML=[3,4,5,6,7].map(n=>`<option>${n}</option>`).join('');
  $('mel-duration').innerHTML=DURATIONS.map(n=>`<option value="${n}">${durationName(n)} · ${n} temps</option>`).join('');
  $('mel-onset').innerHTML=Array.from({length:state.measures*8},(_,i)=>`<option value="${i/2}">${atLabel(i/2)}</option>`).join('');
  $('mel-family').innerHTML='<option value="">Toutes les familles</option>'+Object.entries(FAMILIES).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');$('mel-family').value=options.family;
  $('mel-root').innerHTML='<option value="">Toutes les fondamentales</option>'+FLATS.map((n,i)=>`<option value="${i}">${n}</option>`).join('');$('mel-root').value=options.root??'';
  $('mel-style').innerHTML='<option value="">Tous les types</option>'+Object.entries(STYLES).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');$('mel-style').value=options.style;
  const e=state.events.find(e=>e.start===selected);$('mel-pitch').value=(e?.midi??62)%12;$('mel-octave').value=Math.floor((e?.midi??62)/12)-1;$('mel-duration').value=e?.duration??.5;$('mel-onset').value=selected;const h=harmonyAt(state,selected);$('harm-onset').innerHTML=$('mel-onset').innerHTML;$('harm-onset').value=h?.start??selected;$('harm-duration').innerHTML=Array.from({length:8},(_,i)=>(i+1)/2).map(n=>`<option value="${n}">${durationName(n)} · ${n} temps</option>`).join('');$('harm-duration').value=h?.duration??e?.duration??2;$('harm-remove').disabled=!h;$('harm-apply').disabled=!h;$('mel-delete').disabled=!e;$('mel-set').textContent=e?'Modifier cette note':'Placer cette note';
  $('mel-undo').disabled=!undo.length;$('mel-redo').disabled=!redo.length;
 }
 function render(){controls();const {flats}=settings();let html='';for(let m=0;m<state.measures;m++){
  html+=`<div class="mel-measure"><h3>Mesure ${m+1} <small>4/4</small></h3><div class="mel-grid">`;
  for(let tick=m*8;tick<(m+1)*8;tick++){const start=tick/2,e=state.events.find(e=>e.start===start),index=state.events.indexOf(e),occupied=state.events.some(e=>e.start<start&&e.start+e.duration>start);if(occupied)continue;
   html+=e?`<button class="mel-note ${selected===start?'selected':''}" style="grid-column:span ${e.duration*2}" data-mel-start="${start}" data-mel-event="${index}"><small>${atLabel(start)}</small><strong>${esc(noteName(e.midi))}</strong><span>${{4:'𝅝',2:'𝅗𝅥',1:'♩','.5':'♪','0.5':'♪'}[e.duration]} ${durationName(e.duration)}</span></button>`:`<button class="mel-empty ${selected===start?'selected':''}" data-mel-start="${start}" aria-label="Placer une note ${atLabel(start)}"><small>${start%4+1}</small>＋</button>`;
  }html+='</div><div class="harm-label">Accords · rythme indépendant</div><div class="mel-grid harm-grid">';
  for(let tick=m*8;tick<(m+1)*8;tick++){const start=tick/2,h=state.harmonies.find(h=>h.start===start),occupied=state.harmonies.some(h=>h.start<start&&h.start+h.duration>start);if(occupied)continue;
   html+=h?`<button class="mel-harmony ${harmonyAt(state,selected)===h?'selected':''}" style="grid-column:span ${h.duration*2}" data-harm-start="${h.start}" data-harm-index="${state.harmonies.indexOf(h)}"><b>${esc(chordName(h.chord,flats))}</b><small>${durationName(h.duration)} · ${h.duration} temps</small></button>`:`<span class="harm-empty"></span>`;
  }html+='</div></div>';
 }$('mel-score').innerHTML=html;
 const missing=state.events.filter(e=>!e.chord).length,used=state.events.reduce((s,e)=>s+e.duration,0);$('mel-status').textContent=`${state.events.length} note(s) · ${state.harmonies.length} accord(s) indépendants · ${used}/${state.measures*4} temps de mélodie · ${missing?missing+' note(s) sans accord au départ':'chaque note commence sous un accord'}. Les cases vides sont des silences.`;
 renderCandidates();if(pdfUrl)URL.revokeObjectURL(pdfUrl);pdfUrl=URL.createObjectURL(new Blob([progressionPdf(exportDoc())],{type:'application/pdf'}));$('mel-pdf').href=pdfUrl;$('mel-pdf').download=filename()+'.pdf';$('mel-wav-ready').innerHTML='';if(wavUrl){URL.revokeObjectURL(wavUrl);wavUrl=null;}const activeHarmony=harmonyAt(state,selected);$('mel-live').innerHTML=activeHarmony?keyboardSvg(activeHarmony.chord,{...settings(),globalBass:state.bass}):'<p>Choisissez une note puis un accord pour visualiser son clavier.</p>';
 }
 function renderCandidates(){const e=state.events.find(e=>e.start===selected);if(!e&&!options.free){$('mel-candidates').innerHTML='<p>Placez une note dans la grille ou activez la recherche libre pour choisir un accord.</p>';$('mel-candidate-count').textContent='Les accords possibles';return;}
 const chosen=harmonyAt(state,selected)?.chord,midi=e?.midi??60,list=candidates(midi,options);$('mel-candidate-count').textContent=`${list.length} possibilités · ${options.free?'recherche libre':noteName(midi)+' au sommet de l’accord'}`;
 $('mel-candidates').innerHTML=list.slice(0,limit).map(i=>`<article class="mel-candidate ${chosen?.id===i.id&&chosen.root===i.root?'selected':''}"><b>${esc(chordName(i,settings().flats))}</b><small>${esc(labelFor(i))} · sommet ${esc(byId[i.id].degrees.at(-1))}</small><p>${describeNotes(i,false,settings().flats).map(n=>esc(n.name)+n.oct).join(' – ')}</p><button class="secondary" data-mel-listen="${i.id}" data-root="${i.root}" data-oct="${i.oct}">Écouter</button><button class="dark" data-mel-choose="${i.id}" data-root="${i.root}" data-oct="${i.oct}" ${i.sickNumber?`data-sick="${i.sickNumber}"`:''}>Choisir</button></article>`).join('')||'<p>Aucun accord avec ces filtres. Retirez un critère.</p>';
 $('mel-more').hidden=list.length<=limit;
 }
 const exportDoc=()=>({name:state.name,tempo:state.tempo,items:state.harmonies.map(h=>({...h.chord,beats:h.duration})),melody:state,globalBass:state.bass,flats:settings().flats});
 const filename=()=>state.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]/g,'-').slice(0,70)||'reharmonisation';
 $('melody-view').addEventListener('click',async ev=>{const b=ev.target.closest('button');if(!b)return;try{
  if(b.dataset.harmStart!==undefined){selected=Number(b.dataset.harmStart);limit=16;render();return;}
  if(b.dataset.melStart!==undefined){selected=Number(b.dataset.melStart);limit=16;render();return;}
  if(b.dataset.melListen||b.dataset.melChoose){const id=b.dataset.melListen||b.dataset.melChoose,item={id,root:Number(b.dataset.root),oct:Number(b.dataset.oct),beats:4,bass:false};if(b.dataset.sick)item.sickNumber=Number(b.dataset.sick);
   if(b.dataset.melListen){stopOther();player.stop();await piano.init();piano.master.gain.value=.65*state.volume/100;piano.playChord(notesFor(item,state.bass));}else change(setHarmony(state,Number($('harm-onset').value),Number($('harm-duration').value),item));return;}
  switch(b.id){
   case'mel-set':{const midi=(Number($('mel-octave').value)+1)*12+Number($('mel-pitch').value),duration=Number($('mel-duration').value),start=Number($('mel-onset').value),old=state.events.find(e=>e.start===selected);const events=state.events.filter(e=>e.start!==selected);events.push({midi,duration,start,chord:old?.midi===midi?old.chord:null});change({...state,events});selected=Math.min(state.measures*4-.5,start+duration);render();break;}
   case'mel-delete':change({...state,events:state.events.filter(e=>e.start!==selected)});break;
   case'mel-undo':if(undo.length){player.stop();redo.push(state);state=undo.pop();save();selected=0;render();}break;
   case'mel-redo':if(redo.length){player.stop();undo.push(state);state=redo.pop();save();selected=0;render();}break;
   case'harm-demo':change(groupedDemo());selected=0;render();break;
   case'harm-apply':{const h=harmonyAt(state,selected);if(h)change(setHarmony({...state,harmonies:state.harmonies.filter(x=>x!==h)},Number($('harm-onset').value),Number($('harm-duration').value),h.chord));break;}
   case'harm-remove':{const h=harmonyAt(state,selected);change({...state,harmonies:state.harmonies.filter(x=>x!==h)});break;}
   case'mel-demo':change(demoMelody());selected=0;render();break;
   case'mel-clear':if(confirm('Effacer cette mélodie et ses accords ? Vous pourrez annuler.'))change({...state,events:[],harmonies:[]});break;
   case'mel-auto':change(propose(state,options));toast('Suite proposée en conservant le rythme des accords existants.');break;
   case'mel-more':limit+=32;renderCandidates();break;
   case'mel-play':if(!state.events.length&&!state.harmonies.length){toast('Saisissez au moins une note ou un accord.');break;}stopOther();await piano.init();piano.master.gain.value=.65*state.volume/100;player.items=timeline(state,$('mel-mode').value);await player.play(player.items,state.tempo,false,state.loop);break;
   case'mel-pause':player.pause();break;case'mel-stop':player.stop();break;
   case'mel-json':download(filename()+'.json',JSON.stringify({app:'atelier-melodie',version:1,state},null,2),'application/json');break;
   case'mel-open':$('mel-file').click();break;
   case'mel-pdf':if(!state.events.length&&!state.harmonies.length)throw Error('La mélodie et les accords sont vides.');download(filename()+'.pdf',progressionPdf(exportDoc()),'application/pdf');toast('PDF téléchargé : mélodie, rythme, accords et claviers.');break;
   case'mel-midi':if(!state.events.length&&!state.harmonies.length)throw Error('La mélodie et les accords sont vides.');download(filename()+'.mid',midiBytes(timeline(state,$('mel-mode').value),state.tempo),'audio/midi');break;
   case'mel-wav':if(!state.events.length&&!state.harmonies.length)throw Error('La mélodie et les accords sont vides.');stopOther();player.stop();b.disabled=true;toast('Rendu du fichier WAV en cours…');try{const bytes=await renderWav(piano,timeline(state,$('mel-mode').value),state.tempo,state.volume);wavUrl=URL.createObjectURL(new Blob([bytes],{type:'audio/wav'}));$('mel-wav-ready').innerHTML=`<a class="primary" href="${wavUrl}" download="${filename()}.wav">Télécharger le WAV prêt</a>`;toast('WAV prêt : cliquez sur son lien de téléchargement.');}finally{b.disabled=false;}break;
   case'mel-to-seq':if(!state.harmonies.length)throw Error('Choisissez au moins un accord.');loadProgression(cleanProject({...state,items:state.harmonies.map(h=>({...h.chord,beats:h.duration})),globalBass:state.bass}));break;
  }
 }catch(err){toast(err.message);}});
 $('melody-view').addEventListener('change',e=>{const id=e.target.id;try{if(id==='mel-mode')player.stop();
  if(id==='mel-onset'){selected=Number(e.target.value);render();}
  if(id==='harm-free'||id==='mel-family'||id==='mel-root'||id==='mel-source'||id==='mel-style'){options={family:$('mel-family').value,root:$('mel-root').value===''?null:Number($('mel-root').value),source:$('mel-source').value,style:$('mel-style').value,free:$('harm-free').checked};limit=16;renderCandidates();}
  const fields={'mel-measures':'measures','mel-tempo':'tempo','mel-volume':'volume','mel-loop':'loop','mel-bass':'bass','mel-name':'name'};
  if(fields[id]){const value=e.target.type==='checkbox'?e.target.checked:id==='mel-name'?e.target.value:Number(e.target.value);change({...state,[fields[id]]:value});selected=Math.min(selected,state.measures*4-.5);render();}
 }catch(err){toast(err.message);render();}});
 $('mel-file').addEventListener('change',async e=>{try{const f=e.target.files[0];if(!f)return;if(f.size>2000000)throw Error('Fichier trop volumineux.');const data=JSON.parse(await f.text());if(data.app!=='atelier-melodie'||data.version!==1)throw Error('Projet incompatible.');change(data.state);selected=0;render();}catch(err){toast(err.message);}finally{e.target.value='';}});
 $('mel-live').addEventListener('click',async e=>{const n=e.target.closest('[data-midi]');if(n){stopOther();player.stop();await piano.init();piano.playNote(Number(n.dataset.midi));}});
 window.addEventListener('pagehide',()=>player.stop());render();save();
 return {getState:()=>structuredClone(state),importState:raw=>{change(raw);selected=0;render();},stop:()=>player.stop()};
}
