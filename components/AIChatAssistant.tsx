
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  lang: string;
}

const AIChatAssistant: React.FC<Props> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const welcomeMessages: Record<string, string> = {
    ru: 'Ассаламу алейкум! Я ваш Исламский Помощник. Спросите меня о любом ингредиенте или правилах Халяль.',
    en: 'Assalamu Alaikum! I am your Islamic Assistant. Ask me about any ingredient or Halal rules.',
    ky: 'Ассаламу алейкум! Мен сиздин исламдык жардамчыңызмын. Мага каалаган ингредиент же халал эрежелери тууралуу суроо берсеңиз болот.',
    kk: 'Ассаламу алейкум! Мен сіздің исламдық көмекшіңізбін. Кез келген ингредиент немесе халал ережелері туралы сұрақ қойыңыз.',
    ar: 'السلام عليكم! أنا مساعدك الإسلامي. اسألني عن أي مكون أو قواعد الحلال.'
  };

  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  
  useEffect(() => {
    setMessages([{role: 'bot', text: welcomeMessages[lang] || welcomeMessages.en}]);
  }, [lang]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: `You are a polite expert Islamic nutritional assistant. Current language: ${lang}. Start with Assalamu Alaikum. Provide concise and verified information about Halal, Haram, and E-numbers. Maintain an oriental, respectful tone. Support RU, EN, KY, KK, AR.`
        }
      });
      
      setMessages(prev => [...prev, {role: 'bot', text: response.text || "..."}]);
    } catch {
      setMessages(prev => [...prev, {role: 'bot', text: "Service error. Please try later."}]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-8 ${lang === 'ar' ? 'left-8' : 'right-8'} z-40`}>
      {isOpen ? (
        <div className="bg-[#042f24] rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.6)] w-[350px] sm:w-[420px] flex flex-col h-[650px] border-2 border-yellow-500/30 animate-in slide-in-from-bottom-12 duration-500 overflow-hidden islamic-pattern shadow-oriental">
          <div className="p-8 emerald-gradient flex justify-between items-center text-white border-b-2 border-yellow-500/30">
            <div className="flex items-center gap-5">
              <span className="text-4xl filter drop-shadow-[0_0_8px_white]">🕌</span>
              <div>
                <h4 className="font-black text-sm uppercase tracking-[0.3em] gold-text">AI Mufti</h4>
                <p className="text-[10px] text-emerald-200 font-black tracking-tighter uppercase opacity-70">Halal Wisdom Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-emerald-950/50 p-3 rounded-full hover:bg-emerald-800 transition-all gold-border">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-8 space-y-6 no-scrollbar bg-emerald-950/20 backdrop-blur-sm">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-6 rounded-[2rem] text-[13px] leading-relaxed font-medium shadow-oriental border transition-all ${
                  msg.role === 'user' ? 'bg-emerald-800 text-white rounded-tr-none border-emerald-600' : 'bg-[#064e3b] text-emerald-50 rounded-tl-none border-yellow-500/10 italic'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-emerald-900 border border-yellow-500/20 p-6 rounded-[2rem] animate-pulse text-[12px] text-yellow-400 font-black uppercase tracking-[0.3em]">
                   {lang === 'ru' ? 'Размышляю...' : lang === 'ky' ? 'Ойлонуп жатам...' : 'Thinking...'}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-6 bg-emerald-950 border-t-2 border-yellow-500/20 flex gap-4">
            <input 
              type="text" 
              placeholder="Type your question..."
              className="flex-grow bg-emerald-900/50 border-2 border-emerald-800 px-6 py-4 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-500 transition-all font-medium text-white placeholder-emerald-600"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="bg-yellow-400 text-emerald-950 px-6 rounded-2xl hover:bg-yellow-300 transition-all shadow-xl active:scale-90 border-b-4 border-yellow-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="emerald-gradient text-white p-7 rounded-full shadow-oriental hover:scale-110 active:scale-95 transition-all group flex items-center gap-5 border-4 border-yellow-400/40 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-yellow-400/10 animate-pulse"></div>
          <span className="text-sm font-black hidden group-hover:block transition-all uppercase tracking-[0.3em] whitespace-nowrap relative z-10">Ask Al-Mufti</span>
          <svg className="w-9 h-9 relative z-10 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21l-8.228-9.904A17.963 17.963 0 0112 2.25c4.638 0 8.837 1.747 12.028 4.632A17.935 17.935 0 0112 21z"/></svg>
        </button>
      )}
    </div>
  );
};

export default AIChatAssistant;
