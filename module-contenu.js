/* ---- Diagnostic : toute erreur de chargement s'affiche en rouge en haut de la page ---- */
window.__errs = window.__errs || [];
addEventListener("error", ev => { window.__errs.push((ev.filename || "").split("/").pop() + " : " + ev.message); });

/* ---- Filet de sécurité : si module-data.js est absent, on fournit le minimum ---- */
if (typeof MODS === "undefined") window.MODS = {};
if (typeof Q === "undefined") window.Q = (q, o, c) => ({ q, o, c });
if (typeof T === "undefined") window.T = (q, a) => ({ q, a: Array.isArray(a) ? a : [a] });
if (typeof C === "undefined") window.C = (l, v, x, ex, oral, ev) => ({ l, v, x, ex, oral, ev });
if (typeof mod === "undefined") window.mod = (id, nom, lang) => {
  const t = (typeof THEMES !== "undefined" && THEMES.find(x => x.id === id)) || {};
  MODS[id] = { id, store: "p-" + id, pct: t.pct || "pm-" + id, tech: false, unite: "Cours", lang: lang || "fr-FR",
    eyebrow: "Parcours progressif", titre: "Formation : " + (nom || id),
    lead: "Validez chaque évaluation avec <b>15/20</b> pour débloquer la suite.",
    steps: ["Leçon", "Vocabulaire", "Exemples", "Exercices", "Oral", "Évaluation"], plan: [], content: {} };
};

/* =====================================================================
   MOTEUR DES COURS (ne plus y mettre de contenu : voir contenu-langues.js et contenu-savoirs.js)

   cours("espagnol", `
   === Nom du module                  (facultatif : sinon dernier module)
   --- Titre du cours
   ## Titre de la leçon               (une ligne = un paragraphe ; **gras** ; "! " = encadré)
   @vocab
   mot = traduction
   @exemples
   Phrase simple.                     (3 lignes : simple, moyenne, avancée)
   @exercices
   ? Question QCM | Bonne réponse* | Mauvaise | Mauvaise
   ? Question libre = réponse / variante
   @oral
   Consigne orale.
   @eval                              (facultatif : sinon reprend les exercices)
   ? ...
   `);
   ===================================================================== */

function cours(id, txt) {
  let m = MODS[id];
  if (!m) { // thème déclaré dans data.js mais sans module : on le crée
    const t = THEMES.find(x => x.id === id) || { nom: id.charAt(0).toUpperCase() + id.slice(1) };
    if (!THEMES.some(x => x.id === id)) console.warn("Thème « " + id + " » absent de data.js : il n'apparaîtra pas sur l'accueil.");
    mod(id, t.nom, t.lang || "fr-FR", ["", ""], null); m = MODS[id]; m.plan = []; m.content = {};
  }
  const B = s => s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  const lecon = L => L.map(s => s.startsWith("## ") ? `<h2>${B(s.slice(3))}</h2>` : s.startsWith("! ") ? `<div class='key'>${B(s.slice(2))}</div>` : `<p>${B(s)}</p>`).join("");
  const sans = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const quest = s => {
    s = s.replace(/^\?\s*/, "");
    if (s.includes(" | ")) { const p = s.split(" | ").map(x => x.trim()), o = p.slice(1); return Q(p[0], o.map(x => x.replace(/\*$/, "")), Math.max(0, o.findIndex(x => x.endsWith("*")))); }
    const i = s.lastIndexOf(" = "); if (i < 0) { console.warn("Question ignorée (il faut ' | ' ou ' = ') : " + s); return null; }
    const a = s.slice(i + 3).split(" / ").map(x => x.trim());
    return T(s.slice(0, i).trim(), [...new Set([...a, ...a.map(sans)])]); // accents facultatifs à la saisie
  };
  const qs = L => L.map(quest).filter(Boolean);
  const paires = L => L.map(s => { const i = s.indexOf(" = "); return i < 0 ? [s, ""] : [s.slice(0, i), s.slice(i + 3)]; });
  const isEx = t => /^Examen du/.test(t), cnt = p => p[1] ? p[1].split("|").filter(t => !isEx(t)).length : 0;

  function placer(c, modTitre) {
    if (modTitre && !m.plan.some(p => p[0] === modTitre)) m.plan.push([modTitre, ""]);
    if (!m.plan.length) m.plan.push(["Module 1", ""]);
    const mi = modTitre ? m.plan.findIndex(p => p[0] === modTitre) : m.plan.length - 1, mp = m.plan[mi];
    let titres = mp[1] ? mp[1].split("|") : [], j = titres.indexOf(c.t);
    if (j < 0) { if (mi !== m.plan.length - 1) return console.warn("Cours « " + c.t + " » ignoré : ajoutez-le d'abord au plan de ce module."); titres.push(c.t); mp[1] = titres.join("|"); j = titres.length - 1; }
    const n = isEx(c.t) ? "e" + (mi + 1) : m.plan.slice(0, mi).reduce((s, p) => s + cnt(p), 0) + titres.slice(0, j).filter(t => !isEx(t)).length + 1;
    const x = c.x.slice(); while (x.length < 3) x.push(x[x.length - 1] || "");
    const ex = qs(c.ex);
    m.content[n] = C(lecon(c.l), paires(c.v), x, ex, c.oral.join(" "), c.ev.length ? qs(c.ev) : ex.map(q => ({ ...q })));
  }

  let modT = null, c = null, sec = "l";
  const fin = () => { if (c) placer(c, modT); c = null; };
  txt.split("\n").forEach(raw => {
    const s = raw.trim();
    if (s.startsWith("===")) { fin(); modT = s.slice(3).trim(); return; }
    if (s.startsWith("---")) { fin(); c = { t: s.slice(3).trim(), l: [], v: [], x: [], ex: [], oral: [], ev: [] }; sec = "l"; return; }
    const mm = s.match(/^@(\w+)/);
    if (c && mm) { sec = { vocab: "v", exemples: "x", exercices: "ex", oral: "oral", eval: "ev" }[mm[1]] || sec; return; }
    if (c && s) c[sec].push(s);
  });
  fin();
}


/* ======== contenu-langues.js ======== */
/* ---------- ITALIEN ---------- */
cours("italien", `
=== Module 1 — Premiers pas
--- Saluer et se présenter
## Les salutations
**Ciao** = salut (informel, arrivée et départ). **Buongiorno** = bonjour (jusqu'en début d'après-midi). **Buonasera** = bonsoir. **Arrivederci** = au revoir (poli).
Pour se présenter : **Mi chiamo Marco** (je m'appelle Marco) ou **Sono Marco**. On répond à « Come stai ? » par « Sto bene, grazie ».
! Tu = Come stai ? · Vous (politesse) = Come sta ? · Enchanté = Piacere.
@vocab
ciao = salut / au revoir
buongiorno = bonjour
buonasera = bonsoir
grazie = merci
per favore = s'il vous plaît
@exemples
Ciao, mi chiamo Marco.
Buongiorno, come sta? Sto bene, grazie.
Piacere di conoscerla, sono francese e abito a Lione.
@exercices
? « Merci » | grazie* | prego | scusi
? « Bonsoir » = buonasera
? « Je m'appelle Anna » | Mi chiamo Anna* | Ho nome Anna | Sono chiamo Anna
@oral
Présentez-vous à voix haute en italien : nom, ville, et une salutation de politesse.
@eval
? « Prego » signifie | de rien / je vous en prie* | merci | pardon
? « Comment vas-tu ? » | Come stai?* | Come sta? | Come si chiama?
? « Enchanté » = piacere
? « Bonjour » (le matin) = buongiorno
? « Au revoir » (poli) | Arrivederci* | Buonasera | Grazie
--- Les articles et le verbe essere
## Les articles définis et indéfinis
Masculin : **il** (devant consonne), **lo** (devant s+consonne, z, gn, ps), **l'** (devant voyelle). Féminin : **la**, **l'**. Pluriels : **i, gli, le**.
Indéfinis : **un, uno, una, un'**. Le choix suit la même logique que pour les définis.
! Essere : sono, sei, è, siamo, siete, sono.
@vocab
il libro = le livre
la casa = la maison
lo zaino = le sac à dos
l'amico = l'ami
gli amici = les amis
@exemples
Sono italiano.
La casa è grande e il giardino è bello.
Siamo amici e gli studenti sono in classe.
@exercices
? « Je suis » | sono* | sei | è
? ___ zaino (le) | lo* | il | la
? « Tu es » = sei
@oral
Conjuguez « essere » à voix haute aux six personnes, puis dites trois phrases avec « il », « la » et « lo ».
@eval
? « Nous sommes » = siamo
? ___ amico (l') | l'* | il | lo
? « Elle est » | è* | sei | siamo
? ___ casa (la) = la
? ___ studente | lo* | il | la
--- Les verbes en -are
## Le présent des verbes en -are
Terminaisons : **-o, -i, -a, -iamo, -ate, -ano**. Parlare : parlo, parli, parla, parliamo, parlate, parlano.
Le pronom sujet est souvent omis : « Parlo italiano » suffit.
! Attention : à la 1re personne du pluriel, on termine toujours par -iamo.
@vocab
parlare = parler
mangiare = manger
abitare = habiter
lavorare = travailler
studiare = étudier
@exemples
Parlo italiano.
Lavoriamo a Milano e abitiamo vicino al centro.
Marco studia francese mentre i suoi amici mangiano la pizza.
@exercices
? « Nous parlons » | parliamo* | parlate | parlano
? « Tu habites » (abitare) = abiti
? « Ils travaillent » | lavorano* | lavora | lavoriamo
@oral
Conjuguez parlare, mangiare et abitare aux six personnes.
@eval
? « Je mange » (mangiare) = mangio
? « Vous parlez » | parlate* | parliamo | parli
? « Elle étudie » (studiare) = studia
? Terminaison de « noi » | -iamo* | -ate | -ano
? Loro ___ (abitare) = abitano
=== Module 2 — Le quotidien
--- Les nombres et l'heure
## Compter et dire l'heure
1 uno, 2 due, 3 tre, 4 quattro, 5 cinque, 6 sei, 7 sette, 8 otto, 9 nove, 10 dieci, 20 venti, 100 cento.
« Quelle heure est-il ? » = **Che ore sono ?** On répond **Sono le tre** (3 h), mais **È l'una** (1 h), **È mezzogiorno** (midi), **È mezzanotte** (minuit).
! e mezza = et demie · e un quarto = et quart · meno un quarto = moins le quart.
@vocab
tre = trois
sette = sept
dieci = dix
venti = vingt
cento = cent
@exemples
Ho dieci euro.
Sono le tre e mezza.
Il treno parte alle otto e un quarto e arriva a mezzogiorno.
@exercices
? « 7 » | sette* | sei | otto
? « Il est trois heures » = sono le tre
? « 10 » | dieci* | due | dodici
@oral
Comptez de 1 à 10 à voix haute, puis dites l'heure qu'il est maintenant.
@eval
? « 4 » = quattro
? « È l'una » signifie | il est une heure* | il est midi | il est minuit
? « 20 » = venti
? « 8 » | otto* | nove | sette
? « mezzogiorno » = midi
--- Au restaurant
## Commander poliment
Pour commander, on utilise le conditionnel de politesse : **Vorrei un caffè, per favore** (je voudrais un café). Pour demander la note : **Il conto, per favore** ou **Ci porta il conto ?**
On appelle le serveur avec **Scusi !**
! Vorrei = je voudrais (poli) · Voglio = je veux (trop direct).
@vocab
il conto = l'addition
l'acqua = l'eau
il cameriere = le serveur
il pane = le pain
il vino = le vin
@exemples
Vorrei un caffè.
Per me una pizza margherita e dell'acqua, per favore.
Scusi, ci porta il conto? Abbiamo mangiato benissimo.
@exercices
? « Je voudrais » | vorrei* | voglio | vado
? « L'addition » = il conto
? « Le serveur » | il cameriere* | il conto | il vino
@oral
Jouez une commande complète : saluer, commander deux plats et une boisson, demander l'addition.
@eval
? « Il pane » | le pain* | le vin | le lait
? « Je voudrais du vin » = vorrei del vino
? « Ci porta il conto ? » demande | l'addition* | le menu | un café
? Pour commander poliment, on dit | Vorrei* | Voglio | Dammi
? « L'acqua » = l'eau / eau
--- Le passé composé
## Il passato prossimo
Formation : **avere** ou **essere** au présent + participe passé. Participes : -are → **-ato**, -ere → **-uto**, -ire → **-ito**.
Avec **essere** (verbes de mouvement : andare, venire, partire), le participe s'accorde : « Maria è andata ».
! Ho parlato · Abbiamo finito · Sono andato (il) / Sono andata (elle).
@vocab
ho mangiato = j'ai mangé
ho parlato = j'ai parlé
sono andato = je suis allé
abbiamo finito = nous avons fini
ha ricevuto = il a reçu
@exemples
Ho mangiato la pizza.
Ieri abbiamo parlato con Anna.
Maria è andata al mercato e ha comprato del pane.
@exercices
? « J'ai parlé » | ho parlato* | sono parlato | ho parlo
? Participe de mangiare = mangiato
? « Nous avons fini » | abbiamo finito* | siamo finito | abbiamo finire
@oral
Racontez votre journée d'hier en cinq phrases au passato prossimo.
@eval
? Participe de finire = finito
? « Il est allé » | è andato* | ha andato | è andare
? Participe de ricevere = ricevuto
? Auxiliaire de andare | essere* | avere | aucun
? « Tu as parlé » = hai parlato
`);

/* ---------- ESPAGNOL ---------- */
cours("espagnol", `
=== Module 2 — Le quotidien
--- Los verbos en -ar
## Les verbes en -ar
Les verbes en **-ar** (hablar, trabajar, estudiar) prennent ces terminaisons : **-o, -as, -a, -amos, -áis, -an**.
! Hablar : hablo, hablas, habla, hablamos, habláis, hablan.
Le pronom sujet (yo, tú…) est souvent omis : « Hablo francés » suffit.
@vocab
hablar = parler
trabajar = travailler
estudiar = étudier
cantar = chanter
bailar = danser
@exemples
Hablo francés.
Ella trabaja en Toulouse y estudia inglés.
Nosotros cantamos y bailamos todos los sábados.
@exercices
? « Nous parlons » | hablamos* | hablan | hablo
? « Tu travailles » (trabajar) = trabajas
? Terminaison pour « ellos » | -an* | -as | -o
@oral
Conjuguez à voix haute hablar, trabajar et estudiar aux six personnes.
@eval
? « Je parle » (hablar) | hablo* | hablas | habla
? Ellos ___ (trabajar) | trabajan* | trabaja | trabajamos
? « Vous (vosotros) étudiez » = estudiáis
? Terminaison pour « nosotros » | -amos* | -emos | -an
? « Elle chante » (cantar) = canta
=== Module 3 — Aller plus loin
--- Ser et estar
## Deux verbes pour « être »
**Ser** : identité, origine, profession, caractère. **Estar** : lieu, état, émotion du moment.
Ser : soy, eres, es, somos, sois, son. Estar : estoy, estás, está, estamos, estáis, están.
! Soy médico (profession) · Estoy cansado (état du moment) · Estamos en Madrid (lieu).
@vocab
ser = être (identité)
estar = être (état, lieu)
cansado = fatigué
contento = content
médico = médecin
@exemples
Soy médico.
Estoy cansada porque trabajo mucho.
Madrid es una ciudad grande, pero hoy estamos en Sevilla.
@exercices
? « Je suis médecin » | Soy médico* | Estoy médico | Es médico
? « Il est fatigué » (état) | Está cansado* | Es cansado | Está cansar
? « Nous sommes à Madrid » = Estamos en Madrid
@oral
Décrivez-vous avec « ser » (qui vous êtes) puis avec « estar » (comment vous allez aujourd'hui).
@eval
? « Elle est espagnole » | Es española* | Está española | Son española
? « Je suis content » (aujourd'hui) | Estoy contento* | Soy contento | Es contento
? « Tu es à la maison » | Estás en casa* | Eres en casa | Es en casa
? « Ils sont professeurs » | Son profesores* | Están profesores | Es profesores
? Ser sert à exprimer | l'identité* | la fatigue momentanée | la position
--- Los números y la hora
## Compter et dire l'heure
1 uno, 2 dos, 3 tres, 4 cuatro, 5 cinco, 6 seis, 7 siete, 8 ocho, 9 nueve, 10 diez, 20 veinte, 100 cien.
« Quelle heure est-il ? » = **¿Qué hora es?** Réponse : **Es la una** (1 h), **Son las tres** (3 h), **Es mediodía**.
! y media = et demie · y cuarto = et quart · menos cuarto = moins le quart.
@vocab
cinco = cinq
diez = dix
veinte = vingt
cien = cent
la hora = l'heure
@exemples
Tengo diez euros.
Son las cuatro y media.
El tren sale a las ocho y cuarto y llega a mediodía.
@exercices
? « 7 » | siete* | seis | ocho
? « Il est trois heures » | Son las tres* | Es las tres | Son tres
? « 20 » = veinte
@oral
Comptez de 1 à 10, puis donnez l'heure actuelle en espagnol.
@eval
? « 4 » = cuatro
? « Il est une heure » | Es la una* | Son la una | Es las una
? « 9 » | nueve* | nuevo | diez
? « 100 » = cien
? « Midi » = mediodía
--- El pretérito perfecto
## Le passé composé espagnol
Formation : **haber** (he, has, ha, hemos, habéis, han) + participe passé : -ar → **-ado**, -er / -ir → **-ido**.
Le participe ne s'accorde jamais avec haber : « Han llegado ».
! He hablado · Hemos comido · Han vivido.
@vocab
he comido = j'ai mangé
has hablado = tu as parlé
ha vivido = il a vécu
hemos viajado = nous avons voyagé
han llegado = ils sont arrivés
@exemples
He hablado con Ana.
Hoy hemos comido paella en casa.
Mis padres han viajado mucho y ya han visitado Perú.
@exercices
? « J'ai parlé » | he hablado* | has hablado | ha hablado
? Participe de comer = comido
? « Nous avons voyagé » | hemos viajado* | habemos viajado | hemos viajar
@oral
Dites cinq choses que vous avez faites aujourd'hui avec « he / hemos ».
@eval
? Participe de vivir = vivido
? « Ils ont mangé » = han comido
? « Tu as parlé » | has hablado* | he hablado | han hablado
? Auxiliaire du pretérito perfecto | haber* | ser | estar
? Participe de trabajar = trabajado
`);

/* ---------- FRANÇAIS ---------- */
cours("francais", `
--- Les verbes en -er
## Les verbes en -er au présent
Les verbes en **-er** (chanter, parler, aimer) se terminent par : **-e, -es, -e, -ons, -ez, -ent**.
! Chanter : je chante, tu chantes, il chante, nous chantons, vous chantez, ils chantent.
Attention : à la 3e personne du pluriel, le **-ent** ne se prononce pas.
@vocab
chanter = je chante
parler = ils parlent
aimer = nous aimons
manger = nous mangeons
commencer = nous commençons
@exemples
Je parle fort.
Tu aimes le chocolat.
Nous mangeons à midi et ils chantent dans la cour.
@exercices
? « Nous ___ » (chanter) = chantons
? « Ils parl___ » | -ent* | -es | -ez
? « Vous ___ » (aimer) = aimez
@oral
Conjuguez à voix haute « parler » au présent, sans regarder.
@eval
? Tu ___ (aimer) = aimes
? « Elle chant___ » | -e* | -es | -ent
? Orthographe correcte | nous mangeons* | nous mangons | nous mangeôns
? Ils ___ (parler) = parlent
? « Vous ___ » (chanter) = chantez

=== Expression et temps du récit
--- Imparfait et passé composé
## Deux temps pour raconter
**L'imparfait** (-ais, -ais, -ait, -ions, -iez, -aient) décrit, installe le décor ou exprime une habitude. **Le passé composé** raconte une action précise et achevée.
Dans « Il pleuvait quand je suis sorti », « pleuvait » est l'arrière-plan, « suis sorti » l'événement.
! Imparfait = ce qui dure ou se répète · Passé composé = ce qui arrive d'un coup.
@vocab
imparfait = temps du passé qui décrit ou répète
passé composé = temps de l'action achevée
auxiliaire = avoir ou être
radical = partie du verbe qui ne change pas
habitude = action répétée
@exemples
Il pleuvait quand je suis sorti.
Quand j'étais enfant, nous allions à la mer chaque été.
Elle lisait un roman lorsque le téléphone a sonné.
@exercices
? « Nous ___ » (chanter, imparfait) = chantions
? Quand j'étais petit, je ___ souvent dehors (jouer, imparfait) = jouais
? « Il lisait quand je suis entré » : « lisait » exprime | une action en cours, un décor* | une action brève | un futur
@oral
Racontez une journée de vacances en alternant description (imparfait) et événements (passé composé).
@eval
? « Tu ___ » (parler, imparfait) = parlais
? « Nous ___ » (finir, imparfait) = finissions
? Hier, j'ai ___ un film | vu* | voyais | voyé
? Chaque matin, elle ___ du café | buvait* | a bu | boira
? « Ils ___ » (avoir, imparfait) = avaient
--- Futur et conditionnel
## Parler de demain et d'hypothèses
**Futur** : infinitif + -ai, -as, -a, -ons, -ez, -ont. **Conditionnel présent** : même radical + -ais, -ais, -ait, -ions, -iez, -aient.
Radicaux irréguliers : être → **ser-**, avoir → **aur-**, aller → **ir-**, faire → **fer-**.
! Si + imparfait → conditionnel : « Si j'avais le temps, je voyagerais. »
@vocab
futur = temps de ce qui n'est pas encore arrivé
conditionnel = temps de l'hypothèse ou de la politesse
hypothèse = situation imaginée
politesse = « je voudrais » est plus poli que « je veux »
condition = ce qui doit se produire (introduit par si)
@exemples
Demain, je partirai tôt.
Si tu venais, nous irions au cinéma.
S'il faisait beau, nous mangerions dehors ; sinon, nous resterions à la maison.
@exercices
? « Je ___ » (chanter, futur) = chanterai
? Si j'avais le temps, je ___ (voyager, conditionnel) = voyagerais
? Radical du futur de « aller » | ir-* | all- | aill-
@oral
Annoncez trois projets pour l'an prochain (futur), puis trois rêves (conditionnel).
@eval
? « Tu ___ » (être, futur) = seras
? « Nous ___ » (avoir, futur) = aurons
? « Il ___ » (faire, conditionnel) = ferait
? Si tu étudiais, tu ___ (réussir, conditionnel) = réussirais
? « Je voudrais un café » est un conditionnel de | politesse* | colère | passé
--- L'accord du participe passé
## Accorder le participe passé
Avec **être** : le participe s'accorde avec le **sujet** (« Elle est partie »). Avec **avoir** : il s'accorde avec le **COD placé avant le verbe** (« Les fleurs que j'ai cueillies »).
Si le COD est après, pas d'accord : « J'ai cueilli des fleurs ».
! Pour trouver le COD : posez « quoi ? » ou « qui ? » après le verbe.
@vocab
participe passé = forme du verbe utilisée avec un auxiliaire
COD = complément d'objet direct
sujet = celui qui fait l'action
auxiliaire = être ou avoir
accord = marque du genre et du nombre
@exemples
Elle est arrivée.
Les pommes que j'ai mangées étaient bonnes.
Ils se sont lavés, puis elles se sont préparées.
@exercices
? « Elle est ___ » (partir) = partie
? « Les lettres que j'ai ___ » (écrire) = écrites
? « Ils sont ___ » (tomber) | tombés* | tombé | tombées
@oral
Expliquez à voix haute pourquoi on écrit « la lettre que j'ai lue » mais « j'ai lu la lettre ».
@eval
? « Nous (féminin) sommes ___ » (venir) = venues
? « Les photos que tu as ___ » (prendre) = prises
? « J'ai ___ la lettre » (lire) | lu* | lue | lus
? « La lettre que j'ai ___ » (lire) = lue
? Avec avoir, l'accord se fait avec le COD | placé avant le verbe* | placé après le verbe | jamais
`);

