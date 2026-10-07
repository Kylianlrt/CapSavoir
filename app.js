// ====== CONFIGURATION GOOGLE : collez ici votre ID client OAuth ======
const CLIENT_ID = "9725882238-97bupsrp5ok24k93u11n36nd5588eauc.apps.googleusercontent.com";
const SESSION_JOURS = 7;
let USER = null;
try { USER = JSON.parse(localStorage.getItem("cs-user") || "null"); if (USER && USER.exp * 1000 < Date.now()) USER = null; } catch (e) {}
const KEY = "apprentissage-v1" + (USER ? ":" + USER.sub : ""), DAY = 864e5, STEPS = [1, 3, 7, 14]; // relectures à J+1, J+3, J+7, J+14
let S = { done: {}, notes: {}, scores: {} };
try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const $ = s => document.querySelector(s);
const param = n => new URLSearchParams(location.search).get(n);
const theme = id => THEMES.find(t => t.id === id);
const key = (t, l) => t + ":" + l;
const pct = t => t.page ? Math.round(100 * (S[t.pct] || 0)) : Math.round(100 * t.lecons.filter(l => S.done[key(t.id, l.id)]).length / (t.lecons.length || 1));
const isDue = k => { const d = S.done[k]; return !!(d && d.next && d.next <= Date.now()); };
const best = k => (S.scores[k] || []).reduce((m, s) => Math.max(m, Math.round(100 * s.score / s.total)), null);
const pdfView = p => `<iframe src="${p}" title="Document PDF"></iframe><p class="mut"><a href="${p}" target="_blank" rel="noopener">Ouvrir le PDF dans un nouvel onglet</a></p>`;

