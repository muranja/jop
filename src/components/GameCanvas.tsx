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
    let gridOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Panning Coordinate Grid (The Sense of Speed)
      gridOffset = (gridOffset + (isCrashed ? 0 : Math.min(20, multiplierNum * 2))) % 50;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      for (let i = -50; i < canvas.width + 50; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i + gridOffset, 0);
        ctx.lineTo(i + gridOffset - 200, canvas.height); // Skewed for perspective
        ctx.stroke();
      }
      for (let i = -50; i < canvas.height + 50; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i + gridOffset);
        ctx.lineTo(canvas.width, i + gridOffset);
        ctx.stroke();
      }

      if (isWaiting) {
         animationFrameId = requestAnimationFrame(render);
         return;
      }

      // Parabolic Curve Logic
      const progress = Math.max(0, multiplierNum - 1);
      const planeX = Math.min(canvas.width * 0.85, progress * 100 + 80); 
      const planeY = canvas.height - Math.min(canvas.height * 0.85, Math.pow(multiplierNum, 1.7) * 20 + 100);

      // 2. Draw Particle Trail
      if (!isCrashed) {
        trail.push({ x: planeX, y: planeY, alpha: 1 });
      }
      
      ctx.beginPath();
      ctx.strokeStyle = multiplierNum > 10 ? '#ffcc00' : '#00ff66';
      ctx.lineWidth = 6;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
        p.alpha -= 0.005;
      }
      ctx.stroke();

      if (trail.length > 150) trail.shift();

      // 3. Draw High-Visibility Plane
      if (!isCrashed) {
        ctx.shadowBlur = 25;
        ctx.shadowColor = multiplierNum > 10 ? '#ffcc00' : '#00ff66';
        ctx.fillStyle = '#ffffff';
        
        ctx.beginPath();
        ctx.moveTo(planeX, planeY);
        ctx.lineTo(planeX - 40, planeY + 15);
        ctx.lineTo(planeX - 35, planeY - 10);
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = '#ff0033';
        ctx.shadowBlur = 40;
        ctx.shadowColor = '#ff0033';
        ctx.beginPath();
        const lastP = trail[trail.length - 1] || { x: planeX, y: planeY };
        ctx.arc(lastP.x, lastP.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [multiplierNum, isCrashed, isWaiting]);

  return (
    <div className="relative w-full h-full bg-[#020202] rounded-3xl overflow-hidden border border-white/5 flex flex-col items-center justify-center group">
      
      {/* Background Radial Glow */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isCrashed ? 'opacity-20' : 'opacity-10'}`}>
         <div className={`absolute inset-0 bg-radial-at-center from-white/20 to-transparent ${isCrashed ? 'from-red-600' : ''}`} />
      </div>

      <canvas 
        ref={canvasRef} 
        width={1200} 
        height={800} 
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />

      <AnimatePresence mode="wait">
        {isWaiting ? (
          <motion.div 
            key="waiting"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="z-20 relative flex flex-col items-center gap-8"
          >
            <div className="relative w-32 h-32 flex items-center justify-center">
               <div className="absolute inset-0 border-[6px] border-white/10 rounded-full" />
               <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-[6px] border-red-600 border-t-transparent rounded-full"
               />
               <span className="text-4xl font-black text-red-600">!</span>
            </div>
            <h2 className="text-4xl font-black text-white italic tracking-tighter text-center max-w-xs drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] uppercase">
              Waiting for next round
            </h2>
          </motion.div>
        ) : (
          <div className="z-20 pointer-events-none flex flex-col items-center">
            <h2 className={`text-[13rem] leading-none font-black italic tracking-tighter transition-all duration-300 drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)]
               ${isCrashed ? 'text-red-600 scale-95 blur-[2px]' : 'text-white scale-100'}
               ${multiplierNum >= 10 && !isCrashed ? 'text-amber-400 drop-shadow-[0_0_50px_rgba(245,158,11,0.4)]' : ''}
            `}>
              {multiplier}<span className="text-6xl ml-4">x</span>
            </h2>
            {isCrashed && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-red-600 px-8 py-3 rounded-2xl text-3xl font-black italic shadow-[0_10px_40px_rgba(239,68,68,0.4)] uppercase tracking-widest text-white -mt-10"
              >
                Flew Away!
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Decorative Bottom Left Info */}
      <div className="absolute bottom-8 left-12 z-30 flex items-center gap-6">
         <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">Status</span>
            <div className="flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${isCrashed ? 'bg-red-600' : 'bg-green-500 animate-pulse'}`} />
               <span className="text-xs font-black text-white italic uppercase tracking-tighter">
                  {isCrashed ? 'Round Over' : isWaiting ? 'Betting Open' : 'In Flight'}
               </span>
            </div>
         </div>
      </div>
    </div>
  );
}