/* ---------- ORTHOGRAPHE ---------- */
cours("orthographe", `
=== Les homophones du quotidien
--- a / à, et / est, ou / où
## Trois paires à ne plus confondre
**a** est le verbe avoir (on peut dire « avait ») ; **à** est une préposition (« à Paris »).
**et** relie deux mots ; **est** est le verbe être (on peut dire « était »). **ou** signifie « ou bien » ; **où** indique le lieu ou le temps.
! Astuce : remplacez par « avait », « était » ou « ou bien » ; si la phrase reste correcte, c'est a, est ou ou.
@vocab
a = verbe avoir (il avait)
à = préposition (à Lyon)
et = conjonction (et puis)
est = verbe être (il était)
où = lieu ou temps
@exemples
Il a un chat.
Je vais à Paris et j'habite là-bas.
Où est le livre ? Sur la table ou sur le lit ?
@exercices
? Il ___ faim | a* | à | as
? Je vais ___ Lyon | à* | a | as
? ___ habites-tu ? | Où* | Ou | Oû
@oral
Dites quatre phrases en utilisant a, à, ou, où, puis expliquez votre astuce de remplacement.
@eval
? Elle ___ un vélo rouge | a* | à | as
? Nous allons ___ la plage | à* | a | as
? Du thé ___ du café ? | ou* | où | ouh
? ___ vas-tu ce soir ? | Où* | Ou | Oú
? Pierre ___ grand | est* | et | ai
--- son / sont, on / ont
## Deux pièges de plus
**sont** (être) peut devenir « étaient » ; **son** est un déterminant (remplaçable par « mon »). **ont** (avoir) peut devenir « avaient » ; **on** est un pronom (remplaçable par « il »).
! Ils sont contents · Son frère · Elles ont gagné · On ne sait pas.
@vocab
sont = verbe être (ils étaient)
son = déterminant (mon)
ont = verbe avoir (ils avaient)
on = pronom (il)
déterminant = mot qui précède un nom
@exemples
Son frère est gentil.
Ils sont contents et ils ont gagné.
On ne sait pas où ils ont mis leurs clés.
@exercices
? Ils ___ en retard | sont* | son | sons
? Elles ___ trois chats | ont* | on | ons
? ___ frère habite ici | Son* | Sont | Sons
@oral
Dites trois phrases avec « on » puis les mêmes avec « ils ont ».
@eval
? Ils ___ partis | sont* | son | sonts
? Elles ___ trois chats | ont* | on | ons
? ___ ami est là | Son* | Sont | Sons
? ___ ne sait jamais | On* | Ont | Ons
? Les enfants ___ gagné | ont* | on | sont
--- ces / ses, c'est / s'est
## Quatre homophones, quatre astuces
**ces** montre (« ces fleurs-là ») ; **ses** = « les siens » ; **c'est** = « cela est » ; **s'est** accompagne un verbe pronominal (« il s'est lavé »).
! Remplacez par « cela est » pour c'est ; par « s'était » pour s'est.
@vocab
ces = démonstratif (ces fleurs-là)
ses = possessif (les siens)
c'est = cela est
s'est = verbe pronominal (s'était)
pronominal = verbe avec un pronom réfléchi
@exemples
Ces fleurs sont belles.
Il a perdu ses clés.
C'est vrai qu'elle s'est trompée.
@exercices
? Il a perdu ___ clés | ses* | ces | c'est
? ___ fleurs sont belles | Ces* | Ses | S'est
? Elle ___ trompée | s'est* | c'est | ses
@oral
Construisez une phrase avec chacun des quatre mots.
@eval
? Il range ___ affaires (les siennes) | ses* | ces | s'est
? ___ fleurs-là sont belles | Ces* | Ses | Sais
? ___ vrai | C'est* | S'est | Ces
? Elle ___ levée tôt | s'est* | c'est | ses
? ___ enfants-ci jouent | Ces* | Ses | C'est
`);

/* ======== contenu-langues-2.js ======== */
/* ---------- ITALIEN (suite) ---------- */
cours("italien", `
=== Module 3 — Décrire et posséder
--- Les verbes en -ere et -ire
## Deux autres conjugaisons
-ere : leggere → leggo, leggi, legge, leggiamo, leggete, leggono. -ire : dormire → dormo, dormi, dorme, dormiamo, dormite, dormono.
Beaucoup de verbes en -ire prennent **-isc-** : finire → finisco, finisci, finisce, finiamo, finite, finiscono.
! Seules les personnes noi et voi gardent le radical simple (finiamo, finite).
@vocab
leggere = lire
scrivere = écrire
dormire = dormir
partire = partir
finire = finir
@exemples
Leggo un libro.
Marco dorme fino a tardi la domenica.
Finiamo il lavoro e partiamo per Roma.
@exercices
? « Je lis » | leggo* | leggi | legge
? « Il dort » (dormire) = dorme
? « Ils finissent » | finiscono* | finiamo | finite
@oral
Conjuguez leggere, dormire et finire à voix haute.
@eval
? « Tu écris » (scrivere) = scrivi
? « Nous partons » = partiamo
? « Elle finit » | finisce* | finiamo | finisci
? « Vous lisez » | leggete* | leggono | leggiamo
? « Ils dorment » = dormono
--- Avere et les possessifs
## Avoir et dire « mon, ton, son »
Avere : ho, hai, ha, abbiamo, avete, hanno. Possessifs : **mio, tuo, suo, nostro, vostro, loro**, avec article : il mio libro, la mia casa, i miei amici.
Pour la famille au singulier, on omet l'article : **mia madre**, mio padre.
! « Loro » ne change jamais : il loro cane, i loro cani.
@vocab
ho = j'ai
il mio libro = mon livre
la tua casa = ta maison
mia madre = ma mère
il nostro cane = notre chien
@exemples
Ho un fratello.
La mia casa è piccola ma la tua è grande.
Abbiamo un cane e i nostri amici hanno due gatti.
@exercices
? « Nous avons » | abbiamo* | avete | hanno
? « Mon livre » | il mio libro* | la mio libro | i mia libro
? « Ma mère » = mia madre
@oral
Présentez votre famille en cinq phrases avec mio, mia, miei.
@eval
? « Tu as » = hai
? « Ta maison » | la tua casa* | il tua casa | la tuo casa
? « Ils ont » | hanno* | abbiamo | ha
? « Notre chien » = il nostro cane
? « Vous avez » = avete
--- Adjectifs et couleurs
## Accorder l'adjectif
Les adjectifs en **-o** font -a, -i, -e : bello, bella, belli, belle. Ceux en **-e** font -i au pluriel : grande, grandi. L'adjectif se place en général **après** le nom : una casa grande.
Couleurs : rosso, blu, verde, giallo, nero, bianco, arancione.
! Blu, rosa et viola sont invariables.
@vocab
rosso = rouge
verde = vert
giallo = jaune
nero = noir
bianco = blanc
@exemples
Una casa bianca.
I libri rossi sono sul tavolo.
Ho comprato una macchina nera e due borse blu molto belle.
@exercices
? « Une maison blanche » | una casa bianca* | una bianca casa | un casa bianco
? Pluriel de « rosso » = rossi
? « Rouge » = rosso
@oral
Décrivez cinq objets autour de vous avec leur couleur.
@eval
? Féminin de « nero » = nera
? Pluriel de « grande » | grandi* | grande | grandes
? « Jaune » = giallo
? « Blu » est | invariable* | variable | féminin
? Pluriel de « bello » = belli
=== Module 4 — Se déplacer et sortir
--- La ville et les directions
## Demander son chemin
**Dov'è la stazione ?** = Où est la gare ? Réponses : **a destra** (à droite), **a sinistra** (à gauche), **dritto** (tout droit), **all'angolo** (au coin).
Pour guider : **Prenda la prima a destra** (prenez la première à droite).
! Scusi, per andare in piazza ? = Excusez-moi, pour aller à la place ?
@vocab
la stazione = la gare
la piazza = la place
a destra = à droite
a sinistra = à gauche
dritto = tout droit
@exemples
Dov'è la stazione?
Vada dritto e poi giri a sinistra.
Scusi, per andare al museo? Prenda la seconda a destra, è vicino alla piazza.
@exercices
? « À gauche » | a sinistra* | a destra | dritto
? « Tout droit » = dritto
? « Où est la gare ? » | Dov'è la stazione?* | Chi è la stazione? | Come è la stazione?
@oral
Demandez puis donnez un itinéraire de chez vous à la gare, en italien.
@eval
? « À droite » = a destra
? « La place » | la piazza* | la stazione | la strada
? « Dov'è » signifie | où est* | qui est | quand est
? « Prenda la prima a destra » | prenez la première à droite* | allez tout droit | tournez à gauche
? « La gare » = la stazione
--- Andare, fare, volere
## Trois verbes irréguliers essentiels
Andare : vado, vai, va, andiamo, andate, vanno. Fare : faccio, fai, fa, facciamo, fate, fanno. Volere : voglio, vuoi, vuole, vogliamo, volete, vogliono.
On dit « vado **a** Roma » (ville) mais « vado **in** Francia » (pays).
! Vorrei est le conditionnel de volere : plus poli que « voglio ».
@vocab
vado = je vais
faccio = je fais
voglio = je veux
andiamo = nous allons
fanno = ils font
@exemples
Vado a Roma.
Che cosa fai stasera?
Voglio andare al cinema, ma i miei amici vogliono restare a casa.
@exercices
? « Je vais » = vado
? « Nous faisons » | facciamo* | fate | fanno
? « Tu veux » | vuoi* | voglio | vuole
@oral
Dites ce que vous faites, où vous allez et ce que vous voulez demain.
@eval
? « Ils vont » = vanno
? « Vous faites » = fate
? « Il veut » | vuole* | vuoi | voglio
? « Je fais » | faccio* | fai | fa
? « Nous voulons » = vogliamo
--- Les prépositions articulées
## Préposition + article
di + il = **del**, a + il = **al**, in + il = **nel**, su + il = **sul**, da + il = **dal**. Avec la : della, alla, nella, sulla, dalla. Avec i : dei, ai, nei, sui, dai.
On n'utilise pas ces formes avec un nom sans article (« vado a Roma »).
! Il libro del ragazzo = le livre du garçon.
@vocab
del = du
al = au
nel = dans le
sul = sur le
dalla = de la / par la
@exemples
Il libro è sul tavolo.
Vado al mercato con la mia amica.
Le chiavi sono nella borsa e il telefono è nel cassetto.
@exercices
? a + il | al* | del | nel
? « Dans le » = nel
? « Sur la table » | sulla tavola* | sul tavola | su la tavola
@oral
Dites où se trouvent cinq objets de votre pièce avec des prépositions articulées.
@eval
? di + il = del
? in + la = nella
? « Au marché » | al mercato* | a il mercato | del mercato
? su + il = sul
? da + la = dalla
`);

/* ---------- ESPAGNOL (suite) ---------- */
cours("espagnol", `
=== Module 4 — Les verbes courants
--- Los verbos en -er e -ir
## Deux autres conjugaisons
-er : comer → como, comes, come, comemos, coméis, comen. -ir : vivir → vivo, vives, vive, vivimos, vivís, viven.
Seules les terminaisons de **nosotros** et **vosotros** diffèrent entre -er et -ir.
! comemos / vivimos · coméis / vivís.
@vocab
comer = manger
beber = boire
vivir = vivre / habiter
escribir = écrire
abrir = ouvrir
@exemples
Como pan.
Vivimos en Francia y escribimos mucho.
Mis padres beben café y abren la tienda a las nueve.
@exercices
? « Je mange » | como* | comes | come
? « Nous vivons » = vivimos
? « Vous buvez » | bebéis* | beben | bebemos
@oral
Conjuguez comer et vivir aux six personnes.
@eval
? « Tu bois » = bebes
? « Il écrit » = escribe
? « Nous mangeons » | comemos* | comen | coméis
? « Ils vivent » | viven* | vive | vivís
? « J'ouvre » = abro
--- Tener, ir, hacer
## Trois irréguliers à connaître
Tener : tengo, tienes, tiene, tenemos, tenéis, tienen. Ir : voy, vas, va, vamos, vais, van. Hacer : hago, haces, hace, hacemos, hacéis, hacen.
Expressions : **tener hambre** (avoir faim), **tener veinte años** (avoir vingt ans), **ir a + infinitif** (futur proche).
! Voy a comer = je vais manger.
@vocab
tengo = j'ai
voy = je vais
hago = je fais
tener hambre = avoir faim
ir a + infinitif = aller + infinitif
@exemples
Tengo veinte años.
Voy a la playa con mis amigos.
Mañana vamos a hacer la compra y después voy a descansar.
@exercices
? « J'ai » = tengo
? « Nous allons » | vamos* | vais | van
? « Je fais » | hago* | hacer | haces
@oral
Dites votre âge, où vous allez demain et ce que vous allez faire.
@eval
? « Tu as » = tienes
? « Ils vont » = van
? « Vous faites » | hacéis* | hacen | hacemos
? « Il a » | tiene* | tienen | tenemos
? « Je vais manger » = voy a comer
--- Genre y número
## Articles, genre et pluriel
Articles définis : **el, la, los, las** ; indéfinis : **un, una, unos, unas**. Pluriel : +s après voyelle (casa → casas), +es après consonne (ciudad → ciudades).
Exceptions : **el problema, el día, el mapa** sont masculins ; **la mano** est féminin.
! Un nom en -ción est féminin : la canción.
@vocab
el libro = le livre
la casa = la maison
el problema = le problème
la mano = la main
la ciudad = la ville
@exemples
El libro es interesante.
Las casas son grandes.
El problema de la ciudad es el tráfico de los coches.
@exercices
? « Les maisons » | las casas* | los casas | la casas
? Pluriel de « ciudad » = ciudades
? « Le problème » | el problema* | la problema | los problema
@oral
Citez dix noms avec leur article et leur pluriel.
@eval
? Pluriel de « libro » = libros
? « La main » = la mano
? « Una » est | indéfini féminin* | défini masculin | pluriel
? Pluriel de « canción » = canciones
? « El día » est | masculin* | féminin | pluriel
=== Module 5 — Décrire et communiquer
--- Adjetivos y colores
## Accorder les adjectifs
Adjectifs en -o : rojo, roja, rojos, rojas. En -e ou consonne : un coche grande, una casa grande. Ils se placent en général **après** le nom : una casa blanca.
Couleurs : rojo, azul, verde, amarillo, negro, blanco, naranja.
! Un gran hombre (devant le nom, grande devient gran).
@vocab
rojo = rouge
azul = bleu
verde = vert
negro = noir
blanco = blanc
@exemples
Una casa blanca.
Los coches rojos son rápidos.
Tengo una bicicleta azul y dos camisas negras muy bonitas.
@exercices
? « Une maison blanche » | una casa blanca* | una blanca casa | un casa blanco
? Féminin de « negro » = negra
? « Rouge » = rojo
@oral
Décrivez cinq objets de votre chambre avec leur couleur.
@eval
? Pluriel de « azul » = azules
? « Verde » est | invariable en genre* | toujours masculin | toujours féminin
? Féminin de « blanco » = blanca
? « Jaune » = amarillo
? « Una casa grande » : l'adjectif est | après le nom* | avant le nom | invariable
--- Me gusta
## Parler de ses goûts
**Me gusta** + nom singulier ou verbe : me gusta el café, me gusta leer. **Me gustan** + nom pluriel : me gustan los libros.
Pronoms : me, te, le, nos, os, les. Pour la négation : **no me gusta**.
! Le sujet suit le verbe : « le livre me plaît ».
@vocab
me gusta = ça me plaît
me gustan = ils me plaisent
te gusta = ça te plaît
no me gusta = je n'aime pas
le gusta = ça lui plaît
@exemples
Me gusta el chocolate.
Me gustan las películas de aventuras.
A mi hermana le gusta bailar, pero a mí no me gusta nada.
@exercices
? « J'aime la musique » | Me gusta la música* | Me gustan la música | Gusto la música
? « J'aime les chats » | Me gustan los gatos* | Me gusta los gatos | Me gusto los gatos
? « Tu aimes » (gustar) = te gusta
@oral
Dites cinq choses que vous aimez et deux que vous n'aimez pas.
@eval
? « Il aime lire » = le gusta leer
? « Je n'aime pas le café » | no me gusta el café* | me no gusta el café | no gusto el café
? « Nous aimons » (pluriel) | nos gustan* | nos gusta | me gustan
? « Elles aiment les livres » | les gustan los libros* | les gusta los libros | le gusta los libros
? « Me gustan » s'emploie avec un nom | pluriel* | singulier | verbe
--- Las preguntas
## Poser des questions
Les mots interrogatifs portent un accent : **¿qué?** (quoi), **¿quién?** (qui), **¿dónde?** (où), **¿cuándo?** (quand), **¿cómo?** (comment), **¿por qué?** (pourquoi), **¿cuánto?** (combien).
La question s'écrit avec **¿ ... ?** et la réponse à « ¿por qué? » commence par **porque**.
! ¿Cómo te llamas? = Comment t'appelles-tu ?
@vocab
¿dónde? = où ?
¿cuándo? = quand ?
¿quién? = qui ?
¿por qué? = pourquoi ?
porque = parce que
@exemples
¿Dónde vives?
¿Cuándo llega el tren?
¿Por qué estudias español? Porque quiero viajar a Perú.
@exercices
? « Où ? » | ¿dónde?* | ¿cuándo? | ¿quién?
? « Pourquoi ? » = ¿por qué?
? « Parce que » | porque* | por qué | porqué
@oral
Posez cinq questions à un voisin imaginaire sur sa vie, en espagnol.
@eval
? « Quand ? » = ¿cuándo?
? « Comment t'appelles-tu ? » | ¿Cómo te llamas?* | ¿Dónde te llamas? | ¿Qué te llamas?
? « Qui ? » | ¿quién?* | ¿qué? | ¿cómo?
? « Combien ? » = ¿cuánto?
? Signe d'ouverture d'une question | ¿* | ! | ¡
`);

