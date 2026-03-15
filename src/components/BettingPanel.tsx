'use client';

import { useState, useEffect } from 'react';
import { Minus, Plus, Zap, Ban } from 'lucide-react';

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
    <div className="flex flex-col sm:flex-row gap-2 w-full h-full">
      <SingleBetControl panelId="1" gameState={gameState} currentMultiplier={currentMultiplier} />
      <SingleBetControl panelId="2" gameState={gameState} currentMultiplier={currentMultiplier} />
    </div>
  );
}

function SingleBetControl({ panelId, gameState, currentMultiplier }: { panelId: string; gameState: GameState; currentMultiplier: number }) {
  const [bet, setBet] = useState<BetState>({
    isActive: false,
    isCashedOut: false,
    betAmount: '10.00',
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
    <div className={`flex-1 flex flex-col gap-4 p-6 rounded-[2.5rem] border transition-all duration-500
      ${bet.isActive && gameState === 'FLYING' && !bet.isCashedOut ? 'bg-[#1a1a1b] border-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.1)]' : 'bg-[#111112] border-white/[0.03]'}
    `}>
      <div className="flex gap-4 items-center">
         <div className="flex-1 space-y-3">
            {/* Input Wrapper */}
            <div className="bg-black/60 rounded-3xl p-2 border border-white/5 flex items-center justify-between group focus-within:border-white/20 transition-all">
               <div className="flex-1 flex flex-col pl-4">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Bet Amount</span>
                  <input 
                    type="number"
                    value={bet.betAmount}
                    disabled={bet.isActive}
                    onChange={(e) => setBet({...bet, betAmount: e.target.value})}
                    className="bg-transparent text-white text-3xl font-black outline-none w-full disabled:opacity-40"
                  />
               </div>
               <div className="flex flex-col gap-1 pr-1">
                  <button onClick={() => modifyBet(2)} disabled={bet.isActive} className="w-10 h-7 bg-white/5 rounded-xl flex items-center justify-center text-[10px] font-bold hover:bg-white/10 disabled:opacity-0 transition-all">x2</button>
                  <button onClick={() => modifyBet(0.5)} disabled={bet.isActive} className="w-10 h-7 bg-white/5 rounded-xl flex items-center justify-center text-[10px] font-bold hover:bg-white/10 disabled:opacity-0 transition-all">/2</button>
               </div>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-4 gap-2">
               {[10, 50, 100, 500].map(val => (
                 <button 
                  key={val}
                  disabled={bet.isActive}
                  onClick={() => setBet({...bet, betAmount: val.toFixed(2)})}
                  className="py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-[11px] font-black text-white/40 hover:text-white hover:bg-white/5 transition-all disabled:opacity-0"
                 >
                   {val}
                 </button>
               ))}
            </div>

            {/* Auto Cashout */}
            <div className="flex items-center justify-between px-5 py-3 bg-black/40 rounded-2xl border border-white/5">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-white/20 uppercase italic tracking-widest">Auto Cashout</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={bet.autoCashout}
                    disabled={bet.isActive}
                    onChange={(e) => setBet({...bet, autoCashout: e.target.value})}
                    className="bg-transparent text-green-500 font-black outline-none w-20 text-sm disabled:text-green-900" 
                  />
               </div>
               <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <Zap size={16} className={`transition-colors ${bet.isActive ? 'text-green-500' : 'text-white/20'}`} />
               </div>
            </div>
         </div>

         {/* Massive Action Button */}
         <div className="flex-1 h-full">
            <button 
              onClick={handeBetAction}
              disabled={!isButtonEnabled}
              className={`w-full h-full min-h-[180px] rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-all duration-300 active:scale-95 group shadow-2xl relative overflow-hidden
                ${!isButtonEnabled ? 'bg-zinc-900 grayscale opacity-40 cursor-not-allowed' : 
                  gameState === 'WAITING' ? 
                    (bet.isActive ? 'bg-red-600 hover:bg-red-500 shadow-[0_10px_40px_rgba(220,38,38,0.4)]' : 'bg-green-600 hover:bg-green-500 shadow-[0_10px_40px_rgba(34,197,94,0.4)]') :
                  gameState === 'FLYING' ? 
                    (bet.isActive && !bet.isCashedOut ? 'bg-green-500 animate-pulse text-black shadow-[0_0_60px_rgba(34,197,94,0.8)] scale-105' : 'bg-zinc-800 opacity-60') :
                  'bg-zinc-800'
                }
              `}
            >
               {/* Glossy Overlay */}
               <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

               <span className={`text-4xl font-black italic tracking-tighter uppercase transition-colors 
                  ${bet.isActive && gameState === 'FLYING' && !bet.isCashedOut ? 'text-white' : 'text-white'}
               `}>
                 {gameState === 'FLYING' && bet.isActive && !bet.isCashedOut ? 'CASH OUT' : 
                  gameState === 'WAITING' ? (bet.isActive ? 'CANCEL' : 'BET') : 
                  bet.isCashedOut ? 'WIN!' : 'WAITING'}
               </span>

               <div className="flex flex-col items-center">
                  <span className={`text-2xl font-black italic tracking-tighter ${bet.isActive && gameState === 'FLYING' && !bet.isCashedOut ? 'text-white' : 'text-white/40'}`}>
                    {gameState === 'FLYING' && bet.isActive && !bet.isCashedOut ? currentWin : `${parseFloat(bet.betAmount).toFixed(0)} KES`}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mt-1">Multiplayer</span>
               </div>

               {gameState === 'FLYING' && bet.isActive && !bet.isCashedOut && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl"
                  >
                     <Zap size={20} className="text-green-600 fill-green-600" />
                  </motion.div>
               )}
            </button>
         </div>
      </div>
    </div>
  );
}
