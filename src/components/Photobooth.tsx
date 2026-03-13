import { useState, useRef, useCallback, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, Download, RefreshCw, X, Sparkles, 
  LayoutGrid, LayoutList, Square, CheckCircle2
} from "lucide-react";
import { drawHeritageFrame } from "./CustomFrame";

// Định nghĩa các loại bố cục và khung hình tương ứng
const LAYOUT_CONFIG = {
  1: {
    id: 1,
    icon: Square,
    label: '1 Ảnh',
    frameUrl: "/my-frames/frame.jpg"
  },
  4: {
    id: 4,
    icon: LayoutGrid,
    label: '4 Ảnh',
    frameUrl: "/my-frames/f4.jpg"
  },
  6: {
    id: 6,
    icon: LayoutGrid,
    label: '6 Ảnh',
    frameUrl: "/my-frames/f6.jpg"
  }
};

const LAYOUT_OPTIONS = Object.values(LAYOUT_CONFIG);

// Memoized UI Components for performance
const ControlButton = memo(({ onClick, icon: Icon, className, title, disabled }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90 ${className}`}
    title={title}
  >
    <Icon size={28} />
  </button>
));

const LayoutButton = memo(({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${
      active ? "border-burgundy bg-burgundy/5 text-burgundy" : "border-transparent bg-warm-bg text-olive/40 hover:text-olive"
    }`}
  >
    <Icon size={20} />
    <span className="text-[10px] font-bold">{label}</span>
  </button>
));

