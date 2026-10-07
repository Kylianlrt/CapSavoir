// ============================================================
// PLAN CHINOIS — OBJECTIF A0 → C2
// ============================================================
//
// "Examen du module N" = examen de module (id e1, e2…).
// CONTENT : contenu des cours, clé = numéro du cours.
// Un cours sans contenu s'affiche « Bientôt disponible ».
//
// Question : { q, a:["réponse","variante"], e:"explication" }
// QCM      : { q, o:[…], c:indexBonneRéponse, e:"explication" }
// Dictée   : { say:"phrase", q:"Écoutez et écrivez.", a:[…] }
// oral     : consigne d'expression orale
//
// ============================================================

const PLAN = [

  ["Module 1 — Fondations du chinois",
    "Introduction au mandarin + caractères + pinyin|Les tons : 1er, 2e, 3e, 4e et ton neutre|Initiales et finales du pinyin|Prononciation zh ch sh / z c s|Prononciation j q x / ü|Changements de tons|Lire et prononcer ses premières syllabes|Examen du module 1"],

  ["Module 2 — Premiers mots et premières phrases",
    "你好 + présentations|我 你 他 她 它 我们 你们 他们|是 : être|也 / 很 / 都|Structure sujet + verbe + objet|Questions avec 吗|Questions avec 什么 / 谁 / 哪|Négation avec 不|Examen du module 2"],

  ["Module 3 — Nombres, âge et informations personnelles",
    "Les nombres de 0 à 100|Les centaines, milliers et 万|Dire son âge|Dire son numéro de téléphone|Dates et années|Jours et mois|Heures et minutes|Parler de sa nationalité et de sa ville|Examen du module 3"],

  ["Module 4 — Possession et famille",
    "的 : possession et relation|有 : avoir|没有 : ne pas avoir|La famille|Classificateur 个|Classificateurs courants|Décrire sa famille|Questions sur la famille|Examen du module 4"],

  ["Module 5 — Verbes et présent",
    "Les verbes chinois fondamentaux|Le présent en chinois|Adverbes de fréquence|在 : être en train de / se trouver|正在 : être actuellement en train de|喜欢 / 爱 / 想 / 要|会 / 能 / 可以|Faire des phrases négatives|Examen du module 5"],

  ["Module 6 — Temps et organisation de la phrase",
    "今天 昨天 明天|现在 以前 以后|La date dans une phrase|L'heure dans une phrase|Le lieu dans une phrase|Ordre temporel + lieu + action|Décrire sa journée|Parler de ses habitudes|Examen du module 6"],

  ["Module 7 — Actions et aspect",
    "了 : changement et action accomplie|过 : expérience passée|在 / 正在 : action en cours|着 : état continu|Différences entre 了 过 在 着|Combinaisons d'aspects|Raconter une expérience|Raconter une action passée|Examen du module 7"],

  ["Module 8 — Adjectifs et comparaison",
    "Adjectifs avec 很|Structure adjectivale|Comparaison avec 比|更 : davantage|最 : le plus|一样 : pareil|越来越 : de plus en plus|Décrire personnes et objets|Examen du module 8"],

  ["Module 9 — Vie quotidienne",
    "La maison|L'école et les études|Le travail|La nourriture|Le restaurant|Les courses|Les vêtements|Les transports|Examen du module 9"],

  ["Module 10 — A1 complet",
    "Se présenter entièrement|Décrire une journée|Parler de ses goûts|Commander au restaurant|Demander son chemin|Acheter quelque chose|Inviter quelqu'un|Accepter et refuser|Révision A1|Examen du module 10"],


  ["Module 11 — A2 : grammaire intermédiaire",
    "因为…所以…|但是 / 可是 / 不过|如果…就…|虽然…但是…|所以 / 因此|还是 / 或者|除了…以外…|只要…就…|Examen du module 11"],

  ["Module 12 — A2 : phrases complexes",
    "把字句|被字句|是…的|一…就…|越…越…|又…又…|一边…一边…|不仅…而且…|Examen du module 12"],

  ["Module 13 — A2 : vocabulaire avancé",
    "Santé et corps|Voyages|Hôtel et réservation|Aéroport et gare|Météo|Loisirs|Sport|Internet et téléphone|Examen du module 13"],

  ["Module 14 — Lecture des caractères",
    "Structure des caractères chinois|Radicaux fondamentaux|Ordre des traits|Caractères fréquents|Reconnaître les composants|Former des mots avec les caractères|Lire des phrases simples|Lire sans pinyin|Examen du module 14"],

  ["Module 15 — Compréhension orale A2",
    "Comprendre une conversation lente|Identifier les mots-clés|Comprendre les nombres|Comprendre les horaires|Comprendre une commande|Comprendre une conversation familiale|Comprendre une conversation professionnelle simple|Dictées chinoises|Examen du module 15"],


  ["Module 16 — B1 : conversation",
    "Parler de son passé|Parler de son présent|Parler de son futur|Raconter une histoire|Exprimer son opinion|Expliquer un problème|Donner un conseil|Tenir une conversation de 15 minutes|Examen du module 16"],

  ["Module 17 — B1 : grammaire avancée",
    "Compléments de résultat|Compléments de direction|Compléments de degré|Compléments de durée|Compléments de quantité|了 dans les structures complexes|把 approfondi|被 approfondi|Examen du module 17"],

  ["Module 18 — B1 : vocabulaire abstrait",
    "Émotions|Personnalité|Relations|Réussite et échec|Problèmes et solutions|Opinions|Causes et conséquences|Arguments|Examen du module 18"],

  ["Module 19 — B1 : lecture",
    "Articles courts|Messages et conversations|Forums chinois|Histoires courtes|Actualités simples|Comprendre le contexte|Déduire le sens d'un mot|Lire sans traduction|Examen du module 19"],

  ["Module 20 — B1 complet",
    "Conversation longue|Compréhension orale|Lecture|Expression écrite|Expression orale|Révision générale B1|Examen blanc B1|Examen du module 20"],


  ["Module 21 — B2 : chinois naturel",
    "Expressions courantes|Connecteurs naturels|Adverbes avancés|Nuances entre synonymes|Registre familier|Registre neutre|Registre formel|Parler comme un natif|Examen du module 21"],

  ["Module 22 — B2 : chengyu et expressions",
    "Introduction aux 成语|Proverbes chinois|Expressions imagées|Métaphores courantes|Expressions historiques|Utiliser un 成语 correctement|Comprendre les 成语 dans un texte|Examen du module 22"],

  ["Module 23 — B2 : langage familier et internet",
    "Argot chinois|Langage des jeunes|Abréviations internet|Messages et réseaux sociaux|Mèmes chinois|Expressions de conversation|Humour chinois|Comprendre le chinois informel|Examen du module 23"],

  ["Module 24 — B2 : médias",
    "Actualités|Journal télévisé|Podcasts|Vidéos YouTube chinoises|Interviews|Films chinois|Séries chinoises|Comprendre sans sous-titres|Examen du module 24"],

  ["Module 25 — B2 : argumentation",
    "Exprimer une opinion|Être d'accord|Être en désaccord|Nuancer son opinion|Débattre|Argumenter|Donner des exemples|Convaincre quelqu'un|Examen du module 25"],


  ["Module 26 — C1 : chinois professionnel",
    "Vocabulaire professionnel|Email professionnel|Réunion|Présentation professionnelle|Entretien d'embauche|Téléphone professionnel|Négociation|Business chinois|Examen du module 26"],

  ["Module 27 — C1 : chinois académique",
    "Vocabulaire académique|Lire un texte universitaire|Résumer un texte|Présenter une problématique|Argumenter à l'écrit|Faire une présentation|Écrire un rapport|Faire une synthèse|Examen du module 27"],

  ["Module 28 — C1 : compréhension avancée",
    "Accents et variations|Débit rapide|Conversations longues|Conférences|Débats|Humour et ironie|Sous-entendus|Compréhension sans sous-titres|Examen du module 28"],

  ["Module 29 — C1 : expression avancée",
    "Raconter avec précision|Argumenter longuement|Décrire des situations complexes|Exprimer des nuances|Exprimer des émotions complexes|Débattre spontanément|Parler sans préparation|Présentation de 15 minutes|Examen du module 29"],

  ["Module 30 — Culture chinoise",
    "Histoire de la Chine|Géographie de la Chine|Société chinoise|Famille et relations|Éducation|Travail|Traditions|Fêtes chinoises|Examen du module 30"],


  ["Module 31 — Littérature et chinois soutenu",
    "Introduction à la littérature chinoise|Textes classiques simplifiés|Chinois littéraire moderne|Métaphores|Expressions littéraires|Poésie chinoise|Comprendre un texte complexe|Analyse de texte|Examen du module 31"],

  ["Module 32 — C2 : maîtrise du chinois",
    "Comprendre les nuances|Synonymes avancés|Registres de langue|Ironie et sarcasme|Humour|Sous-entendus culturels|Expression spontanée|Penser directement en chinois|Examen du module 32"],

  ["Module 33 — Immersion totale",
    "Une journée uniquement en chinois|Journal quotidien en chinois|Conversation de 30 minutes|Film sans sous-titres|Podcast sans transcription|Lecture longue|Débat complet|Présentation complète|Examen du module 33"],

  ["Module 34 — Préparation HSK avancée",
    "HSK vocabulaire|HSK grammaire|HSK compréhension orale|HSK lecture|HSK expression écrite|HSK expression orale|Examens blancs|Correction et progression|Examen du module 34"],

  ["Module 35 — Chinois professionnel spécialisé",
    "Technologie|Informatique|Cybersécurité|Réseaux|Entreprise|Management|Communication|Présenter son métier en chinois|Examen du module 35"],

  ["Module 36 — Maîtrise finale C2",
    "Conversation native|Compréhension native|Lecture avancée|Écriture avancée|Débat|Présentation|Traduction français-chinois|Traduction chinois-français|Examen final C2"]
];


