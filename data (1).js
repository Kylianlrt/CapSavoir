// ÉDITEZ CE FICHIER : ajoutez vos cours et évaluations.
// Placez les PDF dans le dossier pdfs/<theme>/ et indiquez leur chemin.
// "total" = nombre de points de l'évaluation.
const THEMES = [
  { id: "cybersecurite", nom: "Cybersécurité", desc: "Protéger ses données et ses systèmes",
    lecons: [
      { id: "l1", titre: "Les bases de la sécurité", pdf: "pdfs/cybersecurite/lecon-1.pdf" },
      { id: "l2", titre: "Mots de passe et authentification", pdf: "pdfs/cybersecurite/lecon-2.pdf" }
    ],
    evaluations: [
      { id: "e1", titre: "Évaluation 1", pdf: "pdfs/cybersecurite/eval-1.pdf", total: 20 }
    ] },
  { id: "anglais", nom: "Anglais", desc: "Formation intensive en 30 cours, avec déblocage progressif",
    page: "anglais.html", meta: "6 modules · 30 cours · évaluations",
    lecons: [], evaluations: [] },
  { id: "eloquence", nom: "Éloquence", desc: "Convaincre et captiver à l'oral",
    lecons: [{ id: "l1", titre: "Leçon 1", pdf: "pdfs/eloquence/lecon-1.pdf" }],
    evaluations: [{ id: "e1", titre: "Évaluation 1", pdf: "pdfs/eloquence/eval-1.pdf", total: 20 }] },
  { id: "politique", nom: "Politique", desc: "Institutions, idées et débats",
    lecons: [{ id: "l1", titre: "Leçon 1", pdf: "pdfs/politique/lecon-1.pdf" }],
    evaluations: [{ id: "e1", titre: "Évaluation 1", pdf: "pdfs/politique/eval-1.pdf", total: 20 }] },
  { id: "sciences", nom: "Sciences", desc: "Comprendre le monde",
    lecons: [{ id: "l1", titre: "Leçon 1", pdf: "pdfs/sciences/lecon-1.pdf" }],
    evaluations: [{ id: "e1", titre: "Évaluation 1", pdf: "pdfs/sciences/eval-1.pdf", total: 20 }] }
];
