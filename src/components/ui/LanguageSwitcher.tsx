import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC<{ variant?: 'light' | 'dark' }> = ({ variant = 'light' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.slice(0, 2).toLowerCase() || 'pt';

  const languages = [
    { code: 'pt', label: 'PT', flag: '🇦🇴', name: 'Português' },
    { code: 'en', label: 'EN', flag: '🇬🇧', name: 'English' },
    { code: 'fr', label: 'FR', flag: '🇫🇷', name: 'Français' },
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  const isDark = variant === 'dark';

  return (
    <div className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/15">
      <Globe className={`w-3.5 h-3.5 ml-2 mr-1 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
      {languages.map((lang) => {
        const isActive = currentLang === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1 ${
              isActive
                ? 'bg-[#0B45D8] text-white shadow-sm'
                : isDark
                ? 'text-gray-700 hover:text-black hover:bg-gray-100'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title={lang.name}
            aria-label={`Mudar para ${lang.name}`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        );
      })}
    </div>
  );
};
