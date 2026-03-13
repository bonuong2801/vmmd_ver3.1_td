import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Info } from 'lucide-react';
import { CURRENT_ACTIVITIES } from "../constants";

const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const activity = CURRENT_ACTIVITIES.find(a => a.id === Number(id));

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-[#5D0E11] mb-4">Không tìm thấy hoạt động</h2>
          <button
            onClick={() => navigate('/')}
            className="text-[#8B7355] hover:underline flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} /> Quay lại trang chủ
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
      className="min-h-screen bg-[#FDFBF7] pt-24 pb-16"
    >
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-[#8B7355] hover:text-[#5D0E11] transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E5D5BC]">
          <div className="relative h-[400px]">
            <img
              src={activity.image}
              alt={activity.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">
                {activity.title}
              </h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm">
                  <Calendar size={16} />
                  <span>{activity.date}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="flex items-start gap-4 mb-8 p-6 bg-[#FDFBF7] rounded-xl border-l-4 border-[#5D0E11]">
              <Info className="text-[#5D0E11] shrink-0 mt-1" size={24} />
              <p className="text-lg text-[#5D0E11] font-medium leading-relaxed italic">
                {activity.description}
              </p>
            </div>

            <div className="prose prose-lg max-w-none text-[#2C1810] leading-relaxed">
              {activity.details?.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-[#E5D5BC] flex justify-between items-center">
              <div className="text-sm text-[#8B7355]">
                Văn miếu Mao Điền - Di tích Quốc gia Đặc biệt
              </div>
              <div className="flex gap-4">
                {/* Social share buttons could go here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityDetail;
