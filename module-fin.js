// Chargé automatiquement par module-contenu.js, APRÈS tous les fichiers de cours
(function () {
  const t = new URLSearchParams(location.search).get("t");
  if (!MODS[t] && !MODS.chinois) mod(t || "vide", t || "Module", "fr-FR");
  window.PARCOURS = MODS[t] || MODS.chinois || MODS[t || "vide"];
  const n = Object.keys(window.PARCOURS.content || {}).length, miss = window.__miss || [], errs = window.__errs || [];
  const pb = [];
  if (miss.length) pb.push("Fichiers introuvables sur le site : <b>" + miss.join(", ") + "</b> (mettez-les en ligne dans le même dossier que module.html).");
  if (errs.length) pb.push("Erreur JavaScript : <b>" + errs.join(" · ") + "</b>");
  if (!n) pb.push("Aucun cours chargé pour le thème « " + t + " ».");
  if (pb.length) addEventListener("DOMContentLoaded", () => document.body.insertAdjacentHTML("afterbegin",
    '<div style="position:sticky;top:0;z-index:99;background:#b91c1c;color:#fff;padding:10px 16px;font:15px/1.4 system-ui">' + pb.join("<br>") + "</div>"));
})();