'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Truck,
  Package,
  Wrench,
  ShoppingCart,
  Bell,
  LogOut,
} from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Clientes',
    href: '/clientes',
    icon: <Users size={20} />,
    roles: ['admin', 'owner', 'recepcion'],
  },
  {
    label: 'Vehículos',
    href: '/vehiculos',
    icon: <Truck size={20} />,
    roles: ['admin', 'owner', 'recepcion'],
  },
  {
    label: 'Productos',
    href: '/productos',
    icon: <Package size={20} />,
    roles: ['admin', 'owner'],
  },
  {
    label: 'Servicios',
    href: '/servicios',
    icon: <Wrench size={20} />,
    roles: ['admin', 'owner', 'mechanic', 'recepcion'],
  },
  {
    label: 'Ventas',
    href: '/ventas',
    icon: <ShoppingCart size={20} />,
    roles: ['admin', 'owner', 'recepcion'],
  },
  {
    label: 'Recordatorios',
    href: '/recordatorios',
    icon: <Bell size={20} />,
    roles: ['admin', 'owner'],
  },
];

export const Sidebar: React.FC = () => {
  const { isOpen, toggleSidebar, closeSidebar } = useSidebarStore();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-tesla-border bg-tesla-bg transition-transform duration-300 lg:relative lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-tesla-border p-4">
          <h1 className="text-xl font-bold text-tesla-text">Taller</h1>
          <button
            onClick={toggleSidebar}
            className="lg:hidden"
            aria-label="Toggle sidebar"
          >
            <X size={20} className="text-tesla-text" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded px-4 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-tesla-accent text-tesla-bg'
                        : 'text-tesla-text hover:bg-tesla-hover'
                    )}
                    onClick={closeSidebar}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info and Logout */}
        <div className="border-t border-tesla-border p-4">
          <div className="mb-3">
            {user && (
              <div>
                <p className="text-sm font-medium text-tesla-text">{user.name}</p>
                <p className="text-xs text-gray-400">{user.role}</p>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center gap-2"
            onClick={() => logout()}
          >
            <LogOut size={16} />
            Salir
          </Button>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 right-4 z-40 rounded bg-tesla-accent p-2 text-tesla-bg lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>
    </>
  );
};

