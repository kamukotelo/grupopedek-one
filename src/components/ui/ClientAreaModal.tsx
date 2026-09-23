import React, { useState } from 'react';
import { X, Building2, User, Lock, Mail, ArrowRight, ShieldCheck, Loader2, ChevronDown, Sparkles, Smartphone, KeyRound } from 'lucide-react';
import type { UserRole } from '../../types/auth';
import { generateQuickWhatsAppUrl } from '../../lib/whatsapp';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { SOCIAL_PROVIDER_LABELS, type SocialProvider } from '../../lib/auth';

interface ClientAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROFILE_CHOICES: Array<{ role: UserRole; group: 'Clientes' | 'Operações' | 'Gestão'; icon: string; title: string; description: string }> = [
  { role: 'cliente_vip', group: 'Clientes', icon: '👑', title: 'Cliente VIP', description: 'Viaturas, faturas e pedidos prioritários.' },
  { role: 'cliente_normal', group: 'Clientes', icon: '👤', title: 'Cliente Particular ou PME', description: 'Reservas, pagamentos e acompanhamento.' },
  { role: 'vendedor', group: 'Operações', icon: '💼', title: 'Consultor Comercial', description: 'Clientes, propostas e oportunidades.' },
  { role: 'gestor_reservas', group: 'Operações', icon: '🎫', title: 'Gestão de Reservas', description: 'Pedidos, confirmação e despacho.' },
  { role: 'diretor_frotas', group: 'Operações', icon: '🚙', title: 'Direção de Frotas', description: 'Viaturas, manutenção e disponibilidade.' },
  { role: 'motorista', group: 'Operações', icon: '🧑🏾‍✈️', title: 'Motorista Protocolar', description: 'Escalas, missões e estado operacional.' },
  { role: 'contabilista', group: 'Gestão', icon: '📊', title: 'Contabilidade', description: 'Faturas, pagamentos e reconciliação.' },
  { role: 'gestor_portugal', group: 'Gestão', icon: '🇵🇹', title: 'Gestão Portugal', description: 'Operação internacional e pagamentos.' },
  { role: 'direcao', group: 'Gestão', icon: '🏛️', title: 'Direção Executiva', description: 'Visão integral do negócio e Odoo.' },
];

