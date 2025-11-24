'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

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

