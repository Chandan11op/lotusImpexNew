import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useLocale } from '../../context/LocaleContext';
import { LanguageSelector } from '../ui/LanguageSelector';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Menu, X, Shield, Phone, Mail, FileText, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onRequestQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRequestQuote }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLocale();

  const navLinks = [
    { label: t('navHome'), path: '/' },
    { label: t('navProducts'), path: '/products' },
    { label: t('navIndustries'), path: '/industries' },
    { label: t('navQuality'), path: '/quality' },
    { label: t('navAbout'), path: '/about' },
    { label: t('navContact'), path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-steel-900/95 backdrop-blur-md border-b border-steel-200 dark:border-steel-800 shadow-xs transition-colors">
      {/* Top micro bar for contact info, language, theme & quick CRM access */}
      <div className="bg-steel-900 dark:bg-steel-950 text-steel-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8 hidden md:block border-b border-steel-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-cyan-400" />
              <span>+91 22 2847 0000 / +91 98200 00000 (Mumbai)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-cyan-400" />
              <span>sales@lotusimpex.com</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Locale & Theme in top bar */}
            <LanguageSelector variant="compact" />
            <ThemeToggle />

            <span className="text-steel-600">|</span>
            <Link
              to={user ? '/crm' : '/login'}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <Shield className="h-3 w-3" />
              <span>{user ? `CRM (${user.name.split(' ')[0]})` : t('navCrmLogin')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo / Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-lg bg-steel-900 dark:bg-steel-800 border border-steel-700 flex items-center justify-center text-cyan-400 shadow-sm group-hover:border-cyan-400 transition-colors">
              <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 6L23 13V21L16 26L9 21V13L16 6Z"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <circle cx="16" cy="16" r="3" fill="currentColor" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-steel-900 dark:text-white group-hover:text-brand-blue dark:group-hover:text-cyan-400 transition-colors">
                LOTUS IMPEX
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-steel-500 dark:text-steel-400">
                Precision Stainless Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'text-brand-blue dark:text-cyan-400 bg-blue-50/80 dark:bg-steel-800 font-bold'
                    : 'text-steel-600 dark:text-steel-300 hover:text-steel-900 dark:hover:text-white hover:bg-steel-50 dark:hover:bg-steel-800/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={onRequestQuote}
              icon={<FileText className="h-4 w-4" />}
            >
              {t('navRequestQuote')}
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={onRequestQuote}
              className="text-xs px-2.5 py-1.5 sm:hidden"
            >
              Quote
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-steel-600 hover:text-steel-900 hover:bg-steel-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-steel-200 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold ${
                isActive(link.path)
                  ? 'bg-blue-50 text-brand-blue font-bold'
                  : 'text-steel-700 hover:bg-steel-50'
              }`}
            >
              <span>{link.label}</span>
              <ChevronRight className="h-4 w-4 text-steel-400" />
            </Link>
          ))}
          <div className="pt-4 border-t border-steel-100 flex flex-col gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setMobileMenuOpen(false);
                onRequestQuote();
              }}
              className="w-full justify-center"
            >
              Request a Quote
            </Button>
            <Link
              to={user ? '/crm' : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button variant="outline" size="md" className="w-full justify-center gap-2">
                <Shield className="h-4 w-4 text-steel-600" />
                <span>{user ? 'Open CRM Dashboard' : 'Staff CRM Login'}</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
