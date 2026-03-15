'use client';

import { useState } from 'react';
import { Zap, TrendingUp, Ban } from 'lucide-react';
import { motion } from 'framer-motion';

type GameState = 'WAITING' | 'FLYING' | 'CRASHED';

interface BetState {
  isActive: boolean;
  isCashedOut: boolean;
  betAmount: string;
  autoCashout: string;
}

interface BettingPanelProps {
  gameState: GameState;
  currentMultiplier: number;
}

export default function BettingPanel({ gameState, currentMultiplier }: BettingPanelProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full h-full p-2">
      <SingleBetControl panelId="1" gameState={gameState} currentMultiplier={currentMultiplier} />
      <SingleBetControl panelId="2" gameState={gameState} currentMultiplier={currentMultiplier} />
    </div>
  );
}

function SingleBetControl({ panelId, gameState, currentMultiplier }: { panelId: string; gameState: GameState; currentMultiplier: number }) {
  const [bet, setBet] = useState<BetState>({
    isActive: false,
    isCashedOut: false,
    betAmount: '100.00',
    autoCashout: '2.00',
  });

  const currentWin = (parseFloat(bet.betAmount) * currentMultiplier).toFixed(2);

  const modifyBet = (multiplier: number) => {
    if (bet.isActive) return;
    const val = (parseFloat(bet.betAmount) * multiplier).toFixed(2);
    setBet({ ...bet, betAmount: val });
  };

  const handeBetAction = () => {
    if (gameState === 'WAITING') {
      setBet({ ...bet, isActive: !bet.isActive, isCashedOut: false });
    } else if (gameState === 'FLYING' && bet.isActive && !bet.isCashedOut) {
      setBet({ ...bet, isCashedOut: true });
    }
  };

  const isButtonEnabled = !(gameState === 'CRASHED' || (gameState === 'FLYING' && !bet.isActive) || bet.isCashedOut);

  return (
    <div className={`flex-1 flex flex-col gap-6 p-8 rounded-[3.5rem] border transition-all duration-500 shadow-2xl
      ${bet.isActive && gameState === 'FLYING' && !bet.isCashedOut ? 'bg-[#0d0d0d] border-green-500/80' : 'bg-[#080808] border-white/5'}
    `}>
      <div className="flex flex-col xl:flex-row gap-8 items-stretch h-full">
         
         {/* Left Side: Inputs and Presets (Enlarged) */}
         <div className="flex-1 flex flex-col gap-6">
            
            {/* Massive Bet Amount Input */}
            <div className="bg-black rounded-[2rem] p-4 border border-white/10 flex items-center justify-between focus-within:border-white/30 transition-all shadow-inner">
               <div className="flex-1 flex flex-col pl-6">
                  <span className="text-xs font-black text-white/30 uppercase tracking-[0.4em] italic mb-1">Set Your Bet</span>
                  <input 
                    type="number"
                    value={bet.betAmount}
                    disabled={bet.isActive}
                    onChange={(e) => setBet({...bet, betAmount: e.target.value})}
                    className="bg-transparent text-white text-5xl font-black outline-none w-full disabled:opacity-30 leading-tight"
                  />
               </div>
               <div className="flex flex-col gap-2 pr-2">
                  <button onClick={() => modifyBet(2)} disabled={bet.isActive} className="w-16 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-xs font-black hover:bg-white/10 active:scale-90 transition-all">x2</button>
                  <button onClick={() => modifyBet(0.5)} disabled={bet.isActive} className="w-16 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-xs font-black hover:bg-white/10 active:scale-90 transition-all">/2</button>
               </div>
            </div>

            {/* Enlarged Preset Grid */}
            <div className="grid grid-cols-4 gap-3">
               {[100, 200, 500, 1000].map(val => (
                 <button 
                  key={val}
                  disabled={bet.isActive}
                  onClick={() => setBet({...bet, betAmount: val.toFixed(2)})}
                  className="py-5 bg-white/[0.03] border border-white/5 rounded-[1.5rem] text-lg font-black text-white/50 hover:text-white hover:bg-white/10 transition-all disabled:opacity-0"
                 >
                   {val}
                 </button>
               ))}
            </div>

            {/* Large Auto Cashout */}
            <div className="flex items-center justify-between px-8 py-5 bg-black/80 rounded-[2rem] border border-white/10 mt-auto">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white/30 uppercase italic tracking-[0.3em] mb-1">Auto Cashout</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={bet.autoCashout}
                    disabled={bet.isActive}
                    onChange={(e) => setBet({...bet, autoCashout: e.target.value})}
                    className="bg-transparent text-green-500 text-2xl font-black outline-none w-24 disabled:text-green-900" 
                  />
               </div>
               <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center border border-white/5">
                  <Zap size={28} className={`transition-all duration-700 ${bet.isActive ? 'text-green-500 drop-shadow-[0_0_15px_rgba(0,255,34,0.6)]' : 'text-white/20'}`} />
               </div>
            </div>
         </div>

         {/* Right Side: Massive Psycho-Action Button */}
         <div className="flex-1 min-h-[220px]">
            <button 
              onClick={handeBetAction}
              disabled={!isButtonEnabled}
              className={`w-full h-full rounded-[3rem] flex flex-col items-center justify-center gap-4 transition-all duration-300 transform active:scale-95 group shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden border-t border-white/20
                ${!isButtonEnabled ? 'bg-[#151515] grayscale opacity-30 cursor-not-allowed' : 
                  gameState === 'WAITING' ? 
                    (bet.isActive ? 'bg-red-600 hover:bg-red-500 shadow-[0_20px_60px_rgba(255,0,0,0.5)]' : 'bg-green-600 hover:bg-green-500 shadow-[0_20px_60px_rgba(0,255,34,0.5)]') :
                  gameState === 'FLYING' ? 
                    (bet.isActive && !bet.isCashedOut ? 'bg-[#00ff22] animate-pulse text-black shadow-[0_0_120px_rgba(0,255,34,1)] scale-105 border-transparent' : 'bg-zinc-800 border-white/10 opacity-70') :
                  'bg-zinc-800'
                }
              `}
            >
               {/* Reflection/Plastic Finish */}
               <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none skew-x-[-15deg] translate-x-10 opacity-40" />

               <span className={`text-7xl font-black italic tracking-tighter uppercase leading-tight transition-transform group-hover:scale-110 drop-shadow-[0_4px_15px_rgba(0,0,0,0.5)]
                  ${bet.isActive && gameState === 'FLYING' && !bet.isCashedOut ? 'text-black' : 'text-white'}
               `}>
                 {gameState === 'FLYING' && bet.isActive && !bet.isCashedOut ? 'CASH\nOUT' : 
                  gameState === 'WAITING' ? (bet.isActive ? 'CANCEL' : 'PLACE\nBET') : 
                  bet.isCashedOut ? 'WON!' : 'FLYING...'}
               </span>

               <div className="flex flex-col items-center gap-1">
                  <span className={`text-6xl font-black italic tracking-tighter drop-shadow-2xl leading-tight
                     ${bet.isActive && gameState === 'FLYING' && !bet.isCashedOut ? 'text-black' : 'text-white/80'}
                  `}>
                    {gameState === 'FLYING' && bet.isActive && !bet.isCashedOut ? currentWin : `${parseFloat(bet.betAmount).toFixed(0)} KES`}
                  </span>
                  <span className={`text-[14px] font-black uppercase tracking-[0.5em] opacity-50 italic
                     ${bet.isActive && gameState === 'FLYING' && !bet.isCashedOut ? 'text-black animate-bounce' : ''}
                  `}>Simulation Value</span>
               </div>
            </button>
         </div>
      </div>
    </div>
  );
}
