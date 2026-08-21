import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC<{ variant?: 'light' | 'dark' }> = ({ variant = 'light' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.slice(0, 2).toLowerCase() || 'pt';

  const languages = [
    { code: 'pt', label: 'PT', name: 'Português' },
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'fr', label: 'FR', name: 'Français' },
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex items-center rounded-lg border p-1 ${isDark ? 'border-slate-200 bg-slate-50' : 'border-white/15 bg-white/10'}`}>
      {languages.map((lang) => {
        const isActive = currentLang === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-2 py-1 text-[10px] font-black rounded-md transition-all duration-200 ${
              isActive
                ? 'bg-[#0B45D8] text-white shadow-sm'
                : isDark
                ? 'text-gray-700 hover:text-black hover:bg-gray-100'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title={lang.name}
            aria-label={`Mudar para ${lang.name}`}
          >
            <span>{lang.label}</span>
          </button>
        );
      })}
    </div>
  );
};