const SITE = "Cap Savoir"; // nom du site : modifiez-le ici
const ICON = {
  chinois: ["#dc2626", '<path d="M12 3v18M5 8h14M7 13h10M9 18h6"/>'],
  espagnol: ["#ea580c", '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'],
  francais: ["#2563eb", '<path d="M5 4h14v16H5z"/><path d="M8 9h8M8 13h8M8 17h4"/>'],
  orthographe: ["#db2777", '<path d="M4 19l5-14 5 14M6 14h6"/><path d="M16 14l3 3 3-5"/>'],
  coderoute: ["#ca8a04", '<path d="M8 3h8l5 5v8l-5 5H8l-5-5V8z"/><path d="M8 12h8"/>'],
  culture: ["#0891b2", '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'],
  histoire: ["#92400e", '<path d="M5 21h14M7 21V8l5-5 5 5v13M10 21v-6h4v6"/>'],
  maths: ["#4f46e5", '<path d="M6 6h12M6 18h12M8 10l8 4M16 10l-8 4"/>'],
  cybersecurite: ["#1d4ed8", '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'],
  anglais: ["#c2410c", '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>'],
  eloquence: ["#7c3aed", '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>'],
  politique: ["#0f766e", '<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>'],
  sciences: ["#15803d", '<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/><path d="M7.5 15h9"/>']
};
const iconOf = id => { const [c, p] = ICON[id] || ["#1d4e89", '<path d="M4 5h16v14H4z"/>'];
  return { c, svg: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>` }; };

function parseJwt(t) {
  const b = t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(b), c => c.charCodeAt(0))));
}
function onCredential(r) {
  const p = parseJwt(r.credential);
  try { localStorage.setItem("cs-user", JSON.stringify({ sub: p.sub, name: p.name, email: p.email, picture: p.picture, exp: Date.now() / 1000 + SESSION_JOURS * 86400 })); } catch (e) {}
  location.reload();
}
function logout() {
  try { localStorage.removeItem("cs-user"); } catch (e) {}
  if (window.google && google.accounts) google.accounts.id.disableAutoSelect();
  location.href = "index.html";
}
function loginView() {
  const demo = CLIENT_ID.startsWith("VOTRE");
  $("#panel").innerHTML = `<h2>Accès à vos cours</h2><p style="margin:6px 0 18px;color:#fff">Connectez-vous avec votre compte Google pour accéder aux cours et retrouver votre progression sur cet appareil.</p>
  <div id="gbtn" style="min-height:44px"></div>
  ${demo ? '<p class="note">Configuration requise : renseignez votre ID client Google dans <code>CLIENT_ID</code> (app.js).</p>' : ""}
  <p class="mut" style="color:#c9d3e6;margin:14px 0 0">Nous utilisons uniquement votre nom, votre e-mail et votre photo.</p>`;
  $("#app").hidden = true;
  const a = document.querySelector(".cta .acc"); if (a) { a.textContent = "Se connecter"; a.href = "#panel"; }
  if (demo) return;
  const g = document.createElement("script");
  g.src = "https://accounts.google.com/gsi/client"; g.async = true;
  g.onload = () => {
    google.accounts.id.initialize({ client_id: CLIENT_ID, callback: onCredential });
    google.accounts.id.renderButton($("#gbtn"), { theme: "filled_blue", size: "large", shape: "pill", text: "continue_with", locale: "fr", width: 280 });
  };
  document.head.appendChild(g);
}

function chrome() {
  $("header").innerHTML = `<div class="hd"><a href="index.html" class="logo"><span class="mark"></span>${SITE}</a>
  <nav aria-label="Navigation principale"><a href="index.html#themes">Thèmes</a><a href="index.html#methode">Méthode</a>${USER ? `<span class="user"><img src="${USER.picture || ""}" alt="" referrerpolicy="no-referrer" width="28" height="28"><span class="uname">${(USER.name || USER.email).split(" ")[0]}</span><button id="lo">Déconnexion</button></span>` : ""}</nav></div>`;
  if ($("#lo")) $("#lo").onclick = logout;
  document.body.insertAdjacentHTML("beforeend", `<footer><div>© ${new Date().getFullYear()} ${SITE} · Votre progression est enregistrée sur cet appareil.</div>
  <div style="margin-top:6px"><a href="index.html#themes">Thèmes</a><a href="index.html#methode">Méthode</a></div></footer>`);
}

/* Secours : si data.js ne définit pas catsAll(), on regroupe les thèmes par catégorie */
if (typeof catsAll === "undefined") {
  window.catsAll = () => {
    const G = [["Langues", ["anglais", "chinois", "espagnol", "francais", "orthographe"]], ["Informatique", ["cybersecurite"]],
      ["Culture et société", ["culture", "histoire", "politique", "eloquence"]], ["Sciences et mathématiques", ["maths", "sciences"]], ["Permis", ["coderoute"]]];
    const used = new Set(G.flatMap(g => g[1])), rest = THEMES.map(t => t.id).filter(i => !used.has(i));
    if (rest.length) G.push(["Autres", rest]);
    return G.map(([nom, themes]) => ({ nom, themes: themes.filter(i => THEMES.some(t => t.id === i)) })).filter(c => c.themes.length);
  };
}

function home() {
  if (!USER) return loginView();
  const L = THEMES.flatMap(t => t.lecons.map(l => ({ t, l, k: key(t.id, l.id) })));
  const done = L.filter(x => S.done[x.k]).length, dueL = L.filter(x => isDue(x.k)), nextL = L.find(x => !S.done[x.k]);
  const evals = THEMES.reduce((n, t) => n + t.evaluations.filter(e => (S.scores[key(t.id, e.id)] || []).length).length, 0);
  const p = L.length ? Math.round(100 * done / L.length) : 0;
  $("#panel").innerHTML = `<h2>Votre progression</h2><div class="pct">${p} %</div><div class="bar"><i style="width:${p}%;background:var(--acc)"></i></div>
  <div class="stats"><div><b>${done}/${L.length}</b><span>leçons terminées</span></div><div><b>${evals}</b><span>évaluations passées</span></div><div><b>${dueL.length}</b><span>à relire</span></div></div>`;
  const link = x => `<a class="lk" href="cours.html?t=${x.t.id}&l=${x.l.id}">${x.l.titre} <span class="mut">(${x.t.nom})</span></a>`;
  const resume = dueL.length ? `<div><strong>À relire aujourd'hui</strong>${dueL.slice(0, 3).map(link).join("")}</div>`
    : nextL ? `<div><strong>${done ? "Reprenez où vous en étiez" : "Commencez votre parcours"}</strong>${link(nextL)}</div>`
    : `<div><strong>Bravo, toutes les leçons sont terminées.</strong><span class="mut">Passez les évaluations pour consolider.</span></div>`;
  $("#app").innerHTML = `<div class="resume">${resume}</div>
  <div class="sec-h" id="themes"><h2>Choisissez un thème</h2><span class="mut">${THEMES.length} thèmes · ${L.length} leçons</span></div>
  ${catsAll().map(cat => `<h3 class="cat">${cat.nom}</h3><div class="tgrid">${cat.themes.map(theme).filter(Boolean).map((t, ti) => { const m = iconOf(t.id), q = pct(t);
    return `<a class="tcard" style="--c:${m.c};--i:${ti}" href="${t.page || "theme.html?t=" + t.id}"><span class="ico">${m.svg}</span><h3>${t.nom}</h3><p>${t.desc}</p>
    <span class="mut">${t.meta || t.lecons.length + " leçon" + (t.lecons.length > 1 ? "s" : "") + " · " + t.evaluations.length + " évaluation" + (t.evaluations.length > 1 ? "s" : "")}</span>
    <div class="bar"><i style="width:${q}%"></i></div><div class="row"><span class="mut">${q} % terminé</span><span class="go">${q ? "Continuer" : "Commencer"} →</span></div></a>`; }).join("")}</div>`).join("")}`;
}

function themePage() {
  const t = theme(param("t")); if (!t) return location.replace("index.html");
  $("#app").innerHTML = `<a href="index.html">← Tous les thèmes</a><h1>${t.nom}</h1><p class="mut">${t.desc}</p>
  <h2>Leçons</h2>${t.lecons.map(l => { const k = key(t.id, l.id);
    return `<a class="card row" href="cours.html?t=${t.id}&l=${l.id}" style="margin-bottom:10px"><span>${l.titre}</span>
    <span>${isDue(k) ? '<span class="tag due">À relire</span>' : S.done[k] ? '<span class="tag">Terminée</span>' : ""}</span></a>`; }).join("")}
  <h2>Évaluations</h2>${t.evaluations.map(e => { const b = best(key(t.id, e.id));
    return `<a class="card row" href="evaluation.html?t=${t.id}&e=${e.id}" style="margin-bottom:10px"><span>${e.titre}</span>
    <span class="mut">${b === null ? "Pas encore passée" : "Meilleur score : " + b + " %"}</span></a>`; }).join("")}`;
}

function coursPage() {
  const t = theme(param("t")), i = t ? t.lecons.findIndex(l => l.id === param("l")) : -1;
  if (!t || i < 0) return location.replace("index.html");
  const l = t.lecons[i], k = key(t.id, l.id), prev = t.lecons[i - 1], next = t.lecons[i + 1];
  const draw = () => {
    const d = S.done[k];
    $("#app").innerHTML = `<a href="theme.html?t=${t.id}">← ${t.nom}</a><h1>${l.titre}</h1>${pdfView(l.pdf)}
    <h2>Mes notes</h2><textarea id="n" rows="4" placeholder="Résumez la leçon avec vos mots : c'est ce qui aide le plus à retenir.">${S.notes[k] || ""}</textarea>
    <div class="row" style="margin-top:14px">
      ${!d ? '<button class="p" id="ok">J\'ai terminé cette leçon</button>'
        : isDue(k) ? '<button class="p" id="rev">J\'ai relu cette leçon</button>'
        : d.next ? `<span class="mut">Prochaine relecture : ${new Date(d.next).toLocaleDateString("fr-FR")}</span>` : '<span class="mut">Leçon bien ancrée ✓</span>'}
      <span>${prev ? `<a class="btn" href="cours.html?t=${t.id}&l=${prev.id}">← Précédente</a>` : ""}
      ${next ? `<a class="btn" href="cours.html?t=${t.id}&l=${next.id}">Suivante →</a>` : `<a class="btn p" href="theme.html?t=${t.id}">Voir les évaluations</a>`}</span></div>`;
    $("#n").oninput = e => { S.notes[k] = e.target.value; save(); };
    if ($("#ok")) $("#ok").onclick = () => { S.done[k] = { step: 0, next: Date.now() + STEPS[0] * DAY }; save(); draw(); };
    if ($("#rev")) $("#rev").onclick = () => { const s = d.step + 1; S.done[k] = { step: s, next: s < STEPS.length ? Date.now() + STEPS[s] * DAY : null }; save(); draw(); };
  };
  draw();
}

function evalPage() {
  const t = theme(param("t")), e = t && t.evaluations.find(x => x.id === param("e"));
  if (!e) return location.replace("index.html");
  const k = key(t.id, e.id);
  const draw = msg => {
    const h = S.scores[k] || [];
    $("#app").innerHTML = `<a href="theme.html?t=${t.id}">← ${t.nom}</a><h1>${e.titre}</h1>${pdfView(e.pdf)}
    <h2>Mon résultat</h2><p class="mut">Après avoir répondu sur papier, corrigez-vous puis saisissez votre note.</p>
    <div class="row" style="justify-content:flex-start"><input id="s" type="number" min="0" step="0.5" aria-label="Note obtenue"> <span>/ ${e.total}</span>
    <button class="p" id="sv">Enregistrer</button></div>${msg || ""}
    ${h.length ? `<h2>Historique</h2>${h.map(x => `<div class="card row" style="margin-bottom:8px"><span>${new Date(x.date).toLocaleDateString("fr-FR")}</span><b>${x.score} / ${x.total}</b></div>`).join("")}` : ""}`;
    $("#sv").onclick = () => {
      const v = parseFloat($("#s").value);
      if (isNaN(v) || v < 0 || v > e.total) return draw('<div class="fb">Saisissez une note entre 0 et ' + e.total + ".</div>");
      (S.scores[k] = S.scores[k] || []).push({ score: v, total: e.total, date: Date.now() }); save();
      const r = v / e.total;
      draw(`<div class="fb">${r >= .8 ? "Très bien, ce thème est solide." : r >= .6 ? "Bien. Relisez les points ratés pour consolider." : "Pas encore acquis : relisez les leçons du thème, puis repassez l'évaluation."}
      <br><a href="theme.html?t=${t.id}">Retourner aux leçons</a></div>`);
    };
  };
  draw();
}

chrome();
if (!USER && document.body.dataset.page !== "home") location.replace("index.html");
else ({ home, theme: themePage, cours: coursPage, eval: evalPage })[document.body.dataset.page]?.();

/* Effets : apparition au scroll + halo qui suit la souris */
if (!matchMedia("(prefers-reduced-motion:reduce)").matches) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll(".tcard,.steps li,.sec-h,.resume,.big,.intro").forEach((el, i) => { el.classList.add("rv"); if (!el.style.getPropertyValue("--i")) el.style.setProperty("--i", i % 4); io.observe(el); });
  document.addEventListener("pointermove", e => { const c = e.target.closest && e.target.closest(".tcard"); if (c) { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px"); } });
}