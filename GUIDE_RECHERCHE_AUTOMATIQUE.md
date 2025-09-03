# 🔍 Guide d'Utilisation - Recherche Automatique BMS

## 📋 Vue d'ensemble

La **Recherche Automatique** est une fonctionnalité avancée qui permet de rechercher automatiquement des opportunités d'affaires en ligne et d'apprendre de vos préférences pour vous proposer des recommandations personnalisées.

## 🚀 Installation et Configuration

### 1. Installation des Dépendances

```bash
# Dans le répertoire backend/
cd backend
npm run install-search
```

### 2. Migration de la Base de Données

```bash
# Exécuter la migration
psql -U postgres -d bms_db -f migrations/002_search_automation.sql
```

### 3. Configuration Optionnelle (APIs)

Pour une recherche optimale, vous pouvez configurer des clés API :

```bash
# Dans votre fichier .env
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_google_cse_id
BING_API_KEY=your_bing_api_key
```

**Note :** Sans ces clés, le système utilisera le web scraping comme fallback.

## 🎯 Utilisation de la Recherche Automatique

### Accès à la Fonctionnalité

1. Connectez-vous à l'application BMS
2. Cliquez sur "Recherche automatique" dans le menu
3. Vous accédez à l'interface avec 4 onglets

### 📍 Onglet "Recherche"

#### Effectuer une Recherche Manuelle

1. **Saisir vos mots-clés** dans le champ de recherche
   - Exemples : "développement informatique", "formation", "consultation"
   - Plus vos mots-clés sont précis, meilleurs seront les résultats

2. **Cliquer sur "Rechercher"** ou appuyer sur Entrée

3. **Consulter les résultats** qui s'affichent sous forme de cartes

#### Valider une Offre

Pour chaque résultat, vous pouvez :

- **✅ Valider (En cours)** : Offre en cours de traitement
- **📤 Valider (Déposé)** : Offre déposée
- **🏆 Valider (Gagné)** : Offre remportée
- **❌ Valider (Perdu)** : Offre perdue
- **🔗 Ouvrir le lien** : Consulter l'offre originale

### ⏰ Onglet "Recherches Programmées"

#### Créer une Recherche Programmée

1. **Saisir les mots-clés** dans le champ "Mots-clés"
2. **Choisir la fréquence** :
   - **Quotidienne** : Recherche tous les jours
   - **Hebdomadaire** : Recherche une fois par semaine
   - **Mensuelle** : Recherche une fois par mois
3. **Cliquer sur "Ajouter"**

#### Gérer vos Recherches Programmées

- **Voir les détails** : Fréquence, dernière exécution, prochaine exécution
- **Supprimer** : Cliquer sur le bouton "Supprimer"

### 💡 Onglet "Recommandations"

#### Comprendre les Recommandations

Le système analyse vos validations précédentes pour proposer :

- **Offres similaires** à celles que vous avez validées
- **Scores de similarité** (pourcentage de pertinence)
- **Suggestions personnalisées** basées sur votre historique

#### Actualiser les Recommandations

- Cliquer sur "Actualiser" pour obtenir de nouvelles suggestions
- Les recommandations s'améliorent avec le temps et vos validations

### 📋 Onglet "Historique"

- **Historique des recherches** effectuées
- **Statistiques** d'utilisation
- **Suivi** des validations

## 🧠 Comment Fonctionne l'Intelligence Artificielle

### Algorithme de Similarité

Le système utilise un algorithme de similarité basé sur :

1. **Analyse du titre** (70% du score)
2. **Analyse de la description** (30% du score)
3. **Mots-clés communs** entre les offres
4. **Historique de vos validations**

### Apprentissage Automatique

Le système apprend de vos actions :

- **Validations positives** : Améliore les recommandations similaires
- **Validations négatives** : Évite les offres similaires
- **Mots-clés préférés** : Priorise certains types d'offres

## 🔧 Fonctionnalités Avancées

### Sources de Recherche

Le système recherche sur :

