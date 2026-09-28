import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, HelpCircle, Phone, ArrowRight } from 'lucide-react';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';

export type FaqItem = { q: string; a: string };

export const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqItems = t('faq.items', { returnObjects: true }) as FaqItem[];

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="section-padding bg-white relative">
      <div className="container-pepek">
        <div className="max-w-3xl mb-14">
          <div className="tag-label mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('faq.eyebrow')}</span>
          </div>

          <h2 className="section-title mb-4">
            {t('faq.title')}
          </h2>

          <p className="section-subtitle">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* Accordion List */}
        <div className="max-w-4xl space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all bg-gray-50/50 hover:border-[#236199]/40"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#09172C] cursor-pointer"
                >
                  <span>{item.q}</span>
                  <div className={`p-2 rounded-full bg-white border border-gray-200 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-[#236199] text-white border-[#236199]' : 'text-gray-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-white">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA for unlisted questions */}
        <div className="mt-12 p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-[#236199]" />
            <span className="text-sm font-semibold text-gray-800">
              {t('faq.complexQuestion')}
            </span>
          </div>

          <a
            href={generateQuickWhatsAppUrl(t('faq.whatsappSubject'))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs font-bold py-2.5 px-5 flex items-center gap-2 shrink-0"
          >
            <span>{t('faq.talkToTeam')}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
