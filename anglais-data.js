// PLAN : modules et cours. "Examen du module N" = examen de module (id e1, e2…).
// CONTENT : contenu des cours, clé = numéro du cours. Un cours sans contenu s'affiche « Bientôt disponible ».
// Question : { q, a:["réponse","variante"], e:"explication" }  ou QCM { q, o:[…], c:indexBonneRéponse }
//            { say:"phrase", q, a:[…] } = dictée (la phrase est lue à voix haute).
const PLAN = [
  ["Module 1 — Fondations", "Pronoms + TO BE|HAVE / HAS + DO / DOES|Present Simple|Present Continuous|Articles et pluriels|Examen du module 1"],
  ["Module 2 — Les 4 temps du présent", "Present Simple approfondi|Present Perfect|Present Perfect Continuous|Comparaison des 4 temps du présent|Adjectifs, adverbes, comparatifs|Examen du module 2"],
  ["Module 3 — Les 4 temps du passé", "Past Simple|Past Continuous|Past Simple vs Past Continuous|Past Perfect|Past Perfect Continuous|Les 4 temps du passé|Examen du module 3"],
  ["Module 4 — Les futurs", "Will|Going to|Présent pour le futur|Future Continuous|Future Perfect|Future Perfect Continuous|Examen du module 4"],
  ["Module 5 — Grammaire avancée", "Modal verbs|Conditionals|Passive voice|Relative clauses + Reported speech"],
  ["Module 6 — Structures avancées", "Gerund / Infinitive|Phrasal verbs|Anglais naturel|Examen final"]
];
const CONTENT = {
1: {
  l: "<p>Le verbe <b>to be</b> (« être ») est le plus utilisé de l'anglais. Le <b>pronom sujet est toujours obligatoire</b> : on dit <i>I am tired</i>, jamais « am tired ». <i>It</i> remplace une chose ou un animal.</p><table><tr><th>Pronom</th><th>To be</th><th>Forme courte</th><th>Français</th></tr><tr><td>I</td><td>am</td><td>I'm</td><td>je suis</td></tr><tr><td>You</td><td>are</td><td>you're</td><td>tu es / vous êtes</td></tr><tr><td>He / She / It</td><td>is</td><td>he's / she's / it's</td><td>il / elle est</td></tr><tr><td>We</td><td>are</td><td>we're</td><td>nous sommes</td></tr><tr><td>They</td><td>are</td><td>they're</td><td>ils / elles sont</td></tr></table><div class='key'><b>Négation :</b> on ajoute <i>not</i> → <i>I am not tired.</i><br><b>Question :</b> on inverse sujet et verbe → <i>Is she a student ?</i></div>",
  v: [["student","étudiant"],["friend","ami"],["tired","fatigué"],["ready","prêt"],["French","français"],["teacher","professeur"],["happy","heureux"],["late","en retard"],["busy","occupé"],["from","originaire de"]],
  x: ["I am a student.", "She is my friend and she is very happy.", "We are ready, but they are late because the train is not on time."],
  ex: [
    { q: "I ___ French.", a: ["am"] }, { q: "She ___ a student.", a: ["is"] }, { q: "They ___ tired.", a: ["are"] }, { q: "We ___ ready.", a: ["are"] },
    { q: "Traduisez : « Je suis étudiant. »", a: ["I am a student", "I'm a student"] },
    { q: "Traduisez : « Elle est française. »", a: ["She is French", "She's French"] },
    { q: "Traduisez : « Tu es mon ami. »", a: ["You are my friend", "You're my friend"] },
    { q: "Négation : « I am tired. »", a: ["I am not tired", "I'm not tired"] },
    { q: "Question : « She is a student. »", a: ["Is she a student"] },
    { say: "We are ready.", q: "Écoutez et écrivez la phrase.", a: ["We are ready", "We're ready"] }
  ],
  oral: "Présentez-vous à voix haute pendant <b>1 minute</b> : prénom, âge, nationalité, métier ou études.<br><i>Hello, I am Léa. I am 25. I am French…</i>",
  ev: [
    { q: "She ___ a doctor.", o: ["am", "is", "are"], c: 1 },
    { q: "They ___ at home.", o: ["is", "am", "are"], c: 2 },
    { q: "Traduisez : « Je suis fatigué. »", a: ["I am tired", "I'm tired"] },
    { q: "Négation : « He is late. »", a: ["He is not late", "He isn't late", "He's not late"] },
    { q: "Question : « You are ready. »", a: ["Are you ready"] },
    { q: "Quel pronom remplace « Anna and I » ?", o: ["They", "We", "She"], c: 1 },
    { q: "Corrigez : « She am happy. »", a: ["She is happy", "She's happy"] },
    { q: "We ___ friends. (to be)", a: ["are"] },
    { q: "Forme courte de « It is » :", o: ["It's", "Its", "Is it"], c: 0, e: "Its (sans apostrophe) est un possessif." },
    { q: "Traduisez : « Ils sont occupés. »", a: ["They are busy", "They're busy"] }
  ]
},
2: {
  l: "<p><b>Have</b> exprime la possession (« avoir »). À la 3<sup>e</sup> personne du singulier, il devient <b>has</b>.</p><table><tr><th>Sujet</th><th>Verbe</th><th>Exemple</th></tr><tr><td>I / You / We / They</td><td>have</td><td>I have a car.</td></tr><tr><td>He / She / It</td><td>has</td><td>She has a car.</td></tr></table><p>Pour nier ou interroger, on utilise l'auxiliaire <b>do / does</b> :</p><table><tr><th>Forme</th><th>Modèle</th></tr><tr><td>Négation</td><td>I <b>do not</b> (don't) have money. / She <b>does not</b> (doesn't) have money.</td></tr><tr><td>Question</td><td><b>Do</b> you have a computer ? / <b>Does</b> she have a brother ?</td></tr></table><div class='key'>Après <i>does</i> ou <i>doesn't</i>, on revient à <b>have</b> (jamais « has »).</div>",
  v: [["car","voiture"],["computer","ordinateur"],["brother","frère"],["sister","sœur"],["house","maison"],["money","argent"],["phone","téléphone"],["dog","chien"],["job","travail, emploi"],["book","livre"]],
  x: ["I have a car.", "She has two brothers and a sister.", "Does he have enough money, or does he need to borrow some from his friends?"],
  ex: [
    { q: "She ___ a car.", a: ["has"] }, { q: "I ___ a computer.", a: ["have"] }, { q: "He ___ two brothers.", a: ["has"] }, { q: "They ___ a house.", a: ["have"] },
    { q: "Question : « You have a computer. »", a: ["Do you have a computer"] },
    { q: "Question : « She has a brother. »", a: ["Does she have a brother"] },
    { q: "Négation : « I have money. »", a: ["I do not have money", "I don't have money"] },
    { q: "Négation : « She has a car. »", a: ["She does not have a car", "She doesn't have a car"] },
    { say: "She has a brother.", q: "Écoutez et écrivez la phrase.", a: ["She has a brother"] }
  ],
  oral: "Décrivez à voix haute <b>ce que vous possédez</b> (au moins 6 phrases), y compris ce que vous n'avez pas.<br><i>I have a phone. I don't have a car…</i>",
  ev: [
    { q: "He ___ a dog.", o: ["have", "has", "haves"], c: 1 },
    { q: "We ___ a big house.", a: ["have"] },
    { q: "___ she have a phone ?", o: ["Do", "Does", "Is"], c: 1 },
    { q: "Négation : « They have a car. »", a: ["They do not have a car", "They don't have a car"] },
    { q: "Question : « He has a job. »", a: ["Does he have a job"] },
    { q: "Corrigez : « She does not has a car. »", a: ["She does not have a car", "She doesn't have a car"] },
    { q: "Traduisez : « J'ai un ordinateur. »", a: ["I have a computer"] },
    { q: "« Do you have a brother ? » — « Yes, I ___. »", a: ["do"] },
    { q: "Après « does », le verbe est :", o: ["has", "have", "having"], c: 1 },
    { q: "Traduisez : « Elle n'a pas d'argent. »", a: ["She does not have any money", "She doesn't have any money", "She does not have money", "She doesn't have money"] }
  ]
},
3: {
  l: "<p>Le <b>present simple</b> exprime les <b>habitudes</b> et les <b>vérités générales</b> : <i>I play football every Sunday. Water boils at 100 °C.</i></p><table><tr><th>Forme</th><th>Règle</th><th>Exemple</th></tr><tr><td>Affirmative</td><td>base verbale ; <b>+s</b> à he / she / it</td><td>He works.</td></tr><tr><td>Négation</td><td>do / does + not + base</td><td>She doesn't play.</td></tr><tr><td>Question</td><td>Do / Does + sujet + base</td><td>Do you work here ?</td></tr></table><div class='key'><b>Orthographe de la 3<sup>e</sup> personne :</b> study → stud<b>ies</b> ; watch, go, miss, fix → +<b>es</b> ; sinon +s.</div><p>Adverbes fréquents : <i>always, usually, often, sometimes, never, every day</i>.</p>",
  v: [["always","toujours"],["usually","d'habitude"],["often","souvent"],["sometimes","parfois"],["never","jamais"],["every day","chaque jour"],["work","travailler"],["study","étudier"],["live","habiter"],["speak","parler"]],
  x: ["I play football.", "She studies English every day.", "He doesn't usually watch TV in the evening because he works late."],
  ex: [
    { q: "I ___ football. (play)", a: ["play"] }, { q: "She ___ English. (study)", a: ["studies"] }, { q: "He ___ in France. (live)", a: ["lives"] }, { q: "They ___ every day. (work)", a: ["work"] },
    { q: "Négation : « I work. »", a: ["I do not work", "I don't work"] },
    { q: "Négation : « She plays. »", a: ["She does not play", "She doesn't play"] },
    { q: "Négation : « They study. »", a: ["They do not study", "They don't study"] },
    { q: "Question : « You work here. »", a: ["Do you work here"] },
    { q: "Question : « She speaks English. »", a: ["Does she speak English"] },
    { say: "He lives in France.", q: "Écoutez et écrivez la phrase.", a: ["He lives in France"] }
  ],
  oral: "Décrivez <b>votre journée habituelle</b> pendant 2 minutes, du réveil au coucher.<br><i>I usually wake up at 7. Then I…</i>",
  ev: [
    { q: "She ___ TV every night. (watch)", a: ["watches"] },
    { q: "They ___ to school by bus. (go)", a: ["go"] },
    { q: "Quelle phrase est correcte ?", o: ["He work every day.", "He works every day.", "He worked every day."], c: 1 },
    { q: "Négation : « He plays tennis. »", a: ["He does not play tennis", "He doesn't play tennis"] },
    { q: "Question : « They live here. »", a: ["Do they live here"] },
    { q: "Corrigez : « Does she works here ? »", a: ["Does she work here"], e: "Après does, le verbe reste à la base." },
    { q: "Traduisez : « Il travaille chaque jour. »", a: ["He works every day"] },
    { q: "Marie ___ French. (study)", a: ["studies"] },
    { q: "Quel verbe prend « -es » à la 3e personne ?", o: ["play", "watch", "work"], c: 1 },
    { q: "Traduisez : « Ils ne travaillent pas ici. »", a: ["They do not work here", "They don't work here"] }
  ]
}
};
