# Ajouter ou modifier un cours — mode d'emploi

## Thèmes « module » (espagnol, français, orthographe, maths, code de la route, culture, histoire)
Tout se passe dans **module-data.js**, à la fin du fichier, avant `const PARCOURS`.

**Ajouter le contenu d'un cours** (les cours sont numérotés dans l'ordre, tous modules confondus) :
```js
add("espagnol", 6, C(
  "<h2>Titre</h2><p>Leçon en HTML…</p><div class='key'>À retenir</div>",   // leçon
  [["mot","traduction"], …5 paires],                                       // vocabulaire
  ["Exemple simple.","Exemple intermédiaire.","Exemple avancé."],          // 3 exemples
  [Q("Question ?",["A","B","C"],1), T("Question libre ?","réponse")],       // exercices
  "Consigne orale.",                                                        // oral
  [ …5 questions… ]                                                         // évaluation (5 × 4 pts = 20)
));
```
- `Q(question, [choix], indexBonneRéponse)` = QCM · `T(question, "réponse" ou ["variante1","variante2"])` = réponse libre.
- Un cours sans `add(...)` s'affiche « Bientôt disponible ».

**Ajouter un module** : `addModule("espagnol", "Module 3 — Titre", "Cours A|Cours B|Cours C");`
**Nouveau thème** : `mod("id", "Nom", "langue-voix", ["Module 1 — Titre", "Cours 1|Cours 2"], C(...))`, puis une entrée dans **data.js** avec `page: "module.html?t=id"` et `pct: "pm-id"`.

## Anglais, chinois, cybersécurité
Chaque thème a son fichier (`anglais-data.js`, `chinois-data.js`, `cyber-data.js`) : modifiez `PLAN` (modules et titres) puis `CONTENT` (clé = numéro du cours, ou `e1`, `e2`… pour les examens de module).
Pour la cybersécurité, le format est `{ l, v, lab, ex, an, ev }`.

## Bonnes pratiques
- Une évaluation = 5 à 10 questions ; le barème est automatiquement ramené à 20 points.
- Évitez les guillemets doubles dans le HTML des leçons (utilisez `'`).
- Après modification, rechargez la page (Ctrl+F5) : la progression reste conservée.
