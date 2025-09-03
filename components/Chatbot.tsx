'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'link' | 'list' | 'suggestion';
  links?: { text: string; url: string }[];
  list?: string[];
  suggestions?: string[];
}

interface ChatResponse {
  text: string;
  type?: 'text' | 'link' | 'list' | 'suggestion';
  links?: { text: string; url: string }[];
  list?: string[];
  suggestions?: string[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { userRole } = useAuth();

  // Marquer que nous sommes côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Suggestions de questions rapides
  const quickSuggestions = [
    "Comment ça marche ?",
    "Quelles sont mes permissions ?",
    "Comment ajouter une offre ?",
    "Comment valider une offre ?",
    "Qu'est-ce que le dashboard ?",
    "Comment fonctionne la répartition ?",
    "Quelles sont les modalités des pôles ?",
    "Comment configurer les alertes ?",
    "Comment utiliser la recherche automatique ?",
    "Qu'est-ce que les recommandations ?"
  ];

  // Fonction pour obtenir le nom de l'utilisateur avec modalité
  const getUserDisplayName = () => {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') return 'Utilisateur';

    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const sexe = user.sexe;
        const prenom = user.prenom || user.name || '';
        const nom = user.nom || '';
        const modalite = sexe === 'Mr' ? 'M.' : sexe === 'Mme' ? 'Mme' : '';
        const nomComplet = `${modalite} ${prenom} ${nom}`.trim();
        return nomComplet || 'Utilisateur';
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
    }
    return 'Utilisateur';
  };

  // Messages d'accueil basés sur le rôle avec nom personnalisé
  const getWelcomeMessage = () => {
    const userName = getUserDisplayName();
    const welcomeMessages = {
      s_admin: `Bienvenue ${userName} ! Je suis l'assistant BMS. En tant que Super Administrateur, vous avez accès à toutes les fonctionnalités. Comment puis-je vous aider ?`,
      admin: `Bienvenue ${userName} ! Je suis l'assistant BMS. En tant qu'administrateur, vous pouvez gérer les utilisateurs et valider les offres. Comment puis-je vous aider ?`,
      charge_ajout_offre: `Bienvenue ${userName} ! Je suis l'assistant BMS. Vous pouvez ajouter et gérer les nouvelles offres. Comment puis-je vous aider ?`,
      cma: `Bienvenue ${userName} ! Je suis l'assistant BMS. Vous êtes chargé du montage administratif. Comment puis-je vous aider ?`,
      cmt: `Bienvenue ${userName} ! Je suis l'assistant BMS. Vous êtes chargé du montage technique. Comment puis-je vous aider ?`,
      default: `Bienvenue ${userName} ! Je suis l'assistant BMS. Comment puis-je vous aider avec l'utilisation de l'application ?`
    };
    return welcomeMessages[userRole as keyof typeof welcomeMessages] || welcomeMessages.default;
  };

