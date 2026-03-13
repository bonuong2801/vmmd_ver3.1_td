import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { motion, useScroll, useSpring, AnimatePresence, Reorder } from "motion/react";
import { useEffect, useState, lazy, Suspense, useCallback, useMemo } from "react";
import { BookOpen, Map as MapIcon, History, GraduationCap, Gamepad2, Eye, Menu, X as CloseIcon, ChevronUp, Mail, Phone, MapPin, Loader2, Camera, Info } from "lucide-react";

// Lazy load components for better initial bundle size
const Hero = lazy(() => import("./components/Hero"));
const InteractiveMap = lazy(() => import("./components/InteractiveMap"));
const VirtualTour = lazy(() => import("./components/VirtualTour"));
const Timeline = lazy(() => import("./components/Timeline"));
const Scholars = lazy(() => import("./components/Scholars"));
const PuzzleGame = lazy(() => import("./components/PuzzleGame"));
const Photobooth = lazy(() => import("./components/Photobooth"));
const VirtualGuide = lazy(() => import("./components/VirtualGuide"));
const ScholarDetail = lazy(() => import("./components/ScholarDetail"));
const CurrentActivities = lazy(() => import("./components/CurrentActivities"));

function LoadingFallback() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center bg-warm-bg">
      <div className="w-20 h-20 rounded-3xl bg-burgundy/5 border border-gold/20 flex items-center justify-center animate-pulse mb-6">
        <Loader2 className="text-burgundy animate-spin" size={32} />
      </div>
      <span className="text-[10px] uppercase tracking-[0.4em] text-burgundy/40 font-bold">Đang tải tinh hoa...</span>
    </div>
  );
}

