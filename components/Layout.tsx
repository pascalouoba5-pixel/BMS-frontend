'use client';

import { ReactNode } from 'react';
import SidebarNavigation from './SidebarNavigation';
import AlertBanner from './AlertBanner';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNavigation />
      <main className="flex-1 overflow-auto md:ml-72 transition-all duration-300">
        {/* Bannière d'alertes */}
        <AlertBanner />
        
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