  // Base de connaissances améliorée avec suggestions
  const knowledgeBase: Record<string, ChatResponse> = {
    // Questions générales
    'comment ça marche': {
      text: "BMS est un système de gestion des offres commerciales. Voici les principales fonctionnalités :",
      type: 'list',
      list: [
        "Dashboard : Vue d'ensemble de toutes les offres",
        "Nouvelle offre : Ajouter une nouvelle opportunité",
        "Répartition : Assigner les offres aux pôles",
        "Offre du jour : Offres soumises aujourd'hui",
        "Validation : Approuver ou rejeter les offres",
        "Recherche automatique : Trouver des opportunités en ligne",
        "Recommandations : Suggestions personnalisées d'offres"
      ],
      suggestions: ["Quelles sont mes permissions ?", "Comment ajouter une offre ?", "Comment utiliser la recherche automatique ?"]
    },
    'fonctionnalités': {
      text: "Voici les principales fonctionnalités de BMS :",
      type: 'list',
      list: [
        "Gestion complète des offres commerciales",
        "Validation automatisée des opportunités",
        "Répartition par pôles spécialisés",
        "Tableau de bord avec analytics",
        "Gestion multi-rôles et permissions",
        "Suivi en temps réel des statuts",
        "Système d'alertes et notifications",
        "Recherche automatique d'opportunités",
        "Système de recommandations intelligentes",
        "Interface intuitive et responsive"
      ],
      suggestions: ["Comment ajouter une offre ?", "Comment utiliser la recherche automatique ?", "Qu'est-ce que les recommandations ?"]
    },
    'permissions': {
      text: "Vos permissions dépendent de votre rôle dans le système :",
      type: 'list',
      list: [
        "Super Admin : Accès complet à toutes les fonctionnalités",
        "Admin : Gestion des utilisateurs et validation des offres",
        "Chargé d'ajout d'offre : Création et modification d'offres",
        "CMA (Chargé Montage Administratif) : Gestion administrative",
        "CMT (Chargé Montage Technique) : Gestion technique"
      ],
      suggestions: ["Comment ajouter une offre ?", "Comment valider une offre ?", "Qu'est-ce que le dashboard ?"]
    },
    'ajouter offre': {
      text: "Pour ajouter une nouvelle offre :",
      type: 'list',
      list: [
        "Allez dans la section 'Ajouter une offre'",
        "Remplissez tous les champs obligatoires",
        "Sélectionnez le pôle responsable",
        "Définissez les échéances importantes",
        "Sauvegardez l'offre"
      ],
      suggestions: ["Comment valider une offre ?", "Comment fonctionne la répartition ?", "Qu'est-ce que le dashboard ?"]
    },
    'valider offre': {
      text: "Pour valider une offre :",
      type: 'list',
      list: [
        "Accédez à la section 'Valider les offres'",
        "Consultez les offres en attente de validation",
        "Vérifiez tous les documents et informations",
        "Approuvez ou rejetez l'offre",
        "Ajoutez des commentaires si nécessaire"
      ],
      suggestions: ["Comment ajouter une offre ?", "Qu'est-ce que le dashboard ?", "Comment fonctionne la répartition ?"]
    },
    'dashboard': {
      text: "Le dashboard vous offre :",
      type: 'list',
      list: [
        "Vue d'ensemble de toutes les offres",
        "Statistiques en temps réel",
        "Graphiques de performance",
        "Alertes et notifications",
        "Accès rapide aux fonctionnalités"
      ],
      suggestions: ["Comment ajouter une offre ?", "Comment valider une offre ?", "Comment fonctionne la répartition ?"]
    },
    'repartition': {
      text: "La répartition des offres :",
      type: 'list',
      list: [
        "Assignation automatique selon les critères",
        "Gestion par pôles spécialisés",
        "Suivi des charges de travail",
        "Répartition équitable des opportunités",
        "Interface de gestion intuitive"
      ],
      suggestions: ["Comment ajouter une offre ?", "Comment valider une offre ?", "Qu'est-ce que le dashboard ?"]
    },
    'modalités pôles': {
      text: "Les modalités des pôles incluent :",
      type: 'list',
      list: [
        "Spécialisation par domaine d'expertise",
        "Processus de validation spécifiques",
        "Gestion des échéances",
        "Coordination inter-pôles",
        "Reporting et suivi"
      ],
      suggestions: ["Comment fonctionne la répartition ?", "Comment ajouter une offre ?", "Comment valider une offre ?"]
    },
    'alertes': {
      text: "Le système d'alertes :",
      type: 'list',
      list: [
        "Notifications d'échéances",
        "Alertes de validation en attente",
        "Rappels automatiques",
        "Personnalisation des paramètres",
        "Intégration avec le workflow"
      ],
      suggestions: ["Comment configurer les alertes ?", "Comment ajouter une offre ?", "Qu'est-ce que le dashboard ?"]
    },
    'recherche automatique': {
      text: "La recherche automatique d'opportunités :",
      type: 'list',
      list: [
        "Recherche en temps réel par mots-clés",
        "Intégration Google/Bing Search APIs",
        "Web scraping de sites spécialisés",
        "Recherches programmées (quotidienne/hebdomadaire/mensuelle)",
        "Système de recommandations personnalisées",
        "Validation et suivi des offres trouvées",
        "Historique complet des recherches",
        "Scores de similarité intelligents"
      ],
      suggestions: ["Comment utiliser la recherche automatique ?", "Qu'est-ce que les recommandations ?", "Comment valider une offre ?"]
    },
    'recommandations': {
      text: "Le système de recommandations :",
      type: 'list',
      list: [
        "Analyse de vos validations précédentes",
        "Calcul de similarité entre offres",
        "Scores de pertinence personnalisés",
        "Apprentissage automatique des préférences",
        "Suggestions basées sur l'historique",
        "Filtrage intelligent des résultats"
      ],
      suggestions: ["Comment utiliser la recherche automatique ?", "Comment valider une offre ?", "Qu'est-ce que le dashboard ?"]
    },
    'recherche programmée': {
      text: "Les recherches programmées permettent de :",
      type: 'list',
      list: [
        "Automatiser les recherches quotidiennes",
        "Planifier des recherches hebdomadaires",
        "Configurer des recherches mensuelles",
        "Recevoir des notifications automatiques",
        "Suivre les nouvelles opportunités",
        "Gagner du temps sur la veille"
      ],
      suggestions: ["Comment utiliser la recherche automatique ?", "Qu'est-ce que les recommandations ?", "Comment configurer les alertes ?"]
    }
  };

