import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send, X, Minimize2, Maximize2, RefreshCw, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../services/api';

interface GlowBotWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onOpenConsultant: () => void;
  onOpenBooking: () => void;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string; payload?: any }[];
}

export const GlowBotWidget: React.FC<GlowBotWidgetProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenConsultant,
  onOpenBooking,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Namaste & Hello! ✨ I am GlowBot, your 24/7 AI beauty concierge. How can I help you sparkle today? You can ask me for parlor recommendations, bridal packages, skin prep timelines, or instant booking help.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActions: [
        { label: '✨ Recommend Bridal Salon', action: 'consultant' },
        { label: '💆‍♀️ Top Hydra Facials', action: 'services_skin' },
        { label: '📅 Book Hair Appointment', action: 'booking' },
        { label: '🏷️ Today\'s Promo Codes', action: 'offers' }
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await api.sendGlowBotChat(history);
      if (res.success) {
        const botMsg: ChatMessage = {
          sender: 'bot',
          text: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickActions: res.quickActions
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "I'm right here! You can explore verified parlors in Indiranagar, Koramangala, and across Bengaluru or launch our full AI Consultant for a personalized regimen.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickActions: [
            { label: '✨ Launch AI Consultant', action: 'consultant' },
            { label: '💅 Browse Services', action: 'services' }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (action === 'consultant') {
      onOpenConsultant();
      onClose();
    } else if (action === 'booking') {
      onOpenBooking();
      onClose();
    } else if (action.startsWith('services')) {
      onNavigate('services');
      onClose();
    } else if (action === 'offers') {
      onNavigate('packages');
      onClose();
    } else if (action === 'explore') {
      onNavigate('explore');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[520px]"
      >
        {/* Chat Header */}
        <div className="bg-[#4A0E0E] text-white p-4 flex items-center justify-between border-b border-[#EAE2D8]/20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#F2E8E8] flex items-center justify-center text-[#4A0E0E] shadow-sm">
                <Bot className="w-5 h-5 text-[#4A0E0E]" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#4A0E0E] rounded-full" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h4 className="text-sm font-serif-luxury font-bold text-white">GlowBot AI</h4>
                <span className="px-1.5 py-0.2 text-[9px] bg-white/15 text-[#F2E8E8] rounded-full font-semibold">
                  AI Concierge
                </span>
              </div>
              <p className="text-[11px] text-[#F2E8E8]/80">Beauty & Salon Assistant</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={onClose}
              className="p-1.5 text-[#F2E8E8]/70 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FDFBF7] text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#4A0E0E] text-white rounded-br-none shadow-xs'
                    : 'bg-[#FAF7F2] text-[#1A1A1A] border border-[#EAE2D8] rounded-bl-none shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <span
                  className={`block text-[9px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-[#F2E8E8]/80' : 'text-[#888888]'
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>

              {/* Action Suggestion Pills */}
              {m.quickActions && m.quickActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                  {m.quickActions.map((qa, qidx) => (
                    <button
                      key={qidx}
                      onClick={() => handleActionClick(qa.action)}
                      className="px-2.5 py-1 bg-[#F2E8E8] hover:bg-[#EAE2D8] text-[#4A0E0E] text-[11px] font-semibold rounded-full border border-[#EAE2D8] transition cursor-pointer"
                    >
                      {qa.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-[#5C5C5C] p-2">
              <Sparkles className="w-4 h-4 text-[#4A0E0E] animate-spin" />
              <span className="text-[11px]">GlowBot is formulating recommendations...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-3 bg-[#FAF7F2] border-t border-[#EAE2D8] flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask GlowBot anything about beauty, booking, skin..."
            className="flex-1 px-4 py-2 bg-white text-[#1A1A1A] text-xs rounded-full border border-[#EAE2D8] focus:outline-none focus:border-[#4A0E0E]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || loading}
            className="p-2.5 bg-[#4A0E0E] hover:bg-[#380A0A] disabled:opacity-40 text-white rounded-full transition cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
