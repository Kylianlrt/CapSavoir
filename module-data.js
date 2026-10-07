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

/* ============================================================
   COMMENT AJOUTER DU CONTENU (voir AJOUTER-UN-COURS.md)
   add("espagnol", 6, C(leçon_html, vocabulaire, exemples, exercices, oral, évaluation));
   addModule("espagnol", "Module 3 — Titre", "Cours A|Cours B|Cours C");
   Les cours sont numérotés dans l'ordre, tous modules confondus.
   ============================================================ */
const add = (id, n, c) => (MODS[id].content[n] = c);
const addModule = (id, titre, titres) => MODS[id].plan.push([titre, titres]);

/* ---------- ESPAGNOL · Module 1 (cours 2 à 5) + Module 2 ---------- */
add("espagnol", 2, C("<h2>Los números</h2><p>0-20 : cero, uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez, once, doce, trece, catorce, quince, dieciséis, diecisiete, dieciocho, diecinueve, veinte.</p><div class='key'>Dizaines : treinta (30), cuarenta (40), cincuenta (50). De 31 à 99, on écrit en trois mots : <b>treinta y uno</b> (31).</div>",
  [["siete","sept"],["diez","dix"],["quince","quinze"],["veinte","vingt"],["treinta y cinco","trente-cinq"]],
  ["Tengo dos hermanos.","Mi número favorito es el siete.","Hay treinta y cinco alumnos en la clase."],
  [Q("Cuatro =",["3","4","5"],1),Q("« Dix » se dit…",["diez","doce","once"],0),T("Écrivez 15 en espagnol","quince")],
  "Comptez de 0 à 20 à voix haute, puis de 10 en 10 jusqu'à 100.",
  [Q("Seis =",["5","6","7"],1),Q("« Huit » =",["siete","ocho","nueve"],1),T("Écrivez 12 en espagnol","doce"),Q("40 =",["catorce","cuarenta","cincuenta"],1),T("Écrivez 31 en espagnol (3 mots)","treinta y uno")]));

add("espagnol", 3, C("<h2>Presentarse</h2><p><b>Me llamo…</b> (je m'appelle), <b>Soy de…</b> (je suis de), <b>Tengo… años</b> (j'ai… ans), <b>Vivo en…</b> (j'habite à). Le verbe <b>ser</b> : soy, eres, es, somos, sois, son.</p><div class='key'>L'âge se dit avec <b>tener</b> (avoir) : « Tengo 20 años », jamais « Soy 20 años ».</div>",
  [["Me llamo","je m'appelle"],["Soy de Francia","je suis de France"],["Tengo veinte años","j'ai vingt ans"],["Vivo en Toulouse","j'habite à Toulouse"],["Mucho gusto","enchanté"]],
  ["Me llamo Pablo.","Soy de Francia y vivo en Toulouse.","Hola, me llamo Lucía, tengo veinte años y soy estudiante."],
  [Q("Pour dire son âge, on utilise…",["ser","tener","vivir"],1),T("Complétez : « ___ de Francia » (je suis)","soy"),Q("Mucho gusto =",["Au revoir","Enchanté","Merci"],1)],
  "Présentez-vous en 4 phrases : nom, âge, origine, ville.",
  [Q("Me llamo =",["J'habite","Je m'appelle","J'ai"],1),Q("« J'ai 25 ans » =",["Soy 25 años","Tengo 25 años","Vivo 25 años"],1),T("Complétez : « Vivo ___ Madrid »","en"),T("« Tu es » (ser) =","eres"),Q("Soy de Francia =",["Je suis de France","J'habite en France","J'aime la France"],0)]));

