'use client';

import React from 'react';
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
  
  return (
    <div className="relative w-full h-full bg-[#050505] rounded-xl overflow-hidden border border-white/5 flex flex-col items-center justify-center">
      
      {/* Background Rays (Subtle) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] bg-[repeating-conic-gradient(from_0deg,#ffffff_0deg_10deg,transparent_10deg_20deg)] animate-propeller" />
      </div>

      <AnimatePresence mode="wait">
        {isWaiting ? (
          <motion.div 
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="relative flex flex-col items-center gap-8"
          >
            {/* Propeller Animation */}
            <div className="relative w-32 h-32">
               <motion.div 
                  className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-propeller"
               />
               <div className="absolute inset-4 border-2 border-red-600/30 rounded-full" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
               </div>
            </div>

            <h2 className="text-4xl font-black text-white italic tracking-tighter">
              WAITING FOR NEXT ROUND...
            </h2>
          </motion.div>
        ) : (
          <motion.div 
            key="flight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Red Plane SVG at Bottom Left */}
            <div className="absolute bottom-12 left-12">
               <svg width="120" height="60" viewBox="0 0 120 60" className="text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                  <path d="M10 40 L110 40 L115 30 L105 20 L40 20 L30 10 L10 10 Z" fill="currentColor" stroke="white" strokeWidth="2" />
                  <circle cx="110" cy="35" r="5" fill="white" />
                  <rect x="5" y="38" width="10" height="4" fill="white" />
               </svg>
            </div>

            {/* Large Multiplier Display */}
            <div className="text-center z-10">
              <h2 className={`text-[10rem] font-black italic tracking-tighter ${isCrashed ? 'text-red-500' : 'text-white'}`}>
                {multiplier}<span className="text-4xl">x</span>
              </h2>
              <p className="text-white/20 text-xs font-black uppercase tracking-[0.5em] -mt-4">
                {isCrashed ? 'FLEW AWAY!' : 'CURRENT MULTIPLIER'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 right-8 text-[10px] font-black text-white/10 uppercase tracking-widest">
         ROUND ID: #137CF9
      </div>
    </div>
  );
}
