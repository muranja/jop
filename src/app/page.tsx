'use client';

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import GameCanvas from '@/components/GameCanvas';
import BettingPanel from '@/components/BettingPanel';
import { Menu, TrendingUp, History, Bell, Users, MessageCircle, Send, User } from 'lucide-react';

export default function Home() {
  const [multiplier, setMultiplier] = useState('1.00');
  const [status, setStatus] = useState<'WAITING' | 'STARTING' | 'IN_PROGRESS' | 'CRASHED'>('WAITING');
  const [nextRoundIn, setNextRoundIn] = useState(5000);
  const [history, setHistory] = useState(['1.24', '3.57', '21.17', '3.25', '1.93', '10.63', '2.63', '84.54', '5.85', '2.87', '1.77', '2.68', '2.57', '43.35', '2.01', '1.24', '1.37', '31.90', '2.69', '1.49']);

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
    <main className="h-screen bg-[#000000] text-[#ffffff] flex flex-col font-sans overflow-hidden">
      
      {/* Mega Header: High Contrast & Scaled */}
      <header className="h-24 px-12 flex items-center justify-between border-b border-white/10 bg-black z-50 shadow-2xl">
        <div className="flex items-center gap-20">
           <div className="flex items-center gap-6 group cursor-pointer">
              <div className="bg-red-600 p-3.5 rounded-[1.5rem] shadow-[0_0_50px_rgba(255,0,0,0.5)] group-hover:scale-110 transition-transform">
                 <TrendingUp size={32} className="text-white" />
              </div>
              <h1 className="text-5xl font-black italic tracking-tighter uppercase whitespace-nowrap leading-none">
                MAXI<span className="text-white/20">PESA</span>
              </h1>
           </div>
           
           <nav className="hidden 2xl:flex gap-12 items-center text-[14px] font-black uppercase tracking-[0.4em] text-white/30">
              <a href="#" className="text-white border-b-4 border-red-600 pb-2">Aviator</a>
              <a href="#" className="hover:text-white transition-colors">Provably Fair</a>
              <a href="#" className="hover:text-white transition-colors">Jackpots</a>
           </nav>
        </div>

        <div className="flex items-center gap-10">
           {/* Scaled Balance Widget */}
           <div className="bg-[#0a0a0a] px-10 py-5 rounded-[2.5rem] border border-white/10 flex items-center gap-10 shadow-tactile">
              <div className="flex flex-col">
                 <span className="text-[11px] font-black text-white/20 tracking-widest uppercase mb-1">Total Balance</span>
                 <span className="text-3xl font-black text-white leading-none">12,500.00 KES</span>
              </div>
              <div className="h-12 w-[1px] bg-white/20" />
              <button className="text-[16px] font-black text-red-600 uppercase tracking-widest hover:text-red-500 transition-all hover:scale-110 active:scale-95">Deposit</button>
           </div>
           
           <div className="bg-[#0a0a0a] p-5 rounded-[1.5rem] border border-white/10 text-white hover:bg-white/10 cursor-pointer transition-all shadow-lg">
              <Menu size={32} />
           </div>
        </div>
      </header>

      {/* Main Grid: Scaled Layout */}
      <div className="flex-1 flex overflow-hidden p-2 gap-2">
        
        {/* Left: Enhanced Visibility Global Feed */}
        <aside className="w-[480px] bg-[#0a0a0a] rounded-[3rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
          <div className="p-10 flex gap-16 text-[14px] font-black uppercase tracking-[0.3em] border-b border-white/5 bg-black/50">
            <span className="text-white border-b-4 border-red-600 pb-10 -mb-[44px] cursor-pointer">Live Stream</span>
            <span className="text-white/10 hover:text-white/30 cursor-pointer">Big Wins</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-black/20">
             <div className="space-y-3">
                {[...Array(20)].map((_, i) => (
                   <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      key={i} 
                      className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all"
                   >
                      <div className="flex items-center gap-5">
                         <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-white/40"><User size={28} /></div>
                         <div className="flex flex-col gap-1">
                            <span className="text-base font-black text-white">Warrior_{Math.floor(Math.random() * 999)}</span>
                            <span className="text-[12px] font-bold text-white/20 uppercase tracking-widest leading-none">BET 1,000 KES</span>
                         </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                         <span className="text-lg font-black text-green-500 italic leading-none">+1,450</span>
                         <span className="text-[10px] font-black text-green-500/30 uppercase">1.45x</span>
                      </div>
                   </motion.div>
                ))}
             </div>
          </div>
        </aside>

        {/* Center: High-Saturation Area */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
           
           {/* Multiplier Narrative Bar: Scaled Pills */}
           <div className="h-20 bg-black/70 rounded-[2.5rem] border border-white/10 flex items-center px-12 gap-4 overflow-x-auto no-scrollbar justify-end shadow-inner">
              <History size={24} className="text-white/20 mr-6" />
              {history.map((val, i) => (
                 <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={i} 
                    className={`px-8 py-3 rounded-full text-[14px] font-black italic tracking-widest border transition-all whitespace-nowrap shadow-xl
                        ${parseFloat(val) < 2 ? 'bg-zinc-900 border-white/10 text-white/40' : 
                          parseFloat(val) >= 10 ? 'bg-amber-400/20 text-amber-500 border-amber-400/50 text-glow-gold' : 
                          'bg-green-500/20 text-green-500 border-green-500/50 text-glow-green'}`}
                 >
                    {val}x
                 </motion.div>
              ))}
           </div>

           {/* Central Stage */}
           <div className="flex-1 relative rounded-[3rem] overflow-hidden shadow-tactile border border-white/5">
              <GameCanvas 
                 multiplier={multiplier} 
                 isCrashed={status === 'CRASHED'}
                 isWaiting={status === 'WAITING'}
                 nextRoundIn={nextRoundIn}
              />
           </div>

           {/* Massive Control Station */}
           <div className="h-[420px]">
              <BettingPanel 
                 gameState={status === 'IN_PROGRESS' || status === 'STARTING' ? 'FLYING' : status === 'CRASHED' ? 'CRASHED' : 'WAITING'} 
                 currentMultiplier={parseFloat(multiplier)} 
              />
           </div>
        </div>

        {/* Right: Scaled Social Core */}
        <aside className="w-[520px] bg-[#0a0a0a] rounded-[3rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
           <div className="p-10 flex items-center justify-between border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-red-700 rounded-[1.5rem] flex items-center justify-center font-black text-3xl shadow-2xl text-white italic">V</div>
                 <div className="flex flex-col gap-1">
                    <span className="text-lg font-black uppercase tracking-[0.2em] text-white">OPERATOR_X</span>
                    <div className="flex items-center gap-3">
                       <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,34,0.6)]" />
                       <span className="text-[12px] font-black text-green-500 uppercase tracking-widest italic">Encrypted Connection</span>
                    </div>
                 </div>
              </div>
              <Users size={28} className="text-white/10" />
           </div>

           <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-black/10 flex flex-col gap-8">
              <div className="mt-auto space-y-8">
                 <div className="flex flex-col items-start gap-3">
                    <div className="bg-[#151515] px-8 py-5 rounded-[2.5rem] rounded-tl-none border border-white/10 text-base text-white/80 max-w-[85%] leading-relaxed shadow-xl">
                       New round starting in 5s! Don't miss the 10x rhythm today. 🌪️
                    </div>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-6">Global Admin • Just Now</span>
                 </div>
                 
                 <div className="flex flex-col items-end gap-3">
                    <div className="bg-red-600/10 px-8 py-5 rounded-[2.5rem] rounded-tr-none border border-red-500/30 text-base text-red-100 max-w-[85%] leading-relaxed shadow-xl border-t-white/10">
                       My projected payout is looking CRAZY! 🤑
                    </div>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mr-6">You • 20:51</span>
                 </div>
              </div>
           </div>

           <div className="p-10 bg-black border-t border-white/10">
              <div className="bg-[#151515] rounded-[2rem] p-5 flex items-center gap-6 border border-white/10 focus-within:border-white/30 transition-all shadow-inner">
                 <input 
                    placeholder="Enter the simulation chat..."
                    className="flex-1 bg-transparent text-lg text-white outline-none placeholder:text-white/10 font-medium"
                 />
                 <button className="bg-red-700 p-4 rounded-[1.5rem] text-white hover:bg-red-600 transition-all shadow-2xl active:scale-90">
                    <Send size={24} />
                 </button>
              </div>
           </div>
        </aside>
      </div>

    </main>
  );
}
