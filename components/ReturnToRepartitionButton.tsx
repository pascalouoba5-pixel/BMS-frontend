'use client';

import Link from 'next/link';

interface ReturnToRepartitionButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export default function ReturnToRepartitionButton({
  className = '',
  variant = 'default',
  size = 'md'
}: ReturnToRepartitionButtonProps) {
  const baseClasses = 'inline-flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105';
  
  const variantClasses = {
    default: 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-md',
    outline: 'border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white',
    icon: 'bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200'
  };
  
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <Link href="/repartition/vue-repetitions" className={classes}>
      <i className="ri-arrow-left-line"></i>
      {variant !== 'icon' && <span>Retour à la Gestion de Répartition</span>}
    </Link>
  );
}
