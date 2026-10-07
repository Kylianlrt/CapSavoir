/* =====================================================================
   AJOUTER UN COURS EN 30 SECONDES : copiez un bloc ci-dessous, changez le texte. Rien d'autre.

   cours("espagnol", `
   === Module 2 — Le quotidien        (facultatif : nom du module, sinon dernier module)
   --- Titre du cours                 (si ce titre existe déjà dans le plan, il est rempli)
   ## Titre de la leçon               (une ligne = un paragraphe ; **gras** ; "! " = encadré À retenir)
   Texte de la leçon.
   ! À retenir.
   @vocab
   mot = traduction                   (5 lignes conseillées)
   @exemples
   Phrase simple.                     (3 lignes : simple, moyenne, avancée)
   @exercices
   ? Question QCM | Bonne réponse* | Mauvaise | Mauvaise     (* = la bonne)
   ? Question libre = réponse / variante acceptée
   @oral
   Consigne orale.
   @eval                              (facultatif : sans ça, l'évaluation reprend les exercices)
   ? ...
   `);
   ===================================================================== */

function cours(id, txt) {
  let m = MODS[id];
  if (!m) { // thème créé avec nouveau(...) dans data.js : on prépare son module vide
    const t = THEMES.find(x => x.id === id);
    if (!t) return console.error("Thème inconnu : " + id + " (ajoutez-le avec nouveau(...) dans data.js)");
    mod(id, t.nom, t.lang || "fr-FR", ["", ""], null); m = MODS[id]; m.plan = []; m.content = {};
  }
  const B = s => s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  const lecon = L => L.map(s => s.startsWith("## ") ? `<h2>${B(s.slice(3))}</h2>` : s.startsWith("! ") ? `<div class='key'>${B(s.slice(2))}</div>` : `<p>${B(s)}</p>`).join("");
  const quest = s => {
    s = s.replace(/^\?\s*/, "");
    if (s.includes(" | ")) { const p = s.split(" | ").map(x => x.trim()), o = p.slice(1); return Q(p[0], o.map(x => x.replace(/\*$/, "")), Math.max(0, o.findIndex(x => x.endsWith("*")))); }
    const i = s.lastIndexOf(" = "); if (i < 0) { console.warn("Question ignorée (il faut ' | ' ou ' = ') : " + s); return null; }
    return T(s.slice(0, i).trim(), s.slice(i + 3).split(" / ").map(x => x.trim()));
  };
  const qs = L => L.map(quest).filter(Boolean);
  const paires = L => L.map(s => { const i = s.indexOf(" = "); return i < 0 ? [s, ""] : [s.slice(0, i), s.slice(i + 3)]; });

  function placer(c, modTitre) {
    if (modTitre && !m.plan.some(p => p[0] === modTitre)) m.plan.push([modTitre, ""]);
    if (!m.plan.length) m.plan.push(["Module 1", ""]);
    const mi = modTitre ? m.plan.findIndex(p => p[0] === modTitre) : m.plan.length - 1, mp = m.plan[mi];
    let titres = mp[1] ? mp[1].split("|") : [], j = titres.indexOf(c.t);
    if (j < 0) { if (mi !== m.plan.length - 1) return console.warn("Cours « " + c.t + " » ignoré : ajoutez-le d'abord au plan de ce module."); titres.push(c.t); mp[1] = titres.join("|"); j = titres.length - 1; }
    const n = m.plan.slice(0, mi).reduce((s, p) => s + (p[1] ? p[1].split("|").length : 0), 0) + j + 1;
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
`);

/* ---------- AJOUTEZ VOS COURS ICI ---------- */


const PARCOURS = MODS[new URLSearchParams(location.search).get("t")] || MODS.chinois;
