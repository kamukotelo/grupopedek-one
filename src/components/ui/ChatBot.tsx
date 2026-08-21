import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage } from '../../types';
import { askPepekAssistant, generateHandoffUrl } from '../../lib/ai';

export const ChatBot: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: t('chat.welcome'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickChips = [
    'Transfer no Aeroporto 4 de Fevereiro',
    'Preço da SUV Land Cruiser Prado',
    'Contrato mensal para Empresa',
    'Chauffeur de Protocolo Diplomático',
    'Viagem para o Huambo / Bengo'
  ];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendPrompt = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userText = textToSend.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const history = messages.map(m => ({
      role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
      content: m.text
    }));

    try {
      const response = await askPepekAssistant(userText, history);

      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        text: response.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          suggestedAction: response.suggestedAction,
          handoffSummary: response.handoffSummary
        }
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Bot response error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleSendPrompt(input);
  };

  const handleHandoff = (summary?: string) => {
    const transcript = messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');
    const url = generateHandoffUrl(summary || 'Atendimento com Assistente IA PEPEK', transcript);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-[#06142F] text-white px-3.5 py-2 rounded-full shadow-2xl border border-white/20 text-xs font-semibold cursor-pointer hover:bg-[#0A1E42] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0B45D8]" />
            <span>Assistente Executivo 24/7</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-[#0B45D8] hover:bg-[#1A58F5] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105 relative cursor-pointer"
          aria-label="Abrir assistente virtual"
        >
          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0B45D8]"></span>
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      </div>

      {/* Chat Window Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[580px] h-[540px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#06142F] to-[#0A1E42] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0B45D8] flex items-center justify-center text-white shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{t('chat.title')}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </h4>
                <p className="text-[11px] text-gray-300">
                  {t('chat.subtitle')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 flex flex-col">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 max-w-[85%] ${
                  m.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    m.sender === 'user' ? 'bg-[#0B45D8] text-white' : 'bg-gray-200 text-[#06142F]'
                  }`}
                >
                  {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#0B45D8] text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-xs'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`text-[9px] block mt-1 ${
                      m.sender === 'user' ? 'text-blue-100 text-right' : 'text-gray-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 self-start bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-xs">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-gray-100 border-t border-gray-200 overflow-x-auto flex gap-1.5 scrollbar-none">
            {quickChips.map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendPrompt(chip)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-[#0B45D8] hover:text-white text-gray-700 text-[10px] font-semibold border border-gray-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Quick Handoff Action Bar */}
          <div className="px-3 py-2 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-800">
              Prefere falar directamente com um despachante?
            </span>
            <button
              onClick={() => handleHandoff()}
              className="text-[11px] font-bold text-white bg-[#25D366] hover:bg-emerald-600 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0B45D8]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-[#0B45D8] hover:bg-[#1A58F5] text-white disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
