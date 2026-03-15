'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameCanvasProps {
  multiplier: string;
  isCrashed: boolean;
  isWaiting: boolean;
  nextRoundIn?: number;
}

export default function GameCanvas({ 
  multiplier, 
  isCrashed, 
  isWaiting, 
  nextRoundIn 
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const multiplierNum = parseFloat(multiplier);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const trail: { x: number; y: number; alpha: number }[] = [];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isWaiting) {
         // Optionally draw something for waiting state on canvas
         return;
      }

      // Parabolic Curve Logic: X moves as multiplier grows, Y curves upward exponentially
      // We scale the multiplier to canvas dimensions
      const progress = Math.max(0, multiplierNum - 1);
      const planeX = Math.min(canvas.width * 0.8, progress * 80 + 50); 
      const planeY = canvas.height - Math.min(canvas.height * 0.8, Math.pow(multiplierNum, 1.8) * 15 + 50);

      // 1. Draw Mesh/Grid (Static-ish)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();ctx.moveTo(i, 0);ctx.lineTo(i, canvas.height);ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();ctx.moveTo(0, i);ctx.lineTo(canvas.width, i);ctx.stroke();
      }

      // 2. Draw the Particle Trail
      if (!isCrashed) {
        trail.push({ x: planeX, y: planeY, alpha: 1 });
      }
      
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)'; // Gold-like trail
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
        p.alpha -= 0.01;
      }
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      if (trail.length > 100) trail.shift();

      // 3. Draw the Plane
      if (!isCrashed) {
        ctx.fillStyle = multiplierNum > 10 ? '#F59E0B' : '#EF4444'; // Gold if high multiplier
        ctx.shadowBlur = 15;
        ctx.shadowColor = ctx.fillStyle as string;
        
        ctx.beginPath();
        // Drawing a simple plane-like shape or triangle
        ctx.moveTo(planeX, planeY);
        ctx.lineTo(planeX - 30, planeY + 10);
        ctx.lineTo(planeX - 25, planeY - 5);
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowBlur = 0; // Reset shadow
      } else {
        // Draw explosion dot at crash point
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        const lastP = trail[trail.length - 1] || { x: planeX, y: planeY };
        ctx.arc(lastP.x, lastP.y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [multiplierNum, isCrashed, isWaiting]);

  return (
    <div className="relative w-full h-full bg-[#09090B] rounded-2xl overflow-hidden border border-white/5 shadow-2xl flex flex-col items-center justify-center">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[repeating-conic-gradient(from_0deg,rgba(255,255,255,0.05)_0deg_20deg,transparent_20deg_40deg)] animate-rotate-slow" />
      </div>

      <canvas 
        ref={canvasRef} 
        width={1000} 
        height={600} 
        className="absolute inset-0 w-full h-full object-cover"
      />

      <AnimatePresence mode="wait">
        {isWaiting ? (
          <motion.div 
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="z-20 relative flex flex-col items-center gap-6"
          >
            <div className="w-24 h-24 border-4 border-red-500 border-t-transparent rounded-full animate-spin flex items-center justify-center">
               <div className="w-12 h-1 bg-red-500" />
            </div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter drop-shadow-lg">
              WAITING FOR NEXT ROUND...
            </h2>
          </motion.div>
        ) : (
          <div className="z-20 pointer-events-none flex flex-col items-center">
            <h2 className={`text-[12rem] leading-none font-black italic tracking-tighter drop-shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-colors duration-300 ${isCrashed ? 'text-red-500' : 'text-white'}`}>
              {multiplier}<span className="text-5xl ml-2">x</span>
            </h2>
            {isCrashed && (
              <motion.div 
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 10 }}
                className="bg-red-600 px-6 py-2 rounded-xl text-2xl font-black italic shadow-2xl -mt-8"
              >
                FLEW AWAY!
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-12 z-30 p-4 rounded-xl bg-black/40 backdrop-blur-sm border border-white/5">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/40">
           <span>MAXI PESA PRO</span>
           <div className="w-1 h-1 bg-white/20 rounded-full" />
           <span>#PROVABLY_FAIR</span>
        </div>
      </div>
    </div>
  );
}
