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

      // 1. Coordinate Grid with Speed Illusion
      gridOffset = (gridOffset + (isCrashed ? 0 : Math.min(30, multiplierNum * 3))) % 80;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;

      for (let i = -100; i < canvas.width + 100; i += 80) {
        ctx.beginPath();
        ctx.moveTo(i + gridOffset, 0);
        ctx.lineTo(i + gridOffset - 300, canvas.height); 
        ctx.stroke();
      }
      for (let i = -100; i < canvas.height + 100; i += 80) {
        ctx.beginPath();
        ctx.moveTo(0, i + gridOffset);
        ctx.lineTo(canvas.width, i + gridOffset);
        ctx.stroke();
      }

      if (isWaiting) {
         animationFrameId = requestAnimationFrame(render);
         return;
      }

      // Aircraft Scale and Position
      const progress = Math.max(0, multiplierNum - 1);
      const planeX = Math.min(canvas.width * 0.88, progress * 150 + 100); 
      const planeY = canvas.height - Math.min(canvas.height * 0.88, Math.pow(multiplierNum, 1.8) * 35 + 150);

      // 2. Thick Saturated Trail
      if (!isCrashed) {
        trail.push({ x: planeX, y: planeY, alpha: 1 });
      }
      
      ctx.beginPath();
      ctx.strokeStyle = multiplierNum > 10 ? '#ffc400' : '#00ff22';
      ctx.lineWidth = 12; // Much thicker trail
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
        p.alpha -= 0.004;
      }
      ctx.stroke();

      if (trail.length > 200) trail.shift();

      // 3. Massive "Chunky" Aircraft
      if (!isCrashed) {
        ctx.shadowBlur = 40;
        ctx.shadowColor = multiplierNum > 10 ? '#ffc400' : '#00ff22';
        ctx.fillStyle = '#ffffff';
        
        ctx.beginPath();
        ctx.moveTo(planeX, planeY);
        ctx.lineTo(planeX - 60, planeY + 20);
        ctx.lineTo(planeX - 50, planeY - 15);
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowBlur = 0;
      } else {
        // Explosion Effect
        ctx.fillStyle = '#ff0000';
        ctx.shadowBlur = 80;
        ctx.shadowColor = '#ff0000';
        ctx.beginPath();
        const lastP = trail[trail.length - 1] || { x: planeX, y: planeY };
        ctx.arc(lastP.x, lastP.y, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [multiplierNum, isCrashed, isWaiting]);

  return (
    <div className="relative w-full h-full bg-[#000000] rounded-[3rem] overflow-hidden border border-white/10 flex flex-col items-center justify-center shadow-tactile">
      
      {/* Immersive Pulse Background */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${isCrashed ? 'opacity-30' : 'opacity-15'}`}>
         <div className={`absolute inset-0 bg-radial-at-center from-white/30 to-transparent ${isCrashed ? 'from-red-600' : multiplierNum > 10 ? 'from-amber-400' : 'from-green-500'}`} />
      </div>

      <canvas 
        ref={canvasRef} 
        width={1600} 
        height={1000} 
        className="absolute inset-0 w-full h-full object-cover"
      />

      <AnimatePresence mode="wait">
        {isWaiting ? (
          <motion.div 
            key="waiting"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="z-20 flex flex-col items-center gap-12"
          >
            <div className="relative w-48 h-48 flex items-center justify-center">
               <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-[12px] border-red-600/20 border-t-red-600 rounded-full"
               />
               <span className="text-7xl font-black text-red-600 italic">!</span>
            </div>
            <h2 className="text-6xl font-black text-white italic tracking-tighter text-center max-w-lg drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] uppercase">
              Preparing for Takeoff
            </h2>
          </motion.div>
        ) : (
          <div className="z-20 pointer-events-none flex flex-col items-center">
            <motion.h2 
               key={isCrashed ? 'crashed' : 'flying'}
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className={`text-[18rem] leading-none font-black italic tracking-tighter transition-all duration-300 drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)]
                  ${isCrashed ? 'text-red-600 scale-90 blur-[4px]' : 'text-white scale-100'}
                  ${multiplierNum >= 10 && !isCrashed ? 'text-amber-400 drop-shadow-[0_0_80px_rgba(255,196,0,0.6)]' : ''}
                  ${multiplierNum >= 2 && multiplierNum < 10 && !isCrashed ? 'text-green-500 drop-shadow-[0_0_80px_rgba(0,255,34,0.4)]' : ''}
            `}>
              {multiplier}<span className="text-8xl ml-6">x</span>
            </motion.h2>
            
            {isCrashed && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-red-600 px-12 py-5 rounded-[2rem] text-5xl font-black italic shadow-[0_20px_50px_rgba(255,0,0,0.6)] uppercase tracking-[0.1em] text-white -mt-16"
              >
                Flew Away!
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Ultra-Visible Status Labels */}
      <div className="absolute bottom-12 left-16 z-30">
         <div className="flex flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-[0.6em] text-white/30">System Status</span>
            <div className="flex items-center gap-4 bg-black/60 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
               <div className={`w-4 h-4 rounded-full ${isCrashed ? 'bg-red-600' : 'bg-green-500 animate-pulse'}`} />
               <span className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">
                  {isCrashed ? 'Payout Over' : isWaiting ? 'Place Bets' : 'In Flight'}
               </span>
            </div>
         </div>
      </div>
    </div>
  );
}
