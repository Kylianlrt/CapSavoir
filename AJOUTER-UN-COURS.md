# Ajouter ou modifier un cours — mode d'emploi

## Fichiers
- `contenu-langues.js` : italien, espagnol, français, orthographe
- `contenu-savoirs.js` : code de la route, culture, histoire, maths, éloquence, politique, sciences, économie, philosophie
- `module-contenu.js` : le moteur (ne pas y mettre de cours)
- `module-fin.js` : doit rester chargé en dernier dans `module.html`
- `anglais-data.js`, `chinois-data.js`, `cyber-data.js` : parcours à part (PLAN + CONTENT)

## Ajouter un cours (30 secondes)
Utilisez `ajouter.html`, ou copiez ce bloc dans un fichier de contenu :
```
cours("espagnol", `
=== Nom du module
--- Titre du cours
## Titre de la leçon
Texte (**gras** ; « ! » = encadré À retenir)
@vocab
mot = traduction
@exemples
Simple. / Moyenne. / Avancée. (une par ligne)
@exercices
? QCM | Bonne* | Autre | Autre
? Question libre = réponse / variante
@oral
Consigne orale.
@eval
? (5 questions conseillées)
`);
```
- Un nouveau nom après `===` crée un nouveau module. Un nouveau thème : ajoutez-le dans `data.js` (avec `page`, `pct`, `lang`), puis écrivez `cours("id", ...)`.
- Les réponses libres acceptent la saisie avec ou sans accents.
- Évitez les accolades-dollar et les accents graves dans le texte.
- Rechargez avec Ctrl+F5 : la progression est conservée.