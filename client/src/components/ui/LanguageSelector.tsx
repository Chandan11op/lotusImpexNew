import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from '../../context/LocaleContext';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LocaleCode } from '../../i18n/types';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { currentLocale, localeDef, supportedLocales, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-steel-700 dark:text-steel-200 hover:bg-steel-100 dark:hover:bg-steel-800 border border-steel-200 dark:border-steel-700 transition-colors"
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe className="h-3.5 w-3.5 text-brand-lightBlue shrink-0" />
        <span className="text-base leading-none">{localeDef.flag}</span>
        {variant === 'full' && <span>{localeDef.nativeName}</span>}
        <span className="uppercase text-[11px] font-mono tracking-wider">{localeDef.code}</span>
        <ChevronDown className={`h-3 w-3 text-steel-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-56 max-h-80 overflow-y-auto rounded-xl bg-white dark:bg-steel-900 border border-steel-200 dark:border-steel-700 shadow-xl z-50 py-1.5 focus:outline-none divide-y divide-steel-100 dark:divide-steel-800 text-xs">
          <div className="px-3 py-1.5 font-bold uppercase tracking-wider text-[10px] text-steel-400 dark:text-steel-500">
            Select Language (15 Locales)
          </div>
          <div className="py-1">
            {supportedLocales.map((loc) => {
              const isSelected = loc.code === currentLocale;
              return (
                <button
                  key={loc.code}
                  type="button"
                  onClick={() => {
                    setLocale(loc.code as LocaleCode);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-steel-800/80 text-brand-blue dark:text-cyan-400 font-bold'
                      : 'text-steel-700 dark:text-steel-300 hover:bg-steel-50 dark:hover:bg-steel-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{loc.flag}</span>
                    <div>
                      <div className="font-medium">{loc.nativeName}</div>
                      <div className="text-[10px] text-steel-400 dark:text-steel-500">
                        {loc.name} ({loc.code.toUpperCase()})
                        {loc.dir === 'rtl' ? ' • RTL' : ''}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-brand-blue dark:text-cyan-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