add("espagnol", 4, C("<h2>La familia</h2><p>padre, madre, hermano/a, abuelo/a, tío/a, primo/a, hijo/a. Possessifs : <b>mi</b> (mon/ma), <b>tu</b>, <b>su</b> ; au pluriel on ajoute -s : <i>mis hermanos</i>.</p><div class='key'>Le masculin pluriel désigne un groupe mixte : <b>los padres</b> = les parents, <b>los hermanos</b> = frères et sœurs.</div>",
  [["el padre","le père"],["la madre","la mère"],["el hermano","le frère"],["la abuela","la grand-mère"],["el primo","le cousin"]],
  ["Mi madre se llama Ana.","Tengo una hermana y dos primos.","Mis abuelos viven en un pueblo cerca del mar."],
  [Q("La abuela =",["La tante","La grand-mère","La cousine"],1),Q("« Mes frères et sœurs » =",["mis hermanos","mi hermanos","mis hermano"],0),T("« Le père » en espagnol (avec article)","el padre")],
  "Décrivez votre famille en quatre phrases.",
  [Q("Madre =",["Père","Mère","Fille"],1),Q("Tío =",["Oncle","Cousin","Grand-père"],0),T("« Ma mère » = ___ madre","mi"),Q("Los padres désigne…",["Les pères uniquement","Les parents","Les grands-parents"],1),T("« La cousine » = la ___","prima")]));

add("espagnol", 5, C("<h2>En el restaurante</h2><p>Pour commander : <b>Quisiera…</b> (je voudrais) ou <b>Quiero…</b> (je veux). Pour payer : <b>La cuenta, por favor</b>.</p><div class='key'>Dans un bar à tapas, on commande plusieurs <b>tapas</b> (petites portions) à partager.</div>",
  [["la carta","le menu"],["el agua","l'eau"],["la cuenta","l'addition"],["Quisiera…","je voudrais…"],["el camarero","le serveur"]],
  ["Una mesa para dos, por favor.","Quisiera una ensalada y agua, por favor.","Quiero un zumo y, de postre, un flan. La cuenta, por favor."],
  [Q("La cuenta =",["Le menu","L'addition","Le serveur"],1),Q("« Je voudrais » =",["Quisiera","Tengo","Soy"],0),T("« L'eau » en espagnol (sans article)","agua")],
  "Jouez la scène : demandez une table, commandez un plat et une boisson, demandez l'addition.",
  [Q("Carta =",["Menu","Addition","Boisson"],0),Q("Camarero =",["Cuisinier","Serveur","Client"],1),T("« L'addition » = la ___","cuenta"),Q("Pour demander poliment, on dit…",["Quiero ya","Quisiera…, por favor","Dame"],1),T("« S'il vous plaît » =","por favor")]));

addModule("espagnol", "Module 2 — Le quotidien", "Los verbos en -ar|Los verbos en -er / -ir|Ser y estar|La hora|La rutina diaria");

/* ---------- MATHS · Module 1 (cours 2 à 5) + Module 2 ---------- */
add("maths", 2, C("<h2>Simplifier une fraction</h2><p>On divise numérateur et dénominateur par le même nombre, idéalement leur <b>PGCD</b>. 12/18 : PGCD = 6, donc <b>2/3</b>.</p><div class='key'>Une fraction est irréductible quand seul 1 divise à la fois le haut et le bas.</div>",
  [["PGCD","plus grand diviseur commun"],["Irréductible","ne peut plus être simplifiée"],["12/18","= 2/3"],["10/15","= 2/3"],["Fractions égales","même valeur, écritures différentes"]],
  ["4/8 se simplifie en 1/2.","12/18 se simplifie en 2/3 (÷ 6).","Le PGCD de 24 et 36 est 12, donc 24/36 = 2/3."],
  [Q("Simplifiez 4/10",["2/5","1/3","4/5"],0),Q("PGCD de 12 et 18 ?",["3","6","9"],1),T("Simplifiez 9/12 (a/b)","3/4")],
  "Expliquez à voix haute comment simplifier 18/24.",
  [Q("6/9 =",["2/3","3/4","1/3"],0),Q("Une fraction irréductible…",["est supérieure à 1","ne peut plus être simplifiée","a un dénominateur pair"],1),T("Simplifiez 10/20 (a/b)","1/2"),Q("PGCD de 20 et 30 ?",["5","10","15"],1),T("Simplifiez 15/25 (a/b)","3/5")]));

