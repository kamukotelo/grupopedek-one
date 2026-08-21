import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, Languages } from 'lucide-react';

export const LanguageSwitcher: React.FC<{ variant?: 'light' | 'dark' }> = ({ variant = 'light' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.slice(0, 2).toLowerCase() || 'pt';
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'pt', flag: '🇦🇴', name: 'Português' },
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  const isDark = variant === 'dark';
  const activeLanguage = languages.find((language) => language.code === currentLang) ?? languages[0];

  useEffect(() => {
    const closeSwitcher = (event: MouseEvent) => {
      if (!switcherRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', closeSwitcher);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeSwitcher);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <div ref={switcherRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`group flex h-11 items-center gap-2 rounded-xl border px-2.5 font-bold transition-all duration-200 ${
          isDark
            ? 'border-slate-200 bg-slate-50 text-[#07133F] hover:border-[#B68D13] hover:bg-white'
            : 'border-white/15 bg-white/10 text-white hover:border-[#D2A820]/70 hover:bg-white/15'
        } ${isOpen ? 'border-[#B68D13] ring-2 ring-[#D2A820]/15' : ''}`}
        aria-label="Selecionar idioma"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span className={`grid h-7 w-7 place-items-center rounded-lg text-base shadow-sm ${isDark ? 'bg-white' : 'bg-white/10'}`} aria-hidden="true">
          {activeLanguage.flag}
        </span>
        <span className="hidden min-w-[70px] text-left text-xs xl:block">{activeLanguage.name}</span>
        <span className="text-[10px] font-black uppercase tracking-wider xl:hidden">{activeLanguage.code}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180 text-[#B68D13]' : 'opacity-60'}`} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className={`absolute right-0 top-[calc(100%+0.65rem)] z-[80] w-56 overflow-hidden rounded-2xl border p-2 shadow-[0_20px_55px_rgba(2,10,42,0.24)] ${
            isDark ? 'border-slate-200 bg-white text-[#07133F]' : 'border-white/15 bg-[#07133F] text-white'
          }`}
        >
          <div className={`mb-1 flex items-center gap-2 border-b px-3 py-2.5 ${isDark ? 'border-slate-100 text-slate-500' : 'border-white/10 text-slate-400'}`}>
            <Languages className="h-4 w-4 text-[#B68D13]" />
            <span className="text-[10px] font-black uppercase tracking-[0.14em]">Selecionar idioma</span>
          </div>
          {languages.map((lang) => {
            const isActive = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  isActive
                    ? isDark ? 'bg-[#07133F] text-white' : 'bg-[#D2A820] text-[#020A2A]'
                    : isDark ? 'hover:bg-slate-100' : 'hover:bg-white/10'
                }`}
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-lg shadow-sm" aria-hidden="true">{lang.flag}</span>
                <span className="flex-1 text-xs font-extrabold">{lang.name}</span>
                {isActive && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