function HomePage() {
  const { scrollYProgress } = useScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // KHỐI 1: Chỉ chạy 1 lần khi tải trang để cuộn lên đầu
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // KHỐI 2: Theo dõi cuộn trang
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Show back to top button
          setShowBackToTop(currentScrollY > 1000);
          
          // Hide/Show navbar based on scroll direction
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = useMemo(() => [
    { id: "hero", label: "Trang chủ", icon: <BookOpen size={14} /> },
    { id: "map", label: "Khám phá", icon: <MapIcon size={14} /> },
    { id: "tour", label: "Tham quan 360°", icon: <Eye size={14} /> },
    { id: "timeline", label: "Lịch sử", icon: <History size={14} /> },
    { id: "scholars", label: "Hiền tài", icon: <GraduationCap size={14} /> },
    { id: "game", label: "Thử thách", icon: <Gamepad2 size={14} /> },
    { id: "activities", label: "Ngày nay", icon: <Info size={14} /> },
    { id: "photobooth", label: "Chụp ảnh", icon: <Camera size={14} /> },
  ], []);

  const scrollToSection = useCallback((id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-warm-bg font-sans selection:bg-burgundy selection:text-white relative">
      {/* Background Texture */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0">
        <div className="absolute inset-0 lattice-pattern" />
        <div className="absolute inset-0 bg-[radial-gradient(#800000_0.5px,transparent_0.5px)] [background-size:32px_32px]" />
      </div>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-burgundy z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Navigation - Desktop */}
      <motion.nav 
        initial={{ y: 0, x: "-50%" }}
        animate={{ y: isVisible ? 0 : -100, x: "-50%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-6 left-1/2 z-50 px-6 lg:px-10 py-4 lg:py-5 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-burgundy/20 hidden md:flex items-center justify-center gap-4 lg:gap-10 oriental-border max-w-[95vw] lg:max-w-none w-max"
      >
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-burgundy roof-shape opacity-20" />
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="flex items-center gap-2 lg:gap-3 text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.15em] lg:tracking-[0.2em] text-ink/70 hover:text-burgundy transition-all duration-300 group whitespace-nowrap"
          >
            <span className="text-burgundy/40 group-hover:text-burgundy transition-colors hidden xl:inline">{item.icon}</span>
            <span className="relative">
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-burgundy transition-all duration-300 group-hover:w-full" />
            </span>
          </button>
        ))}
      </motion.nav>

      {/* Navigation - Mobile Toggle */}
      <motion.button 
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-6 right-6 z-[60] md:hidden w-14 h-14 bg-burgundy text-white rounded-2xl flex items-center justify-center shadow-2xl border-2 border-gold/30 active:scale-90"
      >
        {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-stone-900 md:hidden flex flex-col items-center justify-center gap-8"
          >
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center gap-4 text-2xl font-serif italic text-stone-400 hover:text-white transition-colors"
              >
                <span className="text-stone-700 font-mono text-sm">0{index + 1}</span>
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-burgundy text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-burgundy/90 transition-colors"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <main>
        <Suspense fallback={<LoadingFallback />}>
          <div id="hero"><Hero /></div>
          <div id="map"><InteractiveMap /></div>
          <div id="tour"><VirtualTour /></div>
          <div id="timeline"><Timeline /></div>
          <div id="scholars"><Scholars /></div>
          <div id="game"><PuzzleGame /></div>
          <div id="activities"><CurrentActivities /></div>
          <div id="photobooth"><Photobooth /></div>
        </Suspense>
      </main>

      <footer className="py-16 md:py-32 bg-wood text-warm-bg relative overflow-hidden border-t-8 border-burgundy">
        <div className="absolute inset-0 opacity-[0.03] lattice-pattern pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full cloud-pattern opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-24 mb-16 md:mb-24">
            <div className="space-y-6 md:space-y-10">
              <div className="flex items-center gap-4 md:gap-5">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-burgundy rounded-xl flex items-center justify-center shadow-2xl oriental-border shrink-0">
                  <GraduationCap className="text-gold w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div>
                  <h2 className="text-xl md:text-4xl font-serif font-bold tracking-tight text-white">Văn Miếu</h2>
                  <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-gold/60 font-bold">Mao Điền • Hải Phòng</p>
                </div>
              </div>
              <p className="text-stone-400 text-sm md:text-lg font-serif italic leading-relaxed max-w-sm">
                "Nơi tôn vinh đạo học, gìn giữ tinh hoa văn hóa và truyền thống hiếu học của người dân Hải Phòng qua nhiều thế kỷ."
              </p>
            </div>
            
            <div className="space-y-6 md:space-y-10">
              <h3 className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-gold/50 border-b border-gold/10 pb-3 md:pb-4">Liên kết Nhanh</h3>
              <div className="grid grid-cols-2 gap-x-4 md:gap-x-8 gap-y-3 md:gap-y-5">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-stone-400 hover:text-gold text-[11px] md:text-sm transition-colors text-left font-medium tracking-wide flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold/20 group-hover:bg-gold transition-colors" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 md:space-y-10">
              <h3 className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-gold/50 border-b border-gold/10 pb-3 md:pb-4">Thông tin liên hệ</h3>
              <div className="space-y-4 md:space-y-6">
                <div className="flex gap-4 items-start">
                  <MapPin size={16} className="text-gold/40 shrink-0 mt-1" />
                  <p className="text-stone-400 text-[11px] md:text-sm font-medium leading-relaxed">
                    Xã Mao Điền, Thành phố Hải Phòng,<br />
                    Việt Nam
                  </p>
                </div>
                <div className="flex gap-4 items-center">
                  <Mail size={16} className="text-gold/40 shrink-0" />
                  <p className="text-stone-400 text-[11px] md:text-sm font-medium">duong28012009@gmail.com</p>
                </div>
                <div className="flex gap-4 items-center">
                  <Phone size={16} className="text-gold/40 shrink-0" />
                  <p className="text-stone-400 text-[11px] md:text-sm font-medium">+84 (0) 868 814 282</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col items-center text-center gap-8">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 md:w-16 bg-gold/20" />
              <p className="text-[8px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.5em] text-gold/40 font-bold">
                DI TÍCH QUỐC GIA ĐẶC BIỆT
              </p>
              <div className="h-px w-8 md:w-16 bg-gold/20" />
            </div>
            
            <div className="flex flex-col items-center gap-2 md:gap-4">
              <p className="text-xl md:text-4xl font-serif italic text-white/90 uppercase tracking-[0.2em] md:tracking-[0.3em]">
                by tunggduongg
              </p>
              <div className="w-12 md:w-24 h-1 bg-burgundy rounded-full" />
            </div>

            <div className="flex flex-wrap justify-center gap-3 md:gap-8">
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold px-4 md:px-8 py-2 md:py-3 border border-white/10 rounded-full bg-white/5">
                STEM Heritage Project
              </span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold px-4 md:px-8 py-2 md:py-3 border border-white/10 rounded-full bg-white/5">
                Digital Preservation
              </span>
            </div>
            
            <p className="text-stone-600 text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-bold">
              © 2026 Văn Miếu Mao Điền. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      <Suspense fallback={null}>
        <VirtualGuide />
      </Suspense>
    </div>
  );
}

const ActivityDetail = lazy(() => import("./components/ActivityDetail"));

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scholar/:id" element={
            <Suspense fallback={<LoadingFallback />}>
              <ScholarDetail />
            </Suspense>
          } />
          <Route path="/activity/:id" element={
            <Suspense fallback={<LoadingFallback />}>
              <ActivityDetail />
            </Suspense>
          } />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;