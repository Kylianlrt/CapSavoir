const MODS = {};
const Q = (q, o, c, e) => ({ q, o, c, e }), T = (q, a, e) => ({ q, a: [].concat(a), e });
const C = (l, v, x, ex, oral, ev) => ({ l, v, x, ex, oral, ev: ev.map(q => ({ ...q, p: 4 })) });
const mod = (id, nom, lang, plan, c1) => MODS[id] = { id, store: "m-" + id, pct: "pm-" + id, tech: false, unite: "Cours", lang,
  eyebrow: "Parcours · " + nom, titre: nom, lead: "Validez chaque évaluation avec <b>15/20</b> pour débloquer la suite.",
  steps: ["Leçon", "Vocabulaire", "Exemples", "Exercices", "Oral", "Évaluation"], plan: [[plan[0], plan[1]]], content: { 1: c1 } };

mod("chinois", "Chinois", "zh-CN", ["Module 1 — Premiers mots", "Se saluer|Les nombres|Se présenter|La famille|Au restaurant"],
 C("<h2>Se saluer en chinois</h2><p>Le mandarin se note en <b>pinyin</b> et utilise <b>4 tons</b> : le ton change le sens du mot.</p><div class='key'>你好 (nǐ hǎo) = bonjour. 谢谢 (xièxie) = merci.</div>",
  [["你好","Nǐ hǎo · bonjour"],["谢谢","Xièxie · merci"],["再见","Zàijiàn · au revoir"],["对不起","Duìbuqǐ · désolé"],["我叫","Wǒ jiào · je m'appelle"]],
  ["你好！","你好，我叫安娜。","谢谢你，再见！"],
  [Q("Comment dit-on « merci » ?",["谢谢","再见","你好"],0),Q("Combien de tons en mandarin ?",["2","4","6"],1),Q("Que signifie 再见 ?",["Bonjour","Au revoir","Pardon"],1)],
  "Répétez à voix haute les 5 mots en imitant l'audio, puis présentez-vous en chinois.",
  [Q("你好 signifie…",["Merci","Bonjour","Désolé"],1),Q("« Désolé » se dit…",["对不起","谢谢","再见"],0),Q("我叫 sert à…",["Dire au revoir","Dire son nom","Remercier"],1),Q("Le pinyin est…",["Une écriture phonétique en lettres latines","Un ton","Un idéogramme"],0),T("Écrivez « bonjour » en pinyin",["nǐ hǎo","ni hao","nihao"])]));

mod("espagnol", "Espagnol", "es-ES", ["Module 1 — Premiers pas", "Saludos|Los números|Presentarse|La familia|En el restaurante"],
 C("<h2>Saludos</h2><p>En espagnol, on se salue selon le moment : <b>buenos días</b> (matin), <b>buenas tardes</b>, <b>buenas noches</b>. Les questions s'ouvrent avec <b>¿</b>.</p>",
  [["Hola","bonjour"],["Gracias","merci"],["Adiós","au revoir"],["Por favor","s'il vous plaît"],["¿Cómo estás?","comment vas-tu ?"]],
  ["Hola.","Hola, me llamo Marta.","¿Cómo estás? Muy bien, gracias."],
  [Q("« Merci » se dit…",["Gracias","Adiós","Hola"],0),Q("Quel signe ouvre une question ?",["?","¿","¡"],1),Q("Buenos días signifie…",["Bonne nuit","Bonjour (matin)","Au revoir"],1)],
  "Dites bonjour, demandez comment ça va et remerciez, à voix haute.",
  [Q("Adiós =",["Bonjour","Au revoir","Merci"],1),Q("Por favor =",["Pardon","S'il vous plaît","Merci"],1),Q("Me llamo Marta =",["Je m'appelle Marta","J'habite à Marta","Je vais bien"],0),T("Traduisez « merci » en espagnol","gracias"),Q("Buenas noches se dit…",["le matin","l'après-midi","le soir/la nuit"],2)]));

