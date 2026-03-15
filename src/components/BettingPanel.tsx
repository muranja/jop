'use client';

import React, { useState, useEffect } from 'react';
import { Minus, Plus, Zap } from 'lucide-react';

interface BettingPanelProps {
  multiplier?: number;
  isFlying?: boolean;
}

export default function BettingPanel({ multiplier = 1.0, isFlying = false }: BettingPanelProps) {
  const [betAmount, setBetAmount] = useState(20);
  const [autoCashOut, setAutoCashOut] = useState(1.20);
  const [hasBet, setHasBet] = useState(false);
  const [isAuto, setIsAuto] = useState(false);
  
  const presets = [50, 100, 200, 500];
  const projectedPayout = (betAmount * multiplier).toFixed(2);

  return (
    <div className="flex-1 bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-2xl transition-all h-full">
      {/* Dynamic Header */}
      <div className={`py-2 text-center border-b border-white/5 transition-colors duration-500 ${hasBet && isFlying ? 'bg-green-600/10' : 'bg-black/20'}`}>
        <span className="text-[9px] font-black text-white/40 tracking-[0.3em] uppercase italic">
          {hasBet && isFlying ? '⚡ LIVE SESSION' : 'STAKE SELECTOR'}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-6 h-full">
          {/* Controls */}
          <div className="flex-[0.6] flex flex-col gap-3">
            <div className="flex items-center gap-1 bg-black/60 p-1.5 rounded-2xl border border-white/5 shadow-inner">
              <button 
                onClick={() => setBetAmount(Math.max(1, betAmount - 1))}
                disabled={hasBet && isFlying}
                className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 text-white/40 hover:text-white disabled:opacity-20 transition-all active:scale-95"
              >
                <Minus size={20} />
              </button>
              <input 
                type="number" 
                value={betAmount}
                disabled={hasBet && isFlying}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="flex-1 bg-transparent text-center text-3xl font-black text-white outline-none disabled:text-white/40"
              />
              <button 
                onClick={() => setBetAmount(betAmount + 1)}
                disabled={hasBet && isFlying}
                className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 text-white/40 hover:text-white disabled:opacity-20 transition-all active:scale-95"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {presets.map(val => (
                <button 
                  key={val}
                  onClick={() => setBetAmount(val)}
                  disabled={hasBet && isFlying}
                  className="py-3 bg-black/40 rounded-xl text-xs font-black text-white/30 hover:text-white hover:bg-white/10 border border-white/5 disabled:opacity-10 transition-all"
                >
                  {val}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 mt-2 bg-black/40 p-2 rounded-xl border border-white/5">
               <div className="flex items-center gap-2">
                  <div 
                    onClick={() => !hasBet && setIsAuto(!isAuto)}
                    className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${isAuto ? 'bg-green-500' : 'bg-white/10'} ${hasBet ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                     <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isAuto ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-[8px] font-black text-white/40 uppercase">Auto</span>
               </div>
               <input 
                  type="number" 
                  step="0.01"
                  value={autoCashOut}
                  disabled={hasBet && isFlying}
                  onChange={(e) => setAutoCashOut(Number(e.target.value))}
                  className="w-16 bg-transparent text-center text-[11px] font-black text-green-500 outline-none"
               />
            </div>
          </div>

          {/* Master Action Button */}
          <div className="flex-[0.4] h-full">
            <button 
              onClick={() => !isFlying && setHasBet(!hasBet)}
              className={`w-full h-full rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 shadow-2xl active:scale-95 border-t border-white/20 group
                ${hasBet && isFlying 
                   ? 'bg-gradient-to-b from-[#22C55E] to-[#16a34a] shadow-[0_15px_40px_rgba(34,197,94,0.3)]' 
                   : hasBet && !isFlying
                   ? 'bg-zinc-800 border border-white/10 text-white/40'
                   : 'bg-gradient-to-b from-[#22C55E] to-[#16a34a] shadow-[0_15px_30px_rgba(34,197,94,0.2)] hover:shadow-[0_20px_50px_rgba(34,197,94,0.4)]'
                }
              `}
            >
              <span className={`text-2xl font-black italic tracking-tighter uppercase leading-none transition-colors ${hasBet && isFlying ? 'text-white' : hasBet ? 'text-white/20' : 'text-white'}`}>
                {hasBet && isFlying ? 'CASH OUT' : hasBet ? 'WAITING' : 'BET'}
              </span>
              
              <div className="flex flex-col items-center">
                <span className={`text-[10px] font-black uppercase italic ${hasBet && isFlying ? 'text-black/60' : 'text-white/40'}`}>
                  {hasBet && isFlying ? projectedPayout : `${betAmount.toFixed(0)} KES`}
                </span>
                {hasBet && isFlying && (
                   <Zap size={10} className="text-black/40 fill-black/40 animate-pulse mt-1" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-sm" />
    </div>
  );
}
