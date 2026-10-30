// Concepts vérifiés dans les PDF fournis ; rédaction et exercices propres à l'atelier.
export const POSITION_ORDERS=['1357','1375','1537','1573','1735','1753'];
export const STUDY_QUALITIES={
 major7:{label:'Majeur 7',suffix:'maj7',family:'major',values:{1:0,3:4,5:7,7:11},degrees:{1:'1',3:'3',5:'5',7:'7'}},
 dominant7:{label:'Dominante 7',suffix:'7',family:'dominant',values:{1:0,3:4,5:7,7:10},degrees:{1:'1',3:'3',5:'5',7:'b7'}},
 minor7:{label:'Mineur 7',suffix:'m7',family:'minor',values:{1:0,3:3,5:7,7:10},degrees:{1:'1',3:'b3',5:'5',7:'b7'}},
 halfdim:{label:'Demi-diminué',suffix:'m7(b5)',family:'halfdim',values:{1:0,3:3,5:6,7:10},degrees:{1:'1',3:'b3',5:'b5',7:'b7'}},
 dim7:{label:'Diminué 7',suffix:'dim7',family:'diminished',values:{1:0,3:3,5:6,7:9},degrees:{1:'1',3:'b3',5:'b5',7:'bb7'}},
 dimmaj7:{label:'Diminué à septième majeure',suffix:'dim(maj7)',family:'diminished',values:{1:0,3:3,5:6,7:11},degrees:{1:'1',3:'b3',5:'b5',7:'7'}}
};
export const DOCUMENT_SOURCES={
 schneider1:{label:'Sick Chords Vol. 1',title:'Sick Chords Vol. 1 · Jeff Schneider, 2017',detail:'Douze PDF fournis : Do, Ré♭, Ré, Mi♭, Mi, Fa, Sol♭, Sol, La♭, La, Si♭ et Si, 12 pages chacun. Les 129 positions sont numérotées de 1 à 129, regroupées en huit rubriques par famille et note supérieure. La banque fusionne les formules déjà présentes ; le filtre de cette source et les exercices conservent les intervalles et la répartition des portées du relevé en Do, transposés au registre de chaque PDF. Les PDF en La, Si♭ et Si utilisent un registre une octave sous la transposition ascendante depuis Do. L’orthographe fonctionnelle des notes peut différer de certaines enharmonies gravées. Les notes et portées ont été vérifiées visuellement et par leurs coordonnées. Le n°84 conserve les notes écrites malgré un symbole discordant, signalé dans sa fiche.'},
 guereau:{label:'Étienne Guéreau · tétrades',title:'Connaissance de la tétrade et fiches de positions',detail:'Trois documents fournis : 1357/1375 (3 pages), 1537/1573 (2 pages), 1735/1753 (2 pages). Ordres des voix du grave à l’aigu ; formules transposées et exercices générés pour cet atelier.'},
 docnaud:{label:'The Voicings Book',title:'The Voicings Book · 3e édition',detail:'Document docnaud.prod, 2015, fourni par l’utilisateur. Repères de pages imprimées indiqués pour les dispositions étudiées ; les deux numérotations sont précisées dans chaque référence car leur décalage varie dans le document.'},
 haerle:{label:'Dan Haerle',title:'Jazz Piano Voicing Skills · Dan Haerle',detail:'Jamey Aebersold Jazz, 1994, document fourni par l’utilisateur. Les pages imprimées correspondent aux pages PDF moins 3. Exercices de l’atelier générés à partir des principes de travail, sans reprendre la mise en page de l’ouvrage.'}
};
export const EXTRA_VOICINGS=[
 {
  "label": "Mineur ouvert, deux piles de quintes",
  "suffix": "m11",
  "family": "minor",
  "style": "spread",
  "level": "avance",
  "intervals": [
   0,
   7,
   14,
   15,
   22,
   29
  ],
  "degrees": [
   "1",
   "5",
   "9",
   "b3",
   "b7",
   "11"
  ],
  "comment": "Disposition appelée « Kenny Barron » dans le document. Deux piles de quintes : 1–5–9 et b3–b7–11. Répartir 3 notes par main.",
  "id": "VB_KBm",
  "handSplit": 3,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 27 · PDF 29"
  }
 },
 {
  "label": "Mineur ouvert, tierce dans la main gauche",
  "suffix": "m11",
  "family": "minor",
  "style": "spread",
  "level": "avance",
  "intervals": [
   0,
   7,
   15,
   17,
   22,
   26
  ],
  "degrees": [
   "1",
   "5",
   "b3",
   "11",
   "b7",
   "9"
  ],
  "comment": "Disposition appelée « Herbie Hancock » dans le document. Main gauche : fondamentale, quinte, tierce mineure ; main droite : onzième, septième mineure, neuvième.",
  "id": "VB_HHm",
  "handSplit": 3,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 27 · PDF 29"
  }
 },
 {
  "label": "Lydien, deux notes de basse et cluster supérieur",
  "suffix": "maj7(#11)",
  "family": "major",
  "style": "spread",
  "level": "avance",
  "intervals": [
   0,
   7,
   16,
   18,
   23
  ],
  "degrees": [
   "1",
   "5",
   "3",
   "#11",
   "7"
  ],
  "comment": "Le rapprochement de la tierce et de #11 colore le bloc supérieur ; le registre grave reste ouvert.",
  "id": "VB_LY1",
  "handSplit": 2,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 29 · PDF 31"
  }
 },
 {
  "label": "Lydien ouvert en deux piles de quintes",
  "suffix": "maj9(#11)",
  "family": "major",
  "style": "spread",
  "level": "avance",
  "intervals": [
   0,
   7,
   14,
   16,
   23,
   30
  ],
  "degrees": [
   "1",
   "5",
   "9",
   "3",
   "7",
   "#11"
  ],
  "comment": "Variante majeure lydienne de la disposition en quintes, dite « Kenny Barron lydien » dans le document.",
  "id": "VB_LY2",
  "handSplit": 3,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 29 · PDF 31"
  }
 },
 {
  "label": "Mineur neuvième ouvert A",
  "suffix": "m9",
  "family": "minor",
  "style": "rootless",
  "level": "intermediaire",
  "intervals": [
   3,
   10,
   14,
   19
  ],
  "degrees": [
   "b3",
   "b7",
   "9",
   "5"
  ],
  "comment": "Ouverture d’une position sans fondamentale : deux notes guides à gauche, deux couleurs à droite. Jouer sur deux mains ou avec une basse extérieure.",
  "id": "VB_OmA",
  "handSplit": 2,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 19 · PDF 21"
  }
 },
 {
  "label": "Mineur neuvième ouvert B",
  "suffix": "m9",
  "family": "minor",
  "style": "rootless",
  "level": "intermediaire",
  "intervals": [
   10,
   15,
   19,
   26
  ],
  "degrees": [
   "b7",
   "b3",
   "5",
   "9"
  ],
  "comment": "Ouverture d’une position sans fondamentale : deux notes guides à gauche, deux couleurs à droite. Jouer sur deux mains ou avec une basse extérieure.",
  "id": "VB_OmB",
  "handSplit": 2,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 19 · PDF 21"
  }
 },
 {
  "label": "Majeur neuvième ouvert A",
  "suffix": "maj9",
  "family": "major",
  "style": "rootless",
  "level": "intermediaire",
  "intervals": [
   4,
   11,
   14,
   19
  ],
  "degrees": [
   "3",
   "7",
   "9",
   "5"
  ],
  "comment": "Ouverture d’une position sans fondamentale : deux notes guides à gauche, deux couleurs à droite. Jouer sur deux mains ou avec une basse extérieure.",
  "id": "VB_OMA",
  "handSplit": 2,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 19 · PDF 21"
  }
 },
 {
  "label": "Majeur neuvième ouvert B",
  "suffix": "maj9",
  "family": "major",
  "style": "rootless",
  "level": "intermediaire",
  "intervals": [
   11,
   16,
   19,
   26
  ],
  "degrees": [
   "7",
   "3",
   "5",
   "9"
  ],
  "comment": "Ouverture d’une position sans fondamentale : deux notes guides à gauche, deux couleurs à droite. Jouer sur deux mains ou avec une basse extérieure.",
  "id": "VB_OMB",
  "handSplit": 2,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 19 · PDF 21"
  }
 },
 {
  "label": "Dominante treizième ouverte A",
  "suffix": "13",
  "family": "dominant",
  "style": "rootless",
  "level": "intermediaire",
  "intervals": [
   10,
   16,
   21,
   26
  ],
  "degrees": [
   "b7",
   "3",
   "13",
   "9"
  ],
  "comment": "Ouverture d’une position sans fondamentale : deux notes guides à gauche, deux couleurs à droite. Jouer sur deux mains ou avec une basse extérieure.",
  "id": "VB_ODA",
  "handSplit": 2,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 19 · PDF 21"
  }
 },
 {
  "label": "Dominante treizième ouverte B",
  "suffix": "13",
  "family": "dominant",
  "style": "rootless",
  "level": "intermediaire",
  "intervals": [
   4,
   10,
   14,
   21
  ],
  "degrees": [
   "3",
   "b7",
   "9",
   "13"
  ],
  "comment": "Ouverture d’une position sans fondamentale : deux notes guides à gauche, deux couleurs à droite. Jouer sur deux mains ou avec une basse extérieure.",
  "id": "VB_ODB",
  "handSplit": 2,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 19 · PDF 21"
  }
 },
 {
  "label": "Superstructure majeure sur bIII",
  "suffix": "7(#9)",
  "family": "dominant",
  "style": "upper",
  "level": "avance",
  "intervals": [
   4,
   10,
   15,
   19,
   22
  ],
  "degrees": [
   "3",
   "b7",
   "#9",
   "5",
   "b7"
  ],
  "comment": "Triade majeure sur bIII au-dessus du triton ; l’orthographe des notes affichées suit leur fonction dans l’accord de dominante.",
  "id": "VB_UbIII",
  "handSplit": 2,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 41 · PDF 43"
  }
 },
 {
  "label": "Superstructure majeure sur VI",
  "suffix": "13(b9)",
  "family": "dominant",
  "style": "upper",
  "level": "avance",
  "intervals": [
   4,
   10,
   21,
   25,
   28
  ],
  "degrees": [
   "3",
   "b7",
   "13",
   "b9",
   "3"
  ],
  "comment": "Triade majeure sur VI au-dessus du triton : treizième naturelle et neuvième diminuée.",
  "id": "VB_UVI",
  "handSplit": 2,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 41 · PDF 43"
  }
 },
 {
  "label": "Superstructure mineure sur I",
  "suffix": "7(#9)",
  "family": "dominant",
  "style": "upper",
  "level": "avance",
  "intervals": [
   4,
   10,
   12,
   15,
   19
  ],
  "degrees": [
   "3",
   "b7",
   "1",
   "#9",
   "5"
  ],
  "comment": "Triade mineure sur la fondamentale, posée au-dessus du triton majeur : couleur #9.",
  "id": "VB_UIm",
  "handSplit": 2,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 41 · PDF 43"
  }
 },
 {
  "label": "Superstructure mineure sur #IV",
  "suffix": "13(b9,#11)",
  "family": "dominant",
  "style": "upper",
  "level": "avance",
  "intervals": [
   4,
   10,
   18,
   21,
   25
  ],
  "degrees": [
   "3",
   "b7",
   "#11",
   "13",
   "b9"
  ],
  "comment": "Triade mineure sur #IV au-dessus du triton : #11, 13 et b9.",
  "id": "VB_UsharpIVm",
  "handSplit": 2,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 41 · PDF 43"
  }
 },
 {
  "label": "Block chord majeur sixte, mélodie doublée",
  "suffix": "6",
  "family": "major",
  "style": "block",
  "level": "intermediaire",
  "intervals": [
   0,
   4,
   7,
   9,
   12
  ],
  "degrees": [
   "1",
   "3",
   "5",
   "6",
   "1"
  ],
  "comment": "Exemple statique d’harmonisation en bloc : quatre voix serrées et mélodie doublée une octave plus bas. Le style complet suppose aussi des accords de passage et une conduite parallèle.",
  "id": "VB_BC6",
  "handSplit": 1,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 49 · PDF 50"
  }
 },
 {
  "label": "Block chord mineur sixte, mélodie doublée",
  "suffix": "m6",
  "family": "minor",
  "style": "block",
  "level": "intermediaire",
  "intervals": [
   0,
   3,
   7,
   9,
   12
  ],
  "degrees": [
   "1",
   "b3",
   "5",
   "6",
   "1"
  ],
  "comment": "Exemple statique d’harmonisation en bloc : quatre voix serrées et mélodie doublée une octave plus bas. Le style complet suppose aussi des accords de passage et une conduite parallèle.",
  "id": "VB_BCm6",
  "handSplit": 1,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 49 · PDF 50"
  }
 },
 {
  "label": "Block chord mineur septième, mélodie doublée",
  "suffix": "m7",
  "family": "minor",
  "style": "block",
  "level": "intermediaire",
  "intervals": [
   0,
   3,
   7,
   10,
   12
  ],
  "degrees": [
   "1",
   "b3",
   "5",
   "b7",
   "1"
  ],
  "comment": "Exemple statique d’harmonisation en bloc : quatre voix serrées et mélodie doublée une octave plus bas. Le style complet suppose aussi des accords de passage et une conduite parallèle.",
  "id": "VB_BCm7",
  "handSplit": 1,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 49 · PDF 50"
  }
 },
 {
  "label": "Block chord dominante, mélodie doublée",
  "suffix": "7",
  "family": "dominant",
  "style": "block",
  "level": "intermediaire",
  "intervals": [
   0,
   4,
   7,
   10,
   12
  ],
  "degrees": [
   "1",
   "3",
   "5",
   "b7",
   "1"
  ],
  "comment": "Exemple statique d’harmonisation en bloc : quatre voix serrées et mélodie doublée une octave plus bas. Le style complet suppose aussi des accords de passage et une conduite parallèle.",
  "id": "VB_BC7",
  "handSplit": 1,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 49 · PDF 50"
  }
 },
 {
  "label": "Sixte en block chord drop 2",
  "suffix": "6",
  "family": "major",
  "style": "block",
  "level": "intermediaire",
  "intervals": [
   9,
   16,
   19,
   24
  ],
  "degrees": [
   "6",
   "3",
   "5",
   "1"
  ],
  "comment": "Le deuxième son en partant du haut de l’accord serré descend d’une octave ; la mélodie reste au sommet.",
  "id": "VB_BD6",
  "handSplit": 1,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 50 · PDF 51"
  }
 },
 {
  "label": "Mineur sixte en block chord drop 2",
  "suffix": "m6",
  "family": "minor",
  "style": "block",
  "level": "intermediaire",
  "intervals": [
   9,
   15,
   19,
   24
  ],
  "degrees": [
   "6",
   "b3",
   "5",
   "1"
  ],
  "comment": "Le deuxième son en partant du haut de l’accord serré descend d’une octave ; la mélodie reste au sommet.",
  "id": "VB_BDm6",
  "handSplit": 1,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 50 · PDF 51"
  }
 },
 {
  "label": "Mineur septième en block chord drop 2",
  "suffix": "m7",
  "family": "minor",
  "style": "block",
  "level": "intermediaire",
  "intervals": [
   10,
   15,
   19,
   24
  ],
  "degrees": [
   "b7",
   "b3",
   "5",
   "1"
  ],
  "comment": "Le deuxième son en partant du haut de l’accord serré descend d’une octave ; la mélodie reste au sommet.",
  "id": "VB_BDm7",
  "handSplit": 1,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 50 · PDF 51"
  }
 },
 {
  "label": "Dominante en block chord drop 2",
  "suffix": "7",
  "family": "dominant",
  "style": "block",
  "level": "intermediaire",
  "intervals": [
   10,
   16,
   19,
   24
  ],
  "degrees": [
   "b7",
   "3",
   "5",
   "1"
  ],
  "comment": "Le deuxième son en partant du haut de l’accord serré descend d’une octave ; la mélodie reste au sommet.",
  "id": "VB_BD7",
  "handSplit": 1,
  "sourceRef": {
   "id": "docnaud",
   "page": "p. imprimée 50 · PDF 51"
  }
 },
 {
  "id": "HA01",
  "label": "Trois voix : 3–6–9 majeur",
  "suffix": "6/9",
  "family": "major",
  "style": "rootless",
  "level": "essentiel",
  "intervals": [
   4,
   9,
   14
  ],
  "degrees": [
   "3",
   "6",
   "9"
  ],
  "comment": "Une petite forme sans septième : écouter la douceur de la sixte et placer la fondamentale séparément.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 6 · PDF 9 · application du principe"
  }
 },
 {
  "id": "HA02",
  "label": "Trois voix : b3–6–9 mineur",
  "suffix": "m6/9",
  "family": "minor",
  "style": "rootless",
  "level": "intermediaire",
  "intervals": [
   3,
   9,
   14
  ],
  "degrees": [
   "b3",
   "6",
   "9"
  ],
  "comment": "La sixte majeure distingue cette couleur d’une simple triade mineure.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 6 · PDF 9 · application du principe"
  }
 },
 {
  "id": "HA03",
  "label": "Trois voix : 3–7–9 majeur",
  "suffix": "maj9",
  "family": "major",
  "style": "rootless",
  "level": "essentiel",
  "intervals": [
   4,
   11,
   14
  ],
  "degrees": [
   "3",
   "7",
   "9"
  ],
  "comment": "La quinte est omise ; la septième majeure et la neuvième restent audibles.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 7 · PDF 10 · application du principe"
  }
 },
 {
  "id": "HA04",
  "label": "Trois voix : 3–b7–9 dominante",
  "suffix": "9",
  "family": "dominant",
  "style": "rootless",
  "level": "essentiel",
  "intervals": [
   4,
   10,
   14
  ],
  "degrees": [
   "3",
   "b7",
   "9"
  ],
  "comment": "Le triton situe la dominante et la neuvième apporte la couleur.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 7 · PDF 10 · application du principe"
  }
 },
 {
  "id": "HA05",
  "label": "Trois voix : b3–b7–9 mineur",
  "suffix": "m9",
  "family": "minor",
  "style": "rootless",
  "level": "essentiel",
  "intervals": [
   3,
   10,
   14
  ],
  "degrees": [
   "b3",
   "b7",
   "9"
  ],
  "comment": "Une forme compacte qui conserve les deux notes caractéristiques du mineur septième.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 8 · PDF 11 · application du principe"
  }
 },
 {
  "id": "HA06",
  "label": "Trois voix : 7–3–5 majeur",
  "suffix": "maj7",
  "family": "major",
  "style": "rootless",
  "level": "essentiel",
  "intervals": [
   11,
   16,
   19
  ],
  "degrees": [
   "7",
   "3",
   "5"
  ],
  "comment": "Commencer sur la septième permet souvent de rejoindre l’accord voisin avec peu de déplacement.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 8 · PDF 11 · application du principe"
  }
 },
 {
  "id": "HA07",
  "label": "Trois voix : b7–3–5 dominante",
  "suffix": "7",
  "family": "dominant",
  "style": "rootless",
  "level": "essentiel",
  "intervals": [
   10,
   16,
   19
  ],
  "degrees": [
   "b7",
   "3",
   "5"
  ],
  "comment": "La septième est en bas du bloc supérieur ; ajouter une fondamentale séparée pour entendre la fonction.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 9 · PDF 12 · application du principe"
  }
 },
 {
  "id": "HA08",
  "label": "Trois voix : b7–b3–5 mineur",
  "suffix": "m7",
  "family": "minor",
  "style": "rootless",
  "level": "essentiel",
  "intervals": [
   10,
   15,
   19
  ],
  "degrees": [
   "b7",
   "b3",
   "5"
  ],
  "comment": "Complément du mineur avec tierce en bas : alterner les deux dispositions à l’oreille.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 9 · PDF 12 · application du principe"
  }
 },
 {
  "id": "HA09",
  "label": "Trois voix : b7–b3–b5",
  "suffix": "m7(b5)",
  "family": "halfdim",
  "style": "rootless",
  "level": "intermediaire",
  "intervals": [
   10,
   15,
   18
  ],
  "degrees": [
   "b7",
   "b3",
   "b5"
  ],
  "comment": "La quinte diminuée au sommet prépare bien un II–V mineur.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 10 · PDF 13 · application du principe"
  }
 },
 {
  "id": "HA10",
  "label": "Trois voix : b7–3–13 dominante",
  "suffix": "13",
  "family": "dominant",
  "style": "rootless",
  "level": "intermediaire",
  "intervals": [
   10,
   16,
   21
  ],
  "degrees": [
   "b7",
   "3",
   "13"
  ],
  "comment": "Une dominante lumineuse à trois voix, sans quinte ni neuvième.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 11 · PDF 14 · application du principe"
  }
 },
 {
  "id": "HA11",
  "label": "Trois voix : b7–b3–13 dorien",
  "suffix": "m13",
  "family": "minor",
  "style": "rootless",
  "level": "intermediaire",
  "intervals": [
   10,
   15,
   21
  ],
  "degrees": [
   "b7",
   "b3",
   "13"
  ],
  "comment": "La treizième naturelle introduit une couleur dorienne dans le bloc mineur.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 11 · PDF 14 · application du principe"
  }
 },
 {
  "id": "HA12",
  "label": "Trois voix : 4–b7–9 suspendu",
  "suffix": "9sus4",
  "family": "sus",
  "style": "rootless",
  "level": "essentiel",
  "intervals": [
   5,
   10,
   14
  ],
  "degrees": [
   "4",
   "b7",
   "9"
  ],
  "comment": "La tierce est absente ; écouter la suspension sans la résoudre immédiatement.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 12 · PDF 15 · application du principe"
  }
 },
 {
  "id": "HA13",
  "label": "Quatre voix : b7–9–4–13",
  "suffix": "13sus4",
  "family": "sus",
  "style": "rootless",
  "level": "intermediaire",
  "intervals": [
   10,
   14,
   17,
   21
  ],
  "degrees": [
   "b7",
   "9",
   "4",
   "13"
  ],
  "comment": "Un accord suspendu fluide, avec treizième mélodique.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 12 · PDF 15 · application du principe"
  }
 },
 {
  "id": "HA14",
  "label": "So What sur la tierce majeure",
  "suffix": "maj13",
  "family": "major",
  "style": "quartal",
  "level": "intermediaire",
  "intervals": [
   4,
   9,
   14,
   19,
   23
  ],
  "degrees": [
   "3",
   "13",
   "9",
   "5",
   "7"
  ],
  "comment": "La même géométrie quartale peut prendre une couleur majeure selon la basse.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 55, 57, 58 · PDF 58, 60, 61 · application du principe"
  }
 },
 {
  "id": "HA15",
  "label": "So What lydien sur la septième",
  "suffix": "maj13(#11)",
  "family": "major",
  "style": "quartal",
  "level": "avance",
  "intervals": [
   11,
   16,
   21,
   26,
   30
  ],
  "degrees": [
   "7",
   "3",
   "13",
   "9",
   "#11"
  ],
  "comment": "Trois quartes puis une tierce majeure ; la #11 distingue ici la couleur lydienne.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 55, 57, 58 · PDF 58, 60, 61 · application du principe"
  }
 },
 {
  "id": "HA16",
  "label": "Triade majeure sur VI et triton",
  "suffix": "13(b9)",
  "family": "dominant",
  "style": "upper",
  "level": "avance",
  "intervals": [
   0,
   4,
   10,
   21,
   25,
   28
  ],
  "degrees": [
   "1",
   "3",
   "b7",
   "13",
   "b9",
   "3"
  ],
  "comment": "En Do, le bloc supérieur La–Do♯–Mi apporte 13 et b9 au-dessus de Do–Mi–Si♭.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 135, 138 · PDF 138, 141 · application du principe"
  },
  "handSplit": 3
 },
 {
  "id": "HA17",
  "label": "Triade mineure sur le triton",
  "suffix": "13(b5,b9)",
  "family": "dominant",
  "style": "upper",
  "level": "avance",
  "intervals": [
   0,
   4,
   10,
   18,
   21,
   25
  ],
  "degrees": [
   "1",
   "3",
   "b7",
   "b5",
   "13",
   "b9"
  ],
  "comment": "En Do, Fa♯–La–Do♯ ajoute quinte diminuée, treizième et neuvième diminuée.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 135, 139 · PDF 138, 142 · application du principe"
  },
  "handSplit": 3
 },
 {
  "id": "HA18",
  "label": "Triade majeure sur bIII",
  "suffix": "7(#9)",
  "family": "dominant",
  "style": "upper",
  "level": "avance",
  "intervals": [
   0,
   4,
   10,
   15,
   19,
   22
  ],
  "degrees": [
   "1",
   "3",
   "b7",
   "#9",
   "5",
   "b7"
  ],
  "comment": "Une triade majeure sur le troisième degré abaissé fait entendre la neuvième augmentée.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 135, 136 · PDF 138, 139 · application du principe"
  },
  "handSplit": 3
 },
 {
  "id": "HA19",
  "label": "Triade majeure sur bVI",
  "suffix": "7(#5,#9)",
  "family": "dominant",
  "style": "upper",
  "level": "avance",
  "intervals": [
   0,
   4,
   10,
   20,
   24,
   27
  ],
  "degrees": [
   "1",
   "3",
   "b7",
   "#5",
   "1",
   "#9"
  ],
  "comment": "La quinte augmentée et la neuvième augmentée colorent une dominante qui appelle sa résolution.",
  "sourceRef": {
   "id": "haerle",
   "page": "p. imprimée 135, 137 · PDF 138, 140 · application du principe"
  },
  "handSplit": 3
 }
];
export function enrichBank(bank){
 const result=bank.map(t=>({...t,sourceRefs:[],positions:[]}));
 function merge(t){let match=result.find(x=>x.family===t.family&&x.suffix===t.suffix&&x.intervals.join(',')===t.intervals.join(','));
  if(!match){match={...t,sourceRefs:[],positions:[]};result.push(match);}
  if(t.sourceRef&&!match.sourceRefs.some(x=>x.id===t.sourceRef.id&&x.page===t.sourceRef.page))match.sourceRefs.push(t.sourceRef);
  if(t.positionCode){match.positions.push(t.positionCode);match.qualityCode=t.qualityCode;match.handSplit=2;}
  if(t.handSplit)match.handSplit=t.handSplit;
  return match;
 }
 for(const [qualityCode,q] of Object.entries(STUDY_QUALITIES))for(const order of POSITION_ORDERS){
  const intervals=[],degrees=[];for(const raw of order){let n=q.values[raw];while(intervals.length&&n<=intervals.at(-1))n+=12;intervals.push(n);degrees.push(q.degrees[raw]);}
  const page=order==='1357'||order==='1375'?'Fiche 1357/1375, p. 1–3':order==='1537'||order==='1573'?'Fiche 1537/1573, p. 1–2':'Fiche 1735/1753, p. 1–2';
  merge({id:`G_${qualityCode}_${order}`,label:`Tétrade · position ${order}`,suffix:q.suffix,family:q.family,style:order==='1357'?'close':'spread',level:order==='1357'?'essentiel':'intermediaire',intervals,degrees,positionCode:order,qualityCode,handSplit:2,sourceRef:{id:'guereau',page},comment:`Ordre des degrés du grave à l’aigu : ${degrees.join(' – ')}. Deux notes par main pour comparer cette disposition aux cinq autres. ${qualityCode==='dimmaj7'?'La septième est majeure au-dessus de la triade diminuée ; l’ordre des voix est ici étendu aux six dispositions.':'Les altérations changent avec la qualité de l’accord, l’ordre des voix reste le même.'}`});
 }
 for(const t of EXTRA_VOICINGS)merge(t);
 return result;
}