const CONTENT = {


// ============================================================
// MODULE 1
// ============================================================

1: {
  l: `
  <p>Le chinois mandarin utilise principalement des <b>caractères</b> et non un alphabet comme le français.
  Pour apprendre à prononcer les caractères, on utilise le <b>pinyin</b>.</p>

  <p>Le mandarin possède quatre tons principaux et un ton neutre.
  Le ton change le sens d'une syllabe.</p>

  <table>
    <tr><th>Ton</th><th>Exemple</th><th>Prononciation</th></tr>
    <tr><td>1er</td><td>mā</td><td>haut et stable</td></tr>
    <tr><td>2e</td><td>má</td><td>monte</td></tr>
    <tr><td>3e</td><td>mǎ</td><td>descend puis remonte</td></tr>
    <tr><td>4e</td><td>mà</td><td>descend fortement</td></tr>
    <tr><td>neutre</td><td>ma</td><td>court et léger</td></tr>
  </table>

  <div class='key'>
    <b>Règle fondamentale :</b> apprendre le chinois sans maîtriser les tons crée de mauvaises habitudes.
    La prononciation doit donc être travaillée dès le premier jour.
  </div>
  `,

  v: [
    ["你好","bonjour"],
    ["你","tu / vous"],
    ["我","je / moi"],
    ["他","il / lui"],
    ["她","elle"],
    ["是","être"],
    ["吗","particule interrogative"],
    ["不","ne pas"],
    ["好","bien"],
    ["谢谢","merci"]
  ],

  x: [
    "你好。",
    "你好！谢谢。",
    "我很好。"
  ],

  ex: [
    { q:"Comment dit-on « bonjour » ?", a:["你好"] },
    { q:"Comment dit-on « merci » ?", a:["谢谢"] },
    { q:"Quel ton possède « mā » ?", o:["1er","2e","3e","4e"], c:0 },
    { q:"Quel ton possède « má » ?", o:["1er","2e","3e","4e"], c:1 },
    { q:"Quel ton possède « mǎ » ?", o:["1er","2e","3e","4e"], c:2 },
    { q:"Quel ton possède « mà » ?", o:["1er","2e","3e","4e"], c:3 },
    { q:"Traduisez : « Je / moi »", a:["我"] },
    { q:"Traduisez : « tu / vous »", a:["你"] },
    { say:"你好，谢谢。", q:"Écoutez et écrivez la phrase.", a:["你好，谢谢"] }
  ],

  oral: `
  Prononcez à voix haute : <b>mā, má, mǎ, mà</b>.
  Puis répétez cinq fois <b>你好</b> et <b>谢谢</b>.
  `,

  ev: [
    { q:"Combien de tons principaux possède le mandarin ?", o:["2","3","4","5"], c:2 },
    { q:"Quel caractère signifie « je / moi » ?", o:["你","我","他"], c:1 },
    { q:"Quel caractère signifie « tu / vous » ?", o:["我","你","她"], c:1 },
    { q:"Traduisez « Bonjour ».", a:["你好"] },
    { q:"Traduisez « Merci ».", a:["谢谢"] },
    { q:"Quel ton possède mǎ ?", o:["1er","2e","3e","4e"], c:2 },
    { q:"Pourquoi apprendre le pinyin ?", o:["Pour remplacer les caractères","Pour apprendre la prononciation","Pour écrire uniquement en anglais"], c:1 }
  ]
},


// ============================================================
// MODULE 1 — COURS 2
// ============================================================

2: {
  l: `
  <p>Le chinois utilise des caractères. Chaque caractère possède généralement une syllabe et un sens.</p>

  <p>Exemples :</p>

  <table>
    <tr><th>Caractère</th><th>Pinyin</th><th>Sens</th></tr>
    <tr><td>我</td><td>wǒ</td><td>je / moi</td></tr>
    <tr><td>你</td><td>nǐ</td><td>tu / vous</td></tr>
    <tr><td>好</td><td>hǎo</td><td>bien</td></tr>
    <tr><td>人</td><td>rén</td><td>personne</td></tr>
    <tr><td>中</td><td>zhōng</td><td>milieu / Chine dans 中国</td></tr>
    <tr><td>国</td><td>guó</td><td>pays</td></tr>
  </table>

  <p>中国 signifie <b>Chine</b> et se prononce <b>Zhōngguó</b>.</p>
  `,

  v: [
    ["中国","Chine"],
    ["中国人","Chinois / personne chinoise"],
    ["法国","France"],
    ["法国人","Français / Française"],
    ["人","personne"],
    ["国","pays"],
    ["中","milieu / Chine"],
    ["学生","étudiant"],
    ["老师","professeur"],
    ["朋友","ami"]
  ],

  x: [
    "我是法国人。",
    "我是学生。",
    "他是我的朋友。"
  ],

  ex: [
    { q:"Que signifie 我 ?", a:["je","moi"] },
    { q:"Que signifie 你 ?", a:["tu","vous"] },
    { q:"Que signifie 人 ?", a:["personne"] },
    { q:"Comment dit-on Chine ?", a:["中国"] },
    { q:"Comment dit-on France ?", a:["法国"] },
    { q:"Comment dit-on étudiant ?", a:["学生"] },
    { q:"Traduisez : « Je suis étudiant. »", a:["我是学生"] },
    { q:"Traduisez : « Il est mon ami. »", a:["他是我的朋友"] },
    { say:"我是法国人。", q:"Écoutez et écrivez la phrase.", a:["我是法国人"] }
  ],

  oral: `
  Présentez-vous avec trois phrases :
  <br><br>
  <b>你好。我是……我是法国人。我是学生。</b>
  `
},


// ============================================================
// MODULE 2
// ============================================================

3: {
  l: `
  <p>Les pronoms personnels fondamentaux sont :</p>

  <table>
    <tr><th>Chinois</th><th>Pinyin</th><th>Français</th></tr>
    <tr><td>我</td><td>wǒ</td><td>je</td></tr>
    <tr><td>你</td><td>nǐ</td><td>tu / vous</td></tr>
    <tr><td>他</td><td>tā</td><td>il</td></tr>
    <tr><td>她</td><td>tā</td><td>elle</td></tr>
    <tr><td>它</td><td>tā</td><td>il/elle pour une chose ou un animal</td></tr>
    <tr><td>我们</td><td>wǒmen</td><td>nous</td></tr>
    <tr><td>你们</td><td>nǐmen</td><td>vous</td></tr>
    <tr><td>他们</td><td>tāmen</td><td>ils</td></tr>
  </table>

  <p>Le suffixe <b>们</b> permet généralement de former le pluriel des pronoms.</p>
  `,

  v: [
    ["我","je"],
    ["你","tu"],
    ["他","il"],
    ["她","elle"],
    ["它","il/elle pour chose ou animal"],
    ["我们","nous"],
    ["你们","vous"],
    ["他们","ils"],
    ["朋友","ami"],
    ["学生","étudiant"]
  ],

  x: [
    "我是学生。",
    "你是我的朋友。",
    "我们是法国人。",
    "他们是学生。"
  ],

  ex: [
    { q:"Comment dit-on « nous » ?", a:["我们"] },
    { q:"Comment dit-on « ils » ?", a:["他们"] },
    { q:"Comment dit-on « elle » ?", a:["她"] },
    { q:"Traduisez : « Je suis étudiant. »", a:["我是学生"] },
    { q:"Traduisez : « Nous sommes amis. »", a:["我们是朋友"] },
    { q:"Traduisez : « Ils sont étudiants. »", a:["他们是学生"] },
    { q:"Que représente généralement 们 ?", o:["Le passé","Le pluriel des pronoms","La négation"], c:1 }
  ],

  oral: `
  Faites une présentation orale avec au moins cinq pronoms différents.
  `
},


// ============================================================
// MODULE 2 — COURS 2
// ============================================================

4: {
  l: `
  <p><b>是 (shì)</b> signifie « être ».</p>

  <p>La structure fondamentale est :</p>

  <div class='key'>
    <b>Sujet + 是 + complément</b>
  </div>

  <p>Exemples :</p>

  <ul>
    <li>我是学生。 → Je suis étudiant.</li>
    <li>你是法国人。 → Tu es français.</li>
    <li>他是老师。 → Il est professeur.</li>
  </ul>

  <p>Attention : en chinois, on ne conjugue pas 是 selon la personne.</p>
  `,

  v: [
    ["是","être"],
    ["学生","étudiant"],
    ["老师","professeur"],
    ["医生","médecin"],
    ["朋友","ami"],
    ["法国人","Français"],
    ["中国人","Chinois"],
    ["人","personne"],
    ["谁","qui"],
    ["什么","quoi"]
  ],

  x: [
    "我是学生。",
    "她是老师。",
    "你是谁？",
    "他是什么人？"
  ],

  ex: [
    { q:"Traduisez : « Je suis étudiant. »", a:["我是学生"] },
    { q:"Traduisez : « Elle est professeur. »", a:["她是老师"] },
    { q:"Comment dit-on « qui » ?", a:["谁"] },
    { q:"Comment dit-on « quoi » ?", a:["什么"] },
    { q:"Complétez : 我 ___ 学生。", a:["是"] },
    { q:"Complétez : 他 ___ 老师。", a:["是"] },
    { q:"Traduisez : « Qui es-tu ? »", a:["你是谁"] }
  ],

  oral: `
  Posez et répondez à voix haute :
  <br>
  你是谁？
  <br>
  你是学生吗？
  `
},


// ============================================================
// MODULE 2 — COURS 3
// ============================================================

5: {
  l: `
  <p>La particule <b>吗 (ma)</b> permet de transformer une phrase affirmative en question fermée.</p>

  <div class='key'>
    Phrase affirmative + 吗？
  </div>

  <p>Exemple :</p>

  <p>你是学生。 → Tu es étudiant.</p>
  <p>你是学生吗？ → Es-tu étudiant ?</p>

  <p>La réponse peut utiliser :</p>

  <ul>
    <li>是。 → Oui / c'est le cas.</li>
    <li>不是。 → Non / ce n'est pas le cas.</li>
  </ul>
  `,

  v: [
    ["吗","particule interrogative"],
    ["是","être"],
    ["不是","ne pas être"],
    ["学生","étudiant"],
    ["老师","professeur"],
    ["法国人","Français"],
    ["中国人","Chinois"],
    ["朋友","ami"],
    ["对","correct"],
    ["不对","incorrect"]
  ],

  x: [
    "你是学生吗？",
    "你是法国人吗？",
    "你是老师吗？",
    "是。"
  ],

  ex: [
    { q:"Comment transforme-t-on une affirmation en question fermée ?", o:["Avec 吗","Avec 的","Avec 了"], c:0 },
    { q:"Traduisez : « Es-tu étudiant ? »", a:["你是学生吗"] },
    { q:"Traduisez : « Es-tu français ? »", a:["你是法国人吗"] },
    { q:"Comment dire « non, ce n'est pas le cas » ?", a:["不是"] },
    { q:"Complétez : 你是学生___？", a:["吗"] }
  ],

  oral: `
  Imaginez une conversation avec un Chinois.
  Posez au moins 5 questions avec <b>吗</b>.
  `
},


// ============================================================
// MODULE 3
// ============================================================

6: {
  l: `
  <p>Les nombres chinois sont très réguliers.</p>

  <table>
    <tr><th>Nombre</th><th>Chinois</th><th>Pinyin</th></tr>
    <tr><td>0</td><td>零</td><td>líng</td></tr>
    <tr><td>1</td><td>一</td><td>yī</td></tr>
    <tr><td>2</td><td>二</td><td>èr</td></tr>
    <tr><td>3</td><td>三</td><td>sān</td></tr>
    <tr><td>4</td><td>四</td><td>sì</td></tr>
    <tr><td>5</td><td>五</td><td>wǔ</td></tr>
    <tr><td>6</td><td>六</td><td>liù</td></tr>
    <tr><td>7</td><td>七</td><td>qī</td></tr>
    <tr><td>8</td><td>八</td><td>bā</td></tr>
    <tr><td>9</td><td>九</td><td>jiǔ</td></tr>
    <tr><td>10</td><td>十</td><td>shí</td></tr>
  </table>

  <p>Pour former 20 : 二十. Pour 21 : 二十一.</p>
  `,

  v: [
    ["零","zéro"],
    ["一","un"],
    ["二","deux"],
    ["三","trois"],
    ["四","quatre"],
    ["五","cinq"],
    ["六","six"],
    ["七","sept"],
    ["八","huit"],
    ["九","neuf"],
    ["十","dix"],
    ["百","cent"],
    ["千","mille"],
    ["万","dix mille"]
  ],

  x: [
    "一，二，三，四，五。",
    "十，二十，三十。",
    "一百。"
  ],

  ex: [
    { q:"Comment dit-on 1 ?", a:["一"] },
    { q:"Comment dit-on 5 ?", a:["五"] },
    { q:"Comment dit-on 8 ?", a:["八"] },
    { q:"Comment dit-on 10 ?", a:["十"] },
    { q:"Comment écrit-on 20 ?", a:["二十"] },
    { q:"Comment écrit-on 21 ?", a:["二十一"] },
    { q:"Comment écrit-on 100 ?", a:["一百"] },
    { q:"Comment dit-on 1000 ?", a:["一千"] },
    { q:"Comment dit-on 10 000 ?", a:["一万","万"] }
  ],

  oral: `
  Comptez de 1 à 100 en chinois.
  Puis choisissez 10 nombres au hasard et prononcez-les.
  `
},


// ============================================================
// MODULE 4
// ============================================================

7: {
  l: `
  <p><b>的 (de)</b> permet notamment d'exprimer la possession.</p>

  <div class='key'>
    Possesseur + 的 + objet
  </div>

  <p>Exemples :</p>

  <p>我的书 → mon livre</p>
  <p>你的手机 → ton téléphone</p>
  <p>他的朋友 → son ami</p>

  <p>La structure est très régulière et essentielle.</p>
  `,

  v: [
    ["的","marqueur de possession"],
    ["我的","mon / ma"],
    ["你的","ton / ta"],
    ["他的","son / sa"],
    ["她的","son / sa"],
    ["书","livre"],
    ["手机","téléphone"],
    ["电脑","ordinateur"],
    ["车","voiture"],
    ["家","maison / famille"]
  ],

  x: [
    "这是我的书。",
    "这是你的手机吗？",
    "他的电脑很新。",
    "她的车很漂亮。"
  ],

  ex: [
    { q:"Traduisez : « mon livre »", a:["我的书"] },
    { q:"Traduisez : « ton téléphone »", a:["你的手机"] },
    { q:"Traduisez : « son ordinateur »", a:["他的电脑","她的电脑"] },
    { q:"Quel caractère indique généralement la possession ?", a:["的"] },
    { q:"Complétez : 我___书", a:["的"] },
    { q:"Traduisez : « C'est mon ordinateur. »", a:["这是我的电脑"] }
  ],

  oral: `
  Montrez mentalement ou physiquement différents objets et dites :
  <br>
  « C'est mon… »
  <br>
  « C'est ton… »
  <br>
  « C'est son… »
  `
},


// ============================================================
// MODULE 5
// ============================================================

8: {
  l: `
  <p><b>有 (yǒu)</b> signifie « avoir » ou « il y a » selon le contexte.</p>

  <p>Affirmatif :</p>
  <p>我有一辆车。 → J'ai une voiture.</p>

  <p>Négatif :</p>
  <p>我没有车。 → Je n'ai pas de voiture.</p>

  <div class='key'>
    <b>没有</b> est utilisé pour nier 有.
  </div>
  `,

  v: [
    ["有","avoir / il y a"],
    ["没有","ne pas avoir"],
    ["车","voiture"],
    ["钱","argent"],
    ["时间","temps"],
    ["手机","téléphone"],
    ["电脑","ordinateur"],
    ["哥哥","grand frère"],
    ["姐姐","grande sœur"],
    ["弟弟","petit frère"]
  ],

  x: [
    "我有一台电脑。",
    "我有一个手机。",
    "我没有车。",
    "你有时间吗？"
  ],

  ex: [
    { q:"Comment dit-on « avoir » ?", a:["有"] },
    { q:"Comment dit-on « ne pas avoir » ?", a:["没有"] },
    { q:"Traduisez : « J'ai un ordinateur. »", a:["我有一台电脑"] },
    { q:"Traduisez : « Je n'ai pas de voiture. »", a:["我没有车"] },
    { q:"Complétez : 我 ___ 钱。", a:["有"] },
    { q:"Complétez : 我 ___ 时间。", a:["没有"] }
  ],

  oral: `
  Dites au moins 8 choses que vous avez et 5 choses que vous n'avez pas.
  `
},


// ============================================================
// MODULE 6
// ============================================================

9: {
  l: `
  <p>Le chinois ne conjugue pas les verbes comme le français.
  Le contexte et les marqueurs temporels permettent de comprendre quand une action se déroule.</p>

  <table>
    <tr><th>Chinois</th><th>Français</th></tr>
    <tr><td>今天</td><td>aujourd'hui</td></tr>
    <tr><td>昨天</td><td>hier</td></tr>
    <tr><td>明天</td><td>demain</td></tr>
    <tr><td>现在</td><td>maintenant</td></tr>
    <tr><td>以后</td><td>plus tard / après</td></tr>
    <tr><td>以前</td><td>avant / autrefois</td></tr>
  </table>

  <p>Exemple :</p>

  <p>我今天学习中文。<br>
  J'étudie le chinois aujourd'hui.</p>
  `,

  v: [
    ["今天","aujourd'hui"],
    ["昨天","hier"],
    ["明天","demain"],
    ["现在","maintenant"],
    ["以前","avant"],
    ["以后","après / plus tard"],
    ["早上","matin"],
    ["下午","après-midi"],
    ["晚上","soir"],
    ["学习","étudier"]
  ],

  x: [
    "我今天学习中文。",
    "我昨天学习了中文。",
    "我明天学习中文。"
  ],

  ex: [
    { q:"Comment dit-on aujourd'hui ?", a:["今天"] },
    { q:"Comment dit-on hier ?", a:["昨天"] },
    { q:"Comment dit-on demain ?", a:["明天"] },
    { q:"Comment dit-on maintenant ?", a:["现在"] },
    { q:"Traduisez : « J'étudie le chinois aujourd'hui. »", a:["我今天学习中文"] },
    { q:"Traduisez : « J'étudierai le chinois demain. »", a:["我明天学习中文"] }
  ],

  oral: `
  Décrivez votre journée en utilisant :
  <b>今天、昨天、明天、现在、早上、下午、晚上</b>.
  `
},


// ============================================================
// MODULE 7
// ============================================================

10: {
  l: `
  <p><b>了</b> est l'un des éléments les plus importants du chinois.
  Il ne correspond pas simplement au « passé » français.</p>

  <p>Il peut notamment indiquer qu'une action est accomplie :</p>

  <div class='key'>
    Sujet + Verbe + 了
  </div>

  <p>我吃饭了。 → J'ai mangé / J'ai pris mon repas.</p>

  <p>Il peut également signaler un changement de situation :</p>

  <p>下雨了。 → Il se met à pleuvoir / Il pleut maintenant.</p>
  `,

  v: [
    ["了","aspect / changement"],
    ["吃","manger"],
    ["喝","boire"],
    ["看","regarder"],
    ["买","acheter"],
    ["去","aller"],
    ["来","venir"],
    ["做","faire"],
    ["完成","terminer"],
    ["已经","déjà"]
  ],

  x: [
    "我吃饭了。",
    "我买了一本书。",
    "他去了中国。",
    "下雨了。"
  ],

  ex: [
    { q:"À quoi peut servir 了 ?", o:["Uniquement à former le futur","À indiquer notamment une action accomplie ou un changement","À former uniquement une question"], c:1 },
    { q:"Traduisez : « J'ai mangé. »", a:["我吃饭了"] },
    { q:"Complétez : 我吃饭___。", a:["了"] },
    { q:"Traduisez : « J'ai acheté un livre. »", a:["我买了一本书"] },
    { q:"Que peut signifier 下雨了 ?", a:["Il se met à pleuvoir","Il pleut maintenant"] }
  ],

  oral: `
  Racontez oralement trois choses que vous avez faites aujourd'hui
  en utilisant <b>了</b>.
  `
},


// ============================================================
// MODULE 8
// ============================================================

11: {
  l: `
  <p>Pour comparer deux éléments, on utilise généralement <b>比 (bǐ)</b>.</p>

  <div class='key'>
    A + 比 + B + adjectif
  </div>

  <p>我比他高。 → Je suis plus grand que lui.</p>

  <p>Pour dire « le plus », on utilise <b>最 (zuì)</b>.</p>

  <p>他是最高的。 → Il est le plus grand.</p>

  <p><b>越来越</b> signifie « de plus en plus ».</p>

  <p>中文越来越好。 → Le chinois devient de mieux en mieux.</p>
  `,

  v: [
    ["比","comparer / plus que"],
    ["更","davantage"],
    ["最","le plus"],
    ["一样","pareil"],
    ["越来越","de plus en plus"],
    ["高","grand / haut"],
    ["大","grand"],
    ["小","petit"],
    ["快","rapide"],
    ["慢","lent"]
  ],

  x: [
    "我比他高。",
    "这个比那个贵。",
    "他是我们班最高的。",
    "我的中文越来越好。"
  ],

  ex: [
    { q:"Quel mot permet de faire une comparaison ?", a:["比"] },
    { q:"Quel mot signifie « le plus » ?", a:["最"] },
    { q:"Que signifie 越来越 ?", a:["de plus en plus"] },
    { q:"Traduisez : « Je suis plus grand que lui. »", a:["我比他高"] },
    { q:"Traduisez : « Mon chinois devient de mieux en mieux. »", a:["我的中文越来越好"] }
  ],

  oral: `
  Comparez oralement :
  <br>
  deux personnes,
  deux villes,
  deux objets,
  deux langues.
  `
},


// ============================================================
// MODULE 9
// ============================================================

12: {
  l: `
  <p>Ce cours introduit le vocabulaire de la vie quotidienne.</p>

  <table>
    <tr><th>Chinois</th><th>Pinyin</th><th>Français</th></tr>
    <tr><td>家</td><td>jiā</td><td>maison / famille</td></tr>
    <tr><td>学校</td><td>xuéxiào</td><td>école</td></tr>
    <tr><td>公司</td><td>gōngsī</td><td>entreprise</td></tr>
    <tr><td>商店</td><td>shāngdiàn</td><td>magasin</td></tr>
    <tr><td>饭店</td><td>fàndiàn</td><td>restaurant</td></tr>
    <tr><td>医院</td><td>yīyuàn</td><td>hôpital</td></tr>
    <tr><td>银行</td><td>yínháng</td><td>banque</td></tr>
  </table>
  `,

  v: [
    ["家","maison / famille"],
    ["学校","école"],
    ["公司","entreprise"],
    ["商店","magasin"],
    ["饭店","restaurant"],
    ["医院","hôpital"],
    ["银行","banque"],
    ["地铁","métro"],
    ["车站","gare / station"],
    ["机场","aéroport"]
  ],

  x: [
    "我在学校。",
    "他在公司。",
    "我们去饭店。",
    "她在医院。"
  ],

  ex: [
    { q:"Comment dit-on école ?", a:["学校"] },
    { q:"Comment dit-on entreprise ?", a:["公司"] },
    { q:"Comment dit-on restaurant ?", a:["饭店"] },
    { q:"Comment dit-on hôpital ?", a:["医院"] },
    { q:"Comment dit-on aéroport ?", a:["机场"] },
    { q:"Traduisez : « Je suis à l'école. »", a:["我在学校"] }
  ],

  oral: `
  Décrivez les lieux que vous fréquentez pendant une semaine.
  `
},


// ============================================================
// MODULE 10 — A1
// ============================================================

13: {
  l: `
  <p>Vous devez maintenant être capable de vous présenter de manière simple.</p>

  <p>Une présentation complète peut contenir :</p>

  <ul>
    <li>nom</li>
    <li>âge</li>
    <li>nationalité</li>
    <li>ville</li>
    <li>études ou travail</li>
    <li>famille</li>
    <li>loisirs</li>
    <li>raison d'apprendre le chinois</li>
  </ul>

  <div class='key'>
    Objectif : produire au moins <b>10 phrases en chinois</b>.
  </div>
  `,

  v: [
    ["名字","nom / prénom"],
    ["年龄","âge"],
    ["法国","France"],
    ["学生","étudiant"],
    ["工作","travail / travailler"],
    ["学习","étudier"],
    ["喜欢","aimer"],
    ["运动","sport"],
    ["中文","chinois"],
    ["因为","parce que"]
  ],

  x: [
    "你好，我叫Kylian。",
    "我是法国人。",
    "我是学生。",
    "我学习中文。",
    "我喜欢运动。",
    "我喜欢中文。"
  ],

  ex: [
    { q:"Comment dire « Je m'appelle… » ?", a:["我叫"] },
    { q:"Comment dire « J'étudie le chinois » ?", a:["我学习中文"] },
    { q:"Comment dire « J'aime le sport » ?", a:["我喜欢运动"] },
    { q:"Traduisez : « Je suis français. »", a:["我是法国人"] },
    { q:"Traduisez : « Je suis étudiant. »", a:["我是学生"] },
    { q:"Traduisez : « J'aime le chinois. »", a:["我喜欢中文"] }
  ],

  oral: `
  Faites une présentation de <b>2 minutes uniquement en chinois</b>.
  Ne lisez pas votre texte.
  `
},


// ============================================================
// EXAMEN MODULE 1
// ============================================================

e1: {
  ev: [
    { q:"Combien de tons principaux possède le mandarin ?", o:["2","3","4","5"], c:2, p:.5 },
    { q:"Que signifie 我 ?", a:["je","moi"], p:.5 },
    { q:"Que signifie 你 ?", a:["tu","vous"], p:.5 },
    { q:"Comment dit-on « bonjour » ?", a:["你好"], p:.5 },
    { q:"Comment dit-on « merci » ?", a:["谢谢"], p:.5 },
    { q:"Quel ton possède mǎ ?", o:["1er","2e","3e","4e"], c:2, p:.5 },
    { q:"Comment dit-on « Chine » ?", a:["中国"], p:.5 },
    { q:"Comment dit-on « France » ?", a:["法国"], p:.5 },
    { q:"Comment dit-on « étudiant » ?", a:["学生"], p:.5 },
    { q:"Traduisez : « Je suis français. »", a:["我是法国人"], p:1 },
    { q:"Traduisez : « Je suis étudiant. »", a:["我是学生"], p:1 },
    { q:"Traduisez : « Nous sommes amis. »", a:["我们是朋友"], p:1 },
    { q:"Quel caractère signifie « être » ?", a:["是"], p:.5 },
    { q:"Quelle particule transforme généralement une phrase en question fermée ?", a:["吗"], p:.5 },
    { q:"Traduisez : « Es-tu étudiant ? »", a:["你是学生吗"], p:1 },
    { q:"Comment dit-on « je / moi » ?", a:["我"], p:.5 },
    { q:"Comment dit-on « nous » ?", a:["我们"], p:.5 },
    { q:"Comment dit-on « ils » ?", a:["他们"], p:.5 },
    { q:"Dictée : « 你好，谢谢。 »", say:"你好，谢谢。", a:["你好，谢谢"], p:1 },
    { q:"Traduisez : « Il est mon ami. »", a:["他是我的朋友"], p:1 }
  ]
},


// ============================================================
// EXAMEN MODULE 2
// ============================================================

e2: {
  ev: [
    { q:"Comment dit-on « je » ?", a:["我"], p:.5 },
    { q:"Comment dit-on « elle » ?", a:["她"], p:.5 },
    { q:"Comment dit-on « nous » ?", a:["我们"], p:.5 },
    { q:"Complétez : 我___学生。", a:["是"], p:.5 },
    { q:"Complétez : 他___老师。", a:["是"], p:.5 },
    { q:"Comment poser une question avec « 吗 » ?", o:["Sujet + 吗","Phrase + 吗","吗 + phrase"], c:1, p:.5 },
    { q:"Traduisez : « Es-tu français ? »", a:["你是法国人吗"], p:1 },
    { q:"Traduisez : « Je ne suis pas professeur. »", a:["我不是老师"], p:1 },
    { q:"Comment dit-on « qui » ?", a:["谁"], p:.5 },
    { q:"Comment dit-on « quoi » ?", a:["什么"], p:.5 },
    { q:"Traduisez : « Qui es-tu ? »", a:["你是谁"], p:1 },
    { q:"Traduisez : « Nous sommes étudiants. »", a:["我们是学生"], p:1 }
  ]
},


// ============================================================
// EXAMEN MODULE 3
// ============================================================

e3: {
  ev: [
    { q:"Comment dit-on 1 ?", a:["一"], p:.5 },
    { q:"Comment dit-on 5 ?", a:["五"], p:.5 },
    { q:"Comment dit-on 10 ?", a:["十"], p:.5 },
    { q:"Comment dit-on 20 ?", a:["二十"], p:.5 },
    { q:"Comment dit-on 21 ?", a:["二十一"], p:.5 },
    { q:"Comment dit-on 100 ?", a:["一百"], p:.5 },
    { q:"Comment dit-on 1000 ?", a:["一千"], p:.5 },
    { q:"Comment dit-on 10 000 ?", a:["一万","万"], p:.5 },
    { q:"Comment dit-on aujourd'hui ?", a:["今天"], p:.5 },
    { q:"Comment dit-on hier ?", a:["昨天"], p:.5 },
    { q:"Comment dit-on demain ?", a:["明天"], p:.5 },
    { q:"Comment dit-on maintenant ?", a:["现在"], p:.5 },
    { q:"Traduisez : « J'étudie aujourd'hui. »", a:["我今天学习"], p:1 },
    { q:"Traduisez : « J'étudierai demain. »", a:["我明天学习"], p:1 }
  ]
},


// ============================================================
// EXAMEN MODULE 4
// ============================================================

e4: {
  ev: [
    { q:"Quel caractère exprime généralement la possession ?", a:["的"], p:.5 },
    { q:"Traduisez « mon livre ».", a:["我的书"], p:1 },
    { q:"Traduisez « ton téléphone ».", a:["你的手机"], p:1 },
    { q:"Comment dit-on « avoir » ?", a:["有"], p:.5 },
    { q:"Comment dit-on « ne pas avoir » ?", a:["没有"], p:.5 },
    { q:"Traduisez : « J'ai une voiture. »", a:["我有车","我有一辆车"], p:1 },
    { q:"Traduisez : « Je n'ai pas d'argent. »", a:["我没有钱"], p:1 },
    { q:"Traduisez : « C'est mon ordinateur. »", a:["这是我的电脑"], p:1 },
    { q:"Complétez : 我___手机。", a:["的"], p:.5 }
  ]
},


// ============================================================
// EXAMEN MODULE 5
// ============================================================

e5: {
  ev: [
    { q:"Comment dit-on « aimer » ?", a:["喜欢"], p:.5 },
    { q:"Comment dit-on « vouloir » ?", a:["想","要"], p:.5 },
    { q:"Comment dit-on « pouvoir / savoir faire » ?", a:["会","能","可以"], p:.5 },
    { q:"Traduisez : « J'aime le chinois. »", a:["我喜欢中文"], p:1 },
    { q:"Traduisez : « Je veux apprendre le chinois. »", a:["我想学中文","我想学习中文"], p:1 },
    { q:"Traduisez : « Je peux venir. »", a:["我可以来","我能来"], p:1 },
    { q:"Comment dit-on « ne pas » ?", a:["不"], p:.5 }
  ]
},


// ============================================================
// EXAMEN MODULE 6
// ============================================================

e6: {
  ev: [
    { q:"Comment dit-on « matin » ?", a:["早上"], p:.5 },
    { q:"Comment dit-on « après-midi » ?", a:["下午"], p:.5 },
    { q:"Comment dit-on « soir » ?", a:["晚上"], p:.5 },
    { q:"Traduisez : « Aujourd'hui j'étudie le chinois. »", a:["我今天学习中文"], p:1 },
    { q:"Traduisez : « Demain je vais à l'école. »", a:["我明天去学校"], p:1 },
    { q:"Traduisez : « Je suis à l'école maintenant. »", a:["我现在在学校"], p:1 }
  ]
},


// ============================================================
// EXAMEN MODULE 7
// ============================================================

e7: {
  ev: [
    { q:"À quoi peut servir 了 ?", o:["Action accomplie ou changement","Uniquement futur","Uniquement question"], c:0, p:.5 },
    { q:"Comment exprime-t-on une expérience ?", a:["过"], p:.5 },
    { q:"Comment indique-t-on une action en cours ?", a:["在","正在"], p:.5 },
    { q:"Traduisez : « J'ai mangé. »", a:["我吃饭了"], p:1 },
    { q:"Traduisez : « J'ai été en Chine. »", a:["我去过中国"], p:1 },
    { q:"Traduisez : « Je suis en train d'étudier. »", a:["我正在学习","我在学习"], p:1 }
  ]
},


// ============================================================
// EXAMEN MODULE 8
// ============================================================

e8: {
  ev: [
    { q:"Quel mot signifie « plus que » dans une comparaison ?", a:["比"], p:.5 },
    { q:"Quel mot signifie « le plus » ?", a:["最"], p:.5 },
    { q:"Quel mot signifie « de plus en plus » ?", a:["越来越"], p:.5 },
    { q:"Traduisez : « Je suis plus grand que lui. »", a:["我比他高"], p:1 },
    { q:"Traduisez : « Il est le plus grand. »", a:["他是最高的"], p:1 },
    { q:"Traduisez : « Mon chinois devient de mieux en mieux. »", a:["我的中文越来越好"], p:1 }
  ]
},


// ============================================================
// EXAMEN MODULE 9
// ============================================================

e9: {
  ev: [
    { q:"Comment dit-on école ?", a:["学校"], p:.5 },
    { q:"Comment dit-on entreprise ?", a:["公司"], p:.5 },
    { q:"Comment dit-on restaurant ?", a:["饭店"], p:.5 },
    { q:"Comment dit-on hôpital ?", a:["医院"], p:.5 },
    { q:"Comment dit-on aéroport ?", a:["机场"], p:.5 },
    { q:"Traduisez : « Je suis à l'école. »", a:["我在学校"], p:1 },
    { q:"Traduisez : « Il est à l'entreprise. »", a:["他在公司"], p:1 }
  ]
},


// ============================================================
// EXAMEN MODULE 10 — A1
// ============================================================

e10: {
  ev: [
    { q:"Comment dit-on « je m'appelle » ?", a:["我叫"], p:.5 },
    { q:"Traduisez : « Je suis français. »", a:["我是法国人"], p:1 },
    { q:"Traduisez : « Je suis étudiant. »", a:["我是学生"], p:1 },
    { q:"Traduisez : « J'aime le sport. »", a:["我喜欢运动"], p:1 },
    { q:"Traduisez : « J'étudie le chinois. »", a:["我学习中文"], p:1 },
    { q:"Présentez-vous en chinois pendant 2 minutes.", a:["oral"], p:3 }
  ]
}

};