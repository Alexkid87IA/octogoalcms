# Guide Complet - Octogoal CMS v2.1

> Documentation exhaustive de toutes les améliorations du CMS Sanity pour Octogoal Media.
> Mise à jour le 12 janvier 2026 - **Intégration API-Football avec recherche automatique**

---

## Table des matières

1. [Vue d'ensemble des améliorations](#1-vue-densemble-des-améliorations)
2. [Nouveaux schémas de documents](#2-nouveaux-schémas-de-documents)
3. [Recherche automatique API-Football](#3-recherche-automatique-api-football) **NOUVEAU v2.1**
4. [Blocs éditeur enrichis](#4-blocs-éditeur-enrichis)
5. [Schémas améliorés](#5-schémas-améliorés)
6. [Structure du Studio](#6-structure-du-studio)
7. [Plugin Media Library](#7-plugin-media-library)
8. [Requêtes GROQ utiles](#8-requêtes-groq-utiles)
9. [Exemples d'utilisation concrets](#9-exemples-dutilisation-concrets)
10. [Bonnes pratiques](#10-bonnes-pratiques)

---

## 1. Vue d'ensemble des améliorations

### Résumé des nouveautés

| Catégorie | Avant | Après |
|-----------|-------|-------|
| Types de documents | 7 | 10 (+Player, +Club, +Homepage) |
| Blocs éditeur | 6 | 14 (+8 blocs) |
| Champs Category | 3 | 11 |
| Champs Author | 4 | 15 |
| Champs Tag | 2 | 10 |
| Plugins | 2 | 3 (+Media) |

### Fichiers créés/modifiés

```
schemaTypes/
├── article.js          ✏️ Modifié (playerLink, clubLink, matchInfo)
├── author.js           ✏️ Modifié (réseaux sociaux, rôles, expertise)
├── category.js         ✏️ Modifié (icônes, couleurs, SEO)
├── tag.js              ✏️ Modifié (slug, types, liens)
├── player.js           🆕 Créé → ✏️ Simplifié v2.1 (API-Football)
├── club.js             🆕 Créé → ✏️ Simplifié v2.1 (API-Football)
├── homepage.js         🆕 Créé (contrôle éditorial homepage)
├── table.js            🆕 Créé (tableaux dans contenu)
├── blockContent.js     ✏️ Modifié (+8 blocs)
├── index.js            ✏️ Modifié (exports)
└── objects/
    ├── playerLink.js       🆕 v2.1 - Lien joueur avec recherche API
    ├── clubLink.js         🆕 v2.1 - Lien club avec recherche API
    ├── callout.js          🆕 Alertes/callouts
    ├── styledQuote.js      🆕 Citations stylées
    ├── statsCard.js        🆕 Cartes de statistiques
    ├── playerComparison.js 🆕 Comparaison joueurs
    ├── imageGallery.js     🆕 Galeries d'images
    ├── ctaButton.js        🆕 Boutons CTA
    ├── spoiler.js          🆕 Blocs spoiler
    └── accordion.js        🆕 Accordéons/FAQ

components/                 🆕 v2.1 - Composants custom
├── PlayerReferenceInput.jsx  🆕 Recherche joueurs API-Football
└── ClubReferenceInput.jsx    🆕 Recherche clubs API-Football

deskStructure.js        🆕 Structure personnalisée du Studio
sanity.config.js        ✏️ Modifié (plugins, structure)
sanity.cli.js           ✏️ v2.1 - Proxy Vite pour API-Football
```

---

## 2. Nouveaux schémas de documents

### 2.1 Player (Fiche Joueur) - SIMPLIFIÉ v2.1

> **Philosophie v2.1** : Les stats et infos techniques (taille, poids, stats carrière, etc.) sont récupérées automatiquement via API-Football sur le frontend. Le CMS stocke uniquement le **contenu éditorial exclusif Octogoal**.

Le schéma `player` est désormais **léger** et focalisé sur le contenu éditorial.

#### Accès dans le Studio
`Joueurs & Clubs > Tous les joueurs > + Créer`

#### Champs disponibles

**Identification (pour lier à l'API)**
| Champ | Description | Exemple |
|-------|-------------|---------|
| `name` | Nom du joueur | Kylian Mbappé |
| `apiFootballId` | ID API-Football | 278 |

> **Note** : L'ID API-Football est automatiquement récupéré lors de la recherche (voir section 3).

**Contenu éditorial exclusif Octogoal**
| Champ | Description |
|-------|-------------|
| `customBio` | Présentation Octogoal (notre vision du joueur) |
| `playingStyle` | Description du style de jeu |
| `strengths` | Points forts (max 5) |
| `weaknesses` | Points faibles (max 5) |
| `funFacts` | Anecdotes amusantes |
| `famousQuotes` | Citations célèbres |
| `octogoalVerdict` | Notre verdict final sur le joueur |

**Flags éditoriaux**
| Champ | Description |
|-------|-------------|
| `isPepite` | Pépite / jeune talent à suivre |
| `isLegend` | Joueur légendaire |
| `isFeatured` | Mis en avant sur la page joueurs |

**Liens avec le contenu**
| Champ | Description |
|-------|-------------|
| `relatedArticles` | Articles Octogoal parlant de ce joueur (max 10) |
| `tags` | Tags associés |

#### Exemple de création d'une fiche joueur

```
1. Aller dans "Joueurs & Clubs" > "Tous les joueurs"
2. Cliquer sur "+ Créer"
3. Remplir les infos :
   - Nom: "Kylian Mbappé"
   - API-Football ID: 278 (récupéré auto via la recherche)

4. Ajouter le contenu éditorial :
   - Présentation: "Le prodige français, capable de changer
     un match à lui seul..."
   - Style de jeu: "Vitesse explosive, dribble en percussion,
     finition clinique..."
   - Points forts: Vitesse, Dribble, Finition
   - Points faibles: Jeu dos au but, Jeu de tête
   - Fun facts: "A refusé le Real Madrid à 14 ans pour rester à Monaco"
   - Verdict: "Le meilleur joueur français de sa génération"

5. Cocher les flags :
   - ✅ Joueur mis en avant
   - ❌ Pépite (il a plus de 23 ans)
   - ❌ Légende (pas encore!)

6. Publier
```

> **Les stats (buts, passes, matchs, etc.) sont récupérées automatiquement via API-Football sur le frontend grâce à l'`apiFootballId`.**

---

### 2.2 Club (Fiche Club) - SIMPLIFIÉ v2.1

> **Philosophie v2.1** : Les stats, effectif, classement, etc. sont récupérés automatiquement via API-Football sur le frontend. Le CMS stocke uniquement le **contenu éditorial exclusif Octogoal**.

Le schéma `club` est désormais **léger** et focalisé sur le contenu éditorial.

#### Accès dans le Studio
`Joueurs & Clubs > Tous les clubs > + Créer`

#### Champs disponibles

**Identification (pour lier à l'API)**
| Champ | Description | Exemple |
|-------|-------------|---------|
| `name` | Nom du club | Paris Saint-Germain |
| `apiFootballId` | ID API-Football | 85 |
| `slug` | Slug URL | paris-saint-germain |

> **Note** : L'ID API-Football est automatiquement récupéré lors de la recherche (voir section 3).

**Flags éditoriaux**
| Champ | Description |
|-------|-------------|
| `isTopClub` | Club majeur européen |
| `isFeatured` | Mis en avant sur la page clubs |

**Contenu éditorial exclusif Octogoal**
| Champ | Description |
|-------|-------------|
| `customBio` | Présentation Octogoal (notre vision du club) |
| `history` | Résumé de l'histoire du club |
| `rivalries` | Rivalités (El Clasico, Derby, etc.) |
| `funFacts` | Anecdotes exclusives Octogoal |
| `octogoalVerdict` | Notre avis sur le club |

**Liens avec le contenu**
| Champ | Description |
|-------|-------------|
| `relatedArticles` | Articles Octogoal parlant de ce club (max 10) |
| `tags` | Tags associés |

#### Exemple de création d'une fiche club

```
1. Aller dans "Joueurs & Clubs" > "Tous les clubs"
2. Cliquer sur "+ Créer"
3. Remplir les infos :
   - Nom: "Paris Saint-Germain"
   - API-Football ID: 85 (récupéré auto via la recherche)
   - Slug: paris-saint-germain (généré auto)

4. Cocher les flags :
   - ✅ Top club européen
   - ✅ Mis en avant

5. Ajouter le contenu éditorial :
   - Présentation: "Le club de la capitale, devenu un géant
     européen depuis le rachat par QSI en 2011..."
   - Histoire: "Fondé en 1970 de la fusion du Paris FC et
     du Stade Saint-Germain..."
   - Rivalités: "OM (Le Classique)", "OL", "Marseille"
   - Fun facts: "Le PSG n'a jamais gagné la Champions League
     malgré ses investissements colossaux"
   - Verdict: "Un club ambitieux qui cherche encore sa
     consécration européenne"

6. Publier
```

> **Les stats (classement, effectif, matchs, etc.) sont récupérées automatiquement via API-Football sur le frontend grâce à l'`apiFootballId`.**

---

### 2.3 Homepage (Contrôle éditorial)

Le schéma `homepage` est un **singleton** (un seul document) qui contrôle toute la page d'accueil.

#### Accès dans le Studio
`🏠 Homepage` (tout en haut de la sidebar)

#### Onglet "Une principale" (Hero)

| Champ | Description |
|-------|-------------|
| `heroArticle` | Article principal à la une |
| `heroStyle` | Style d'affichage (fullwidth, split, grid, slider) |
| `heroSecondaryArticles` | Articles secondaires (max 4) |
| `showHeroVideo` | Afficher la vidéo si l'article en a une |

**Exemple de configuration du Hero :**
```
- Article principal: "Mbappé claque un triplé face à City"
- Style: "Split (article + sidebar)"
- Articles secondaires:
  1. "Mercato: Les dernières rumeurs"
  2. "Ligue 1: Le classement après la J20"
  3. "Interview exclusive de Deschamps"
```

#### Onglet "Tendances"

| Champ | Description |
|-------|-------------|
| `trendingTitle` | Titre de la section |
| `trendingMode` | Manuel / Auto (isTrending) / Plus vus / Plus récents |
| `trendingArticles` | Articles sélectionnés (si mode manuel) |
| `trendingCount` | Nombre d'articles (3-12) |
| `trendingStyle` | Liste numérotée / Grille / Carousel |

**Exemple :**
```
- Titre: "🔥 Trending"
- Mode: "Automatique (isTrending=true)"
- Nombre: 6
- Style: "Liste numérotée"
```

#### Onglet "Sections"

Crée des sections personnalisées pour la homepage.

| Champ | Description |
|-------|-------------|
| `title` | Titre de la section |
| `sectionType` | Type (catégorie, sous-cat, manuel, joueurs, clubs, émissions) |
| `category` | Catégorie à afficher |
| `itemCount` | Nombre d'éléments |
| `layout` | Grille 3/4 cols, liste, carousel, featured-grid |
| `backgroundColor` | Couleur de fond |
| `showMoreLink` | Lien "Voir plus" |
| `order` | Ordre d'affichage |

**Exemple de sections :**
```
Section 1:
- Titre: "Actus Ligue 1"
- Type: "Sous-catégorie"
- Sous-catégorie: "Ligue 1"
- Nombre: 6
- Layout: "Grille 3 colonnes"
- Ordre: 1

Section 2:
- Titre: "Nos pépites à suivre"
- Type: "Joueurs mis en avant"
- Nombre: 4
- Layout: "Carousel"
- Ordre: 2

Section 3:
- Titre: "Tops & Listes"
- Type: "Catégorie"
- Catégorie: "Formats Octogoal"
- Nombre: 4
- Layout: "Featured + grille"
- Ordre: 3
```

#### Onglet "Sidebar"

Configure les widgets de la sidebar.

| Type | Description |
|------|-------------|
| `standings` | Classement d'un championnat (ID API) |
| `pepites` | Pépites du moment |
| `player-of-day` | Joueur du jour (sélection manuelle) |
| `matches` | Matchs du jour |
| `upcoming-matches` | Prochains matchs |
| `newsletter` | Formulaire inscription newsletter |
| `social` | Liens réseaux sociaux |
| `ad` | Espace publicitaire |

**Exemple :**
```
Widget 1:
- Titre: "Classement Ligue 1"
- Type: "standings"
- ID Championnat: 61
- Ordre: 1

Widget 2:
- Titre: "Joueur du jour"
- Type: "player-of-day"
- Joueur: → Mbappé
- Ordre: 2

Widget 3:
- Titre: "Newsletter"
- Type: "newsletter"
- Ordre: 3
```

#### Onglet "Alertes & Breaking"

**Breaking News**
| Champ | Description |
|-------|-------------|
| `isActive` | Activer/désactiver |
| `text` | Texte court (max 150 car.) |
| `linkedArticle` | Article lié |
| `style` | Rouge/Orange/Bleu/Vert |
| `expiresAt` | Date d'expiration auto |

**Exemple :**
```
- Actif: ✅
- Texte: "OFFICIEL: Mbappé prolonge jusqu'en 2030!"
- Article: → [Article lié]
- Style: "Rouge urgent"
- Expire: 2026-01-13 à 00:00
```

**Ticker défilant**
```
- Actif: ✅
- Éléments:
  1. ⚽ "PSG 3-0 City" → /article/psg-city
  2. ✈️ "Mercato: Salah vers l'Arabie?" → /article/salah-mercato
  3. 🔥 "Haaland blessé 3 semaines" → /article/haaland-blessure
- Vitesse: "Normal"
```

**Popup promotionnel**
```
- Actif: ✅
- Titre: "Rejoins la communauté Octogoal!"
- Contenu: "Abonne-toi à notre newsletter..."
- Bouton: "Je m'inscris"
- Lien: /newsletter
- Délai: 5 secondes
- Afficher une seule fois: ✅
```

---

## 3. Recherche automatique API-Football (NOUVEAU v2.1)

### 3.1 Concept

La v2.1 introduit une fonctionnalité majeure : **la recherche automatique de joueurs et clubs via API-Football**. Plus besoin de connaître les ID API par coeur !

**Avant v2.1 :**
```
1. Aller sur API-Football
2. Chercher l'ID du joueur (ex: Mbappé = 278)
3. Revenir dans Sanity
4. Saisir manuellement l'ID
```

**Avec v2.1 :**
```
1. Taper le nom du joueur/club
2. Sélectionner dans la liste
3. L'ID et la fiche sont créés automatiquement!
```

### 3.2 Où utiliser la recherche automatique

La recherche automatique est disponible dans les champs suivants :

| Champ | Localisation | Usage |
|-------|--------------|-------|
| **Joueurs concernés** | Article | Lier des joueurs à un article |
| **Clubs concernés** | Article | Lier des clubs à un article |
| **Équipe domicile** | Article > Infos du match | Pour les analyses de matchs |
| **Équipe extérieur** | Article > Infos du match | Pour les analyses de matchs |

### 3.3 Comment ça marche - Joueurs

#### Étape 1 : Accéder au champ
Dans un article, descends jusqu'à **"Joueurs concernés"**.

#### Étape 2 : Rechercher
1. Clique sur **"+ Ajouter un joueur"**
2. Tape au moins 3 caractères du nom (ex: "mba")
3. La recherche s'effectue en parallèle dans :
   - **Sanity** : Joueurs déjà créés dans le CMS
   - **API-Football** : Tous les joueurs des 5 grands championnats

#### Étape 3 : Sélectionner
Les résultats s'affichent en 2 catégories :

```
📋 Joueurs existants (CMS)
├── Kylian Mbappé (déjà créé)
└── ...

🌐 Résultats API-Football
├── Kylian Mbappé - Real Madrid (ID: 278)
├── Marcus Rashford - Manchester United
└── ...
```

#### Étape 4 : Création automatique
- Si tu sélectionnes un joueur **existant** → il est directement lié
- Si tu sélectionnes un joueur **API-Football** → une fiche joueur est **automatiquement créée** avec :
  - Nom du joueur
  - ID API-Football
  - Puis liée à l'article

### 3.4 Comment ça marche - Clubs

Le fonctionnement est identique pour les clubs :

1. Dans **"Clubs concernés"** ou **"Infos du match"**
2. Tape le nom du club (ex: "real" ou "psg")
3. Sélectionne dans la liste
4. La fiche club est créée automatiquement si elle n'existe pas

```
📋 Clubs existants (CMS)
├── Paris Saint-Germain
└── Real Madrid

🌐 Résultats API-Football
├── Real Madrid - Spain (ID: 541)
├── Real Betis - Spain (ID: 543)
├── Real Sociedad - Spain (ID: 548)
└── ...
```

### 3.5 Exemple concret : Créer une analyse de match

**Scénario** : Tu veux créer une analyse du match PSG vs Real Madrid

```
1. Créer un nouvel article
   - Type de contenu: 📊 Analyse

2. Remplir "Infos du match":
   - Équipe domicile: Tape "psg" → Sélectionne "Paris Saint-Germain"
   - Équipe extérieur: Tape "real" → Sélectionne "Real Madrid"
   - Score: 1-2
   - Compétition: Champions League
   - Date: 2026-01-15

3. Ajouter les joueurs concernés:
   - Tape "mbappe" → Sélectionne "Kylian Mbappé"
   - Tape "vinicius" → Sélectionne "Vinicius Junior"
   - Tape "dembele" → Sélectionne "Ousmane Dembélé"

4. Les fiches joueurs et clubs sont créées automatiquement!
```

### 3.6 Championnats couverts

La recherche API-Football couvre les **5 grands championnats** :

| Championnat | ID API |
|-------------|--------|
| Ligue 1 (France) | 61 |
| Premier League (Angleterre) | 39 |
| La Liga (Espagne) | 140 |
| Serie A (Italie) | 135 |
| Bundesliga (Allemagne) | 78 |

### 3.7 Configuration technique

La recherche fonctionne grâce à :

1. **Composants custom** :
   - `PlayerReferenceInput.jsx` : Recherche joueurs
   - `ClubReferenceInput.jsx` : Recherche clubs

2. **Proxy Vite** (dans `sanity.cli.js`) :
   - Contourne les problèmes CORS
   - Ajoute automatiquement la clé API

3. **Types d'objets** :
   - `playerLink` : Wrapper pour la référence joueur
   - `clubLink` : Wrapper pour la référence club

### 3.8 FAQ Recherche API

**Q: Pourquoi je ne trouve pas un joueur ?**
- Vérifie l'orthographe (ex: "Mbappé" pas "Mbappe")
- Le joueur doit jouer dans un des 5 grands championnats
- Tape au moins 3 caractères

**Q: La fiche créée est vide ?**
- Normal ! Les fiches sont créées avec juste le nom et l'ID API
- Les stats sont récupérées côté frontend via API-Football
- Tu peux enrichir la fiche avec du contenu éditorial Octogoal

**Q: Puis-je créer un joueur manuellement ?**
- Oui, va dans "Joueurs & Clubs > Tous les joueurs > + Créer"
- Tu devras alors chercher l'ID API-Football manuellement

---

## 4. Blocs éditeur enrichis

### 4.1 Comment accéder aux blocs

1. Ouvre un article
2. Va dans le champ "Contenu"
3. Clique sur le bouton **+** (ajouter un bloc)
4. Choisis le type de bloc

### 4.2 Callout / Alerte

**Usage :** Mettre en évidence une information importante.

**Types disponibles :**
- 💡 Info - Information générale
- ⚠️ Attention - Avertissement
- ✅ Succès - Confirmation positive
- 🔥 Breaking - Info urgente
- 📊 Stat - Chiffre clé
- 💬 Citation rapide - Citation courte

**Exemple d'utilisation :**
```
Type: 🔥 Breaking
Titre: "OFFICIEL"
Contenu: "Le transfert de Mbappé au Real Madrid est confirmé
pour un montant de 180M€. Le joueur a signé un contrat de 5 ans."
```

**Rendu frontend suggéré :**
```html
<div class="callout callout-breaking">
  <div class="callout-icon">🔥</div>
  <div class="callout-content">
    <strong>OFFICIEL</strong>
    <p>Le transfert de Mbappé...</p>
  </div>
</div>
```

---

### 4.3 Citation stylée

**Usage :** Afficher une citation avec la photo et les infos de l'auteur.

**Champs :**
| Champ | Description |
|-------|-------------|
| `quote` | La citation |
| `author` | Nom de l'auteur |
| `role` | Rôle/fonction |
| `image` | Photo de l'auteur |
| `source` | Source (L'Équipe, RMC...) |
| `date` | Date de la citation |
| `style` | Classique, Avec fond, Grande, Encadré |

**Exemple :**
```
Citation: "On ne peut pas gagner la Ligue des Champions
si on n'est pas prêt à souffrir ensemble."

Auteur: Luis Enrique
Rôle: Entraîneur du PSG
Source: Conférence de presse
Date: 10 janvier 2026
Style: Avec fond
```

---

### 4.4 Stats Card

**Usage :** Afficher des statistiques clés de manière visuelle.

**Champs :**
| Champ | Description |
|-------|-------------|
| `title` | Titre (ex: "Mbappé en 2025-2026") |
| `stats` | Liste de stats (valeur, label, icône, tendance) |
| `layout` | Ligne / Grille 2x2 / Grille 3x2 / Liste |
| `source` | Source des données |
| `theme` | Clair / Sombre / Octogoal / Club |

**Exemple :**
```
Titre: "Les stats de Mbappé cette saison"
Stats:
  - Valeur: "22", Label: "Buts", Icône: ⚽, Tendance: ↗️
  - Valeur: "8", Label: "Passes D.", Icône: 🎯, Tendance: ➡️
  - Valeur: "25", Label: "Matchs", Icône: 👟, Tendance: ↗️
  - Valeur: "8.2", Label: "Note moy.", Icône: ⭐, Tendance: ↗️
Layout: Grille 2x2
Source: WhoScored
Thème: Sombre
```

---

### 4.5 Comparaison joueurs

**Usage :** Comparer deux joueurs côte à côte avec leurs statistiques.

**Champs :**
| Champ | Description |
|-------|-------------|
| `title` | Titre de la comparaison |
| `player1` | Joueur 1 (nom, photo, club, lien fiche) |
| `player2` | Joueur 2 (nom, photo, club, lien fiche) |
| `stats` | Stats comparées (label, valeur1, valeur2, avantage) |
| `verdict` | Verdict final (gagnant + commentaire) |
| `season` | Saison de référence |

**Exemple :**
```
Titre: "Mbappé vs Haaland - Le duel des titans"

Joueur 1:
  - Nom: Kylian Mbappé
  - Club: Real Madrid
  - Photo: [image]

Joueur 2:
  - Nom: Erling Haaland
  - Club: Manchester City
  - Photo: [image]

Stats:
  - Buts: 22 vs 28 → Avantage Joueur 2
  - Passes D.: 8 vs 5 → Avantage Joueur 1
  - Dribbles réussis: 45 vs 12 → Avantage Joueur 1
  - Buts/match: 0.88 vs 1.12 → Avantage Joueur 2

Verdict:
  - Gagnant: Égalité
  - Commentaire: "Deux profils différents mais complémentaires.
    Mbappé est plus complet, Haaland plus efficace devant le but."

Saison: 2025-2026
```

---

### 4.6 Galerie d'images

**Usage :** Afficher plusieurs images dans un format attrayant.

**Champs :**
| Champ | Description |
|-------|-------------|
| `title` | Titre de la galerie |
| `images` | Images avec légendes (2-20) |
| `layout` | Carousel / Grille 2 cols / Grille 3 cols / Masonry |
| `showCaptions` | Afficher les légendes |
| `lightbox` | Ouvrir en plein écran au clic |

**Exemple :**
```
Titre: "Les plus beaux buts de la J20"
Images:
  1. [image] - "Le coup franc magistral de Griezmann"
  2. [image] - "La reprise de volée d'Openda"
  3. [image] - "Le lob parfait de Barcola"
  4. [image] - "Le but collectif de l'OL"
Layout: Carousel
Légendes: ✅
Lightbox: ✅
```

---

### 4.7 Bouton CTA

**Usage :** Ajouter un bouton d'appel à l'action dans l'article.

**Champs :**
| Champ | Description |
|-------|-------------|
| `text` | Texte du bouton |
| `linkType` | URL externe / Article / Joueur / Club |
| `style` | Principal / Secondaire / Ghost / Gradient |
| `size` | Petit / Normal / Grand / Pleine largeur |
| `icon` | Flèche / Play / Lire / Foot / Lien |
| `openInNewTab` | Ouvrir dans un nouvel onglet |

**Exemples :**
```
Exemple 1 - Lien vers fiche joueur:
  Texte: "Voir la fiche de Mbappé"
  Type: Joueur
  Joueur: → Mbappé
  Style: Gradient Octogoal
  Icône: ⚽

Exemple 2 - Lien externe:
  Texte: "Regarder les highlights"
  Type: URL externe
  URL: https://youtube.com/watch?v=...
  Style: Principal
  Icône: ▶️ Play
  Nouvel onglet: ✅

Exemple 3 - Lien vers article:
  Texte: "Lire l'analyse complète"
  Type: Article
  Article: → "Analyse tactique PSG-City"
  Style: Secondaire
  Icône: → Flèche
```

---

### 4.8 Spoiler / Révélation

**Usage :** Cacher du contenu que le lecteur doit cliquer pour révéler.

**Types :**
- 🎯 Pronostic
- 🏆 Résultat
- 🤫 Spoiler
- 💡 Réponse
- 📖 Lire la suite

**Champs :**
| Champ | Description |
|-------|-------------|
| `title` | Titre visible |
| `content` | Contenu caché |
| `type` | Type de spoiler |
| `buttonText` | Texte du bouton |

**Exemples :**
```
Exemple 1 - Pronostic:
  Type: 🎯 Pronostic
  Titre: "Notre prono pour PSG-City"
  Contenu: "PSG 2-1 City. On mise sur un doublé de Mbappé
  et une défense parisienne solide."
  Bouton: "Voir le prono"

Exemple 2 - Quiz:
  Type: 💡 Réponse
  Titre: "Qui a marqué le plus de buts en L1 en 2024?"
  Contenu: "Kylian Mbappé avec 27 buts en 29 matchs!"
  Bouton: "Voir la réponse"
```

---

### 4.9 Accordéon / FAQ

**Usage :** Créer des sections dépliables pour des FAQ ou du contenu organisé.

**Champs :**
| Champ | Description |
|-------|-------------|
| `title` | Titre de la section |
| `items` | Questions/réponses |
| `allowMultiple` | Permettre plusieurs ouverts |
| `style` | Simple / Bordé / Cards / Numéroté |

**Exemple :**
```
Titre: "FAQ - Mercato hivernal 2026"
Style: Cards

Items:
  Q1: "Quand se termine le mercato?"
  R1: "Le mercato hivernal se termine le 3 février 2026
      à 23h59 en France."

  Q2: "Mbappé peut-il revenir au PSG?"
  R2: "Techniquement oui, mais c'est hautement improbable.
      Le joueur a signé jusqu'en 2029 au Real Madrid."

  Q3: "Quels sont les gros transferts attendus?"
  R3: "Les rumeurs évoquent Salah vers l'Arabie Saoudite,
      Osimhen vers Chelsea, et Zirkzee vers la Juventus."

Permettre plusieurs ouverts: ✅
```

---

## 5. Schémas améliorés

### 5.1 Category (Catégorie)

**Nouveaux champs :**
| Champ | Description | Exemple |
|-------|-------------|---------|
| `icon` | Emoji | ⚽ 📰 🎬 |
| `image` | Image de couverture | [image 16:9] |
| `color` | Couleur principale | #E11D48 |
| `gradient` | Dégradé CSS | from-pink-500 to-rose-600 |
| `order` | Ordre dans le menu | 1 |
| `showInNav` | Afficher dans la nav | ✅ |
| `showInFooter` | Afficher dans le footer | ✅ |
| `isFeatured` | Mise en avant | ✅ |
| `seo.metaTitle` | Titre SEO | |
| `seo.metaDescription` | Description SEO | |

**Utilisation :**
```
Catégorie: Actus
- Icône: 📰
- Couleur: #E11D48 (rouge)
- Gradient: from-red-500 to-rose-600
- Ordre: 1
- Afficher dans nav: ✅
- Afficher dans footer: ✅
```

---

### 5.2 Tag

**Nouveaux champs :**
| Champ | Description | Exemple |
|-------|-------------|---------|
| `slug` | URL du tag | mbappe |
| `tagType` | Type | Joueur / Club / Compétition / Pays / Thème |
| `color` | Couleur | blue / red / green... |
| `image` | Image | [photo] |
| `linkedPlayer` | Lien vers fiche joueur | → Mbappé |
| `linkedClub` | Lien vers fiche club | → PSG |
| `isTrending` | Tag tendance | ✅ |

**Utilisation :**
```
Tag: Mbappé
- Slug: mbappe
- Type: Joueur
- Couleur: blue
- Lien joueur: → Fiche Mbappé
- Trending: ✅

Maintenant accessible via /tag/mbappe
```

---

### 5.3 Author (Auteur)

**Nouveaux champs :**
| Champ | Description |
|-------|-------------|
| `nickname` | Surnom ("Le Prof") |
| `role` | Rôle (Rédacteur, Analyste, Présentateur...) |
| `shortBio` | Bio courte (160 car.) |
| `expertise` | Domaines (Ligue 1, Mercato, Tactique...) |
| `favoriteClub` | Club de coeur (référence) |
| `socialMedia` | Twitter, Instagram, LinkedIn, TikTok, YouTube, Threads |
| `email` | Email contact |
| `showEmail` | Afficher email publiquement |
| `isActive` | Auteur actif |
| `isFeatured` | Mis en avant |
| `joinedAt` | Date d'arrivée |
| `stats` | Nb articles, vues totales |
| `order` | Ordre sur page équipe |

---

## 6. Structure du Studio

### Navigation principale

```
🏠 Homepage                    ← Singleton de configuration
─────────────────────────────
📝 Contenu
  ├── 📰 Tous les articles
  ├── 📂 Par type de contenu
  │   ├── 📰 Actus
  │   ├── 🎬 Émissions
  │   ├── ⚡ Flash
  │   ├── 📊 Analyses
  │   ├── 👤 Portraits
  │   ├── 😂 Mèmes
  │   └── 📋 Tops / Listes
  ├── ⭐ Mise en avant
  │   ├── 🌟 À la une
  │   ├── 🔥 Tendances
  │   └── ⭐ Essentiels
  └── 🗣️ Débats

⚽ Joueurs & Clubs
  ├── ⚽ Tous les joueurs
  ├── 📊 Par statut
  │   ├── ⭐ Mis en avant
  │   ├── 💎 Pépites
  │   ├── 👑 Légendes
  │   └── 🏥 Blessés
  ├── 🏟️ Tous les clubs
  ├── 🏆 Par championnat
  │   ├── 🇫🇷 Ligue 1
  │   ├── 🏴 Premier League
  │   ├── 🇪🇸 La Liga
  │   ├── 🇮🇹 Serie A
  │   └── 🇩🇪 Bundesliga
  └── 👑 Top clubs européens

📂 Organisation
  ├── 📁 Catégories
  ├── 📂 Sous-catégories
  ├── 🏷️ Tags
  └── 🔥 Tags tendances

👥 Équipe
  ├── ✍️ Tous les auteurs
  ├── ⭐ Auteurs mis en avant
  └── 🔇 Anciens auteurs
─────────────────────────────
🛠️ Outils
  ├── 📝 Brouillons
  ├── 🖼️ Sans image
  └── 📁 Sans catégorie
```

---

## 7. Plugin Media Library

### Accès
Clique sur l'icône **📷 Media** dans la barre latérale gauche.

### Fonctionnalités
- **Recherche** : Chercher par nom de fichier
- **Filtres** : Par type (image, vidéo, fichier)
- **Tags** : Ajouter des tags aux médias pour les organiser
- **Infos** : Voir dimensions, taille, date d'upload
- **Actions** : Supprimer, télécharger, copier l'URL

### Bonnes pratiques
```
1. Nommer les fichiers clairement:
   ❌ IMG_2345.jpg
   ✅ mbappe-celebration-psg-city-2026.jpg

2. Ajouter des tags:
   - "joueurs" pour les photos de joueurs
   - "matchs" pour les photos de matchs
   - "clubs" pour les logos

3. Utiliser le bon format:
   - Photos: JPEG ou WebP
   - Logos: PNG avec transparence
   - Miniatures: 1200x675 (16:9)
```

---

## 8. Requêtes GROQ utiles

### Articles

```groq
// Tous les articles publiés, triés par date
*[_type == "article" && defined(publishedAt)] | order(publishedAt desc)

// Articles d'une catégorie
*[_type == "article" && references(*[_type == "category" && slug.current == "actus"]._id)]

// Articles d'une sous-catégorie
*[_type == "article" && references(*[_type == "subcategory" && slug.current == "ligue-1"]._id)]

// Articles à la une
*[_type == "article" && isFeatured == true] | order(publishedAt desc)[0...5]

// Articles tendances
*[_type == "article" && isTrending == true] | order(trendingOrder asc)[0...10]

// Article par slug avec toutes les refs (v2.1)
*[_type == "article" && slug.current == $slug][0]{
  ...,
  author->,
  categories[]->,
  subcategories[]->{..., parentCategory->},
  tags[]->,
  relatedArticles[]->,
  // Nouveaux champs v2.1
  linkedPlayers[]{
    player->{name, apiFootballId}
  },
  linkedClubs[]{
    club->{name, apiFootballId, slug}
  },
  matchInfo{
    homeTeam->{name, apiFootballId},
    awayTeam->{name, apiFootballId},
    score,
    competition,
    matchDate
  }
}
```

### Joueurs (v2.1 simplifié)

```groq
// Tous les joueurs avec leur ID API
*[_type == "player"] | order(name asc) {
  name,
  apiFootballId,
  isPepite,
  isLegend,
  isFeatured
}

// Pépites
*[_type == "player" && isPepite == true]

// Légendes
*[_type == "player" && isLegend == true]

// Joueur par nom avec contenu éditorial
*[_type == "player" && name match $name][0]{
  name,
  apiFootballId,      // Pour récupérer les stats via API-Football
  customBio,
  playingStyle,
  strengths,
  weaknesses,
  funFacts,
  famousQuotes,
  octogoalVerdict,
  relatedArticles[]->,
  tags[]->
}

// Joueurs mis en avant pour la homepage
*[_type == "player" && isFeatured == true] {
  name,
  apiFootballId       // Le frontend utilise cet ID pour l'API
}
```

> **Note v2.1** : Les stats détaillées (buts, matchs, etc.) sont récupérées côté frontend via API-Football grâce à `apiFootballId`.

### Clubs (v2.1 simplifié)

```groq
// Tous les clubs avec leur ID API
*[_type == "club"] | order(name asc) {
  name,
  apiFootballId,
  slug,
  isTopClub,
  isFeatured
}

// Top clubs européens
*[_type == "club" && isTopClub == true]

// Club par slug avec contenu éditorial
*[_type == "club" && slug.current == $slug][0]{
  name,
  apiFootballId,      // Pour récupérer les stats via API-Football
  customBio,
  history,
  rivalries,
  funFacts,
  octogoalVerdict,
  relatedArticles[]->,
  tags[]->
}

// Clubs mis en avant
*[_type == "club" && isFeatured == true] {
  name,
  apiFootballId       // Le frontend utilise cet ID pour l'API
}
```

> **Note v2.1** : Les infos détaillées (effectif, classement, matchs) sont récupérées côté frontend via API-Football grâce à `apiFootballId`.

### Homepage

```groq
// Configuration homepage
*[_type == "homepage"][0]{
  ...,
  heroArticle->,
  heroSecondaryArticles[]->,
  trendingArticles[]->,
  sections[]{
    ...,
    category->,
    subcategory->,
    manualItems[]->,
    manualPlayers[]->,
    manualClubs[]->
  },
  sidebarSections[]{
    ...,
    featuredPlayer->
  }
}
```

---

## 9. Exemples d'utilisation concrets

### Exemple 1: Créer un article avec tous les nouveaux blocs

**Scénario :** Article "Mbappé vs Haaland: Le duel de l'année"

```
1. CRÉER L'ARTICLE
   - Titre: "Mbappé vs Haaland: Le duel de l'année"
   - Type: 📊 Analyse
   - Catégorie: Joueurs
   - Sous-catégorie: Tops joueurs
   - Image principale: [photo des deux joueurs]
   - Extrait: "Qui est vraiment le meilleur attaquant du monde?
     On analyse tout: stats, style de jeu, impact."

2. CONTENU DE L'ARTICLE

   [Bloc texte - Introduction]
   "Le débat fait rage depuis plusieurs années. D'un côté,
   Kylian Mbappé, le prodige français..."

   [Bloc Callout - Info]
   Type: 💡 Info
   Titre: "Méthodologie"
   Contenu: "Cette analyse se base sur les stats de la saison
   2025-2026 jusqu'au 10 janvier."

   [Bloc Stats Card]
   Titre: "Les stats en un coup d'œil"
   Stats: Buts (22 vs 28), Passes D. (8 vs 5), etc.
   Layout: Grille 2x2

   [Bloc texte - Section analyse]
   "Commençons par le plus évident: les buts..."

   [Bloc Comparaison Joueurs]
   Titre: "Face à face statistique"
   Player 1: Mbappé (Real Madrid)
   Player 2: Haaland (Man City)
   Stats détaillées...
   Verdict: "Égalité - Deux profils complémentaires"

   [Bloc Citation stylée]
   Citation: "Mbappé est le joueur le plus complet que j'ai vu"
   Auteur: Thierry Henry
   Source: CBS Sports, janvier 2026

   [Bloc Galerie]
   Titre: "Leurs plus beaux buts cette saison"
   Images: [5 images avec légendes]
   Layout: Carousel

   [Bloc Spoiler]
   Type: 🎯 Pronostic
   Titre: "Notre verdict final"
   Contenu: "Pour nous, Mbappé reste légèrement au-dessus
   grâce à sa polyvalence..."

   [Bloc CTA]
   Texte: "Voir la fiche de Mbappé"
   Type: Joueur
   Joueur: → Mbappé
   Style: Gradient

   [Bloc CTA]
   Texte: "Voir la fiche de Haaland"
   Type: Joueur
   Joueur: → Haaland
   Style: Secondary

3. MÉTADONNÉES
   - Auteur: [Sélectionner]
   - Tags: Mbappé, Haaland, Comparaison, Stats
   - Temps de lecture: 8 min
   - À la une: ✅
   - Tendance: ✅
```

---

### Exemple 2: Configurer la homepage pour un jour de Ligue 1

**Scénario :** Samedi soir, grosse soirée de Ligue 1

```
1. HERO
   - Article principal: "PSG-OM: Le classique en direct"
   - Style: Fullwidth
   - Articles secondaires:
     1. "Les compos officielles"
     2. "L'avant-match avec nos experts"
     3. "Les stats du classique"

2. BREAKING NEWS
   - Actif: ✅
   - Texte: "🔴 LIVE - PSG-OM coup d'envoi à 21h!"
   - Style: Rouge urgent
   - Article lié: → Article live

3. TICKER
   - Actif: ✅
   - Éléments:
     - ⚽ "Lyon 2-1 Monaco (terminé)"
     - ⚽ "Marseille 0-0 Nice (mi-temps)"
     - 🔥 "Mbappé titulaire ce soir!"

4. SECTIONS
   Section 1:
   - Titre: "Les matchs du jour"
   - Type: Catégorie "Matchs"
   - Layout: Grille 3 colonnes
   - Nombre: 6

   Section 2:
   - Titre: "Actus Ligue 1"
   - Type: Sous-catégorie "Ligue 1"
   - Layout: Liste
   - Nombre: 5

5. SIDEBAR
   - Widget 1: Classement Ligue 1 (ID: 61)
   - Widget 2: Prochains matchs
   - Widget 3: Newsletter
```

---

### Exemple 3: Créer une fiche joueur (v2.1 simplifié)

**Scénario :** Fiche de Warren Zaïre-Emery (pépite PSG)

> **Note v2.1** : Les stats (taille, poids, matchs, buts, etc.) sont récupérées automatiquement via API-Football. Tu n'as qu'à saisir le contenu éditorial !

**Méthode 1 - Via un article (recommandé)**
```
1. Créer un article sur WZE
2. Dans "Joueurs concernés", taper "zaire-emery"
3. Sélectionner dans les résultats API-Football
4. La fiche est créée automatiquement!
5. Aller enrichir la fiche avec le contenu éditorial
```

**Méthode 2 - Création directe**
```
1. IDENTIFICATION
   - Nom: Warren Zaïre-Emery
   - API-Football ID: 284 (cherché via API)

2. FLAGS ÉDITORIAUX
   - Pépite: ✅
   - Légende: ❌
   - Mis en avant: ✅

3. CONTENU ÉDITORIAL OCTOGOAL

   Présentation:
   "Plus jeune buteur de l'histoire du PSG en Ligue 1,
   Warren Zaïre-Emery incarne le futur du football français.
   À seulement 19 ans, il s'est imposé comme un titulaire
   indiscutable au PSG et en équipe de France."

   Style de jeu:
   "Milieu box-to-box moderne, capable de récupérer et de créer.
   Comparable à un jeune Pogba avec une maturité tactique
   impressionnante pour son âge."

   Points forts:
   - Vision du jeu exceptionnelle
   - Maturité tactique au-dessus de son âge
   - Pressing intense et récupération de balle
   - Qualité de passe longue et courte
   - Frappe de loin en progression

   Points faibles:
   - Jeu de tête à améliorer
   - Gestion des temps forts/faibles

   Fun facts:
   - "Plus jeune joueur à débuter en Ligue 1 avec le PSG"
   - "A refusé des offres du Real Madrid et du Bayern à 16 ans"
   - "Parle couramment 3 langues: français, anglais, portugais"

   Citations célèbres:
   - "Je veux tout gagner avec le PSG" - WZE, 2025
   - "C'est le meilleur jeune milieu que j'ai vu" - Luis Enrique

   Verdict Octogoal:
   "Warren Zaïre-Emery est LA pépite du football français.
   Déjà indispensable au PSG et en équipe de France, son potentiel
   est simplement illimité. Futur Ballon d'Or? Le temps nous le dira."

4. LIENS
   - Articles liés: [Sélectionner les articles sur WZE]
   - Tags: WZE, PSG, Équipe de France, Pépites

5. PUBLIER
```

> **Rappel** : Les stats (matchs, buts, passes, etc.) s'afficheront automatiquement sur le frontend grâce à l'ID API-Football !

---

## 10. Bonnes pratiques

### Pour les articles

```
✅ À FAIRE:
- Toujours ajouter une image principale
- Remplir le texte alternatif de l'image
- Écrire un extrait accrocheur (150-200 car.)
- Sélectionner catégorie + sous-catégorie
- Ajouter 3-5 tags pertinents
- Estimer le temps de lecture

❌ À ÉVITER:
- Publier sans image
- Laisser l'extrait vide
- Oublier les tags
- Mettre trop d'articles "à la une" (max 1-2)
```

### Pour les joueurs/clubs

```
✅ À FAIRE:
- Renseigner l'ID API-Football pour les stats auto
- Uploader une photo de qualité
- Remplir la bio courte
- Lier aux articles pertinents

❌ À ÉVITER:
- Créer une fiche incomplète
- Oublier de mettre à jour les stats
```

### Pour la homepage

```
✅ À FAIRE:
- Changer l'article principal régulièrement
- Mettre à jour le breaking news
- Vérifier que les sections sont cohérentes
- Adapter selon l'actualité (jour de match, mercato...)

❌ À ÉVITER:
- Laisser un breaking news expiré
- Avoir trop de sections (max 5-6)
- Oublier de désactiver les popups obsolètes
```

### Pour les blocs éditeur

```
✅ À FAIRE:
- Utiliser les callouts pour les infos importantes
- Ajouter des stats cards dans les analyses
- Mettre des CTA vers les fiches joueurs/clubs
- Utiliser les spoilers pour les pronostics

❌ À ÉVITER:
- Surcharger d'effets visuels
- Oublier les légendes des images
- Mettre trop de blocs différents
```

---

## Conclusion

Ce guide couvre toutes les améliorations apportées au CMS Octogoal v2.1. Les principales nouveautés sont :

### Nouveautés v2.0
1. **3 nouveaux types de documents** : Player, Club, Homepage
2. **8 nouveaux blocs éditeur** pour enrichir le contenu
3. **Schémas améliorés** avec plus de champs et de validations
4. **Structure du Studio** réorganisée et intuitive
5. **Plugin Media** pour mieux gérer les images

### Nouveautés v2.1
1. **Recherche automatique API-Football** : Plus besoin de chercher les ID manuellement !
2. **Schémas Player et Club simplifiés** : Focus sur le contenu éditorial, les stats viennent de l'API
3. **Composants custom** : PlayerReferenceInput et ClubReferenceInput
4. **Champs article améliorés** : linkedPlayers, linkedClubs, matchInfo avec recherche
5. **Proxy Vite** : Configuration automatique pour l'API-Football

### Workflow recommandé

```
1. Créer un article
2. Taper le nom des joueurs/clubs concernés
3. Sélectionner dans les résultats
4. Les fiches sont créées automatiquement!
5. Enrichir les fiches avec du contenu éditorial Octogoal
6. Les stats sont récupérées côté frontend via API-Football
```

Pour toute question, consulte ce guide ou demande de l'aide !

---

*Guide mis à jour le 12 janvier 2026 - Octogoal CMS v2.1*
