import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import {
  LayoutDashboard,
  Inbox,
  Users,
  Package,
  CalendarCheck,
  BarChart3,
  UserCog,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Bell,
} from 'lucide-react';

export const CrmLayout: React.FC = () => {
  const { user, isLoading, logout, isSuperAdmin } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-steel-900 text-white">
        <LoadingSpinner text="Authenticating CRM session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { label: 'Overview', path: '/crm', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Enquiries Pipeline', path: '/crm/enquiries', icon: <Inbox className="h-4 w-4" /> },
    { label: 'Customer Directory', path: '/crm/customers', icon: <Users className="h-4 w-4" /> },
    { label: 'Product Management', path: '/crm/products', icon: <Package className="h-4 w-4" /> },
    { label: 'Follow-ups & Tasks', path: '/crm/follow-ups', icon: <CalendarCheck className="h-4 w-4" /> },
    { label: 'Reports & Export', path: '/crm/reports', icon: <BarChart3 className="h-4 w-4" /> },
    ...(isSuperAdmin
      ? [
          { label: 'Staff & Roles', path: '/crm/users', icon: <UserCog className="h-4 w-4" /> },
          { label: 'Company Settings', path: '/crm/settings', icon: <Settings className="h-4 w-4" /> },
        ]
      : []),
  ];

  const isActive = (path: string) => {
    if (path === '/crm') return location.pathname === '/crm';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-steel-100 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-navy-950 text-steel-300 border-r border-steel-800 shrink-0">
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-steel-800">
          <Link to="/crm" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-steel-800 border border-steel-700 flex items-center justify-center text-cyan-400">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm tracking-tight block">LOTUS IMPEX</span>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">CRM Engine</span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive(item.path)
                  ? 'bg-brand-blue text-white shadow-xs font-bold'
                  : 'text-steel-400 hover:text-white hover:bg-steel-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-steel-800 bg-steel-900/60">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <span className="text-xs font-bold text-white block truncate">{user.name}</span>
              <span className="text-[10px] text-steel-400 uppercase tracking-wider block">
                {user.role === 'super_admin' ? 'Super Administrator' : 'Staff Engineer'}
              </span>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 text-steel-400 hover:text-red-400 hover:bg-steel-800 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-steel-100 dark:bg-steel-950 transition-colors">
        {/* Top Navigation Header */}
        <header className="h-16 bg-white dark:bg-steel-900 border-b border-steel-200 dark:border-steel-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 shadow-xs transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-steel-600 dark:text-steel-300 hover:bg-steel-100 dark:hover:bg-steel-800 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base font-bold text-steel-800 dark:text-white capitalize truncate">
              {location.pathname === '/crm'
                ? 'Overview & Key Performance Indicators'
                : location.pathname.split('/')[2]?.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-steel-600 dark:text-steel-300 hover:text-brand-blue dark:hover:text-cyan-400 transition-colors px-2.5 py-1.5 rounded-lg border border-steel-200 dark:border-steel-700 hover:border-steel-300"
            >
              <span>Public Website</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <div className="h-8 w-px bg-steel-200 dark:bg-steel-800 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-2 text-xs">
              <div className="h-7 w-7 rounded-full bg-steel-800 dark:bg-steel-700 text-white flex items-center justify-center font-bold text-xs uppercase">
                {user.name.charAt(0)}
              </div>
              <span className="font-semibold text-steel-800 dark:text-steel-200">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Nested View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 max-w-xs bg-navy-950 text-white flex flex-col p-4 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-steel-800">
              <span className="font-bold text-sm">Lotus Impex CRM</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-steel-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold ${
                    isActive(item.path) ? 'bg-brand-blue text-white' : 'text-steel-300'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t border-steel-800 flex justify-between items-center text-xs">
              <span>{user.name}</span>
              <button onClick={() => logout()} className="text-red-400 font-semibold">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
