import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER, generateQuickWhatsAppUrl } from '../../lib/whatsapp';
import { submitContactLead } from '../../lib/reservations';

const SUBJECT_KEYS = ['general', 'corporate', 'diplomatic', 'events', 'private', 'other'] as const;

export const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [subjectKey, setSubjectKey] = useState<(typeof SUBJECT_KEYS)[number]>('general');
  const subject = t(`contactForm.subjects.${subjectKey}`);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const waMessage = t('contactForm.whatsappTemplate', { name, contact, subject, message });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await submitContactLead({ name, contact, subject, message });
      const whatsappUrl = `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;
      setSent(true);
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('contactForm.errorGeneric'));
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
            <div className="p-8 rounded-2xl bg-[#001E4A] text-white space-y-6">
              <h3 className="text-xl font-bold text-white mb-2">
                {t('contactForm.centerTitle')}
              </h3>
              <p className="text-xs text-gray-300">
                {t('contactForm.centerSubtitle')}
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
                    <span className="text-xs text-gray-400 block">{t('contactForm.callsLabel')}</span>
                    <span className="text-sm font-bold text-white">+244 923 719 090</span>
                  </div>
                </a>

                <a
                  href={generateQuickWhatsAppUrl(t('contactForm.whatsappGeneral'))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#236199]/10 border border-[#236199]/30 hover:bg-[#236199]/20 transition-colors"
                >
                  <div className="p-2.5 rounded-lg bg-[#236199] text-white">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#236199] block">{t('contactForm.whatsappLabel')}</span>
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
                    <span className="text-xs text-gray-400 block">{t('contactForm.emailLabel')}</span>
                    <span className="text-sm font-bold text-white">geral@pepekgrupo.com</span>
                  </div>
                </a>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FEC228] shrink-0" />
                  <span>{t('contactForm.locations')}</span>
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
                {t('contactForm.formTitle')}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {t('contactForm.formSubtitle')}
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      {t('contactForm.nameLabel')}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('contactForm.namePlaceholder')}
                      className="form-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      {t('contactForm.contactLabel')}
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
                    {t('contactForm.subjectLabel')}
                  </label>
                  <select
                    value={subjectKey}
                    onChange={(e) => setSubjectKey(e.target.value as (typeof SUBJECT_KEYS)[number])}
                    className="form-select"
                  >
                    {SUBJECT_KEYS.map((key) => (
                      <option key={key} value={key}>{t(`contactForm.subjectOptions.${key}`)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    {t('contactForm.detailsLabel')}
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('contactForm.detailsPlaceholder')}
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
                  <span>{isSubmitting ? t('contactForm.submitting') : t('contactForm.submit')}</span>
                </button>

                {submitError && (
                  <div role="alert" className="p-3 bg-[#FEC228] text-[#09172C] rounded-lg text-xs">
                    {submitError} {t('contactForm.errorFallback')}
                  </div>
                )}

                {sent && (
                  <div className="p-4 bg-emerald-600 text-white rounded-xl text-xs flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#FEC228]" />
                      <div>
                        <strong className="block text-sm">{t('contactForm.successTitle')}</strong>
                        <span className="text-emerald-100">{t('contactForm.successSubtitle')}</span>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-[#FEC228] text-[#09172C] font-extrabold text-xs flex items-center gap-1.5 shrink-0 hover:bg-white transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{t('contactForm.openWhatsapp')}</span>
                    </a>
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
