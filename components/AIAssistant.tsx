
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw, MessageSquare, Info, FileCheck, ExternalLink, ClipboardList } from 'lucide-react';
import { rtoService } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  grounding?: any[];
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hello! I'm your RTO Consultant. I can help you with Driving License procedures, vehicle registration details, document checklists, and more. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string) => {
    const userMsg = customPrompt || input;
    if (!userMsg.trim() || loading) return;

    if (!customPrompt) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const result = await rtoService.getAssistantResponse(userMsg);
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      text: result.text, 
      grounding: result.grounding 
    }]);
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', text: "Hello! I'm your RTO Consultant. How can I assist you today?" }]);
  };

  const checklistCategories = [
    { name: 'New DL', prompt: 'Show me the complete document checklist for a new Permanent Driving License application in India.' },
    { name: 'RC Transfer', prompt: 'What documents are required for Vehicle Ownership Transfer (RC Transfer) between individuals?' },
    { name: 'DL Renewal', prompt: 'List documents needed for Driving License renewal after expiry.' },
    { name: 'NOC Certificate', prompt: 'Checklist for obtaining NOC for vehicle transfer to another state.' }
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">AI RTO Consultant</h3>
            <p className="text-slate-400 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Grounded in Live Data
            </p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-300"
          title="Clear Chat"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-gray-50/50"
      >
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`flex max-w-[85%] gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 h-10 w-10 rounded-2xl flex items-center justify-center border ${m.role === 'user' ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-slate-700 border-gray-200 shadow-sm'}`}>
                {m.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              <div className="space-y-2 max-w-full">
                <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-gray-200 rounded-tl-none whitespace-pre-wrap'}`}>
                  {m.text}
                </div>
                {m.grounding && m.grounding.length > 0 && (
                  <div className="bg-white/50 border border-gray-100 rounded-2xl p-3 space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" /> Sources
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {m.grounding.map((chunk, cIdx) => (
                        chunk.web && (
                          <a 
                            key={cIdx}
                            href={chunk.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md hover:bg-indigo-100 transition-colors flex items-center gap-1 max-w-[150px] truncate"
                          >
                            {chunk.web.title || 'Source'}
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-in fade-in">
            <div className="flex gap-3">
              <div className="shrink-0 h-10 w-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-slate-700 shadow-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-3xl rounded-tl-none shadow-sm flex gap-1">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checklist Quick Access */}
      <div className="px-6 py-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList className="h-4 w-4 text-indigo-600" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Service Checklists</span>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {checklistCategories.map(cat => (
            <button 
              key={cat.name}
              onClick={() => handleSend(cat.prompt)}
              className="whitespace-nowrap flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-semibold text-indigo-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all active:scale-95 shadow-sm"
            >
              <FileCheck className="h-3 w-3" />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Ask about forms, documents, or procedures..."
            className="flex-1 px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all shadow-inner"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center active:scale-95"
          >
            <Send className="h-6 w-6" />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1 uppercase tracking-widest font-bold">
          <Info className="h-3 w-3" /> Search results are grounded in real-time government portals
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
