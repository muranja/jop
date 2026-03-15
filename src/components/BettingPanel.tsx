'use client';

import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

export default function BettingPanel() {
  const [betAmount, setBetAmount] = useState(20);
  const [multiplier, setMultiplier] = useState(1.20);
  const [isAuto, setIsAuto] = useState(false);
  
  const presets = [50, 100, 200, 500];

  return (
    <div className="flex-1 bg-black/40 border border-red-900/40 rounded-xl overflow-hidden flex flex-col">
      {/* Header Label */}
      <div className="bg-red-900/20 py-1.5 text-center border-b border-red-900/30">
        <span className="text-[10px] font-black text-white/60 tracking-widest uppercase italic">Stake Selector</span>
      </div>

      <div className="p-4 grid grid-cols-12 gap-4 h-full">
        {/* Left: Inputs */}
        <div className="col-span-7 flex flex-col gap-3">
          {/* Amount Adjuster */}
          <div className="flex items-center gap-1 bg-[#1a1a1b] p-1 rounded-lg border border-white/5">
            <button 
              onClick={() => setBetAmount(Math.max(1, betAmount - 1))}
              className="w-10 h-10 flex items-center justify-center bg-white/5 rounded border border-white/10 text-white/40 hover:text-white"
            >
              <Minus size={20} />
            </button>
            <input 
              type="number" 
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="flex-1 bg-transparent text-center text-3xl font-black text-white outline-none"
            />
            <button 
              onClick={() => setBetAmount(betAmount + 1)}
              className="w-10 h-10 flex items-center justify-center bg-white/5 rounded border border-white/10 text-white/40 hover:text-white"
            >
              <Plus size={20} />
            </button>
            <button 
              onClick={() => setBetAmount(betAmount * 2)}
              className="px-3 h-10 bg-white/5 rounded border border-white/10 text-[10px] font-black text-white/40 hover:text-white"
            >
              *2
            </button>
          </div>

          {/* Presets Grid */}
          <div className="grid grid-cols-4 gap-2">
            {presets.map(val => (
              <button 
                key={val}
                onClick={() => setBetAmount(val)}
                className="py-2.5 bg-[#0a0a0a]/80 shadow-inner rounded border border-white/5 text-xs font-black text-white/30 hover:text-white hover:bg-white/5 transition-colors"
              >
                {val}
              </button>
            ))}
          </div>

          {/* Auto Cash Out Toggle */}
          <div className="flex items-center justify-between gap-4 mt-1">
             <div className="flex items-center gap-3">
                <div 
                  onClick={() => setIsAuto(!isAuto)}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isAuto ? 'bg-red-600' : 'bg-white/10'}`}
                >
                   <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isAuto ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
                <span className="text-[9px] font-black uppercase text-white/40 italic">Auto Cash Out</span>
             </div>
             <input 
               type="number" 
               step="0.01"
               value={multiplier}
               onChange={(e) => setMultiplier(Number(e.target.value))}
               className="w-20 bg-white/5 text-center text-xs font-black text-white py-1.5 rounded-lg border border-white/10"
             />
          </div>
        </div>

        {/* Right: Bet Button */}
        <div className="col-span-5 h-full">
           <button className="w-full h-full bg-[#27ae60] hover:bg-[#2ecc71] rounded-xl flex flex-col items-center justify-center group shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all">
              <span className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">Bet [Next Game]</span>
              <span className="text-2xl font-black text-white italic tracking-tighter mt-1">
                KSH {betAmount.toFixed(2)}
              </span>
           </button>
        </div>
      </div>
    </div>
  );
}
