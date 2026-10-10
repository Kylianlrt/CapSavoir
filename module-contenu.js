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

/* ---- Chargement automatique des fichiers de cours (module.html n'a pas besoin d'être modifié) ---- */
(function () {
  const fichiers = ["contenu-langues.js", "contenu-langues-2.js", "contenu-savoirs.js", "contenu-savoirs-2.js", "contenu-savoirs-3.js", "module-fin.js"];
  fichiers.forEach(f => document.write('<script src="' + f + '" onerror="(window.__miss=window.__miss||[]).push(\'' + f + '\')"><\/script>'));
})();