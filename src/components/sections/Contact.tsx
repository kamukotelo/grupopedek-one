import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER, generateQuickWhatsAppUrl } from '../../lib/whatsapp';
import { submitContactLead } from '../../lib/reservations';

export const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [subject, setSubject] = useState('Pedido de Informações Gerais');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await submitContactLead({ name, contact, subject, message });
      const waMsg = `*MENSAGEM DE CONTACTO — PEPEK GRUPO*\n*Nome:* ${name}\n*Contacto:* ${contact}\n*Assunto:* ${subject}\n*Mensagem:* ${message}`;
      window.open(`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`, '_blank');
      setSent(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Não foi possível registar a mensagem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contactos" className="section-padding bg-gray-50 relative">
      <div className="container-pepek">
        {/* Section Header */}
        <div className="max-w-4xl mb-16">
          <div className="tag-label mb-4">
            <span>{t('contact.tag')}</span>
          </div>
          <h2 className="section-title mb-4">
            {t('contact.title')}
          </h2>
          <p className="section-subtitle">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct Info & Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl bg-[#09172C] text-white space-y-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Central de Atendimento 24/7
              </h3>
              <p className="text-xs text-gray-300">
                A nossa equipa operacional está sempre de serviço para responder a pedidos urgentes de frotas e transfers.
              </p>

              <div className="space-y-4 pt-2">
                <a
                  href={`tel:+${OFFICIAL_WHATSAPP_NUMBER}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FEC228] transition-colors"
                >
                  <div className="p-2.5 rounded-lg bg-[#236199] text-white">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Chamadas & Emergências</span>
                    <span className="text-sm font-bold text-white">+244 923 719 090</span>
                  </div>
                </a>

                <a
                  href={generateQuickWhatsAppUrl('Atendimento Geral')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#236199]/10 border border-[#236199]/30 hover:bg-[#236199]/20 transition-colors"
                >
                  <div className="p-2.5 rounded-lg bg-[#236199] text-white">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#236199] block">WhatsApp Executivo</span>
                    <span className="text-sm font-bold text-white">+244 923 719 090</span>
                  </div>
                </a>

                <a
                  href="mailto:geral@pepekgrupo.com"
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FEC228] transition-colors"
                >
                  <div className="p-2.5 rounded-lg bg-[#236199] text-white">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">E-mail Institucional</span>
                    <span className="text-sm font-bold text-white">geral@pepekgrupo.com</span>
                  </div>
                </a>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FEC228] shrink-0" />
                  <span>Sede: Luanda · Pólos Operacionais: Huambo & Bengo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FEC228] shrink-0" />
                  <span>{t('contact.hours')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-bold text-[#09172C] mb-2">
                Envie-nos uma Mensagem
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Preencha o formulário abaixo e será contactado de imediato pelo nosso departamento comercial.
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      O Seu Nome
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Dr. Manuel Silva"
                      className="form-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      Telemóvel ou E-mail
                    </label>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="+244 9XX XXX XXX"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Assunto
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="form-select"
                  >
                    <option value="Proposta para Aluguer Corporativo">Proposta para Aluguer Corporativo (Empresas)</option>
                    <option value="Mobilidade para Corpo Diplomático">Mobilidade para Corpo Diplomático / Embaixada</option>
                    <option value="Transfers de Grande Escala / Eventos">Transfers de Grande Escala / Eventos</option>
                    <option value="Aluguer Particular de Curta Duração">Aluguer Particular de Curta Duração</option>
                    <option value="Outro Assunto">Outro Assunto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Detalhes da Solicitação
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Descreva as datas previstas, tipo de viatura ou requisitos específicos..."
                    className="form-input"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center text-sm font-bold py-3.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'A registar mensagem…' : 'Enviar Mensagem & Abrir WhatsApp'}</span>
                </button>

                {submitError && (
                  <div role="alert" className="p-3 bg-[#FEC228] text-[#E4AD28] rounded-lg text-xs">
                    {submitError} Pode contactar-nos diretamente pelo WhatsApp ou telefone.
                  </div>
                )}

                {sent && (
                  <div className="p-3 bg-[#236199] text-[#236199] rounded-lg text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#236199]" />
                    <span>Mensagem registada e canal WhatsApp aberto com a nossa central!</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
