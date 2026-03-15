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
      
      {/* Mega Header: High Contrast & MASSIVE */}
      <header className="h-32 px-16 flex items-center justify-between border-b border-white/10 bg-black z-50 shadow-2xl">
        <div className="flex items-center gap-24">
           <div className="flex items-center gap-10 group cursor-pointer">
              <div className="bg-red-600 p-5 rounded-[2rem] shadow-[0_0_80px_rgba(255,0,0,0.6)] group-hover:scale-110 transition-transform">
                 <TrendingUp size={48} className="text-white" />
              </div>
              <h1 className="text-7xl font-black italic tracking-tighter uppercase whitespace-nowrap leading-none">
                MAXI<span className="text-white/20">PESA</span>
              </h1>
           </div>
           
           <nav className="hidden 2xl:flex gap-16 items-center text-[18px] font-black uppercase tracking-[0.5em] text-white/30">
              <a href="#" className="text-white border-b-8 border-red-600 pb-4">Aviator</a>
              <a href="#" className="hover:text-white transition-colors">Fairness</a>
              <a href="#" className="hover:text-white transition-colors">Jackpots</a>
           </nav>
        </div>

        <div className="flex items-center gap-14">
           {/* Mega Balance Widget */}
           <div className="bg-[#0a0a0a] px-14 py-7 rounded-[3rem] border border-white/10 flex items-center gap-14 shadow-tactile">
              <div className="flex flex-col">
                 <span className="text-[14px] font-black text-white/20 tracking-widest uppercase mb-2 italic">Global Balance</span>
                 <span className="text-5xl font-black text-white leading-none">12,500.00 KES</span>
              </div>
              <div className="h-16 w-[1px] bg-white/20" />
              <button className="text-[22px] font-black text-red-600 uppercase tracking-[0.2em] hover:text-red-500 transition-all hover:scale-110 active:scale-95 italic">Deposit</button>
           </div>
           
           <div className="bg-[#0a0a0a] p-7 rounded-[2rem] border border-white/10 text-white hover:bg-white/10 cursor-pointer transition-all shadow-lg">
              <Menu size={44} />
           </div>
        </div>
      </header>

      {/* Main Grid: Aggressively Scaled */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* Left: MASSIVE Global Feed */}
        <aside className="w-[580px] bg-[#0a0a0a] rounded-[4rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
          <div className="p-12 flex gap-20 text-[18px] font-black uppercase tracking-[0.4em] border-b border-white/5 bg-black/50">
            <span className="text-white border-b-6 border-red-600 pb-12 -mb-[52px] cursor-pointer">Live Feed</span>
            <span className="text-white/10 hover:text-white/30 cursor-pointer">Big Wins</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-black/20">
             <div className="space-y-4">
                {[...Array(20)].map((_, i) => (
                   <motion.div 
                      key={i} 
                      className="flex items-center justify-between p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all"
                   >
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-white/40"><User size={32} /></div>
                         <div className="flex flex-col gap-1">
                            <span className="text-2xl font-black text-white italic">{['Warrior', 'King', 'Ghost', 'Ace'][i % 4]}_{Math.floor(Math.random() * 999)}</span>
                            <span className="text-[14px] font-bold text-white/20 uppercase tracking-[0.4em] leading-none">BET 1,000 KES</span>
                         </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                         <span className="text-2xl font-black text-green-500 italic leading-none">+1,450</span>
                         <span className="text-[12px] font-black text-green-500/30 uppercase tracking-[0.2em]">1.45x</span>
                      </div>
                   </motion.div>
                ))}
             </div>
          </div>
        </aside>

        {/* Center: Hero Area */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
           
           {/* Narrative Bar: High Saturated Pills */}
           <div className="h-24 bg-black/70 rounded-[3rem] border border-white/10 flex items-center px-16 gap-6 overflow-x-auto no-scrollbar justify-end shadow-inner">
              <History size={32} className="text-white/20 mr-10" />
              {history.map((val, i) => (
                 <motion.div 
                    key={i} 
                    className={`px-10 py-5 rounded-full text-[18px] font-black italic tracking-widest border transition-all whitespace-nowrap shadow-2xl
                        ${parseFloat(val) < 2 ? 'bg-zinc-900 border-white/10 text-white/30' : 
                          parseFloat(val) >= 10 ? 'bg-amber-400/20 text-amber-500 border-amber-400/60 text-glow-gold' : 
                          'bg-green-500/20 text-green-500 border-green-500/60 text-glow-green'}`}
                 >
                    {val}x
                 </motion.div>
              ))}
           </div>

           {/* Hero Stage */}
           <div className="flex-1 relative rounded-[4rem] overflow-hidden shadow-tactile border border-white/5">
              <GameCanvas 
                 multiplier={multiplier} 
                 isCrashed={status === 'CRASHED'}
                 isWaiting={status === 'WAITING'}
                 nextRoundIn={nextRoundIn}
              />
           </div>

           {/* MASSIVE Control Station */}
           <div className="h-[520px]">
              <BettingPanel 
                 gameState={status === 'IN_PROGRESS' || status === 'STARTING' ? 'FLYING' : status === 'CRASHED' ? 'CRASHED' : 'WAITING'} 
                 currentMultiplier={parseFloat(multiplier)} 
              />
           </div>
        </div>

        {/* Right: MASSIVE Social Core */}
        <aside className="w-[620px] bg-[#0a0a0a] rounded-[4rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
           <div className="p-12 flex items-center justify-between border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-8">
                 <div className="w-20 h-20 bg-red-700 rounded-[2rem] flex items-center justify-center font-black text-5xl shadow-2xl text-white italic">V</div>
                 <div className="flex flex-col gap-2">
                    <span className="text-2xl font-black uppercase tracking-[0.2em] text-white">SYSTEM_OPS</span>
                    <div className="flex items-center gap-4">
                       <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(0,255,34,0.8)]" />
                       <span className="text-[14px] font-black text-green-500 uppercase tracking-widest italic leading-none">Quantum Connection Active</span>
                    </div>
                 </div>
              </div>
              <Users size={36} className="text-white/10" />
           </div>

           <div className="flex-1 overflow-y-auto custom-scrollbar p-12 bg-black/10 flex flex-col gap-12">
              <div className="mt-auto space-y-12">
                 <div className="flex flex-col items-start gap-4">
                    <div className="bg-[#151515] px-10 py-7 rounded-[3rem] rounded-tl-none border border-white/10 text-xl text-white/80 max-w-[90%] leading-relaxed shadow-xl">
                       New round starting in 5s! Don't miss the 10x rhythm. 🌪️
                    </div>
                    <span className="text-[12px] font-black text-white/20 uppercase tracking-[0.5em] ml-10 italic">Global Admin • Just Now</span>
                 </div>
                 
                 <div className="flex flex-col items-end gap-4">
                    <div className="bg-red-600/10 px-10 py-7 rounded-[3rem] rounded-tr-none border border-red-500/30 text-xl text-red-100 max-w-[90%] leading-relaxed shadow-xl border-t-white/10">
                       My projected payout is looking CRAZY! 🤑
                    </div>
                    <span className="text-[12px] font-black text-white/20 uppercase tracking-[0.5em] mr-10 italic">You • 20:51</span>
                 </div>
              </div>
           </div>

           <div className="p-12 bg-black border-t border-white/10">
              <div className="bg-[#151515] rounded-[2.5rem] p-6 flex items-center gap-8 border border-white/10 focus-within:border-white/30 transition-all shadow-inner">
                 <input 
                    placeholder="Enter the simulation chat..."
                    className="flex-1 bg-transparent text-2xl text-white outline-none placeholder:text-white/10 font-medium"
                 />
                 <button className="bg-red-700 p-6 rounded-[2rem] text-white hover:bg-red-600 transition-all shadow-2xl active:scale-90">
                    <Send size={32} />
                 </button>
              </div>
           </div>
        </aside>
      </div>

    </main>
  );
}
