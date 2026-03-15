'use client';

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import GameCanvas from '@/components/GameCanvas';
import WalletDashboard from '@/components/WalletDashboard';
import BettingPanel from '@/components/BettingPanel';
import { Menu, User, MessageCircle, Send, Users } from 'lucide-react';

export default function Home() {
  const [multiplier, setMultiplier] = useState('1.00');
  const [status, setStatus] = useState<'WAITING' | 'STARTING' | 'IN_PROGRESS' | 'CRASHED'>('WAITING');
  const [nextRoundIn, setNextRoundIn] = useState(5000);
  const [history, setHistory] = useState(['3.57', '6.17', '3.25', '1.93', '10.63', '2.63', '9.54', '5.85', '2.87', '1.77', '2.68', '2.57', '43.35', '2.01', '1.77', '2.08', '2.71', '1.77', '2.13', '1.78', '2.89', '3.9x']);

  useEffect(() => {
    const socketUrl = 'http://127.0.0.1:3006';
    const newSocket = io(socketUrl, { transports: ['websocket'] });

    newSocket.on('multiplier_tick', (data) => {
      setMultiplier(data.multiplier);
      setStatus('IN_PROGRESS');
    });

    newSocket.on('game_start', () => {
      setStatus('IN_PROGRESS');
      setMultiplier('1.00');
    });

    newSocket.on('game_crash', (data) => {
      setStatus('CRASHED');
      setMultiplier(data.multiplier);
      setHistory(prev => [data.multiplier, ...prev].slice(0, 25));
    });

    newSocket.on('game_waiting', (data) => {
      setStatus('WAITING');
      setNextRoundIn(data.nextRoundIn);
    });

    return () => { newSocket.disconnect(); };
  }, []);

  return (
    <main className="h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden">
      
      {/* Maxi Pesa Header */}
      <header className="h-14 bg-black border-b border-white/5 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-2">
           <div className="relative">
              <div className="absolute -inset-1 bg-red-600 blur opacity-20" />
              <svg width="32" height="32" viewBox="0 0 24 24" className="text-red-500 relative">
                 <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.09-.36.14-.57.14s-.41-.05-.57-.14l-7.9-4.44A.996.996 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.09.36-.14.57-.14s.41.05.57.14l7.9 4.44c.32.17.53.5.53.88v9z" fill="currentColor" opacity="0.2" />
                 <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="none" stroke="currentColor" strokeWidth="2" />
                 <path d="M12 22v-10l-9-5m18 0l-9 5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
           </div>
           <h1 className="text-xl font-black italic tracking-tighter uppercase whitespace-nowrap">MAXI <span className="text-white/40">PESA</span></h1>
        </div>

        <div className="flex items-center gap-10 overflow-x-auto no-scrollbar mx-4">
           {history.map((val, i) => (
             <span key={i} className={`text-[10px] font-black italic tracking-widest flex-shrink-0 ${parseFloat(val) > 2 ? 'text-green-500' : 'text-blue-400'}`}>
                {val === '3.9x' ? val : val + 'x'}
             </span>
           ))}
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-[#1a1a1b] px-4 py-2 rounded-lg border border-white/10 shadow-inner">
              <span className="text-[10px] font-black text-white/40 tracking-widest uppercase italic">KES 0.00</span>
              <div className="w-[1px] h-4 bg-white/10" />
              <button className="text-[10px] font-black text-red-500 hover:text-red-400 tracking-widest uppercase italic">Deposit</button>
           </div>
           <button className="p-2 bg-white/5 rounded-lg border border-white/5 text-white/40 hover:text-white transition-colors">
              <Menu size={20} />
           </button>
        </div>
      </header>

      {/* Main Grid: Game + Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Game & Controls Area */}
        <div className="flex-1 flex flex-col p-1 gap-1">
           <div className="flex-1 min-h-0">
              <GameCanvas 
                 multiplier={multiplier} 
                 isCrashed={status === 'CRASHED'}
                 isWaiting={status === 'WAITING'}
                 nextRoundIn={nextRoundIn}
              />
           </div>

           {/* Betting Workspace */}
           <div className="h-[240px] flex gap-1">
              <BettingPanel />
              <BettingPanel />
           </div>

           {/* Footer Tabs & Live Feed */}
           <div className="h-[180px] bg-[#0a0a0a] rounded-xl flex flex-col overflow-hidden">
              <div className="flex h-10 border-b border-white/5">
                 <button className="flex-1 flex items-center justify-center gap-2 bg-red-900/10 text-[10px] font-black uppercase text-red-500 border-b-2 border-red-500">
                    <Users size={14} /> Live Bets
                 </button>
                 <button className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-white/20 hover:text-white/40">
                    Live Withdrawals
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                 {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2">
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-white/60">Ronald Korir - <span className="text-white/30 italic">Investment</span> KES 1,071.00</span>
                          <span className="text-[10px] font-black text-green-500">Total Winnings - KES 1,420,158.71</span>
                       </div>
                       <div className="text-[10px] font-black text-white/20">15:52</div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Sidebar: Chat */}
        <aside className="w-[380px] bg-[#121214] border-l border-white/5 flex flex-col p-4 shadow-2xl">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg">D</div>
                 <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-widest">DANSCAIZ</span>
                    <span className="text-[9px] font-bold text-white/20">0794631254</span>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-[9px] font-black text-green-500 uppercase">Connected</span>
              </div>
           </div>

           <div className="flex-1 bg-black/20 rounded-2xl border border-white/5 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
                 {/* Empty for now or mock messages */}
                 <div className="mt-auto flex flex-col gap-4">
                    <div className="flex flex-col items-start gap-1">
                       <div className="bg-white/5 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-white/60 max-w-[80%] border border-white/5">
                          Good luck everyone! 🚀
                       </div>
                       <span className="text-[8px] font-bold text-white/20 ml-2 italic">User_482 • 18:22</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                       <div className="bg-red-600/10 border border-red-500/20 rounded-2xl rounded-tr-none px-4 py-3 text-xs text-red-200/60 max-w-[80%]">
                          KSH 20,000 on the next one! 💸
                       </div>
                       <span className="text-[8px] font-bold text-white/20 mr-2 italic">You • 18:24</span>
                    </div>
                 </div>
              </div>

              <div className="p-4 bg-black/40 flex items-center gap-3">
                 <div className="flex-1 bg-white/5 rounded-xl flex items-center px-4 border border-white/10 focus-within:border-red-500/50 transition-colors">
                    <input 
                       placeholder="who else is fron tiktok"
                       className="flex-1 bg-transparent py-3 text-xs text-white outline-none placeholder:text-white/10"
                    />
                    <button className="bg-red-600 p-1.5 rounded-lg text-white hover:bg-red-500 transition-colors shadow-lg">
                       <Send size={14} />
                    </button>
                 </div>
                 <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/20 hover:text-white cursor-pointer transition-colors">
                    <MessageCircle size={18} />
                 </div>
              </div>
           </div>
        </aside>
      </div>

    </main>
  );
}
