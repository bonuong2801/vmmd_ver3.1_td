import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { CURRENT_ACTIVITIES } from "../constants";
import { Calendar, Info } from "lucide-react";

export default function CurrentActivities() {
  return (
    <section className="py-24 bg-warm-bg relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] lattice-pattern pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-px w-12 bg-burgundy/30" />
            <span className="text-[11px] uppercase tracking-[0.5em] text-burgundy font-bold">Nhịp sống di sản</span>
            <div className="h-px w-12 bg-burgundy/30" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(2rem,8vw,4rem)] md:text-[clamp(3rem,6vw,5rem)] font-serif font-bold text-ink mb-6"
          >
            Văn Miếu Mao Điền Ngày Nay
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-stone-600 text-lg font-serif italic max-w-2xl"
          >
            Không chỉ là nơi lưu giữ quá khứ, Văn Miếu Mao Điền vẫn đang tiếp tục sứ mệnh tôn vinh đạo học qua các hoạt động văn hóa, giáo dục đương đại.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {CURRENT_ACTIVITIES.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={`/activity/${activity.id}`}
                className="block group bg-white rounded-3xl overflow-hidden shadow-xl border border-burgundy/5 hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-6 flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <Calendar size={14} className="text-gold" />
                    {activity.date}
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-serif font-bold text-ink mb-4 group-hover:text-burgundy transition-colors">
                    {activity.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed mb-6 font-serif italic line-clamp-2">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 text-burgundy/40 group-hover:text-burgundy transition-colors">
                    <Info size={16} />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Tìm hiểu thêm</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
