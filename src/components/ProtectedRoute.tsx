'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { user, isLoading, error } = useAuth();

  useEffect(() => {
    if (!isLoading && (error || !user)) {
      router.push('/login');
    }
  }, [user, isLoading, error, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-tesla-bg">
        <div className="text-center">
          <div className="mb-4 animate-spin">
            <div className="h-12 w-12 rounded-full border-4 border-tesla-border border-t-tesla-accent" />
          </div>
          <p className="text-tesla-text">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-tesla-bg">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

