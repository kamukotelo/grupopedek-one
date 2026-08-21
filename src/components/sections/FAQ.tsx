import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, HelpCircle, Phone, ArrowRight } from 'lucide-react';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';

export const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqItems = [
    {
      q: 'Quais são os requisitos para o aluguer de viaturas (Livre Condução)?',
      a: 'Para particulares e executivos em livre condução, é necessário apresentar Bilhete de Identidade ou Passaporte válido, Carta de Condução com mais de 2 anos de emissão, comprovativo de morada ou estadia em Angola, e caução (depósito de garantia) através de cartão ou transferência.'
    },
    {
      q: 'Como funciona o serviço de Mobilidade Executiva com Motorista/Chauffeur?',
      a: 'O nosso serviço de Chauffeur é integral: disponibilizamos a viatura topo de gama com combustível (ou a combinar), conduzida por um profissional devidamente fardado, credenciado em protocolo executivo, condução defensiva e sigilo profissional. O motorista fica à disposição do cliente ou comitiva durante o período contratado.'
    },
    {
      q: 'As viaturas podem circular fora de Luanda (viagens interprovinciais)?',
      a: 'Sim, absolutamente. Toda a nossa frota de 4x4 e SUVs possui autorização e cobertura para viajar para o Huambo, Bengo, Benguela e qualquer outra província do país. As viaturas são equipadas com rastreio por GPS 24/7 e contam com assistência móvel em todo o território nacional.'
    },
    {
      q: 'Como é feita a recepção nos Aeroportos (4 de Fevereiro / AIAAN)?',
      a: 'O nosso motorista aguarda na área de desembarque internacional com uma placa de identificação com o nome do passageiro ou da instituição. Monitorizamos o número do voo em tempo real para ajustar a hora de chegada sem custos adicionais em caso de atraso.'
    },
    {
      q: 'Como funciona a faturação para embaixadas, governos e empresas?',
      a: 'Emitimos faturas proforma e definitivas em conformidade com as directrizes da AGT (Administração Geral Tributária), em moeda nacional (AOA) ou moeda estrangeira (USD/EUR) para entidades diplomáticas e multinacionais. Oferecemos contratos de conta-corrente com termos de pagamento a 30 dias mediante acreditação prévia.'
    },
    {
      q: 'O que acontece em caso de avaria ou incidente durante a viagem?',
      a: 'A PEPEK GRUPO garante assistência técnica 24 horas por dia e envio imediato de uma viatura de substituição da mesma categoria ou superior, sem custos adicionais para o cliente, salvaguardando a continuidade da sua missão ou viagem.'
    }
  ];

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="section-padding bg-white relative">
      <div className="container-pepek">
        <div className="max-w-3xl mb-14">
          <div className="tag-label mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Dúvidas Frequentes</span>
          </div>

          <h2 className="section-title mb-4">
            Perguntas Frequentes sobre os Nossos Serviços
          </h2>

          <p className="section-subtitle">
            Respostas claras sobre processos de reserva, requisitos contratuais, segurança e operações no território angolano.
          </p>
        </div>

        {/* Accordion List */}
        <div className="max-w-4xl space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all bg-gray-50/50 hover:border-[#0B45D8]/40"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#06142F] cursor-pointer"
                >
                  <span>{item.q}</span>
                  <div className={`p-2 rounded-full bg-white border border-gray-200 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-[#0B45D8] text-white border-[#0B45D8]' : 'text-gray-500'
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
            <Phone className="w-5 h-5 text-[#0B45D8]" />
            <span className="text-sm font-semibold text-gray-800">
              Tem alguma dúvida específica sobre uma operação de grande escala?
            </span>
          </div>

          <a
            href={generateQuickWhatsAppUrl('Dúvida Específica sobre Serviço')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs font-bold py-2.5 px-5 flex items-center gap-2 shrink-0"
          >
            <span>Falar com Especialista</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
