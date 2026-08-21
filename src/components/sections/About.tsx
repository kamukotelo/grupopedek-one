import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Clock, EyeOff, Headphones, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: <Shield className="w-6 h-6 text-[#0B45D8]" />,
      title: t('about.val1Title'),
      desc: t('about.val1Desc'),
    },
    {
      icon: <Clock className="w-6 h-6 text-[#0B45D8]" />,
      title: t('about.val2Title'),
      desc: t('about.val2Desc'),
    },
    {
      icon: <EyeOff className="w-6 h-6 text-[#0B45D8]" />,
      title: t('about.val3Title'),
      desc: t('about.val3Desc'),
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#0B45D8]" />,
      title: t('about.val4Title'),
      desc: t('about.val4Desc'),
    },
  ];

  return (
    <section id="sobre" className="section-padding bg-white relative">
      <div className="container-pepek">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Narrative & Founding */}
          <div>
            <div className="tag-label mb-4">
              <span>{t('about.tag')}</span>
            </div>

            <h2 className="section-title mb-6">
              {t('about.title')}
            </h2>

            <p className="text-base text-gray-700 leading-relaxed mb-4">
              {t('about.p1')}
            </p>

            <p className="text-base text-gray-600 leading-relaxed mb-8">
              {t('about.p2')}
            </p>

            {/* Quick Checkpoints */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm font-semibold text-[#06142F]">
                <CheckCircle2 className="w-5 h-5 text-[#0B45D8] shrink-0" />
                <span>Empresa de Direito Angolano constituída e certificada</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-[#06142F]">
                <CheckCircle2 className="w-5 h-5 text-[#0B45D8] shrink-0" />
                <span>Apólices de seguro de cobertura total em todas as viaturas</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-[#06142F]">
                <CheckCircle2 className="w-5 h-5 text-[#0B45D8] shrink-0" />
                <span>Base operacional com oficinas e equipa técnica própria</span>
              </div>
            </div>
          </div>

          {/* Right Column: Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:border-[#0B45D8]/50 hover:bg-blue-50/30 transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-white shadow-sm w-fit mb-4 border border-gray-100">
                  {v.icon}
                </div>
                <h3 className="text-base font-bold text-[#06142F] mb-2">
                  {v.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
