# Assistant BMS - Documentation

## 🎯 Vue d'ensemble

L'Assistant BMS est un chatbot intelligent intégré à l'application qui aide les utilisateurs à comprendre et utiliser efficacement la plateforme BMS (Bid Management System).

## ✨ Fonctionnalités

### 🎨 Interface utilisateur
- **Bouton flottant** : Positionné en bas à droite de l'écran
- **Fenêtre modale** : Interface moderne avec design responsive
- **Animations** : Transitions fluides et indicateurs de frappe
- **Accessibilité** : Compatible avec les lecteurs d'écran

### 🧠 Intelligence artificielle
- **Réponses contextuelles** : Adaptées au rôle de l'utilisateur
- **Base de connaissances** : Réponses pré-construites pour les questions courantes
- **Recherche intelligente** : Détection de mots-clés et synonymes
- **Messages personnalisés** : Accueil adapté selon le rôle utilisateur

## 🎪 Types de réponses

### 1. Réponses textuelles simples
```typescript
{
  text: "Réponse simple à une question",
  type: 'text'
}
```

### 2. Réponses avec listes
```typescript
{
  text: "Voici les fonctionnalités :",
  type: 'list',
  list: [
    "Fonctionnalité 1",
    "Fonctionnalité 2",
    "Fonctionnalité 3"
  ]
}
```

### 3. Réponses avec liens
```typescript
{
  text: "Consultez ces ressources :",
  type: 'link',
  links: [
    { text: "Documentation", url: "/docs" },
    { text: "Support", url: "/support" }
  ]
}
```

## 🔍 Base de connaissances

### Questions générales
- `comment ça marche` - Explication du système BMS
- `fonctionnalités` - Liste des fonctionnalités principales
- `aide` - Guide d'utilisation de l'assistant
- `navigation` - Instructions de navigation
- `utiliser` - Conseils d'utilisation efficace

### Questions spécifiques aux rôles
- `s_admin` - Permissions Super Administrateur
- `admin` - Permissions Administrateur
- `charge_ajout_offre` - Permissions Chargé d'ajout d'offre
- `cma` - Permissions Chargé de Montage Administratif
- `cmt` - Permissions Chargé de Montage Technique

### Questions sur les pages
- `dashboard` - Fonctionnalités du tableau de bord
- `nouvelle offre` - Processus d'ajout d'offre
- `validation` - Processus de validation
- `repartition` - Gestion de la répartition

### Questions sur les permissions
- `permissions` - Système de permissions
- `accès` - Accès selon les rôles

### Questions sur l'utilisation
- `utiliser` - Conseils d'utilisation
- `problème` - Résolution de problèmes
- `recherche` - Fonctionnalités de recherche

## 🏗️ Architecture

### Composants
1. **Chatbot.tsx** - Composant principal du chatbot
2. **ChatbotProvider.tsx** - Provider pour l'injection du chatbot
3. **Layout.tsx** - Intégration dans le layout principal

### Structure des données
```typescript
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'link' | 'list';
  links?: { text: string; url: string }[];
  list?: string[];
}

interface ChatResponse {
  text: string;
  type?: 'text' | 'link' | 'list';
  links?: { text: string; url: string }[];
  list?: string[];
}
```

### Hooks utilisés
- `useState` - Gestion de l'état local
- `useRef` - Références aux éléments DOM
- `useEffect` - Effets de bord et lifecycle
- `useAuth` - Informations sur l'utilisateur connecté

## 🎨 Personnalisation

### Messages d'accueil par rôle
```typescript
const welcomeMessages = {
  s_admin: "Bonjour ! Je suis l'assistant BMS. En tant que Super Administrateur...",
  admin: "Bonjour ! Je suis l'assistant BMS. En tant qu'administrateur...",
  charge_ajout_offre: "Bonjour ! Je suis l'assistant BMS. Vous pouvez ajouter...",
  cma: "Bonjour ! Je suis l'assistant BMS. Vous êtes chargé du montage administratif...",
  cmt: "Bonjour ! Je suis l'assistant BMS. Vous êtes chargé du montage technique...",
  default: "Bonjour ! Je suis l'assistant BMS. Comment puis-je vous aider ?"
};
```

### Styles CSS
Le chatbot utilise Tailwind CSS avec des classes personnalisées :
- `bg-blue-600` - Couleur principale
- `rounded-2xl` - Coins arrondis
- `shadow-2xl` - Ombres profondes
- `transition-all` - Animations fluides

## 🔧 Configuration

### Ajout de nouvelles réponses
1. Ajouter une nouvelle entrée dans `knowledgeBase`
2. Définir les mots-clés correspondants dans `keywords`
3. Tester la réponse avec différents formulaires

### Exemple d'ajout
```typescript
// Dans knowledgeBase
'nouvelle_fonctionnalité': {
  text: "Nouvelle fonctionnalité disponible :",
  type: 'list',
  list: [
    "Description 1",
    "Description 2",
    "Description 3"
  ]
}

// Dans keywords
'nouvelle_fonctionnalité': 'nouvelle_fonctionnalité'
```

## 🧪 Tests

### Tests manuels recommandés
1. **Ouverture/fermeture** - Vérifier l'ouverture et fermeture du chatbot
2. **Messages d'accueil** - Vérifier les messages selon le rôle
3. **Réponses** - Tester les différents types de réponses
4. **Recherche** - Tester la détection de mots-clés
5. **Responsive** - Vérifier l'affichage sur mobile
6. **Accessibilité** - Tester avec un lecteur d'écran

### Scénarios de test
```bash
# Test 1 : Ouverture du chatbot
1. Cliquer sur le bouton flottant
2. Vérifier l'affichage de la fenêtre
3. Vérifier le message d'accueil

# Test 2 : Pose de questions
1. Taper "aide" et envoyer
2. Vérifier la réponse avec liste
3. Taper "dashboard" et envoyer
4. Vérifier la réponse spécifique

# Test 3 : Navigation
1. Taper des questions aléatoires
2. Vérifier les réponses par défaut
3. Tester la fermeture du chatbot
```

## 🚀 Améliorations récentes (v2.0)

### Fonctionnalités ajoutées
1. ✅ **Suggestions automatiques** - Questions rapides et contextuelles
2. ✅ **Auto-complétion intelligente** - Suggestions lors de la saisie
3. ✅ **Interface modernisée** - Design plus professionnel
4. ✅ **Nouvelle conversation** - Bouton de rafraîchissement
5. ✅ **Responsive design** - Adaptation mobile améliorée
6. ✅ **Accessibilité** - Support des lecteurs d'écran

## 🚀 Améliorations futures

### Fonctionnalités planifiées
1. **Historique des conversations** - Sauvegarde des échanges
2. **Intégration IA** - Réponses plus intelligentes
3. **Multilingue** - Support de plusieurs langues
4. **Analytics** - Statistiques d'utilisation
5. **Feedback utilisateur** - Système de notation des réponses
6. **Chat vocal** - Reconnaissance vocale

### Optimisations techniques
1. **Performance** - Lazy loading des réponses
2. **Cache** - Mise en cache des réponses fréquentes
3. **Offline** - Fonctionnement hors ligne
4. **PWA** - Support complet des fonctionnalités PWA

## 📞 Support

Pour toute question sur le chatbot :
1. Consultez cette documentation
2. Testez les fonctionnalités existantes
3. Contactez l'équipe de développement
4. Consultez les logs de l'application

---

*Documentation mise à jour le : $(date)*
