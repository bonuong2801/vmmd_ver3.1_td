import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TEMPLE_AREAS } from "../constants";
import { MapPin, Info, X, Navigation } from "lucide-react";
import CustomFrame from "./CustomFrame";

// Memoized Pin component to prevent unnecessary re-renders
const MapPinPoint = memo(({ area, isSelected, onClick }: { 
  area: typeof TEMPLE_AREAS[0], 
  isSelected: boolean, 
  onClick: (area: typeof TEMPLE_AREAS[0]) => void 
}) => (
  <motion.button
    onClick={() => onClick(area)}
    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 will-change-transform"
    style={{ left: `${area.coordinates.x}%`, top: `${area.coordinates.y}%` }}
    whileHover={{ scale: 1.15 }}
    whileTap={{ scale: 0.9 }}
  >
    <div className={`relative flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full transition-all duration-500 border-2 ${
      isSelected 
      ? "bg-burgundy text-white scale-125 shadow-2xl border-gold" 
      : "bg-white/90 backdrop-blur-md text-burgundy shadow-xl border-burgundy/10 hover:bg-burgundy hover:text-white"
    }`}>
      <MapPin size={18} className={`md:w-[22px] md:h-[22px] ${isSelected ? "animate-bounce" : ""}`} />
      
      {isSelected && (
        <motion.div 
          layoutId="ripple"
          className="absolute inset-0 rounded-full bg-gold -z-10"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
    </div>
  </motion.button>
));

export default function InteractiveMap() {
  const [selectedArea, setSelectedArea] = useState<typeof TEMPLE_AREAS[0] | null>(null);

  const handleAreaSelect = useCallback((area: typeof TEMPLE_AREAS[0] | null) => {
    setSelectedArea(area);
  }, []);

  return (
    <section id="map" className="py-32 bg-warm-bg text-ink overflow-hidden border-t border-burgundy/5 relative">
      <div className="absolute inset-0 opacity-[0.03] lattice-pattern pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start">
          {/* Left Content */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-8 bg-burgundy/20" />
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-burgundy/60">
                  Sơ đồ Kiến trúc
                </span>
                <div className="h-px w-8 bg-burgundy/20" />
              </div>
              <h2 className="text-[clamp(2rem,8vw,4rem)] md:text-[clamp(4rem,10vw,7rem)] font-serif font-bold mb-6 md:mb-10 leading-[0.9] tracking-tight">
                Khám phá <br />
                <span className="italic font-normal text-burgundy">Khuôn viên</span>
              </h2>
              <p className="text-base md:text-lg text-olive/80 mb-8 md:mb-14 font-serif italic leading-relaxed max-w-md">
                "Văn miếu Mao Điền được thiết kế với bố cục kiến trúc truyền thống, 
                đối xứng và hài hòa, mang đậm dấu ấn văn hóa Nho giáo Việt Nam."
              </p>
              
              <div className="space-y-4">
                {TEMPLE_AREAS.map((area, index) => (
                  <button
                    key={area.id}
                    onClick={() => handleAreaSelect(area)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-500 flex items-center justify-between group oriental-border ${
                      selectedArea?.id === area.id 
                      ? "bg-burgundy text-white border-gold shadow-2xl translate-x-3" 
                      : "bg-white/50 text-olive/70 border-burgundy/5 hover:border-burgundy/20 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <span className={`text-[11px] font-mono font-bold ${selectedArea?.id === area.id ? "text-gold/60" : "text-burgundy/20"}`}>
                        0{index + 1}
                      </span>
                      <span className="font-medium tracking-[0.1em] text-sm uppercase">{area.name}</span>
                    </div>
                    <Navigation size={14} className={`transition-transform duration-500 ${selectedArea?.id === area.id ? "text-gold/60 rotate-45" : "text-burgundy/20 group-hover:text-burgundy/40"}`} />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Map */}
          <div className="lg:col-span-7 relative">
            <CustomFrame className="h-[600px] md:h-[800px]" innerClassName="bg-stone-100 rounded-2xl shadow-inner">
              <div className="absolute inset-0 opacity-[0.05] cloud-pattern pointer-events-none" />
              
              {/* Map Background */}
              <div className="absolute inset-0 bg-[#F5F2ED]">
                <img 
                  src="/images/map-layout.jpg" 
                  alt="Văn Miếu Map" 
                  loading="lazy"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Decorative Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10 pointer-events-none">
                  {Array.from({ length: 144 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-burgundy/20" />
                  ))}
                </div>
              </div>
              
              {/* Map Pins */}
              <div className="absolute inset-0">
                {TEMPLE_AREAS.map((area) => (
                  <MapPinPoint 
                    key={area.id} 
                    area={area} 
                    isSelected={selectedArea?.id === area.id} 
                    onClick={handleAreaSelect} 
                  />
                ))}
              </div>

              {/* Area Detail Overlay */}
              <AnimatePresence>
                {selectedArea && (
                  <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.95 }}
                    className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 bg-white shadow-2xl border border-gold/30 z-20 overflow-hidden rounded-3xl"
                  >
                    <div className="absolute inset-0 opacity-[0.03] lattice-pattern pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row">
                      {/* Image Section */}
                      <div className="w-full md:w-1/3 h-48 md:h-64 overflow-hidden">
                        <img 
                          src={selectedArea.image} 
                          alt={selectedArea.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      {/* Content Section */}
                      <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-burgundy/60 mb-2 block">Thông tin Khu vực</span>
                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-ink">{selectedArea.name}</h3>
                          </div>
                          <button 
                            onClick={() => handleAreaSelect(null)}
                            className="w-10 h-10 bg-burgundy/5 hover:bg-burgundy/10 rounded-full flex items-center justify-center transition-colors"
                          >
                            <X size={18} className="text-burgundy/40" />
                          </button>
                        </div>
                        <p className="text-olive/80 leading-relaxed font-serif italic text-base md:text-lg">
                          {selectedArea.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CustomFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