mod("francais", "Français", "fr-FR", ["Module 1 — Conjugaison de base", "Être et avoir|Les verbes en -er|Le passé composé|L'accord du participe|Les connecteurs"],
 C("<h2>Être et avoir au présent</h2><p><b>Être</b> : je suis, tu es, il est, nous sommes, vous êtes, ils sont.<br><b>Avoir</b> : j'ai, tu as, il a, nous avons, vous avez, ils ont.</p><div class='key'>Ce sont les deux auxiliaires du passé composé.</div>",
  [["je suis","être"],["tu as","avoir"],["nous sommes","être"],["ils ont","avoir"],["vous êtes","être"]],
  ["Je suis content.","Nous avons un chien.","Ils sont partis et elles ont mangé."],
  [Q("« Nous ___ en retard »",["avons","sommes","êtes"],1),Q("« Ils ___ faim »",["sont","ont","a"],1),T("Complétez : « Tu ___ raison » (avoir)","as")],
  "Lisez à voix haute les six formes d'être puis d'avoir sans regarder.",
  [Q("« Vous ___ prêts »",["avez","êtes","ont"],1),Q("« J'___ un livre »",["ai","suis","est"],0),T("« Elle ___ gentille » (être)","est"),Q("Auxiliaire de « aller » au passé composé ?",["avoir","être","aucun"],1),T("« Nous ___ un projet » (avoir)","avons")]));

mod("orthographe", "Orthographe", "fr-FR", ["Module 1 — Les homophones", "a / à|et / est|son / sont|ce / se|on / ont"],
 C("<h2>a ou à ?</h2><p><b>a</b> = verbe avoir (remplaçable par <i>avait</i>). <b>à</b> = préposition (lieu, temps).</p><div class='key'>Test : « Il a faim » → « Il avait faim » ✓ donc <b>a</b>.</div>",
  [["Il a faim","verbe avoir"],["Je vais à Paris","préposition"],["Elle a un chat","verbe avoir"],["À demain","préposition"],["Il pense à toi","préposition"]],
  ["Marie a un frère.","Je vais à l'école.","Il a appris à nager."],
  [T("Il ___ froid (a/à)","a"),T("Nous allons ___ Lyon (a/à)","à"),Q("Test pour « a » ?",["Remplacer par avait","Remplacer par était","Ajouter un s"],0)],
  "Dictez-vous trois phrases avec a et à, puis vérifiez l'orthographe.",
  [T("Elle ___ mal à la tête (a/à)","a"),T("Il pense ___ lui (a/à)","à"),Q("« à » est…",["un verbe","une préposition","un nom"],1),T("Marc ___ gagné (a/à)","a"),T("Rendez-vous ___ 8 h (a/à)","à")]));

mod("coderoute", "Code de la route", "fr-FR", ["Module 1 — Règles essentielles", "Priorités|Vitesses|Distances de sécurité|Alcool et stupéfiants|Panneaux"],
 C("<h2>Les priorités</h2><p>Sans panneau, la <b>priorité à droite</b> s'applique. Le panneau <b>STOP</b> impose l'arrêt complet, le <b>cédez le passage</b> impose de ralentir et laisser passer.</p><div class='key'>Vitesse en agglomération : <b>50 km/h</b> par défaut.</div>",
  [["Priorité à droite","règle par défaut aux intersections"],["STOP","arrêt complet obligatoire"],["Cédez le passage","laisser passer les autres"],["Agglomération","50 km/h par défaut"],["Distance de sécurité","au moins 2 secondes"]],
  ["Sans signalisation, je laisse passer le véhicule venant de ma droite.","Au STOP, je m'arrête complètement.","Je garde deux secondes avec le véhicule devant moi."],
  [Q("Que signifie STOP ?",["Ralentir","Arrêt complet","Priorité"],1),Q("Vitesse par défaut en agglomération ?",["30","50","70"],1),Q("Intervalle de sécurité minimal ?",["2 secondes","5 secondes","1 seconde"],0)],
  "Expliquez à voix haute qui est prioritaire à une intersection sans panneau.",
  [Q("Sans panneau, qui passe en premier ?",["Celui de gauche","Celui de droite","Le plus rapide"],1),Q("Cédez le passage impose…",["De s'arrêter toujours","De laisser passer","D'accélérer"],1),Q("Limite par défaut en ville ?",["50 km/h","70 km/h","90 km/h"],0),Q("Taux d'alcool maximal (permis normal) ?",["0,2 g/L","0,5 g/L","0,8 g/L"],1),T("Au STOP, l'arrêt est… (complet/partiel)","complet")]));

