(() => {
  // Configuration : un parcours définit PARCOURS (voir cyber-data.js). Sans PARCOURS, on utilise l'anglais.
  const CFG = typeof PARCOURS !== "undefined" ? PARCOURS : { id: "anglais", store: "parcours", pct: "pAng", tech: false, unite: "Cours",
    eyebrow: "Parcours · 30 jours", titre: "Formation intensive d'anglais",
    lead: "6 modules, 30 cours. Validez chaque évaluation avec <b>15/20</b> pour débloquer la suite.",
    steps: ["Leçon", "Vocabulaire", "Exemples", "Exercices", "Oral", "Évaluation"], plan: PLAN, content: CONTENT };
  const MODC = ["#1d4ed8", "#0f766e", "#b45309", "#7c3aed", "#be123c", "#15803d"], SEUIL = 15;
  const STEPS = CFG.steps;
  const P = (S[CFG.store] = S[CFG.store] || {}), root = $("#app");
  const flat = []; let n = 0;
  CFG.plan.forEach(([mt, list], mi) => list.split("|").forEach(t => {
    const ex = /^Examen du/.test(t), id = ex ? "e" + (mi + 1) : String(++n);
    flat.push({ id, t, mi, mt, ex, num: ex ? null : n, c: CFG.content[id] });
  }));
  const unlocked = i => i === 0 || !!(P[flat[i - 1].id] || {}).passed;
  const commit = () => { S[CFG.pct] = flat.filter(c => (P[c.id] || {}).passed).length / flat.length; save(); };
  const norm = s => (s || "").toLowerCase().replace(/[’‘]/g, "'").replace(/[.!?]+$/, "").replace(/\s+/g, " ").trim();
  const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
  const speak = t => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = CFG.lang || "en-GB"; u.rate = .9; speechSynthesis.speak(u); } catch (e) {} };
  root.addEventListener("click", e => { const b = e.target.closest("[data-say]"); if (b) speak(b.dataset.say); });

  /* ---------- Carte du parcours ---------- */
  function node(c, i) {
    const p = P[c.id] || {}, lk = !unlocked(i), soon = !c.c;
    const st = p.passed ? "ok" : soon ? "soon" : lk ? "lock" : "open";
    const sub = p.passed ? `Réussi · meilleur score ${p.best}/20` : soon ? "Bientôt disponible" : lk ? "Réussissez l'étape précédente pour débloquer" : p.tries ? `Meilleur score ${p.best}/20 · à repasser` : "Prêt à commencer";
    const dot = p.passed ? "✓" : soon ? "…" : lk ? "🔒" : c.ex ? "★" : c.num;
    const body = `<span class="dot">${dot}</span><span class="nt"><b>${c.ex ? "" : CFG.unite + " " + c.num + " — "}${c.t}</b><small>${sub}</small></span>`;
    return `<li class="${st}">${st === "open" || st === "ok" ? `<a href="#c${c.id}">${body}<i>→</i></a>` : `<div>${body}</div>`}</li>`;
  }
  function map() {
    const done = flat.filter(c => (P[c.id] || {}).passed), frac = done.length / flat.length, R = 52, C = 2 * Math.PI * R;
    const avg = done.length ? (done.reduce((s, c) => s + P[c.id].best, 0) / done.length).toFixed(1) : "—";
    root.innerHTML = `<section class="ph"><div><span class="eyebrow">${CFG.eyebrow}</span><h1>${CFG.titre}</h1>
    <p class="lead">${CFG.lead}</p></div>
    <div class="ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="${R}" class="rb"/><circle cx="60" cy="60" r="${R}" class="rf" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - frac)}" transform="rotate(-90 60 60)"/></svg><b>${Math.round(frac * 100)} %</b></div></section>
    <div class="kpis"><div><b>${done.length}/${flat.length}</b><span>étapes réussies</span></div><div><b>${avg}</b><span>moyenne /20</span></div><div><b>${SEUIL}/20</b><span>pour avancer</span></div></div>`
    + CFG.plan.map((m, mi) => `<section class="mod" style="--c:${MODC[mi % MODC.length]}"><h2>${m[0]}</h2><ol class="path">${flat.map((c, i) => c.mi === mi ? node(c, i) : "").join("")}</ol></section>`).join("");
  }

  /* ---------- Questions ---------- */
  const qHTML = (q, i, p) => `<div class="q"><p class="qt"><span class="qn">${i + 1}</span>${q.say ? `<button class="spk" data-say="${q.say}">🔊 Écouter</button> ` : ""}${q.q}</p>${q.o
    ? q.o.map((o, j) => `<label class="opt"><input type="radio" name="${p}${i}" value="${j}"> ${o}</label>`).join("")
    : `<input class="ans" name="${p}${i}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Votre réponse">`}<div class="res"></div></div>`;
  function grade(qs, p, box, d = 1) {
    let r = 0;
    qs.forEach((q, i) => {
      const el = box.querySelectorAll(".q")[i], inp = q.o ? el.querySelector("input:checked") : el.querySelector("input"), v = inp ? inp.value : "";
      const g = q.o ? v !== "" && +v === q.c : q.a.some(a => norm(a) === norm(v));
      if (g) r += q.p ?? d;
      el.classList.add(g ? "g" : "b");
      el.querySelector(".res").innerHTML = (g ? "✓ Correct" : "✗ Réponse attendue : <b>" + (q.o ? q.o[q.c] : q.a[0]) + "</b>") + (q.e ? ` <em>${q.e}</em>` : "");
      el.querySelectorAll("input").forEach(x => x.disabled = true);
    });
    return r;
  }

  /* ---------- Page d'un cours ---------- */
  function course(i) {
    const c = flat[i], k = c.c; let step = 0;
    root.innerHTML = `<a href="#" class="back">← Retour au parcours</a><header class="ch" style="--c:${MODC[c.mi % MODC.length]}"><span class="eyebrow">${c.mt}</span><h1>${c.ex ? "" : CFG.unite + " " + c.num + " — "}${c.t}</h1></header>
    <nav class="tabs" aria-label="Étapes du cours"${c.ex ? ' style="display:none"' : ""}>${STEPS.map((t, j) => `<button data-s="${j}">${j + 1}. ${t}</button>`).join("")}</nav><section id="st" class="stage"></section>`;
    const st = $("#st"), tabs = [...document.querySelectorAll(".tabs button")];
    const nav = () => `<div class="actions">${step > 0 ? '<button data-go="-1">← Précédent</button>' : "<span></span>"}${step < 5 ? '<button class="p" data-go="1">Suivant →</button>' : ""}</div>`;
    function show(s) {
      step = s; tabs.forEach((b, j) => b.classList.toggle("on", j === s)); window.scrollTo({ top: 0 });
      if (s === 0) st.innerHTML = `<div class="prose">${k.l}</div>`;
      if (s === 1 && !CFG.tech) st.innerHTML = `<p class="mut">Cliquez sur un mot pour l'écouter.</p><div class="vg">${k.v.map(([e, f]) => `<button class="vc" data-say="${e}"><b>${e}</b><span>${f}</span><i>🔊</i></button>`).join("")}</div>`;
      if (s === 2 && !CFG.tech) st.innerHTML = ["Simple", "Intermédiaire", "Avancé"].map((l, j) => `<div class="exm"><span class="tag">${l}</span><p>${k.x[j]}</p><button data-say="${k.x[j]}">🔊 Écouter</button></div>`).join("");
      if (s === 3) { st.innerHTML = `<p class="mut">Entraînement libre : corrigé immédiat, sans note.</p>${k.ex.map((q, j) => qHTML(q, j, "x")).join("")}<div class="actions"><button class="p" id="vf">Vérifier mes réponses</button></div>`;
        $("#vf").onclick = () => { const r = grade(k.ex, "x", st); $("#vf").outerHTML = `<b>${r}/${k.ex.length} bonnes réponses</b>`; }; }
      if (s === 4 && !CFG.tech) st.innerHTML = `<div class="oral"><span class="tag">Exercice oral</span><p>${k.oral}</p><div class="key">Astuce : enregistrez-vous avec votre téléphone, réécoutez-vous, puis refaites l'exercice en corrigeant vos erreurs.</div></div>`;
      if (CFG.tech) {
        if (s === 1) st.innerHTML = `<div class="vg">${k.v.map(([t, d]) => `<div class="vc card"><b>${t}</b><span>${d}</span></div>`).join("")}</div>`;
        if (s === 2) st.innerHTML = `<div class="lab prose"><span class="tag">Lab</span>${k.lab}</div>`;
        if (s === 4) st.innerHTML = `<div class="lab prose"><span class="tag">Analyse</span>${k.an}</div>`;
      }
      if (s === 5) return intro();
      if (s !== 3) st.insertAdjacentHTML("beforeend", nav());
    }
    function intro() {
      const p = P[c.id] || {};
      st.innerHTML = `<div class="sc"><span class="tag">Évaluation</span><h2>${k.ev.length} questions · 20 points</h2><p>Réussite à partir de <b>${SEUIL}/20</b>.${p.tries ? ` Meilleur score : <b>${p.best}/20</b>.` : ""}</p><button class="p" id="go">Commencer l'évaluation</button></div>${c.ex ? "" : nav()}`;
      $("#go").onclick = start;
    }
    function start() {
      const qs = shuffle(k.ev);
      st.innerHTML = qs.map((q, j) => qHTML(q, j, "e")).join("") + `<div class="actions"><button class="p" id="vl">Valider l'évaluation</button></div>`;
      window.scrollTo({ top: 0 });
      $("#vl").onclick = () => {
        const pts = grade(qs, "e", st, 2), p = (P[c.id] = P[c.id] || { best: 0, tries: 0 });
        p.tries++; p.best = Math.max(p.best, pts); if (pts >= SEUIL) p.passed = true; commit();
        const v = pts >= SEUIL ? ["ok", "Bravo, étape validée.", "Vous pouvez passer à la suite."] : pts >= 12 ? ["mid", "Presque !", "Révisez rapidement la leçon, puis repassez l'évaluation."] : ["ko", "Pas encore acquis.", c.ex ? "Révisez les cours du module avant de repasser l'examen." : "Refaites les exercices du cours avant de réessayer."];
        const nx = flat[i + 1], nxOk = pts >= SEUIL && nx && nx.c;
        $("#vl").parentElement.outerHTML = `<div class="sc ${v[0]}"><div class="n">${pts}<small>/20</small></div><h2>${v[1]}</h2><p>${v[2]}</p></div>
        <div class="actions">${c.ex ? "" : '<button data-s="0">Revoir la leçon</button>'}<button id="rt">Repasser l'évaluation</button>${nxOk ? `<a class="btn p" href="#c${nx.id}">Cours suivant →</a>` : `<a class="btn p" href="#">Retour au parcours</a>`}</div>`;
        $("#rt").onclick = start; window.scrollTo({ top: 0 });
      };
    }
    root.querySelector(".ch").parentElement.onclick = e => {
      const b = e.target.closest("[data-s]"), g = e.target.closest("[data-go]");
      if (b) show(+b.dataset.s); else if (g) show(step + +g.dataset.go);
    };
    show(c.ex ? 5 : 0);
  }

  /* ---------- Routage ---------- */
  function route() {
    const id = location.hash.slice(2), i = flat.findIndex(c => c.id === id);
    if (i < 0 || !flat[i].c || !unlocked(i)) { if (location.hash) history.replaceState(null, "", location.pathname); return map(); }
    course(i);
  }
  addEventListener("hashchange", () => { route(); window.scrollTo({ top: 0 }); });
  route();
})();
