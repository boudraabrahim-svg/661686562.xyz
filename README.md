# Guide de Déploiement GitHub Pages & Domaine 661686562.xyz

**Projet :** Site Vitrine Entreprise BOUCHAMA HEITHEM (Location & Vente de Groupes Électrogènes)  
**Domaine Cible :** `661686562.xyz`  

---

## 1. Structure des Fichiers Prêts à Publier

Le dossier `website_vitrine` contient l'intégralité du site prêt pour GitHub Pages :

* `index.html` : Page principale responsive avec header, catalogue, section ISO 9001 et calculateur de devis.
* `style.css` : Design system sombre industriel avec animations et typographie moderne.
* `script.js` : Calculateur de devis instantané et liens WhatsApp/Email automatisés.
* `CNAME` : Contient l'adresse du domaine personnalisé `661686562.xyz`.
* `assets/hero_genset.jpg` : Photographie HD professionnelle du groupe électrogène.

---

## 2. Équivalence Étape par Étape pour Publier sur GitHub

### Étape 1 : Créer le Dépôt sur GitHub
1. Connectez-vous à votre compte **GitHub**.
2. Cliquez sur **New Repository** (Nouveau dépôt).
3. Nommez le dépôt (ex: `site-vitrine-bouchama` ou `661686562.xyz`).
4. Choisissez le statut **Public**.
5. N'initialisez PAS avec un README (les fichiers sont déjà prêts dans `website_vitrine`).

### Étape 2 : Envoyer les Fichiers sur GitHub
Dans votre terminal local (ou PowerShell) dans le dossier `website_vitrine` :

```bash
git init
git add .
git commit -m "Initialisation site vitrine BOUCHAMA HEITHEM 661686562.xyz"
git branch -M main
git remote add origin https://github.com/VOTRE_NOM_UTILISATEUR_GITHUB/NOM_DU_DEPOT.git
git push -u origin main
```

---

## 3. Activer GitHub Pages avec le Domaine `661686562.xyz`

1. Sur votre dépôt GitHub, allez dans l'onglet **Settings** (Paramètres).
2. Dans le menu de gauche, cliquez sur **Pages**.
3. Dans la section **Build and deployment** :
   * **Source** : Sélectionner `Deploy from a branch`.
   * **Branch** : Choisir `main` et le dossier `/ (root)`, puis cliquer sur **Save**.
4. Dans la section **Custom domain** :
   * Saisissez `661686562.xyz`.
   * Cochez la case **Enforce HTTPS** (sécurisation SSL gratuite fournie par GitHub).

---

## 4. Configuration DNS chez votre Registrar (Où vous avez acheté 661686562.xyz)

Connectez-vous à votre espace client chez votre fournisseur de nom de domaine (Namecheap, GoDaddy, Hostinger, Cloudflare, etc.) et configurez la zone DNS comme suit :

### Enregistrements A (Pointez vers les serveurs de GitHub Pages) :
Créer 4 enregistrements de type **A** pour `@` (ou nom d'hôte vide) :
* Type : `A` | Hôte : `@` | Valeur : `185.199.108.153`
* Type : `A` | Hôte : `@` | Valeur : `185.199.109.153`
* Type : `A` | Hôte : `@` | Valeur : `185.199.110.153`
* Type : `A` | Hôte : `@` | Valeur : `185.199.111.153`

### Enregistrement CNAME (Pour les sous-domaines www) :
* Type : `CNAME` | Hôte : `www` | Valeur : `VOTRE_NOM_UTILISATEUR.github.io`

---

## 5. Résultat
Après une propagation DNS de 5 à 15 minutes, votre site sera officiellement en ligne, sécurisé en HTTPS à l'adresse :  
👉 **https://661686562.xyz**
