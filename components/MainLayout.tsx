'use client';

import React from 'react';
import SidebarNavigation from './SidebarNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function MainLayout({ children, className = '' }: MainLayoutProps) {
  return (
    <div className="main-layout">
      <SidebarNavigation />
      <main className={`main-content ${className}`}>
        {children}
      </main>
    </div>
  );
}
