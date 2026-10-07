// Parcours cybersécurité. Même format que l'anglais : ajoutez un bloc dans "content" pour chaque module.
// Clé = numéro du module (1, 2, 3…) ou "e1", "e2"… pour l'examen du niveau. Sans contenu : « Bientôt disponible ».
// Module : { l: cours, v: [[terme, définition]], lab: html, ex: [questions], an: html (analyse, challenge, rapport), ev: [10 questions] }
// Question : { q, a:["réponse","variante"] } ou QCM { q, o:[…], c:indexBonneRéponse } ; p = points (défaut 2).
const PARCOURS = {
  id: "cybersecurite", store: "pCyber", pct: "pCyb", tech: true, unite: "Module",
  eyebrow: "Parcours · de zéro à expert", titre: "Parcours ultime en cybersécurité",
  lead: "20 niveaux, 64 modules. Validez chaque évaluation avec <b>15/20</b> pour débloquer la suite.",
  steps: ["Cours", "Vocabulaire", "Lab", "Exercices", "Analyse", "Évaluation"],
  plan: [
    ["Niveau 1 — Fondamentaux informatiques", "Architecture informatique|Systèmes d'exploitation|Examen du niveau 1"],
    ["Niveau 2 — Réseaux", "Modèle OSI|TCP/IP|Adressage IP|Routage|Analyse réseau|Examen du niveau 2"],
    ["Niveau 3 — Linux", "Administration Linux|Permissions Linux|Réseau sous Linux|Sécurité Linux|Examen du niveau 3"],
    ["Niveau 4 — Windows", "Windows internals|PowerShell|Examen du niveau 4"],
    ["Niveau 5 — Active Directory", "Architecture AD|Administration AD|Sécurité AD|Examen du niveau 5"],
    ["Niveau 6 — Programmation", "Python|Bash|PowerShell avancé|Examen du niveau 6"],
    ["Niveau 7 — Cybersécurité fondamentale", "Triade CIA|Menaces|Risque|Défense en profondeur|Examen du niveau 7"],
    ["Niveau 8 — Sécurité réseau", "Firewall|IDS / IPS|VPN|Segmentation réseau|Examen du niveau 8"],
    ["Niveau 9 — Cybersécurité Web", "HTTP|OWASP|Vulnérabilités web|Examen du niveau 9"],
    ["Niveau 10 — Pentest", "Méthodologie|Reconnaissance|Scanning|Exploitation|Élévation de privilèges|Reporting|Examen du niveau 10"],
    ["Niveau 11 — Red Team", "Cycle d'attaque et MITRE ATT&CK|Command & Control|Examen du niveau 11"],
    ["Niveau 12 — SOC / Blue Team", "SOC|SIEM|Détection|EDR|Examen du niveau 12"],
    ["Niveau 13 — Threat Hunting", "Hunting par hypothèse|Threat Intelligence|MITRE ATT&CK en détection|Examen du niveau 13"],
    ["Niveau 14 — DFIR / Forensic", "Réponse à incident|Forensic disque|Forensic mémoire|Analyse de timeline|Examen du niveau 14"],
    ["Niveau 15 — Analyse de malware", "Familles de malwares|Analyse statique|Analyse dynamique|Examen du niveau 15"],
    ["Niveau 16 — Cryptographie", "Chiffrement, hachage, encodage, signature|Algorithmes|PKI|Examen du niveau 16"],
    ["Niveau 17 — Cloud", "Modèles cloud|IAM|Attaques cloud|Examen du niveau 17"],
    ["Niveau 18 — DevSecOps", "Git, CI/CD et conteneurs|Pipeline de sécurité|Examen du niveau 18"],
    ["Niveau 19 — Architecture / GRC", "Architecture de sécurité|GRC|RGPD|Gestion de crise|Examen du niveau 19"],
    ["Niveau 20 — Expertise", "Examen du niveau 20"]
  ],
  content: {
1: {
  l: "<p>Un ordinateur est une chaîne de composants matériels et logiciels. Comprendre qui fait quoi permet de savoir <b>où une attaque peut s'insérer</b> et où chercher des preuves.</p><table><tr><th>Composant</th><th>Rôle</th><th>Intérêt en sécurité</th></tr><tr><td>CPU</td><td>Exécute les instructions</td><td>Un pic anormal peut trahir un processus malveillant</td></tr><tr><td>RAM</td><td>Mémoire vive, <b>volatile</b></td><td>Contient processus, connexions et clés : précieuse en forensic</td></tr><tr><td>Cache</td><td>Mémoire très rapide dans le CPU</td><td>Source d'attaques par canaux auxiliaires</td></tr><tr><td>GPU</td><td>Calcul parallèle, graphisme</td><td>Utilisé aussi pour casser des mots de passe</td></tr><tr><td>HDD / SSD</td><td>Stockage durable (mécanique / flash)</td><td>Chiffrement du disque, effacement sécurisé</td></tr><tr><td>BIOS / UEFI</td><td>Firmware qui démarre la machine</td><td>Secure Boot : ne lancer que du code signé</td></tr></table><div class='key'><b>Chemin d'une action :</b> Utilisateur → Application → OS → Kernel → Driver → Hardware. Le <b>kernel</b> arbitre l'accès au matériel, le <b>driver</b> traduit ses ordres pour un matériel précis, le <b>firmware</b> est le logiciel embarqué dans le matériel.</div><p>Un <b>processus</b> est un programme en cours d'exécution ; il contient un ou plusieurs <b>threads</b> (unités d'exécution) qui partagent sa mémoire.</p>",
  v: [["CPU","Processeur : exécute les instructions des programmes"],["RAM","Mémoire vive volatile : données en cours d'utilisation"],["Cache","Mémoire ultra-rapide intégrée au processeur"],["GPU","Processeur spécialisé dans le calcul parallèle"],["SSD","Stockage durable en mémoire flash, sans pièce mobile"],["Firmware","Logiciel embarqué dans un matériel"],["UEFI","Firmware moderne de démarrage (successeur du BIOS)"],["Kernel","Noyau : cœur de l'OS qui gère CPU, mémoire et matériel"],["Driver","Pilote : permet à l'OS de commander un périphérique"],["Process","Processus : programme en cours d'exécution"],["Thread","Fil d'exécution à l'intérieur d'un processus"],["Bus","Canal de communication entre composants"]],
  lab: "<p><b>Objectif :</b> cartographier votre propre ordinateur. Toutes ces commandes sont en lecture seule.</p><p><b>Linux</b></p><pre>lscpu\nfree -h\nlsblk\nip a\nps aux --sort=-%mem | head\nsystemctl list-units --type=service --state=running</pre><p><b>Windows (PowerShell)</b></p><pre>Get-CimInstance Win32_Processor\nGet-CimInstance Win32_PhysicalMemory\nGet-PhysicalDisk\nGet-NetAdapter\nGet-Process | Sort-Object WorkingSet -Descending | Select-Object -First 10\nGet-Service | Where-Object Status -eq Running</pre><div class='key'><b>Livrable :</b> une fiche avec CPU, RAM, stockage, interfaces réseau, 5 processus et 5 services, chacun expliqué en une phrase.</div>",
  ex: [
    { q: "Quelle mémoire perd son contenu à l'extinction ?", o: ["SSD", "RAM", "HDD"], c: 1 },
    { q: "Quel composant exécute les instructions des programmes ? (sigle)", a: ["CPU", "processeur"] },
    { q: "Quel élément traduit les ordres du kernel pour un matériel précis ?", o: ["Une application", "Un driver", "L'utilisateur"], c: 1 },
    { q: "Un SSD, comparé à un HDD, est :", o: ["mécanique et plus lent", "basé sur de la mémoire flash, sans pièce mobile", "volatile"], c: 1 },
    { q: "Complétez : Utilisateur → Application → OS → Kernel → ___ → Hardware", a: ["driver", "drivers", "pilote"] },
    { q: "Le firmware UEFI s'exécute :", o: ["après le chargement de l'OS", "avant l'OS, au démarrage", "uniquement sous Linux"], c: 1 },
    { q: "Un thread est :", o: ["un programme complet", "une unité d'exécution dans un processus", "un type de disque"], c: 1 },
    { q: "Quelle mémoire très rapide, intégrée au processeur, garde les données fréquentes ?", a: ["cache", "le cache", "mémoire cache"] }
  ],
  an: "<p><b>Scénario.</b> Un poste de travail est très lent et son ventilateur tourne à fond. Le gestionnaire des tâches montre un processus inconnu à 90 % de CPU, avec une connexion réseau sortante.</p><ol><li>Quels composants sont sollicités, et pourquoi ?</li><li>Quelles commandes permettent d'identifier ce processus (nom, chemin, utilisateur, connexions) ?</li><li>Comment vérifier s'il est légitime ?</li></ol><div class='key'><b>Challenge :</b> analysez votre propre machine et repérez un processus dont vous ne connaissez pas le rôle. Trouvez-le sans aide directe.</div><p><b>Rapport :</b> consignez vos constatations (commande, résultat, interprétation) dans un court document.</p>",
  ev: [
    { q: "Quel composant relie tous les autres composants entre eux ?", o: ["La carte mère", "Le GPU", "Le cache"], c: 0 },
    { q: "Quelle mémoire est volatile : la RAM ou le SSD ?", a: ["RAM", "la RAM"] },
    { q: "Le kernel est :", o: ["le cœur de l'OS, qui gère CPU, mémoire et matériel", "une application de bureau", "un type de virus"], c: 0 },
    { q: "Le Secure Boot a pour but de :", o: ["accélérer le démarrage", "n'exécuter au démarrage que du code signé et approuvé", "chiffrer le disque dur"], c: 1 },
    { q: "En forensic, la RAM est précieuse car elle contient :", o: ["uniquement des fichiers supprimés", "l'état en cours : processus, connexions, clés", "les sauvegardes"], c: 1 },
    { q: "Le rôle d'un driver est de :", o: ["permettre à l'OS de commander un matériel", "chiffrer le réseau", "stocker les mots de passe"], c: 0 },
    { q: "Commande Linux qui affiche la mémoire en format lisible :", a: ["free -h"] },
    { q: "Cmdlet PowerShell qui liste les processus :", a: ["Get-Process"] },
    { q: "Un processus peut contenir :", o: ["un seul thread uniquement", "un ou plusieurs threads", "aucun thread"], c: 1 },
    { q: "Le BIOS / UEFI est un exemple de :", o: ["application", "firmware", "driver réseau"], c: 1 }
  ]
},
2: {
  l: "<p>Un système d'exploitation (OS) gère les ressources et sépare les programmes entre eux. Deux espaces coexistent : le <b>kernel space</b> (noyau, accès total au matériel) et le <b>user space</b> (applications, droits limités). Une application passe par un <b>appel système</b> (syscall) pour obtenir un service du noyau.</p><table><tr><th>OS</th><th>Noyau</th><th>Système de fichiers</th><th>Particularité</th></tr><tr><td>Windows</td><td>NT</td><td>NTFS</td><td>Très répandu en entreprise (Active Directory)</td></tr><tr><td>Linux</td><td>Linux</td><td>ext4, XFS</td><td>Serveurs, cloud, outils de sécurité</td></tr><tr><td>macOS</td><td>XNU</td><td>APFS</td><td>Base Unix, signature de code stricte</td></tr><tr><td>Android</td><td>Linux modifié</td><td>ext4, F2FS</td><td>Applications isolées dans des « bacs à sable »</td></tr></table><p>Chaque OS gère des <b>utilisateurs</b> et des <b>groupes</b>, des <b>permissions</b> sur les fichiers, et des <b>services</b> (appelés <i>daemons</i> sous Linux) qui tournent en arrière-plan.</p><div class='key'><b>Moindre privilège :</b> chaque compte ne reçoit que les droits dont il a besoin. C'est la mesure la plus rentable pour limiter les dégâts d'un compte ou d'un programme compromis.</div>",
  v: [["Kernel space","Zone mémoire réservée au noyau"],["User space","Zone où s'exécutent les applications, à droits limités"],["Syscall","Appel système : demande d'un service au noyau"],["Daemon","Service tournant en arrière-plan sous Linux"],["Service","Programme de fond sous Windows"],["Permission","Droit de lire, écrire ou exécuter une ressource"],["Least privilege","Moindre privilège : droits minimaux nécessaires"],["Root","Compte tout-puissant sous Linux"],["Administrator","Compte à privilèges élevés sous Windows"],["Group","Ensemble d'utilisateurs partageant des droits"],["Filesystem","Organisation des fichiers sur un support"],["Sandbox","Bac à sable : environnement isolé pour un programme"]],
  lab: "<p><b>Objectif :</b> établir la fiche d'identité de votre système (lecture seule).</p><p><b>Linux</b></p><pre>uname -a\ncat /etc/os-release\nwhoami\nid\nls -l /etc/passwd\nsystemctl list-units --type=service --state=running | head -20</pre><p><b>Windows (PowerShell)</b></p><pre>Get-ComputerInfo | Select-Object OsName, OsVersion\nwhoami /groups\nGet-LocalUser\nGet-LocalGroup\nGet-Service | Where-Object Status -eq Running | Select-Object -First 10</pre><div class='key'><b>Livrable :</b> une fiche complète : OS et version, noyau, utilisateurs, groupes, 5 services, et les permissions d'un fichier système sensible.</div>",
  ex: [
    { q: "Le code d'une application s'exécute normalement dans :", o: ["le kernel space", "le user space", "le BIOS"], c: 1 },
    { q: "Un appel système (syscall) sert à :", o: ["demander un service au noyau", "modifier le BIOS", "éteindre l'écran"], c: 0 },
    { q: "Comment appelle-t-on un service d'arrière-plan sous Linux ?", a: ["daemon", "démon"] },
    { q: "Quel OS utilise le noyau XNU ?", o: ["Windows", "macOS", "Android"], c: 1 },
    { q: "Quelle commande affiche l'utilisateur courant ?", a: ["whoami"] },
    { q: "Le principe du moindre privilège consiste à :", o: ["donner à chacun uniquement les droits nécessaires", "donner les droits admin à tous", "supprimer tous les comptes"], c: 0 },
    { q: "Système de fichiers par défaut de Windows :", o: ["ext4", "NTFS", "APFS"], c: 1 },
    { q: "Quel compte possède tous les droits sous Linux ?", a: ["root"] }
  ],
  an: "<p><b>Scénario.</b> Un employé installe un logiciel et obtient les droits administrateur sur son poste. Quelques jours plus tard, un programme malveillant s'exécute avec ces mêmes droits.</p><ol><li>Pourquoi cette situation est-elle plus grave qu'avec un compte standard ?</li><li>Comment le moindre privilège aurait-il limité l'impact ?</li><li>Quels éléments auditer sur le poste (comptes, groupes, services) ?</li></ol><div class='key'><b>Challenge :</b> comparez le modèle de permissions de deux systèmes d'exploitation dans un tableau (comptes, groupes, droits sur un fichier, élévation de privilèges).</div><p><b>Rapport :</b> rédigez vos conclusions et trois recommandations.</p>",
  ev: [
    { q: "Dans quel espace s'exécute le noyau ?", o: ["user space", "kernel space", "cloud"], c: 1 },
    { q: "Android repose sur :", o: ["le noyau Linux", "le noyau Windows NT", "XNU"], c: 0 },
    { q: "Cmdlet PowerShell qui liste les comptes locaux :", a: ["Get-LocalUser"] },
    { q: "Commande Linux affichant l'identité et les groupes de l'utilisateur :", a: ["id"] },
    { q: "Un compte standard peut-il modifier les fichiers système sans élévation ?", o: ["Oui, toujours", "Non, en général il faut des droits élevés", "Seulement sous macOS"], c: 1 },
    { q: "Un « service » Windows est comparable sous Linux à :", o: ["un daemon", "un driver", "un fichier PDF"], c: 0 },
    { q: "Pourquoi séparer user space et kernel space ?", o: ["protéger le système des erreurs ou abus des applications", "économiser de la RAM", "accélérer le réseau"], c: 0 },
    { q: "Quelle pratique réduit l'impact d'un malware lancé par l'utilisateur ?", o: ["Travailler en compte admin", "Travailler en compte standard", "Désactiver les mises à jour"], c: 1 },
    { q: "Fichier Linux listant les comptes utilisateurs (chemin complet) :", a: ["/etc/passwd"] },
    { q: "Quel noyau est publié sous licence libre GPL ?", o: ["Windows NT", "Linux", "XNU"], c: 1 }
  ]
},
e1: {
  ev: [
    { q: "Quel composant stocke durablement les données sans alimentation ?", o: ["RAM", "SSD", "Cache"], c: 1, p: 1 },
    { q: "Que signifie CPU en français ? (un mot)", a: ["processeur", "unité centrale de traitement"], p: 1 },
    { q: "Le GPU est surtout conçu pour :", o: ["le calcul parallèle, dont le graphisme", "stocker des fichiers", "gérer le Wi-Fi"], c: 0, p: 1 },
    { q: "Quelle mémoire est la plus rapide ?", o: ["HDD", "RAM", "Cache"], c: 2, p: 1 },
    { q: "Quel logiciel de la carte mère démarre le matériel avant l'OS ? (sigle)", a: ["UEFI", "BIOS", "firmware"], p: 1 },
    { q: "Quelle est la bonne chaîne ?", o: ["Application → OS → Kernel → Driver → Hardware", "Hardware → Driver → Application → Kernel", "Kernel → Application → Hardware → OS"], c: 0, p: 1 },
    { q: "Un processus est :", o: ["un programme en cours d'exécution", "un composant matériel", "un protocole réseau"], c: 0, p: 1 },
    { q: "Les threads d'un même processus partagent :", o: ["le même espace mémoire", "uniquement le disque dur", "rien"], c: 0, p: 1 },
    { q: "Quel logiciel permet à l'OS de piloter un périphérique ?", a: ["driver", "drivers", "pilote"], p: 1 },
    { q: "Un firmware est :", o: ["un logiciel intégré à un matériel", "une application web", "un antivirus"], c: 0, p: 1 },
    { q: "Le kernel space est réservé :", o: ["aux applications utilisateur", "au noyau et à ses composants", "aux navigateurs"], c: 1, p: 1 },
    { q: "Comment nomme-t-on le mécanisme par lequel une application demande un service au noyau ?", a: ["appel système", "system call", "syscall"], p: 1 },
    { q: "Le système de fichiers par défaut de Windows est :", o: ["NTFS", "ext4", "APFS"], c: 0, p: 1 },
    { q: "Quel système repose sur le noyau Linux ?", o: ["iOS", "Android", "Windows"], c: 1, p: 1 },
    { q: "Commande Linux affichant la version du noyau :", a: ["uname -r", "uname -a"], p: 1 },
    { q: "Cmdlet PowerShell qui liste les services :", a: ["Get-Service"], p: 1 },
    { q: "Le moindre privilège consiste à :", o: ["accorder le minimum de droits nécessaires", "donner tous les droits", "interdire toute connexion"], c: 0, p: 1 },
    { q: "Quel compte Windows est l'équivalent de « root » ?", o: ["Administrateur", "Invité", "Default"], c: 0, p: 1 },
    { q: "Une copie de la RAM permet notamment de retrouver :", o: ["les processus et connexions actifs", "la couleur de l'écran", "le fabricant du clavier"], c: 0, p: 1 },
    { q: "Pourquoi un malware lancé par un compte admin est-il plus dangereux ?", o: ["Il hérite des droits élevés de l'utilisateur", "Il est plus rapide", "Il consomme moins de RAM"], c: 0, p: 1 }
  ]
}
  }
};
