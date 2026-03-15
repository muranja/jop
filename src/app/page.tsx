'use client';

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import GameCanvas from '@/components/GameCanvas';
import BettingPanel from '@/components/BettingPanel';
import { Menu, TrendingUp, History, Bell, Users, MessageCircle, Send, User } from 'lucide-react';

export default function Home() {
  const [multiplier, setMultiplier] = useState('1.00');
  const [status, setStatus] = useState<'WAITING' | 'STARTING' | 'IN_PROGRESS' | 'CRASHED'>('WAITING');
  const [nextRoundIn, setNextRoundIn] = useState(5000);
  const [history, setHistory] = useState(['1.24', '3.57', '6.17', '3.25', '1.93', '10.63', '2.63', '9.54', '5.85', '2.87', '1.77', '2.68', '2.57', '43.35', '2.01', '1.24', '1.37', '31.90', '2.69', '1.49']);

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
      setHistory(prev => [data.multiplier, ...prev].slice(0, 30));
    });

    newSocket.on('game_waiting', (data) => {
      setStatus('WAITING');
      setNextRoundIn(data.nextRoundIn);
    });

    return () => { newSocket.disconnect(); };
  }, []);

  return (
    <main className="h-screen bg-[#020202] text-[#ffffff] flex flex-col font-sans overflow-hidden">
      
      {/* High-Contrast Header */}
      <header className="h-20 px-10 flex items-center justify-between border-b border-white/10 bg-black z-50">
        <div className="flex items-center gap-16">
           <div className="flex items-center gap-4">
              <div className="bg-red-600 p-2.5 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.4)]">
                 <TrendingUp size={24} className="text-white" />
              </div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase whitespace-nowrap leading-none">
                MAXI<span className="text-white/30">PESA</span>
              </h1>
           </div>
           
           <nav className="hidden xl:flex gap-10 items-center text-[12px] font-black uppercase tracking-[0.3em] text-white/40">
              <a href="#" className="text-white border-b-2 border-red-600 pb-1">Aviator</a>
              <a href="#" className="hover:text-white transition-colors">Provably Fair</a>
              <a href="#" className="hover:text-white transition-colors">Jackpots</a>
           </nav>
        </div>

        <div className="flex items-center gap-6">
           <div className="bg-[#0d0d0d] px-8 py-3.5 rounded-2xl border border-white/10 flex items-center gap-6 shadow-2xl">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-white/20 tracking-widest uppercase mb-0.5">Available Balance</span>
                 <span className="text-base font-black text-white">1,250.00 KES</span>
              </div>
              <div className="h-8 w-[1px] bg-white/10" />
              <button className="text-[12px] font-black text-red-600 uppercase tracking-widest hover:text-red-500 transition-all hover:scale-105">Deposit</button>
           </div>
           
           <div className="bg-[#0d0d0d] p-3.5 rounded-2xl border border-white/10 text-white hover:bg-white/5 cursor-pointer transition-all"><Menu size={24} /></div>
        </div>
      </header>

      {/* Main Grid: Global Layout */}
      <div className="flex-1 flex overflow-hidden p-1 gap-1">
        
        {/* Left: Engagement Feed */}
        <aside className="w-[400px] bg-[#0d0d0d] rounded-3xl border border-white/5 flex flex-col overflow-hidden shadow-2xl">
          <div className="p-8 flex gap-12 text-[12px] font-black uppercase tracking-[0.2em] border-b border-white/5 bg-black/40">
            <span className="text-white border-b-2 border-red-600 pb-8 -mb-[33px] cursor-pointer">Live Bets</span>
            <span className="text-white/20 hover:text-white/40 cursor-pointer">Winners</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-black/10">
             <div className="space-y-2">
                {[...Array(20)].map((_, i) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.05] transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-white/40 font-black"><User size={24} /></div>
                         <div className="flex flex-col">
                            <span className="text-xs font-black text-white">Player_{Math.floor(Math.random() * 9999)}</span>
                            <span className="text-[11px] font-bold text-white/20 uppercase tracking-widest">BET 500 KES</span>
                         </div>
                      </div>
                      <div className="text-right">
                         <span className="text-xs font-black text-green-500 italic">+740.00</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </aside>

        {/* Center: High-Performance Arena */}
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
           
           {/* Multiplier History Strip (Narrative Enhancement) */}
           <div className="h-16 bg-black/60 rounded-3xl border border-white/5 flex items-center px-8 gap-3 overflow-x-auto no-scrollbar justify-end">
              <History size={16} className="text-white/20 mr-4" />
              {history.map((val, i) => (
                 <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={i} 
                    className={`px-6 py-2 rounded-full text-[11px] font-black italic tracking-widest border transition-all whitespace-nowrap
                        ${parseFloat(val) < 2 ? 'bg-zinc-900/40 border-white/5 text-white/30' : 
                          parseFloat(val) >= 10 ? 'bg-amber-500/20 text-amber-500 border-amber-500/30 text-glow-gold' : 
                          'bg-green-500/20 text-green-500 border-green-500/30'}`}
                 >
                    {val}x
                 </motion.div>
              ))}
           </div>

           {/* Hero Canvas Area */}
           <div className="flex-1 relative rounded-3xl overflow-hidden shadow-2xl">
              <GameCanvas 
                 multiplier={multiplier} 
                 isCrashed={status === 'CRASHED'}
                 isWaiting={status === 'WAITING'}
                 nextRoundIn={nextRoundIn}
              />
           </div>

           {/* Tactical Betting Controls */}
           <div className="h-[340px]">
              <BettingPanel 
                 gameState={status === 'IN_PROGRESS' || status === 'STARTING' ? 'FLYING' : status === 'CRASHED' ? 'CRASHED' : 'WAITING'} 
                 currentMultiplier={parseFloat(multiplier)} 
              />
           </div>
        </div>

        {/* Right: Social Sidebar */}
        <aside className="w-[420px] bg-[#0d0d0d] rounded-3xl border border-white/5 flex flex-col overflow-hidden shadow-2xl">
           <div className="p-8 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-red-600 rounded-3xl flex items-center justify-center font-black text-2xl shadow-2xl text-white">V</div>
                 <div className="flex flex-col">
                    <span className="text-sm font-black uppercase tracking-[0.2em] text-white">VIN_PESA</span>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                       <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Live Operator</span>
                    </div>
                 </div>
              </div>
              <Users size={22} className="text-white/10" />
           </div>

           <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-black/5 flex flex-col gap-6">
              <div className="mt-auto space-y-6">
                 <div className="flex flex-col items-start gap-2">
                    <div className="bg-[#1a1a1b] px-6 py-4 rounded-[2rem] rounded-tl-none border border-white/5 text-sm text-white/70 max-w-[80%] leading-relaxed shadow-lg">
                       Who's joining the next round? The multiplier rhythm is insane tonight! 🚀
                    </div>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-4">System • 20:30</span>
                 </div>
                 
                 <div className="flex flex-col items-end gap-2">
                    <div className="bg-red-600/10 px-6 py-4 rounded-[2rem] rounded-tr-none border border-red-500/20 text-sm text-red-100 max-w-[80%] leading-relaxed shadow-lg">
                       Ready to crash out at 15.00x! Let's go! 💰
                    </div>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mr-4">You • 20:38</span>
                 </div>
              </div>
           </div>

           <div className="p-8 bg-black border-t border-white/5">
              <div className="bg-[#1a1a1b] rounded-[1.5rem] p-4 flex items-center gap-4 border border-white/10 focus-within:border-white/30 transition-all shadow-inner">
                 <input 
                    placeholder="Message the tribe..."
                    className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                 />
                 <button className="bg-red-600 p-3 rounded-2xl text-white hover:bg-red-500 transition-all shadow-xl active:scale-90">
                    <Send size={20} />
                 </button>
              </div>
           </div>
        </aside>
      </div>

    </main>
  );
}
