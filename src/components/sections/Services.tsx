import React from 'react';
import { useTranslation } from 'react-i18next';
import { Car, UserCheck, Building2, CalendarDays, Check, ArrowUpRight } from 'lucide-react';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';

export const Services: React.FC = () => {
  const { t } = useTranslation();

  const serviceCards = [
    {
      id: 'rent-a-car',
      icon: <Car className="w-8 h-8 text-[#0B45D8]" />,
      title: 'Rent a Car de Luxo',
      subtitle: 'Conforto e liberdade para o seu dia a dia.',
      desc: 'Aluguer flexível de viaturas SUV executivas, 4x4 e pick-ups para uso diário, semanal ou de longa duração com assistência permanente.',
      features: [
        'SUVs executivas (Land Cruiser Prado, LC300)',
        '4x4 todo-terreno para trabalho e lazer',
        'Seguro contra todos os riscos incluído',
        'Entrega personalizada em Talatona ou Aeroporto'
      ],
      topic: 'Rent a Car de Luxo'
    },
    {
      id: 'executive',
      icon: <UserCheck className="w-8 h-8 text-[#0B45D8]" />,
      title: 'Apoio Executivo & Protocolo',
      subtitle: 'Pontualidade e eficiência comprovada.',
      desc: 'Chauffeurs bilingues treinados em etiqueta protocolar, segurança defensiva e discrição absoluta para diplomatas, embaixadores e directores.',
      features: [
        'Motoristas bilingues (Português / Inglês / Francês)',
        'Condução defensiva e planeamento de rotas',
        'Discrição e confidencialidade institucional',
        'Acompanhamento contínuo em agendas oficiais'
      ],
      topic: 'Apoio Executivo & Chauffeur Protocolar'
    },
    {
      id: 'corporate',
      icon: <Building2 className="w-8 h-8 text-[#0B45D8]" />,
      title: 'Mobilidade Corporativa',
      subtitle: 'Segurança e discrição em cada viagem.',
      desc: 'Gestão integral de frotas e contratos de outsourcing para empresas, com viaturas de substituição imediata e faturação estruturada AGT.',
      features: [
        'Outsourcing total de frota automóvel',
        'Manutenção preventiva rigorosa incluída',
        'Viatura de substituição sem encargos adicionais',
        'Relatórios de utilização e faturação centralizada'
      ],
      topic: 'Contrato Corporativo para Empresa'
    },
    {
      id: 'events',
      icon: <CalendarDays className="w-8 h-8 text-[#0B45D8]" />,
      title: 'Eventos, Cimeiras & Comitivas',
      subtitle: 'Chegue com distinção e sem preocupações.',
      desc: 'Logística de transporte para conferências internacionais, cúpulas de estado, visitas diplomáticas e grandes produções em Angola.',
      features: [
        'Coordenação de frotas idênticas em comboio',
        'Transfers coordenados de delegações e artistas',
        'Gestão de chegadas e partidas no Aeroporto',
        'Equipa técnica de prontidão permanente'
      ],
      topic: 'Logística de Transporte para Eventos e Comitivas'
    }
  ];

  return (
    <section id="servicos" className="section-padding bg-gray-50 relative">
      <div className="container-pepek">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="tag-label mb-4">
            <span>Soluções de Mobilidade Integrada</span>
          </div>

          <h2 className="section-title mb-5">
            Serviços Concebidos para Padrões Exigentes
          </h2>

          <p className="section-subtitle">
            Cada operação é planeada com rigor militar, viaturas submetidas a higienização de padrão internacional e profissionais dedicados.
          </p>
        </div>

        {/* 4 Cards Grid - Spacious & Clean */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {serviceCards.map((card) => (
            <div
              key={card.id}
              className="card-service flex flex-col justify-between group hover:border-[#0B45D8] transition-all duration-300 bg-white"
            >
              <div>
                <div className="p-4 rounded-2xl bg-blue-50 w-fit mb-6 group-hover:bg-[#0B45D8] group-hover:text-white transition-colors">
                  {React.cloneElement(card.icon, {
                    className: 'w-8 h-8 text-[#0B45D8] group-hover:text-white transition-colors'
                  })}
                </div>

                <h3 className="text-2xl font-bold text-[#06142F] mb-1.5 group-hover:text-[#0B45D8] transition-colors">
                  {card.title}
                </h3>

                <p className="text-xs font-semibold text-[#0B45D8] mb-4">
                  {card.subtitle}
                </p>

                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {card.desc}
                </p>

                <ul className="space-y-3 mb-8 border-t border-gray-100 pt-5">
                  {card.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs font-medium text-gray-700">
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
                  className="w-full py-3.5 px-5 rounded-xl bg-gray-100 hover:bg-[#0B45D8] text-gray-800 hover:text-white font-bold text-xs transition-all flex items-center justify-between group-hover:bg-[#0B45D8] group-hover:text-white cursor-pointer shadow-xs"
                >
                  <span>Saber Mais & Pedir Proposta</span>
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
