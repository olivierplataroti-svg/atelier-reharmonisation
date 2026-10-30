# Atelier Réharmonisation

Application statique en français, conçue pour le piano et les écrans tactiles.

296 formules documentées transposées sur 12 fondamentales (3 552 positions). Recherche par accord ou voix supérieure, écoute d'enregistrements de piano acoustique, arpèges, basse, octaves, progression, tempo, durées, lecture/pause/boucle, favoris, carnet local, import/export JSON, MIDI et impression avec claviers.

Les ressources publiques de Jeff Schneider et Open Studio sont référencées dans l'écran Repères & sources. Le socle indépendant est complété par 129 positions référencées du volume Sick Chords Vol. 1 fourni par l’utilisateur. La totalité du catalogue commercial et des autres volumes n’est pas couverte. La transcription de la vidéo de référence n'a pas pu être téléchargée ; aucun accès exhaustif à ce contenu n'est revendiqué.

Les échantillons Salamander Grand Piano v3 sont d'Alexander Holm, sous CC BY 3.0, distribués en MP3 par Tone.js. Les notes intermédiaires sont transposées à la lecture ; enveloppe et mixage sont appliqués dans l'application. Les crédits sont conservés dans le site.

Les données sont locales au navigateur. Le fichier JSON permet le transfert entre appareils. Le navigateur doit permettre Web Audio ; la première lecture charge les échantillons. Aucune dépendance JavaScript externe n'est requise.

Le dossier `dist/` contient l’intégralité de l’application prête à servir. Ce dépôt reprend la version publiée du Site Atelier Réharmonisation (source `5b21f5e6724e9aaba1e0f779689aabc452e7b266`), y compris le rythme harmonique indépendant.

## Lancer l’application

Depuis la racine du dépôt, avec Python 3 installé :

```sh
python3 -m http.server 8000 --directory dist
```

Ouvrir ensuite http://localhost:8000 dans le navigateur. Pour un hébergement statique, servir le contenu du dossier `dist/`.

## Vérifier l’application

Avec Node.js installé, aucune installation de dépendances n’est nécessaire :

```sh
node tests/supplements.test.mjs
node tests/sick.test.mjs
node tests/melody.test.mjs
node tests/harmony-rhythm.test.mjs
```

Les sauvegardes personnelles restent dans le navigateur ; elles ne font pas partie de ce dépôt. Le transfert sur GitHub ne publie pas automatiquement un second site.

## Compléments du 30 octobre 2026

63 formules ajoutées après examen des cinq PDF fournis. Les six dispositions de tétrades couvrent six qualités, en référençant les formes déjà présentes. Ajouts : formes ouvertes à deux mains, lydiens, petites formes à trois voix, superstructures et positions statiques de block chords. Les 120 identifiants initiaux sont conservés.

Filtres par disposition et source, références de pages, répartition des mains lorsqu’elle est documentée. Onglet Étudier : huit objectifs avec suites générées (comparaisons, cycles complets, harmonisation diatonique, cadences, substitution tritonique, formes à trois voix et II–V–I ouverts). Les scans et PDF ne sont pas inclus dans les fichiers servis.

Validation : `node tests/supplements.test.mjs`.


## Sick Chords Vol. 1 · 30 octobre 2026

Les douze PDF fournis (Do à Si) contiennent 129 positions transposées, classées en huit rubriques et par degré supérieur. Relevé complet de la version en Do : contrôle visuel des notes et altérations, puis vérification indépendante des hauteurs et portées par coordonnées. 113 nouvelles formules, 16 correspondances fusionnées sans changer les anciens identifiants. Les PDF de La, Si♭ et Si sont écrits une octave sous la transposition ascendante depuis Do ; ce registre est repris lors de la sélection d’une référence. Les enharmonies gravées peuvent différer de l’orthographe fonctionnelle affichée.

`dist/sick-data.js` conserve numéro, page, notes MIDI en Do, degrés, rubrique et répartition des portées. `sick.js` enrichit la banque en fusionnant les intervalles et l’orthographe équivalents à l’octave ; les références conservent les noms et registres du volume. Les items d’une progression peuvent comporter `sickNumber`, validé à l’import et conservé dans la sauvegarde v1. Les vues des documents ajustent les octaves et les mains sans modifier les anciennes formes.

