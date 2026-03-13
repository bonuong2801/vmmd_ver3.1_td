import { useState, Suspense, useRef, useEffect, useMemo, useCallback } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Environment, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { Maximize2, RotateCcw, Compass, Loader2 } from "lucide-react";

function Dome({ url }: { url: string }) {
  const texture = useLoader(THREE.TextureLoader, url);
  
  // Memoize geometry to prevent recreation
  const geometry = useMemo(() => new THREE.SphereGeometry(500, 60, 40), []);
  
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function Loader({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-ink">
      <div className="flex flex-col items-center gap-6 w-72">
        <div className="w-full h-px bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-burgundy shadow-[0_0_15px_rgba(139,0,0,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-[10px] uppercase tracking-[0.4em] text-stone-500 font-bold">
          Đang tái hiện không gian... {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

function CameraTracker({ onRotate }: { onRotate: (rotation: number) => void }) {
  useFrame(({ camera }) => {
    const rotation = Math.atan2(camera.position.x, camera.position.z);
    onRotate(rotation);
  });
  return null;
}

export default function VirtualTour() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cameraRotation, setCameraRotation] = useState(0);
  const { progress } = useProgress();

  const handleRotate = useCallback((rotation: number) => {
    // Only update if the difference is significant to reduce re-renders
    setCameraRotation(prev => {
      if (Math.abs(prev - rotation) > 0.005) {
        return rotation;
      }
      return prev;
    });
  }, []);

  const isActuallyLoaded = useMemo(() => isLoaded && progress === 100, [isLoaded, progress]);

  return (
    <section id="virtual-tour" className="py-32 bg-warm-bg text-ink overflow-hidden border-t border-burgundy/5 relative">
      <div className="absolute inset-0 opacity-[0.03] lattice-pattern pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 mb-10 md:mb-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
          <div>
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-8 bg-burgundy/20" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-burgundy/60">
                Không gian 3D Sống động
              </span>
              <div className="h-px w-8 bg-burgundy/20" />
            </div>
            <h2 className="text-4xl md:text-8xl font-serif font-bold mb-6 md:mb-10 leading-[0.85] tracking-tight">
              Mô hình <br />
              <span className="italic font-normal text-burgundy">Văn miếu 3D</span>
            </h2>
            <p className="text-base md:text-lg text-olive/80 font-serif italic leading-relaxed max-w-2xl">
              "Chúng tôi đã tái hiện không gian 3D chân thực. 
              Hãy xoay góc nhìn để khám phá khuôn viên Văn Miếu từ bên trong với sự tự do 360°."
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 md:gap-6">
            <div className="flex items-center gap-3 bg-white/50 px-4 md:px-6 py-2 md:py-3 rounded-full border border-burgundy/10 shadow-sm oriental-border">
              <RotateCcw size={12} className="text-burgundy/60" />
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-burgundy/80">Kéo để Xoay</span>
            </div>
            <div className="flex items-center gap-3 bg-white/50 px-4 md:px-6 py-2 md:py-3 rounded-full border border-burgundy/10 shadow-sm oriental-border">
              <Maximize2 size={12} className="text-burgundy/60" />
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-burgundy/80">Cuộn để Phóng to</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-[500px] md:h-[750px] w-full bg-black overflow-hidden oriental-frame shadow-inner mx-auto max-w-[95vw]">
        <div className="absolute inset-0 opacity-[0.05] cloud-pattern pointer-events-none z-10" />
        
        <AnimatePresence>
          {!isActuallyLoaded && (
            <Loader progress={progress} />
          )}
        </AnimatePresence>

        <Canvas 
          camera={{ position: [0, 0, 0.1], fov: 75 }}
          onCreated={() => {
            // Defer state update to avoid "Cannot update a component while rendering a different component"
            setTimeout(() => setIsLoaded(true), 100);
          }}
        >
          <Suspense fallback={null}>
            <Dome url="/images/virtualtour360.jpg" />
            
            <CameraTracker onRotate={handleRotate} />

            <OrbitControls 
              enableZoom={true} 
              enablePan={false} 
              rotateSpeed={-0.5} 
              autoRotate={!isActuallyLoaded}
              autoRotateSpeed={0.5}
            />
            
            <Environment preset="sunset" />
          </Suspense>
        </Canvas>

        {/* Compass Overlay */}
        <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 p-4 md:p-8 bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-3xl border-2 md:border-4 border-gold flex items-center gap-4 md:gap-8 shadow-2xl z-20 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] lattice-pattern pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4 md:gap-8">
            <div className="relative w-12 h-12 md:w-20 md:h-20 rounded-full border-2 border-burgundy/10 flex items-center justify-center">
              <div className="absolute top-1 md:top-2 text-[7px] md:text-[9px] font-bold text-burgundy/40">B</div>
              <div className="absolute bottom-1 md:bottom-2 text-[7px] md:text-[9px] font-bold text-burgundy/40">N</div>
              <div className="absolute left-1 md:left-2 text-[7px] md:text-[9px] font-bold text-burgundy/40">T</div>
              <div className="absolute right-1 md:right-2 text-[7px] md:text-[9px] font-bold text-burgundy/40">Đ</div>
              
              <motion.div 
                className="relative w-full h-full flex items-center justify-center"
                style={{ rotate: (cameraRotation * 180) / Math.PI }}
              >
                <div className="w-0.5 h-8 md:h-12 bg-gradient-to-t from-burgundy/20 via-burgundy to-burgundy/20 rounded-full shadow-lg" />
                <div className="absolute top-0 w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-burgundy rounded-full shadow-xl border border-gold" />
              </motion.div>
            </div>
            
            <div className="space-y-1 md:space-y-2">
              <div className="flex items-center gap-2 md:gap-3">
                <Compass size={14} className="text-burgundy/60" />
                <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-ink">Định hướng</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-[8px] md:text-[10px] text-olive/60 uppercase tracking-[0.1em] font-medium italic font-serif">Bản đồ 3D</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
