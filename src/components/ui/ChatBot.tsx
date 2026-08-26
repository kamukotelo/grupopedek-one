import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  X,
  Send,
  User,
  Sparkles,
  Phone,
  ArrowUpRight,
  Headphones,
  CheckCircle2
} from 'lucide-react';
import { askPepekExecutiveAI, AssistantResponse, SessionContext } from '../../lib/ai';
import { OFFICIAL_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import { useAuth } from '../../context/AuthContext';

export const ChatBot: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, isDemoMode, setIsPortalOpen } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    Array<{
      role: 'user' | 'assistant';
      content: string;
      requiresHumanHandover?: boolean;
      handoverContext?: string;
    }>
  >([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionContext, setSessionContext] = useState<SessionContext>({
    step: 'idle'
  });
  const [quickReplies, setQuickReplies] = useState<string[]>([
    'Recomendar Viatura',
    'Preços das Diárias',
    'Transfer Aeroporto VIP',
    'Falar com um Consultor'
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [proactiveBubbleVisible, setProactiveBubbleVisible] = useState(false);

  // Saudação contextual personalizada apenas para utilizadores autenticados.
  // Visitantes anónimos recebem uma saudação humana, calorosa e sem jargão.
  useEffect(() => {
    if (currentUser && isDemoMode) {
      const greeting = `Olá, ${currentUser.name}! Em que posso apoiar a sua operação de mobilidade hoje?`;
      setMessages([{ role: 'assistant', content: greeting }]);
      setQuickReplies([
        'Consultar Viaturas Disponíveis',
        'Faturas e Documentos',
        'Pedir Nova Viatura',
        'Falar com Despacho'
      ]);
    } else if (currentUser && !isDemoMode) {
      const firstName = currentUser.name.split(' ')[0];
      setMessages([
        {
          role: 'assistant',
          content: `Olá, ${firstName}! Como posso ajudar na sua mobilidade hoje?`
        }
      ]);
      setQuickReplies([
        'Consultar Reservas',
        'Pedir Viatura',
        'Falar com Atendimento'
      ]);
    } else {
      setMessages([
        {
          role: 'assistant',
          content:
            'Olá! Bem-vindo(a) à PEPEK GRUPO em Talatona. Em que posso apoiar a sua viagem ou a mobilidade da sua instituição hoje?'
        }
      ]);
      setQuickReplies([
        'Recomendar Viatura',
        'Preços das Diárias',
        'Transfer Aeroporto VIP',
        'Falar com um Consultor'
      ]);
    }
  }, [currentUser, isDemoMode]);

  // Proactive non-intrusive assistant nudge after 12s on page
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setProactiveBubbleVisible(true);
      }
    }, 12000);
    return () => clearTimeout(timer);
  }, [isOpen]);

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

    // Track vehicle mentions in session context
    let updatedVehicleContext = sessionContext.lastMentionedVehicle;
    const lower = textToSend.toLowerCase();
    if (lower.includes('prado') || lower.includes('lc300') || lower.includes('suv')) {
      updatedVehicleContext = 'Land Cruiser Prado TXL / LC300';
    } else if (lower.includes('hilux') || lower.includes('4x4') || lower.includes('fortuner')) {
      updatedVehicleContext = 'Toyota Hilux 4x4 Todo-Terreno';
    } else if (lower.includes('hiace') || lower.includes('van') || lower.includes('comitiva')) {
      updatedVehicleContext = 'Toyota Hiace VIP 12L';
    }

    const updatedContext: SessionContext = {
      ...sessionContext,
      lastMentionedVehicle: updatedVehicleContext
    };
    setSessionContext(updatedContext);

    const newMessages = [...messages, { role: 'user' as const, content: textToSend }];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response: AssistantResponse = await askPepekExecutiveAI(textToSend, newMessages, updatedContext);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: response.message,
          requiresHumanHandover: response.requiresHumanHandover,
          handoverContext: response.handoverContext
        }
      ]);
      if (response.suggestedQuickReplies && response.suggestedQuickReplies.length > 0) {
        setQuickReplies(response.suggestedQuickReplies);
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content:
            'A nossa equipa em Talatona está inteiramente ao seu dispor. Dispomos de SUVs executivas, 4x4 de campo e vans com motoristas bilingues. Posso ligá-lo a um consultor de imediato.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateWhatsAppHandoverLink = (handoverTopic?: string) => {
    const topic = handoverTopic || 'Atendimento de Frota';
    const lastUserMsg =
      messages.filter((m) => m.role === 'user').slice(-1)[0]?.content || 'Consulta de Mobilidade';
    const vehicle = sessionContext.lastMentionedVehicle ? `\nViatura de Interesse: ${sessionContext.lastMentionedVehicle}` : '';
    const text = `*SOLICITAÇÃO DE ATENDIMENTO — PEPEK GRUPO*\nAssunto: ${topic}\nÚltima Mensagem: "${lastUserMsg}"${vehicle}\n\n_Gostaria de falar com um consultor humano para finalizar o meu pedido._`;
    return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      {/* Floating Trigger Button & Contextual Speech Bubble */}
      <div
        className="fixed right-5 sm:right-7 z-[45]"
        style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px) + 12px)' }}
      >
        {/* Contextual Nudge Bubble */}
        {proactiveBubbleVisible && !isOpen && (
          <div className="mb-2 max-w-[280px] sm:max-w-[320px] p-3.5 rounded-2xl bg-white text-gray-900 shadow-2xl border border-gray-200 animate-scaleUp relative flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#236199] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div
              className="text-xs cursor-pointer flex-1"
              onClick={() => {
                setIsOpen(true);
                setProactiveBubbleVisible(false);
              }}
            >
              <strong className="block text-[#09172C] font-bold">Consultor Pepek Grupo</strong>
              <p className="text-gray-600 text-[11px] leading-relaxed mt-0.5">
                Precisa de ajuda a escolher a viatura ideal para a sua comitiva ou viagem?
              </p>
            </div>
            <button
              onClick={() => setProactiveBubbleVisible(false)}
              className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
              aria-label="Dispensar sugestão"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              setProactiveBubbleVisible(false);
            }}
            className="group flex items-center gap-3 p-3.5 sm:px-5 sm:py-3.5 rounded-full bg-[#09172C] hover:bg-[#236199] text-white shadow-2xl border border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
            aria-label="Abrir Atendimento Executivo"
          >
            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-[#236199] block animate-pulse"></span>
            </div>
            <span className="hidden sm:inline font-bold text-xs">
              {currentUser ? `Olá, ${currentUser.name.split(' ')[0]}` : 'Atendimento 24/7'}
            </span>
            <MessageSquare className="w-5 h-5 text-[#236199] group-hover:text-white transition-colors" />
          </button>
        )}
      </div>

      {/* Floating Interactive Chat Modal */}
      {isOpen && (
        <div
          className="fixed right-5 sm:right-7 z-50 w-[92vw] sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-scaleUp"
          style={{
            bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px) + 12px)',
            maxHeight:
              'calc(100dvh - 6rem - env(safe-area-inset-bottom, 0px) - env(safe-area-inset-top, 0px))'
          }}
        >
          {/* Top Header */}
          <div className="bg-gradient-to-r from-[#09172C] to-[#0C2E60] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white">
                <Headphones className="w-4 h-4 text-[#236199]" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Consultor de Mobilidade PEPEK</h4>
                <p className="text-[10px] text-[#236199] flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#236199] animate-pulse"></span>
                  <span>Central de Talatona · Disponível 24/7</span>
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
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#236199] text-white rounded-br-none shadow-xs font-medium'
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-xs'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Instant Human Handover Button if escalation required */}
                {msg.requiresHumanHandover && (
                  <div className="mt-2 w-[85%] animate-fadeIn">
                    <a
                      href={generateWhatsAppHandoverLink(msg.handoverContext)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp w-full justify-center text-xs py-2.5 font-bold shadow-md flex items-center gap-2"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Falar no WhatsApp com Consultor</span>
                    </a>
                  </div>
                )}
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
                  className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-[#236199] hover:text-white text-gray-700 text-[10px] font-semibold whitespace-nowrap transition-colors border border-gray-200 cursor-pointer"
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
                placeholder="Escreva a sua mensagem..."
                style={{ fontSize: '16px' }}
                className="flex-1 py-2.5 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-[#236199]"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-2.5 rounded-xl bg-[#236199] text-white disabled:opacity-50 transition-colors cursor-pointer"
                aria-label="Enviar mensagem"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Direct WhatsApp link */}
            <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
              <span>Atendimento humano em Talatona</span>
              <a
                href={generateWhatsAppHandoverLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#236199] hover:underline font-bold flex items-center gap-1"
              >
                <span>WhatsApp Direto</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
