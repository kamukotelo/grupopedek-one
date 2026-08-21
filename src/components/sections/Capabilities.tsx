import React from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Landmark, Trophy, Fuel, Wrench, Map } from 'lucide-react';

export const Capabilities: React.FC = () => {
  const { t } = useTranslation();

  const capabilities = [
    {
      icon: <Briefcase className="w-5 h-5 text-[#0B45D8]" />,
      text: t('capabilities.c1'),
    },
    {
      icon: <Landmark className="w-5 h-5 text-[#0B45D8]" />,
      text: t('capabilities.c2'),
    },
    {
      icon: <Trophy className="w-5 h-5 text-[#0B45D8]" />,
      text: t('capabilities.c3'),
    },
    {
      icon: <Fuel className="w-5 h-5 text-[#0B45D8]" />,
      text: t('capabilities.c4'),
    },
    {
      icon: <Wrench className="w-5 h-5 text-[#0B45D8]" />,
      text: t('capabilities.c5'),
    },
    {
      icon: <Map className="w-5 h-5 text-[#0B45D8]" />,
      text: t('capabilities.c6'),
    },
  ];

  return (
    <section className="py-16 bg-[#030D1F] text-white border-y border-white/10">
      <div className="container-pepek">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0B45D8]">
            {t('capabilities.tag')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {t('capabilities.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((cap, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#0B45D8]/60 hover:bg-[#0B45D8]/10 transition-all"
            >
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 shrink-0">
                {cap.icon}
              </div>
              <span className="text-sm font-semibold text-gray-200">
                {cap.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