/* ---------- FRANÇAIS (suite) ---------- */
cours("francais", `
=== Grammaire de la phrase
--- La nature des mots
## Reconnaître les classes de mots
**Nom** (chat), **déterminant** (le, un, mon), **adjectif** (petit), **verbe** (manger), **adverbe** (vite), **pronom** (il), **préposition** (à, dans), **conjonction** (et, mais).
Variables : nom, déterminant, adjectif, verbe, pronom. Invariables : adverbe, préposition, conjonction.
! La nature d'un mot dépend de son rôle dans la phrase : « un manger » (nom).
@vocab
nom = désigne une personne, un animal, une chose
adjectif = qualifie un nom
adverbe = modifie un verbe, un adjectif ou un autre adverbe
préposition = mot invariable qui introduit un complément
conjonction = relie des mots ou des phrases
@exemples
Le chat dort.
Mon petit frère mange vite.
Il rentre à la maison parce que la nuit tombe.
@exercices
? « Petit » est | un adjectif* | un nom | un verbe
? Nature de « vite » = adverbe
? « Dans » est | une préposition* | une conjonction | un adverbe
@oral
Choisissez une phrase et nommez à voix haute la nature de chaque mot.
@eval
? « Mais » est | une conjonction* | une préposition | un pronom
? Nature de « le » = déterminant
? « Courir » est | un verbe* | un nom | un adjectif
? « Il » est | un pronom* | un nom | un adverbe
? Nature de « rapidement » = adverbe
--- Les fonctions dans la phrase
## Sujet, COD, COI, circonstanciels
Le **sujet** fait l'action (« Qui est-ce qui ? »). Le **COD** répond à « quoi ? / qui ? » sans préposition. Le **COI** répond à « à qui ? / à quoi ? ». Le **complément circonstanciel** donne lieu, temps, manière et peut se déplacer.
« Marie (sujet) offre (verbe) un livre (COD) à Paul (COI) hier (CC de temps). »
! Un complément circonstanciel est supprimable et déplaçable.
@vocab
sujet = qui fait l'action
COD = complément d'objet direct
COI = complément d'objet indirect
complément circonstanciel = lieu, temps, manière, cause
attribut = qualifie le sujet avec être
@exemples
Le chien mange un os.
Léa parle à sa voisine.
Hier, mon frère a acheté un cadeau au marché.
@exercices
? Dans « Léa mange une pomme », COD = une pomme
? Dans « Il parle à Paul », « à Paul » est | COI* | COD | sujet
? « Hier » est un complément circonstanciel de | temps* | lieu | manière
@oral
Analysez à voix haute la phrase « Hier, Marie a offert un livre à Paul ».
@eval
? Le sujet de « Le chat dort » = le chat
? « Un livre » dans « Il lit un livre » est | COD* | COI | CC de lieu
? « À Paul » dans « Il écrit à Paul » est | COI* | COD | attribut
? « Demain » est un CC de | temps* | lieu | cause
? Le complément qu'on peut déplacer ou supprimer | circonstanciel* | COD | attribut
--- Types et formes de phrase
## Quatre types, deux formes
Types : **déclaratif** (point), **interrogatif** (?), **injonctif** ou impératif (ordre, conseil), **exclamatif** (!). Formes : **affirmative** ou **négative** (ne ... pas, ne ... jamais, ne ... plus).
Négation : « Je ne mange pas » ; à l'oral, on oublie souvent « ne », mais à l'écrit il est obligatoire.
! Phrase injonctive : « Viens ici ! »
@vocab
déclarative = informe, se termine par un point
interrogative = pose une question
injonctive = ordonne, conseille
exclamative = exprime une émotion
négation = ne ... pas, ne ... jamais
@exemples
Il pleut.
Viens-tu ce soir ?
Ne cours pas dans le couloir, il y a des élèves qui sortent !
@exercices
? « Viens ici ! » est une phrase | injonctive* | déclarative | interrogative
? Négation de « Je mange » = Je ne mange pas
? Ponctuation d'une phrase interrogative | ?* | . | !
@oral
Dites à voix haute une phrase de chaque type sur le thème de la journée.
@eval
? « Quel beau temps ! » est | exclamative* | interrogative | déclarative
? Négation de « Il chante » = Il ne chante pas
? « Où vas-tu ? » est | interrogative* | injonctive | déclarative
? « Ferme la porte. » est | injonctive* | déclarative | exclamative
? Négation : ne ... ___ (plus de jamais) = jamais
=== Conjugaison, style et vocabulaire
--- Le présent des verbes du 3e groupe
## Les verbes irréguliers du présent
Être : suis, es, est, sommes, êtes, sont. Avoir : ai, as, a, avons, avez, ont. Aller : vais, vas, va, allons, allez, vont. Faire : fais, fais, fait, faisons, faites, font. Dire : dis, dis, dit, disons, dites, disent.
Attention : **vous dites, vous faites** (pas -ez).
! Aller est du 1er groupe par l'infinitif mais irrégulier au présent.
@vocab
être = je suis
avoir = j'ai
aller = je vais
faire = je fais
dire = je dis
@exemples
Je suis fatigué.
Nous allons au marché.
Vous faites du sport et ils disent la vérité.
@exercices
? « Vous ___ » (dire) = dites
? « Ils ___ » (aller) = vont
? « Nous ___ » (faire) | faisons* | faisez | fesons
@oral
Conjuguez être, avoir, aller et faire au présent à voix haute.
@eval
? « Tu ___ » (être) = es
? « Vous ___ » (faire) = faites
? « Ils ___ » (avoir) | ont* | on | avent
? « Il ___ » (dire) = dit
? « Nous ___ » (aller) = allons
--- Le subjonctif présent
## Exprimer le souhait, la nécessité
Après **il faut que**, **je veux que**, **bien que**, **pour que**, on emploie le **subjonctif**. Terminaisons : -e, -es, -e, -ions, -iez, -ent.
Irréguliers : être → que je **sois**, avoir → que j'**aie**, aller → que j'**aille**, faire → que je **fasse**.
! Il faut que tu viennes (et non « que tu viens »).
@vocab
subjonctif = mode du souhait, de la nécessité, du doute
il faut que = expression de la nécessité
bien que = introduit une concession
pour que = introduit un but
souhait = désir
@exemples
Il faut que je parte.
Je veux que tu sois à l'heure.
Bien qu'il fasse froid, nous irons nous promener pour que les enfants s'amusent.
@exercices
? « Il faut que je ___ » (être) = sois
? « Il faut que tu ___ » (avoir) = aies
? « Bien qu'il ___ » (faire) | fasse* | fait | fera
@oral
Dites cinq choses qu'il faut que vous fassiez demain.
@eval
? « Il faut que nous ___ » (aller) = allions
? « Je veux qu'il ___ » (venir) | vienne* | vient | viendra
? « Pour que tu ___ » (comprendre) = comprennes
? Le subjonctif s'emploie après | il faut que* | parce que | quand
? « Il faut que vous ___ » (être) = soyez
--- Les figures de style
## Embellir et renforcer le propos
**Comparaison** (comme, tel) : « fort comme un lion ». **Métaphore** : « cet homme est un lion ». **Personnification** : « le vent chante ». **Hyperbole** : exagération (« mourir de faim »). **Antithèse** : opposition (« le jour et la nuit »).
**Anaphore** : répétition de mots en début de phrases.
! La métaphore n'a pas d'outil de comparaison.
@vocab
comparaison = rapprochement avec comme
métaphore = comparaison sans outil
hyperbole = exagération
personnification = attribuer un trait humain à une chose
antithèse = opposition de deux idées
@exemples
Il est fort comme un lion.
Le vent hurle dans la nuit.
Je meurs de faim : j'ai attendu une éternité ce repas !
@exercices
? « Fort comme un lion » est | une comparaison* | une métaphore | une antithèse
? « Le temps est un voleur » est | une métaphore* | une comparaison | une antithèse
? « J'ai mille choses à faire » est | une hyperbole* | une comparaison | une antithèse
@oral
Créez une comparaison, une métaphore et une hyperbole sur la pluie.
@eval
? « Le vent chante » est | une personnification* | une hyperbole | une comparaison
? « Le jour et la nuit » est | une antithèse* | une métaphore | une anaphore
? Une métaphore n'a pas d'outil de | comparaison* | ponctuation | sujet
? « Je suis mort de fatigue » est | une hyperbole* | une comparaison | une anaphore
? Répétition en début de phrases = anaphore
`);

/* ---------- ORTHOGRAPHE (suite) ---------- */
cours("orthographe", `
=== Les accords et les formes
--- Le pluriel des noms
## Règles et exceptions
Règle générale : **+s**. Noms en **-s, -x, -z** : invariables (un bras, des bras). Noms en **-eau, -au, -eu** : **+x** (des bateaux, des jeux), sauf landau, bleu, pneu (+s).
Noms en **-al** : **-aux** (des animaux), sauf bal, carnaval, festival, récital (+s). Sept noms en -ou prennent -x : bijou, caillou, chou, genou, hibou, joujou, pou.
! Des travaux, des vitraux, des journaux.
@vocab
un animal = des animaux
un bateau = des bateaux
un bal = des bals
un bijou = des bijoux
un pneu = des pneus
@exemples
Des chevaux.
Les journaux sont sur la table.
Les enfants ont ramassé des cailloux et des coquillages.
@exercices
? Pluriel de « cheval » = chevaux
? Pluriel de « bal » | bals* | baux | bales
? Pluriel de « pneu » | pneus* | pneux | pneues
@oral
Dites le pluriel de dix noms de votre choix, dont trois exceptions.
@eval
? Pluriel de « animal » = animaux
? Pluriel de « bijou » = bijoux
? Pluriel de « festival » | festivals* | festivaux | festivales
? Pluriel de « bras » | bras* | brases | braux
? Pluriel de « jeu » = jeux
--- Le féminin des adjectifs
## Former le féminin
Règle générale : **+e** (grand → grande). Doublement : bon → bonne, gentil → gentille. **-eux → -euse** (heureux → heureuse). **-if → -ive** (actif → active). **-teur → -trice** (créateur → créatrice).
Irréguliers : beau → belle, vieux → vieille, fou → folle, blanc → blanche.
! Les adjectifs en -e ne changent pas : un/une jeune.
@vocab
heureux = heureuse
actif = active
bon = bonne
blanc = blanche
beau = belle
@exemples
Une fille heureuse.
Une belle maison blanche.
Cette actrice est créative, sportive et très gentille.
@exercices
? Féminin de « actif » = active
? Féminin de « bon » | bonne* | bone | bonn
? Féminin de « blanc » = blanche
@oral
Décrivez deux personnes (un homme, une femme) avec cinq adjectifs chacune.
@eval
? Féminin de « heureux » = heureuse
? Féminin de « vieux » = vieille
? Féminin de « gentil » | gentille* | gentile | gentil
? Féminin de « créateur » | créatrice* | créateure | créatrise
? Féminin de « jeune » = jeune
--- la / là / l'a, ma / m'a
## Quatre mots, quatre sens
**la** = article ou pronom (« la maison »). **là** = adverbe de lieu (« viens là »). **l'a** = « l'avait » (« il l'a vu »). **ma** = déterminant (mon) ; **m'a** = « m'avait » (« il m'a vu »).
Astuce : remplacez par « avait » pour trouver l'(a) et m'(a).
! Il l'a dit = il l'avait dit.
@vocab
la = article défini féminin
là = adverbe de lieu
l'a = pronom + verbe avoir
ma = déterminant possessif
m'a = pronom + verbe avoir
@exemples
La maison est grande.
Viens là !
Il m'a dit qu'il l'a trouvée dans ma chambre là-haut.
@exercices
? Il ___ vu hier (l'avait) | l'a* | la | là
? Pose-le ___ | là* | la | l'a
? Il ___ téléphoné (m'avait) | m'a* | ma | mas
@oral
Dites une phrase avec chacun des quatre mots (la, là, l'a, m'a).
@eval
? ___ voiture est rouge | La* | Là | L'a
? Tu vas ___ ? | là* | la | l'a
? Elle ___ rendu mon livre (le a) | l'a* | la | là
? Elle ___ prévenu (me a) | m'a* | ma | mas
? ___ mère est gentille (mon) | Ma* | M'a | Mas
--- Participe passé en é ou infinitif en er ?
## Le piège des -é, -er, -ez
Astuce : remplacez par un verbe du 3e groupe (**vendre / vendu**). Si « vendre » va, c'est l'**infinitif en -er** ; si « vendu » va, c'est le **participe en -é**.
« Il va manger » (vendre) → -er. « Il a mangé » (vendu) → -é. « Vous mangez » (vous vendez) → -ez.
! Après une préposition (pour, sans, de, à), on emploie l'infinitif.
@vocab
infinitif = forme neutre du verbe
participe passé = forme avec avoir ou être
astuce = remplacement par vendre / vendu
auxiliaire = avoir ou être
préposition = pour, sans, de, à
@exemples
Il va chanter.
Elle a chanté hier.
Pour réussir, il faut avoir beaucoup travaillé et aimé apprendre.
@exercices
? Il a ___ (manger) | mangé* | manger | mangez
? Il va ___ (parler) | parler* | parlé | parlez
? Pour ___ (réussir) | réussir* | réussi | réussie
@oral
Dites une phrase avec « aller + infinitif » et une avec « avoir + participe » à voix haute.
@eval
? Je vais ___ (chanter) = chanter
? Il a ___ (chanter) = chanté
? Vous ___ (chanter) = chantez
? Sans ___ (parler) | parler* | parlé | parlez
? Elle est ___ (arriver) | arrivée* | arriver | arrivez
--- quel / quelle / qu'elle
## Trois écritures pour le même son
**quel(le)(s)** = déterminant interrogatif ou exclamatif (« quelle heure est-il ? »). **qu'elle(s)** = que + elle (« je pense qu'elle viendra »). Astuce : remplacez « elle » par « il » : si possible, c'est **qu'elle**.
« Quel film ! » → pas de « qu'il film », donc quel.
! Quelle est ton adresse ? (quel + est).
@vocab
quel = déterminant (masculin)
quelle = déterminant (féminin)
qu'elle = que + elle
astuce = remplacer elle par il
exclamatif = exprime l'étonnement
@exemples
Quel âge as-tu ?
Je sais qu'elle viendra.
Quelle belle journée ! Je suis sûr qu'elle sera inoubliable.
@exercices
? ___ heure est-il ? | Quelle* | Qu'elle | Quel
? Je crois ___ viendra | qu'elle* | quelle | quel
? ___ beau jour ! | Quel* | Quelle | Qu'elle
@oral
Posez cinq questions avec « quel », « quelle », « quels », « quelles ».
@eval
? ___ est ton nom ? | Quel* | Quelle | Qu'elle
? Je pense ___ part demain (elle) | qu'elle* | quelle | quel
? ___ musique écoutes-tu ? | Quelle* | Quel | Qu'elle
? Il faut ___ vienne vite (elle) = qu'elle
? « Quel » s'accorde avec le | nom* | verbe | adverbe
--- Orthographe d'usage : les mots à retenir
## Les mots piégeux
**développer** (1 l, 2 p), **apercevoir** (1 p), **aggraver** (gg), **rythme** (rythm-, pas rithme), **exception**, **occasion** (2 c), **soutenir**, **appeler** (pp).
Mots invariables à connaître : **toujours, souvent, parfois, pourtant, jamais, déjà**.
! Un seul « p » à apercevoir, deux « p » à apparaître.
@vocab
développer = ne prend qu'un l et deux p
apercevoir = un seul p
aggraver = deux g
rythme = r-y-t-h-m-e
occasion = deux c
@exemples
Il faut développer ce projet.
Elle a aperçu un oiseau.
À cette occasion, le rythme de la musique s'est accéléré.
@exercices
? Orthographe correcte | développer* | dévélopper | déveloper
? Orthographe correcte | apercevoir* | appercevoir | aperçevoir
? Orthographe correcte | rythme* | rithme | rytme
@oral
Épelez à voix haute cinq mots difficiles de cette leçon.
@eval
? Orthographe de « aggraver » | aggraver* | agraver | aggrawer
? Orthographe de « occasion » | occasion* | ocasion | ocassion
? Orthographe de « exception » | exception* | exeption | execption
? Orthographe de « appeler » | appeler* | apeller | apeler
? Orthographe de « soutenir » | soutenir* | soutenire | soutennir
`);

/* ======== contenu-savoirs.js ======== */
/* ---------- CODE DE LA ROUTE ---------- */
cours("coderoute", `
=== Vitesse, priorités et sécurité
--- Les limitations de vitesse
## Les vitesses maximales en France
En agglomération : **50 km/h**. Hors agglomération, sur route à double sens sans séparateur central : **80 km/h**. Sur route à chaussées séparées : **110 km/h**. Sur autoroute : **130 km/h**.
Par temps de pluie, l'autoroute passe à **110 km/h**. Un panneau local peut imposer une vitesse plus basse.
! Le panneau d'entrée d'agglomération fixe le 50 km/h, même sans panneau de limitation.
@vocab
agglomération = zone bâtie entre deux panneaux de nom de ville
autoroute = route à chaussées séparées sans croisement
chaussée = partie de la route où roulent les véhicules
limitation = vitesse maximale autorisée
excès de vitesse = dépassement de la limite
@exemples
En ville, je roule à 50 km/h.
Sur une route de campagne, la limite est de 80 km/h.
Sous la pluie sur autoroute, je ralentis de 130 à 110 km/h.
@exercices
? Vitesse maximale en agglomération | 50 km/h* | 70 km/h | 30 km/h
? Vitesse maximale sur autoroute par temps sec = 130
? Vitesse sur autoroute sous la pluie | 110 km/h* | 130 km/h | 90 km/h
@oral
Récitez les quatre vitesses maximales (ville, route, route séparée, autoroute).
@eval
? Vitesse sur route à double sens sans séparateur | 80 km/h* | 90 km/h | 110 km/h
? Vitesse maximale en ville = 50
? Sur autoroute, par pluie, la limite est de ___ km/h = 110
? Le panneau d'entrée d'agglomération impose | 50 km/h* | 30 km/h | 80 km/h
? En campagne sur route ordinaire, limite = 80
--- Les priorités
## Qui passe en premier ?
Sans panneau ni feu, **la priorité est à droite**. Un **STOP** impose l'arrêt complet. Un **cédez-le-passage** impose de laisser passer sans forcément s'arrêter.
Dans un rond-point, la priorité va en général aux véhicules **déjà engagés** dans l'anneau.
! Un feu orange impose de s'arrêter, sauf si l'arrêt est dangereux.
@vocab
priorité à droite = règle par défaut en l'absence de signalisation
STOP = arrêt obligatoire
cédez-le-passage = laisser passer les véhicules prioritaires
rond-point = carrefour giratoire
véhicule engagé = déjà dans le carrefour
@exemples
Au carrefour sans panneau, je cède à droite.
Au STOP, je m'arrête complètement.
Dans un rond-point, je laisse passer les véhicules déjà dans l'anneau.
@exercices
? Sans signalisation, qui est prioritaire ? | Le véhicule venant de droite* | Le véhicule venant de gauche | Le plus rapide
? Au STOP, on doit | s'arrêter complètement* | ralentir seulement | klaxonner
? Dans un rond-point, la priorité va aux véhicules déjà ___ = engagés
@oral
Décrivez à voix haute la conduite à tenir à un carrefour sans panneau.
@eval
? « Priorité à droite » s'applique | sans signalisation* | toujours | jamais
? STOP = arrêt ___ = complet
? Feu orange : on | s'arrête sauf danger* | accélère | klaxonne
? Cédez-le-passage signifie | laisser passer* | arrêt obligatoire | vitesse limitée
? Qui est prioritaire dans un rond-point ? | celui déjà engagé* | celui qui entre | le plus rapide
--- Alcool, fatigue et distances
## Les trois risques majeurs
Le taux légal d'alcool est de **0,5 g/L de sang** (0,2 g/L pour un permis probatoire). Chaque verre standard fait monter le taux d'environ 0,2 à 0,25 g/L.
Distance de sécurité : au moins **2 secondes** derrière le véhicule précédent. Faites une pause de **15 minutes toutes les 2 heures**.
! Distance d'arrêt = distance de réaction + distance de freinage (très allongée sur route mouillée).
@vocab
alcoolémie = taux d'alcool dans le sang
distance de sécurité = écart avec le véhicule devant
temps de réaction = environ 1 seconde
freinage = ralentissement du véhicule
somnolence = envie de dormir au volant
@exemples
Je ne bois pas si je conduis.
Je garde 2 secondes derrière le véhicule devant moi.
Après deux heures de route, je fais une pause pour éviter la somnolence.
@exercices
? Taux légal d'alcool (permis normal) | 0,5 g/L* | 0,8 g/L | 1 g/L
? Distance de sécurité en secondes = 2
? Pause conseillée toutes les | 2 heures* | 5 heures | 30 minutes
@oral
Expliquez à voix haute pourquoi la distance d'arrêt augmente sur chaussée mouillée.
@eval
? Taux d'alcool pour un permis probatoire | 0,2 g/L* | 0,5 g/L | 0,8 g/L
? Distance de sécurité minimale = 2 secondes
? Distance d'arrêt = réaction + ___ | freinage* | pause | arrêt
? Sur sol mouillé, la distance de freinage | augmente* | diminue | ne change pas
? Pause toutes les ___ heures = 2
`);

/* ---------- CULTURE GÉNÉRALE ---------- */
cours("culture", `
=== Repères du monde
--- Continents et océans
## La carte du monde
On compte **7 continents** selon l'usage anglo-saxon (en France, souvent 5 ou 6 : Afrique, Amériques, Asie, Europe, Océanie, parfois Antarctique). Les **5 océans** : Pacifique, Atlantique, Indien, Austral, Arctique.
Le **Pacifique** est le plus vaste. Le plus haut sommet est l'**Everest** (8 849 m).
! L'Asie est le continent le plus peuplé ; l'Afrique, le plus proche de l'équateur sur toute sa largeur.
@vocab
continent = grande étendue de terre
océan = vaste étendue d'eau salée
Pacifique = plus grand océan
Everest = plus haut sommet du monde
équateur = ligne qui sépare les deux hémisphères
@exemples
Paris est en Europe.
Le Pacifique sépare l'Asie des Amériques.
L'Everest culmine à 8 849 mètres dans l'Himalaya.
@exercices
? Le plus grand océan | Pacifique* | Atlantique | Indien
? Le plus haut sommet du monde = Everest
? Nombre d'océans | 5* | 3 | 7
@oral
Citez à voix haute les cinq océans, du plus grand au plus petit si vous le pouvez.
@eval
? Le continent le plus peuplé | Asie* | Afrique | Europe
? Le plus haut sommet = Everest
? Océan entre l'Europe et l'Amérique | Atlantique* | Pacifique | Indien
? Nombre d'océans = 5
? Chaîne de l'Everest = Himalaya
--- Grands artistes
## Cinq noms à connaître
**Léonard de Vinci** (Renaissance, la Joconde), **Claude Monet** (impressionnisme, les Nymphéas), **Vincent van Gogh** (La Nuit étoilée), **Pablo Picasso** (cubisme, Guernica), **Michel-Ange** (plafond de la chapelle Sixtine).
Un courant artistique regroupe des artistes qui partagent une manière de peindre.
! Impressionnisme = capter la lumière · Cubisme = décomposer les formes.
@vocab
Renaissance = renouveau artistique du XVe-XVIe siècle
impressionnisme = peinture de la lumière et de l'instant
cubisme = peinture par formes géométriques
fresque = peinture sur mur
portrait = représentation d'une personne
@exemples
La Joconde est exposée au Louvre.
Monet peint les nénuphars de son jardin de Giverny.
Picasso peint Guernica en 1937 pour dénoncer la guerre.
@exercices
? Auteur de la Joconde | Léonard de Vinci* | Monet | Picasso
? Courant de Monet = impressionnisme
? Auteur de Guernica | Picasso* | Van Gogh | Dalí
@oral
Présentez à voix haute un tableau que vous aimez, en trois phrases.
@eval
? Auteur de La Nuit étoilée | Van Gogh* | Monet | Picasso
? Musée de la Joconde = Louvre
? Auteur de la chapelle Sixtine | Michel-Ange* | Raphaël | Monet
? Courant de Picasso | cubisme* | impressionnisme | baroque
? Auteur des Nymphéas = Monet
--- Grandes inventions
## Ce qui a changé le monde
**Gutenberg** met au point l'imprimerie vers **1450**. **Edward Jenner** crée le vaccin contre la variole en 1796 ; **Pasteur** vaccine contre la rage en 1885. **Bell** dépose le téléphone en 1876. **Fleming** découvre la pénicilline en 1928.
Internet se développe à partir des années 1960-1990.
! Chaque invention a diffusé le savoir (imprimerie), la santé (vaccin) ou la communication (téléphone).
@vocab
imprimerie = reproduction de textes en série
vaccin = préparation qui protège d'une maladie
pénicilline = premier antibiotique
téléphone = transmission de la voix à distance
Internet = réseau mondial d'ordinateurs
@exemples
Grâce à l'imprimerie, les livres deviennent moins chers.
Le vaccin protège contre de nombreuses maladies.
La pénicilline a sauvé des millions de vies depuis 1928.
@exercices
? Inventeur de l'imprimerie | Gutenberg* | Bell | Pasteur
? Découvreur de la pénicilline = Fleming
? Inventeur du téléphone | Bell* | Edison | Marconi
@oral
Choisissez l'invention qui a le plus changé votre vie et expliquez pourquoi.
@eval
? Vaccin contre la rage | Pasteur* | Fleming | Jenner
? Imprimerie vers l'an = 1450
? Inventeur du téléphone = Bell
? Pénicilline découverte en | 1928* | 1828 | 1958
? Vaccin contre la variole : Edward ___ = Jenner
`);

