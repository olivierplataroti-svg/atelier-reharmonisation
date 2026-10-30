import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const qaDir=process.env.ATELIER_QA_DIR||os.tmpdir();fs.mkdirSync(qaDir,{recursive:true});
import {candidates,cleanMelody,demoMelody,propose,timeline} from '../dist/melody.js';
import {notesFor,midiBytes,cleanProject,chordName} from '../dist/core.js';
import {progressionPdf} from '../dist/pdf-export.js';
import {wavBytes} from '../dist/audio.js';
for(let m=48;m<=96;m++)for(const source of ['', 'schneider1']){const list=candidates(m,{source});assert(list.length);for(const i of list)assert.equal(notesFor(i).at(-1),m);}
const d=demoMelody();assert.deepEqual(d.events.map(e=>[e.start,e.duration]),[[0,2],[2,1],[3,1]]);assert.deepEqual(d.events.map(e=>notesFor(e.chord).at(-1)),[62,64,69]);
assert.throws(()=>cleanMelody({...d,events:[{midi:62,start:3,duration:2}]}));assert.throws(()=>cleanMelody({...d,events:[{midi:62,start:0,duration:2},{midi:64,start:1,duration:1}]}));assert.throws(()=>cleanMelody({...d,harmonies:undefined,events:[{...d.events[0],midi:61}]}));
for(const duration of [4,2,1,.5]){const count=8/duration,p=cleanMelody({...d,measures:2,harmonies:[],events:Array.from({length:count},(_,i)=>({midi:60+i%7,start:i*duration,duration}))});const h=propose(p);assert(h.events.every(e=>notesFor(e.chord).at(-1)===e.midi));assert.equal(Math.max(...timeline(h).map(e=>e.start+e.beats)),8);cleanProject({...h,items:h.events.map(e=>({...e.chord,beats:e.duration}))});}
const rest=cleanMelody({...d,harmonies:[],events:[{midi:62,start:1.5,duration:.5}]});assert.deepEqual(timeline(rest).map(e=>[e.start,e.beats]),[[1.5,.5],[3.5,.5]]);
const midi=midiBytes(timeline(d),60);assert.equal(new TextDecoder().decode(midi.slice(0,4)),'MThd');assert.deepEqual([...midi.slice(-3)],[255,47,0]);
const wav=wavBytes({numberOfChannels:2,length:3,sampleRate:44100,getChannelData:()=>new Float32Array([-1,0,1])});assert.equal(new TextDecoder().decode(wav.slice(0,4)),'RIFF');assert.equal(wav.length,56);
const pdf=progressionPdf({name:d.name,tempo:60,items:d.events.map(e=>({...e.chord,beats:e.duration})),melody:d});assert(new TextDecoder().decode(pdf).startsWith('%PDF-1.4'));fs.writeFileSync(path.join(qaDir,'melody-qa.pdf'),pdf);
const long=progressionPdf({name:'Pagination 16 croches',items:Array.from({length:16},()=>({...d.events[0].chord,beats:.5}))});fs.writeFileSync(path.join(qaDir,'melody-qa-long.pdf'),long);
console.log('PASS · hauteurs exactes 48–96, toutes durées, deux mesures, silences, propositions, import, MIDI, WAV et PDF.');
