import assert from 'node:assert/strict';
import {TEMPLATES,makeSickItem,notesFor,describeNotes,handSplitFor,chordName,cleanItem,cleanProject,keyboardSvg,midiBytes,inRange} from '../dist/core.js';
import {SICK_POSITIONS,SICK_CATEGORIES} from '../dist/sick.js';
import {buildStudy} from '../dist/study.js';

assert.equal(SICK_POSITIONS.length,129);
assert.deepEqual(SICK_POSITIONS.map(s=>s.number),Array.from({length:129},(_,i)=>i+1));
assert.equal(TEMPLATES.length,296);
assert.equal(TEMPLATES.filter(t=>t.id.startsWith('SC1_')).length,113);
assert.equal(TEMPLATES.filter(t=>!t.id.startsWith('SC1_')&&t.sickRefs.length).length,16);
for(const s of SICK_POSITIONS){
 assert(s.page>=1&&s.page<=12);
 for(let root=0;root<12;root++){
  const item=makeSickItem(s.number,root);
  assert.deepEqual(notesFor(item),s.notes.map(n=>n+root-(root>=9?12:0)),'notes '+s.number);
  assert.equal(handSplitFor(item),s.handSplit,'hands '+s.number);
  assert.equal(describeNotes(item).length,s.notes.length);
  assert.equal(chordName(item).slice(chordName(item).indexOf(s.suffix)),s.suffix);
  assert.deepEqual(cleanItem(item),item,'backup '+s.number);
  assert(inRange(item));assert(inRange(item,true));
 }
 const svg=keyboardSvg(makeSickItem(s.number,0));
 assert.equal((svg.match(/key-note-lh/g)||[]).length,s.handSplit,'keyboard hands '+s.number);
}
for(const category of Object.keys(SICK_CATEGORIES)){
 const rows=SICK_POSITIONS.filter(s=>s.category===category);
 for(const top of new Set(rows.map(s=>s.topDegree)))for(let root=0;root<12;root++){
  const p=cleanProject(buildStudy({type:'sickTop',root,sickCategory:category,sickTop:top}));
  assert.deepEqual(p.items.map(i=>i.sickNumber),rows.filter(s=>s.topDegree===top).map(s=>s.number));
  assert.equal(new Set(p.items.map(i=>notesFor(i).at(-1))).size,1,'same exact top pitch');
 }
}
for(const s of SICK_POSITIONS)for(const cycle of ['fourths','chromatic','whole']){
 const p=cleanProject(buildStudy({type:'sickCycle',root:0,sickNumber:s.number,cycle}));
 assert.equal(new Set(p.items.map(i=>i.root)).size,12);
 assert(p.items.every(i=>i.sickNumber===s.number));
}
assert.equal(makeSickItem(3,0).id,'M06');
assert.equal(handSplitFor(makeSickItem(3,0)),1,'source hands override tetrad 2+2');
assert.equal(handSplitFor(makeSickItem(4,0)),0,'right hand only');
assert.deepEqual(notesFor(makeSickItem(19,0)),[36,43,52,57,59,62,66]);
const n84=makeSickItem(84,0);
assert.equal(chordName(n84),'C13(b9,#9)');
assert.deepEqual(notesFor(n84),[52,58,61,63,69,72]);
assert(SICK_POSITIONS[83].notationNote.includes('sans ♯11'));
assert.throws(()=>cleanItem({...n84,sickNumber:1}),/Référence/);
assert.throws(()=>makeSickItem(130,0),/inconnue/);
const p=buildStudy({type:'sickTop',sickCategory:'minor7',sickTop:'11'});
const midi=midiBytes(p.items,60);assert.equal(new TextDecoder().decode(midi.slice(0,4)),'MThd');
console.log('PASS · 129 positions sources, 113 nouvelles formules, 16 fusions, notes et mains dans 12 tonalités, études, sauvegarde et MIDI.');
