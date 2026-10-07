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
},
// ===== NIVEAU 2 — RÉSEAUX =====

3: {
  l: "<p>Le modèle <b>OSI</b> est un modèle conceptuel qui découpe les communications réseau en <b>7 couches</b>. En cybersécurité, il permet de localiser une panne, comprendre une attaque et identifier à quel niveau appliquer une protection.</p><table><tr><th>Couche</th><th>Nom</th><th>Rôle</th><th>Exemples</th></tr><tr><td>7</td><td>Application</td><td>Services utilisés par les applications</td><td>HTTP, DNS, SMTP, SSH</td></tr><tr><td>6</td><td>Présentation</td><td>Formatage, chiffrement, compression</td><td>TLS, encodage</td></tr><tr><td>5</td><td>Session</td><td>Gestion des sessions de communication</td><td>Sessions RPC</td></tr><tr><td>4</td><td>Transport</td><td>Communication de bout en bout</td><td>TCP, UDP</td></tr><tr><td>3</td><td>Réseau</td><td>Adressage et routage</td><td>IPv4, IPv6, ICMP</td></tr><tr><td>2</td><td>Liaison</td><td>Communication locale et adresses MAC</td><td>Ethernet, ARP, VLAN</td></tr><tr><td>1</td><td>Physique</td><td>Transmission des bits</td><td>Câbles, fibre, ondes</td></tr></table><div class='key'><b>À retenir :</b> une donnée descend les couches chez l'émetteur, traverse le réseau, puis remonte les couches chez le destinataire. En pratique, les modèles TCP/IP et OSI ne correspondent pas parfaitement couche par couche, mais OSI reste un excellent outil de raisonnement.</div><p><b>En cybersécurité :</b> une attaque peut viser différentes couches : brouillage physique, attaque MAC/VLAN, ARP spoofing, attaques IP, scans TCP, attaques DNS ou vulnérabilités applicatives.</p>",

  v: [
    ["OSI","Modèle conceptuel en 7 couches décrivant les communications réseau"],
    ["Application","Couche 7 : services directement utilisés par les applications"],
    ["Présentation","Couche 6 : représentation, chiffrement et compression des données"],
    ["Session","Couche 5 : établissement et gestion des sessions"],
    ["Transport","Couche 4 : communication de bout en bout avec TCP ou UDP"],
    ["Réseau","Couche 3 : adressage IP et routage"],
    ["Liaison","Couche 2 : communication locale, trames et adresses MAC"],
    ["Physique","Couche 1 : transmission des bits sur le support"],
    ["MAC","Adresse matérielle d'une interface réseau"],
    ["Trame","Unité de données généralement associée à la couche 2"],
    ["Paquet","Unité de données généralement associée à la couche 3"],
    ["Segment","Unité TCP généralement associée à la couche 4"],
    ["Encapsulation","Ajout d'informations de contrôle à chaque couche"],
    ["Décapsulation","Retrait de ces informations chez le destinataire"]
  ],

  lab: "<p><b>Objectif :</b> observer les différentes couches utilisées par une communication réelle.</p><p><b>Windows PowerShell</b></p><pre>ipconfig\nping 1.1.1.1\ntracert 1.1.1.1\nnslookup example.com\nGet-NetIPConfiguration\nGet-NetAdapter</pre><p><b>Linux</b></p><pre>ip addr\nip route\nping -c 4 1.1.1.1\ntraceroute 1.1.1.1\ndig example.com\nip neigh</pre><div class='key'><b>Livrable :</b> pour chaque commande, indiquez la couche OSI principalement concernée et expliquez ce que vous observez.</div>",

  ex: [
    { q: "Combien de couches possède le modèle OSI ?", o: ["4", "5", "7", "8"], c: 2 },
    { q: "À quelle couche appartient TCP ?", o: ["Couche 2", "Couche 3", "Couche 4", "Couche 7"], c: 2 },
    { q: "À quelle couche appartient IP ?", o: ["Couche 2", "Couche 3", "Couche 4", "Couche 7"], c: 1 },
    { q: "À quelle couche appartiennent principalement les adresses MAC ?", o: ["Couche 1", "Couche 2", "Couche 3", "Couche 4"], c: 1 },
    { q: "DNS appartient principalement à quelle couche du modèle OSI ?", o: ["Couche 2", "Couche 3", "Couche 4", "Couche 7"], c: 3 },
    { q: "Comment appelle-t-on l'ajout des informations de contrôle à chaque couche ?", a: ["encapsulation"] },
    { q: "Quelle commande Windows permet d'afficher la configuration IP ?", a: ["ipconfig"] },
    { q: "Quelle commande permet d'observer le chemin vers une destination sous Windows ?", a: ["tracert"] }
  ],

  an: "<p><b>Scénario :</b> un utilisateur indique qu'il peut accéder à son réseau local mais qu'il ne peut pas atteindre un serveur Internet.</p><ol><li>Quelles couches OSI vérifieriez-vous en premier ?</li><li>Quelles commandes utiliseriez-vous ?</li><li>Comment distinguer un problème DNS d'un problème de routage ?</li><li>Pourquoi le modèle OSI est-il utile lors d'une investigation de sécurité ?</li></ol><div class='key'><b>Challenge :</b> choisissez une communication HTTPS réelle et représentez son parcours depuis l'application jusqu'au support physique. Indiquez au moins un protocole ou mécanisme par couche.</div><p><b>Rapport :</b> faites un schéma accompagné d'une explication de 10 à 15 lignes.</p>",

  ev: [
    { q: "Le modèle OSI comporte combien de couches ?", o: ["5", "6", "7"], c: 2 },
    { q: "TCP fonctionne principalement à quelle couche ?", o: ["2", "3", "4"], c: 2 },
    { q: "IP fonctionne principalement à quelle couche ?", o: ["2", "3", "7"], c: 1 },
    { q: "Une adresse MAC est associée principalement à :", o: ["la couche 2", "la couche 3", "la couche 4"], c: 0 },
    { q: "Quelle couche transmet physiquement les bits ?", o: ["1", "3", "7"], c: 0 },
    { q: "HTTP est associé principalement à :", o: ["la couche 2", "la couche 4", "la couche 7"], c: 2 },
    { q: "Quelle commande Windows affiche l'adresse IP locale ?", a: ["ipconfig"] },
    { q: "Quelle commande Linux affiche les interfaces réseau et leurs adresses ?", a: ["ip addr", "ip a"] },
    { q: "Comment s'appelle l'ajout des en-têtes lors de la descente des couches ?", a: ["encapsulation"] },
    { q: "Le modèle OSI sert notamment à :", o: ["localiser et raisonner sur les problèmes réseau", "remplacer TCP", "chiffrer automatiquement toutes les communications"], c: 0 }
  ]
},

