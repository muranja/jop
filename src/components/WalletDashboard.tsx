'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Wallet, Copy, Check, ArrowDownLeft, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  date: string;
}

export default function WalletDashboard({ 
  address = "EQD...mock_address", 
  balance = "0.00" 
}) {
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const mockHistory: Transaction[] = [
    { id: '1', type: 'DEPOSIT', amount: '50.00', status: 'COMPLETED', date: '2026-03-15 14:20' },
    { id: '2', type: 'WITHDRAWAL', amount: '12.50', status: 'PENDING', date: '2026-03-15 15:45' },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-red-500 to-red-700 p-2.5 rounded-2xl shadow-lg shadow-red-500/20">
            <Wallet size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Main Wallet</h2>
            <div className="flex items-center gap-1.5 text-xs text-white/50 uppercase tracking-widest font-semibold">
              <ShieldCheck size={12} className="text-emerald-400" />
              Sovereign TON/USDT
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
            {balance}
          </span>
          <span className="ml-2 text-sm font-bold text-red-500">USDT</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-6">
        <button 
          onClick={() => setShowHistory(false)}
          className={cn(
            "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300",
            !showHistory ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white/60"
          )}
        >
          Deposit
        </button>
        <button 
          onClick={() => setShowHistory(true)}
          className={cn(
            "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300",
            showHistory ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white/60"
          )}
        >
          History
        </button>
      </div>

      {!showHistory ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-inner group transition-transform hover:scale-[1.02]">
            <QRCodeSVG 
              value={address} 
              size={180} 
              includeMargin={false}
              className="transition-opacity group-hover:opacity-90"
            />
            <p className="mt-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">
              Scan to deposit USDT (TON)
            </p>
          </div>

          {/* Address Copy Section */}
          <div className="relative group">
            <button 
              onClick={copyToClipboard}
              className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group overflow-hidden"
            >
              <div className="flex-1 mr-4 overflow-hidden">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1 text-left">
                  Your Deposit Address
                </p>
                <p className="text-sm font-mono truncate text-left text-white/80">
                  {address}
                </p>
              </div>
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-red-500 transition-colors">
                {copied ? <Check size={18} className="text-white" /> : <Copy size={18} className="text-white/60 group-hover:text-white" />}
              </div>
            </button>
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-red-500 text-white px-2 py-1 rounded-md animate-bounce">
                COPIED!
              </span>
            )}
          </div>
          
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-red-200/80 leading-relaxed text-center italic">
              "Send only USDT (TON) to this address. Credits instantly after 1 confirmation."
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
          {mockHistory.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/10">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-xl",
                  tx.type === 'DEPOSIT' ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                )}>
                  {tx.type === 'DEPOSIT' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div>
                  <p className="text-sm font-bold">{tx.type}</p>
                  <p className="text-[10px] text-white/40 font-medium">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-sm font-black",
                  tx.type === 'DEPOSIT' ? "text-emerald-400" : "text-white"
                )}>
                  {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.amount}
                </p>
                <p className={cn(
                  "text-[9px] font-bold uppercase tracking-widest",
                  tx.status === 'COMPLETED' ? "text-emerald-500/60" : "text-yellow-500/60"
                )}>
                  {tx.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
