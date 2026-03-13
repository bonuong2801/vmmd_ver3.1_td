import { motion } from "motion/react";
import { SCHOLARS } from "../constants";
import { GraduationCap, Award, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export default function Scholars() {
  const navigate = useNavigate();

  const handleScholarClick = useCallback((id: string) => {
    navigate(`/scholar/${id}`);
  }, [navigate]);

  return (
    <section id="scholars" className="py-32 bg-warm-bg text-ink overflow-hidden border-t border-burgundy/5 relative">
      <div className="absolute inset-0 opacity-[0.03] lattice-pattern pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-burgundy/10 rounded-lg flex items-center justify-center border border-burgundy/20">
                <GraduationCap className="text-burgundy" size={20} />
              </div>
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-burgundy/60 block">
                Bảng vàng danh dự
              </span>
            </div>
            <h2 className="text-[clamp(2.5rem,10vw,5rem)] md:text-[clamp(5rem,15vw,9rem)] font-serif font-bold leading-[0.85] tracking-tighter">
              Những bậc <br />
              <span className="italic font-normal text-burgundy">Hiền tài</span>
            </h2>
          </div>
          <p className="text-olive/70 font-serif italic leading-relaxed max-w-xs text-sm md:text-base text-left">
            "Hiền tài là nguyên khí của quốc gia, nguyên khí thịnh thì thế nước mạnh, rồi lên cao..."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-24">
          {SCHOLARS.map((scholar, index) => (
            <motion.div
              key={scholar.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => handleScholarClick(scholar.id)}
              className="group cursor-pointer will-change-transform"
            >
              <div className="relative aspect-[3/4] mb-10 oriental-frame overflow-hidden bg-wood">
                <img
                  src={scholar.image}
                  alt={scholar.name}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wood via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                
                {/* Decorative Corner */}
                <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-gold/40" />
                
                <div className="absolute bottom-10 left-10 right-10">
                  <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-gold/60 mb-3 block">
                    {scholar.period}
                  </span>
                  <h3 className="text-4xl font-serif font-bold text-white leading-tight mb-6 group-hover:text-gold transition-colors">
                    {scholar.name}
                  </h3>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white border-b border-white/30 pb-2 w-fit opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                      Xem tiểu sử <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5 px-4">
                <div className="flex items-center gap-4 text-burgundy/40">
                  <div className="w-10 h-px bg-burgundy/20" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{scholar.title}</span>
                </div>
                <p className="text-olive/80 text-lg font-serif italic leading-relaxed line-clamp-2">
                  "{scholar.achievement}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
