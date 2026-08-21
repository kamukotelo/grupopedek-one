import React, { useState } from 'react';
import { X, Building2, User, Lock, Mail, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface ClientAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientAreaModal: React.FC<ClientAreaModalProps> = ({ isOpen, onClose }) => {
  const { signIn, requestPasswordReset, isAuthReady } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'corporate' | 'vip'>('corporate');
  const [emailOrNif, setEmailOrNif] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setResetMessage('');
    setIsSubmitting(true);
    const result = await signIn(emailOrNif, password);
    setIsSubmitting(false);
    if (result.error) setErrorMessage('Não foi possível iniciar sessão. Confirme o e-mail e a palavra-passe.');
  };

  const handlePasswordReset = async () => {
    setErrorMessage('');
    if (!emailOrNif.includes('@')) {
      setErrorMessage('Introduza primeiro o e-mail registado para recuperar o acesso.');
      return;
    }
    const result = await requestPasswordReset(emailOrNif);
    if (result.error) setErrorMessage('Não foi possível enviar a recuperação neste momento.');
    else setResetMessage('Enviámos as instruções de recuperação para o e-mail indicado.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-scaleUp">
        {/* Header with Navy Gradient */}
        <div className="bg-gradient-to-r from-[#06142F] to-[#0A1E42] p-6 sm:p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0B45D8] block mb-1">
            {t('auth.eyebrow')}
          </span>
          <h3 className="text-2xl font-extrabold text-white font-inter">
            {t('auth.title')}
          </h3>
          <p className="text-xs text-gray-300 mt-1">
            {t('auth.subtitle')}
          </p>

          {/* Account Type Tabs */}
          <div className="flex items-center gap-2 mt-6 p-1 bg-white/10 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => { setActiveTab('corporate'); setErrorMessage(''); }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'corporate'
                  ? 'bg-[#0B45D8] text-white shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{t('auth.corporate')}</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('vip'); setErrorMessage(''); }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'vip'
                  ? 'bg-[#0B45D8] text-white shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('auth.private')}</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8">
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={emailOrNif}
                    onChange={(e) => setEmailOrNif(e.target.value)}
                    placeholder={activeTab === 'corporate' ? 'ex: direccao@empresa.ao' : 'ex: cliente@email.com'}
                    className="form-input pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="form-input pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded text-[#0B45D8] focus:ring-[#0B45D8]" />
                  <span>{t('auth.remember')}</span>
                </label>

                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="font-semibold text-[#0B45D8] hover:underline"
                >
                  {t('auth.forgot')}
                </button>
              </div>

              {errorMessage && <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">{errorMessage}</p>}
              {resetMessage && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">{resetMessage}</p>}

              <button
                type="submit"
                disabled={isSubmitting || !isAuthReady}
                className="btn-primary w-full justify-center text-xs font-bold py-3.5 mt-2 cursor-pointer"
              >
                {isSubmitting || !isAuthReady ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>{isSubmitting ? t('auth.submitting') : t('auth.submit')}</span>
              </button>
            </form>
          </>

          {/* Footer Note */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Conexão Segura SSL 256-bit</span>
            </div>

            <a
              href={generateQuickWhatsAppUrl('Pedido de Nova Conta Corporativa')}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#06142F] hover:text-[#0B45D8]"
            >
              {t('auth.create')} ➔
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