4: {
  l: "<p>TCP/IP est la suite de protocoles utilisée au cœur d'Internet. Elle permet aux machines de communiquer en utilisant plusieurs protocoles spécialisés.</p><h3>Les principales couches TCP/IP</h3><table><tr><th>Couche</th><th>Rôle</th><th>Exemples</th></tr><tr><td>Application</td><td>Services réseau</td><td>HTTP, DNS, SSH, SMTP</td></tr><tr><td>Transport</td><td>Communication entre applications</td><td>TCP, UDP</td></tr><tr><td>Internet</td><td>Adressage et routage</td><td>IPv4, IPv6, ICMP</td></tr><tr><td>Accès réseau</td><td>Transmission locale</td><td>Ethernet, Wi-Fi</td></tr></table><p><b>TCP</b> est orienté connexion. Il établit une communication fiable avec notamment le three-way handshake :</p><pre>SYN → SYN/ACK → ACK</pre><p><b>UDP</b> est sans connexion et ajoute moins de mécanismes de contrôle. Il est utilisé lorsque la rapidité ou la simplicité sont prioritaires.</p><div class='key'><b>Point cybersécurité :</b> comprendre TCP et UDP est indispensable pour interpréter les scans, les logs firewall et les captures Wireshark.</div><p>Il faut également connaître la différence entre <b>port source</b> et <b>port destination</b>. Une connexion réseau peut être représentée par les adresses IP, ports et protocole utilisés.</p>",

  v: [
    ["TCP","Protocole de transport fiable et orienté connexion"],
    ["UDP","Protocole de transport sans connexion, plus léger"],
    ["SYN","Drapeau TCP utilisé pour initier une connexion"],
    ["ACK","Drapeau TCP indiquant notamment une confirmation"],
    ["Handshake","Établissement initial d'une connexion TCP"],
    ["Port","Identifiant logique d'un service ou d'une application"],
    ["Socket","Point de communication associant notamment adresse IP et port"],
    ["IP","Protocole d'adressage et de routage"],
    ["ICMP","Protocole utilisé notamment par ping et certains messages réseau"],
    ["DNS","Service permettant notamment de résoudre des noms en adresses IP"],
    ["DHCP","Protocole permettant d'attribuer automatiquement une configuration IP"],
    ["HTTP","Protocole applicatif du Web"],
    ["HTTPS","HTTP protégé par TLS"],
    ["SSH","Protocole sécurisé d'accès distant"],
    ["SMTP","Protocole utilisé pour l'envoi des courriels"]
  ],

  lab: "<p><b>Objectif :</b> observer les connexions TCP et UDP de votre propre machine.</p><p><b>Windows</b></p><pre>Get-NetTCPConnection\nGet-NetUDPEndpoint\nnetstat -ano</pre><p><b>Linux</b></p><pre>ss -tuln\nss -tunap\nsudo tcpdump -i any -c 50</pre><p>Pour chaque connexion intéressante, relever l'adresse locale, le port local, l'adresse distante, le port distant et l'état.</p><div class='key'><b>Attention :</b> n'analysez que des machines et réseaux pour lesquels vous avez l'autorisation. L'objectif est ici de comprendre votre propre trafic.</div><p><b>Livrable :</b> identifiez 5 ports en écoute sur votre environnement et expliquez quel service pourrait les utiliser.</p>",

  ex: [
    { q: "Quel protocole est orienté connexion ?", o: ["TCP", "UDP", "ICMP"], c: 0 },
    { q: "Quel est l'ordre correct du handshake TCP ?", o: ["ACK → SYN → SYN/ACK", "SYN → SYN/ACK → ACK", "SYN → ACK → SYN/ACK"], c: 1 },
    { q: "Quel protocole est généralement plus léger car sans connexion ?", o: ["TCP", "UDP", "HTTPS"], c: 1 },
    { q: "Quel protocole permet notamment de résoudre un nom de domaine ?", a: ["DNS"] },
    { q: "Quel protocole attribue automatiquement des paramètres IP ?", a: ["DHCP"] },
    { q: "Quel protocole est généralement utilisé pour l'administration distante sécurisée ?", o: ["FTP", "SSH", "Telnet"], c: 1 },
    { q: "Le port identifie principalement :", o: ["une application ou un service", "une carte graphique", "un câble réseau"], c: 0 },
    { q: "HTTPS correspond à :", o: ["HTTP sans réseau", "HTTP protégé par TLS", "HTTP sur UDP uniquement"], c: 1 }
  ],

  an: "<p><b>Scénario :</b> un serveur présente de nombreuses connexions entrantes. Certaines sont en état LISTEN, d'autres sont ESTABLISHED.</p><ol><li>Que signifie LISTEN ?</li><li>Que signifie ESTABLISHED pour TCP ?</li><li>Pourquoi un port ouvert n'est-il pas automatiquement une vulnérabilité ?</li><li>Quelles informations faudrait-il collecter avant de conclure qu'une connexion est suspecte ?</li></ol><div class='key'><b>Challenge :</b> choisissez une connexion TCP de votre machine et reconstituez son cycle : résolution DNS éventuelle → connexion TCP → protocole applicatif → fermeture.</div><p><b>Rapport :</b> décrivez la connexion sans divulguer d'informations personnelles ou d'adresses externes sensibles.</p>",

  ev: [
    { q: "Quel protocole garantit notamment la livraison ordonnée des données ?", o: ["TCP", "UDP", "ARP"], c: 0 },
    { q: "Quel paquet TCP commence normalement l'établissement d'une connexion ?", a: ["SYN"] },
    { q: "Quelle réponse suit normalement un SYN ?", a: ["SYN/ACK", "SYN ACK"] },
    { q: "Quel protocole est utilisé pour résoudre les noms de domaine ?", a: ["DNS"] },
    { q: "Quel protocole fournit généralement automatiquement une adresse IP à un client ?", a: ["DHCP"] },
    { q: "Quel protocole utilise le port 22 par défaut ?", a: ["SSH"] },
    { q: "Quel protocole est associé au port 443 ?", a: ["HTTPS"] },
    { q: "Quelle commande Linux affiche les sockets TCP/UDP en écoute ?", a: ["ss -tuln"] },
    { q: "Un port LISTEN signifie :", o: ["qu'un service attend des connexions", "que le disque est plein", "que le DNS est désactivé"], c: 0 },
    { q: "Un port ouvert signifie automatiquement que la machine est vulnérable.", o: ["Vrai", "Faux"], c: 1 }
  ]
},