/* ---------- HISTOIRE-GÉOGRAPHIE ---------- */
cours("histoire", `
=== Grandes périodes
--- Antiquité : Grèce et Rome
## Deux civilisations fondatrices
La **Grèce** invente la **démocratie** à Athènes (Ve siècle av. J.-C., Périclès) : les citoyens votent les lois. **Rome**, fondée selon la légende en **753 av. J.-C.**, devient une République puis un Empire.
L'Empire romain d'Occident s'effondre en **476 apr. J.-C.**
! Démocratie = « pouvoir du peuple » (grec : demos, kratos).
@vocab
démocratie = pouvoir exercé par le peuple
cité = ville-État grecque
République = régime sans roi, avec des magistrats élus
Empire = grand territoire dirigé par un empereur
Athènes = cité où naît la démocratie
@exemples
À Athènes, les citoyens votent sur la place publique.
Jules César est assassiné en 44 av. J.-C.
En 476, le dernier empereur romain d'Occident est déposé.
@exercices
? La démocratie naît à | Athènes* | Rome | Sparte
? Chute de l'Empire romain d'Occident = 476
? Rome est d'abord | une monarchie* | une démocratie | un empire
@oral
Expliquez à voix haute la différence entre la démocratie athénienne et la nôtre.
@eval
? Cité où naît la démocratie | Athènes* | Rome | Corinthe
? Date de la chute de Rome d'Occident = 476
? Fondation légendaire de Rome | 753 av. J.-C.* | 476 av. J.-C. | 14 apr. J.-C.
? Démocratie signifie | pouvoir du peuple* | pouvoir d'un roi | pouvoir des riches
? Chef athénien du Ve siècle = Périclès
--- La Révolution française
## 1789 : la fin de l'Ancien Régime
Le **14 juillet 1789**, le peuple de Paris prend la **Bastille**. Le **4 août**, les privilèges sont abolis. Le **26 août**, la **Déclaration des droits de l'homme et du citoyen** proclame la liberté et l'égalité.
**Louis XVI** est exécuté le **21 janvier 1793** ; la Terreur suit (1793-1794). **Napoléon Bonaparte** prend le pouvoir en **1799**.
! Liberté, Égalité, Fraternité deviendra la devise de la République.
@vocab
Ancien Régime = société d'avant 1789, avec privilèges
Bastille = prison-forteresse de Paris
privilège = avantage réservé à certains
Terreur = période de répression (1793-1794)
Déclaration des droits = texte fondateur de 1789
@exemples
Le 14 juillet est la fête nationale française.
La Déclaration de 1789 proclame que les hommes naissent libres et égaux.
Après la Terreur, Napoléon Bonaparte s'empare du pouvoir en 1799.
@exercices
? Prise de la Bastille | 14 juillet 1789* | 4 août 1789 | 21 janvier 1793
? Roi exécuté en 1793 = Louis XVI
? Texte du 26 août 1789 | Déclaration des droits de l'homme* | Code civil | Constitution de 1958
@oral
Racontez en une minute les grandes étapes de 1789 à 1799.
@eval
? Année de la Révolution = 1789
? Prison prise le 14 juillet | la Bastille* | le Louvre | Versailles
? Abolition des privilèges | 4 août* | 14 juillet | 26 août
? Napoléon prend le pouvoir en = 1799
? Le roi exécuté en 1793 | Louis XVI* | Louis XIV | Louis XV
--- Les deux guerres mondiales
## 1914-1918 et 1939-1945
La **Première Guerre mondiale** (1914-1918) est marquée par la guerre des tranchées (**Verdun**, 1916) ; l'**armistice** est signé le **11 novembre 1918**.
La **Seconde Guerre mondiale** (1939-1945) oppose les Alliés à l'Allemagne nazie. **Débarquement en Normandie** : 6 juin 1944. Victoire en Europe : **8 mai 1945**. La **Shoah** est l'extermination des Juifs d'Europe.
! Armistice = arrêt des combats, avant le traité de paix.
@vocab
armistice = accord d'arrêt des combats
tranchée = fossé où s'abritent les soldats
Alliés = camp opposé à l'Allemagne nazie
Shoah = génocide des Juifs d'Europe
Débarquement = opération militaire du 6 juin 1944
@exemples
Le 11 novembre célèbre l'armistice de 1918.
Les soldats vivent dans les tranchées pendant des mois.
Le 6 juin 1944, les Alliés débarquent sur les plages de Normandie.
@exercices
? Armistice de la Première Guerre mondiale | 11 novembre 1918* | 8 mai 1945 | 6 juin 1944
? Début de la Seconde Guerre mondiale = 1939
? Débarquement en Normandie = 1944
@oral
Comparez à voix haute les deux guerres mondiales en trois points.
@eval
? Début de la Première Guerre mondiale = 1914
? Bataille de 1916 | Verdun* | Stalingrad | Waterloo
? Victoire en Europe en 1945 | 8 mai* | 11 novembre | 14 juillet
? Shoah = extermination des | Juifs d'Europe* | soldats | marins
? Le 6 juin 1944 | Débarquement* | Armistice | Armée
`);

/* ---------- MATHÉMATIQUES ---------- */
cours("maths", `
=== Calcul et équations
--- Les fractions
## Additionner, simplifier, comparer
Pour additionner deux fractions, mettez-les au **même dénominateur** : 1/2 + 1/3 = 3/6 + 2/6 = **5/6**.
Pour multiplier : numérateur × numérateur, dénominateur × dénominateur : 2/3 × 3/4 = 6/12 = **1/2**. Simplifiez en divisant haut et bas par le même nombre.
! Diviser par une fraction = multiplier par son inverse.
@vocab
numérateur = nombre du haut
dénominateur = nombre du bas
simplifier = diviser haut et bas par le même nombre
inverse = fraction retournée (3/4 → 4/3)
fraction irréductible = fraction qu'on ne peut plus simplifier
@exemples
1/2 + 1/4 = 3/4.
2/3 × 3/5 = 2/5.
3/4 ÷ 3/8 = 3/4 × 8/3 = 2.
@exercices
? 1/2 + 1/3 | 5/6* | 2/5 | 1/6
? Simplifiez 6/8 = 3/4
? 2/3 × 3/4 | 1/2* | 5/7 | 6/7
@oral
Expliquez à voix haute comment additionner 1/4 et 1/6.
@eval
? 1/2 + 1/4 | 3/4* | 2/6 | 1/6
? Simplifiez 10/15 = 2/3
? 3/5 × 5/6 | 1/2* | 8/11 | 15/11
? 1/3 + 1/6 | 1/2* | 2/9 | 2/3
? Simplifiez 12/18 = 2/3
--- Les pourcentages
## Calculer avec des pourcentages
Prendre **p %** d'une quantité : multipliez par p/100. 20 % de 150 = 150 × 0,2 = **30**.
Réduction de 25 % sur 80 € : 80 × 0,75 = **60 €**. Augmentation de 10 % sur 50 : 50 × 1,10 = **55**.
! Baisse de t % = × (1 − t/100) · Hausse de t % = × (1 + t/100).
@vocab
pourcentage = nombre sur 100
coefficient = nombre par lequel on multiplie
remise = baisse de prix
hausse = augmentation
taux = pourcentage appliqué
@exemples
10 % de 200 = 20.
Un article à 80 € avec 25 % de remise coûte 60 €.
Un salaire de 2 000 € augmenté de 5 % devient 2 100 €.
@exercices
? 20 % de 150 = 30
? Prix de 80 € après 25 % de remise = 60
? 50 augmenté de 10 % | 55* | 60 | 51
@oral
Expliquez à voix haute comment trouver 15 % de 60.
@eval
? 10 % de 300 = 30
? 50 % de 80 = 40
? 100 € avec 20 % de remise = 80
? 200 augmenté de 10 % = 220
? 25 % de 200 | 50* | 25 | 75
--- Équations du premier degré
## Trouver l'inconnue
Pour résoudre, on **isole x** en faisant la même opération des deux côtés. 2x + 3 = 11 → 2x = 8 → **x = 4**.
Avec parenthèses, on développe d'abord : 3(x + 2) = 18 → 3x + 6 = 18 → x = 4.
! Ce qu'on fait à gauche, on le fait à droite.
@vocab
équation = égalité avec une inconnue
inconnue = valeur à trouver (x)
isoler = laisser x seul
développer = supprimer les parenthèses
solution = valeur qui vérifie l'équation
@exemples
x + 5 = 9 donne x = 4.
2x + 3 = 11 donne x = 4.
3(x + 2) = 18 donne x = 4.
@exercices
? Résolvez 2x + 3 = 11 : x = 4
? Résolvez 5x − 4 = 21 : x = 5
? Résolvez x + 7 = 12 | x = 5* | x = 19 | x = 7
@oral
Résolvez à voix haute 4x + 2 = 18 en détaillant chaque étape.
@eval
? Résolvez x + 8 = 15 : x = 7
? Résolvez 3x = 21 : x = 7
? Résolvez 2x − 1 = 9 : x = 5
? Résolvez x/2 = 7 : x = 14
? Résolvez 3(x + 2) = 18 | x = 4* | x = 6 | x = 2
`);

/* ---------- ÉLOQUENCE ---------- */
cours("eloquence", `
=== Les fondations de l'orateur
--- Structurer un discours
## Introduction, développement, conclusion
Une bonne **introduction** contient une **accroche** (question, chiffre, anecdote), l'annonce du sujet et le plan. Le **développement** suit 2 ou 3 idées, chacune avec un exemple. La **conclusion** résume et ouvre.
La règle des trois est efficace : trois idées, trois exemples, trois secondes de silence final.
! Dites ce que vous allez dire, dites-le, puis dites ce que vous avez dit.
@vocab
accroche = première phrase qui capte l'attention
plan = ordre des idées annoncé
transition = phrase qui relie deux parties
argument = raison qui soutient une idée
chute = dernière phrase marquante
@exemples
« Savez-vous combien de fois on sourit par jour ? »
Premièrement, le sourire détend. Deuxièmement, il rapproche.
En conclusion, un sourire change plus qu'on ne le croit : essayez demain.
@exercices
? La première phrase qui capte l'attention s'appelle | l'accroche* | la chute | la transition
? Nombre d'idées idéal dans un court discours = 3
? Une phrase qui relie deux parties | transition* | accroche | conclusion
@oral
Préparez une introduction de 20 secondes avec accroche, sujet et plan, puis dites-la à voix haute.
@eval
? L'accroche se place | au début* | à la fin | au milieu
? Une conclusion doit | résumer et ouvrir* | ajouter une idée | s'excuser
? Règle des ___ = trois
? Argument = raison qui | soutient une idée* | contredit | fait rire
? Dernière phrase marquante = chute
--- Ethos, logos, pathos
## Les trois leviers de la persuasion
Selon **Aristote**, on convainc par trois moyens : l'**ethos** (la crédibilité de l'orateur), le **logos** (la logique, les faits, les chiffres) et le **pathos** (l'émotion du public).
Un bon discours dose les trois : un fait précis (logos), une histoire vécue (pathos), une posture honnête (ethos).
! Pas de persuasion durable sans confiance.
@vocab
ethos = crédibilité de l'orateur
logos = logique et faits
pathos = émotion suscitée
persuader = amener à croire ou à agir
rhétorique = art de bien parler pour convaincre
@exemples
« Je suis médecin depuis vingt ans. » (ethos)
« 9 personnes sur 10 sont satisfaites. » (logos)
« Je revois encore ce petit garçon sourire. » (pathos)
@exercices
? La crédibilité de l'orateur | ethos* | logos | pathos
? L'émotion du public = pathos
? Auteur de la théorie des trois leviers | Aristote* | Platon | Cicéron
@oral
Défendez une idée de votre choix en 30 secondes en utilisant les trois leviers.
@eval
? Les faits et chiffres relèvent du | logos* | ethos | pathos
? Une histoire touchante relève du | pathos* | logos | ethos
? « Je suis expert du sujet » relève de l'| ethos* | logos | pathos
? Rhétorique = art de bien ___ = parler
? Penseur grec de la rhétorique = Aristote
--- Voix, silence et gestes
## Le corps de l'orateur
Variez le **débit** (ni trop rapide ni monotone), le **volume** et la **hauteur**. Le **silence** de deux secondes avant une idée forte la met en valeur.
Gardez le **regard** posé sur des personnes différentes, les **pieds ancrés**, les gestes ouverts. Respirez par le ventre pour calmer le trac.
! Un silence bien placé vaut mieux qu'un mot de remplissage (« euh »).
@vocab
débit = vitesse de parole
articuler = prononcer nettement
silence = pause volontaire
trac = peur avant de parler
posture = position du corps
@exemples
Je ralentis sur les mots importants.
Je marque un silence avant ma conclusion.
Je regarde successivement trois personnes de la salle.
@exercices
? Un silence avant une idée forte permet de | la mettre en valeur* | l'affaiblir | gagner du temps
? Vitesse de parole = débit
? Contre le trac, on | respire profondément* | parle plus vite | évite le regard
@oral
Lisez un texte de cinq phrases en variant le débit et en plaçant deux silences.
@eval
? Les « euh » sont | des mots de remplissage* | des arguments | des silences utiles
? Articuler = prononcer ___ = nettement
? Le regard doit | changer de personne* | rester au sol | fixer une seule personne
? Un débit monotone | ennuie le public* | passionne | rassure
? Posture = position du ___ = corps
`);

/* ---------- POLITIQUE ---------- */
cours("politique", `
=== Institutions et démocratie
--- Les institutions de la Ve République
## Qui fait quoi ?
La **Ve République** naît en **1958** sous l'impulsion du général de Gaulle. Le **Président**, élu au suffrage universel direct pour **5 ans** (quinquennat depuis 2002), nomme le **Premier ministre**, qui dirige le **Gouvernement**.
Le **Parlement** (Assemblée nationale et Sénat) vote les lois. Le **Conseil constitutionnel** vérifie leur conformité à la Constitution.
! Le Gouvernement détermine et conduit la politique de la nation.
@vocab
Constitution = loi fondamentale de l'État
quinquennat = mandat de 5 ans
Premier ministre = chef du Gouvernement
suffrage universel = vote de tous les citoyens
Conseil constitutionnel = juge de la conformité des lois
@exemples
Le Président est élu tous les 5 ans.
Le Premier ministre est nommé par le Président.
Le Conseil constitutionnel peut censurer une loi contraire à la Constitution.
@exercices
? La Ve République naît en | 1958* | 1946 | 1789
? Durée du mandat présidentiel = 5 ans
? Qui nomme le Premier ministre ? | Le Président* | Le Sénat | Le peuple
@oral
Expliquez en une minute le rôle du Président, du Premier ministre et du Parlement.
@eval
? Année de la Ve République = 1958
? Chef du Gouvernement | Premier ministre* | Président | Président du Sénat
? Le Président est élu | au suffrage universel direct* | par le Sénat | par le Premier ministre
? Quinquennat = mandat de ___ ans = 5
? Le juge de la conformité des lois | Conseil constitutionnel* | Cour des comptes | Sénat
--- Le Parlement et la loi
## Comment naît une loi ?
Le Parlement comprend l'**Assemblée nationale** (577 députés, élus 5 ans au suffrage direct) et le **Sénat** (348 sénateurs, élus 6 ans par des grands électeurs).
Un **projet de loi** vient du Gouvernement, une **proposition de loi** des parlementaires. Le texte est examiné par les deux chambres, voté, puis **promulgué** par le Président.
! Un amendement modifie un texte en discussion.
@vocab
député = élu de l'Assemblée nationale
sénateur = élu du Sénat
projet de loi = texte proposé par le Gouvernement
amendement = modification d'un texte
promulgation = signature qui rend la loi applicable
@exemples
Il y a 577 députés en France.
Les sénateurs sont élus pour six ans.
Un amendement propose de changer un article du projet de loi.
@exercices
? Nombre de députés = 577
? Un texte proposé par le Gouvernement | projet de loi* | proposition de loi | amendement
? Durée du mandat d'un sénateur = 6 ans
@oral
Racontez à voix haute le parcours d'une loi, de sa proposition à sa promulgation.
@eval
? Assemblée nationale : nombre de députés = 577
? Les sénateurs sont élus pour | 6 ans* | 5 ans | 4 ans
? Un texte parlementaire s'appelle | proposition de loi* | projet de loi | décret
? Qui promulgue la loi ? | Le Président* | Le Sénat | Les juges
? Amendement = ___ d'un texte = modification
--- L'Union européenne
## 27 États, une union
L'**Union européenne** compte **27 États membres** depuis la sortie du Royaume-Uni (**Brexit**, 2020). L'euro est en circulation depuis **2002** (créé en 1999).
Ses principales institutions : la **Commission** (propose les lois), le **Parlement européen** (élu tous les 5 ans), le **Conseil** (les États).
! Bruxelles et Strasbourg accueillent les institutions principales.
@vocab
Union européenne = association de 27 États
Commission = institution qui propose les textes
Parlement européen = assemblée élue par les citoyens
Brexit = sortie du Royaume-Uni de l'UE
euro = monnaie commune
@exemples
La France est un État membre depuis la création.
Le Royaume-Uni quitte l'UE en 2020.
Les Européens élisent leurs eurodéputés tous les 5 ans.
@exercices
? Nombre d'États membres de l'UE = 27
? Qui propose les textes européens ? | La Commission* | Le Parlement | Le Conseil
? Entrée en circulation de l'euro = 2002
@oral
Dites trois raisons d'être pour ou contre une Union européenne plus intégrée.
@eval
? Brexit : sortie du Royaume-___ = Uni
? Le Parlement européen est élu | par les citoyens* | par les États | par la Commission
? L'euro en circulation depuis = 2002
? Nombre d'États de l'UE = 27
? Qui propose les lois européennes ? | Commission* | Parlement | Cour de justice
`);

/* ---------- SCIENCES ---------- */
cours("sciences", `
=== Comprendre la nature
--- Le système solaire
## Le Soleil et ses planètes
Le **Soleil** est une étoile autour de laquelle tournent **8 planètes** : Mercure, Vénus, Terre, Mars (telluriques), puis Jupiter, Saturne, Uranus, Neptune (géantes).
La **Terre**, troisième planète, met **365 jours** à faire le tour du Soleil. La lumière du Soleil met environ **8 minutes** à nous parvenir.
! Jupiter est la plus grosse planète ; Mercure, la plus proche du Soleil.
@vocab
étoile = astre qui produit de la lumière
planète = astre qui tourne autour d'une étoile
tellurique = planète rocheuse
gazeuse = planète géante faite de gaz
orbite = trajectoire autour d'un astre
@exemples
La Terre est la troisième planète.
Jupiter est la plus grande planète du système solaire.
La lumière du Soleil met huit minutes à atteindre la Terre.
@exercices
? Nombre de planètes = 8
? Plus grosse planète | Jupiter* | Saturne | Terre
? La Terre est la ___ planète | troisième* | deuxième | quatrième
@oral
Récitez à voix haute les huit planètes, du Soleil vers l'extérieur.
@eval
? Planète la plus proche du Soleil | Mercure* | Vénus | Mars
? La Terre tourne autour du Soleil en | 365 jours* | 30 jours | 12 mois
? Le Soleil est | une étoile* | une planète | une lune
? Nombre de planètes = 8
? Plus grosse planète = Jupiter
--- Les états de la matière
## Solide, liquide, gaz
La matière existe sous trois états : **solide** (forme propre), **liquide** (prend la forme du récipient), **gaz** (occupe tout l'espace).
Changements d'état : **fusion** (solide → liquide, 0 °C pour l'eau), **vaporisation** (liquide → gaz, 100 °C), **solidification**, **condensation**.
! L'eau gèle à 0 °C et bout à 100 °C (à pression normale).
@vocab
fusion = passage du solide au liquide
vaporisation = passage du liquide au gaz
solidification = passage du liquide au solide
condensation = passage du gaz au liquide
molécule = groupe d'atomes
@exemples
La glace fond à 0 °C.
L'eau bout à 100 °C.
La buée sur une vitre vient de la condensation de la vapeur d'eau.
@exercices
? Passage solide → liquide | fusion* | vaporisation | condensation
? Température d'ébullition de l'eau en °C = 100
? Passage gaz → liquide = condensation
@oral
Décrivez à voix haute le cycle de l'eau avec les mots fusion, vaporisation et condensation.
@eval
? Température de fusion de la glace en °C = 0
? Passage liquide → gaz | vaporisation* | fusion | solidification
? Un solide a | une forme propre* | pas de forme | un volume nul
? Un gaz | occupe tout l'espace* | a une forme propre | est toujours froid
? Passage liquide → solide = solidification
--- La cellule et l'ADN
## L'unité du vivant
Tous les êtres vivants sont faits de **cellules**. La cellule possède une **membrane**, un **cytoplasme** et, chez les animaux et les plantes, un **noyau** qui contient l'**ADN**.
L'**ADN** porte l'information génétique, organisée en **gènes** sur les **chromosomes** (46 chez l'humain).
! La photosynthèse (plantes) produit du dioxygène et du sucre à partir de lumière, d'eau et de CO₂.
@vocab
cellule = unité de base du vivant
noyau = partie de la cellule qui contient l'ADN
ADN = molécule porteuse de l'information génétique
gène = portion d'ADN qui code une caractéristique
chromosome = structure qui porte l'ADN
@exemples
Le corps humain compte des milliards de cellules.
L'ADN se trouve dans le noyau.
Un gène peut déterminer la couleur des yeux.
@exercices
? L'unité de base du vivant | la cellule* | l'organe | l'atome
? Nombre de chromosomes humains = 46
? L'ADN se trouve dans le | noyau* | cytoplasme | membrane
@oral
Expliquez à voix haute à un enfant ce qu'est une cellule.
@eval
? Molécule de l'information génétique = ADN
? Gène = portion d'___ = ADN
? Nombre de chromosomes humains | 46* | 23 | 64
? Les plantes produisent du sucre grâce à | la photosynthèse* | la digestion | la fermentation
? Le noyau contient | l'ADN* | l'eau | l'oxygène
`);

