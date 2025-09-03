
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import HomeButton from '../../components/HomeButton';
import ProtectedRoute from '../../components/ProtectedRoute';
import Layout from '../../components/Layout';
import { offresAPI } from '../../services/api';

const countries = [
  // Afrique
  'Afrique du Sud', 'Algérie', 'Angola', 'Bénin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroun', 'Comores', 'Congo (Brazzaville)', 'Congo (Kinshasa / République démocratique du Congo)', 'Côte d\'Ivoire', 'Djibouti', 'Égypte', 'Érythrée', 'Eswatini', 'Éthiopie', 'Gabon', 'Gambie', 'Ghana', 'Guinée', 'Guinée-Bissau', 'Guinée équatoriale', 'Kenya', 'Lesotho', 'Liberia', 'Libye', 'Madagascar', 'Malawi', 'Mali', 'Maroc', 'Maurice', 'Mauritanie', 'Mozambique', 'Namibie', 'Niger', 'Nigeria', 'Ouganda', 'Rwanda', 'Sao Tomé-et-Principe', 'Sénégal', 'Seychelles', 'Sierra Leone', 'Somalie', 'Soudan', 'Soudan du Sud', 'Tanzanie', 'Tchad', 'Togo', 'Tunisie', 'Zambie', 'Zimbabwe',
  
  // Amérique
  'Antigua-et-Barbuda', 'Argentine', 'Bahamas', 'Barbade', 'Belize', 'Bolivie', 'Brésil', 'Canada', 'Chili', 'Colombie', 'Costa Rica', 'Cuba', 'Dominique', 'El Salvador', 'États-Unis', 'Grenade', 'Guatemala', 'Guyana', 'Haïti', 'Honduras', 'Jamaïque', 'Mexique', 'Nicaragua', 'Panama', 'Paraguay', 'Pérou', 'République dominicaine', 'Saint-Kitts-et-Nevis', 'Saint-Vincent-et-les-Grenadines', 'Sainte-Lucie', 'Suriname', 'Trinité-et-Tobago', 'Uruguay', 'Venezuela',
  
  // Asie
  'Afghanistan', 'Arabie saoudite', 'Arménie', 'Azerbaïdjan', 'Bahreïn', 'Bangladesh', 'Bhoutan', 'Birmanie (Myanmar)', 'Brunei', 'Cambodge', 'Chine', 'Chypre', 'Corée du Nord', 'Corée du Sud', 'Émirats arabes unis', 'Géorgie', 'Inde', 'Indonésie', 'Irak', 'Iran', 'Israël', 'Japon', 'Jordanie', 'Kazakhstan', 'Kirghizistan', 'Koweït', 'Laos', 'Liban', 'Malaisie', 'Maldives', 'Mongolie', 'Népal', 'Oman', 'Ouzbékistan', 'Pakistan', 'Palestine', 'Philippines', 'Qatar', 'Singapour', 'Sri Lanka', 'Syrie', 'Tadjikistan', 'Taïwan', 'Thaïlande', 'Timor oriental', 'Turquie', 'Turkménistan', 'Viêt Nam', 'Yémen',
  
  // Europe
  'Albanie', 'Allemagne', 'Andorre', 'Autriche', 'Belgique', 'Biélorussie', 'Bosnie-Herzégovine', 'Bulgarie', 'Croatie', 'Danemark', 'Espagne', 'Estonie', 'Finlande', 'France', 'Grèce', 'Hongrie', 'Irlande', 'Islande', 'Italie', 'Lettonie', 'Liechtenstein', 'Lituanie', 'Luxembourg', 'Malte', 'Moldavie', 'Monaco', 'Monténégro', 'Norvège', 'Pays-Bas', 'Pologne', 'Portugal', 'République tchèque', 'Roumanie', 'Royaume-Uni', 'Russie', 'Saint-Marin', 'Serbie', 'Slovaquie', 'Slovénie', 'Suède', 'Suisse', 'Ukraine', 'Vatican',
  
  // Océanie
  'Australie', 'Fidji', 'Îles Marshall', 'Îles Salomon', 'Kiribati', 'Micronésie', 'Nauru', 'Nouvelle-Zélande', 'Palaos', 'Papouasie-Nouvelle-Guinée', 'Samoa', 'Tonga', 'Tuvalu', 'Vanuatu',
  
  // Autre
  'Autre'
].sort();

const devises = ['EUR', 'USD', 'XOF', 'XAF', 'GBP', 'CFA', 'Autre'];
const typesOffre = ['AO', 'AMI', 'Avis Général', 'Appel à projet', 'Accord cadre'];

// Fonction de validation d'URL
const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export default function AjouterOffre() {
  return (
    <ProtectedRoute pageName="ajouter-offre">
      <Layout>
        <AjouterOffreContent />
      </Layout>
    </ProtectedRoute>
  );
}

