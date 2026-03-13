import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, MapPin, Calendar, Play, GraduationCap, X } from "lucide-react";

export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-wood text-ink">
      {/* Background with Oriental Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 opacity-20 lattice-pattern z-20" />
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          src="/images/vanmieumaodien.jpg"
          alt="Văn miếu Mao Điền"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Architectural Frame */}
      <div className="absolute inset-8 md:inset-16 border border-gold/10 z-20 pointer-events-none">
        <div className="absolute -top-1 -left-1 w-16 h-16 border-t-2 border-l-2 border-gold/40" />
        <div className="absolute -top-1 -right-1 w-16 h-16 border-t-2 border-r-2 border-gold/40" />
        <div className="absolute -bottom-1 -left-1 w-16 h-16 border-b-2 border-l-2 border-gold/40" />
        <div className="absolute -bottom-1 -right-1 w-16 h-16 border-b-2 border-r-2 border-gold/40" />
      </div>

      {/* Vertical Decorative Text */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 z-30 hidden xl:block">
        <p className="vertical-text text-gold/40 text-[10px] uppercase tracking-[1em] font-bold">
          Tôn vinh đạo học • Gìn giữ tinh hoa
        </p>
      </div>

      {/* Content */}
      <div className="relative z-30 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-10 py-3 bg-burgundy/20 backdrop-blur-md border border-gold/30 rounded-full shadow-2xl mb-[-17px]"
            >
              <span className="text-gold text-[10px] font-bold uppercase tracking-[0.5em] text-center">
                Di tích Quốc gia Đặc biệt
              </span>
            </motion.div>
            
            <div className="relative inline-block text-center mt-4">
              <h1 className="select-none flex flex-col items-center justify-center">
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 1 }}
                  className="text-[clamp(1.5rem,5vw,2.5rem)] md:text-[clamp(2rem,2.5vw,3.5rem)] font-serif font-light text-gold/80 uppercase tracking-[0.8em] mb-[-13.2px]"
                >
                  Văn Miếu
                </motion.span>
                <motion.span 
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1.2 }}
                  className="text-[clamp(4rem,18vw,10rem)] md:text-[clamp(8rem,12vw,15rem)] font-serif font-bold text-white leading-none tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] h-[138.922px]"
                >
                  Mao Điền
                </motion.span>
              </h1>
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-10 bg-burgundy roof-shape opacity-30 blur-md" />
            </div>
          </div>

          <p className="text-stone-300 text-xl md:text-2xl font-serif italic max-w-3xl mx-auto leading-relaxed mb-10 opacity-90">
            "Nơi hội tụ khí thiêng sông núi, biểu tượng của tinh thần hiếu học và truyền thống khoa bảng ngàn năm của vùng đất Hải Phòng."
          </p>

          <div className="flex flex-wrap items-center justify-center gap-12 text-[10px] text-gold/60 uppercase tracking-[0.3em] font-bold mb-12">
            <div className="flex items-center gap-4 group cursor-default">
              <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center group-hover:border-gold transition-colors">
                <MapPin size={16} className="text-gold/40" />
              </div>
              <span>Hải Phòng, Việt Nam</span>
            </div>
            <div className="flex items-center gap-4 group cursor-default">
              <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center group-hover:border-gold transition-colors">
                <Calendar size={16} className="text-gold/40" />
              </div>
              <span>Thế kỷ XV</span>
            </div>
            <div className="flex items-center gap-4 group cursor-default">
              <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center group-hover:border-gold transition-colors">
                <GraduationCap size={16} className="text-gold/40" />
              </div>
              <span>637 Tiến sĩ</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-center">
            <motion.a
              href="#tour"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="px-16 py-6 bg-burgundy text-white rounded-full font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-lacquer transition-all shadow-2xl shadow-burgundy/40 oriental-border"
            >
              Bắt đầu hành trình
            </motion.a>
            <motion.button
              onClick={() => setIsVideoOpen(true)}
              whileHover={{ scale: 1.05 }}
              className="group flex items-center gap-5 text-white/80 hover:text-gold transition-colors"
            >
              <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:border-gold transition-colors bg-white/5 backdrop-blur-sm shadow-xl">
                <Play size={24} fill="currentColor" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Xem phim tư liệu</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-20 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video bg-wood rounded-[2rem] border-4 border-gold overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.3)]"
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-6 right-6 z-10 w-12 h-12 bg-burgundy text-gold rounded-full flex items-center justify-center hover:bg-lacquer transition-all border border-gold/30"
              >
                <X size={24} />
              </button>
              
              <video
                src="/video/video.mp4"
                title="Phim tư liệu Văn Miếu Mao Điền"
                className="w-full h-full object-cover"
                controls
                playsInline
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