/* ---------- ÉCONOMIE (nouveau thème) ---------- */
cours("economie", `
=== Les bases de l'économie
--- Offre et demande
## Comment se fixe un prix ?
La **demande** est la quantité que les acheteurs veulent à un prix donné ; l'**offre**, celle que les vendeurs proposent. Le **prix d'équilibre** est atteint quand elles s'égalent.
Si la demande dépasse l'offre, le prix **monte**. Si l'offre dépasse la demande, le prix **baisse**.
! Rareté + forte demande = prix élevé.
@vocab
offre = quantité proposée par les vendeurs
demande = quantité voulue par les acheteurs
prix d'équilibre = prix où offre et demande s'égalent
rareté = ressource limitée
marché = lieu de rencontre de l'offre et de la demande
@exemples
Les billets d'un concert très demandé sont chers.
Si les récoltes sont abondantes, le prix des fruits baisse.
Un produit rare et très demandé voit son prix grimper.
@exercices
? Si la demande dépasse l'offre, le prix | monte* | baisse | ne change pas
? Quantité proposée par les vendeurs = offre
? Prix où offre et demande s'égalent | prix d'équilibre* | prix plafond | prix fixe
@oral
Expliquez à voix haute pourquoi les billets d'un grand concert sont plus chers que ceux d'une petite salle.
@eval
? Excès d'offre : le prix | baisse* | monte | explose
? Quantité voulue par les acheteurs = demande
? Un bien rare et très demandé est | cher* | gratuit | bon marché
? Le marché est le lieu de rencontre de l'offre et de la ___ = demande
? Prix d'équilibre = offre ___ demande | égale* | supérieure à | inférieure à
--- Inflation et pouvoir d'achat
## Quand tout augmente
L'**inflation** est la hausse générale et durable des prix. Elle réduit le **pouvoir d'achat** : avec la même somme, on achète moins.
Taux d'inflation 3 % : un article à 100 € coûte 103 € un an plus tard. Une **déflation** est une baisse générale des prix.
! Pouvoir d'achat = ce que l'on peut acheter avec son revenu.
@vocab
inflation = hausse générale des prix
déflation = baisse générale des prix
pouvoir d'achat = quantité de biens achetables
salaire réel = salaire corrigé de l'inflation
indice des prix = mesure de l'évolution des prix
@exemples
Le pain coûte plus cher qu'il y a dix ans.
Avec 3 % d'inflation, 100 € deviennent 103 € de dépense.
Si les salaires augmentent moins que les prix, le pouvoir d'achat baisse.
@exercices
? L'inflation est | une hausse générale des prix* | une baisse des salaires | une baisse des impôts
? Prix après 3 % d'inflation sur 100 € = 103
? Baisse générale des prix = déflation
@oral
Expliquez à voix haute pourquoi l'inflation pèse davantage sur les petits revenus.
@eval
? Inflation de 10 % sur 200 € : nouveau prix = 220
? Pouvoir d'achat = ce que l'on peut ___ = acheter
? Si les prix montent plus que les salaires, le pouvoir d'achat | baisse* | monte | reste fixe
? Déflation = baisse générale des ___ = prix
? L'inflation est mesurée par | l'indice des prix* | le taux de chômage | le PIB
--- Budget et épargne
## Gérer son argent
Un **budget** compare **revenus** et **dépenses**. La règle simple 50-30-20 : 50 % besoins, 30 % envies, 20 % épargne.
Les **intérêts composés** font grossir l'épargne : 1 000 € à 5 % par an valent **1 050 €** après un an, puis **1 102,50 €** après deux ans.
! Épargner tôt vaut mieux qu'épargner beaucoup tard.
@vocab
budget = prévision des revenus et dépenses
épargne = argent mis de côté
intérêt = rémunération de l'argent prêté ou placé
intérêts composés = intérêts qui produisent eux-mêmes des intérêts
dette = somme due
@exemples
Je note mes dépenses chaque mois.
Je place 100 € par mois sur un livret.
Avec 1 000 € à 5 %, j'obtiens 1 050 € en un an.
@exercices
? Revenus − dépenses positifs = | épargne possible* | dette | inflation
? 1 000 € à 5 % pendant un an = 1050
? Intérêts qui produisent des intérêts | intérêts composés* | intérêts simples | taxes
@oral
Présentez à voix haute le budget mensuel d'un étudiant avec la règle 50-30-20.
@eval
? Règle 50-30-20 : part de l'épargne en % = 20
? Un budget compare | revenus et dépenses* | prix et salaires | offre et demande
? 100 € à 10 % pendant un an = 110
? Dette = somme ___ = due
? Épargner tôt est | avantageux* | inutile | dangereux
`);

/* ---------- PHILOSOPHIE (nouveau thème) ---------- */
cours("philosophie", `
=== Premiers pas en philosophie
--- Socrate et le questionnement
## Apprendre à douter
**Socrate** (Athènes, Ve siècle av. J.-C.) n'a rien écrit : il interroge ses concitoyens sur le courage, la justice, la vertu. Sa méthode, la **maïeutique**, « accouche » les esprits par des questions.
Il affirme savoir qu'il ne sait rien : reconnaître son ignorance est le début de la sagesse. **Platon**, son élève, transmet sa pensée.
! Philosophie = « amour de la sagesse » (grec : philo, sophia).
@vocab
philosophie = amour de la sagesse
maïeutique = art d'accoucher les esprits par des questions
ignorance = absence de savoir
dialogue = discussion rationnelle
sagesse = art de bien vivre
@exemples
Qu'est-ce que la justice ?
Socrate demande à chacun de définir le courage.
Après une série de questions, l'interlocuteur découvre qu'il ne sait pas ce qu'il croyait savoir.
@exercices
? Socrate pratique | la maïeutique* | la rhétorique | l'alchimie
? Philosophie signifie amour de la = sagesse
? Élève de Socrate | Platon* | Aristote | Descartes
@oral
Posez trois questions « socratiques » sur un sujet de votre choix (qu'est-ce que... ?).
@eval
? Socrate vit à | Athènes* | Rome | Paris
? Méthode de Socrate = maïeutique
? Socrate a | rien écrit* | écrit mille livres | fondé une religion
? Reconnaître son ignorance est | un début de sagesse* | une honte | un échec
? Philo = amour, sophia = sagesse
--- Descartes et le doute
## Je pense, donc je suis
**René Descartes** (1596-1650) publie le **Discours de la méthode** en **1637**. Il propose de **douter de tout** pour trouver une certitude solide.
Il en trouve une : même si je doute, je pense ; et si je pense, j'existe. C'est le **cogito** : « Je pense, donc je suis ».
! Douter n'est pas refuser de croire : c'est chercher des raisons solides.
@vocab
doute méthodique = douter pour trouver des certitudes
cogito = « je pense, donc je suis »
raison = faculté de bien juger
certitude = ce dont on ne peut douter
méthode = suite de règles pour chercher la vérité
@exemples
Je doute de mes sens, mais je ne peux pas douter que je pense.
Descartes cherche une base sûre pour toutes les sciences.
Le cogito est la première vérité de sa philosophie.
@exercices
? Auteur du Discours de la méthode | Descartes* | Socrate | Platon
? Le cogito signifie « Je pense, donc je ___ » = suis
? Le doute de Descartes est | méthodique* | définitif | inutile
@oral
Expliquez à voix haute, en trente secondes, ce qu'est le cogito.
@eval
? Discours de la méthode publié en = 1637
? Le cogito affirme | « Je pense, donc je suis »* | « Je sais que je ne sais rien » | « Tout est relatif »
? Douter permet de | trouver des certitudes* | tout refuser | ne plus penser
? Descartes est | français* | grec | allemand
? Certitude = ce dont on ne peut ___ = douter
--- Le bonheur
## Une vie heureuse
Pour **Aristote**, le bonheur (**eudaimonia**) est l'accomplissement d'une vie vertueuse. Pour **Épicure**, il consiste à satisfaire les plaisirs naturels et nécessaires, et à éviter la douleur.
Les **stoïciens** (Épictète, Marc Aurèle) conseillent de distinguer ce qui dépend de nous de ce qui n'en dépend pas.
! Bonheur ≠ plaisir passager : les philosophes parlent d'une vie réussie.
@vocab
bonheur = vie réussie et épanouie
vertu = disposition à bien agir
épicurisme = philosophie du plaisir mesuré
stoïcisme = philosophie de la maîtrise de soi
plaisir = sensation agréable
@exemples
Épicure recommande des plaisirs simples.
Un stoïcien accepte ce qu'il ne peut pas changer.
Aristote pense que le bonheur est le but de toutes nos actions.
@exercices
? Philosophie du plaisir mesuré | épicurisme* | stoïcisme | cynisme
? Marc Aurèle est un philosophe = stoïcien
? Le bonheur selon Aristote | vie vertueuse* | richesse | célébrité
@oral
Donnez à voix haute votre définition du bonheur, puis comparez-la à celle d'Épicure.
@eval
? Stoïcisme = maîtrise de ___ = soi
? Épicure recommande | plaisirs simples* | luxe | douleur
? Eudaimonia désigne | le bonheur* | la justice | la mort
? Aristote est | grec* | romain | français
? Le stoïcien distingue ce qui dépend de nous de ce qui | n'en dépend pas* | est agréable | est utile
`);

/* ======== contenu-savoirs-2.js ======== */
/* ---------- CODE DE LA ROUTE (suite) ---------- */
cours("coderoute", `
=== Signalisation et conduite
--- Les panneaux
## Forme et couleur = sens
**Triangle à bord rouge** : danger. **Rond à bord rouge** : interdiction. **Rond bleu** : obligation. **Carré ou rectangle bleu** : indication. **Octogone rouge** : STOP. **Triangle pointe en bas** : cédez-le-passage.
Panneau jaune et noir : travaux ou situation temporaire.
! Un panneau rond à bord rouge barré en diagonale marque la fin d'une interdiction.
@vocab
panneau de danger = triangle à bord rouge
panneau d'interdiction = rond à bord rouge
panneau d'obligation = rond bleu
panneau d'indication = carré ou rectangle bleu
STOP = octogone rouge
@exemples
Un triangle me prévient d'un virage dangereux.
Un rond bleu m'oblige à tourner à droite.
Un rond rouge avec 50 m'interdit de dépasser cette vitesse.
@exercices
? Un triangle à bord rouge signale | un danger* | une obligation | une indication
? Un rond bleu signale | une obligation* | une interdiction | un danger
? Forme du panneau STOP = octogone
@oral
Décrivez à voix haute cinq panneaux et leur signification.
@eval
? Un rond à bord rouge signale | une interdiction* | une obligation | un danger
? Forme du STOP | octogone* | triangle | carré
? Panneau carré bleu = indication
? Cédez-le-passage : triangle pointe en | bas* | haut | côté
? Triangle à bord rouge : panneau de | danger* | obligation | fin
--- Les feux et les marquages
## Feux et lignes au sol
Feu **rouge** : arrêt. **Orange** : arrêt sauf si dangereux. **Vert** : passage permis. Un feu orange clignotant impose la prudence.
**Ligne continue** : interdit de la franchir ou de la chevaucher. **Ligne discontinue** : franchissement possible pour dépasser, si la visibilité le permet.
! Un feu rouge clignotant interdit de passer (passage à niveau, tunnel).
@vocab
ligne continue = interdit de la franchir
ligne discontinue = franchissable
feu tricolore = feu rouge, orange, vert
passage piéton = zone pour traverser à pied
voie = file de circulation
@exemples
Je m'arrête au feu rouge.
Je ne double pas sur une ligne continue.
Au feu orange, je m'arrête si je peux le faire en sécurité.
@exercices
? Ligne continue | interdit de la franchir* | franchissable | recommandée
? Feu rouge = arrêt
? Au feu orange, on | s'arrête sauf danger* | accélère | klaxonne
@oral
Expliquez à voix haute la différence entre ligne continue et discontinue.
@eval
? Feu vert = passage permis
? Ligne discontinue | franchissable* | interdite | obligatoire
? Feu orange clignotant | prudence* | arrêt | accélération
? Feu rouge clignotant | interdit de passer* | passage libre | vitesse réduite
? Ligne ___ : on ne peut pas la franchir = continue
--- Le dépassement
## Dépasser sans danger
Dépassez par la **gauche**, après avoir vérifié le rétroviseur, mis le clignotant et contrôlé la visibilité. N'engagez jamais le dépassement dans un virage, une côte, ou près d'un passage piéton.
Après le dépassement, rabattez-vous **sans gêner** le véhicule dépassé.
! Un dépassement doit toujours pouvoir être terminé avant d'avoir à se rabattre en danger.
@vocab
dépassement = passer devant un véhicule plus lent
rétroviseur = miroir arrière
clignotant = feu qui signale le changement de direction
visibilité = distance qu'on voit
se rabattre = revenir dans sa voie
@exemples
Je regarde dans mon rétroviseur avant de dépasser.
Je mets mon clignotant à gauche.
Je ne double pas avant un virage, car je ne vois pas arriver les autres.
@exercices
? On dépasse par la | gauche* | droite | peu importe
? Avant de dépasser, on vérifie le = rétroviseur
? Dépasser avant un virage est | interdit* | autorisé | conseillé
@oral
Décrivez à voix haute les étapes d'un dépassement.
@eval
? Un dépassement se fait par la = gauche
? Avant de dépasser, on met son | clignotant* | essuie-glace | phare
? Dépasser dans un virage est | dangereux* | prudent | obligatoire
? Après le dépassement, on se ___ = rabat
? Il faut une bonne ___ pour dépasser = visibilité
=== Stationnement, documents et secours
--- Arrêt et stationnement
## Où s'arrêter ?
**Arrêt** : immobilisation brève, le conducteur reste. **Stationnement** : immobilisation prolongée. Sont interdits (dangereux) : dans un virage, au sommet d'une côte, sur un passage piéton, sur un trottoir.
Le stationnement **en double file** gêne la circulation et est interdit.
! Sur une place pour handicapés, seuls les titulaires de la carte peuvent se garer.
@vocab
arrêt = immobilisation brève
stationnement = immobilisation longue
stationnement dangereux = dans un virage, sur un passage piéton
double file = voiture garée à côté d'une autre
place handicapé = place réservée aux titulaires de la carte
@exemples
Je m'arrête une minute pour déposer un colis.
Je me gare sur un emplacement autorisé.
Je ne stationne jamais sur un passage piéton ni dans un virage.
@exercices
? Stationner sur un passage piéton est | interdit* | autorisé | toléré
? Immobilisation brève = arrêt
? Se garer en double file est | interdit* | autorisé | conseillé
@oral
Dites trois endroits où le stationnement est dangereux.
@eval
? Stationner dans un virage est | dangereux* | prudent | utile
? Immobilisation prolongée = stationnement
? Sur un trottoir, on | ne se gare pas* | se gare | roule
? Place handicapé : seuls les ___ de la carte = titulaires
? Double file | gêne la circulation* | est conseillée | est obligatoire
--- Permis et documents
## Papiers et points
Le permis comporte **12 points**. Un conducteur novice a **6 points** pendant la période probatoire (3 ans, 2 ans après conduite accompagnée) puis gagne 2 points par an sans infraction jusqu'à 12.
Documents : **permis**, **carte grise** (certificat d'immatriculation), **attestation d'assurance** (assurance obligatoire). **Contrôle technique** : tous les 2 ans pour une voiture de plus de 4 ans.
! L'assurance au tiers est le minimum légal.
@vocab
permis à points = 12 points maximum
période probatoire = 3 ans (2 ans en conduite accompagnée)
carte grise = certificat d'immatriculation
assurance = obligation légale
contrôle technique = examen du véhicule
@exemples
Je perds des points si je commets une infraction.
J'assure ma voiture avant de rouler.
Mon contrôle technique est valable deux ans.
@exercices
? Nombre de points maximum | 12* | 20 | 6
? Assurance auto = obligatoire
? Contrôle technique : tous les | 2 ans* | 5 ans | 10 ans
@oral
Expliquez à voix haute ce que sont la carte grise et l'assurance.
@eval
? Points de départ d'un permis probatoire = 6
? Durée de la période probatoire | 3 ans* | 1 an | 5 ans
? La carte grise est le certificat d'___ = immatriculation
? Assurance minimale | au tiers* | tous risques | facultative
? Contrôle technique : voiture de plus de | 4 ans* | 1 an | 10 ans
--- Les accidents : protéger, alerter, secourir
## PAS : protéger, alerter, secourir
**Protéger** : mettre le triangle, allumer les feux de détresse, mettre le gilet. **Alerter** : appeler le **112** (urgences européennes), le **15** (SAMU), le **18** (pompiers) ou le **17** (police). **Secourir** : ne pas déplacer un blessé sauf danger vital, ne pas enlever son casque.
Précisez le lieu, le nombre de blessés et leur état.
! Un blessé inconscient qui respire se met en position latérale de sécurité (PLS).
@vocab
protéger = éviter un sur-accident
alerter = appeler les secours
secourir = porter les premiers soins
PLS = position latérale de sécurité
gilet = vêtement fluorescent obligatoire
@exemples
Je mets mon triangle à 30 mètres.
J'appelle le 112 pour signaler l'accident.
Je ne retire pas le casque du motard blessé.
@exercices
? Numéro d'urgence européen = 112
? Numéro du SAMU | 15* | 17 | 18
? PAS signifie protéger, alerter, = secourir
@oral
Récitez à voix haute la conduite à tenir devant un accident.
@eval
? Numéro des pompiers = 18
? Numéro de la police | 17* | 15 | 18
? Un casque de motard blessé | ne s'enlève pas* | s'enlève | se secoue
? Un blessé inconscient qui respire se met en | PLS* | siège | marche
? Protéger = éviter un sur-___ = accident
`);

