import {SICK_POSITIONS} from './sick-data.js';
export {SICK_POSITIONS};
export const SICK_CATEGORIES={
 major7:{label:'Maj7 · majeur',family:'major'},
 dom7:{label:'Dom7 · dominante naturelle',family:'dominant'},
 dom7b13:{label:'Dom7♭13',family:'dominant'},
 dom7b9:{label:'Dom7♭9',family:'dominant'},
 dom7b9b13:{label:'Dom7♭9♭13',family:'dominant'},
 dom7sharp9:{label:'Dom7♯9',family:'dominant'},
 dom7sharp5sharp9:{label:'Dom7♯5♯9',family:'dominant'},
 minor7:{label:'m7 · mineur',family:'minor'}
};
export const TOP_DEGREES={'1':'Fondamentale','3':'Tierce majeure','b3':'Tierce mineure','5':'Quinte','#5':'Quinte augmentée / ♭13','b13':'Quinte augmentée / ♭13','7':'Septième majeure','b7':'Septième mineure','9':'Neuvième','b9':'Neuvième mineure','#9':'Neuvième augmentée','11':'Onzième','#11':'Onzième augmentée','13':'Treizième'};
const degreeKey=d=>{const num=Number(d.match(/\d+/)[0]);return d.replace(/\d+/,'')+((num-1)%7+1);};
const normal=t=>{const shift=Math.floor(t.intervals[0]/12);return t.intervals.map(n=>n-shift*12).join(',');};
// Deux degrés à l’octave (6/13, 2/9…) ont la même orthographe.
const sameShape=(a,b)=>a.family===b.family&&normal(a)===normal(b)&&a.degrees.map(degreeKey).join(',')===b.degrees.map(degreeKey).join(',');
export function enrichSickBank(bank){
 const result=bank.map(t=>({...t,sourceRefs:[...(t.sourceRefs||[])],sickRefs:[]}));
 for(const s of SICK_POSITIONS){
  const raw=s.notes.map(n=>n-48),shift=Math.floor(raw[0]/12),intervals=raw.map(n=>n-shift*12),family=SICK_CATEGORIES[s.category].family;
  const t={family,intervals,degrees:s.degrees};
  let match=result.find(x=>sameShape(x,t));
  if(!match){
   const style=!s.degrees.some(d=>d==='1')?'rootless':intervals.at(-1)-intervals[0]>16?'spread':'close';
   match={id:'SC1_'+String(s.number).padStart(3,'0'),label:`Sick Chords · position ${s.number}`,suffix:s.suffix,family,style,level:family==='dominant'&&s.category!=='dom7'||s.notes.length>=6?'avance':'intermediaire',intervals,degrees:s.degrees,handSplit:s.handSplit,sourceRefs:[],positions:[],sickRefs:[],comment:`Disposition relevée dans Sick Chords Vol. 1, rubrique ${SICK_CATEGORIES[s.category].label}. Chantez la voix supérieure, puis comparez les notes communes aux autres variantes de cette rubrique.`};
   result.push(match);
  }
  const oct=shift-Math.floor(match.intervals[0]/12);
  match.sickRefs.push({...s,oct});
  match.sourceRefs.push({id:'schneider1',page:`p. ${s.page} · position ${s.number} · ${SICK_CATEGORIES[s.category].label}`});
 }
 return result;
}
