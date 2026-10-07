(() => {
  const INT = [0, 1, 3, 7, 14, 30]; // boîtes de Leitner : intervalles en jours
  S.vocab = S.vocab || {};
  const root = $("#app");
  const norm = s => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’‘]/g, "'").replace(/[.!?]+$/, "").replace(/^to /, "").replace(/\s+/g, " ").trim();
  const eq = (inp, ans) => !!norm(inp) && ans.split("/").some(a => norm(a) === norm(inp));
  const first = s => s.split("/")[0].trim();
  const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
  const say = t => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = "en-GB"; u.rate = .85; speechSynthesis.speak(u); } catch (e) {} };
  const dueNow = id => { const r = S.vocab[id]; return !!(r && r.n <= Date.now()); };
  const mark = (id, ok) => { const b = ok ? Math.min(((S.vocab[id] || { b: 0 }).b) + 1, INT.length - 1) : 0; S.vocab[id] = { b, n: ok ? Date.now() + INT[b] * DAY : Date.now() }; save(); };

  const V = VERBES.map(s => { const [b, p, pp, fr] = s.split("|"); return { id: "v:" + b, b, p, pp, fr }; });
  const kind = v => v.b === v.p && v.p === v.pp ? "aaa" : v.b === v.pp ? "aba" : v.p === v.pp ? "abb" : "abc";
  const GR = {
    all: ["Tous les verbes", () => true, "Apprenez 5 verbes par jour, pas plus : cartes le matin, test le soir."],
    aaa: ["3 formes identiques (cut – cut – cut)", v => kind(v) === "aaa", "Rien ne change : une seule forme à retenir. C'est le groupe le plus facile."],
    abb: ["Passé = participe (buy – bought – bought)", v => kind(v) === "abb", "Deux formes seulement à retenir : le prétérit et le participe passé sont identiques."],
    aba: ["Participe = infinitif (come – came – come)", v => kind(v) === "aba", "Le participe passé ressemble à l'infinitif : seul le prétérit est à apprendre."],
    abc: ["3 formes différentes (go – went – gone)", v => kind(v) === "abc", "Le groupe le plus difficile : apprenez-le par paquets de 5 et testez-vous souvent."]
  };
  const T = Object.entries(VOCAB).map(([k, t]) => ({ k, nom: t.nom, mots: t.mots.map(s => { const i = s.indexOf("="); return { id: "w:" + s.slice(0, i), en: s.slice(0, i), fr: s.slice(i + 1) }; }) }));
  const st = { tab: "v", g: "all", th: T[0].k, mode: "liste", dir: "ef", n: 10 };
  const items = () => st.tab === "v" ? V.filter(GR[st.g][1]) : T.find(t => t.k === st.th).mots;
  const sel = (id, opts, cur) => `<select id="${id}">${opts.map(([v, l]) => `<option value="${v}"${v == cur ? " selected" : ""}>${l}</option>`).join("")}</select>`;

  function draw() {
    const it = items(), nw = it.filter(x => !S.vocab[x.id]).length, du = it.filter(x => dueNow(x.id)).length, ma = it.filter(x => (S.vocab[x.id] || { b: 0 }).b >= 4).length;
    root.innerHTML = `<a href="anglais.html" class="back">← Parcours d'anglais</a>
    <header class="ch" style="--c:#c2410c"><span class="eyebrow">Anglais</span><h1>Vocabulaire et verbes irréguliers</h1></header>
    <nav class="tabs" aria-label="Contenu">${[["v", "Verbes irréguliers (" + V.length + ")"], ["w", "Vocabulaire"]].map(([k, l]) => `<button data-tab="${k}" class="${st.tab === k ? "on" : ""}">${l}</button>`).join("")}</nav>
    <div class="opts"><label>Série ${st.tab === "v" ? sel("sg", Object.entries(GR).map(([k, g]) => [k, g[0] + " · " + V.filter(g[1]).length]), st.g) : sel("sg", T.map(t => [t.k, t.nom + " · " + t.mots.length]), st.th)}</label>
    ${st.tab === "w" ? `<label>Sens ${sel("sd", [["ef", "Anglais → Français"], ["fe", "Français → Anglais"]], st.dir)}</label>` : ""}
    ${st.mode === "test" ? `<label>Questions ${sel("sn", [[10, "10"], [20, "20"], [30, "30"]], st.n)}</label>` : ""}</div>
    <div class="kpis"><div><b>${nw}</b><span>nouveaux</span></div><div><b>${du}</b><span>à réviser aujourd'hui</span></div><div><b>${ma}/${it.length}</b><span>bien maîtrisés</span></div></div>
    <nav class="tabs" aria-label="Mode">${[["liste", "Liste"], ["cartes", "Cartes"], ["test", "Test"]].map(([k, l]) => `<button data-mode="${k}" class="${st.mode === k ? "on" : ""}">${l}</button>`).join("")}</nav>
    <section class="stage" id="body"></section>`;
    ({ liste, cartes, test })[st.mode](it);
  }

  /* ---------- Liste : apprendre, puis masquer pour se tester ---------- */
  function liste(it) {
    const v = st.tab === "v";
    $("#body").innerHTML = `${v ? `<div class="key">${GR[st.g][2]}</div>` : ""}<p class="mut">Cliquez sur 🔊 pour écouter. <button id="hd">Me tester : masquer les réponses</button></p>
    <div class="scroll"><table class="tbl" id="tb"><thead><tr>${v ? "<th>Infinitif</th><th>Prétérit</th><th>Participe passé</th><th>Français</th>" : "<th>Anglais</th><th>Français</th>"}<th></th></tr></thead><tbody>
    ${it.map(x => v ? `<tr><td><b>${x.b}</b></td><td class="h">${x.p}</td><td class="h">${x.pp}</td><td>${x.fr}</td><td><button class="sp" data-say="${x.b}, ${first(x.p)}, ${first(x.pp)}" aria-label="Écouter">🔊</button></td></tr>`
      : `<tr><td><b>${x.en}</b></td><td class="h">${x.fr}</td><td><button class="sp" data-say="${x.en}" aria-label="Écouter">🔊</button></td></tr>`).join("")}</tbody></table></div>`;
  }

  /* ---------- Cartes : répétition espacée ---------- */
  function cartes(it) {
    const body = $("#body"), q = shuffle([...it.filter(x => dueNow(x.id)), ...it.filter(x => !S.vocab[x.id]).slice(0, 10)]), total = q.length; let done = 0;
    if (!q.length) { body.innerHTML = `<div class="sc"><h2>Rien à réviser pour le moment.</h2><p>Revenez demain pour la prochaine relecture, ou passez un test.</p><button class="p" data-mode="test">Passer un test</button></div>`; return; }
    const face = x => st.tab === "v" ? { f: `<b>${x.b}</b><span>${x.fr}</span>`, b: `<b>${x.p}</b> · <b>${x.pp}</b>`, s: `${x.b}, ${first(x.p)}, ${first(x.pp)}` }
      : st.dir === "ef" ? { f: `<b>${x.en}</b>`, b: `<b>${x.fr}</b>`, s: x.en } : { f: `<b>${x.fr}</b>`, b: `<b>${x.en}</b>`, s: x.en };
    const show = () => {
      if (!q.length) { body.innerHTML = `<div class="sc ok"><h2>Série terminée ✓</h2><p>${total} carte${total > 1 ? "s" : ""} travaillée${total > 1 ? "s" : ""}. Les cartes ratées reviennent plus tôt, les réussies plus tard.</p><button class="p" id="again">Continuer</button></div>`; $("#again").onclick = draw; return; }
      const x = q[0], c = face(x);
      body.innerHTML = `<p class="mut">${done}/${total} · ${st.tab === "v" ? "Retrouvez le prétérit et le participe passé" : "Retrouvez la traduction"}</p><div class="fc"><div class="ff">${c.f}</div><div class="fa" hidden>${c.b} <button class="sp" data-say="${c.s}" aria-label="Écouter">🔊</button></div></div>
      <div class="actions" id="ca"><span></span><button class="p" id="rv">Voir la réponse</button></div>`;
      $("#rv").onclick = () => { $(".fa").hidden = false; say(c.s); $("#ca").innerHTML = `<button id="ko">À revoir</button><button class="p" id="yes">Je savais</button>`;
        $("#ko").onclick = () => { mark(x.id, false); q.push(q.shift()); show(); };
        $("#yes").onclick = () => { mark(x.id, true); q.shift(); done++; show(); }; };
    };
    show();
  }

  /* ---------- Test écrit ---------- */
  function test(it) {
    const body = $("#body"), v = st.tab === "v", qs = shuffle(it).slice(0, st.n), dir = st.dir;
    body.innerHTML = qs.map((x, i) => `<div class="q"><p class="qt"><span class="qn">${i + 1}</span>${v ? `<b>${x.b}</b> <span class="mut">(${x.fr})</span>` : dir === "ef" ? x.en : x.fr}</p>
      ${v ? `<div class="two"><input aria-label="Prétérit" placeholder="Prétérit" autocomplete="off" autocapitalize="off" spellcheck="false"><input aria-label="Participe passé" placeholder="Participe passé" autocomplete="off" autocapitalize="off" spellcheck="false"></div>`
      : `<input aria-label="Réponse" placeholder="${dir === "ef" ? "En français" : "En anglais"}" autocomplete="off" autocapitalize="off" spellcheck="false">`}<div class="res"></div></div>`).join("")
      + `<div class="actions"><button class="p" id="vl">Corriger le test</button></div>`;
    $("#vl").onclick = () => {
      let pts = 0;
      qs.forEach((x, i) => {
        const el = body.querySelectorAll(".q")[i], inp = [...el.querySelectorAll("input")];
        const ok = v ? eq(inp[0].value, x.p) && eq(inp[1].value, x.pp) : eq(inp[0].value, dir === "ef" ? x.fr : x.en);
        if (ok) pts++; mark(x.id, ok); el.classList.add(ok ? "g" : "b"); inp.forEach(n => n.disabled = true);
        el.querySelector(".res").innerHTML = ok ? "✓ Correct" : "✗ Réponse attendue : <b>" + (v ? x.p + " · " + x.pp : dir === "ef" ? x.fr : x.en) + "</b>";
      });
      const r = pts / qs.length, m = r >= .9 ? ["ok", "Excellent, c'est bien en mémoire."] : r >= .7 ? ["mid", "Bien. Les erreurs reviendront dans vos cartes."] : ["ko", "Pas encore acquis : refaites les cartes avant de retenter."];
      $("#vl").parentElement.outerHTML = `<div class="sc ${m[0]}"><div class="n">${pts}<small>/${qs.length}</small></div><h2>${m[1]}</h2></div><div class="actions"><button data-mode="cartes">Revoir en cartes</button><button class="p" id="rt">Nouveau test</button></div>`;
      $("#rt").onclick = draw; window.scrollTo({ top: 0 });
    };
  }

  root.addEventListener("click", e => {
    const t = e.target.closest("[data-tab]"), m = e.target.closest("[data-mode]"), s = e.target.closest("[data-say]"), h = e.target.closest(".tbl.hide .h");
    if (t) { st.tab = t.dataset.tab; draw(); } else if (m) { st.mode = m.dataset.mode; draw(); }
    if (s) say(s.dataset.say);
    if (h) h.classList.toggle("show");
    if (e.target.id === "hd") { const tb = $("#tb"); tb.classList.toggle("hide"); e.target.textContent = tb.classList.contains("hide") ? "Afficher les réponses" : "Me tester : masquer les réponses"; }
  });
  root.addEventListener("change", e => {
    const id = e.target.id, val = e.target.value;
    if (id === "sg") { if (st.tab === "v") st.g = val; else st.th = val; } else if (id === "sd") st.dir = val; else if (id === "sn") st.n = +val; else return;
    draw();
  });
  draw();
})();
