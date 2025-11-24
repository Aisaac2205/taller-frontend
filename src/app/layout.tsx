import type { Metadata } from 'next';
import React from 'react';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Taller - Sistema de Gestión',
  description: 'Sistema de gestión para talleres mecánicos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-tesla-bg text-tesla-text">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

