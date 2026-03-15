'use client';

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import GameCanvas from '@/components/GameCanvas';
import WalletDashboard from '@/components/WalletDashboard';
import BettingPanel from '@/components/BettingPanel';
import { Menu, User, MessageCircle, Send, TrendingUp, History, Bell } from 'lucide-react';

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
    <main className="h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col font-sans overflow-hidden">
      
      {/* Ultra-Premium Header */}
      <header className="h-16 px-8 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl z-50">
        <div className="flex items-center gap-12">
           <div className="flex items-center gap-3 group cursor-pointer">
              <div className="bg-red-600 p-2 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] group-hover:scale-110 transition-transform">
                 <TrendingUp size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase whitespace-nowrap">MAXI<span className="text-[#A1A1AA]">PESA</span></h1>
           </div>
           
           <nav className="hidden lg:flex gap-8 items-center text-[10px] font-black uppercase tracking-[0.25em] text-[#A1A1AA]">
              <a href="#" className="text-white border-b-2 border-red-500 pb-1">Aviator</a>
              <a href="#" className="hover:text-white transition-colors">Provably Fair</a>
              <a href="#" className="hover:text-white transition-colors">Jackpots</a>
              <a href="#" className="hover:text-white transition-colors">Free Bets</a>
           </nav>
        </div>

        <div className="flex items-center gap-4">
           {/* Wallet Mini-View */}
           <div className="bg-[#18181B] px-5 py-2.5 rounded-2xl border border-white/5 flex items-center gap-4 shadow-inner">
              <div className="flex flex-col">
                 <span className="text-[9px] font-black text-[#A1A1AA] tracking-widest uppercase">Available</span>
                 <span className="text-xs font-black text-white">0.00 KES</span>
              </div>
              <div className="h-6 w-[1px] bg-white/10" />
              <button className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors">Deposit</button>
           </div>
           
           <div className="flex items-center gap-2">
              <div className="p-2.5 bg-[#18181B] rounded-xl text-[#A1A1AA] hover:text-white cursor-pointer border border-white/5 transition-all"><Bell size={18} /></div>
              <div className="p-2.5 bg-[#18181B] rounded-xl text-[#A1A1AA] hover:text-white cursor-pointer border border-white/5 transition-all"><Menu size={18} /></div>
           </div>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <div className="flex-1 flex overflow-hidden p-1 gap-1">
        
        {/* Left: Global Feed */}
        <aside className="w-[340px] bg-[#18181B] rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
          <div className="p-5 flex gap-10 text-[11px] font-black uppercase tracking-widest border-b border-white/5 bg-black/20">
            <span className="text-white border-b-2 border-red-600 pb-5 -mb-[21px] cursor-pointer">Live Bets</span>
            <span className="text-[#A1A1AA] hover:text-white/40 cursor-pointer">My History</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1 bg-black/10">
             {[...Array(30)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.03] transition-all group">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#A1A1AA] grayscale opacity-40 group-hover:opacity-100 transition-all"><User size={20} /></div>
                      <div>
                         <p className="text-[11px] font-bold text-[#A1A1AA] group-hover:text-white transition-colors">{['Korir', 'Omondi', 'Faith', 'Kiptoo', 'Wanjiku'][i%5]}_***</p>
                         <p className="text-[10px] font-black text-white/20">100 KES</p>
                      </div>
                   </div>
                   <div className="text-right">
                      {i % 4 === 0 ? (
                        <div className="flex flex-col items-end">
                           <span className="text-[11px] font-black text-green-500">+{Math.floor(Math.random() * 5000)}</span>
                           <span className="text-[9px] font-bold text-green-500/30">{(1.5 + Math.random() * 5).toFixed(2)}x</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-white/5 italic">...</span>
                      )}
                   </div>
                </div>
             ))}
          </div>
        </aside>

        {/* Center: Hero Workspace */}
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
           
           {/* Premium History Bar */}
           <div className="h-14 bg-black/40 rounded-xl border border-white/5 flex items-center px-6 gap-3 overflow-x-auto no-scrollbar">
              <div className="p-2.5 bg-white/5 rounded-xl text-[#A1A1AA]"><History size={16} /></div>
              {history.map((val, i) => (
                 <div key={i} className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-[10px] font-black border transition-all hover:scale-110 cursor-default ${parseFloat(val) > 10 ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : parseFloat(val) > 2 ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                    {val}x
                 </div>
              ))}
           </div>

           {/* Canvas Container */}
           <div className="flex-1 relative min-h-0 bg-black rounded-xl overflow-hidden border border-white/5">
              <GameCanvas 
                 multiplier={multiplier} 
                 isCrashed={status === 'CRASHED'}
                 isWaiting={status === 'WAITING'}
                 nextRoundIn={nextRoundIn}
              />
           </div>

           {/* Interactive Betting Area */}
           <div className="h-[280px] flex gap-1">
              <BettingPanel multiplier={parseFloat(multiplier)} isFlying={status === 'IN_PROGRESS'} />
              <BettingPanel multiplier={parseFloat(multiplier)} isFlying={status === 'IN_PROGRESS'} />
           </div>
        </div>

        {/* Right: Social/Chat Sidebar */}
        <aside className="w-[360px] bg-[#18181B] rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
           <div className="p-5 flex items-center justify-between border-b border-white/5 bg-black/20">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center font-black text-lg shadow-xl">D</div>
                 <div className="flex flex-col">
                    <span className="text-[11px] font-black uppercase tracking-widest text-white">DANSCAIZ</span>
                    <div className="flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                       <span className="text-[8px] font-black text-green-500 uppercase tracking-tighter">Live Player</span>
                    </div>
                 </div>
              </div>
              <Users size={16} className="text-white/20" />
           </div>

           <div className="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-5 bg-black/5">
              <div className="mt-auto flex flex-col gap-6">
                 {/* Mock Message */}
                 <div className="flex flex-col items-start gap-1.5 animate-in fade-in slide-in-from-bottom-2">
                    <div className="px-4 py-3 bg-[#27272A] rounded-2xl rounded-tl-none text-xs text-white/80 border border-white/5 shadow-lg max-w-[85%] leading-relaxed">
                       This new update is fire! Multiplier feels much smoother. 🔥
                    </div>
                    <span className="text-[8px] font-bold text-[#A1A1AA] ml-3 uppercase tracking-widest">Wanjiku_254 • 18:50</span>
                 </div>
                 
                 <div className="flex flex-col items-end gap-1.5">
                    <div className="px-4 py-3 bg-red-600/10 rounded-2xl rounded-tr-none text-xs text-red-100 border border-red-500/20 shadow-lg max-w-[85%] leading-relaxed">
                       Projected payout looking good on 4.00x!
                    </div>
                    <span className="text-[8px] font-bold text-[#A1A1AA] mr-3 uppercase tracking-widest">You • 18:52</span>
                 </div>
              </div>
           </div>

           <div className="p-5 bg-black/40 border-t border-white/5">
              <div className="flex items-center gap-3 bg-[#27272A] rounded-2xl px-4 py-1.5 border border-white/10 focus-within:border-white/20 transition-all shadow-inner">
                 <input 
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent py-3 text-xs text-white outline-none placeholder:text-[#A1A1AA]"
                 />
                 <button className="bg-red-600 p-2 rounded-xl text-white hover:bg-red-500 transition-all active:scale-90 shadow-lg">
                    <Send size={16} />
                 </button>
              </div>
           </div>
        </aside>
      </div>

    </main>
  );
}