5: {
  l: "<p>L'adressage IP permet d'identifier logiquement les interfaces et d'acheminer les paquets. Pour maîtriser la cybersécurité réseau, il faut être capable de lire une adresse IPv4, comprendre un masque et calculer un sous-réseau.</p><p>Une adresse IPv4 contient <b>32 bits</b>, représentés généralement par quatre octets.</p><pre>192.168.1.10/24</pre><p><b>/24</b> signifie que les 24 premiers bits représentent la partie réseau. Il reste 8 bits pour les hôtes.</p><table><tr><th>Adresse</th><th>Signification</th></tr><tr><td>192.168.1.0/24</td><td>Adresse réseau</td></tr><tr><td>192.168.1.1 → 192.168.1.254</td><td>Hôtes utilisables dans le modèle classique</td></tr><tr><td>192.168.1.255</td><td>Broadcast</td></tr></table><p>Les principales plages privées IPv4 sont :</p><pre>10.0.0.0/8\n172.16.0.0/12\n192.168.0.0/16</pre><p>Il faut également comprendre <b>gateway</b>, <b>NAT</b>, <b>broadcast</b>, <b>multicast</b> et IPv6.</p><div class='key'><b>Formule :</b> pour un réseau IPv4 classique, le nombre total d'adresses est 2<sup>nombre de bits hôtes</sup>. Dans de nombreux sous-réseaux traditionnels, les adresses réseau et broadcast ne sont pas attribuées à des hôtes.</div>",

  v: [
    ["IPv4","Adresse réseau de 32 bits"],
    ["IPv6","Adresse réseau de 128 bits"],
    ["CIDR","Notation indiquant la longueur du préfixe réseau, par exemple /24"],
    ["Subnet","Sous-réseau"],
    ["Subnet mask","Masque permettant de distinguer réseau et hôtes"],
    ["Network address","Adresse identifiant le réseau"],
    ["Broadcast","Adresse utilisée pour diffuser vers tous les hôtes d'un sous-réseau IPv4"],
    ["Gateway","Passerelle permettant notamment de joindre d'autres réseaux"],
    ["Private IP","Adresse IP destinée aux réseaux privés"],
    ["Public IP","Adresse routable sur Internet"],
    ["NAT","Traduction d'adresses réseau"],
    ["PAT","Traduction utilisant notamment les ports pour partager une adresse"],
    ["VLSM","Technique permettant d'utiliser des tailles de sous-réseaux différentes"],
    ["Prefix","Longueur du préfixe réseau"],
    ["Host","Machine ou interface utilisant une adresse réseau"]
  ],

  lab: "<p><b>Objectif :</b> analyser votre configuration réseau locale.</p><p><b>Windows</b></p><pre>ipconfig /all\nGet-NetIPAddress\nGet-NetIPConfiguration\nGet-NetRoute</pre><p><b>Linux</b></p><pre>ip addr\nip route\nip -br addr\nip route get 1.1.1.1</pre><div class='key'><b>Livrable :</b> relever l'adresse IPv4 locale, le préfixe ou masque, la passerelle et les serveurs DNS. Indiquer si l'adresse locale est privée ou publique.</div><p><b>Exercices de subnetting :</b></p><pre>192.168.1.0/24\n192.168.1.0/26\n10.10.0.0/16\n172.16.20.0/28</pre><p>Pour chacun, calculer l'adresse réseau, le broadcast, le nombre total d'adresses et le nombre d'hôtes utilisables selon le modèle classique.</p>",

  ex: [
    { q: "Une adresse IPv4 contient combien de bits ?", o: ["16", "32", "64"], c: 1 },
    { q: "Combien de bits restent pour les hôtes avec un préfixe /24 ?", o: ["4", "8", "24"], c: 1 },
    { q: "Quel bloc est privé ?", o: ["10.0.0.0/8", "8.8.8.0/24", "1.1.1.0/24"], c: 0 },
    { q: "Pour 192.168.1.0/24, quelle est l'adresse de broadcast classique ?", a: ["192.168.1.255"] },
    { q: "Pour 192.168.1.0/24, combien d'adresses totales ?", o: ["128", "256", "512"], c: 1 },
    { q: "Pour 192.168.1.0/24, combien d'hôtes utilisables dans le modèle classique ?", o: ["254", "255", "256"], c: 0 },
    { q: "Que signifie /16 ?", o: ["16 bits de préfixe réseau", "16 hôtes maximum", "16 octets"], c: 0 },
    { q: "La passerelle sert notamment à :", o: ["atteindre d'autres réseaux", "remplacer le CPU", "chiffrer les fichiers"], c: 0 }
  ],

  an: "<p><b>Scénario :</b> une entreprise dispose du réseau 10.20.0.0/16 et veut séparer ses services.</p><p>Elle demande :</p><pre>VLAN 10 : 100 utilisateurs\nVLAN 20 : 50 utilisateurs\nVLAN 30 : 20 serveurs\nVLAN 40 : 10 équipements\nVLAN 50 : 50 invités</pre><ol><li>Proposez un plan d'adressage.</li><li>Choisissez des préfixes adaptés.</li><li>Expliquez pourquoi la segmentation est intéressante en sécurité.</li><li>Indiquez où placer les règles de filtrage.</li></ol><div class='key'><b>Challenge :</b> réalisez ce plan avec le moins d'adresses gaspillées possible tout en conservant une marge raisonnable.</div><p><b>Rapport :</b> fournissez un tableau réseau / préfixe / plage / passerelle / usage.</p>",

  ev: [
    { q: "Une IPv4 contient :", o: ["32 bits", "64 bits", "128 bits"], c: 0 },
    { q: "Une IPv6 contient :", o: ["32 bits", "64 bits", "128 bits"], c: 2 },
    { q: "Quelle plage est privée ?", o: ["10.0.0.0/8", "11.0.0.0/8", "8.0.0.0/8"], c: 0 },
    { q: "Combien d'adresses contient un /24 ?", o: ["128", "256", "512"], c: 1 },
    { q: "Combien d'adresses contient un /26 ?", o: ["32", "64", "128"], c: 1 },
    { q: "Quelle est l'adresse réseau de 192.168.5.42/24 ?", a: ["192.168.5.0"] },
    { q: "Quelle est l'adresse broadcast de 192.168.5.42/24 ?", a: ["192.168.5.255"] },
    { q: "Quelle est la fonction principale d'une gateway ?", o: ["faire communiquer le réseau local avec d'autres réseaux", "stocker les fichiers", "attribuer les mots de passe"], c: 0 },
    { q: "NAT signifie :", a: ["Network Address Translation"] },
    { q: "Pourquoi utiliser plusieurs sous-réseaux en entreprise ?", o: ["segmenter les flux et limiter notamment les mouvements latéraux", "augmenter automatiquement la vitesse du CPU", "supprimer tous les firewalls"], c: 0 }
  ]
},

