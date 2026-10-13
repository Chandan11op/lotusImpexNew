import React, { useState, useRef, useEffect } from 'react';
import { useTheme, Theme } from '../../context/ThemeContext';
import { Sun, Moon, Laptop, ChevronDown, Check } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
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

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="h-3.5 w-3.5 text-amber-500" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="h-3.5 w-3.5 text-indigo-400" /> },
    { value: 'system', label: 'System', icon: <Laptop className="h-3.5 w-3.5 text-cyan-400" /> },
  ];

  const currentIcon =
    theme === 'system' ? (
      <Laptop className="h-3.5 w-3.5 text-cyan-400" />
    ) : resolvedTheme === 'dark' ? (
      <Moon className="h-3.5 w-3.5 text-indigo-400" />
    ) : (
      <Sun className="h-3.5 w-3.5 text-amber-500" />
    );

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-steel-700 dark:text-steel-200 hover:bg-steel-100 dark:hover:bg-steel-800 border border-steel-200 dark:border-steel-700 transition-colors"
        aria-label="Select Theme Mode"
        aria-expanded={isOpen}
      >
        {currentIcon}
        <span className="capitalize text-[11px] font-medium hidden sm:inline">{theme}</span>
        <ChevronDown className={`h-3 w-3 text-steel-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white dark:bg-steel-900 border border-steel-200 dark:border-steel-700 shadow-xl z-50 py-1 focus:outline-none text-xs">
          {options.map((opt) => {
            const isSelected = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setTheme(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-steel-800 text-brand-blue dark:text-cyan-400 font-bold'
                    : 'text-steel-700 dark:text-steel-300 hover:bg-steel-50 dark:hover:bg-steel-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="h-3 w-3 text-brand-blue dark:text-cyan-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