export default function Photobooth() {
  // --- States ---
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);
  const [layout, setLayout] = useState<1 | 4 | 6>(4);

  // Load Frame Image based on layout
  useEffect(() => {
    const loadFrame = (url: string) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = `${url}?t=${new Date().getTime()}`;
      img.onload = () => setFrameImage(img);
      img.onerror = () => {
        console.warn(`Không tìm thấy ảnh ${url}. Đang dùng khung vẽ mặc định.`);
        setFrameImage(null);
      };
    };
    const currentConfig = LAYOUT_CONFIG[layout];
    if (currentConfig) loadFrame(currentConfig.frameUrl);
  }, [layout]);

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showFlash, setShowFlash] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Refs ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // --- Camera Logic ---
  const startCamera = useCallback(async () => {
    // Dừng các track cũ từ ref
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Trình duyệt của bạn không hỗ trợ truy cập camera.");
      }

      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      streamRef.current = mediaStream;
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsActive(true);
      setFinalResult(null);
      setCapturedImages([]);
    } catch (err: any) {
      console.error("Camera Error:", err);
      let errorMessage = "Không thể truy cập camera.";
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage = "Bạn đã từ chối quyền truy cập camera. Vui lòng cấp quyền trong cài đặt trình duyệt.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMessage = "Không tìm thấy thiết bị camera nào.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        errorMessage = "Camera đang được sử dụng bởi một ứng dụng khác hoặc bị lỗi phần cứng.";
      } else if (err.name === "OverconstrainedError") {
        errorMessage = "Camera không đáp ứng được yêu cầu kỹ thuật.";
      }
      
      alert(errorMessage);
      setIsActive(false);
    }
  }, [facingMode]);

  // Tự động khởi động lại camera khi facingMode thay đổi (nếu đang active)
  useEffect(() => {
    if (isActive) {
      startCamera();
    }
  }, [facingMode, isActive, startCamera]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStream(null);
    setIsActive(false);
  }, []);

  // --- Capture Logic ---
  const playShutterSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/photobooth/sounds/camera.mp3");
    }
    audioRef.current.play().catch(() => {}); // Bỏ qua lỗi nếu trình duyệt chặn auto-play
  };

  const combinePhotos = useCallback(async (images: string[]) => {
    setIsProcessing(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Thiết lập kích thước Canvas dựa trên kích thước thật của ảnh khung (nếu có)
      if (frameImage) {
        canvas.width = frameImage.naturalWidth;
        canvas.height = frameImage.naturalHeight;
      } else {
        canvas.width = 1200;
        canvas.height = 1800;
      }

      // Tối ưu hóa chất lượng vẽ
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // 1. Vẽ Khung (Background & Frame)
      if (frameImage) {
        ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
      } else {
        drawHeritageFrame(ctx, canvas.width, canvas.height, layout);
      }

      // 2. Vẽ các ảnh đã chụp vào lưới
      const getGridSlots = () => {
        const slots = [];
        const w = canvas.width;
        const h = canvas.height;

        if (layout === 1) {
          slots.push({ x: w * 0.14, y: h * 0.24, w: w * 0.72, h: h * 0.43 });

        } else if (layout === 4) {

          slots.push({ x: w * 0.14, y: h * 0.25, w: w * 0.32, h: h * 0.17 });
          slots.push({ x: w * 0.54, y: h * 0.25, w: w * 0.32, h: h * 0.17 });
          slots.push({ x: w * 0.14, y: h * 0.45, w: w * 0.32, h: h * 0.17 });
          slots.push({ x: w * 0.54, y: h * 0.45, w: w * 0.32, h: h * 0.17 });

        } else if (layout === 6) {

          slots.push({ x: w * 0.35, y: h * 0.24, w: w * 0.23, h: h * 0.14 });
          slots.push({ x: w * 0.63, y: h * 0.24, w: w * 0.23, h: h * 0.14 });
          slots.push({ x: w * 0.35, y: h * 0.40, w: w * 0.23, h: h * 0.14 });
          slots.push({ x: w * 0.63, y: h * 0.40, w: w * 0.23, h: h * 0.14 });
          slots.push({ x: w * 0.35, y: h * 0.56, w: w * 0.23, h: h * 0.14 });
          slots.push({ x: w * 0.63, y: h * 0.56, w: w * 0.23, h: h * 0.14 });

        }

      return slots;
      }

      const slots = getGridSlots();

      const drawImg = (src: string, slot: { x: number; y: number; w: number; h: number }) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const { x, y, w, h } = slot;
            ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.clip();
            
            const ratio = img.width / img.height;
            const targetRatio = w / h;
            let dw, dh, dx, dy;
            
            if (ratio > targetRatio) {
              dh = h; dw = h * ratio; dx = x - (dw - w) / 2; dy = y;
            } else {
              dw = w; dh = w / ratio; dx = x; dy = y - (dh - h) / 2;
            }
            
            ctx.drawImage(img, dx, dy, dw, dh);
            ctx.restore();
            resolve(true);
          };
          img.onerror = () => resolve(false);
          img.src = src;
        });
      };

      // Merge photos in order based on pre-defined slots
      for (let i = 0; i < images.length; i++) {
        if (slots[i]) {
          await drawImg(images[i], slots[i]);
        }
      }

      setFinalResult(canvas.toDataURL("image/png"));
    } catch (error) {
      console.error("Error combining photos:", error);
      alert("Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  }, [layout, frameImage]);

  const takePhoto = useCallback(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = video.videoWidth;
      tempCanvas.height = video.videoHeight;
      const ctx = tempCanvas.getContext("2d");
      if (ctx) {
        if (facingMode === "user") {
          ctx.translate(tempCanvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0);
        const dataUrl = tempCanvas.toDataURL("image/jpeg", 0.95);
        
        playShutterSound();
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 150);

        setCapturedImages(prev => {
          const next = [...prev, dataUrl];
          if (next.length === layout) {
            combinePhotos(next);
          } else {
            // Tiếp tục đếm ngược cho ảnh tiếp theo
            setTimeout(() => {
              setIsCountingDown(true);
              setCountdown(3);
            }, 1000);
          }
          return next;
        });
      }
    }
  }, [layout, facingMode, combinePhotos]);

  // --- Countdown Effect ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isCountingDown && countdown === 0) {
      setIsCountingDown(false);
      takePhoto();
    }
    return () => clearTimeout(timer);
  }, [isCountingDown, countdown, takePhoto]);

  // --- Handlers ---
  const handleReset = () => {
    setCapturedImages([]);
    setFinalResult(null);
    setIsCountingDown(false);
  };

  const handleStartCapture = () => {
    setCapturedImages([]);
    setFinalResult(null);
    setIsCountingDown(true);
    setCountdown(3);
  };

  const downloadPhoto = () => {
    if (finalResult) {
      const link = document.createElement("a");
      link.href = finalResult;
      link.download = `van-mieu-photobooth-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <section id="photobooth" className="py-24 bg-[#FDFBF7] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
            <div className="px-4 py-1 bg-burgundy/10 rounded-full border border-burgundy/20 text-burgundy text-xs font-bold tracking-widest uppercase">
              Interactive Experience
            </div>
            <h2 className="text-[clamp(2.5rem,10vw,5rem)] md:text-[clamp(5rem,15vw,9rem)] font-serif font-bold text-lacquer leading-[0.85] tracking-tighter">
              Kỷ niệm <br />
              <span className="italic font-normal text-burgundy">Mao Điền</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start justify-center">
          
          {/* Center: Main Viewport */}
          <div className="lg:col-start-2 lg:col-span-10 order-1">
            <div className="relative aspect-[3/4] sm:aspect-[4/5] md:aspect-video bg-stone-900 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border-4 md:border-8 border-lacquer overflow-hidden group">
              
              {!isActive ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-wood p-6 text-center">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-burgundy/20 flex items-center justify-center border border-gold/30"
                  >
                    <Camera className="text-gold" size={32} />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-white font-serif text-xl md:text-2xl">Lưu giữ khoảnh khắc</h3>
                    <p className="text-stone-400 text-xs md:text-sm max-w-xs mx-auto">Chụp ảnh với khung hình di sản Văn Miếu Mao Điền đặc sắc.</p>
                  </div>
                  <button
                    onClick={startCamera}
                    className="px-10 py-4 bg-burgundy text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-lacquer transition-all shadow-xl active:scale-95"
                  >
                    Bắt đầu Trải nghiệm
                  </button>
                </div>
              ) : (
                <>
                  {isProcessing && (
                    <div className="absolute inset-0 bg-burgundy/95 backdrop-blur-xl flex flex-col items-center justify-center text-gold z-50 p-6 text-center">
                      <div className="relative w-20 h-20 md:w-24 md:h-24 mb-6">
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 border-t-2 border-gold rounded-full"
                        />
                        <Sparkles className="absolute inset-0 m-auto animate-pulse text-gold" size={32} />
                      </div>
                      <span className="font-serif italic text-xl md:text-2xl tracking-[0.1em] md:tracking-[0.2em]">Đang hoàn thiện tuyệt tác...</span>
                    </div>
                  )}

                      {!finalResult ? (
                        <div className="relative w-full h-full overflow-hidden">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover will-change-transform ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
                          />

                          {/* Layout Selection Overlay - Optimized for Mobile */}
                      {!isCountingDown && capturedImages.length === 0 && (
                        <div className="absolute top-4 md:top-6 left-0 right-0 flex justify-center z-30 px-4">
                          <div className="bg-black/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 flex gap-1 md:gap-2 overflow-x-auto no-scrollbar max-w-full">
                            {LAYOUT_OPTIONS.map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => setLayout(opt.id as any)}
                                className={`flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-xl transition-all whitespace-nowrap ${
                                  layout === opt.id 
                                    ? "bg-gold text-lacquer shadow-lg scale-105" 
                                    : "text-white/60 hover:text-white hover:bg-white/10"
                                }`}
                              >
                                <opt.icon size={14} className="md:w-4 md:h-4" />
                                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{opt.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Flash Overlay */}
                      <AnimatePresence>
                        {showFlash && (
                          <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white z-50 will-change-opacity"
                          />
                        )}
                      </AnimatePresence>

                      {/* Countdown Overlay */}
                      <AnimatePresence>
                        {isCountingDown && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute inset-0 flex items-center justify-center z-40 bg-black/30 backdrop-blur-sm will-change-transform"
                          >
                            <span className="text-[8rem] md:text-[12rem] font-serif font-bold text-gold drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] select-none">
                              {countdown}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Capture Progress Indicator */}
                      {layout > 1 && (
                        <div className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-30 bg-black/40 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/10">
                          {Array.from({ length: layout }).map((_, i) => (
                            <div key={i} className="relative">
                              <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 ${i < capturedImages.length ? "bg-gold border-gold" : "border-white/40 bg-transparent"}`} />
                              {i === capturedImages.length && isCountingDown && (
                                <motion.div 
                                  animate={{ scale: [1, 1.5, 1] }} 
                                  transition={{ repeat: Infinity, duration: 1 }}
                                  className="absolute inset-0 bg-gold/40 rounded-full"
                                />
                              )}
                            </div>
                          ))}
                          <span className="text-[9px] md:text-[10px] font-bold text-white/80 ml-1 md:ml-2 uppercase tracking-widest">
                            {capturedImages.length}/{layout}
                          </span>
                        </div>
                      )}

                      {/* Controls - Optimized for Touch */}
                      <div className="absolute bottom-6 md:bottom-10 left-0 right-0 flex justify-center items-center gap-6 md:gap-12 z-30 px-6">
                        <button 
                          onClick={stopCamera} 
                          className="w-12 h-12 md:w-16 md:h-16 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
                          title="Thoát"
                        >
                          <X size={20} className="md:w-6 md:h-6" />
                        </button>
                        
                        <div className="relative">
                          <button 
                            onClick={handleStartCapture}
                            disabled={isCountingDown}
                            className="w-20 h-20 md:w-28 md:h-28 bg-burgundy border-4 border-gold rounded-full flex items-center justify-center text-gold shadow-[0_0_40px_rgba(128,0,0,0.6)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 group"
                          >
                            <Camera size={32} className="md:w-10 md:h-10 group-hover:rotate-12 transition-transform" />
                          </button>
                          
                          {/* Visual Hint for Capture */}
                          {!isCountingDown && capturedImages.length === 0 && (
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute -inset-2 border-2 border-gold/30 rounded-full pointer-events-none"
                            />
                          )}
                        </div>

                        <button 
                          onClick={() => setFacingMode(f => f === "user" ? "environment" : "user")} 
                          className="w-12 h-12 md:w-16 md:h-16 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
                          title="Đổi Camera"
                        >
                          <RefreshCw size={20} className="md:w-6 md:h-6" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full bg-[#FDFBF7] flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
                      <div className="relative group w-full max-w-md mx-auto">
                        <motion.img 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          src={finalResult} 
                          alt="Final Result" 
                          className="w-full h-auto max-h-[55vh] md:max-h-[60vh] object-contain shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-lg border-2 md:border-4 border-gold/20 mx-auto" 
                        />
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.5 }}
                          className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-10 h-10 md:w-12 md:h-12 bg-gold rounded-full flex items-center justify-center shadow-xl border-2 border-white"
                        >
                          <CheckCircle2 className="text-lacquer md:w-6 md:h-6" size={20} />
                        </motion.div>
                      </div>

                      {/* Action Buttons */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full max-w-md mt-6 md:mt-8"
                      >
                        <button
                          onClick={downloadPhoto}
                          className="flex-1 py-3.5 md:py-4 bg-burgundy text-gold rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-3 shadow-xl hover:bg-lacquer transition-all border border-gold/30 active:scale-95"
                        >
                          <Download size={18} /> Lưu Ảnh
                        </button>
                        <button
                          onClick={handleReset}
                          className="flex-1 py-3.5 md:py-4 bg-white text-burgundy rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-3 shadow-lg hover:bg-warm-bg transition-all border border-burgundy/10 active:scale-95"
                        >
                          <RefreshCw size={18} /> Chụp Lại
                        </button>
                      </motion.div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right: Actions & Info */}
          <div className="lg:col-span-12 order-3 space-y-6 max-w-2xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {finalResult && (
                <motion.div 
                  key="final-actions"
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="p-6 bg-gold/10 rounded-3xl border border-gold/20 shadow-inner">
                    <p className="text-[11px] text-olive/70 leading-relaxed italic mb-4">
                      "Tuyệt tác di sản của bạn đã sẵn sàng!"
                    </p>
                    <button
                      onClick={downloadPhoto}
                      className="w-full py-4 bg-burgundy text-gold rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl hover:bg-lacquer transition-all border border-gold/30 active:scale-95"
                    >
                      <Download size={18} /> Lưu Ảnh Ngay
                    </button>
                  </div>
                  
                  <button
                    onClick={handleReset}
                    className="w-full py-4 bg-white text-burgundy rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-lg hover:bg-warm-bg transition-all border border-burgundy/10 active:scale-95"
                  >
                    <RefreshCw size={18} /> Chụp Tấm Khác
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
}