6: {
  l: "<p>Le <b>routage</b> détermine par où un paquet doit passer pour atteindre sa destination. Un routeur consulte généralement sa table de routage et choisit la route la plus spécifique correspondant à la destination.</p><p>Une table peut contenir :</p><pre>Réseau de destination\nPréfixe\nPasserelle / next-hop\nInterface\nMétrique</pre><p>On distingue notamment le routage <b>statique</b> et <b>dynamique</b>. Les protocoles dynamiques comme OSPF permettent aux routeurs d'échanger des informations afin de construire leurs tables.</p><h3>VLAN</h3><p>Un VLAN permet de créer plusieurs réseaux logiques sur une même infrastructure physique. Les communications entre VLAN nécessitent généralement un équipement ou une fonction de niveau 3.</p><h3>STP</h3><p>Le Spanning Tree Protocol aide à éviter les boucles de niveau 2 dans les réseaux Ethernet commutés.</p><div class='key'><b>Cybersécurité :</b> un bon routage et une bonne segmentation permettent de limiter les communications inutiles et de réduire la surface de déplacement d'un attaquant.</div>",

  v: [
    ["Routing","Routage : décision du chemin à suivre pour atteindre une destination"],
    ["Route","Entrée indiquant comment atteindre un réseau"],
    ["Routing table","Table de routage"],
    ["Next-hop","Prochain routeur vers lequel envoyer un paquet"],
    ["Static route","Route configurée manuellement"],
    ["Dynamic routing","Routage appris automatiquement via un protocole"],
    ["OSPF","Protocole de routage dynamique interne basé sur l'état des liens"],
    ["BGP","Protocole majeur d'échange de routes entre systèmes autonomes sur Internet"],
    ["VLAN","Réseau logique séparé au niveau de l'infrastructure Ethernet"],
    ["Trunk","Lien transportant plusieurs VLAN"],
    ["Access port","Port associé généralement à un seul VLAN"],
    ["STP","Protocole permettant notamment d'éviter les boucles Ethernet"],
    ["Metric","Valeur utilisée pour comparer des chemins"],
    ["Inter-VLAN routing","Routage permettant de communiquer entre VLAN"]
  ],

  lab: "<p><b>Objectif :</b> comprendre la table de routage de votre machine.</p><p><b>Windows</b></p><pre>route print\nGet-NetRoute</pre><p><b>Linux</b></p><pre>ip route\nip route get 8.8.8.8</pre><p>Identifiez :</p><ul><li>la route par défaut ;</li><li>le réseau local ;</li><li>l'interface utilisée ;</li><li>la passerelle par défaut.</li></ul><div class='key'><b>Livrable :</b> dessinez le chemin logique entre votre machine, votre passerelle et Internet.</div>",

  ex: [
    { q: "À quoi sert une table de routage ?", o: ["déterminer comment atteindre des réseaux", "stocker les mots de passe", "gérer la RAM"], c: 0 },
    { q: "Une route par défaut est généralement représentée par :", o: ["0.0.0.0/0 en IPv4", "255.255.255.255/32 uniquement", "127.0.0.1/32"], c: 0 },
    { q: "OSPF est :", o: ["un protocole de routage dynamique", "un protocole de chiffrement", "un antivirus"], c: 0 },
    { q: "Un VLAN permet notamment de :", o: ["segmenter logiquement un réseau", "augmenter la RAM", "remplacer DNS"], c: 0 },
    { q: "Un trunk peut transporter :", o: ["plusieurs VLAN", "uniquement un câble USB", "uniquement du trafic DNS"], c: 0 },
    { q: "STP sert notamment à :", o: ["éviter certaines boucles Ethernet", "chiffrer HTTPS", "attribuer des IP"], c: 0 },
    { q: "Quelle commande Linux affiche la table de routage ?", a: ["ip route"] },
    { q: "Quelle commande Windows classique affiche les routes ?", a: ["route print"] }
  ],

  an: "<p><b>Scénario :</b> une entreprise possède quatre réseaux :</p><pre>10.10.10.0/24 → utilisateurs\n10.10.20.0/24 → serveurs\n10.10.30.0/24 → administration\n10.10.40.0/24 → invités</pre><p>Les invités doivent accéder à Internet mais ne doivent pas pouvoir atteindre les serveurs.</p><ol><li>Comment organiser le routage ?</li><li>Où placer les règles de filtrage ?</li><li>Pourquoi une simple séparation par VLAN ne suffit-elle pas toujours ?</li><li>Comment vérifier qu'un invité ne peut pas atteindre un serveur ?</li></ol><div class='key'><b>Challenge :</b> dessinez l'architecture complète avec les VLAN, les passerelles, le firewall et les flux autorisés.</div>",

  ev: [
    { q: "La table de routage contient notamment :", o: ["des réseaux de destination et des chemins", "des mots de passe", "des fichiers utilisateurs"], c: 0 },
    { q: "Quelle route représente généralement la route IPv4 par défaut ?", a: ["0.0.0.0/0"] },
    { q: "OSPF permet notamment :", o: ["d'apprendre dynamiquement des routes", "de chiffrer les disques", "de filtrer les emails"], c: 0 },
    { q: "Un VLAN est :", o: ["une segmentation logique de niveau 2", "un antivirus", "un serveur DNS"], c: 0 },
    { q: "Un port trunk transporte généralement :", o: ["plusieurs VLAN", "un seul processus", "uniquement du trafic ICMP"], c: 0 },
    { q: "STP protège principalement contre :", o: ["les boucles de niveau 2", "les mots de passe faibles", "les virus"], c: 0 },
    { q: "Quelle commande Linux permet d'interroger la route vers une destination ?", a: ["ip route get 8.8.8.8", "ip route get"] },
    { q: "Pourquoi filtrer entre VLAN ?", o: ["pour contrôler les communications entre segments", "pour changer le CPU", "pour supprimer les adresses MAC"], c: 0 },
    { q: "Une route statique est :", o: ["configurée manuellement", "toujours apprise par OSPF", "une route DNS"], c: 0 },
    { q: "Le routage permet principalement :", o: ["d'acheminer des paquets entre réseaux", "de stocker les données", "de créer des utilisateurs"], c: 0 }
  ]
},

