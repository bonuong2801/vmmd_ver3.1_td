import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import { MessageSquare, Send, X, User, Bot, Loader2, Info, Sparkles, History } from "lucide-react";

const SYSTEM_INSTRUCTION = `Bạn là một hướng dẫn viên chuyên nghiệp tại Văn miếu Mao Điền, một di tích lịch sử văn hóa tại Xã Mao Điền, Thành phố Hải Phòng, Việt Nam. 
Mục tiêu của bạn là giáo dục học sinh và du khách về lịch sử, kiến trúc và các vị đại học sĩ được thờ phụng tại đây.
Thông tin chính:
- Địa điểm: Xã Mao Điền, Hải Phòng.
- Lịch sử: Xây dựng vào thế kỷ 15 (thời Lê Sơ), chuyển về vị trí hiện tại năm 1801 (thời Nguyễn).
- Các vị hiền tài: Chu Văn An, Mạc Đĩnh Chi, Nguyễn Bỉnh Khiêm, Tuệ Tĩnh, Phạm Sư Mạnh, Vũ Hữu, Nguyễn Thị Duệ (nữ tiến sĩ đầu tiên).
- Ý nghĩa: Văn Miếu lớn thứ hai Việt Nam sau Văn Miếu Quốc Tử Giám Hà Nội.
- Kiến trúc: Cổng Tam Quan, giếng Thiên Quang, nhà bia, nhà Đại Bái, đền Khai Thánh.
Hãy trả lời một cách giáo dục, tôn trọng và súc tích bằng tiếng Việt. Sử dụng Markdown để định dạng.`;

export default function VirtualGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "model"; text: string }[]>([
    { role: "model", text: "Xin chào! Tôi là hướng dẫn viên ảo của bạn tại Văn miếu Mao Điền. Tôi có thể giúp gì cho bạn trong việc khám phá lịch sử hôm nay?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isLoading]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      
      if (!apiKey || apiKey === "undefined" || apiKey === "") {
        throw new Error("API_KEY_MISSING");
      }

      const ai = new GoogleGenAI({ apiKey });
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const response = await chat.sendMessage({ message: userMessage });
      const text = response.text || "Tôi xin lỗi, tôi không thể xử lý yêu cầu đó.";
      
      setMessages(prev => [...prev, { role: "model", text }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      let errorMessage = "Tôi đang gặp khó khăn khi kết nối với hồ sơ lịch sử. Vui lòng thử lại sau giây lát.";
      
      if (error instanceof Error && error.message === "API_KEY_MISSING") {
        errorMessage = "### Lỗi cấu hình API\n\nĐể Chat Box hoạt động trên Vercel, bạn cần:\n1. Vào **Vercel Settings** > **Environment Variables**.\n2. Thêm biến `VITE_GEMINI_API_KEY` với giá trị là API Key của bạn.\n3. Redeploy lại dự án.";
      }
      
      setMessages(prev => [...prev, { role: "model", text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-burgundy text-white rounded-full shadow-[0_20px_50px_rgba(139,0,0,0.3)] flex items-center justify-center hover:bg-lacquer transition-all duration-500 z-50 group border-2 border-gold/50"
        style={{ marginRight: '-6px', marginLeft: '-2px', marginBottom: '49px' }}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles size={24} className="group-hover:rotate-12 transition-transform duration-500 text-gold" />
        <span className="absolute right-20 bg-burgundy/90 backdrop-blur-md text-gold text-[10px] px-4 py-2 rounded-full uppercase tracking-[0.4em] font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap border border-gold/30 translate-x-4 group-hover:translate-x-0">
          Hỏi Hướng dẫn viên
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-8 right-8 w-[90vw] md:w-[420px] h-[650px] bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden z-[60] border-4 border-gold"
          >
            <div className="absolute inset-0 opacity-[0.03] lattice-pattern pointer-events-none" />
            
            {/* Header */}
            <div className="bg-wood p-8 text-white flex items-center justify-between relative z-10 border-b border-gold/20">
              <div className="absolute inset-0 opacity-[0.05] cloud-pattern pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-burgundy flex items-center justify-center border border-gold/30 shadow-inner">
                  <Bot size={24} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold tracking-tight text-white">Hướng dẫn viên</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-bold">AI Assistant</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 bg-burgundy/20 hover:bg-burgundy/40 rounded-full flex items-center justify-center transition-colors border border-white/10 relative z-10"
              >
                <X size={20} className="text-white/60" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-8 bg-warm-bg/30 scroll-smooth relative z-10"
            >
              <div className="bg-white/80 border-2 border-gold/20 rounded-3xl p-6 flex gap-4 items-start shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] lattice-pattern pointer-events-none" />
                <div className="w-8 h-8 rounded-xl bg-burgundy/5 flex items-center justify-center shrink-0 relative z-10">
                  <Info size={16} className="text-burgundy/40" />
                </div>
                <p className="text-[11px] text-olive/60 leading-relaxed font-bold uppercase tracking-[0.2em] relative z-10">
                  Hãy hỏi tôi về lịch sử Văn Miếu, các vị đại học sĩ, hoặc kiến trúc độc đáo tại đây!
                </p>
              </div>

              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${
                    msg.role === "user" ? "bg-stone-100 border-stone-200" : "bg-burgundy border-gold/30"
                  }`}>
                    {msg.role === "user" ? <User size={18} className="text-stone-500" /> : <Bot size={18} className="text-gold" />}
                  </div>
                  <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${
                    msg.role === "user" 
                    ? "bg-white text-ink rounded-tr-none border-2 border-gold/10" 
                    : "bg-burgundy text-white rounded-tl-none border border-gold/20"
                  }`}>
                    <div className={`markdown-body prose prose-sm max-w-none ${msg.role === "model" ? "prose-invert" : "prose-stone"}`}>
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-2xl bg-burgundy flex items-center justify-center border border-gold/30 shrink-0 shadow-sm">
                    <Bot size={18} className="text-gold" />
                  </div>
                  <div className="bg-burgundy p-5 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2 border border-gold/20">
                    <div className="flex gap-1">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-gold/40 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-gold/40 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-gold/40 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-8 bg-white border-t-2 border-gold/20 relative z-10">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Đặt câu hỏi về Văn Miếu..."
                  className="w-full bg-warm-bg/50 border-2 border-gold/10 rounded-2xl py-5 pl-8 pr-16 text-sm focus:ring-2 focus:ring-gold/20 focus:border-gold/30 transition-all placeholder:text-olive/30 font-serif italic"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-12 h-12 bg-burgundy text-gold rounded-xl flex items-center justify-center hover:bg-lacquer disabled:opacity-30 disabled:hover:bg-burgundy transition-all shadow-lg border border-gold/30"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
