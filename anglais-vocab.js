// Verbes irréguliers : "infinitif|prétérit|participe passé|français"  ("/" = variantes acceptées)
const VERBES = [
"be|was/were|been|être","become|became|become|devenir","begin|began|begun|commencer","bite|bit|bitten|mordre","blow|blew|blown|souffler",
"break|broke|broken|casser","bring|brought|brought|apporter","build|built|built|construire","buy|bought|bought|acheter","catch|caught|caught|attraper",
"choose|chose|chosen|choisir","come|came|come|venir","cost|cost|cost|coûter","cut|cut|cut|couper","dig|dug|dug|creuser",
"do|did|done|faire","draw|drew|drawn|dessiner","drink|drank|drunk|boire","drive|drove|driven|conduire","eat|ate|eaten|manger",
"fall|fell|fallen|tomber","feed|fed|fed|nourrir","feel|felt|felt|ressentir","fight|fought|fought|se battre","find|found|found|trouver",
"fly|flew|flown|voler (dans les airs)","forget|forgot|forgotten|oublier","freeze|froze|frozen|geler","get|got|got/gotten|obtenir / devenir","give|gave|given|donner",
"go|went|gone|aller","grow|grew|grown|grandir / cultiver","hang|hung|hung|accrocher","have|had|had|avoir","hear|heard|heard|entendre",
"hide|hid|hidden|cacher","hit|hit|hit|frapper","hold|held|held|tenir","hurt|hurt|hurt|faire mal","keep|kept|kept|garder",
"know|knew|known|savoir / connaître","lay|laid|laid|poser","lead|led|led|mener","learn|learnt/learned|learnt/learned|apprendre","leave|left|left|partir / laisser",
"lend|lent|lent|prêter","let|let|let|laisser / permettre","lose|lost|lost|perdre","make|made|made|fabriquer / faire","mean|meant|meant|signifier",
"meet|met|met|rencontrer","pay|paid|paid|payer","put|put|put|mettre","read|read|read|lire","ride|rode|ridden|monter (vélo, cheval)",
"ring|rang|rung|sonner","rise|rose|risen|se lever (soleil)","run|ran|run|courir","say|said|said|dire","see|saw|seen|voir",
"sell|sold|sold|vendre","send|sent|sent|envoyer","set|set|set|fixer / installer","shine|shone|shone|briller","shoot|shot|shot|tirer",
"show|showed|shown/showed|montrer","shut|shut|shut|fermer","sing|sang|sung|chanter","sink|sank|sunk|couler","sit|sat|sat|s'asseoir",
"sleep|slept|slept|dormir","speak|spoke|spoken|parler","spend|spent|spent|dépenser / passer (temps)","spread|spread|spread|étaler / répandre","stand|stood|stood|être debout",
"steal|stole|stolen|voler (dérober)","swim|swam|swum|nager","take|took|taken|prendre","teach|taught|taught|enseigner","tear|tore|torn|déchirer",
"tell|told|told|raconter / dire","think|thought|thought|penser","throw|threw|thrown|jeter / lancer","understand|understood|understood|comprendre","wake|woke|woken|se réveiller",
"wear|wore|worn|porter (vêtement)","win|won|won|gagner","write|wrote|written|écrire"
];
// Vocabulaire par thème : "anglais=français" ("/" = variantes acceptées)
const VOCAB = {
quotidien: { nom: "Vie quotidienne", mots: ["breakfast=petit-déjeuner","neighbour=voisin","shopping=courses","to wake up=se réveiller","to get dressed=s'habiller","to borrow=emprunter","to enjoy=apprécier / aimer","schedule=emploi du temps / planning","chore=corvée / tâche ménagère","to tidy up=ranger","laundry=lessive / linge","rent=loyer","habit=habitude","to wait for=attendre","to look for=chercher","to be late=être en retard","to hurry=se dépêcher","weekend=week-end","to relax=se détendre","mood=humeur"] },
travail: { nom: "Travail", mots: ["job=emploi / travail","boss=patron / chef","colleague=collègue","salary=salaire","meeting=réunion","deadline=date limite / échéance","to hire=embaucher / recruter","to fire=licencier","skill=compétence","career=carrière","to apply for=postuler à","interview=entretien","customer=client","workload=charge de travail","to resign=démissionner","promotion=promotion","training=formation","teamwork=travail d'équipe","to earn=gagner (de l'argent)","retirement=retraite"] },
voyage: { nom: "Voyage", mots: ["luggage=bagages","ticket=billet","flight=vol","delay=retard","to book=réserver","passport=passeport","customs=douane","journey=trajet / voyage","to board=embarquer","departure=départ","arrival=arrivée","gate=porte d'embarquement","seat=siège / place","to check in=s'enregistrer","sightseeing=visite touristique","accommodation=hébergement","map=carte / plan","round trip=aller-retour","one-way ticket=aller simple","to get lost=se perdre"] },
maison: { nom: "Maison", mots: ["fridge=réfrigérateur / frigo","sofa=canapé","curtain=rideau","stairs=escaliers","ceiling=plafond","floor=sol / plancher / étage","wall=mur","shelf=étagère","drawer=tiroir","bedroom=chambre","kitchen=cuisine","garden=jardin","roof=toit","lamp=lampe","carpet=tapis / moquette","bathroom=salle de bain","mirror=miroir","cupboard=placard","fence=clôture","key=clé / clef"] },
sante: { nom: "Santé", mots: ["headache=mal de tête","fever=fièvre","cough=toux","sore throat=mal de gorge","to recover=guérir / se rétablir","prescription=ordonnance","pharmacy=pharmacie","injury=blessure","allergy=allergie","appointment=rendez-vous","ill=malade","to sneeze=éternuer","pain=douleur","medicine=médicament","blood=sang","stomach=estomac","healthy=en bonne santé","dizzy=étourdi","swollen=gonflé","bandage=pansement"] },
tech: { nom: "Technologie", mots: ["screen=écran","keyboard=clavier","password=mot de passe","to download=télécharger","to upload=téléverser","file=fichier","website=site web","to log in=se connecter","battery=batterie","charger=chargeur","software=logiciel","update=mise à jour","device=appareil","to delete=supprimer","to save=enregistrer / sauvegarder","link=lien","network=réseau","search engine=moteur de recherche","to install=installer","backup=sauvegarde"] },
liaison: { nom: "Mots de liaison", mots: ["however=cependant / pourtant","although=bien que","despite=malgré","therefore=donc / par conséquent","moreover=de plus","meanwhile=pendant ce temps","unless=à moins que","whereas=alors que","instead of=au lieu de","besides=d'ailleurs / en plus","as soon as=dès que","even though=même si / bien que","on the other hand=d'autre part","furthermore=en outre","nevertheless=néanmoins","whenever=chaque fois que","whether=si (doute)","either...or=soit...soit","neither...nor=ni...ni","in order to=afin de / pour"] }
};
