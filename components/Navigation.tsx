'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getRoleMenu, canAccessPage } from '../utils/permissions';

export default function Navigation() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>('');
  const [navItems, setNavItems] = useState<any[]>([]);

  useEffect(() => {
    // Récupérer le rôle utilisateur depuis localStorage
    const role = localStorage.getItem('userRole') || 
                 (localStorage.getItem('isSuperAdmin') === 'true' ? 's_admin' : '');
    setUserRole(role);

    // Obtenir le menu selon le rôle
    if (role) {
      const roleMenu = getRoleMenu(role);
      setNavItems(roleMenu);
    } else {
      // Menu par défaut si pas de rôle
      setNavItems([
        { name: 'Accueil', href: '/', icon: 'ri-home-line' },
        { name: 'Dashboard', href: '/dashboard', icon: 'ri-dashboard-line' }
      ]);
    }
  }, []);

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <img 
                src="https://static.readdy.ai/image/36ce116ccdb0d05752a287dd792317ce/3a2cd734c9129790560cc32a9975e166.jfif" 
                alt="AMD Logo" 
                className="h-10 cursor-pointer"
              />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer ${
                  pathname === item.href ? 'text-blue-600 font-medium' : ''
                }`}
              >
                <i className={item.icon}></i>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
