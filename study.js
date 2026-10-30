import {TEMPLATES,PRESETS,makeItem,makeSickItem,pc,notesFor,rootName,byId} from './core.js';
import {POSITION_ORDERS,STUDY_QUALITIES} from './supplements.js';
import {SICK_POSITIONS,SICK_CATEGORIES,TOP_DEGREES} from './sick.js';
export {POSITION_ORDERS,STUDY_QUALITIES};
export const STUDY_TYPES={
 sickTop:{label:'Sick Chords · comparer un même sommet',help:'Choisissez une rubrique et un degré supérieur. Comparez les positions du volume : écoutez ce que changent les voix intérieures. La répartition des mains vient du relevé en Do, transposé dans la tonalité choisie. Les octaves sont ajustées pour garder exactement la même note au sommet.',source:'Jeff Schneider · Sick Chords Vol. 1, PDF fournis, positions et pages indiquées sur chaque fiche. Comparaison assemblée par l’atelier, octaves ajustées.'},
 sickCycle:{label:'Sick Chords · une position dans douze tonalités',help:'Gardez les mêmes intervalles et transposez une position du volume. Travaillez lentement, en chantant sa voix supérieure. Les douze tonalités sont documentées par les PDF fournis ; le registre de départ suit chaque partition.',source:'Jeff Schneider · Sick Chords Vol. 1. Ordre des tonalités et exercice générés par l’atelier.'},
 positions:{label:'Comparer les six dispositions',help:'Même fondamentale et même qualité : seule la disposition des voix change. Écoutez la note du sommet et répartissez les quatre voix sur les deux mains.',source:'Étienne Guéreau · trois fiches de positions.'},
 qualities:{label:'Comparer les qualités d’une tétrade',help:'Gardez une disposition et une fondamentale. Entendez les changements de tierce, de quinte et de septième ; la dernière qualité associe triade diminuée et septième majeure.',source:'Étienne Guéreau · connaissance de la tétrade ; extension des ordres aux six qualités.'},
 cycle:{label:'Une disposition dans les douze tonalités',help:'Apprenez une formule, puis transposez-la lentement. Commencez à 60 BPM ; cherchez la forme avant de lancer la lecture.',source:'Principes de transposition des fiches Guéreau et de Dan Haerle. Suite générée par l’atelier.'},
 diatonic:{label:'Harmoniser la gamme majeure',help:'La fondamentale monte dans la gamme majeure. La qualité de chaque accord change avec son degré : Imaj7, IIm7, IIIm7, IVmaj7, V7, VIm7, VIIm7♭5.',source:'The Voicings Book, p. 1 ; Dan Haerle, section Diatonic 7th Chords. Exemple original généré dans la tonalité choisie.'},
 cadence:{label:'II–V–I dans les douze tonalités',help:'Enchaînez les cadences et rapprochez les voix entre les accords. Les trois formes sont fixes ; la suite est transposée selon le cycle choisi.',source:'Dan Haerle · cycles et II–V–I ; exercices de l’atelier.'},
 tritone:{label:'Comparer V7 et sa substitution tritonique',help:'Comparez II–V–I puis II–♭II7–I. La fondamentale de la dominante substituée est un demi-ton au-dessus de la tonique ; son triton conserve les mêmes classes de notes guides.',source:'The Voicings Book, p. 10–11 ; Dan Haerle, Tri-Tone Sub II–V–I. Comparaison générée par l’atelier.'},
 three:{label:'Petites formes à trois voix',help:'Comparez deux dispositions majeures, deux dominantes et deux mineures sur une même fondamentale. La basse ajoutée rend la fonction explicite. Le bloc supérieur est volontairement allégé.',source:'Dan Haerle, coquilles enrichies, p. imprimées 6–9. Comparaison originale générée par l’atelier.'},
 open:{label:'II–V–I · deux dispositions ouvertes',help:'Comparez les positions ouvertes A et B, avec deux notes à chaque main. La même cadence est jouée deux fois ; la disposition change. La basse peut être ajoutée dans la progression.',source:'The Voicings Book, p. imprimée 19 / PDF 21. Exemple transposé et assemblé pour l’atelier.'}
};
export function positionTemplate(position,quality){return TEMPLATES.find(t=>t.qualityCode===quality&&t.positions?.includes(position));}
export function cycleRoots(root,cycle='fourths'){
 const offsets=cycle==='chromatic'?Array.from({length:12},(_,i)=>i):cycle==='whole'?[0,10,8,6,4,2,11,9,7,5,3,1]:Array.from({length:12},(_,i)=>i*5);
 return offsets.map(n=>pc(root+n));
}
function register(items,groupSize=1){const result=[];for(let start=0;start<items.length;start+=groupSize){const group=items.slice(start,start+groupSize).map(i=>({...i}));while(Math.max(...group.map(i=>notesFor(i).at(-1)))>84)group.forEach(i=>i.oct--);result.push(...group);}return result;}
export function buildStudy({type='positions',root=0,position='1357',quality='major7',cycle='fourths',sickCategory='major7',sickTop='9',sickNumber=13}={}){
 if(!STUDY_TYPES[type]||!POSITION_ORDERS.includes(position)||!STUDY_QUALITIES[quality]||!Number.isInteger(root)||root<0||root>11)throw Error('Paramètres d’étude invalides.');
 let items=[];
 if(type==='sickTop'){
  if(!SICK_CATEGORIES[sickCategory])throw Error('Rubrique Sick Chords invalide.');
  const rows=SICK_POSITIONS.filter(s=>s.category===sickCategory&&(!sickTop||s.topDegree===sickTop));
  if(!rows.length)throw Error('Aucune position pour ce sommet.');
  items=rows.map(s=>makeSickItem(s.number,root));
  if(sickTop){const target=Math.max(...items.map(i=>notesFor(i).at(-1)));items=items.map(i=>({...i,oct:i.oct+(target-notesFor(i).at(-1))/12}));}
 }
 if(type==='sickCycle')items=cycleRoots(root,cycle).map(r=>makeSickItem(sickNumber,r));
 if(type==='positions')items=POSITION_ORDERS.map(p=>makeItem(positionTemplate(p,quality).id,root));
 if(type==='qualities')items=Object.keys(STUDY_QUALITIES).map(q=>makeItem(positionTemplate(position,q).id,root));
 if(type==='cycle')items=cycleRoots(root,cycle).map(r=>makeItem(positionTemplate(position,quality).id,r));
 if(type==='diatonic')items=[0,2,4,5,7,9,11,12].map((n,i)=>makeItem(positionTemplate(position,['major7','minor7','minor7','major7','dominant7','minor7','halfdim','major7'][i]).id,pc(root+n),{oct:Math.floor((root+n)/12)}));
 if(type==='cadence')items=cycleRoots(root,cycle).flatMap(r=>PRESETS[0].items.map(i=>{const n=i.root+r;return {...i,root:pc(n),oct:i.oct+Math.floor(n/12)};}));
 if(type==='tritone')items=[makeItem('m08',pc(root+2)),makeItem('D09',pc(root+7),{oct:-1}),makeItem('M08',root),makeItem('m08',pc(root+2)),makeItem('D20',pc(root+1)),makeItem('M08',root)];
 if(type==='three')items=['HA03','HA06','HA04','HA07','HA05','HA08'].map(id=>makeItem(id,root,{bass:true}));
 if(type==='open')items=[makeItem('VB_OmA',pc(root+2)),makeItem('VB_ODA',pc(root+7),{oct:-1}),makeItem('VB_OMA',root),makeItem('VB_OmB',pc(root+2),{oct:-1}),makeItem('VB_ODB',pc(root+7),{oct:-1}),makeItem('VB_OMB',root,{oct:-1})];
 const groupSize=['positions','qualities','diatonic'].includes(type)?items.length:['cadence','open','tritone'].includes(type)?3:1;
 const detail=type==='sickTop'?` · ${SICK_CATEGORIES[sickCategory].label} · ${TOP_DEGREES[sickTop]||'tous les sommets'}`:type==='sickCycle'?` · n°${sickNumber}`:'';
 return {name:`${STUDY_TYPES[type].label}${detail} · ${rootName(root)}`,items:type.startsWith('sick')?items:register(items,groupSize),tempo:60,globalBass:false,loop:false};
}