add("maths", 3, C("<h2>Additionner et soustraire</h2><p>Même dénominateur : on additionne les numérateurs (2/7 + 3/7 = 5/7). Sinon on cherche un <b>dénominateur commun</b> : 1/3 + 1/4 = 4/12 + 3/12 = <b>7/12</b>.</p>",
  [["Dénominateur commun","multiple commun aux dénominateurs"],["1/3 + 1/4","7/12"],["2/5 + 1/5","3/5"],["3/4 − 1/2","1/4"],["PPCM","plus petit multiple commun"]],
  ["2/7 + 3/7 = 5/7.","1/3 + 1/4 = 7/12.","3/4 − 1/6 = 9/12 − 2/12 = 7/12."],
  [Q("2/5 + 1/5 =",["3/10","3/5","2/5"],1),Q("1/2 + 1/3 =",["5/6","2/5","1/5"],0),T("3/4 − 1/2 = ? (a/b)","1/4")],
  "Expliquez à voix haute comment calculer 1/3 + 1/4.",
  [Q("3/8 + 2/8 =",["5/8","5/16","6/8"],0),Q("1/2 + 1/4 =",["3/4","2/6","1/6"],0),T("2/3 − 1/3 = ? (a/b)","1/3"),Q("Plus petit dénominateur commun de 1/4 et 1/6 ?",["10","12","24"],1),T("1/2 + 1/6 = ? (a/b, simplifié)","2/3")]));

add("maths", 4, C("<h2>Multiplier et diviser</h2><p>Multiplier : numérateur × numérateur, dénominateur × dénominateur. Diviser par une fraction = multiplier par son <b>inverse</b> : 1/2 ÷ 3/4 = 1/2 × 4/3 = <b>2/3</b>.</p>",
  [["Inverse de 3/4","4/3"],["1/2 × 1/3","1/6"],["2/3 × 3/4","1/2"],["1/3 de 12","4"],["÷ une fraction","× son inverse"]],
  ["1/2 × 1/3 = 1/6.","2/3 de 15 = 15 × 2/3 = 10.","3/4 ÷ 3/8 = 3/4 × 8/3 = 2."],
  [Q("1/2 × 1/5 =",["1/10","2/7","1/7"],0),Q("Inverse de 2/5 ?",["5/2","2/5","−2/5"],0),T("Combien font 2/3 de 9 ?","6")],
  "Expliquez comment diviser 1/2 par 1/4.",
  [Q("3/5 × 1/2 =",["3/10","4/7","3/7"],0),Q("1/2 ÷ 1/4 =",["2","1/8","1/2"],0),T("Combien font 1/4 de 40 ?","10"),Q("Diviser par 3/4 revient à multiplier par…",["3/4","4/3","−3/4"],1),T("2/5 × 5/2 = ?","1")]));

add("maths", 5, C("<h2>Problèmes avec des fractions</h2><p>Méthode : 1) repérer le <b>tout</b> ; 2) traduire « la moitié, le tiers, les 3/4 de… » en multiplication ; 3) vérifier avec un ordre de grandeur.</p><div class='key'>« Les 3/5 de 40 » = 40 × 3/5 = 24.</div>",
  [["Le tout","la quantité de départ"],["La moitié","1/2"],["Le tiers","1/3"],["Les 3/4 de 20","15"],["Le reste","tout − partie"]],
  ["La moitié de 30 est 15.","Les 3/5 de 40 sont 24.","Léa dépense 1/4 de 60 €, puis 1/3 du reste : 15 € puis 15 €. Il lui reste 30 €."],
  [Q("Le tiers de 24 ?",["6","8","12"],1),T("Les 3/4 de 20 ?","15"),Q("Il reste 2/5 de 50 €. Combien ?",["10 €","20 €","25 €"],1)],
  "Énoncez et résolvez à voix haute un problème avec « les 2/3 de 30 ».",
  [Q("La moitié de 50 ?",["20","25","30"],1),T("Les 2/3 de 30 ?","20"),Q("Livre de 200 pages, tu en lis 1/4. Reste ?",["50","150","100"],1),T("Le cinquième de 35 ?","7"),Q("Les 3/10 de 100 ?",["30","3","33"],0)]));

addModule("maths", "Module 2 — Pourcentages et proportionnalité", "Calculer un pourcentage|Augmentation et réduction|Proportionnalité|Échelles et vitesses|Problèmes");

const PARCOURS = MODS[new URLSearchParams(location.search).get("t")] || MODS.chinois;