7: {
  l: "<p>L'analyse réseau consiste à observer les communications afin de comprendre le fonctionnement normal d'une infrastructure et de détecter les comportements anormaux.</p><p>Les outils essentiels sont <b>Wireshark</b>, <b>tcpdump</b>, <b>ss</b>, <b>netstat</b>, <b>ping</b>, <b>traceroute</b>, <b>dig</b> et <b>nslookup</b>.</p><h3>Wireshark</h3><p>Une capture contient des paquets. Pour chaque paquet, on peut notamment observer :</p><ul><li>source ;</li><li>destination ;</li><li>protocole ;</li><li>ports ;</li><li>flags TCP ;</li><li>taille ;</li><li>contenu visible lorsqu'il n'est pas chiffré.</li></ul><h3>Filtres utiles</h3><pre>dns\ntcp\nudp\nicmp\nhttp\ntls\nip.addr == 192.168.1.10\ntcp.port == 443</pre><div class='key'><b>Attention :</b> une adresse IP ou un port inhabituel ne signifie pas automatiquement qu'une attaque a lieu. L'analyse doit toujours tenir compte du contexte, de la fréquence, du rôle de la machine et des autres événements.</div>",

  v: [
    ["Packet","Unité de données observée sur le réseau"],
    ["Capture","Enregistrement du trafic réseau"],
    ["Wireshark","Analyseur graphique de paquets réseau"],
    ["tcpdump","Outil en ligne de commande de capture réseau"],
    ["Filter","Expression permettant de sélectionner certains paquets"],
    ["PCAP","Format courant de fichiers de capture réseau"],
    ["Sniffing","Observation du trafic réseau"],
    ["Flow","Flux de communication entre deux points"],
    ["Source","Origine d'une communication"],
    ["Destination","Cible d'une communication"],
    ["Payload","Données transportées par un paquet"],
    ["Flag","Indicateur présent notamment dans les en-têtes TCP"],
    ["Beaconing","Communications périodiques pouvant caractériser certains logiciels ou malwares"],
    ["Anomaly","Comportement qui s'écarte du comportement attendu"]
  ],

  lab: "<p><b>Objectif :</b> réaliser une capture sur votre propre machine ou dans un laboratoire autorisé.</p><p><b>Linux :</b></p><pre>sudo tcpdump -i any -c 100\nsudo tcpdump -i any port 53 -c 30</pre><p>Dans Wireshark, observez ensuite :</p><pre>dns\ntcp\nicmp\ntls\nip.addr == VOTRE_IP</pre><p>Identifiez pour plusieurs communications :</p><ul><li>IP source ;</li><li>IP destination ;</li><li>protocole ;</li><li>port ;</li><li>sens de communication.</li></ul><div class='key'><b>Livrable :</b> analysez 10 paquets ou flux et créez un tableau résumant ce que vous avez découvert.</div>",

  ex: [
    { q: "Quel outil permet d'analyser graphiquement des captures réseau ?", a: ["Wireshark"] },
    { q: "Quel outil Linux permet de capturer du trafic en ligne de commande ?", a: ["tcpdump"] },
    { q: "Quel filtre Wireshark affiche les paquets DNS ?", a: ["dns"] },
    { q: "Quel filtre affiche le trafic TCP ?", a: ["tcp"] },
    { q: "Que représente généralement l'adresse source ?", o: ["l'origine de la communication", "toujours le serveur", "le port destination"], c: 0 },
    { q: "Un PCAP est :", o: ["un fichier de capture réseau", "un protocole de chiffrement", "un système de fichiers"], c: 0 },
    { q: "Quel filtre permet de rechercher une IP précise ?", a: ["ip.addr == 192.168.1.10", "ip.addr"] },
    { q: "Le payload correspond généralement :", o: ["aux données transportées", "à l'adresse MAC uniquement", "au câble réseau"], c: 0 }
  ],

  an: "<p><b>Scénario SOC :</b> une station de travail communique toutes les 60 secondes avec la même adresse externe. Chaque communication est courte et suit un rythme presque identique.</p><ol><li>Pourquoi ce comportement mérite-t-il une investigation ?</li><li>Quelles données supplémentaires collecteriez-vous ?</li><li>Comment distinguer un service légitime d'un comportement malveillant ?</li><li>Quels logs comparer avec la capture réseau ?</li></ol><div class='key'><b>Challenge :</b> dans une capture de laboratoire, cherchez un comportement anormal puis construisez une hypothèse. Ne concluez jamais « malware » sans éléments suffisants.</div><p><b>Rapport :</b> fournissez les preuves, votre hypothèse, les éléments qui la soutiennent et ceux qui pourraient l'infirmer.</p>",

  ev: [
    { q: "Quel outil permet de lire visuellement un fichier PCAP ?", a: ["Wireshark"] },
    { q: "Quel outil permet de capturer du trafic en CLI sous Linux ?", a: ["tcpdump"] },
    { q: "Quel filtre Wireshark sélectionne les requêtes DNS ?", a: ["dns"] },
    { q: "Quel filtre sélectionne le trafic vers un port TCP précis ?", a: ["tcp.port == 443"] },
    { q: "Un PCAP contient :", o: ["des données de capture réseau", "des comptes Windows", "des clés privées uniquement"], c: 0 },
    { q: "Pourquoi un trafic périodique peut-il être intéressant en investigation ?", o: ["il peut correspondre à du beaconing ou à un service légitime", "il prouve toujours une attaque", "il signifie toujours DNS"], c: 0 },
    { q: "Quel protocole est utilisé par ping ?", a: ["ICMP"] },
    { q: "Quelle commande permet d'afficher les connexions et sockets Linux ?", a: ["ss"] },
    { q: "Un flux réseau inhabituel est :", o: ["un indicateur à examiner", "une preuve automatique d'attaque", "toujours normal"], c: 0 },
    { q: "Quelle information permet de savoir qui communique avec qui ?", o: ["source et destination", "uniquement le TTL", "uniquement le numéro de séquence"], c: 0 }
  ]
},