mod("culture", "Culture générale", "fr-FR", ["Module 1 — Capitales d'Europe", "Capitales d'Europe|Fleuves et montagnes|Grands peintres|Inventions|Pays du monde"],
 C("<h2>Les capitales d'Europe</h2><p>Connaître les capitales est la base de la géographie. Retenez-les par groupes : péninsule ibérique, Europe centrale, nord.</p>",
  [["Madrid","Espagne"],["Rome","Italie"],["Lisbonne","Portugal"],["Varsovie","Pologne"],["Vienne","Autriche"]],
  ["Madrid est la capitale de l'Espagne.","Rome est traversée par le Tibre.","Vienne est la capitale de l'Autriche."],
  [Q("Capitale de l'Italie ?",["Milan","Rome","Naples"],1),Q("Capitale du Portugal ?",["Porto","Lisbonne","Madrid"],1),T("Capitale de l'Espagne ?","Madrid")],
  "Citez dix capitales européennes en une minute.",
  [Q("Capitale de la Pologne ?",["Varsovie","Cracovie","Prague"],0),Q("Capitale de l'Autriche ?",["Berne","Vienne","Budapest"],1),T("Capitale du Portugal ?","Lisbonne"),T("Capitale de l'Italie ?","Rome"),Q("Capitale de l'Espagne ?",["Barcelone","Séville","Madrid"],2)]));

mod("histoire", "Histoire-Géographie", "fr-FR", ["Module 1 — La Révolution française", "Les causes|1789|La République|La Terreur|Napoléon"],
 C("<h2>1789 : la Révolution</h2><p>Le <b>14 juillet 1789</b>, la Bastille est prise. En août, la <b>Déclaration des droits de l'homme et du citoyen</b> proclame l'égalité des droits. La République est proclamée en <b>1792</b>.</p>",
  [["14 juillet 1789","prise de la Bastille"],["Août 1789","Déclaration des droits"],["Louis XVI","roi de France"],["1792","naissance de la Ire République"],["Tiers état","90 % de la population"]],
  ["La Bastille tombe le 14 juillet 1789.","La Déclaration proclame que les hommes naissent libres et égaux.","La République est proclamée en 1792."],
  [Q("Date de la prise de la Bastille ?",["1789","1792","1804"],0),Q("Roi pendant la Révolution ?",["Louis XIV","Louis XVI","Napoléon"],1),T("Année de proclamation de la République ?","1792")],
  "Racontez en 1 minute les événements de 1789.",
  [Q("La Bastille est prise en…",["1789","1815","1848"],0),Q("La Déclaration des droits date de…",["1789","1799","1830"],0),T("Qui était roi de France en 1789 ? (nom)",["Louis XVI","louis 16"]),Q("Le tiers état représente…",["La noblesse","Le clergé","Le peuple"],2),Q("La Ire République naît en…",["1792","1804","1870"],0)]));

mod("maths", "Mathématiques", "fr-FR", ["Module 1 — Les fractions", "Comprendre les fractions|Simplifier|Additionner|Multiplier|Problèmes"],
 C("<h2>Les fractions</h2><p>Une fraction a/b : <b>a</b> = numérateur, <b>b</b> = dénominateur. Pour additionner, mettez au même dénominateur : 1/2 + 1/4 = 2/4 + 1/4 = <b>3/4</b>.</p><div class='key'>Pour multiplier : numérateur × numérateur, dénominateur × dénominateur.</div>",
  [["1/2 + 1/4","3/4"],["6/8","se simplifie en 3/4"],["2/3 × 3/5","2/5"],["Numérateur","le nombre du haut"],["Dénominateur","le nombre du bas"]],
  ["Un demi plus un quart font trois quarts.","Six huitièmes égalent trois quarts.","Trois quarts de vingt font quinze."],
  [Q("1/2 + 1/4 = ?",["2/6","3/4","1/6"],1),Q("Simplifiez 6/8",["3/4","2/3","1/2"],0),T("Combien font 3/4 de 20 ?","15")],
  "Expliquez à voix haute comment additionner deux fractions.",
  [Q("Le dénominateur est…",["En haut","En bas","Le résultat"],1),Q("1/3 + 1/3 = ?",["2/3","2/6","1/3"],0),Q("2/3 × 3/5 = ?",["2/5","5/8","6/8"],0),T("Simplifiez 4/8 (a/b)","1/2"),Q("1/2 est égal à…",["2/4","1/4","3/4"],0)]));

const PARCOURS = MODS[new URLSearchParams(location.search).get("t")] || MODS.chinois;