export const ClientAreaModal: React.FC<ClientAreaModalProps> = ({ isOpen, onClose }) => {
  const {
    signIn, signUp, requestPhoneOtp, verifyPhoneOtp, signInWithSocial,
    requestPasswordReset, updatePassword, isPasswordRecovery,
    isAuthReady, isDemoMode, loginAs,
  } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'corporate' | 'private'>('corporate');
  const [emailOrNif, setEmailOrNif] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showRealLogin, setShowRealLogin] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationName, setRegistrationName] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [phone, setPhone] = useState('');
  const [normalizedPhone, setNormalizedPhone] = useState('');
  const [otp, setOtp] = useState('');

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

  const handleRegistration = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setResetMessage('');
    if (password.length < 10) {
      setErrorMessage('Use uma palavra-passe com pelo menos 10 caracteres.');
      return;
    }
    setIsSubmitting(true);
    const result = await signUp(registrationName, emailOrNif, password);
    setIsSubmitting(false);
    if (result.error) setErrorMessage('Não foi possível criar a conta. Confirme os dados ou tente outro e-mail.');
    else setResetMessage('Conta criada. Consulte o seu e-mail para confirmar o acesso antes de iniciar sessão.');
  };

  const handlePhoneSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setResetMessage('');
    setIsSubmitting(true);
    const result: { error?: string; phone?: string } = normalizedPhone
      ? await verifyPhoneOtp(normalizedPhone, otp)
      : await requestPhoneOtp(phone);
    setIsSubmitting(false);
    if (result.error) {
      setErrorMessage(normalizedPhone ? 'Código inválido ou expirado. Solicite um novo código.' : 'Não foi possível enviar o SMS. Confirme o número e tente novamente.');
      return;
    }
    if (result.phone) {
      setNormalizedPhone(result.phone);
      setResetMessage(`Código enviado por SMS para ${result.phone}.`);
    }
  };

  const handleSocial = async (provider: SocialProvider) => {
    setErrorMessage('');
    setIsSubmitting(true);
    const result = await signInWithSocial(provider);
    if (result.error) {
      setIsSubmitting(false);
      setErrorMessage(`Não foi possível continuar com ${SOCIAL_PROVIDER_LABELS[provider]}.`);
    }
  };

  const handlePasswordUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    const result = await updatePassword(password);
    setIsSubmitting(false);
    if (result.error) setErrorMessage('Use uma palavra-passe nova com pelo menos 10 caracteres.');
    else setResetMessage('Palavra-passe atualizada com sucesso.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl z-10 animate-scaleUp">
        {/* Header with Navy Gradient */}
        <div className="bg-gradient-to-r from-[#09172C] to-[#0C2E60] p-6 sm:p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FEC228] block mb-1">
            Portal seguro PEPEK
          </span>
          <h3 className="text-2xl font-extrabold text-white font-inter">
            Área do Cliente
          </h3>
          <p className="text-xs text-gray-300 mt-1">
            Acesso separado para contas corporativas e clientes particulares.
          </p>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-5 sm:p-7">
          {isDemoMode && <>
            <div className="mb-5 rounded-2xl border border-[#E4AD28]/30 bg-[#FEC228]/10 px-4 py-3 text-[11px] text-[#09172C]">
              <span className="flex items-center gap-2 font-extrabold"><Sparkles className="h-4 w-4 text-[#E4AD28]" />Entrada imediata, sem senha</span>
              <span className="mt-1 block text-[10px] text-slate-600">Todos os dados apresentados são fictícios e servem apenas para conhecer a experiência.</span>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {(['Clientes', 'Operações', 'Gestão'] as const).map((group) => (
                <section key={group} aria-labelledby={`grupo-${group}`}>
                  <div className="mb-2 flex items-center gap-2 px-1">
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#09172C] text-[10px] font-extrabold text-[#FEC228]">{group === 'Clientes' ? '01' : group === 'Operações' ? '02' : '03'}</span>
                    <h4 id={`grupo-${group}`} className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#09172C]">{group}</h4>
                  </div>
                  <div className="space-y-2">
                    {PROFILE_CHOICES.filter((profile) => profile.group === group).map((profile) => (
                      <button
                        key={profile.role}
                        type="button"
                        onClick={() => { setErrorMessage(''); loginAs(profile.role); }}
                        className="group flex min-h-[82px] w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#FEC228] hover:shadow-md"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F5F6F6] text-xl transition group-hover:bg-[#FFF4C7]" aria-hidden="true">{profile.icon}</span>
                        <span className="min-w-0 flex-1">
                          <strong className="block text-xs text-[#09172C]">{profile.title}</strong>
                          <span className="mt-1 block text-[10px] leading-snug text-slate-500">{profile.description}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#E4AD28]" />
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <button type="button" onClick={() => setShowRealLogin((visible) => !visible)} className="mt-6 flex w-full items-center justify-center gap-2 border-t border-slate-200 pt-5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500 hover:text-[#09172C]" aria-expanded={showRealLogin}>
              Já possui uma conta PEPEK? Entrar com e-mail
              <ChevronDown className={`h-4 w-4 transition-transform ${showRealLogin ? 'rotate-180' : ''}`} />
            </button>
          </>}

            {(showRealLogin || !isDemoMode) && <div className={`mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 p-5 ${isDemoMode ? 'mt-5' : ''}`}>
            <div className="mb-5 grid gap-3 sm:grid-cols-2" role="tablist" aria-label="Tipo de conta">
              <button type="button" role="tab" aria-selected={activeTab === 'corporate'} onClick={() => { setActiveTab('corporate'); setErrorMessage(''); }} className={`rounded-2xl border p-4 text-left transition ${activeTab === 'corporate' ? 'border-[#FEC228] bg-[#09172C] text-white shadow-lg' : 'border-slate-200 bg-white text-[#09172C]'}`}>
                <Building2 className={`h-5 w-5 ${activeTab === 'corporate' ? 'text-[#FEC228]' : 'text-[#236199]'}`} />
                <strong className="mt-3 block text-sm">Conta Corporativa</strong>
                <span className={`mt-1 block text-[10px] leading-4 ${activeTab === 'corporate' ? 'text-white/65' : 'text-slate-500'}`}>Empresas, embaixadas e instituições com contratos, faturas e viaturas alocadas.</span>
              </button>
              <button type="button" role="tab" aria-selected={activeTab === 'private'} onClick={() => { setActiveTab('private'); setErrorMessage(''); }} className={`rounded-2xl border p-4 text-left transition ${activeTab === 'private' ? 'border-[#FEC228] bg-[#09172C] text-white shadow-lg' : 'border-slate-200 bg-white text-[#09172C]'}`}>
                <User className={`h-5 w-5 ${activeTab === 'private' ? 'text-[#FEC228]' : 'text-[#236199]'}`} />
                <strong className="mt-3 block text-sm">Cliente Particular</strong>
                <span className={`mt-1 block text-[10px] leading-4 ${activeTab === 'private' ? 'text-white/65' : 'text-slate-500'}`}>Reservas pessoais, comprovativos, pagamentos e acompanhamento do serviço.</span>
              </button>
            </div>
            <div className="mb-4 rounded-xl border border-[#236199] bg-[#236199] p-3 text-[10px] leading-4 text-white">
              <ShieldCheck className="mr-1.5 inline h-4 w-4" />
              Sessão protegida. A PEPEK nunca solicitará a sua palavra-passe por telefone, WhatsApp ou e-mail.
            </div>
            {isPasswordRecovery ? (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="rounded-xl border border-[#236199] bg-white p-4">
                  <KeyRound className="mb-2 h-5 w-5 text-[#236199]" />
                  <strong className="block text-sm text-[#09172C]">Definir nova palavra-passe</strong>
                  <p className="mt-1 text-[10px] text-slate-500">A ligação de recuperação foi validada. Escolha uma palavra-passe com pelo menos 10 caracteres.</p>
                </div>
                <input type="password" autoComplete="new-password" minLength={10} value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required aria-label="Nova palavra-passe" />
                {errorMessage && <p role="alert" className="rounded-xl bg-[#FEC228] p-3 text-xs font-semibold text-[#09172C]">{errorMessage}</p>}
                {resetMessage && <p role="status" className="rounded-xl bg-[#236199] p-3 text-xs font-semibold text-white">{resetMessage}</p>}
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3.5 text-xs font-bold">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Atualizar palavra-passe
                </button>
              </form>
            ) : <>
            <div className="mb-4 grid grid-cols-2 rounded-xl bg-white p-1 shadow-sm" role="tablist" aria-label="Método de entrada">
              <button type="button" role="tab" aria-selected={loginMethod === 'email'} onClick={() => { setLoginMethod('email'); setErrorMessage(''); }} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold ${loginMethod === 'email' ? 'bg-[#09172C] text-white' : 'text-slate-500'}`}><Mail className="h-4 w-4" />E-mail</button>
              <button type="button" role="tab" aria-selected={loginMethod === 'phone'} onClick={() => { setLoginMethod('phone'); setErrorMessage(''); }} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold ${loginMethod === 'phone' ? 'bg-[#09172C] text-white' : 'text-slate-500'}`}><Smartphone className="h-4 w-4" />Telefone</button>
            </div>

            {loginMethod === 'phone' ? <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">{normalizedPhone ? 'Código SMS de 6 dígitos' : 'Número de telefone'}</label>
                <input
                  type={normalizedPhone ? 'text' : 'tel'} inputMode={normalizedPhone ? 'numeric' : 'tel'}
                  autoComplete={normalizedPhone ? 'one-time-code' : 'tel'}
                  value={normalizedPhone ? otp : phone}
                  onChange={(e) => normalizedPhone ? setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)) : setPhone(e.target.value)}
                  placeholder={normalizedPhone ? '000000' : '+244 923 000 000'} className="form-input" required
                  pattern={normalizedPhone ? '[0-9]{6}' : undefined}
                />
              </div>
              {errorMessage && <p role="alert" className="rounded-xl bg-[#FEC228] p-3 text-xs font-semibold text-[#09172C]">{errorMessage}</p>}
              {resetMessage && <p role="status" className="rounded-xl bg-[#236199] p-3 text-xs font-semibold text-white">{resetMessage}</p>}
              <button type="submit" disabled={isSubmitting || !isAuthReady} className="btn-primary w-full justify-center py-3.5 text-xs font-bold">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}{normalizedPhone ? 'Confirmar código e entrar' : 'Enviar código por SMS'}
              </button>
              {normalizedPhone && <button type="button" onClick={() => { setNormalizedPhone(''); setOtp(''); setResetMessage(''); }} className="w-full text-xs font-bold text-[#236199] hover:underline">Alterar número ou reenviar código</button>}
            </form> : <form onSubmit={showRegistration ? handleRegistration : handleSubmit} className="space-y-4">
              {showRegistration && <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Nome completo</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input type="text" autoComplete="name" value={registrationName} onChange={(e) => setRegistrationName(e.target.value)} placeholder="O seu nome" className="form-input pl-10" required />
                </div>
              </div>}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  {showRegistration ? 'E-mail para criar a conta' : activeTab === 'corporate' ? 'E-mail corporativo registado' : 'E-mail pessoal registado'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={emailOrNif}
                    onChange={(e) => setEmailOrNif(e.target.value)}
                    placeholder={activeTab === 'corporate' ? 'nome@empresa.ao' : 'cliente@email.com'}
                    className="form-input pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  {showRegistration ? 'Criar palavra-passe' : t('auth.password')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  placeholder={showRegistration ? 'Mínimo de 10 caracteres' : '••••••••••••'}
                    className="form-input pl-10"
                    required
                  />
                </div>
              </div>

              {!showRegistration && <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded text-[#236199] focus:ring-[#236199]" />
                  <span>{t('auth.remember')}</span>
                </label>

                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="font-semibold text-[#236199] hover:underline"
                >
                  {t('auth.forgot')}
                </button>
              </div>}

              {errorMessage && <p role="alert" className="rounded-xl bg-[#FEC228] p-3 text-xs font-semibold text-[#09172C]">{errorMessage}</p>}
              {resetMessage && <p role="status" className="rounded-xl bg-[#236199] p-3 text-xs font-semibold text-white">{resetMessage}</p>}

              <button
                type="submit"
                disabled={isSubmitting || !isAuthReady}
                className="btn-primary w-full justify-center text-xs font-bold py-3.5 mt-2 cursor-pointer"
              >
                {isSubmitting || !isAuthReady ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>{isSubmitting ? t('auth.submitting') : showRegistration ? 'Criar conta de cliente' : t('auth.submit')}</span>
              </button>
              <button type="button" onClick={() => { setShowRegistration((open) => !open); setErrorMessage(''); setResetMessage(''); }} className="w-full pt-1 text-xs font-bold text-[#236199] hover:underline">
                {showRegistration ? 'Já possui conta? Iniciar sessão' : 'Criar conta de cliente'}
              </button>
            </form>}

            {!showRegistration && <div className="mt-5">
              <div className="mb-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-400"><span className="h-px flex-1 bg-slate-200" />ou continuar com<span className="h-px flex-1 bg-slate-200" /></div>
              <div className="grid gap-2 sm:grid-cols-3">
                {(Object.keys(SOCIAL_PROVIDER_LABELS) as SocialProvider[]).map((provider) => (
                  <button key={provider} type="button" disabled={isSubmitting} onClick={() => void handleSocial(provider)} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-[#09172C] transition hover:border-[#236199] disabled:opacity-50" aria-label={`Continuar com ${SOCIAL_PROVIDER_LABELS[provider]}`}>
                    {SOCIAL_PROVIDER_LABELS[provider]}
                  </button>
                ))}
              </div>
            </div>}
            </>}
            </div>}
          {/* Footer Note */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#236199]" />
              <span>Ligação cifrada e acesso autenticado</span>
            </div>

            <a
              href={generateQuickWhatsAppUrl('Pedido de Nova Conta Corporativa')}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#09172C] hover:text-[#236199]"
            >
              {t('auth.create')} ➔
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
