import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, X, Send, User, Sparkles, HelpCircle, Phone, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { askPepekExecutiveAI, AssistantResponse } from '../../lib/ai';
import { OFFICIAL_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import { useAuth } from '../../context/AuthContext';

export const ChatBot: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, isDemoMode, setIsPortalOpen } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    'Qual o carro ideal para a minha viagem?',
    'SUV Land Cruiser Prado',
    'Hilux 4x4 para Províncias',
    'Transfers Aeroporto 4 de Fevereiro',
    'Contrato de Frota para Empresa'
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Saudação contextual: personalizada apenas para utilizadores autenticados.
  // SEGURANÇA: visitantes anónimos recebem saudação genérica sem dados pessoais.
  useEffect(() => {
    if (currentUser && isDemoMode) {
      // Modo demo (DEV): saudação personalizada com nome e cargo
      const greeting = `Bem-vindo(a), ${currentUser.name}! Detectámos a sua sessão como ${currentUser.roleLabel}${currentUser.company ? ` · ${currentUser.company}` : ''}. As suas viaturas e faturas encontram-se em prontidão. Em que posso apoiar a sua operação hoje?`;
      setMessages([{ role: 'assistant', content: greeting }]);
      setQuickReplies([
        'Ver Frotas em Circulação',
        'Faturas Pendentes',
        'Pedir Viatura Adicional',
        'Abrir Painel de Gestão'
      ]);
    } else if (currentUser && !isDemoMode) {
      // Produção com utilizador autenticado real: saudação com primeiro nome
      const firstName = currentUser.name.split(' ')[0];
      setMessages([{ role: 'assistant', content: `Bem-vindo(a), ${firstName}! Estou aqui para apoiar a sua mobilidade. Como posso ajudar?` }]);
      setQuickReplies([
        'Consultar as minhas reservas',
        'Pedir nova viatura',
        'Falar com operações'
      ]);
    } else {
      // Visitante anónimo: saudação genérica, sem nomes nem referências a entidades
      setMessages([
        {
          role: 'assistant',
          content: 'Bem-vindo(a) à PEPEK GRUPO RENT-A-CAR. Sou o assistente de atendimento da Central de Operações em Talatona, Luanda. Em que posso apoiar a sua mobilidade hoje?'
        }
      ]);
    }
  }, [currentUser, isDemoMode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isTyping) return;

    if (textToSend === 'Ver Frotas em Circulação' || textToSend === 'Faturas AGT Pendentes' || textToSend === 'Sincronização Odoo ERP') {
      setIsPortalOpen(true);
    }

    const newMessages = [...messages, { role: 'user' as const, content: textToSend }];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response: AssistantResponse = await askPepekExecutiveAI(textToSend, newMessages);
      setMessages([...newMessages, { role: 'assistant', content: response.message }]);
      if (response.suggestedQuickReplies && response.suggestedQuickReplies.length > 0) {
        setQuickReplies(response.suggestedQuickReplies);
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'A nossa central de operações está à sua inteira disposição em Talatona. Dispomos de SUVs de luxo, 4x4 todo-terreno e vans para comitivas em todo o território de Angola.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateWhatsAppDirectLink = () => {
    const lastUserMessage = messages.filter((m) => m.role === 'user').slice(-1)[0]?.content || 'Atendimento Geral';
    const text = `*SOLICITAÇÃO À CENTRAL DE OPERAÇÕES PEPEK*\nCliente: ${currentUser?.name || 'Não identificado'}\nAssunto: ${lastUserMessage}\n\n_Solicito apoio de um despachante de frota._`;
    return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      {/* Floating Trigger Button — posicionado acima da barra inferior mobile com safe-area */}
      <div className="fixed right-5 sm:right-7 z-[45]" style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px) + 12px)' }}>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-3 p-3.5 sm:px-5 sm:py-3.5 rounded-full bg-[#06142F] hover:bg-[#0B45D8] text-white shadow-2xl border border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
            aria-label="Abrir Atendimento Executivo"
          >
            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block animate-pulse"></span>
            </div>
            <span className="hidden sm:inline font-bold text-xs">
              {currentUser ? `Olá, ${currentUser.name.split(' ')[0]}` : 'Atendimento de Frota 24/7'}
            </span>
            <MessageSquare className="w-5 h-5 text-[#0B45D8] group-hover:text-white transition-colors" />
          </button>
        )}
      </div>

      {/* Floating Interactive Chat Modal — com safe-area para iOS */}
      {isOpen && (
        <div
          className="fixed right-5 sm:right-7 z-50 w-[92vw] sm:w-[420px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-scaleUp"
          style={{
            bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px) + 12px)',
            maxHeight: 'calc(100dvh - 6rem - env(safe-area-inset-bottom, 0px) - env(safe-area-inset-top, 0px))'
          }}
        >
          {/* Top Header */}
          <div className="bg-gradient-to-r from-[#06142F] to-[#0A1E42] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white">
                <User className="w-4 h-4 text-[#0B45D8]" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">
                  Despacho Executivo PEPEK
                </h4>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {currentUser ? `${currentUser.roleLabel} Detectado` : 'Central Talatona · Online'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Fechar atendimento"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#0B45D8] text-white rounded-br-none shadow-xs font-medium'
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-xs'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-200 flex items-center gap-1.5">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Contextual Reply Chips */}
          {quickReplies.length > 0 && (
            <div className="p-2.5 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(reply)}
                  className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-[#0B45D8] hover:text-white text-gray-700 text-[10px] font-semibold whitespace-nowrap transition-colors border border-gray-200 cursor-pointer"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Bottom Controls */}
          <div className="p-3 bg-white border-t border-gray-200 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                inputMode="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escreva ao despachante..."
                style={{ fontSize: '16px' }} /* evitar zoom automático Safari iOS */
                className="flex-1 py-2.5 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-[#0B45D8]"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-2.5 rounded-xl bg-[#0B45D8] text-white disabled:opacity-50 transition-colors cursor-pointer"
                aria-label="Enviar mensagem"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Direct WhatsApp link */}
            <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
              <span>Atendimento com histórico</span>
              <a
                href={generateWhatsAppDirectLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] hover:underline font-bold flex items-center gap-1"
              >
                <span>Continuar no WhatsApp</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
