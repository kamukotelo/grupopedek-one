import React from 'react';
import { useTranslation } from 'react-i18next';
import { Car, UserCheck, Plane, Building2, Check, ArrowUpRight } from 'lucide-react';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';

export const Services: React.FC = () => {
  const { t } = useTranslation();

  const serviceCards = [
    {
      id: 'rent-a-car',
      icon: <Car className="w-8 h-8 text-[#0B45D8]" />,
      title: t('services.card1Title'),
      desc: t('services.card1Desc'),
      features: [
        'SUVs executivas, 4x4 e pick-ups',
        'Contratos diários, semanais e mensais',
        'Seguro contra todos os riscos incluído',
        'Entrega na sua residência ou empresa'
      ],
      topic: 'Rent-a-Car Premium'
    },
    {
      id: 'executive',
      icon: <UserCheck className="w-8 h-8 text-[#0B45D8]" />,
      title: t('services.card2Title'),
      desc: t('services.card2Desc'),
      features: [
        'Motoristas bilingues formados em protocolo',
        'Condução defensiva e segurança preventiva',
        'Discrição e confidencialidade garantidas',
        'Acompanhamento contínuo de comitivas'
      ],
      topic: 'Mobilidade Executiva com Motorista'
    },
    {
      id: 'transfers',
      icon: <Plane className="w-8 h-8 text-[#0B45D8]" />,
      title: t('services.card3Title'),
      desc: t('services.card3Desc'),
      features: [
        'Recepção Meet & Greet personalizada',
        'Monitorização de voos em tempo real',
        'Viatura climatizada e água a bordo',
        'Ligações Luanda / Províncias'
      ],
      topic: 'Transfer Aeroporto Luanda'
    },
    {
      id: 'corporate',
      icon: <Building2 className="w-8 h-8 text-[#0B45D8]" />,
      title: t('services.card4Title'),
      desc: t('services.card4Desc'),
      features: [
        'Outsourcing total de frota automóvel',
        'Gestão de manutenção preventiva',
        'Viatura de substituição imediata',
        'Faturação centralizada e relatórios'
      ],
      topic: 'Solução Corporativa para Empresas'
    }
  ];

  return (
    <section id="servicos" className="section-padding bg-gray-50 relative">
      <div className="container-pepek">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="tag-label mb-4">
            <span>{t('services.tag')}</span>
          </div>

          <h2 className="section-title mb-6">
            {t('services.title')}
          </h2>

          <p className="section-subtitle">
            {t('services.subtitle')}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCards.map((card) => (
            <div
              key={card.id}
              className="card-service flex flex-col justify-between group hover:border-[#0B45D8] transition-all duration-300"
            >
              <div>
                <div className="p-3.5 rounded-xl bg-blue-50 w-fit mb-6 group-hover:bg-[#0B45D8] group-hover:text-white transition-colors">
                  {React.cloneElement(card.icon, {
                    className: 'w-7 h-7 text-[#0B45D8] group-hover:text-white transition-colors'
                  })}
                </div>

                <h3 className="text-xl font-bold text-[#06142F] mb-3 group-hover:text-[#0B45D8] transition-colors">
                  {card.title}
                </h3>

                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {card.desc}
                </p>

                <ul className="space-y-2.5 mb-8 border-t border-gray-100 pt-5">
                  {card.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-medium text-gray-700">
                      <Check className="w-4 h-4 text-[#0B45D8] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <a
                  href={generateQuickWhatsAppUrl(card.topic)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-lg bg-gray-100 hover:bg-[#0B45D8] text-gray-800 hover:text-white font-semibold text-xs transition-all flex items-center justify-between group-hover:bg-[#0B45D8] group-hover:text-white"
                >
                  <span>Pedir Proposta Imediata</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