function AjouterOffreContent() {
  const [formData, setFormData] = useState({
    intituleOffre: '',
    commentaire: '',
    pays: [] as string[], // Pays sélectionnés (multi-sélection)
    autrePays: '', // Texte personnalisé pour "Autre"
    bailleur: '',
    objectifs: '',
    profilExpert: '',
    montant: '',
    devise: 'EUR', // Devise par défaut
    dureeMission: '',
    dateDepot: '',
    lienTDR: '',
    fichierTDR: null as File | null, // Pour le fichier
    heureDepot: '',
    nomSite: '',
    typeOffre: '',
    dateSoumissionValidation: new Date().toISOString().slice(0, 10), // Date du jour par défaut
    offreTrouveePar: '', // Sera rempli automatiquement avec le prénom de l'utilisateur connecté
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paysSearch, setPaysSearch] = useState('');

  // Récupérer automatiquement le prénom de l'utilisateur connecté
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setFormData(prev => ({
        ...prev,
        offreTrouveePar: user.prenom || user.name || 'Utilisateur'
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validation de la taille du fichier (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('Le fichier est trop volumineux. La taille maximale autorisée est de 10MB.');
        e.target.value = '';
        return;
      }
      
      // Validation du type de fichier
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.oasis.opendocument.text',
        'text/plain',
        'application/rtf',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/zip',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
        'image/jpeg',
        'image/png'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Type de fichier non autorisé. Veuillez sélectionner un fichier PDF, Word, Excel, PowerPoint, image ou archive.');
        e.target.value = '';
        return;
      }
      
      setFormData(prev => ({ ...prev, fichierTDR: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs obligatoires
    if (!formData.intituleOffre.trim()) {
      alert('Veuillez remplir l\'intitulé de l\'offre.');
      return;
    }
    
    if (!formData.bailleur.trim()) {
      alert('Veuillez remplir le bailleur.');
      return;
    }
    
    if (!formData.objectifs.trim()) {
      alert('Veuillez remplir les objectifs.');
      return;
    }
    
    if (!formData.dateDepot) {
      alert('Veuillez sélectionner une date de dépôt.');
      return;
    }
    
    if (!formData.typeOffre) {
      alert('Veuillez sélectionner un type d\'offre.');
      return;
    }
    
    if (formData.pays.length === 0) {
      alert('Veuillez sélectionner au moins un pays.');
      return;
    }
    
    // Validation : si "Autre" est sélectionné, le champ autrePays doit être rempli
    if (formData.pays.includes('Autre') && !formData.autrePays.trim()) {
      alert('Veuillez préciser le nom du pays dans le champ "Autre".');
      return;
    }
    
    // Validation de la date de dépôt (ne doit pas être dans le passé)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const depotDate = new Date(formData.dateDepot);
    
    if (depotDate < today) {
      const confirmPastDate = confirm('La date de dépôt est dans le passé. Voulez-vous continuer ?');
      if (!confirmPastDate) {
        return;
      }
    }
    
    // Validation de l'URL si fournie
    if (formData.lienTDR.trim() && !isValidUrl(formData.lienTDR)) {
      alert('Veuillez entrer une URL valide pour le lien TDR.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Préparer les données pour l'API
      const offreData = {
        intitule_offre: formData.intituleOffre,
        bailleur: formData.bailleur,
        pays: formData.pays.includes('Autre') 
          ? [...formData.pays.filter(p => p !== 'Autre'), formData.autrePays]
          : formData.pays,
        date_depot: formData.dateDepot,
        statut: 'en_attente',
        commentaire: formData.commentaire,
        montant: formData.montant ? parseFloat(formData.montant) : null,
        type_offre: formData.typeOffre,
        lien_tdr: formData.lienTDR || null,
        date_soumission_validation: formData.dateSoumissionValidation || null
      };

      // Envoyer à l'API backend
      const response = await offresAPI.create(offreData);
      
      if (response.success) {
        console.log('✅ Offre créée avec succès dans la base de données:', response.data);
        setIsSubmitting(false);
        setShowSuccess(true);
      } else {
        throw new Error(response.error || 'Erreur lors de la création de l\'offre');
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de l\'offre:', error);
      alert(`Une erreur est survenue lors de l'ajout de l'offre: ${error.message}. Veuillez réessayer.`);
      setIsSubmitting(false);
      return;
    }
    
    // Réinitialiser le formulaire
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    
    setFormData({
      intituleOffre: '',
      commentaire: '',
      pays: [],
      autrePays: '',
      bailleur: '',
      objectifs: '',
      profilExpert: '',
      montant: '',
      devise: 'EUR',
      dureeMission: '',
      dateDepot: '',
      lienTDR: '',
      fichierTDR: null,
      heureDepot: '',
      nomSite: '',
      typeOffre: '',
      dateSoumissionValidation: new Date().toISOString().slice(0, 10),
      offreTrouveePar: user?.prenom || user?.name || 'Utilisateur'
    });
    
    // Réinitialiser la recherche de pays
    setPaysSearch('');
    
    // Masquer le message de succès après 3 secondes
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <img src="https://static.readdy.ai/image/36ce116ccdb0d05752a287dd792317ce/3a2cd734c9129790560cc32a9975e166.jfif" alt="BMS Logo" className="h-10 cursor-pointer" />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <HomeButton variant="outline" size="sm" />
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">Dashboard</Link>
              <Link href="/offres" className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">Offres</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-add-circle-line text-2xl text-blue-600"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajouter une Nouvelle Offre</h1>
            <p className="text-gray-600">Remplissez le formulaire pour créer une nouvelle offre</p>
          </div>

          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <i className="ri-check-circle-line text-green-500 text-xl mr-3"></i>
                <p className="text-green-700">Offre ajoutée avec succès !</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intitulé de l'offre *
                </label>
                <input
                  type="text"
                  name="intituleOffre"
                  value={formData.intituleOffre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Ex: Développement application mobile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offre trouvée par *
                </label>
                <input
                  type="text"
                  name="offreTrouveePar"
                  value={formData.offreTrouveePar}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm cursor-not-allowed"
                  placeholder="Chargement..."
                />
                <p className="text-xs text-gray-500 mt-1">Rempli automatiquement avec votre nom</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
                <input type="text" name="commentaire" value={formData.commentaire} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Commentaire..." />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
                
                {/* Barre de recherche */}
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Rechercher un pays..."
                    value={paysSearch}
                    onChange={(e) => setPaysSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  {paysSearch && (
                    <button
                      onClick={() => setPaysSearch('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Liste des pays filtrée */}
                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg bg-white">
                  <div className="grid grid-cols-1">
                    {countries
                      .filter(pays => 
                        pays.toLowerCase().includes(paysSearch.toLowerCase())
                      )
                      .map((pays) => (
                        <label key={pays} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-3 border-b border-gray-100 last:border-b-0">
                          <input
                            type="checkbox"
                            checked={formData.pays.includes(pays)}
                            onChange={() => {
                              setFormData(prev => ({
                                ...prev,
                                pays: prev.pays.includes(pays)
                                  ? prev.pays.filter(p => p !== pays)
                                  : [...prev.pays, pays]
                              }));
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 flex-1">{pays}</span>
                        </label>
                      ))}
                  </div>
                </div>

                {/* Affichage des pays sélectionnés */}
                {formData.pays.length > 0 && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">Pays sélectionnés ({formData.pays.length}) :</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.pays.map((pays) => (
                        <span key={pays} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          {pays === 'Autre' ? `${pays}: ${formData.autrePays || 'Non spécifié'}` : pays}
                          <button
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                pays: prev.pays.filter(p => p !== pays),
                                // Réinitialiser autrePays si "Autre" est désélectionné
                                autrePays: pays === 'Autre' ? '' : prev.autrePays
                              }));
                            }}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Champ de saisie pour "Autre" */}
                {formData.pays.includes('Autre') && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <label className="block text-sm font-medium text-blue-800 mb-2">
                      Précisez le pays *
                    </label>
                    <input
                      type="text"
                      name="autrePays"
                      value={formData.autrePays}
                      onChange={handleChange}
                      required={formData.pays.includes('Autre')}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Entrez le nom du pays..."
                      maxLength={100}
                    />
                    <p className="text-xs text-blue-600 mt-1">
                      Veuillez préciser le nom du pays qui n'est pas dans la liste (max 100 caractères)
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bailleur *</label>
                <input type="text" name="bailleur" value={formData.bailleur} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Nom du bailleur" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Objectifs *</label>
                <textarea name="objectifs" value={formData.objectifs} onChange={handleChange} required rows={2} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Objectifs de la mission..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profil d'expert</label>
                <input type="text" name="profilExpert" value={formData.profilExpert} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Profil recherché..." />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Montant</label>
                <input type="number" name="montant" value={formData.montant} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Montant..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
                <select name="devise" value={formData.devise} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                  {devises.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durée de la mission</label>
                <input type="text" name="dureeMission" value={formData.dureeMission} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Ex: 6 mois" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de dépôt *</label>
                <input type="date" name="dateDepot" value={formData.dateDepot} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heure de dépôt</label>
                <input type="time" name="heureDepot" value={formData.heureDepot} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                <p className="text-xs text-gray-500 mt-1">Optionnel - Laissez vide si l'heure n'est pas spécifiée</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lien TDR</label>
                <input type="url" name="lienTDR" value={formData.lienTDR} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fichier TDR (PDF, Word...)</label>
                <input type="file" name="fichierTDR" accept=".pdf,.doc,.docx,.odt,.txt,.rtf,.xls,.xlsx,.csv,.ppt,.pptx,.zip,.rar,.7z,.jpg,.jpeg,.png" onChange={handleFileChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                {formData.fichierTDR && <span className="text-xs text-gray-500 mt-1 block">{formData.fichierTDR.name}</span>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du site</label>
                <input type="text" name="nomSite" value={formData.nomSite} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Nom du site..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type d'offre *</label>
                <select name="typeOffre" value={formData.typeOffre} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="">Sélectionner</option>
                  {typesOffre.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de soumission pour validation</label>
              <input type="date" name="dateSoumissionValidation" value={formData.dateSoumissionValidation} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap">
                {isSubmitting ? (<><i className="ri-loader-4-line animate-spin mr-2"></i>Ajout en cours...</>) : (<>Ajouter l'offre</>)}
              </button>
              <Link href="/offres" className="border-2 border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors text-center cursor-pointer whitespace-nowrap">Annuler</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
