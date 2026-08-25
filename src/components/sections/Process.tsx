import React from 'react';
import { useTranslation } from 'react-i18next';
import { Compass, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const Process: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      number: t('process.step1Num'),
      title: t('process.step1Title'),
      desc: t('process.step1Desc'),
      icon: <Compass className="w-7 h-7 text-[#0B45D8]" />,
    },
    {
      number: t('process.step2Num'),
      title: t('process.step2Title'),
      desc: t('process.step2Desc'),
      icon: <CheckCircle2 className="w-7 h-7 text-[#0B45D8]" />,
    },
    {
      number: t('process.step3Num'),
      title: t('process.step3Title'),
      desc: t('process.step3Desc'),
      icon: <ShieldCheck className="w-7 h-7 text-[#0B45D8]" />,
    },
  ];

  return (
    <section id="como-funciona" className="section-padding relative bg-[#09172C] text-white">
      <div className="container-pepek">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-[#8899BB] uppercase tracking-widest mb-4">
            <span>{t('process.tag')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 font-inter">
            {t('process.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 relative hover:border-[#0B45D8]/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#0B45D8]/20 border border-[#0B45D8]/40 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-black text-white/20 font-mono">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>

                <p className="text-sm text-gray-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-20 text-white/30">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