1. **Google Custom Search API** (si configuré)
2. **Bing Search API** (si configuré)
3. **Web Scraping** de sites spécialisés :
   - BOAMP (Bulletin officiel des annonces de marchés publics)
   - Legifrance
   - European Tenders

### Filtrage Intelligent

Les résultats sont automatiquement filtrés pour :

- **Appels d'offres**
- **Avis généraux de marché**
- **Appels à projet**
- **Accords-cadres**

### Exécution Automatique

Le scheduler s'exécute :

- **Toutes les 6 heures** pour les recherches programmées
- **Au démarrage du serveur** pour les recherches en attente
- **Avec délais** pour éviter de surcharger les APIs

## 📊 Statistiques et Métriques

### Métriques Disponibles

- **Nombre total de recherches** effectuées
- **Nombre d'offres trouvées**
- **Taux de validation** par utilisateur
- **Moyenne de résultats** par recherche
- **Date de dernière recherche**

### Tableau de Bord

Les statistiques sont disponibles dans l'onglet "Historique" et peuvent être utilisées pour :

- **Optimiser vos mots-clés**
- **Analyser votre taux de réussite**
- **Suivre votre activité**

## 🛠️ Dépannage

### Problèmes Courants

#### Aucun résultat de recherche

**Solutions :**
- Vérifiez vos mots-clés (plus précis = meilleurs résultats)
- Attendez quelques minutes (les APIs peuvent être temporairement indisponibles)
- Vérifiez votre connexion internet

#### Erreur de base de données

**Solutions :**
- Vérifiez que la migration a été exécutée
- Redémarrez le serveur backend
- Consultez les logs du serveur

#### Scheduler ne fonctionne pas

**Solutions :**
- Vérifiez que `node-cron` est installé
- Redémarrez le serveur backend
- Consultez les logs du scheduler

### Logs Utiles

```bash
# Logs de recherche
"Recherche automatique terminée: X résultats trouvés"

# Logs d'erreur
"Erreur lors de la recherche automatique: [détails]"

# Logs de validation
"Offre validée: [ID] par utilisateur [ID]"
```

## 🎯 Bonnes Pratiques

### Optimisation des Mots-clés

1. **Soyez spécifiques** : "développement web React" plutôt que "informatique"
2. **Utilisez des synonymes** : "formation" ET "training"
3. **Incluez des termes techniques** : "API", "cloud", "cybersécurité"
4. **Évitez les mots trop génériques** : "service", "projet"

### Gestion des Recherches Programmées

1. **Diversifiez vos mots-clés** pour couvrir différents domaines
2. **Ajustez les fréquences** selon l'urgence de vos besoins
3. **Supprimez les recherches obsolètes** régulièrement
4. **Analysez les résultats** pour optimiser vos mots-clés

### Validation des Offres

1. **Validez rapidement** les offres pertinentes
2. **Ajoutez des commentaires** pour améliorer l'apprentissage
3. **Utilisez les statuts appropriés** (En cours, Déposé, Gagné, Perdu)
4. **Consultez les liens** avant de valider

## 🔮 Évolutions Futures

### Fonctionnalités Prévues

1. **Intégration IA avancée**
   - Embeddings OpenAI pour une meilleure similarité
   - Classification automatique des offres
   - Prédiction de pertinence

2. **Sources étendues**
   - APIs spécialisées (TED, etc.)
   - RSS feeds d'appels d'offres
   - Intégration réseaux sociaux

3. **Analytics avancés**
   - Tableaux de bord personnalisés
   - Rapports de performance
   - Alertes intelligentes

4. **Collaboration**
   - Partage de recherches entre équipes
   - Commentaires sur les offres
   - Système de notation

## 📞 Support

Pour toute question ou problème :

1. **Consultez les logs** du serveur
2. **Vérifiez la configuration** des variables d'environnement
3. **Testez les APIs** de recherche individuellement
4. **Contactez l'équipe** de développement

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Auteur** : Équipe BMS
