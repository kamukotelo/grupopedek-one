import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Award, Clock, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="inicio" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#06142F]">
      {/* Background Cinematic Image with Luxury SUVs & Navy Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=85"
          alt="Frota Executiva PEPEK GRUPO Angola"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.38] contrast-[1.1]"
          loading="eager"
        />
        {/* Navy & Royal Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06142F]/98 via-[#06142F]/85 to-[#06142F]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06142F] via-transparent to-[#06142F]/70" />
        {/* Subtle accent glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0B45D8]/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="container-pepek relative z-10 w-full">
        <div className="max-w-3xl">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-gray-200 uppercase tracking-widest mb-6 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-[#0B45D8] animate-pulse"></span>
            <span>{t('hero.tag')}</span>
          </div>

          {/* Main Title & Slogan */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6 font-inter">
            {t('hero.title').split('Angola')[0]}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#0B45D8]">
              Angola.
            </span>
          </h1>

          {/* Supporting Statement */}
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-9 leading-relaxed font-light max-w-2xl">
            {t('hero.description')}
          </p>

          {/* Key Trust Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10 text-xs sm:text-sm text-gray-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0B45D8] shrink-0" />
              <span>Embaixadas & Delegações</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0B45D8] shrink-0" />
              <span>Contratos Corporativos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0B45D8] shrink-0" />
              <span>Luanda · Huambo · Bengo</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href="#reserva"
              className="btn-primary flex items-center justify-center gap-3 py-4 px-8 text-base font-bold shadow-2xl"
            >
              <span>{t('hero.ctaBooking')}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="#frota"
              className="btn-outline flex items-center justify-center gap-2 py-4 px-7 text-base font-semibold"
            >
              <span>{t('hero.ctaFleet')}</span>
            </a>
          </div>
        </div>

        {/* Floating KPI Cards Banner */}
        <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* KPI 1 */}
          <div className="hero-stat group hover:border-[#0B45D8]/50 transition-all">
            <div className="flex items-center gap-3 mb-1">
              <Award className="w-5 h-5 text-[#0B45D8]" />
              <span className="stat-number">{t('hero.statYears')}</span>
            </div>
            <span className="text-xs text-gray-400 font-medium">{t('hero.statYearsSub')}</span>
          </div>

          {/* KPI 2 */}
          <div className="hero-stat group hover:border-[#0B45D8]/50 transition-all">
            <div className="flex items-center gap-3 mb-1">
              <Shield className="w-5 h-5 text-[#0B45D8]" />
              <span className="stat-number">{t('hero.statClients')}</span>
            </div>
            <span className="text-xs text-gray-400 font-medium">{t('hero.statClientsSub')}</span>
          </div>

          {/* KPI 3 */}
          <div className="hero-stat group hover:border-[#0B45D8]/50 transition-all">
            <div className="flex items-center gap-3 mb-1">
              <Clock className="w-5 h-5 text-[#0B45D8]" />
              <span className="stat-number">{t('hero.statAssistance')}</span>
            </div>
            <span className="text-xs text-gray-400 font-medium">{t('hero.statAssistanceSub')}</span>
          </div>

          {/* KPI 4 */}
          <div className="hero-stat group hover:border-[#0B45D8]/50 transition-all">
            <div className="flex items-center gap-3 mb-1">
              <MapPin className="w-5 h-5 text-[#0B45D8]" />
              <span className="stat-number">{t('hero.statCoverage')}</span>
            </div>
            <span className="text-xs text-gray-400 font-medium">{t('hero.statCoverageSub')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
