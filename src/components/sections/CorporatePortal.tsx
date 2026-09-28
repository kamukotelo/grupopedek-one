import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, UserCheck, FileText, Clock, Building, ArrowRight, Phone } from 'lucide-react';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';
import { Link } from 'react-router-dom';

export const CorporatePortal: React.FC = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: <Clock className="w-6 h-6 text-[#236199]" />,
      title: t('corporatePortal.b1Title'),
      desc: t('corporatePortal.b1Desc')
    },
    {
      icon: <UserCheck className="w-6 h-6 text-[#236199]" />,
      title: t('corporatePortal.b2Title'),
      desc: t('corporatePortal.b2Desc')
    },
    {
      icon: <FileText className="w-6 h-6 text-[#236199]" />,
      title: t('corporatePortal.b3Title'),
      desc: t('corporatePortal.b3Desc')
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#236199]" />,
      title: t('corporatePortal.b4Title'),
      desc: t('corporatePortal.b4Desc')
    },
  ];

  return (
    <section className="section-padding bg-white relative">
      <div className="container-pepek">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#001E4A] via-[#174B86] to-[#001E4A] p-8 text-white shadow-2xl sm:p-12 lg:p-16">
          {/* Background accent lines */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#236199]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-[#8899BB] uppercase tracking-widest mb-4">
              <Building className="w-4 h-4 text-[#236199]" />
              <span>{t('corporatePortal.eyebrow')}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-inter">
              {t('corporatePortal.title')}
            </h2>

            <p className="text-base text-gray-300 mt-4 leading-relaxed">
              {t('corporatePortal.subtitle')}
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#236199]/60 transition-all flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 shrink-0">
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1.5">
                    {b.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Strip */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-base font-bold text-white">
                {t('corporatePortal.ctaTitle')}
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                {t('corporatePortal.ctaSubtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <a
                href={generateQuickWhatsAppUrl(t('corporatePortal.whatsappSubject'))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full sm:w-auto text-xs font-bold py-3.5 px-6 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>{t('corporatePortal.talkToManager')}</span>
              </a>

              <Link
                to="/contactos"
                className="btn-outline w-full sm:w-auto text-xs font-bold py-3.5 px-6 flex items-center justify-center gap-2"
              >
                <span>{t('corporatePortal.requestProposal')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
