import React, { useState } from 'react';
import { X, Building2, User, Lock, Mail, ArrowRight, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';

interface ClientAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientAreaModal: React.FC<ClientAreaModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'corporate' | 'vip'>('corporate');
  const [emailOrNif, setEmailOrNif] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            Portal de Gestão & Reservas
          </span>
          <h3 className="text-2xl font-extrabold text-white font-inter">
            Área do Cliente & Entidades
          </h3>
          <p className="text-xs text-gray-300 mt-1">
            Aceda às suas frotas contratadas, faturas AGT e pedidos prioritários de chauffeur.
          </p>

          {/* Account Type Tabs */}
          <div className="flex items-center gap-2 mt-6 p-1 bg-white/10 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => { setActiveTab('corporate'); setSubmitted(false); }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'corporate'
                  ? 'bg-[#0B45D8] text-white shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Corporativo / Embaixadas</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('vip'); setSubmitted(false); }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'vip'
                  ? 'bg-[#0B45D8] text-white shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Particular VIP</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  {activeTab === 'corporate' ? 'E-mail Corporativo ou NIF da Instituição' : 'E-mail ou Telemóvel Registado'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={emailOrNif}
                    onChange={(e) => setEmailOrNif(e.target.value)}
                    placeholder={activeTab === 'corporate' ? 'ex: direccao@embaixada.gov ou 5000XXXXXX' : 'ex: cliente@email.com'}
                    className="form-input pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Palavra-passe de Acesso
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
                  <span>Lembrar neste dispositivo</span>
                </label>

                <a
                  href={generateQuickWhatsAppUrl('Recuperação de Palavra-passe da Área de Cliente')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#0B45D8] hover:underline"
                >
                  Esqueceu a senha?
                </a>
              </div>

              <button
                type="submit"
                className="btn-primary w-full justify-center text-xs font-bold py-3.5 mt-2 cursor-pointer"
              >
                <span>Entrar na Área Reservada</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-[#06142F]">
                Acesso Autenticado com Sucesso
              </h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                Bem-vindo à área de gestão. Para solicitar viaturas urgentes ou descarregar faturas certificadas da sua conta, use também a linha prioritária WhatsApp.
              </p>

              <div className="pt-2">
                <a
                  href={generateQuickWhatsAppUrl(`Gestão de Conta: ${emailOrNif}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full justify-center text-xs font-bold py-3"
                >
                  <Phone className="w-4 h-4" />
                  <span>Aceder via Linha Directa de Operações</span>
                </a>
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Conexão Segura SSL 256-bit</span>
            </div>

            <a
              href={generateQuickWhatsAppUrl('Acreditação de Nova Conta Corporativa')}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#06142F] hover:text-[#0B45D8]"
            >
              Criar Conta Corporativa ➔
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
