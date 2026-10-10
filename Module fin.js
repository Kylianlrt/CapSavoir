// À charger APRÈS tous les fichiers de contenu et AVANT parcours.js
const PARCOURS = MODS[new URLSearchParams(location.search).get("t")] || MODS.chinois;