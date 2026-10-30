import assert from 'node:assert/strict';
import {TEMPLATES,byId,cleanProject,notesFor,describeNotes,keyboardSvg,inRange,midiBytes} from '../dist/core.js';
import {STUDY_TYPES,POSITION_ORDERS,STUDY_QUALITIES,buildStudy,positionTemplate,cycleRoots} from '../dist/study.js';

assert.equal(TEMPLATES.length,296);
assert.equal(new Set(TEMPLATES.map(t=>t.id)).size,TEMPLATES.length);
const diatonic=[0,2,4,5,7,9,11];
for(const t of TEMPLATES){
 assert.equal(t.intervals.length,t.degrees.length,t.id);
 for(let j=0;j<t.degrees.length;j++){
  const d=t.degrees[j],num=Number(d.match(/\d+/)[0]),alteration=[...d.replace(/\d/g,'')].reduce((n,c)=>n+(c==='b'?-1:c==='#'?1:0),0);
  assert.equal(((diatonic[(num-1)%7]+alteration)%12+12)%12,t.intervals[j]%12,t.id+' '+d);
  if(j)assert(t.intervals[j]>t.intervals[j-1],t.id);
 }
 for(let root=0;root<12;root++){const i={id:t.id,root,oct:0,bass:true,beats:4};assert(inRange(i),t.id);assert(describeNotes(i).length===t.intervals.length);}
}
for(const q of Object.keys(STUDY_QUALITIES))for(const p of POSITION_ORDERS){
 const t=positionTemplate(p,q);assert(t);assert.equal(t.degrees.map(d=>d.replace(/[^0-9]/g,'')).join(''),p);assert.equal(t.handSplit,2);
}
for(const cycle of ['fourths','chromatic','whole'])for(let root=0;root<12;root++)assert.equal(new Set(cycleRoots(root,cycle)).size,12);
for(const type of Object.keys(STUDY_TYPES))for(let root=0;root<12;root++)for(const position of POSITION_ORDERS)for(const quality of Object.keys(STUDY_QUALITIES))for(const cycle of ['fourths','chromatic','whole']){
 const exercise=buildStudy({type,root,position,quality,cycle});cleanProject(exercise);assert(exercise.items.every(i=>inRange(i)));
 if(type==='cycle')assert.equal(new Set(exercise.items.map(i=>i.root)).size,12);
 if(type==='diatonic'){const roots=exercise.items.map(i=>48+i.root+i.oct*12);assert(roots.every((n,i)=>!i||n>roots[i-1]));assert.deepEqual(exercise.items.map(i=>byId[i.id].family),['major','minor','minor','major','dominant','minor','halfdim','major']);}
}
assert.deepEqual(notesFor({id:'VB_KBm',root:0,oct:0}),[48,55,62,63,70,77]);
assert.deepEqual(notesFor({id:'VB_HHm',root:0,oct:0}),[48,55,63,65,70,74]);
assert.equal((keyboardSvg({id:'G_major7_1753',root:0,oct:0}).match(/key-note-lh/g)||[]).length,2);
const legacy={id:'legacy',name:'Ancienne sauvegarde',tempo:80,items:[{id:'M08',root:0,oct:0,bass:false,beats:4},{id:'D09',root:7,oct:-1,bass:true,beats:4}]};
assert.deepEqual(cleanProject(legacy).items,legacy.items);
const exercise=buildStudy({type:'tritone',root:0});assert.deepEqual(exercise.items.map(i=>i.root),[2,7,0,2,1,0]);
const m=midiBytes(exercise.items,60);assert.equal(new TextDecoder().decode(m.slice(0,4)),'MThd');assert.deepEqual([...m.slice(-3)],[255,47,0]);
console.log('PASS · 296 formules, 3552 transpositions, 36 tétrades, 10 objectifs, cycles complets, registres, MIDI, compatibilité v1.');