Explorer : source Sick Chords Vol. 1, rubrique et degré supérieur. Étudier : comparaison de sommets identiques (octaves ajustées) et une position dans douze tonalités. Le n°84 fait entendre les notes écrites, 13(♭9,♯9), malgré le symbole 13(♯9,♯11) ; vérification concordante dans plusieurs tonalités. Les enharmonies particulières des n°63 et 79 sont signalées. Aucun scan, PDF ou texte pédagogique du livre n’est servi.

Validation complémentaire : `node tests/sick.test.mjs` (129 références, 1 548 transpositions sources, mains, doublons, exercices, sérialisation et MIDI).


## Harmonisation d’une mélodie · 30 octobre 2026

Onglet Harmoniser une mélodie : une ou deux mesures en 4/4, notes C3–C7, rondes/blanches/noires/croches, choix de la position au demi-temps, silences implicites, modification/suppression et annuler/rétablir (50 étapes). Chaque accord conserve la note supérieure à l’octave exacte. Filtres famille, fondamentale, type et source Sick Chords. Proposition de suite selon une heuristique de mouvements courts, sans revendiquer une solution musicalement unique.

Lecture au piano synchronisée avec les durées, surbrillance des notes/accords, clavier en cours, tempo, volume, basse, boucle, pause/arrêt, mélodie seule ou harmonisée. Les cases sans accord jouent la note seule. Copie des accords vers la progression, y compris les croches ; les silences restent propres à l’éditeur de mélodie.

Export PDF vectoriel direct, sans fenêtre d’impression : titre, tempo, mesure, temps, durées, mélodie proportionnelle et deux claviers par ligne, avec pagination. Les altérations sont écrites # et b dans le PDF. Export MIDI et WAV PCM 16 bits / 44,1 kHz stéréo, avec rythme, silences et basse ; le WAV utilise les échantillons piano si disponibles. Le WAV se prépare puis se télécharge par un lien explicite.

Projet mélodique sauvegardé automatiquement dans le navigateur, inclus dans la sauvegarde globale et exportable/importable en JSON dédié. Aucun projet personnel n’est envoyé au serveur.

Tests : `node tests/melody.test.mjs`, `node tests/sick.test.mjs`, `node tests/supplements.test.mjs`. Le test de mélodie produit des PDF de contrôle dans le dossier temporaire du système, ou dans ATELIER_QA_DIR si défini.


## Rythme harmonique indépendant · 30 octobre 2026

La ligne `harmonies` porte le début, la durée et le voicing de chaque accord, indépendamment des notes de `events`. Les anciens projets v1, sans cette ligne, sont migrés automatiquement vers une attaque d’accord par note existante. La sauvegarde et l’historique conservent les deux lignes.

Un accord peut durer une blanche sous deux noires, une ronde sous plusieurs notes, ou commencer entre deux notes. Une durée reste dans une mesure ; appliquer une nouvelle plage remplace la partie chevauchée des anciens accords et conserve leurs fragments extérieurs. Le choix top note est un repère de recherche ; les notes suivantes ne contraignent pas le voicing. La recherche libre retire aussi ce repère. La proposition automatique respecte le rythme harmonique déjà défini.

Lecture et WAV : attaques de mélodie et d’accords planifiées avec des débuts absolus ; un accord n’est pas réattaqué à chaque note. Surbrillances et clavier de l’accord actif, avec le nom de la note mélodique en cours. MIDI : mélodie sur canal 1, accompagnement sur canal 2, chacun avec ses durées exactes ; les notes identiques des deux voix restent indépendantes. Le PDF montre les deux rythmes et un diagramme par accord, avec les notes de mélodie couvertes. La copie vers une progression copie les accords et leurs durées, sans répéter les accords par note de mélodie.

Validation spécifique : `node tests/harmony-rhythm.test.mjs` (migration, tenue d’un accord sur plusieurs notes, attaque unique, positions/durées MIDI décodées, pause, remplacement de plages, choix libre, sérialisation et PDF).
