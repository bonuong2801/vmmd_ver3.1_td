import React from 'react';

/**
 * CustomFrame Utility & Component
 * Chuyên xử lý việc vẽ khung hình di sản, watermark và sticker lên Canvas
 */

export const drawHeritageFrame = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  layout: 1 | 4 | 6,
  frameImage?: HTMLImageElement
) => {
  if (frameImage) {
    // Vẽ toàn bộ ảnh khung hình được cung cấp
    ctx.drawImage(frameImage, 0, 0, width, height);
    return;
  }

  const gold = "#D4AF37";
  const burgundy = "#800000";
  const lacquer = "#4A0404";

  // 1. Vẽ nền khung (Lacquer Red)
  ctx.fillStyle = lacquer;
  // Khung ngoài cùng
  ctx.fillRect(0, 0, width, height);
  
  // 2. Vẽ viền vàng kép (Double Gold Border)
  ctx.strokeStyle = gold;
  ctx.lineWidth = width * 0.01;
  ctx.strokeRect(width * 0.02, width * 0.02, width * 0.96, height - (width * 0.04));

  // 3. Vẽ Mái Đình (Curved Roof Motif) ở đỉnh
  const drawRoof = () => {
    ctx.save();
    ctx.fillStyle = burgundy;
    ctx.beginPath();
    ctx.moveTo(width * 0.2, width * 0.08);
    ctx.quadraticCurveTo(width * 0.5, -width * 0.05, width * 0.8, width * 0.08);
    ctx.lineTo(width * 0.85, width * 0.12);
    ctx.quadraticCurveTo(width * 0.5, width * 0.02, width * 0.15, width * 0.12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = gold;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  };
  if (layout !== 6) drawRoof();

  // 4. Vẽ Hoa Văn Góc (Stone Stele Inspired Corners)
  const drawCorner = (x: number, y: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.strokeStyle = gold;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.lineTo(0, 0);
    ctx.lineTo(40, 0);
    // Họa tiết mây bên trong góc
    ctx.moveTo(10, 25);
    ctx.quadraticCurveTo(25, 25, 25, 10);
    ctx.stroke();
    ctx.restore();
  };

  drawCorner(width * 0.05, width * 0.05, 0);
  drawCorner(width * 0.95, width * 0.05, Math.PI / 2);
  drawCorner(width * 0.95, height - width * 0.05, Math.PI);
  drawCorner(width * 0.05, height - width * 0.05, -Math.PI / 2);

  // 5. Watermark: Văn Miếu Mao Điền
  ctx.save();
  ctx.fillStyle = gold;
  ctx.textAlign = "center";
  const fontSize = layout === 6 ? width * 0.08 : width * 0.04;
  ctx.font = `bold ${fontSize}px "Playfair Display", serif`;
  
  if (layout === 6) {
    // Đối với dải ảnh dọc, xoay chữ hoặc để ở dưới cùng
    ctx.fillText("VĂN MIẾU MAO ĐIỀN", width / 2, height - width * 0.1);
  } else {
    ctx.fillText("VĂN MIẾU MAO ĐIỀN", width / 2, height - width * 0.06);
  }
  ctx.restore();
};

interface CustomFrameProps {
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

const CustomFrame: React.FC<CustomFrameProps> = ({ children, className = "", innerClassName = "" }) => {
  return (
    <div className={`relative p-4 md:p-8 bg-burgundy oriental-border shadow-2xl ${className}`}>
      {/* Decorative Corners */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold/40 z-10" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold/40 z-10" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold/40 z-10" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gold/40 z-10" />
      
      <div className={`relative h-full w-full overflow-hidden ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default CustomFrame;