  // Fonction pour trouver la meilleure réponse
  const findBestResponse = (query: string): ChatResponse => {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Recherche exacte
    for (const [key, response] of Object.entries(knowledgeBase)) {
      if (normalizedQuery.includes(key)) {
        return response;
      }
    }
    
    // Recherche par mots-clés
    const keywords = {
      'permission': 'permissions',
      'role': 'permissions',
      'fonction': 'fonctionnalités',
      'ajouter': 'ajouter offre',
      'créer': 'ajouter offre',
      'nouvelle': 'ajouter offre',
      'valider': 'valider offre',
      'approuver': 'valider offre',
      'dashboard': 'dashboard',
      'tableau': 'dashboard',
      'répartition': 'repartition',
      'pôle': 'modalités pôles',
      'poles': 'modalités pôles',
      'alerte': 'alertes',
      'notification': 'alertes',
      'recherche': 'recherche automatique',
      'automatique': 'recherche automatique',
      'recommandation': 'recommandations',
      'suggestion': 'recommandations',
      'programmée': 'recherche programmée',
      'planifiée': 'recherche programmée'
    };
    
    for (const [keyword, responseKey] of Object.entries(keywords)) {
      if (normalizedQuery.includes(keyword)) {
        return knowledgeBase[responseKey as keyof typeof knowledgeBase];
      }
    }
    
    // Réponse par défaut
    return {
      text: "Je ne comprends pas votre question. Pouvez-vous reformuler ou choisir une suggestion ci-dessous ?",
      type: 'text',
      suggestions: quickSuggestions.slice(0, 4)
    };
  };

  // Fonction pour générer un ID unique
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  // Fonction pour faire défiler vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fonction pour gérer l'envoi d'un message
  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simuler un délai de réponse
    setTimeout(() => {
      const response = findBestResponse(text);
      
      const botMessage: Message = {
        id: generateId(),
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        type: response.type,
        links: response.links,
        list: response.list,
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      setShowSuggestions(true);
    }, 1000);
  }, []);

  // Fonction pour gérer les suggestions
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  // Fonction pour gérer les suggestions rapides
  const handleQuickSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  // Fonction pour effacer l'historique
  const clearHistory = () => {
    setMessages([]);
    setShowSuggestions(false);
  };

  // Effet pour faire défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effet pour initialiser le message de bienvenue
  useEffect(() => {
    if (isClient && messages.length === 0) {
      const welcomeMessage: Message = {
        id: generateId(),
        text: getWelcomeMessage(),
        isUser: false,
        timestamp: new Date(),
        suggestions: quickSuggestions.slice(0, 4)
      };
      setMessages([welcomeMessage]);
    }
  }, [isClient, userRole]);

  // Gestionnaire de soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  // Gestionnaire de touche Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  // Afficher un loader pendant l'hydratation
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Bouton pour ouvrir/fermer le chatbot */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
        title="Assistant BMS"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Interface du chatbot */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="font-semibold">Assistant BMS</h3>
              </div>
              <button
                onClick={clearHistory}
                className="text-white/80 hover:text-white transition-colors"
                title="Nouvelle conversation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Zone des messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  
                  {/* Affichage des listes */}
                  {message.list && (
                    <ul className="mt-2 space-y-1">
                      {message.list.map((item, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {/* Affichage des liens */}
                  {message.links && (
                    <div className="mt-2 space-y-1">
                      {message.links.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 underline block text-sm"
                        >
                          {link.text}
                        </a>
                      ))}
                    </div>
                  )}
                  
                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left px-3 py-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Indicateur de frappe */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions rapides */}
          {showSuggestions && messages.length > 1 && (
            <div className="p-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Suggestions rapides :</p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.slice(0, 4).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSuggestionClick(suggestion)}
                    className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Zone de saisie */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre question..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
