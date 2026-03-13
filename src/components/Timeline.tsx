import { motion, AnimatePresence } from "motion/react";
import { TIMELINE } from "../constants";
import { Calendar, X, Info } from "lucide-react";
import { useState } from "react";

export default function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState<typeof TIMELINE[0] | null>(null);

  return (
    <section id="timeline" className="py-32 bg-warm-bg text-ink overflow-hidden border-t border-burgundy/5 relative">
      <div className="absolute inset-0 opacity-[0.03] lattice-pattern pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-px w-8 bg-burgundy/20" />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-burgundy/60">
              Dòng chảy thời gian
            </span>
            <div className="h-px w-8 bg-burgundy/20" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(2.5rem,10vw,5rem)] md:text-[clamp(5rem,15vw,9rem)] font-serif font-bold leading-none tracking-tighter"
          >
            Lịch sử <br />
            <span className="italic font-normal text-burgundy">Hình thành</span>
          </motion.h2>
          <div className="w-24 h-1 bg-burgundy mt-8 rounded-full" />
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-burgundy/40 via-burgundy/10 to-transparent hidden md:block" />
          
          <div className="space-y-48">
            {TIMELINE.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className={`flex flex-col md:flex-row items-center gap-16 md:gap-0 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:text-right md:pr-24" : "md:text-left md:pl-24"}`}>
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-white text-burgundy/40 mb-10 border border-burgundy/10 shadow-xl ${index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"} oriental-border`}>
                    <Calendar size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[clamp(3rem,12vw,6rem)] md:text-[clamp(6rem,15vw,9rem)] font-serif font-bold text-burgundy mb-6 tracking-tighter">{item.year}</h3>
                  <h4 className="text-[12px] font-bold text-olive/60 mb-8 tracking-[0.4em] uppercase">{item.event}</h4>
                  <p className="text-olive/80 font-serif italic leading-relaxed text-xl max-w-md mx-auto md:mx-0 mb-10">
                    {item.description}
                  </p>
                  <button
                    onClick={() => setSelectedEvent(item)}
                    className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-burgundy hover:text-burgundy/60 transition-colors ${index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"}`}
                  >
                    <Info size={14} />
                    Xem chi tiết
                  </button>
                </div>
                
                <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-burgundy shadow-2xl hidden md:flex border-4 border-warm-bg" />
                
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pl-24" : "md:pr-24"}`}>
                  <div className="relative aspect-[16/11] oriental-frame overflow-hidden group shadow-2xl bg-wood">
                    <img 
                      src={item.image} 
                      alt={item.event}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-wood/60 via-transparent to-transparent opacity-60" />
                    
                    {/* Architectural Detail */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-burgundy roof-shape opacity-40" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-stone-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-warm-bg rounded-3xl overflow-hidden shadow-2xl border-4 border-gold oriental-border"
            >
              <div className="absolute inset-0 opacity-[0.03] lattice-pattern pointer-events-none" />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 z-20 w-12 h-12 bg-burgundy text-white rounded-full flex items-center justify-center shadow-xl hover:bg-burgundy/90 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col md:flex-row h-full max-h-[80vh] overflow-y-auto">
                <div className="w-full md:w-1/2 h-64 md:h-auto">
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.event}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 p-10 md:p-16 relative">
                  <div className="mb-8">
                    <span className="text-[11px] font-bold text-burgundy/60 uppercase tracking-[0.4em] block mb-2">{selectedEvent.year}</span>
                    <h3 className="text-4xl font-serif font-bold text-ink leading-tight">{selectedEvent.event}</h3>
                  </div>
                  <div className="space-y-6">
                    <p className="text-stone-600 text-lg font-serif italic leading-relaxed">
                      {selectedEvent.description}
                    </p>
                    <div className="h-px w-12 bg-burgundy/20" />
                    <p className="text-stone-500 leading-relaxed">
                      {selectedEvent.details}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
