'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [currentYear] = useState(new Date().getFullYear());

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Section principale du footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo et description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">BMS</h3>
                <p className="text-blue-200 text-sm">Business Management System</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Système de gestion des offres commerciales pour optimiser vos processus 
              de veille, présélection et suivi des opportunités.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-300">Navigation Rapide</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  🏠 Accueil
                </Link>
              </li>
              <li>
                <Link href="/offres" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  📋 Gestion des offres
                </Link>
              </li>
              <li>
                <Link href="/repartition/gestion-repartition" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  📊 Répartition
                </Link>
              </li>
              <li>
                <Link href="/montage-administratif" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  📋 Montage administratif
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  📈 Dashboard
                </Link>
              </li>
            </ul>
          </div>

                     {/* Fonctionnalités */}
           <div>
             <h4 className="text-lg font-semibold mb-4 text-blue-300">Fonctionnalités</h4>
             <ul className="space-y-3">
               <li>
                 <Link href="/ajouter-offre" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                   ➕ Ajouter une offre
                 </Link>
               </li>
               <li>
                 <Link href="/valider-offre" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                   ✅ Valider les offres
                 </Link>
               </li>
               <li>
                 <Link href="/offre-du-jour" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                   📅 Offres du jour
                 </Link>
               </li>
               <li>
                 <Link href="/repartition/pole-lead" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                   🏢 Gestion des pôles
                 </Link>
               </li>
               <li>
                 <Link href="/suivi-resultats" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                   📊 Suivi des résultats
                 </Link>
               </li>
               <li>
                 <Link href="/acces-reserve" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                   🔒 Accès réservé
                 </Link>
               </li>
               <li>
                 <Link href="/recherche-automatique" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                   🔍 Recherche automatique
                 </Link>
               </li>
             </ul>
           </div>

                     {/* Contact et support */}
           <div>
             <h4 className="text-lg font-semibold mb-4 text-blue-300">Support</h4>
             <ul className="space-y-3">
               <li className="flex items-center text-gray-300 text-sm">
                 <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                 </svg>
                 contact@amd-international.net
               </li>
               <li className="flex items-center text-gray-300 text-sm">
                 <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                 </svg>
                 +226 25369976
               </li>
               <li className="flex items-center text-gray-300 text-sm">
                 <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
                 Cité 1200 logements, Rue Tiéfo Amoro Villa 397
               </li>
               <li className="flex items-center text-gray-300 text-sm">
                 <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                 </svg>
                 09 BP 631 Ouagadougou 09-Burkina Faso
               </li>
             </ul>
            
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-blue-300 mb-3">Besoin d'aide ?</h5>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                💬 Assistant BMS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} BMS - Business Management System. Tous droits réservés.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de statut */}
      <div className="bg-green-600 text-white text-center py-2 text-sm">
        <div className="flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
          Système opérationnel - Toutes les fonctionnalités disponibles
        </div>
      </div>
    </footer>
  );
}
