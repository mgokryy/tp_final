# TP Déploiement automatisé d’une application web

## Description du projet

Ce projet a pour objectif de mettre en place une chaîne complète de déploiement d’une application web en utilisant des outils DevOps modernes.

L’application développée est une application **full stack** composée de :
- un **frontend React**
- un **backend Node.js (Express)**
- une **base de données MySQL**

Fonctionnalités principales :
- un endpoint `/health` pour vérifier que le backend fonctionne
- une API `/api/users` permettant de récupérer des utilisateurs
- un frontend permettant d’afficher les utilisateurs via un bouton

L’application a été :
- conteneurisée avec Docker
- orchestrée avec Docker Compose
- déployée sur Kubernetes
- hébergée sur une VM Azure

---

## Explication du pipeline CI/CD

Une pipeline CI/CD a été mise en place avec **GitHub Actions** afin d’automatiser les différentes étapes du projet.

### Déroulement de la pipeline

À chaque `git push` sur la branche principale :

1. **Installation des dépendances**
   - Installation des dépendances Node.js du backend

2. **Exécution des tests**
   - Lancement des tests avec `npm test`
   - Si les tests échouent → la pipeline s’arrête

3. **Build des images Docker**
   - Construction de l’image backend
   - Construction de l’image frontend

4. **Push des images sur Docker Hub**
   - Envoi des images vers Docker Hub

5. **Déploiement automatique sur la VM (SSH)**
   - Connexion à la VM Azure via SSH
   - `git pull` pour récupérer le code à jour
   - `kubectl apply -f k8s/` pour mettre à jour Kubernetes
   - Redémarrage des pods (`rollout restart`)

### Gestion des secrets

Les informations sensibles sont stockées dans les **GitHub Secrets** :
- identifiants Docker Hub
- clé SSH de la VM
- IP de la VM
- utilisateur SSH

Cela permet de sécuriser les accès sans exposer de données sensibles dans le code.

---

## Étapes de déploiement

### 1. Déploiement en local

Lancement de l’application avec Docker Compose :

```bash
docker compose up --build
````

Vérifications :

* frontend accessible
* backend accessible via `/health`
* communication avec MySQL

---

### 2. Conteneurisation

Création de Dockerfile pour :

* le backend
* le frontend

Build et exécution des conteneurs Docker.

---

### 3. Orchestration avec Docker Compose

Mise en place des services :

* backend
* frontend
* MySQL
* phpMyAdmin

Validation de la communication entre les services.

---

### 4. Déploiement Kubernetes (local)

* Création des fichiers YAML :

  * Deployments
  * Services (NodePort)

* Déploiement avec Minikube :

```bash
kubectl apply -f k8s/
```

---

### 5. Déploiement sur une VM Azure

* Création d’une VM Ubuntu
* Connexion en SSH
* Installation de :

  * Docker
  * Kubernetes (K3s)

Déploiement de l’application :

```bash
kubectl apply -f k8s/
```

Application accessible via :

```
http://IP_VM:PORT
```

---

### 6. Déploiement automatique

Mise en place d’un déploiement automatique via GitHub Actions :

À chaque push :

* build des images Docker
* push sur Docker Hub
* connexion SSH à la VM
* mise à jour Kubernetes

---

## Difficultés rencontrées

### Problèmes avec Docker

Une difficulté importante a été liée à Docker :

* Docker Desktop ne se lançait pas correctement
* problèmes de configuration avec WSL2 et la virtualisation
* lenteurs importantes lors de l’exécution des commandes Docker

Solution :

* activation de la virtualisation dans le BIOS
* configuration de WSL2
* redémarrages et ajustements système

---

### Ports déjà utilisés

Lors du lancement avec Docker Compose :

* certains ports étaient déjà utilisés
* les conteneurs ne pouvaient pas démarrer

Solution :

* arrêter les processus existants
* libérer les ports
* relancer les services

---

### Connexion MySQL

Le backend ne parvenait pas à se connecter à MySQL :

* erreur `ECONNREFUSED`
* base de données pas encore prête

Solution :

* attendre le démarrage complet de MySQL
* vérifier les variables d’environnement
* corriger l’host (nom du service Docker/Kubernetes)

---

### Problème de mise à jour des images Kubernetes

Le frontend ne se mettait pas à jour :

* Kubernetes utilisait une ancienne image Docker (`latest` en cache)

Solution :

* suppression des pods
* redémarrage des deployments
* ajout de `imagePullPolicy: Always`

---

### Problème d’URL frontend

Le frontend appelait une URL locale :

```
http://127.0.0.1
```

Ce qui ne fonctionnait pas depuis la VM.

Solution :

* mise à jour de l’URL vers l’IP publique de la VM
* rebuild et redéploiement du frontend

---

### Problème de réseau Azure

L’application n’était pas accessible depuis Internet :

* les ports Kubernetes n’étaient pas ouverts

Solution :

* ajout de règles entrantes Azure
* ouverture de la plage :

```
30000-32767
```

---

### Perte des données MySQL

Les données disparaissaient après redéploiement :

* absence de volume persistant

Solution :

* recréer la base manuellement
* identifier une amélioration possible :

  * ajout de PersistentVolume et PersistentVolumeClaim

---

## Conclusion

Ce projet a permis de mettre en place une chaîne complète de déploiement DevOps :

* conteneurisation avec Docker
* orchestration avec Docker Compose
* déploiement avec Kubernetes
* automatisation avec GitHub Actions
* déploiement sur une VM cloud

Il met en évidence l’importance de :

* l’automatisation
* la gestion des environnements
* la maîtrise des outils DevOps modernes

