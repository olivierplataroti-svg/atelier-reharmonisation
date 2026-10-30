import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {cleanMelody,groupedDemo,setHarmony,propose,timeline,candidates,demoMelody,harmonyAt} from '../dist/melody.js';
import {midiBytes,notesFor,cleanProject} from '../dist/core.js';
import {SequencePlayer} from '../dist/audio.js';
import {progressionPdf} from '../dist/pdf-export.js';
const grouped=groupedDemo(),old=demoMelody();
assert.equal(old.harmonies.length,3);assert.deepEqual(cleanMelody(JSON.parse(JSON.stringify(grouped))),grouped);
assert.equal(grouped.events.length,4);assert.equal(grouped.harmonies.length,2);assert.equal(harmonyAt(grouped,0),harmonyAt(grouped,1));
const changed=cleanMelody({...grouped,events:grouped.events.map((e,i)=>i===1?{...e,midi:70}:e)});assert.deepEqual(changed.harmonies,grouped.harmonies);
const extended=setHarmony(old,0,4,old.harmonies[0].chord);assert.equal(extended.harmonies.length,1);assert.equal(extended.harmonies[0].duration,4);
const split=setHarmony(grouped,1,.5,old.harmonies[1].chord);assert.deepEqual(split.harmonies.map(h=>[h.start,h.duration]),[[0,1],[1,.5],[1.5,.5],[2,2]]);
assert.throws(()=>setHarmony(grouped,3,2,old.harmonies[0].chord));
assert.equal(candidates(62,{free:true}).length,3552);assert(candidates(62,{free:true}).some(i=>notesFor(i).at(-1)!==62));
assert.deepEqual(propose(grouped).harmonies.map(h=>[h.start,h.duration]),[[0,2],[2,2]]);
const plan=timeline(grouped);assert.deepEqual(plan.filter(e=>e.channel===1).map(e=>[e.start,e.beats]),[[0,2],[2,2]]);assert.deepEqual(plan.filter(e=>e.channel===0).map(e=>[e.start,e.beats]),[[0,1],[1,1],[2,1],[3,1]]);
assert.equal(Math.max(...plan.map(e=>e.start+e.beats)),4);assert.equal(timeline(grouped,'melody').filter(e=>e.channel===1).length,0);
cleanProject({items:split.harmonies.map(h=>({...h.chord,beats:h.duration}))});
// Decode MIDI events to verify independent attacks and channels, not just the header.
const bytes=midiBytes(plan,60);let p=22,tick=0,events=[];const vlq=()=>{let n=0,b;do{b=bytes[p++];n=(n<<7)|(b&127);}while(b&128);return n;};
while(p<bytes.length){tick+=vlq();const status=bytes[p++];if(status===255){const type=bytes[p++],length=vlq();p+=length;if(type===47)break;}else{const n=bytes[p++];if((status&240)!==192){const vel=bytes[p++];events.push({tick,status,n,vel});}}}
assert.equal(tick,1920);assert.deepEqual([...new Set(events.filter(e=>e.status===145).map(e=>e.tick))],[0,960]);assert.deepEqual(events.filter(e=>e.status===144).map(e=>e.tick),[0,480,960,1440]);
assert(events.some(e=>e.status===129&&e.tick===960));
const calls=[],ctx={currentTime:0};const piano={ctx,init:async()=>{},hush:()=>{},playChord:(notes,options)=>{if(notes.length)calls.push({notes,...options});}};
const player=new SequencePlayer(piano,()=>{},()=>{});await player.play(plan,60,false,false);ctx.currentTime=1.1;player.tick();assert.equal(calls.filter(c=>c.notes.length>1).length,1);assert.equal(calls.filter(c=>c.notes.length===1).length,2);assert(Math.abs(calls.find(c=>c.notes.length>1).duration-1.92)<.01);ctx.currentTime=2.1;player.tick();assert.equal(calls.filter(c=>c.notes.length>1).length,2);player.pause();await player.play(plan,60,false,false);player.stop();
const pdf=progressionPdf({name:grouped.name,tempo:60,items:grouped.harmonies.map(h=>({...h.chord,beats:h.duration})),melody:grouped});fs.writeFileSync(path.join(process.env.ATELIER_QA_DIR||os.tmpdir(),'accords-independants-qa.pdf'),pdf);
console.log('PASS · deux noires/un accord blanc, édition indépendante, tenue sans réattaque, canaux MIDI, pause, migration v1, fractionnement, recherche libre, PDF.');
