'use client';

import React, { useState, useEffect } from 'react';
import PageWithMenu from '../../components/PageWithMenu';

interface Partenaire {
  id: string;
  nomBureau: string;
  contact: string;
  cabinetsAyantPostule: string;
  contacts: string;
  domaineExpertise: string;
  pays: string;
  marcheGagne: string;
  duree: string;
  bailleur: string;
  valeur: string;
  marcheAttribueLe: string;
  dateCreation: string;
}

export default function Partenariat() {
  return (
    <PageWithMenu pageName="partenariat">
      <PartenariatContent />
    </PageWithMenu>
  );
}

function PartenariatContent() {
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPartenaire, setEditingPartenaire] = useState<Partenaire | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPays, setFilterPays] = useState('tous');
  const [filterDomaine, setFilterDomaine] = useState('tous');

  // Liste complète des pays pour la liste déroulante
  const paysList = [
    'Afghanistan', 'Afrique du Sud', 'Albanie', 'Algérie', 'Allemagne', 'Andorre', 'Angola', 'Antigua-et-Barbuda',
    'Arabie Saoudite', 'Argentine', 'Arménie', 'Australie', 'Autriche', 'Azerbaïdjan', 'Bahamas', 'Bahreïn',
    'Bangladesh', 'Barbade', 'Belgique', 'Bélize', 'Bénin', 'Bhoutan', 'Biélorussie', 'Birmanie', 'Bolivie',
    'Bosnie-Herzégovine', 'Botswana', 'Brésil', 'Brunei', 'Bulgarie', 'Burkina Faso', 'Burundi', 'Cambodge',
    'Cameroun', 'Canada', 'Cap-Vert', 'Chili', 'Chine', 'Chypre', 'Colombie', 'Comores', 'Congo', 'Costa Rica',
    'Côte d\'Ivoire', 'Croatie', 'Cuba', 'Danemark', 'Djibouti', 'Égypte', 'Émirats arabes unis', 'Équateur',
    'Érythrée', 'Espagne', 'Estonie', 'États-Unis', 'Éthiopie', 'Fidji', 'Finlande', 'France', 'Gabon', 'Gambie',
    'Géorgie', 'Ghana', 'Grèce', 'Guatemala', 'Guinée', 'Guinée-Bissau', 'Guinée équatoriale', 'Guyana',
    'Haïti', 'Honduras', 'Hongrie', 'Inde', 'Indonésie', 'Irak', 'Iran', 'Irlande', 'Islande', 'Israël',
    'Italie', 'Jamaïque', 'Japon', 'Jordanie', 'Kazakhstan', 'Kenya', 'Kirghizistan', 'Kiribati', 'Koweït',
    'Laos', 'Lesotho', 'Lettonie', 'Liban', 'Libéria', 'Libye', 'Liechtenstein', 'Lituanie', 'Luxembourg',
    'Macédoine du Nord', 'Madagascar', 'Malaisie', 'Malawi', 'Maldives', 'Mali', 'Malte', 'Maroc',
    'Maurice', 'Mauritanie', 'Mexique', 'Moldavie', 'Monaco', 'Mongolie', 'Monténégro', 'Mozambique',
    'Namibie', 'Népal', 'Nicaragua', 'Niger', 'Nigeria', 'Norvège', 'Nouvelle-Zélande', 'Oman', 'Ouganda',
    'Ouzbékistan', 'Pakistan', 'Panama', 'Papouasie-Nouvelle-Guinée', 'Paraguay', 'Pays-Bas', 'Pérou',
    'Philippines', 'Pologne', 'Portugal', 'Qatar', 'République centrafricaine', 'République démocratique du Congo',
    'République dominicaine', 'République tchèque', 'Roumanie', 'Royaume-Uni', 'Russie', 'Rwanda',
    'Saint-Kitts-et-Nevis', 'Saint-Marin', 'Saint-Vincent-et-les Grenadines', 'Salomon', 'Salvador',
    'Sénégal', 'Serbie', 'Seychelles', 'Sierra Leone', 'Singapour', 'Slovaquie', 'Slovénie', 'Somalie',
    'Soudan', 'Soudan du Sud', 'Sri Lanka', 'Suède', 'Suisse', 'Suriname', 'Swaziland', 'Syrie',
    'Tadjikistan', 'Tanzanie', 'Tchad', 'Thaïlande', 'Togo', 'Tonga', 'Trinité-et-Tobago', 'Tunisie',
    'Turkménistan', 'Turquie', 'Ukraine', 'Uruguay', 'Vanuatu', 'Vatican', 'Venezuela', 'Vietnam',
    'Yémen', 'Zambie', 'Zimbabwe'
  ];

  const [formData, setFormData] = useState({
    nomBureau: '',
    contact: '',
    cabinetsAyantPostule: '',
    contacts: '',
    domaineExpertise: '',
    pays: '',
    marcheGagne: '',
    duree: '',
    bailleur: '',
    valeur: '',
    marcheAttribueLe: ''
  });

  useEffect(() => {
    const savedPartenaires = localStorage.getItem('partenaires');
    if (savedPartenaires) {
      setPartenaires(JSON.parse(savedPartenaires));
    }
  }, []);

  const savePartenaires = (newPartenaires: Partenaire[]) => {
    localStorage.setItem('partenaires', JSON.stringify(newPartenaires));
    setPartenaires(newPartenaires);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPartenaire) {
      const updatedPartenaires = partenaires.map(p => 
        p.id === editingPartenaire.id 
          ? { ...formData, id: p.id, dateCreation: p.dateCreation }
          : p
      );
      savePartenaires(updatedPartenaires);
      setEditingPartenaire(null);
    } else {
      const newPartenaire: Partenaire = {
        ...formData,
        id: Date.now().toString(),
        dateCreation: new Date().toISOString()
      };
      savePartenaires([...partenaires, newPartenaire]);
    }
    
    setFormData({
      nomBureau: '',
      contact: '',
      cabinetsAyantPostule: '',
      contacts: '',
      domaineExpertise: '',
      pays: '',
      marcheGagne: '',
      duree: '',
      bailleur: '',
      valeur: '',
      marcheAttribueLe: ''
    });
    setShowForm(false);
  };

  const handleEdit = (partenaire: Partenaire) => {
    setEditingPartenaire(partenaire);
    setFormData({
      nomBureau: partenaire.nomBureau,
      contact: partenaire.contact,
      cabinetsAyantPostule: partenaire.cabinetsAyantPostule,
      contacts: partenaire.contacts,
      domaineExpertise: partenaire.domaineExpertise,
      pays: partenaire.pays,
      marcheGagne: partenaire.marcheGagne,
      duree: partenaire.duree,
      bailleur: partenaire.bailleur,
      valeur: partenaire.valeur,
      marcheAttribueLe: partenaire.marcheAttribueLe
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) {
      const updatedPartenaires = partenaires.filter(p => p.id !== id);
      savePartenaires(updatedPartenaires);
    }
  };

  const filteredPartenaires = partenaires.filter(partenaire => {
    const matchesSearch = !searchTerm || 
      partenaire.nomBureau.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partenaire.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partenaire.domaineExpertise.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPays = filterPays === 'tous' || partenaire.pays === filterPays;
    const matchesDomaine = filterDomaine === 'tous' || partenaire.domaineExpertise === filterDomaine;
    
    return matchesSearch && matchesPays && matchesDomaine;
  });

  const paysUniques = [...new Set(partenaires.map(p => p.pays))].filter(Boolean);
  const domainesUniques = [...new Set(partenaires.map(p => p.domaineExpertise))].filter(Boolean);

  return (
    <>
      {/* Header de la page */}
      <header className="page-header bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion des Partenaires
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos partenaires et leurs informations
          </p>
        </div>
      </header>

      {/* Contenu de la page */}
      <div className="page-content">
        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingPartenaire(null);
              setFormData({
                nomBureau: '',
                contact: '',
                cabinetsAyantPostule: '',
                contacts: '',
                domaineExpertise: '',
                pays: '',
                marcheGagne: '',
                duree: '',
                bailleur: '',
                valeur: '',
                marcheAttribueLe: ''
              });
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <span className="mr-2">➕</span>
            Nouveau Partenaire
          </button>
        </div>

        {showForm && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingPartenaire ? 'Modifier le Partenaire' : 'Nouveau Partenaire'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingPartenaire(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom du Bureau *
                  </label>
                  <input
                    type="text"
                    name="nomBureau"
                    value={formData.nomBureau}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact *
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cabinets Ayant Postulé
                  </label>
                  <input
                    type="text"
                    name="cabinetsAyantPostule"
                    value={formData.cabinetsAyantPostule}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contacts
                  </label>
                  <input
                    type="text"
                    name="contacts"
                    value={formData.contacts}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Domaine d'Expertise *
                  </label>
                  <input
                    type="text"
                    name="domaineExpertise"
                    value={formData.domaineExpertise}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pays *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tapez pour rechercher un pays..."
                      value={formData.pays}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData(prev => ({ ...prev, pays: value }));
                      }}
                      onFocus={() => {
                        const select = document.getElementById('pays-select');
                        if (select) select.style.display = 'block';
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <div
                      id="pays-select"
                      className="absolute top-full left-0 right-0 z-10 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg hidden"
                      onBlur={() => {
                        setTimeout(() => {
                          const select = document.getElementById('pays-select');
                          if (select) select.style.display = 'none';
                        }, 200);
                      }}
                    >
                      {paysList
                        .filter(pays => 
                          pays.toLowerCase().includes(formData.pays.toLowerCase()) || 
                          formData.pays === ''
                        )
                        .map((pays) => (
                          <div
                            key={pays}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, pays }));
                              const select = document.getElementById('pays-select');
                              if (select) select.style.display = 'none';
                            }}
                          >
                            {pays}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Marché Gagné
                  </label>
                  <input
                    type="text"
                    name="marcheGagne"
                    value={formData.marcheGagne}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Durée
                  </label>
                  <input
                    type="text"
                    name="duree"
                    value={formData.duree}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bailleur
                  </label>
                  <input
                    type="text"
                    name="bailleur"
                    value={formData.bailleur}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valeur
                  </label>
                  <input
                    type="text"
                    name="valeur"
                    value={formData.valeur}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Marché Attribué Le
                  </label>
                  <input
                    type="date"
                    name="marcheAttribueLe"
                    value={formData.marcheAttribueLe}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPartenaire(null);
                  }}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingPartenaire ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtres et recherche */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recherche
              </label>
              <input
                type="text"
                placeholder="Rechercher un partenaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pays
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tapez pour rechercher un pays..."
                  value={filterPays === 'tous' ? '' : filterPays}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setFilterPays('tous');
                    } else {
                      setFilterPays(value);
                    }
                  }}
                  onFocus={() => {
                    const select = document.getElementById('filter-pays-select');
                    if (select) select.style.display = 'block';
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <div
                  id="filter-pays-select"
                  className="absolute top-full left-0 right-0 z-10 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg hidden"
                  onBlur={() => {
                    setTimeout(() => {
                      const select = document.getElementById('filter-pays-select');
                      if (select) select.style.display = 'none';
                    }, 200);
                  }}
                >
                  <div
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-200 dark:border-gray-600 font-medium text-blue-600 dark:text-blue-400"
                    onClick={() => {
                      setFilterPays('tous');
                      const select = document.getElementById('filter-pays-select');
                      if (select) select.style.display = 'none';
                    }}
                  >
                    Tous les pays
                  </div>
                  {paysList
                    .filter(pays => 
                      pays.toLowerCase().includes((filterPays === 'tous' ? '' : filterPays).toLowerCase()) || 
                      filterPays === 'tous'
                    )
                    .map((pays) => (
                      <div
                        key={pays}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                        onClick={() => {
                          setFilterPays(pays);
                          const select = document.getElementById('filter-pays-select');
                          if (select) select.style.display = 'none';
                        }}
                      >
                        {pays}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Domaine
              </label>
              <select
                value={filterDomaine}
                onChange={(e) => setFilterDomaine(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="tous">Tous les domaines</option>
                {domainesUniques.map((domaine) => (
                  <option key={domaine} value={domaine}>{domaine}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Affichage
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'table'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  📊 Tableau
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  🃏 Cartes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Affichage des partenaires */}
        {filteredPartenaires.length > 0 ? (
          viewMode === 'table' ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Bureau
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Domaine
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Pays
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Marché
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredPartenaires.map((partenaire) => (
                      <tr key={partenaire.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {partenaire.nomBureau}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {partenaire.contact}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {partenaire.domaineExpertise}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {partenaire.pays}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {partenaire.marcheGagne || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(partenaire)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(partenaire.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartenaires.map((partenaire) => (
                <div key={partenaire.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {partenaire.nomBureau}
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(partenaire)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(partenaire.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Contact:</span>
                      <p className="text-gray-900 dark:text-white">{partenaire.contact}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Domaine:</span>
                      <p className="text-gray-900 dark:text-white">{partenaire.domaineExpertise}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Pays:</span>
                      <p className="text-gray-900 dark:text-white">{partenaire.pays}</p>
                    </div>
                    
                    {partenaire.marcheGagne && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Marché gagné:</span>
                        <p className="text-gray-900 dark:text-white">{partenaire.marcheGagne}</p>
                      </div>
                    )}
                    
                    {partenaire.valeur && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Valeur:</span>
                        <p className="text-gray-900 dark:text-white">{partenaire.valeur}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun partenaire trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || filterPays !== 'tous' || filterDomaine !== 'tous'
                ? 'Aucun partenaire ne correspond à vos critères de recherche.'
                : 'Commencez par ajouter votre premier partenaire.'}
            </p>
            {!searchTerm && filterPays === 'tous' && filterDomaine === 'tous' && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter un partenaire
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