/* ---------- CULTURE (suite) ---------- */
cours("culture", `
=== Capitales, lettres et musique
--- Les capitales
## Les capitales européennes
France : **Paris**. Allemagne : **Berlin**. Italie : **Rome**. Espagne : **Madrid**. Portugal : **Lisbonne**. Royaume-Uni : **Londres**. Belgique : **Bruxelles**. Suisse : **Berne**. Pays-Bas : **Amsterdam**. Autriche : **Vienne**. Grèce : **Athènes**.
Hors Europe : États-Unis : Washington, Japon : Tokyo, Brésil : Brasília, Canada : Ottawa, Australie : Canberra.
! La capitale de l'Australie n'est pas Sydney mais Canberra.
@vocab
capitale = ville siège du gouvernement
Berne = capitale de la Suisse
Lisbonne = capitale du Portugal
Canberra = capitale de l'Australie
Brasília = capitale du Brésil
@exemples
Paris est la capitale de la France.
Rome est la capitale de l'Italie.
Ottawa, et non Toronto, est la capitale du Canada.
@exercices
? Capitale de l'Espagne | Madrid* | Barcelone | Séville
? Capitale du Portugal = Lisbonne
? Capitale de la Suisse | Berne* | Zurich | Genève
@oral
Citez à voix haute dix pays et leurs capitales.
@eval
? Capitale de l'Allemagne = Berlin
? Capitale de l'Australie | Canberra* | Sydney | Melbourne
? Capitale de la Belgique = Bruxelles
? Capitale du Japon | Tokyo* | Kyoto | Osaka
? Capitale du Canada = Ottawa
--- La littérature
## Grands auteurs
**Molière** (1622-1673) : comédies (Le Malade imaginaire). **Victor Hugo** : Les Misérables (1862). **Voltaire** : Candide (1759). **Marcel Proust** : À la recherche du temps perdu. **Albert Camus** : L'Étranger (1942).
Hors de France : **Shakespeare** (Roméo et Juliette), **Cervantès** (Don Quichotte), **Dante** (La Divine Comédie), **Tolstoï** (Guerre et Paix).
! Camus reçoit le prix Nobel de littérature en 1957.
@vocab
comédie = pièce qui fait rire
roman = récit long en prose
Nobel = prix international
Don Quichotte = roman de Cervantès
théâtre = genre pour la scène
@exemples
Molière écrit des comédies.
Hugo publie Les Misérables en 1862.
Shakespeare est l'auteur de Roméo et Juliette, jouée dans le monde entier.
@exercices
? Auteur des Misérables | Victor Hugo* | Molière | Camus
? Auteur de Don Quichotte = Cervantès
? Auteur de L'Étranger | Camus* | Proust | Voltaire
@oral
Présentez à voix haute un livre que vous avez aimé en trois phrases.
@eval
? Auteur de Candide = Voltaire
? Auteur de Roméo et Juliette | Shakespeare* | Molière | Hugo
? Auteur de La Divine Comédie | Dante* | Cervantès | Tolstoï
? Molière écrit surtout des | comédies* | romans | poèmes
? Auteur de À la recherche du temps perdu = Proust
--- La musique
## Compositeurs et genres
**Bach** (baroque), **Mozart** (classique, Vienne), **Beethoven** (de classique à romantique, sourd), **Debussy** (impressionnisme, Clair de lune), **Chopin** (piano romantique).
Le **jazz** naît à La Nouvelle-Orléans au début du XXe siècle ; le **rock** apparaît dans les années 1950.
! Une symphonie est jouée par un orchestre ; un concerto met un soliste en avant.
@vocab
symphonie = œuvre pour orchestre
concerto = œuvre pour soliste et orchestre
jazz = musique née à la Nouvelle-Orléans
opéra = drame chanté
orchestre = grand groupe d'instrumentistes
@exemples
Mozart compose à Vienne.
Beethoven continue de composer alors qu'il est devenu sourd.
Debussy écrit Clair de lune, une pièce pour piano pleine de couleurs.
@exercices
? Compositeur de Clair de lune | Debussy* | Mozart | Bach
? Genre né à la Nouvelle-Orléans = jazz
? Œuvre pour soliste et orchestre | concerto* | symphonie | opéra
@oral
Présentez à voix haute un morceau que vous écoutez en deux phrases.
@eval
? Compositeur baroque = Bach
? Un orchestre joue | une symphonie* | un solo | une comédie
? Compositeur devenu sourd = Beethoven
? Compositeur de piano romantique | Chopin* | Bach | Debussy
? Genre qui apparaît dans les années 1950 = rock
=== Sport, cinéma et langues
--- Les Jeux olympiques
## Une tradition renouvelée
Les Jeux de l'Antiquité sont organisés à **Olympie** (Grèce). Les Jeux modernes sont relancés par **Pierre de Coubertin**, avec les premiers à **Athènes en 1896**. Paris les accueille en 1900, 1924 et **2024**.
Le symbole : **cinq anneaux** entrelacés. Jeux d'été et d'hiver tous les quatre ans.
! Devise : « Plus vite, plus haut, plus fort — ensemble ».
@vocab
Olympie = site des Jeux antiques
Coubertin = rénovateur des Jeux modernes
anneaux olympiques = symbole des cinq continents
flamme olympique = symbole allumé à Olympie
médaille = récompense (or, argent, bronze)
@exemples
Les premiers Jeux modernes ont lieu en 1896.
La flamme est allumée à Olympie.
Paris accueille les Jeux en 2024, cent ans après 1924.
@exercices
? Fondateur des Jeux modernes | Coubertin* | Hugo | Napoléon
? Premiers Jeux modernes en = 1896
? Nombre d'anneaux = 5
@oral
Racontez à voix haute l'histoire des Jeux olympiques en trois étapes.
@eval
? Site antique des Jeux = Olympie
? Les Jeux d'été ont lieu tous les | 4 ans* | 2 ans | 10 ans
? Ville des premiers Jeux modernes | Athènes* | Paris | Londres
? Symbole : cinq ___ = anneaux
? Paris accueille les Jeux en = 2024
--- Le cinéma
## Du cinéma muet au numérique
Les frères **Lumière** projettent le premier film public à **Paris en 1895**. Le cinéma devient parlant en **1927** (Le Chanteur de jazz). La couleur se généralise au milieu du XXe siècle.
Grands noms : **Charlie Chaplin** (muet), **Alfred Hitchcock** (suspense), **Steven Spielberg**. Festival de **Cannes** (Palme d'or), cérémonie des **Oscars** à Los Angeles.
! La Nouvelle Vague française naît à la fin des années 1950.
@vocab
cinéma muet = sans paroles enregistrées
Palme d'or = prix du festival de Cannes
Oscar = récompense américaine
réalisateur = dirige le film
scénario = histoire écrite du film
@exemples
Les frères Lumière inventent le cinématographe.
Hitchcock est le maître du suspense.
Cannes décerne la Palme d'or chaque année en mai.
@exercices
? Inventeurs du cinématographe | Lumière* | Edison | Méliès
? Prix de Cannes = Palme d'or
? Premier film parlant en | 1927* | 1895 | 1960
@oral
Présentez à voix haute votre film préféré et pourquoi.
@eval
? Année de la première projection Lumière = 1895
? Chaplin est connu pour le | cinéma muet* | film d'animation | documentaire
? Cérémonie américaine = Oscars
? Hitchcock est le maître du | suspense* | western | burlesque
? Le réalisateur | dirige le film* | joue le rôle principal | vend les billets
--- Les langues du monde
## Une diversité de langues
Environ **7 000 langues** sont parlées dans le monde. Les plus parlées : **anglais**, **mandarin**, **hindi**, **espagnol**, **français**, **arabe**.
Le français est parlé sur cinq continents ; l'**Organisation internationale de la Francophonie** réunit les pays francophones.
! Beaucoup de langues sont en danger de disparition.
@vocab
langue maternelle = première langue apprise
mandarin = langue la plus parlée comme langue maternelle
francophonie = ensemble des pays parlant français
bilingue = parle deux langues
dialecte = variété régionale d'une langue
@exemples
Le mandarin est parlé par des centaines de millions de personnes.
L'espagnol est parlé dans de nombreux pays d'Amérique.
Une personne bilingue passe facilement d'une langue à l'autre.
@exercices
? Langue la plus parlée comme langue maternelle | mandarin* | français | italien
? Nombre approximatif de langues = 7000
? Parler deux langues = être | bilingue* | polyglotte | muet
@oral
Dites à voix haute « bonjour » en cinq langues.
@eval
? Langue maternelle = première langue apprise
? Le français est parlé sur | cinq continents* | un seul continent | deux continents
? Nombre de langues dans le monde | 7 000* | 700 | 70 000
? Langue officielle du Brésil | portugais* | espagnol | anglais
? Variété régionale d'une langue = dialecte
`);

/* ---------- HISTOIRE (suite) ---------- */
cours("histoire", `
=== Du Moyen Âge aux Lumières
--- Le Moyen Âge
## Mille ans d'histoire (476-1492)
**Féodalité** : le seigneur protège ses vassaux, les paysans (serfs) travaillent sa terre. **Charlemagne** est couronné empereur en **800**. Les **croisades** (1096-1270) visent Jérusalem. La **guerre de Cent Ans** (1337-1453) oppose la France et l'Angleterre ; **Jeanne d'Arc** meurt en **1431**.
La **peste noire** (1347-1352) tue un tiers des Européens.
! Les cathédrales gothiques (Notre-Dame, Chartres) illustrent la puissance de l'Église.
@vocab
féodalité = système de liens seigneurs-vassaux
serf = paysan lié à la terre du seigneur
croisade = expédition militaire vers Jérusalem
cathédrale = grande église d'un évêque
peste noire = épidémie du XIVe siècle
@exemples
Le seigneur vit dans un château fort.
Charlemagne est couronné empereur à Rome en 800.
Jeanne d'Arc aide Charles VII et est brûlée à Rouen en 1431.
@exercices
? Couronnement de Charlemagne en = 800
? Guerre de Cent Ans : France contre | l'Angleterre* | l'Espagne | l'Allemagne
? Un serf est | un paysan lié à la terre* | un chevalier | un roi
@oral
Décrivez à voix haute la société féodale en trois niveaux.
@eval
? Charlemagne est couronné en = 800
? Jeanne d'Arc meurt en | 1431* | 1337 | 1492
? Épidémie de 1347 = peste noire
? Les croisades visent | Jérusalem* | Londres | Paris
? Guerre de Cent Ans : début en | 1337* | 1453 | 1789
--- Renaissance et grandes découvertes
## Un monde qui s'ouvre
En **1492**, **Christophe Colomb** atteint l'Amérique. **Vasco de Gama** ouvre la route des Indes (1498), **Magellan** réalise le premier tour du monde (1519-1522). Cette expansion enrichit l'Europe mais entraîne la **colonisation** et la **traite négrière**.
La **Renaissance** (XVe-XVIe siècles) redécouvre l'Antiquité : Léonard de Vinci, Michel-Ange, **François Ier** à Chambord.
! La Réforme de **Luther** (1517) divise le christianisme occidental.
@vocab
Renaissance = renouveau culturel du XVe-XVIe siècle
humanisme = valorisation de l'être humain
colonisation = prise de contrôle de territoires
traite négrière = commerce d'esclaves
Réforme = mouvement religieux protestant
@exemples
Colomb atteint l'Amérique en 1492.
Magellan réalise le premier tour du monde.
François Ier invite Léonard de Vinci en France.
@exercices
? Colomb atteint l'Amérique en = 1492
? Premier tour du monde | Magellan* | Colomb | Cook
? La Renaissance redécouvre | l'Antiquité* | le Moyen Âge | l'Égypte
@oral
Expliquez à voix haute pourquoi les grandes découvertes changent le monde.
@eval
? Route des Indes par | Vasco de Gama* | Colomb | Magellan
? Réforme de Luther en = 1517
? François Ier est roi de | France* | Espagne | Angleterre
? Humanisme valorise | l'être humain* | le roi | l'armée
? Traite négrière = commerce d'___ = esclaves
--- Louis XIV et les Lumières
## Du Roi-Soleil à la critique des pouvoirs
**Louis XIV** règne de 1643 à 1715 (72 ans), s'installe à **Versailles**, concentre le pouvoir (**monarchie absolue**). Au XVIIIe siècle, les **Lumières** (**Voltaire**, **Rousseau**, **Diderot** et l'**Encyclopédie**) défendent la raison, la liberté et la tolérance.
**Montesquieu** théorise la séparation des pouvoirs (1748).
! Les Lumières préparent la Révolution française.
@vocab
monarchie absolue = roi qui détient tous les pouvoirs
Versailles = château de Louis XIV
Lumières = mouvement de la raison
Encyclopédie = grand ouvrage dirigé par Diderot
tolérance = respect des opinions des autres
@exemples
Louis XIV est surnommé le Roi-Soleil.
Voltaire combat l'intolérance.
Diderot et d'Alembert dirigent l'Encyclopédie pour diffuser les connaissances.
@exercices
? Roi-Soleil = Louis XIV
? Château de Louis XIV | Versailles* | Chambord | Fontainebleau
? Auteur de l'Encyclopédie (directeur) | Diderot* | Voltaire | Rousseau
@oral
Comparez à voix haute le pouvoir de Louis XIV et les idées des Lumières.
@eval
? Durée du règne de Louis XIV : environ | 72 ans* | 20 ans | 10 ans
? Les Lumières défendent la | raison* | tradition | guerre
? Séparation des pouvoirs = Montesquieu
? Monarchie absolue : tous les pouvoirs au | roi* | peuple | Parlement
? Voltaire combat | l'intolérance* | la science | l'imprimerie
=== Des empires à la Ve République
--- Napoléon et le XIXe siècle
## 1799-1870
**Napoléon Bonaparte** devient Empereur en **1804**. Il crée le **Code civil** (1804) et les lycées. Défait à **Waterloo** en **1815**, il est exilé à Sainte-Hélène. Suivent la Restauration, la monarchie de Juillet (1830) et la **IIe République** (1848).
**Napoléon III** instaure le Second Empire (1852-1870) ; la **IIIe République** naît en **1870**.
! Le Code civil reste la base du droit français.
@vocab
Code civil = ensemble des lois civiles (1804)
Empire = régime dirigé par un empereur
Waterloo = bataille de 1815
exil = éloignement forcé
suffrage = vote
@exemples
Napoléon est couronné en 1804.
Waterloo marque la fin de l'Empire.
En 1848, le suffrage universel masculin est instauré.
@exercices
? Napoléon devient empereur en = 1804
? Bataille de la défaite finale | Waterloo* | Verdun | Austerlitz
? Napoléon est exilé à | Sainte-Hélène* | Paris | Corse
@oral
Racontez à voix haute la vie de Napoléon en cinq dates.
@eval
? Code civil = 1804
? Début de la IIIe République = 1870
? Napoléon III dirige | le Second Empire* | la Première République | la Restauration
? Défaite de 1815 = Waterloo
? Régime de 1848 | IIe République* | Empire | monarchie absolue
--- Guerre froide et décolonisation
## 1945-1991
Après 1945, le monde se divise entre le bloc de l'**Ouest** (États-Unis) et le bloc de l'**Est** (URSS) : c'est la **guerre froide**. Le **mur de Berlin** est construit en **1961** et tombe le **9 novembre 1989**. L'URSS disparaît en **1991**.
La **décolonisation** : l'Inde (1947), l'Algérie (1962), de nombreux pays africains (1960).
! Guerre froide = pas de combat direct entre les deux superpuissances.
@vocab
guerre froide = rivalité États-Unis / URSS
bloc = groupe de pays alliés
décolonisation = indépendance des colonies
mur de Berlin = frontière de 1961 à 1989
URSS = Union soviétique
@exemples
Le mur de Berlin sépare l'Est et l'Ouest.
L'Inde devient indépendante en 1947.
Plusieurs pays africains accèdent à l'indépendance en 1960.
@exercices
? Chute du mur de Berlin en = 1989
? Deux blocs : États-Unis et | URSS* | Chine | Japon
? Indépendance de l'Algérie en | 1962* | 1945 | 1789
@oral
Expliquez à voix haute ce qu'est la guerre froide en trois phrases.
@eval
? Construction du mur de Berlin en = 1961
? Disparition de l'URSS en | 1991* | 1945 | 1989
? Indépendance de l'Inde en = 1947
? Décolonisation : indépendance des | colonies* | empires | villes
? Bloc de l'Ouest dirigé par | États-Unis* | URSS | Chine
--- Géographie : la France
## Repères géographiques
La France métropolitaine compte **13 régions** et environ **68 millions d'habitants** (avec l'outre-mer). Plus long fleuve : la **Loire** (environ 1 000 km). Point culminant : le **Mont Blanc** (4 805 m).
Massifs : Alpes, Pyrénées, Massif central, Vosges, Jura. Capitale : Paris.
! La France a des façades sur la Manche, l'Atlantique et la Méditerranée.
@vocab
région = grande division administrative
métropole = France européenne
massif = ensemble de montagnes
fleuve = cours d'eau qui se jette dans la mer
outre-mer = territoires hors d'Europe
@exemples
La Loire traverse plusieurs régions.
Le Mont Blanc est dans les Alpes.
Le Rhône traverse Lyon avant de rejoindre la Méditerranée.
@exercices
? Plus long fleuve de France | Loire* | Seine | Rhône
? Point culminant = Mont Blanc
? Nombre de régions métropolitaines = 13
@oral
Situez à voix haute cinq villes françaises avec leur région.
@eval
? Point culminant de la France | Mont Blanc* | Pic du Midi | Ventoux
? Fleuve de Paris = Seine
? Massif des Pyrénées est au | sud* | nord | est
? Mer au sud de la France | Méditerranée* | Manche | mer du Nord
? Altitude du Mont Blanc (m) = 4805
`);

/* ---------- MATHÉMATIQUES (suite) ---------- */
cours("maths", `
=== Nombres, puissances et géométrie
--- Priorités opératoires et nombres relatifs
## Dans quel ordre calculer ?
On calcule d'abord les **parenthèses**, puis les **puissances**, puis les **multiplications et divisions**, enfin les **additions et soustractions**. 2 + 3 × 4 = **14** (et non 20).
**Nombres relatifs** : (−3) + 5 = 2 ; (−2) × (−4) = 8 ; (−6) ÷ 3 = −2. Moins par moins donne plus.
! (−3) × 4 = −12 : un nombre négatif multiplié par un positif donne un négatif.
@vocab
priorité opératoire = ordre de calcul
parenthèses = calculées en premier
relatif = nombre positif ou négatif
opposé = nombre de signe contraire
valeur absolue = distance à zéro
@exemples
2 + 3 × 4 = 14.
(2 + 3) × 4 = 20.
−5 + 8 − 2 × 3 = −3.
@exercices
? 2 + 3 × 4 = 14
? (−2) × (−4) = 8
? 10 − 4 × 2 | 2* | 12 | 8
@oral
Calculez à voix haute 5 + 2 × 6 et expliquez l'ordre.
@eval
? 3 + 4 × 2 = 11
? (3 + 4) × 2 = 14
? (−5) + 8 = 3
? (−6) ÷ 3 = −2
? 20 − 3 × 5 | 5* | 85 | 15
--- Puissances et racines carrées
## Écrire plus court
a² = a × a ; a³ = a × a × a. 5² = 25, 2³ = 8. 10³ = 1 000. Un nombre à la puissance 0 vaut 1.
**Racine carrée** : √25 = 5, √81 = 9, √2 ≈ 1,414. On a √(a²) = a pour a positif.
! Carré parfaits : 1, 4, 9, 16, 25, 36, 49, 64, 81, 100.
@vocab
puissance = multiplication répétée
carré = nombre multiplié par lui-même
cube = nombre multiplié trois fois
racine carrée = nombre dont le carré est donné
carré parfait = carré d'un entier
@exemples
3² = 9.
2³ = 8.
√49 = 7 et 5² = 25.
@exercices
? 5² = 25
? √81 = 9
? 2³ | 8* | 6 | 9
@oral
Récitez à voix haute les carrés de 1 à 10.
@eval
? 4² = 16
? 10³ = 1000
? √64 = 8
? 3³ | 27* | 9 | 18
? √100 = 10
--- Périmètres et aires
## Formules à connaître
Rectangle : périmètre = 2 × (L + l), aire = L × l. Carré : aire = c². **Triangle** : aire = base × hauteur ÷ 2. **Cercle** : périmètre = 2 × π × r, aire = π × r².
π ≈ 3,14. Un rectangle 5 × 3 a pour aire 15 et pour périmètre 16.
! L'aire s'exprime en unités carrées (cm², m²).
@vocab
périmètre = longueur du contour
aire = surface
hauteur = distance perpendiculaire à la base
rayon = distance du centre au bord
diamètre = 2 × le rayon
@exemples
Aire d'un rectangle 5 × 3 = 15.
Aire d'un triangle de base 6 et hauteur 4 = 12.
Périmètre d'un cercle de rayon 5 ≈ 31,4.
@exercices
? Aire d'un rectangle 5 × 3 = 15
? Aire d'un carré de côté 4 = 16
? Aire d'un triangle (base 6, hauteur 4) | 12* | 24 | 10
@oral
Expliquez à voix haute la différence entre périmètre et aire.
@eval
? Périmètre d'un carré de côté 5 = 20
? Aire d'un rectangle 8 × 2 = 16
? Aire d'un triangle (base 10, hauteur 3) = 15
? Diamètre = 2 × le | rayon* | côté | périmètre
? Aire d'un carré de côté 6 = 36
=== Proportionnalité, Pythagore et statistiques
--- Proportionnalité et règle de trois
## Quand deux grandeurs évoluent ensemble
Si 3 kg de pommes coûtent 6 €, alors 1 kg coûte 2 € et 5 kg coûtent 10 €. On utilise le **coefficient de proportionnalité** (ici 2 €/kg) ou la **règle de trois** : on ramène à l'unité.
Vitesse : v = d ÷ t. Une voiture qui roule 120 km en 2 h va à 60 km/h.
! Pour vérifier : le rapport entre les deux grandeurs doit rester constant.
@vocab
proportionnalité = rapport constant
coefficient = nombre multiplicateur
règle de trois = calcul par retour à l'unité
vitesse = distance ÷ temps
échelle = rapport carte / réel
@exemples
3 kg coûtent 6 €, donc 5 kg coûtent 10 €.
120 km en 2 h : 60 km/h.
Une carte au 1/100 000 : 1 cm représente 1 km.
@exercices
? 3 kg coûtent 6 €. Combien coûtent 5 kg (en €) ? = 10
? Vitesse : 120 km en 2 h (km/h) = 60
? Formule de la vitesse | d ÷ t* | d × t | t ÷ d
@oral
Expliquez à voix haute comment trouver le prix de 7 objets si 4 coûtent 12 €.
@eval
? 4 stylos coûtent 8 €. 6 stylos coûtent (€) = 12
? 150 km en 3 h : vitesse (km/h) = 50
? Coefficient si 5 kg coûtent 15 € (€/kg) = 3
? 1 cm sur une carte au 1/100 000 | 1 km* | 100 m | 10 km
? 90 km/h pendant 2 h : distance (km) = 180
--- Le théorème de Pythagore
## Triangle rectangle
Dans un **triangle rectangle**, le carré de l'**hypoténuse** (côté opposé à l'angle droit) est égal à la somme des carrés des deux autres côtés : **a² + b² = c²**.
Triplet célèbre : 3-4-5 (3² + 4² = 9 + 16 = 25 = 5²). Autre : 5-12-13.
! L'hypoténuse est toujours le plus long côté.
@vocab
hypoténuse = côté opposé à l'angle droit
triangle rectangle = avec un angle de 90°
théorème = énoncé démontré
réciproque = permet de prouver un angle droit
triplet pythagoricien = trois entiers vérifiant a² + b² = c²
@exemples
3² + 4² = 5².
5² + 12² = 13².
Dans un triangle de côtés 6 et 8, l'hypoténuse mesure 10.
@exercices
? Triangle de côtés 3 et 4 : hypoténuse = 5
? Hypoténuse de côtés 6 et 8 = 10
? L'hypoténuse est | le plus long côté* | le plus court | la hauteur
@oral
Énoncez à voix haute le théorème de Pythagore et donnez un exemple.
@eval
? Hypoténuse de côtés 5 et 12 = 13
? Triplet pythagoricien | 3-4-5* | 2-3-4 | 4-5-7
? 9 + 16 = 25 → √25 = 5
? Hypoténuse = côté opposé à l'angle ___ = droit
? Hypoténuse de côtés 9 et 12 = 15
--- Moyenne, médiane, étendue
## Résumer des données
**Moyenne** = somme ÷ nombre de valeurs. Pour 10, 12, 14 : 36 ÷ 3 = **12**. **Médiane** = valeur du milieu quand les données sont rangées (5 → 1, 3, **5**, 7, 9). **Étendue** = max − min.
La médiane est moins sensible aux valeurs extrêmes que la moyenne.
! Avec un nombre pair de valeurs, la médiane est la moyenne des deux valeurs centrales.
@vocab
moyenne = somme ÷ effectif
médiane = valeur centrale
étendue = écart entre max et min
effectif = nombre de valeurs
fréquence = effectif ÷ total
@exemples
Notes 10, 12, 14 : moyenne 12.
Données 1, 3, 5, 7, 9 : médiane 5.
Notes 4, 8, 12, 16 : étendue 12 et médiane 10.
@exercices
? Moyenne de 10, 12, 14 = 12
? Médiane de 1, 3, 5, 7, 9 = 5
? Étendue de 4, 8, 12, 16 = 12
@oral
Calculez à voix haute la moyenne de vos trois dernières notes.
@eval
? Moyenne de 8, 10, 12 = 10
? Médiane de 2, 4, 6 = 4
? Étendue de 5, 9, 20 = 15
? Médiane de 1, 2, 3, 4 | 2,5* | 2 | 3
? Moyenne de 15 et 17 = 16
`);

