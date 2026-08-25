import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, UserCheck, FileText, Clock, Building, ArrowRight, Phone } from 'lucide-react';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';
import { Link } from 'react-router-dom';

export const CorporatePortal: React.FC = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: <Clock className="w-6 h-6 text-[#0B45D8]" />,
      title: 'SLA Prioritário < 10 Minutos',
      desc: 'Atendimento directo com despacho prioritário 24 horas por dia, 365 dias por ano.'
    },
    {
      icon: <UserCheck className="w-6 h-6 text-[#0B45D8]" />,
      title: 'Pilotos de Protocolo Bilingues',
      desc: 'Formação rigorosa em etiqueta diplomática, sigilo profissional, primeiros socorros e condução defensiva.'
    },
    {
      icon: <FileText className="w-6 h-6 text-[#0B45D8]" />,
      title: 'Facturação AGT & Condições de Pagamento',
      desc: 'Emissão formal de faturas em conformidade legal, com prazos de liquidação a 30 ou 60 dias para empresas credenciadas.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#0B45D8]" />,
      title: 'Garantia de Viatura de Substituição',
      desc: 'Disponibilização imediata de viatura equivalente em qualquer província em caso de intervenção técnica.'
    },
  ];

  return (
    <section className="section-padding bg-white relative">
      <div className="container-pepek">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#09172C] via-[#0C2E60] to-[#09172C] p-8 text-white shadow-2xl sm:p-12 lg:p-16">
          {/* Background accent lines */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#0B45D8]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-[#8899BB] uppercase tracking-widest mb-4">
              <Building className="w-4 h-4 text-[#0B45D8]" />
              <span>Contratos Corporativos & Protocolo Diplomático</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-inter">
              Soluções Estratégicas para Grandes Organizações
            </h2>

            <p className="text-base text-gray-300 mt-4 leading-relaxed">
              Desenhamos pacotes de mobilidade sob medida para embaixadas, petrolíferas, instituições financeiras e entidades governamentais que não podem prescindir de pontualidade e discrição.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#0B45D8]/60 transition-all flex items-start gap-4"
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
                Deseja abrir uma conta corporativa ou solicitar um acordo-quadro?
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                O nosso gestor de contas institucionais entrará em contacto directo com a sua direcção.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <a
                href={generateQuickWhatsAppUrl('Abertura de Conta Corporativa / Acordo Diplomático')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full sm:w-auto text-xs font-bold py-3.5 px-6 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Falar com Gestor Institucional</span>
              </a>

              <Link
                to="/contactos"
                className="btn-outline w-full sm:w-auto text-xs font-bold py-3.5 px-6 flex items-center justify-center gap-2"
              >
                <span>Enviar Pedido de Proposta Formal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
