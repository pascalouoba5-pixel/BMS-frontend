'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface FichierTDR {
  id: number;
  nom_fichier: string;
  type_mime: string;
  taille: number;
  date_upload: string;
  description: string;
  version: string;
}

interface TDRManagerProps {
  offreId: number;
  onFichiersUpdate?: () => void;
}

export default function TDRManager({ offreId, onFichiersUpdate }: TDRManagerProps) {
  const [fichiers, setFichiers] = useState<FichierTDR[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('1.0');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchFichiersTDR();
  }, [offreId]);

  const fetchFichiersTDR = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/fichiers-tdr/offre/${offreId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFichiers(data.fichiers || []);
      } else {
        console.error('Erreur lors de la récupération des fichiers TDR');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des fichiers TDR:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximum : 10MB');
        return;
      }

      // Vérifier le type de fichier
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (!allowedTypes.includes(file.type)) {
        alert('Type de fichier non supporté. Seuls les fichiers PDF, Word et Excel sont acceptés.');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !token) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('fichier', selectedFile);
      formData.append('description', description);
      formData.append('version', version);

      const response = await fetch(`/api/fichiers-tdr/upload/${offreId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        alert('Fichier TDR uploadé avec succès !');
        
        // Réinitialiser le formulaire
        setSelectedFile(null);
        setDescription('');
        setVersion('1.0');
        setShowUploadForm(false);
        
        // Actualiser la liste des fichiers
        fetchFichiersTDR();
        
        // Notifier le composant parent
        if (onFichiersUpdate) {
          onFichiersUpdate();
        }
      } else {
        const errorData = await response.json();
        alert(`Erreur lors de l'upload: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload du fichier');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fichierId: number, nomFichier: string) => {
    if (!token) return;

    try {
      const response = await fetch(`/api/fichiers-tdr/download/${fichierId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nomFichier;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Erreur lors du téléchargement du fichier');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du fichier');
    }
  };

  const handleDelete = async (fichierId: number) => {
    if (!token || !confirm('Êtes-vous sûr de vouloir supprimer ce fichier TDR ?')) return;

    try {
      const response = await fetch(`/api/fichiers-tdr/${fichierId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Fichier TDR supprimé avec succès !');
        fetchFichiersTDR();
        
        if (onFichiersUpdate) {
          onFichiersUpdate();
        }
      } else {
        alert('Erreur lors de la suppression du fichier');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du fichier');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (typeMime: string) => {
    if (typeMime.includes('pdf')) return 'ri-file-pdf-line text-red-500';
    if (typeMime.includes('word')) return 'ri-file-word-line text-blue-500';
    if (typeMime.includes('excel')) return 'ri-file-excel-line text-green-500';
    return 'ri-file-line text-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement des fichiers TDR...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête avec bouton d'upload */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <i className="ri-file-list-3-line text-blue-600 mr-2"></i>
          Fichiers TDR ({fichiers.length})
        </h3>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <i className="ri-upload-line"></i>
          {showUploadForm ? 'Masquer' : 'Ajouter un fichier'}
        </button>
      </div>

      {/* Formulaire d'upload */}
      {showUploadForm && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fichier TDR *
              </label>
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                PDF, Word, Excel - Max 10MB
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description du fichier"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Version
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowUploadForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Upload en cours...
                </>
              ) : (
                <>
                  <i className="ri-upload-line"></i>
                  Uploader
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Liste des fichiers */}
      {fichiers.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-file-line text-2xl text-gray-400"></i>
          </div>
          <p className="text-gray-600">Aucun fichier TDR disponible</p>
          <p className="text-sm text-gray-500 mt-1">
            Ajoutez des fichiers TDR pour cette offre
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {fichiers.map((fichier) => (
            <div
              key={fichier.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i className={`text-xl ${getFileIcon(fichier.type_mime)}`}></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{fichier.nom_fichier}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{formatFileSize(fichier.taille)}</span>
                    <span>Version {fichier.version}</span>
                    <span>{new Date(fichier.date_upload).toLocaleDateString('fr-FR')}</span>
                    {fichier.description && (
                      <span className="text-gray-600">{fichier.description}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(fichier.id, fichier.nom_fichier)}
                  className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Télécharger"
                >
                  <i className="ri-download-line text-lg"></i>
                </button>
                <button
                  onClick={() => handleDelete(fichier.id)}
                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Supprimer"
                >
                  <i className="ri-delete-bin-line text-lg"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
