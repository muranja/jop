'use client';

import { useState } from 'react';

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
  // We render two identical betting controls for strategic dual-betting
  return (
    <div className="flex flex-col sm:flex-row gap-1 w-full h-full">
      <SingleBetControl panelId="1" gameState={gameState} currentMultiplier={currentMultiplier} />
      <SingleBetControl panelId="2" gameState={gameState} currentMultiplier={currentMultiplier} />
    </div>
  );
}

// --- Individual Betting Control Component ---

function SingleBetControl({
  panelId,
  gameState,
  currentMultiplier,
}: {
  panelId: string;
  gameState: GameState;
  currentMultiplier: number;
}) {
  const [bet, setBet] = useState<BetState>({
    isActive: false, // Has the player locked in a bet for the current/next round?
    isCashedOut: false, // Did they successfully cash out?
    betAmount: '10.00',
    autoCashout: '2.00',
  });

  // Calculate live potential win
  const currentWin = (parseFloat(bet.betAmount) * currentMultiplier).toFixed(2);

  // Quick Bet Modifiers
  const modifyBet = (multiplier: number) => {
    if (bet.isActive) return;
    const current = parseFloat(bet.betAmount);
    setBet({ ...bet, betAmount: Math.max(1, current * multiplier).toFixed(2) });
  };

  const setFixedBet = (amount: number) => {
    if (bet.isActive) return;
    setBet({ ...bet, betAmount: amount.toFixed(2) });
  };

  // Button Action Handler
  const handleAction = () => {
    if (gameState === 'WAITING' && !bet.isActive) {
      // Place Bet
      setBet({ ...bet, isActive: true, isCashedOut: false });
    } else if (gameState === 'WAITING' && bet.isActive) {
      // Cancel Bet before round starts
      setBet({ ...bet, isActive: false });
    } else if (gameState === 'FLYING' && bet.isActive && !bet.isCashedOut) {
      // CASH OUT!
      setBet({ ...bet, isCashedOut: true });
      // TODO: Trigger backend WebSocket cashout event here
    }
  };

  // Determine Button Appearance Based on Game State
  const getButtonStyles = () => {
    if (gameState === 'WAITING') {
      return bet.isActive
        ? 'bg-zinc-800 text-white shadow-inner border border-white/5' // Cancel Bet
        : 'bg-green-500 hover:bg-green-600 text-white shadow-[0_10px_30px_rgba(34,197,94,0.3)]'; // Place Bet
    }
    
    if (gameState === 'FLYING') {
      if (bet.isActive && !bet.isCashedOut) {
        // The "MUST CLICK" Cash Out State
        return 'bg-green-500 hover:bg-green-400 text-white font-black animate-pulse shadow-[0_0_40px_rgba(34,197,94,0.6)] border-2 border-white/20';
      }
      return 'bg-zinc-800 text-zinc-500 cursor-not-allowed'; // Waiting for next round / Cashed out
    }
    
    // CRASHED State
    return 'bg-zinc-800 text-zinc-600 cursor-not-allowed';
  };

  const getButtonText = () => {
    if (gameState === 'WAITING') return bet.isActive ? 'WAITINGING...' : 'BET';
    if (gameState === 'FLYING') {
      if (bet.isActive && !bet.isCashedOut) return `CASH OUT\n${currentWin} USDT`;
      if (bet.isCashedOut) return 'CASHED OUT';
      return 'WAITING...';
    }
    return 'CRASHED';
  };

  return (
    <div className="flex-1 bg-[#18181B] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl">
      <div className="flex flex-col gap-3">
        {/* Bet Amount Input */}
        <div className="flex gap-1 items-center bg-[#09090B] rounded-xl p-1.5 border border-white/5">
          <div className="flex flex-col pl-2 flex-1">
            <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Amount</span>
            <input
              type="number"
              value={bet.betAmount}
              onChange={(e) => setBet({ ...bet, betAmount: e.target.value })}
              disabled={bet.isActive}
              className="bg-transparent text-white font-black outline-none w-full text-lg leading-tight"
            />
          </div>
          <div className="flex gap-1 pr-1">
             <button onClick={() => modifyBet(0.5)} disabled={bet.isActive} className="w-8 h-8 rounded-lg bg-zinc-800 text-white/40 hover:text-white text-[10px] font-black transition-all">/2</button>
             <button onClick={() => modifyBet(2)} disabled={bet.isActive} className="w-8 h-8 rounded-lg bg-zinc-800 text-white/40 hover:text-white text-[10px] font-black transition-all">x2</button>
          </div>
        </div>

        {/* Quick Select Grid */}
        <div className="grid grid-cols-4 gap-1.5">
           {[50, 100, 200, 500].map(amt => (
             <button 
               key={amt}
               onClick={() => setFixedBet(amt)}
               disabled={bet.isActive}
               className="py-2.5 bg-black/40 rounded-lg text-[10px] font-black text-white/20 hover:text-white hover:bg-white/5 border border-white/5 transition-all disabled:opacity-10"
             >
               {amt}
             </button>
           ))}
        </div>

        {/* Auto Cashout Input */}
        <div className="flex items-center justify-between gap-3 bg-black/40 p-2 rounded-xl border border-white/5 mt-1">
           <div className="flex flex-col pl-1 flex-1">
            <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Auto Cashout</span>
            <input
              type="number"
              step="0.01"
              value={bet.autoCashout}
              onChange={(e) => setBet({ ...bet, autoCashout: e.target.value })}
              disabled={bet.isActive}
              className="bg-transparent text-green-500 font-black outline-none w-full text-xs"
            />
          </div>
          <div className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black text-white/20 uppercase tracking-tighter">Auto</div>
        </div>
      </div>

      {/* Massive Action Button */}
      <button
        onClick={handleAction}
        disabled={gameState === 'CRASHED' || (gameState === 'FLYING' && !bet.isActive) || bet.isCashedOut}
        className={`w-full h-24 rounded-2xl text-2xl font-black uppercase tracking-tighter transition-all duration-300 transform active:scale-95 whitespace-pre-line leading-none ${getButtonStyles()}`}
      >
        <span className="block text-xl">{getButtonText().split('\n')[0]}</span>
        {getButtonText().split('\n')[1] && <span className="block text-sm mt-1">{getButtonText().split('\n')[1]}</span>}
      </button>
    </div>
  );
}
