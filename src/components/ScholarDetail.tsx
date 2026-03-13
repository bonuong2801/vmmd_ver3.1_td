import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useEffect } from "react";
import { SCHOLARS } from "../constants";
import { ArrowLeft, Book, Calendar, Award } from "lucide-react";

export default function ScholarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const scholar = SCHOLARS.find((s) => s.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!scholar) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Không tìm thấy thông tin danh nhân</h2>
          <button 
            onClick={() => navigate(-1)}
            className="text-stone-600 hover:text-stone-900 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} /> Quay lại trang trước
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-stone-50 text-stone-900 selection:bg-stone-900 selection:text-stone-100"
    >
      <div className="max-w-6xl mx-auto px-6 py-24">
        <button 
          onClick={() => navigate(-1)}
          className="group mb-20 flex items-center gap-3 text-stone-400 hover:text-stone-900 transition-all uppercase text-[10px] font-bold tracking-[0.3em]"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          Quay lại trang trước
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.15)] border border-stone-200/50">
              <img 
                src={scholar.image} 
                alt={scholar.name}
                className="w-full h-full object-cover scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-12"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-stone-300" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">
                  {scholar.title}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-light leading-[0.9] tracking-tighter mb-6">
                {scholar.name}
              </h1>
              <div className="flex items-center gap-3 text-stone-500 font-serif italic text-lg">
                <Calendar size={20} strokeWidth={1.5} />
                <span>Thời kỳ: {scholar.period}</span>
              </div>
            </div>

            <div className="space-y-12">
              <div className="p-10 bg-white rounded-[2.5rem] border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Award size={120} />
                </div>
                <div className="flex items-center gap-3 mb-6 text-stone-400">
                  <Award size={20} strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Thành tựu chính</span>
                </div>
                <p className="text-xl md:text-2xl text-stone-800 font-serif italic leading-tight relative z-10">
                  "{scholar.achievement}"
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-stone-400">
                  <Book size={20} strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Tiểu sử & Sự nghiệp</span>
                </div>
                <p className="text-stone-600 font-light leading-relaxed text-lg md:text-xl font-serif">
                  {scholar.biography}
                </p>
              </div>

              <div className="pt-12 border-t border-stone-200">
                <p className="text-stone-500 font-light leading-relaxed text-base italic">
                  {scholar.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
