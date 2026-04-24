# Projet Déploiement automatisé d’une application web

---

## Description du projet

Ce projet a pour objectif de mettre en place une chaîne complète de déploiement pour une application web full stack.

L’application est composée de :

- Frontend : React
- Backend : Node.js (Express)
- Base de données : MySQL

Fonctionnalités principales :

- Endpoint `/health` pour vérifier que le backend fonctionne
- Endpoint `/api/users` pour récupérer des utilisateurs depuis la base de données
- Communication entre frontend, backend et base de données

---

## Pipeline CI/CD (GitHub Actions)

La pipeline est déclenchée automatiquement à chaque `git push`.

### Étapes :

```text
git push
   ↓
1. Installation des dépendances
   ↓
2. Lancement des tests
   ↓
3. Build des images Docker
   ↓
4. Push sur Docker Hub
   ↓
5. Connexion SSH à la VM Azure
   ↓
6. Déploiement Kubernetes (kubectl apply)
````

### Secrets utilisés :

Dans GitHub :

* `DOCKER_USERNAME`
* `DOCKER_PASSWORD`
* `SSH_HOST`
* `SSH_USER`
* `SSH_KEY`

Aucun secret n’est stocké dans le code.

---

## Docker

### Build des images en local

```bash
docker build -t tp_final-backend ./backend
docker build -t tp_final-frontend ./frontend
```

### Lancer avec Docker Compose

```bash
docker-compose up --build
```

Permet de lancer :

* frontend
* backend
* mysql
* phpmyadmin

---

## Kubernetes (local avec Minikube)

### Démarrer Minikube

```bash
minikube start
```

### Déployer l'application

```bash
kubectl apply -f k8s/
```

### Vérifier

```bash
kubectl get pods
kubectl get svc
```

---

## Déploiement sur VM Azure

### 1. Connexion à la VM

```bash
ssh -i C:\Users\lolao\Downloads\tp-mgokry_key.pem azureuser@20.39.233.140
```

---

### 2. Installer Docker

```bash
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
```

---

### 3. Installer K3s (Kubernetes léger)

```bash
curl -sfL https://get.k3s.io | sh -
```

Configurer kubectl :

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
sudo chmod 644 /etc/rancher/k3s/k3s.yaml
```

Vérifier :

```bash
kubectl get nodes
```

---

### 4. Récupérer le projet

```bash
git clone https://github.com/mgokryy/tp_final.git
cd tp_final
```

---

### 5. Déployer sur Kubernetes

```bash
kubectl apply -f k8s/
```

---

### 6. Vérifier les pods

```bash
kubectl get pods
```

---

### 7. Vérifier les services

```bash
kubectl get svc
```

Exemple :

```text
frontend-service   NodePort   5173:31260
backend-service    NodePort   5000:30383
```

---

### 8. Accéder à l'application

Dans le navigateur :

Frontend :

```
http://20.39.233.140:31260
```

Backend :

```
http://20.39.233.140:30383/api/users
```

---

## Configuration réseau Azure

Dans Azure :

* Aller dans **Network Security Group**
* Ajouter des règles **Inbound**

Ports à ouvrir :

* `30000-32767` (NodePort Kubernetes)

Sinon l’application n’est pas accessible depuis l’extérieur.

---

## Variables d’environnement

Exemples :

Backend :

```env
DB_HOST=mysql-service
DB_USER=root
DB_PASSWORD=example
DB_NAME=users_db
```

Frontend :

```env
VITE_API_URL=http://20.39.233.140:30383
```

---

## Difficultés rencontrées

La principale difficulté a été liée à Docker Desktop.

Au début, Docker ne se lançait pas correctement, ce qui empêchait :

* le build des images
* le démarrage des conteneurs
* les tests en local

Pour résoudre ce problème :

* redémarrage de Docker Desktop
* vérification de la configuration WSL
* relance complète des conteneurs

Une fois Docker fonctionnel, le reste du projet a pu être mis en place progressivement.

---

## Résultat final

✔ Application fonctionnelle en local
✔ Fonctionne avec Docker Compose
✔ Déployée sur Kubernetes
✔ Déployée sur une VM Azure
✔ Pipeline CI/CD automatique
✔ Mise à jour automatique après chaque push

---
