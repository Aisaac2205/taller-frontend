'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useAuth } from '@/hooks/useAuth';

export const Header: React.FC = () => {
  const { toggleSidebar } = useSidebarStore();
  const { user } = useAuth();

  return (
    <header className="border-b border-tesla-border bg-tesla-bg px-4 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} className="text-tesla-text" />
        </button>
        <h1 className="text-xl font-semibold text-tesla-text">
          Bienvenido, {user?.name}
        </h1>
        <div className="w-6" />
      </div>
    </header>
  );
};