/* ======== contenu-savoirs-3.js ======== */
/* ---------- ÉLOQUENCE (suite) ---------- */
cours("eloquence", `
=== Techniques de persuasion
--- Les figures de l'orateur
## Frapper les esprits
**Anaphore** : répéter un mot en début de phrase (« Moi, président... »). **Gradation** : intensité croissante (« un pas, une course, un bond »). **Antithèse** : opposer deux idées. **Métaphore** et **comparaison** : images qui parlent. **Question rhétorique** : question sans attente de réponse.
**Martin Luther King** (« I have a dream », 1963) utilise l'anaphore.
! Une figure bien placée vaut mieux que dix figures en rafale.
@vocab
anaphore = répétition en début de phrase
gradation = progression d'intensité
antithèse = opposition de deux idées
question rhétorique = question sans réponse attendue
image = métaphore ou comparaison
@exemples
Nous voulons la paix, nous voulons la justice, nous voulons l'avenir.
Un pas, puis deux, puis une course.
Peut-on vraiment rester sans rien faire ?
@exercices
? Répétition en début de phrase | anaphore* | gradation | antithèse
? Question sans réponse attendue = question rhétorique
? « Du silence au cri » est | une gradation* | une anaphore | une comparaison
@oral
Prononcez une courte phrase avec une anaphore sur le thème « l'avenir ».
@eval
? « Je veux, je veux, je veux » est | une anaphore* | une antithèse | une métaphore
? « Le jour et la nuit » est | une antithèse* | une métaphore | une anaphore
? « Qui peut dire non ? » est une question | rhétorique* | fermée | simple
? Discours « I have a dream » = Martin Luther King
? « Un mot, un cri, un hurlement » est | une gradation* | une antithèse | une anaphore
--- Raconter une histoire
## Le pouvoir du récit
Une histoire retient mieux qu'un chiffre. Structure : **situation initiale**, **problème**, **action**, **résolution**, **leçon**. Utilisez des détails concrets (un lieu, un prénom, une émotion).
Racontez au **présent** pour donner de la vie, et terminez par le lien avec votre message.
! Une anecdote de 30 secondes suffit.
@vocab
récit = enchaînement d'événements racontés
storytelling = art de raconter pour convaincre
détail concret = élément précis
résolution = fin du problème
leçon = message à retenir
@exemples
Il y a un an, Léa ratait chaque examen.
Elle change sa méthode et réussit en trois mois.
Retenez ceci : la régularité bat le talent.
@exercices
? Une bonne histoire contient | un problème et une résolution* | uniquement des chiffres | une liste
? Message à retenir d'une histoire = leçon
? Le présent donne | de la vie au récit* | de la distance | de la confusion
@oral
Racontez en 30 secondes une anecdote suivie d'une leçon.
@eval
? Premier élément du récit = situation initiale
? Un détail concret est | précis* | vague | inutile
? Un récit doit avoir une | résolution* | conclusion vide | liste
? Durée idéale d'une anecdote | 30 secondes* | 30 minutes | 5 secondes
? Fin d'un récit : le ___ = message / leçon
--- Répondre aux objections
## Rester serein face à la critique
Écoutez jusqu'au bout, **reformulez** l'objection (« Si je comprends bien... »), **reconnaissez** ce qui est juste, puis **répondez** avec un fait ou un exemple. Évitez l'agressivité.
Si vous ne savez pas, dites-le et proposez de revenir avec la réponse.
! Ne répondez jamais à une attaque par une attaque.
@vocab
objection = critique d'un argument
reformuler = redire avec ses mots
concéder = reconnaître une part de vérité
réfuter = montrer qu'un argument est faux
sérénité = calme
@exemples
Si je comprends bien, vous craignez le coût.
Vous avez raison sur ce point, mais voici un chiffre.
Je ne connais pas la réponse exacte ; je reviens vers vous demain.
@exercices
? Reformuler une objection permet de | montrer qu'on a compris* | éviter la question | gagner du temps
? Reconnaître une part de vérité = concéder
? Face à une attaque, on reste | calme* | agressif | silencieux pour toujours
@oral
Répondez à voix haute à l'objection : « C'est trop cher ».
@eval
? Reformuler = redire avec ses ___ mots = propres
? Concéder = reconnaître une part de | vérité* | colère | doute
? Si on ne sait pas, on | l'admet* | invente | change de sujet
? Réfuter = montrer qu'un argument est | faux* | beau | long
? Étape : écouter puis | reformuler* | couper | rire
=== Situations d'expression
--- Le débat
## Argumenter face à un adversaire
Un débat se prépare : **thèse** claire, **deux ou trois arguments**, **exemples**, **réponses prévues**. On écoute, on note, on ne coupe pas la parole.
Distinguez l'**argument** (une raison) de l'**exemple** (une illustration).
! Attaquer l'idée, jamais la personne.
@vocab
thèse = position défendue
argument = raison à l'appui d'une thèse
contre-argument = raison opposée
exemple = illustration concrète
modérateur = personne qui régule le débat
@exemples
Je défends la thèse suivante : le sport doit être obligatoire à l'école.
Mon premier argument : il améliore la santé.
Mon adversaire dit que cela coûte cher ; je lui réponds que prévenir coûte moins que soigner.
@exercices
? La position défendue s'appelle la | thèse* | chute | transition
? Une raison à l'appui d'une idée = argument
? Dans un débat, on | écoute et note* | coupe la parole | crie
@oral
Défendez pendant une minute la thèse « les devoirs sont inutiles ».
@eval
? Raison opposée = contre-argument
? Le modérateur | régule le débat* | gagne le débat | contredit tout
? Un exemple sert à | illustrer* | contredire | ennuyer
? Attaquer l'idée et non la ___ = personne
? Nombre d'arguments conseillés | 2 ou 3* | 10 | 0
--- Le pitch
## Convaincre en une minute
Un **pitch** présente un projet en 60 secondes : **problème**, **solution**, **bénéfice**, **demande**. Parlez à une seule personne imaginaire, évitez le jargon, terminez par un appel à l'action.
Répétez à voix haute avec un chronomètre.
! Un pitch réussi se résume en une phrase.
@vocab
pitch = présentation courte et percutante
problème = besoin non satisfait
solution = réponse au problème
bénéfice = avantage pour le client
appel à l'action = demande finale
@exemples
Chaque jour, trois repas sur dix sont jetés.
Notre application les revend à moitié prix.
Rejoignez-nous : testez-la gratuitement dès cette semaine.
@exercices
? Un pitch dure environ | 60 secondes* | 30 minutes | 5 heures
? Structure : problème, solution, bénéfice, = demande
? Le jargon est | à éviter* | conseillé | obligatoire
@oral
Présentez en une minute un projet fictif avec problème, solution, bénéfice et demande.
@eval
? Dernier élément d'un pitch = appel à l'action
? Pitch signifie | présentation courte* | contrat | débat
? Le problème est | un besoin non satisfait* | une solution | un prix
? On répète avec un | chronomètre* | marteau | tableau
? Bénéfice = ___ pour le client = avantage
--- L'improvisation
## Parler sans préparation
Pour improviser : **respirer**, choisir **une idée** et la structurer en **trois temps** (passé, présent, avenir ou problème, cause, solution). Gagnez du temps en reformulant la question.
Ne vous excusez pas : continuez avec confiance.
! L'improvisation s'entraîne : tirez un sujet au hasard chaque jour.
@vocab
improviser = parler sans préparation
structure = plan en trois temps
confiance = assurance
reformuler = redire la question
entraînement = pratique régulière
@exemples
Respirez, souriez, puis commencez.
Passé : comment c'était. Présent : où nous en sommes. Avenir : où nous allons.
La question est : pourquoi apprendre ? Voici trois raisons.
@exercices
? Pour improviser, on commence par | respirer* | s'excuser | se taire
? Plan en trois temps : passé, présent, = avenir
? Reformuler la question permet de | gagner du temps* | l'éviter | se moquer
@oral
Tirez un mot au hasard et parlez-en 45 secondes en trois temps.
@eval
? Improviser = parler sans ___ = préparation
? Un plan en trois temps est | simple et efficace* | inutile | interdit
? S'excuser en début de prise de parole | affaiblit* | renforce | est obligatoire
? Pour progresser, il faut | s'entraîner* | éviter | attendre
? Structure : problème, cause, = solution
`);

/* ---------- POLITIQUE (suite) ---------- */
cours("politique", `
=== Élections, idées et pouvoirs
--- Les modes de scrutin
## Comment élire ?
**Scrutin majoritaire** : le candidat qui a le plus de voix est élu (à un ou **deux tours**). **Scrutin proportionnel** : les sièges sont répartis selon le pourcentage de voix obtenu par chaque liste.
Présidentielle : deux tours, **majorité absolue** (plus de 50 %) requise pour gagner au premier tour.
! Abstention = ne pas voter ; vote blanc = bulletin vierge.
@vocab
scrutin = mode de vote
majoritaire = le plus de voix gagne
proportionnel = sièges selon le pourcentage
abstention = refus de voter
vote blanc = bulletin sans nom
@exemples
Présidentielle : deux tours.
Européennes : scrutin proportionnel.
Au second tour, les deux candidats arrivés en tête s'affrontent.
@exercices
? Scrutin où les sièges suivent le pourcentage de voix | proportionnel* | majoritaire | tiré au sort
? Pour gagner au premier tour, il faut plus de ___ % = 50
? Ne pas aller voter = abstention
@oral
Expliquez à voix haute la différence entre scrutin majoritaire et proportionnel.
@eval
? Présidentielle : nombre de tours maximum = 2
? Scrutin majoritaire : le plus de voix | gagne* | perd | est tiré au sort
? Bulletin sans nom = vote blanc
? Majorité absolue = plus de ___ % = 50
? Européennes : scrutin | proportionnel* | majoritaire | indirect
--- Les grands courants d'idées
## Libéralisme, socialisme, écologie, conservatisme
Le **libéralisme** défend la liberté individuelle et le marché. Le **socialisme** défend l'égalité et le rôle de l'État. L'**écologisme** place l'environnement au cœur des choix. Le **conservatisme** défend la tradition et la stabilité.
La distinction **droite / gauche** vient de l'Assemblée de 1789 : les partisans du roi à droite.
! Les partis mélangent souvent plusieurs courants.
@vocab
libéralisme = priorité à la liberté individuelle
socialisme = priorité à l'égalité
écologisme = priorité à l'environnement
conservatisme = attachement à la tradition
clivage = division gauche / droite
@exemples
Un libéral réduit le rôle de l'État.
Un socialiste défend les services publics.
Un écologiste propose de taxer la pollution.
@exercices
? Idée centrale du libéralisme | la liberté individuelle* | l'égalité absolue | la tradition
? Le socialisme défend l' = égalité
? Clivage gauche-droite né en | 1789* | 1958 | 1945
@oral
Présentez à voix haute deux courants et un point de désaccord, sans donner votre avis.
@eval
? Écologisme : priorité à | l'environnement* | l'armée | la finance
? Conservatisme : attachement à la = tradition
? Gauche / droite vient de | l'Assemblée de 1789* | la Ve République | l'ONU
? Libéralisme défend | le marché et la liberté* | la dictature | l'impôt maximum
? Socialisme défend le rôle de l' = État
--- La séparation des pouvoirs
## Pour éviter l'abus de pouvoir
**Montesquieu** (De l'esprit des lois, 1748) distingue : le pouvoir **législatif** (faire les lois), **exécutif** (les appliquer) et **judiciaire** (juger). Il faut que « le pouvoir arrête le pouvoir ».
En France : Parlement (législatif), Président et Gouvernement (exécutif), tribunaux (judiciaire).
! La presse est parfois appelée « quatrième pouvoir ».
@vocab
législatif = fait les lois
exécutif = applique les lois
judiciaire = juge les litiges
Montesquieu = théoricien de la séparation des pouvoirs
tribunal = juridiction qui juge
@exemples
Le Parlement vote la loi.
Le Gouvernement applique la loi.
Un tribunal juge un litige conformément à la loi.
@exercices
? Pouvoir qui fait les lois | législatif* | exécutif | judiciaire
? Pouvoir qui juge = judiciaire
? Auteur de De l'esprit des lois | Montesquieu* | Rousseau | Voltaire
@oral
Expliquez à voix haute pourquoi il faut séparer les pouvoirs.
@eval
? Pouvoir exécutif = applique les lois
? De l'esprit des lois publié en | 1748* | 1789 | 1958
? Pouvoir législatif | Parlement* | tribunaux | Président
? Pouvoir judiciaire | tribunaux* | Parlement | police
? Trois pouvoirs : législatif, exécutif, = judiciaire
=== Territoires et monde
--- Communes, départements, régions
## L'organisation territoriale
La France compte environ **35 000 communes**, **101 départements** et **18 régions** (13 en métropole). La **commune** est dirigée par le **maire**, élu par le conseil municipal. Le **département** par un conseil départemental, la **région** par un conseil régional.
Les collectivités gèrent écoles, routes, transports, culture.
! La décentralisation (lois de 1982) transfère des compétences de l'État aux collectivités.
@vocab
commune = plus petit échelon territorial
département = collectivité intermédiaire
région = grande collectivité
maire = chef de l'exécutif communal
décentralisation = transfert de pouvoirs
@exemples
Le maire gère la mairie.
Le département finance les collèges.
La région s'occupe des lycées et des transports régionaux.
@exercices
? Chef d'une commune | maire* | préfet | député
? Nombre de départements = 101
? Les régions gèrent | les lycées* | les écoles primaires | la défense
@oral
Citez à voix haute trois compétences de la commune, du département et de la région.
@eval
? Échelon le plus petit = commune
? Le département finance les | collèges* | lycées | universités
? Nombre de régions (total) | 18* | 13 | 22
? Décentralisation = ___ de pouvoirs = transfert
? Le maire est élu par le conseil | municipal* | régional | national
--- L'ONU et les organisations internationales
## Coopérer à l'échelle mondiale
L'**ONU** est créée en **1945** à San Francisco (siège à New York). Le **Conseil de sécurité** compte 5 membres permanents (États-Unis, Russie, Chine, France, Royaume-Uni). L'**OTAN** (1949) est une alliance militaire. L'**OMC** régule le commerce, l'**OMS** la santé.
La **Déclaration universelle des droits de l'homme** est adoptée en **1948**.
! Un membre permanent peut bloquer une résolution (droit de veto).
@vocab
ONU = Organisation des Nations unies
Conseil de sécurité = organe chargé de la paix
veto = droit de blocage
OTAN = alliance militaire de 1949
OMS = Organisation mondiale de la santé
@exemples
L'ONU est fondée en 1945.
La France est membre permanent du Conseil de sécurité.
L'OMS coordonne la lutte contre les épidémies.
@exercices
? Création de l'ONU en = 1945
? Droit de blocage d'un membre permanent = veto
? Organisation de la santé | OMS* | OMC | OTAN
@oral
Expliquez à voix haute le rôle de l'ONU en deux phrases.
@eval
? Siège de l'ONU | New York* | Paris | Genève
? Nombre de membres permanents du Conseil de sécurité = 5
? Déclaration universelle des droits de l'homme en | 1948* | 1789 | 1958
? OTAN créée en = 1949
? OMC régule le | commerce* | climat | sport
--- Droits et devoirs du citoyen
## Vivre ensemble
Droits : **liberté d'expression**, **liberté de conscience**, droit de **vote** (dès 18 ans), droit à l'éducation. Devoirs : **respecter la loi**, **payer l'impôt**, participer à la **défense** (journée défense et citoyenneté).
La **laïcité** (loi de 1905) sépare l'État et les religions et garantit la liberté de croire ou de ne pas croire.
! Les libertés de chacun s'arrêtent là où commencent celles des autres.
@vocab
citoyen = membre d'une communauté politique
liberté d'expression = droit de dire ce qu'on pense
laïcité = neutralité de l'État face aux religions
impôt = contribution financière
civisme = respect des règles communes
@exemples
Je vote dès l'âge de 18 ans.
Je paie mes impôts selon mes revenus.
La laïcité garantit la liberté de conscience de chacun.
@exercices
? Âge du droit de vote en France = 18
? Loi de séparation des Églises et de l'État | 1905* | 1789 | 1945
? Devoir du citoyen | payer l'impôt* | choisir les juges | gouverner
@oral
Citez à voix haute trois droits et trois devoirs du citoyen.
@eval
? Laïcité : loi de = 1905
? Liberté d'expression = droit de dire ce qu'on ___ = pense
? L'impôt est | un devoir* | un choix | une interdiction
? Droit de vote à | 18 ans* | 16 ans | 21 ans
? La laïcité garantit la liberté de | conscience* | commerce | vitesse
`);

/* ---------- SCIENCES (suite) ---------- */
cours("sciences", `
=== Physique et chimie
--- L'énergie
## Formes et sources
Formes : **cinétique** (mouvement), **potentielle** (position), **thermique** (chaleur), **électrique**, **chimique**, **nucléaire**. L'énergie se **conserve** : elle se transforme sans disparaître. Unité : le **joule** (J).
Sources **renouvelables** : soleil, vent, eau, biomasse. **Non renouvelables** : pétrole, charbon, gaz, uranium.
! Une éolienne transforme l'énergie cinétique du vent en énergie électrique.
@vocab
énergie cinétique = liée au mouvement
énergie potentielle = liée à la position
renouvelable = qui se reconstitue vite
fossile = pétrole, charbon, gaz
joule = unité d'énergie
@exemples
Une pierre en haut d'une falaise a de l'énergie potentielle.
Une voiture en mouvement a de l'énergie cinétique.
Un panneau solaire transforme la lumière en électricité.
@exercices
? Unité de l'énergie | joule* | watt | newton
? Énergie du mouvement = cinétique
? Source renouvelable | vent* | pétrole | charbon
@oral
Expliquez à voix haute le trajet de l'énergie d'une centrale hydraulique à votre lampe.
@eval
? Énergie liée à la position | potentielle* | cinétique | thermique
? L'énergie se ___ = conserve
? Énergie non renouvelable | pétrole* | vent | soleil
? Symbole du joule = J
? Éolienne : énergie du vent en énergie | électrique* | nucléaire | chimique
--- L'électricité
## Tension, intensité, résistance
**Tension** U en **volts** (V), **intensité** I en **ampères** (A), **résistance** R en **ohms** (Ω). **Loi d'Ohm** : **U = R × I**. Puissance : P = U × I, en **watts** (W).
Un circuit en **série** a une seule boucle ; en **dérivation**, plusieurs branches. Les prises domestiques délivrent environ 230 V.
! Ne touchez jamais un fil électrique dénudé : danger de mort.
@vocab
tension = différence de potentiel (V)
intensité = débit de charges (A)
résistance = opposition au courant (Ω)
loi d'Ohm = U = R × I
circuit = chemin fermé du courant
@exemples
Une résistance de 10 Ω traversée par 2 A a une tension de 20 V.
Une lampe de 60 W consomme 60 joules par seconde.
Dans un circuit en série, si une lampe s'éteint, toutes s'éteignent.
@exercices
? Unité de la tension | volt* | ampère | ohm
? U = R × I avec R = 10 et I = 2, U = 20
? Unité de l'intensité | ampère* | watt | joule
@oral
Expliquez à voix haute la loi d'Ohm avec un exemple chiffré.
@eval
? R = 5 Ω, I = 3 A, U = 15
? Unité de la résistance | ohm* | volt | ampère
? Symbole du watt = W
? Circuit à une seule boucle | série* | dérivation | ouvert
? Tension d'une prise domestique (V) = 230
--- Atomes et éléments
## La matière en petit
L'**atome** est composé d'un **noyau** (protons positifs, neutrons neutres) et d'**électrons** négatifs. Le **tableau périodique** de **Mendeleïev** (1869) classe les éléments par numéro atomique (nombre de protons).
**H₂O** : 2 atomes d'hydrogène et 1 d'oxygène. **CO₂** : 1 carbone, 2 oxygènes.
! Les molécules sont des assemblages d'atomes.
@vocab
atome = plus petite unité d'un élément
proton = charge positive dans le noyau
électron = charge négative autour du noyau
molécule = assemblage d'atomes
élément = type d'atome
@exemples
L'eau est H₂O.
Le dioxyde de carbone est CO₂.
Le sel de cuisine est un assemblage de sodium et de chlore.
@exercices
? Particule négative | électron* | proton | neutron
? Formule de l'eau = H2O
? Auteur du tableau périodique | Mendeleïev* | Newton | Pasteur
@oral
Décrivez à voix haute la structure d'un atome en trois phrases.
@eval
? Particule positive du noyau | proton* | électron | neutron
? Tableau périodique en | 1869* | 1789 | 1945
? CO2 : nombre d'atomes d'oxygène = 2
? Atome = noyau + ___ = électrons
? Numéro atomique = nombre de | protons* | neutrons | molécules
=== Vivant et Terre
--- Le corps humain
## Organes et fonctions
**Cœur** : pompe le sang. **Poumons** : échangent l'oxygène et le CO₂. **Estomac** et **intestins** : digestion. **Cerveau** : commande. **Reins** : filtrent le sang. **Foie** : transforme et stocke.
Le corps humain adulte compte environ **206 os** et plus de 600 muscles. Le cœur bat environ 70 fois par minute au repos.
! Le sang circule dans les artères (vers les organes) et les veines (retour au cœur).
@vocab
cœur = organe qui pompe le sang
poumon = organe de la respiration
cerveau = centre du système nerveux
artère = vaisseau qui part du cœur
veine = vaisseau qui revient au cœur
@exemples
Le cœur envoie le sang dans tout le corps.
Les poumons apportent l'oxygène au sang.
Le cerveau coordonne les mouvements et les pensées.
@exercices
? Organe qui pompe le sang | cœur* | foie | rein
? Nombre d'os d'un adulte = 206
? Les poumons assurent la | respiration* | digestion | circulation
@oral
Décrivez à voix haute le trajet de l'air de la bouche aux poumons.
@eval
? Organe qui filtre le sang | rein* | poumon | estomac
? Nombre d'os adulte | 206* | 106 | 306
? Les artères partent du = cœur
? Les veines | reviennent au cœur* | partent du cœur | digèrent
? Le cerveau est le centre du système | nerveux* | digestif | osseux
--- L'évolution
## Darwin et la sélection naturelle
**Charles Darwin** publie **L'Origine des espèces** en **1859**. Les individus d'une espèce varient ; ceux qui sont le mieux adaptés à leur milieu survivent et se reproduisent davantage : c'est la **sélection naturelle**.
Les **fossiles** montrent l'histoire du vivant. L'être humain (Homo sapiens) est apparu en Afrique il y a environ 300 000 ans.
! L'évolution est une théorie scientifique solidement étayée.
@vocab
évolution = transformation des espèces au fil du temps
sélection naturelle = survie des mieux adaptés
fossile = reste d'un être vivant ancien
espèce = ensemble d'individus interféconds
adaptation = ajustement au milieu
@exemples
Les girafes à long cou accèdent mieux aux feuilles hautes.
Un fossile raconte la vie d'il y a des millions d'années.
Les bactéries résistantes aux antibiotiques illustrent la sélection naturelle.
@exercices
? Auteur de L'Origine des espèces | Darwin* | Pasteur | Mendel
? L'Origine des espèces publiée en = 1859
? La sélection naturelle favorise | les mieux adaptés* | les plus grands | les plus rares
@oral
Expliquez à voix haute la sélection naturelle avec un exemple de votre choix.
@eval
? Darwin publie en = 1859
? Reste d'un être vivant ancien = fossile
? Sélection naturelle = survie des | mieux adaptés* | plus grands | plus lents
? Homo sapiens apparaît en | Afrique* | Asie | Europe
? Adaptation = ajustement au | milieu* | temps | calendrier
--- La Terre et le climat
## Atmosphère, effet de serre, tectonique
L'**atmosphère** (principalement azote 78 % et oxygène 21 %) protège la Terre. L'**effet de serre** naturel garde la planète habitable ; son **renforcement** par les gaz (CO₂, méthane) réchauffe le climat.
La **tectonique des plaques** explique séismes, volcans et montagnes : la croûte est découpée en plaques mobiles.
! Météo = situation du jour ; climat = moyenne sur trente ans.
@vocab
atmosphère = enveloppe gazeuse de la Terre
effet de serre = piégeage de la chaleur
réchauffement climatique = hausse des températures moyennes
tectonique = mouvement des plaques
séisme = tremblement de terre
@exemples
L'atmosphère contient surtout de l'azote.
Les gaz à effet de serre piègent la chaleur.
La plaque africaine et la plaque eurasienne se rapprochent, ce qui forme les Alpes.
@exercices
? Gaz majoritaire de l'air | azote* | oxygène | CO2
? Plaques mobiles = tectonique
? Météo | situation du jour* | moyenne sur 30 ans | prévision à 1 an
@oral
Expliquez à voix haute la différence entre météo et climat.
@eval
? Part d'azote dans l'air (%) = 78
? Part d'oxygène dans l'air (%) = 21
? Gaz à effet de serre | CO2* | azote | oxygène
? Climat = moyenne sur | 30 ans* | 1 jour | 1 mois
? Séisme = tremblement de ___ = terre
`);