e2: {
  ev: [
    { q: "Combien de couches possède le modèle OSI ?", o: ["5", "7", "8"], c: 1, p: 1 },
    { q: "À quelle couche appartient principalement TCP ?", o: ["2", "3", "4"], c: 2, p: 1 },
    { q: "À quelle couche appartient principalement IP ?", o: ["2", "3", "4"], c: 1, p: 1 },
    { q: "Quelle couche utilise principalement les adresses MAC ?", o: ["1", "2", "3"], c: 1, p: 1 },
    { q: "Quel protocole est orienté connexion ?", o: ["TCP", "UDP", "ICMP"], c: 0, p: 1 },
    { q: "Quel est le bon ordre du handshake TCP ?", o: ["ACK → SYN → SYN/ACK", "SYN → SYN/ACK → ACK", "SYN/ACK → ACK → SYN"], c: 1, p: 1 },
    { q: "Quel protocole traduit notamment les noms de domaine en adresses IP ?", a: ["DNS"], p: 1 },
    { q: "Quel protocole attribue automatiquement une configuration IP ?", a: ["DHCP"], p: 1 },
    { q: "Quel port est associé par défaut à HTTPS ?", a: ["443"], p: 1 },
    { q: "Quel port est associé par défaut à SSH ?", a: ["22"], p: 1 },
    { q: "Combien d'adresses contient un réseau IPv4 /24 ?", a: ["256"], p: 1 },
    { q: "Combien d'adresses contient un réseau IPv4 /26 ?", a: ["64"], p: 1 },
    { q: "Quelle est l'adresse réseau de 192.168.10.42/24 ?", a: ["192.168.10.0"], p: 1 },
    { q: "Quelle est l'adresse broadcast de 192.168.10.42/24 ?", a: ["192.168.10.255"], p: 1 },
    { q: "Donnez une plage IPv4 privée.", a: ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"], p: 1 },
    { q: "Quelle commande Linux affiche la table de routage ?", a: ["ip route"], p: 1 },
    { q: "Quel protocole de routage dynamique est basé sur l'état des liens et très utilisé en entreprise ?", a: ["OSPF"], p: 1 },
    { q: "À quoi sert un VLAN ?", a: ["segmenter logiquement un réseau", "segmentation réseau", "séparer logiquement le réseau"], p: 1 },
    { q: "Quel outil permet d'analyser graphiquement les paquets réseau ?", a: ["Wireshark"], p: 1 },
    { q: "Quel outil Linux permet de capturer des paquets en ligne de commande ?", a: ["tcpdump"], p: 1 },
    { q: "Quel filtre Wireshark permet d'afficher les paquets DNS ?", a: ["dns"], p: 1 },
    { q: "Que signifie LISTEN pour un socket TCP ?", o: ["un service attend des connexions", "la connexion est obligatoirement malveillante", "le serveur est éteint"], c: 0, p: 1 },
    { q: "Quelle est la fonction principale d'une passerelle par défaut ?", a: ["permettre d'atteindre d'autres réseaux", "atteindre d'autres réseaux"], p: 1 },
    { q: "NAT signifie :", a: ["Network Address Translation"], p: 1 },
    { q: "Une adresse IPv6 contient combien de bits ?", o: ["32", "64", "128"], c: 2, p: 1 },
    { q: "Quel protocole permet notamment de tester la connectivité avec ping ?", a: ["ICMP"], p: 1 },
    { q: "STP sert principalement à :", o: ["éviter les boucles de niveau 2", "chiffrer HTTPS", "attribuer des adresses IP"], c: 0, p: 1 },
    { q: "Une route statique est :", o: ["configurée manuellement", "toujours apprise automatiquement", "une règle DNS"], c: 0, p: 1 },
    { q: "Pourquoi segmenter un réseau en plusieurs VLAN ?", o: ["contrôler les flux et limiter notamment les mouvements latéraux", "augmenter la RAM", "supprimer les ports"], c: 0, p: 1 },
    { q: "Quelle commande Windows affiche les routes ?", a: ["route print"], p: 1 }
  ]
}
  }
};