/* ---------- ÉCONOMIE (suite) ---------- */
cours("economie", `
=== Entreprise et emploi
--- Agents économiques et PIB
## Qui fait l'économie ?
Les **ménages** consomment et travaillent, les **entreprises** produisent, l'**État** collecte les impôts et finance les services publics. Le **PIB** (produit intérieur brut) mesure la valeur des richesses produites en un an dans un pays.
Une **croissance** positive signifie que le PIB augmente ; une **récession** est une baisse du PIB pendant deux trimestres consécutifs.
! Le PIB ne mesure pas le bonheur ni l'environnement.
@vocab
ménage = consommateurs d'un foyer
entreprise = unité de production
PIB = richesse produite en un an
croissance = hausse du PIB
récession = baisse du PIB
@exemples
Les ménages achètent du pain.
Les entreprises produisent et vendent.
Quand le PIB baisse deux trimestres de suite, on parle de récession.
@exercices
? Qui produit ? | Les entreprises* | Les ménages | Les électeurs
? PIB = produit intérieur ___ = brut
? Baisse du PIB = récession
@oral
Expliquez à voix haute les trois grands agents économiques.
@eval
? Le PIB mesure | la richesse produite* | le bonheur | la population
? Croissance = ___ du PIB = hausse
? Qui consomme ? | Les ménages* | L'État seulement | La banque
? Récession : baisse du PIB pendant | deux trimestres* | un jour | dix ans
? L'État collecte les = impôts
--- L'entreprise
## Chiffre d'affaires, charges, bénéfice
**Chiffre d'affaires (CA)** = ventes. **Charges** = coûts (salaires, loyers, matières). **Bénéfice** = CA − charges. Si le résultat est négatif : **perte**.
Formes : **entreprise individuelle**, **SARL**, **SAS**, **association** (but non lucratif).
! Une entreprise rentable dégage un bénéfice, pas seulement un gros chiffre d'affaires.
@vocab
chiffre d'affaires = total des ventes
charges = dépenses de l'entreprise
bénéfice = CA − charges
perte = résultat négatif
association = organisation sans but lucratif
@exemples
Une boulangerie vend pour 10 000 € par mois.
Ses charges s'élèvent à 8 000 € : le bénéfice est de 2 000 €.
Une entreprise qui vend 50 000 € avec 55 000 € de charges perd 5 000 €.
@exercices
? CA 10 000, charges 8 000 : bénéfice = 2000
? Bénéfice = CA − = charges
? Résultat négatif = perte
@oral
Calculez à voix haute le bénéfice d'un commerçant fictif et expliquez.
@eval
? CA 20 000, charges 15 000 : bénéfice = 5000
? Les salaires sont des | charges* | ventes | impôts uniquement
? Association : but | non lucratif* | lucratif | militaire
? CA 30 000, charges 33 000 : résultat = -3000
? Le CA correspond aux | ventes* | achats | impôts
--- Le travail et l'emploi
## Contrats et salaires
**CDI** : contrat à durée indéterminée. **CDD** : durée déterminée (18 mois maximum en général). **Intérim**, **apprentissage**. **Salaire brut** = avant cotisations ; **salaire net** = ce qu'on reçoit (brut moins cotisations sociales).
**Taux de chômage** = part des actifs sans emploi qui en cherchent un.
! Le SMIC est le salaire minimum légal, révisé chaque année.
@vocab
CDI = contrat à durée indéterminée
CDD = contrat à durée déterminée
salaire brut = avant cotisations
salaire net = après cotisations
SMIC = salaire minimum légal
@exemples
Un CDI offre plus de sécurité.
Un CDD remplace un salarié absent.
Le salaire net est plus faible que le salaire brut.
@exercices
? CDI signifie contrat à durée = indéterminée
? Salaire après cotisations | net* | brut | minimum
? Salaire minimum légal = SMIC
@oral
Expliquez à voix haute la différence entre CDI et CDD.
@eval
? Le salaire brut est | avant cotisations* | après cotisations | en nature
? CDD : durée = déterminée
? Le chômage mesure la part des actifs sans | emploi* | revenu | diplôme
? Salaire net < salaire = brut
? SMIC : minimum | légal* | souhaité | moyen
=== Monnaie, État et commerce
--- Monnaie et banques
## À quoi sert la monnaie ?
Trois rôles : **intermédiaire des échanges**, **unité de compte**, **réserve de valeur**. La **banque centrale** (en zone euro : **BCE**, Francfort) fixe les taux directeurs et contrôle la quantité de monnaie. Les **banques commerciales** accordent des **crédits** et gardent l'épargne.
Un crédit se rembourse avec des **intérêts**.
! Les cartes et le virement sont de la monnaie scripturale.
@vocab
monnaie = moyen de paiement accepté
banque centrale = contrôle la monnaie
crédit = argent emprunté
taux d'intérêt = coût du crédit
monnaie scripturale = argent inscrit en compte
@exemples
J'emprunte pour acheter une voiture.
La BCE augmente son taux pour freiner l'inflation.
Mon épargne est placée sur un livret rémunéré.
@exercices
? Banque centrale de la zone euro = BCE
? Un crédit se rembourse avec des | intérêts* | dons | taxes
? Rôle de la monnaie | intermédiaire des échanges* | loisir | jeu
@oral
Expliquez à voix haute pourquoi la monnaie a remplacé le troc.
@eval
? BCE siège à = Francfort
? Taux d'intérêt = ___ du crédit = coût
? Monnaie scripturale | argent en compte* | pièces | billets
? Un crédit est | un emprunt* | un don | une taxe
? Rôles de la monnaie : échange, compte, = réserve
--- L'État, les impôts et le budget
## Qui finance quoi ?
**Impôts directs** (impôt sur le revenu) et **indirects** (TVA, taxes sur l'essence). La **TVA** normale est de **20 %** en France. Le **budget de l'État** compare recettes et dépenses ; un **déficit** apparaît quand les dépenses dépassent les recettes. La **dette publique** est l'accumulation des déficits.
Les services publics : éducation, santé, justice, sécurité, transports.
! L'impôt sur le revenu est progressif : plus on gagne, plus le taux est élevé.
@vocab
impôt direct = payé directement sur ses revenus
TVA = taxe sur la valeur ajoutée
déficit = dépenses > recettes
dette publique = accumulation des déficits
service public = activité d'intérêt général
@exemples
La TVA est comprise dans le prix affiché.
Le déficit signifie que l'État dépense plus qu'il ne reçoit.
Les hôpitaux publics sont financés en partie par les cotisations et les impôts.
@exercices
? TVA normale en France (%) = 20
? Dépenses > recettes | déficit* | excédent | croissance
? L'impôt sur le revenu est | progressif* | fixe | supprimé
@oral
Expliquez à voix haute à quoi servent les impôts.
@eval
? TVA signifie taxe sur la valeur = ajoutée
? Accumulation des déficits = dette publique
? Impôt indirect | TVA* | impôt sur le revenu | cotisation
? Un service public | est d'intérêt général* | est toujours payant | est privé
? Impôt progressif : plus on gagne, plus le taux | monte* | baisse | reste égal
--- Commerce international
## Échanger avec le monde
Les **importations** sont les biens achetés à l'étranger ; les **exportations**, ceux vendus à l'étranger. La **balance commerciale** = exportations − importations. La **mondialisation** intensifie les échanges de biens, de capitaux et d'informations.
L'**OMC** régule le commerce mondial. Les **droits de douane** sont des taxes sur les produits importés.
! La France exporte notamment des avions, des vins et du luxe.
@vocab
importation = achat à l'étranger
exportation = vente à l'étranger
balance commerciale = exportations − importations
mondialisation = intensification des échanges mondiaux
droit de douane = taxe à l'importation
@exemples
La France importe du pétrole.
La France exporte des avions et du vin.
Un droit de douane élevé rend un produit importé plus cher.
@exercices
? Biens vendus à l'étranger | exportations* | importations | impôts
? Balance = exportations − = importations
? Taxe sur les produits importés | droit de douane* | TVA | cotisation
@oral
Expliquez à voix haute deux avantages et deux risques de la mondialisation.
@eval
? Importation = achat à l'___ = étranger
? Mondialisation : intensification des | échanges* | guerres | impôts
? Organisation du commerce mondial | OMC* | ONU | OMS
? Exportations 100, importations 80 : balance = 20
? Un droit de douane rend le produit | plus cher* | moins cher | gratuit
`);

/* ---------- PHILOSOPHIE (suite) ---------- */
cours("philosophie", `
=== Grandes questions
--- La liberté
## Suis-je libre ?
Le **déterminisme** affirme que tout événement a des causes ; le **libre arbitre**, que l'on peut choisir. Pour **Sartre**, « l'existence précède l'essence » : l'être humain se définit par ses actes, il est « condamné à être libre ».
La liberté suppose des limites : la **loi** protège la liberté de chacun.
! Être libre n'est pas faire tout ce qu'on veut, mais pouvoir choisir en conscience.
@vocab
déterminisme = tout a une cause
libre arbitre = capacité de choisir
existentialisme = pensée centrée sur l'existence
responsabilité = devoir d'assumer ses actes
autonomie = capacité de se donner ses propres règles
@exemples
Je choisis mon métier.
Mes choix sont influencés par mon éducation.
Pour Sartre, je suis responsable de ce que je fais de ce que l'on a fait de moi.
@exercices
? Idée que tout a une cause | déterminisme* | libre arbitre | scepticisme
? « L'existence précède l'essence » : auteur = Sartre
? Capacité de choisir | libre arbitre* | hasard | destin
@oral
Défendez à voix haute le libre arbitre, puis le déterminisme.
@eval
? Capacité de se donner ses règles = autonomie
? Sartre est | existentialiste* | stoïcien | épicurien
? Déterminisme = tout a une = cause
? Liberté et loi : la loi | protège la liberté de chacun* | supprime la liberté | est inutile
? Responsabilité = assumer ses = actes
--- La morale
## Bien agir
**Kant** (1724-1804) propose l'**impératif catégorique** : agis seulement d'après une règle que tu pourrais vouloir universelle. L'**utilitarisme** (Bentham, Mill) juge une action par ses conséquences : le plus grand bonheur du plus grand nombre.
**Aristote** défend une éthique de la **vertu** : devenir quelqu'un de bien par l'habitude.
! Mentir est condamné par Kant même pour de bonnes raisons.
@vocab
morale = règles du bien et du mal
éthique = réflexion sur l'action juste
impératif catégorique = agir selon une règle universelle
utilitarisme = juger par les conséquences
vertu = disposition à bien agir
@exemples
Je ne ferais pas cela si tout le monde le faisait ; donc je m'abstiens.
Un utilitariste choisit l'action qui rend le plus de gens heureux.
Dire la vérité même quand c'est difficile est une vertu.
@exercices
? Impératif catégorique : auteur = Kant
? Philosophie jugeant par les conséquences | utilitarisme* | stoïcisme | cynisme
? Vertu = disposition à bien = agir
@oral
Argumentez à voix haute pour ou contre le mensonge, en citant Kant ou l'utilitarisme.
@eval
? Utilitarisme : Bentham et = Mill
? Kant est | allemand* | grec | français
? Éthique de la vertu : auteur | Aristote* | Kant | Bentham
? Morale = règles du bien et du = mal
? L'utilitarisme vise | le bonheur du plus grand nombre* | l'obéissance | l'argent
--- La conscience et l'inconscient
## Se connaître soi-même
La **conscience** est la connaissance qu'on a de soi et du monde. **Freud** (1856-1939) découvre l'**inconscient** : une part de notre vie psychique nous échappe (rêves, lapsus, actes manqués). La **psychanalyse** cherche à la faire émerger par la parole.
Freud distingue le **ça** (pulsions), le **moi** (réalité) et le **surmoi** (interdits).
! « Connais-toi toi-même » : inscription du temple de Delphes, reprise par Socrate.
@vocab
conscience = connaissance de soi et du monde
inconscient = part non consciente du psychisme
lapsus = erreur de langage révélatrice
psychanalyse = méthode de Freud
surmoi = instance des interdits
@exemples
Un rêve peut révéler un désir caché.
Un lapsus échappe à notre contrôle.
Pour Freud, le moi doit arbitrer entre le ça et le surmoi.
@exercices
? Père de la psychanalyse | Freud* | Descartes | Platon
? Part non consciente du psychisme = inconscient
? Erreur de langage révélatrice | lapsus* | rêve | souvenir
@oral
Expliquez à voix haute ce qu'est l'inconscient avec un exemple quotidien.
@eval
? Freud est né en | 1856* | 1756 | 1956
? Instance des interdits = surmoi
? Conscience = connaissance de | soi et du monde* | l'avenir | la loi
? « Connais-toi toi-même » : lieu = Delphes
? La psychanalyse s'appuie sur la | parole* | chirurgie | publicité
=== Société, savoir et beauté
--- L'État et le contrat social
## Pourquoi vivre sous des lois ?
**Hobbes** (Léviathan, 1651) pense que sans État, les hommes se feraient la guerre ; ils acceptent donc un pouvoir fort. **Locke** défend les droits naturels. **Rousseau** (Du contrat social, 1762) : la loi exprime la **volonté générale**.
Le **contrat social** est un accord, réel ou imaginaire, par lequel les individus fondent la société.
! L'obéissance à la loi que l'on s'est donnée est liberté, dit Rousseau.
@vocab
contrat social = accord fondateur de la société
état de nature = situation sans État
volonté générale = intérêt commun
souveraineté = pouvoir suprême
Léviathan = livre de Hobbes
@exemples
Hobbes veut éviter la guerre de tous contre tous.
Locke protège la propriété et la liberté.
Pour Rousseau, le peuple est souverain.
@exercices
? Auteur de Du contrat social | Rousseau* | Hobbes | Locke
? Hobbes écrit le = Léviathan
? Volonté générale = intérêt = commun
@oral
Comparez à voix haute Hobbes et Rousseau en trois phrases.
@eval
? Du contrat social publié en | 1762* | 1789 | 1651
? Hobbes pense que sans État, | on se ferait la guerre* | on serait heureux | on serait riche
? État de nature = situation sans = État
? Souveraineté = pouvoir = suprême
? Théoricien des droits naturels | Locke* | Hobbes | Kant
--- La connaissance et la vérité
## Comment savoir ?
**Rationalisme** (Descartes) : la raison est source du savoir. **Empirisme** (Locke, Hume) : tout vient de l'expérience. **Platon** raconte l'**allégorie de la caverne** : des prisonniers prennent des ombres pour la réalité jusqu'à voir la lumière.
Une **hypothèse** doit pouvoir être testée par l'expérience (**Popper** : falsifiabilité).
! Douter n'est pas tout rejeter : c'est examiner.
@vocab
rationalisme = savoir par la raison
empirisme = savoir par l'expérience
allégorie = histoire à sens symbolique
hypothèse = explication à tester
falsifiabilité = possibilité d'être réfuté
@exemples
Je vérifie une information avant de la croire.
Un scientifique teste son hypothèse par une expérience.
Dans la caverne, les ombres sont prises pour la réalité.
@exercices
? Savoir par l'expérience | empirisme* | rationalisme | mysticisme
? Allégorie de la caverne : auteur = Platon
? Une hypothèse doit être | testable* | indiscutable | secrète
@oral
Racontez à voix haute l'allégorie de la caverne avec vos mots.
@eval
? Rationalisme : source du savoir = raison
? Empirisme : source du savoir = expérience
? Allégorie de la caverne = Platon
? Falsifiabilité : concept de | Popper* | Platon | Freud
? Une hypothèse sert à | expliquer et tester* | interdire | dormir
--- L'art et le beau
## Qu'est-ce que le beau ?
Le **beau** est ce qui plaît par sa forme ; pour **Kant**, un jugement de goût réclame l'accord de tous sans passer par un concept. L'**art** est production humaine qui touche et fait penser. **Hegel** voit dans l'art l'expression de l'esprit.
**Duchamp** (Fontaine, 1917) pose la question : qu'est-ce qui fait d'un objet une œuvre ?
! « Des goûts et des couleurs on ne discute pas » : mais peut-on discuter du beau ?
@vocab
esthétique = réflexion sur le beau
œuvre = création artistique
goût = capacité de juger le beau
sublime = beau qui dépasse et impressionne
ready-made = objet banal exposé comme œuvre
@exemples
Un paysage peut paraître beau à tous.
Une œuvre peut choquer et faire réfléchir.
Fontaine de Duchamp est un urinoir présenté comme œuvre, ce qui interroge la définition de l'art.
@exercices
? Réflexion sur le beau | esthétique* | éthique | logique
? Auteur de Fontaine = Duchamp
? Objet banal présenté comme œuvre | ready-made* | portrait | fresque
@oral
Défendez à voix haute ce qui, selon vous, fait une œuvre d'art.
@eval
? Fontaine date de = 1917
? Kant parle du jugement de | goût* | marché | droit
? Esthétique = réflexion sur le = beau
? Une œuvre d'art | touche et fait penser* | est toujours utile | est toujours ancienne
? Hegel voit dans l'art l'expression de l'| esprit* | argent | armée
`);

/* ======== Fin : choix du parcours + diagnostic ======== */
const PARCOURS = (() => {
  const t = new URLSearchParams(location.search).get("t");
  if (!MODS[t] && !MODS.chinois) mod(t || "vide", t || "Module", "fr-FR");
  const P = MODS[t] || MODS.chinois || MODS[t || "vide"];
  const n = Object.keys(P.content || {}).length, errs = window.__errs || [], pb = [];
  if (errs.length) pb.push("Erreur JavaScript : <b>" + errs.join(" · ") + "</b>");
  if (!n) pb.push("Aucun cours chargé pour le thème « " + t + " ».");
  console.log("Cap Savoir · " + n + " cours chargés pour « " + t + " »");
  addEventListener("DOMContentLoaded", () => {
    if (pb.length) document.body.insertAdjacentHTML("afterbegin", '<div style="position:sticky;top:0;z-index:99;background:#b91c1c;color:#fff;padding:10px 16px;font:15px/1.4 system-ui">' + pb.join("<br>") + "</div>");
    document.body.insertAdjacentHTML("beforeend", '<p style="text-align:center;color:#888;font:12px system-ui;margin:0 0 20px">Contenu : ' + n + " cours chargés</p>");
  });
  return P;
})();